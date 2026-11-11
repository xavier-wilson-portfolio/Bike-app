-- Revora Shop, part 4: jobs the customer can follow, and phone notifications.
-- A mechanic starts a job (a work order on the bike with a short task list and a ready-by date). The customer sees it live in their
-- Revora app and gets a notification on their phone (or an email) when the bike is checked in and when it's ready.
-- Run once in the Supabase SQL editor after shop_login.sql. Safe to run again.

-- phones and computers that said yes to Revora notifications
create table if not exists public.push_subs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique check (char_length(endpoint) between 10 and 1000),
  p256dh text not null check (char_length(p256dh) < 200),
  auth text not null check (char_length(auth) < 100),
  ua text not null default '' check (char_length(ua) <= 300),
  created_at timestamptz not null default now(),
  last_ok timestamptz
);
create index if not exists push_subs_user on public.push_subs (user_id);
alter table public.push_subs enable row level security;
drop policy if exists push_subs_own on public.push_subs;
create policy push_subs_own on public.push_subs for select using (user_id = auth.uid());

create or replace function public.push_save(ep text, k text, a text, agent text) returns text language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return 'signin'; end if;
  if coalesce(ep, '') !~ '^https://' or coalesce(k, '') = '' or coalesce(a, '') = '' then return 'bad'; end if;
  insert into push_subs (user_id, endpoint, p256dh, auth, ua) values (auth.uid(), ep, k, a, left(coalesce(agent, ''), 300))
    on conflict (endpoint) do update set user_id = auth.uid(), p256dh = excluded.p256dh, auth = excluded.auth, ua = excluded.ua;
  return 'ok';
end $$;
create or replace function public.push_drop(ep text) returns text language sql security definer set search_path = public as $$
  delete from push_subs where endpoint = ep and user_id = auth.uid(); select 'ok'::text;
$$;
revoke all on function public.push_save(text, text, text, text) from public, anon; grant execute on function public.push_save(text, text, text, text) to authenticated;
revoke all on function public.push_drop(text) from public, anon; grant execute on function public.push_drop(text) to authenticated;

-- the key pair notifications are signed with. The worker makes it the first time it needs it; only the worker can read the private half.
create table if not exists public.push_keys (id int primary key default 1 check (id = 1), public_key text not null, private_jwk text not null, created_at timestamptz not null default now());
alter table public.push_keys enable row level security;
create or replace function public.push_key_get(sec text) returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  return (select jsonb_build_object('public', public_key, 'jwk', private_jwk) from push_keys where id = 1);
end $$;
create or replace function public.push_key_set(sec text, pub text, jwk text) returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  insert into push_keys (id, public_key, private_jwk) values (1, pub, jwk) on conflict (id) do nothing;
  return (select jsonb_build_object('public', public_key, 'jwk', private_jwk) from push_keys where id = 1);
end $$;
revoke all on function public.push_key_get(text) from public; grant execute on function public.push_key_get(text) to anon, authenticated;
revoke all on function public.push_key_set(text, text, text) from public; grant execute on function public.push_key_set(text, text, text) to anon, authenticated;

-- one row per job: who to tell, and what they've already been told
create table if not exists public.shop_jobs (
  project_id uuid not null references public.projects(id) on delete cascade,
  wo_id text not null check (wo_id ~ '^WO-U?[0-9]{1,6}$'),
  shop_id uuid not null references public.shops(id) on delete cascade,
  notify boolean not null default true,
  start_sent_at timestamptz,
  ready_sent_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (project_id, wo_id)
);
create index if not exists shop_jobs_shop on public.shop_jobs (shop_id);
alter table public.shop_jobs enable row level security;
drop policy if exists shop_jobs_shop on public.shop_jobs;
create policy shop_jobs_shop on public.shop_jobs for select using (public.shop_role(shop_id) is not null);

-- the owner or staff saved a job: keep its notification row
create or replace function public.job_touch(pid uuid, wid text, ntf boolean) returns text language plpgsql security definer set search_path = public as $$
declare sid uuid;
begin
  select shop_id into sid from projects where id = pid;
  if sid is null or public.shop_role(sid) is null then return 'denied'; end if;
  if coalesce(wid, '') !~ '^WO-U?[0-9]{1,6}$' then return 'bad'; end if;
  insert into shop_jobs (project_id, wo_id, shop_id, notify) values (pid, wid, sid, coalesce(ntf, true))
    on conflict (project_id, wo_id) do update set notify = coalesce(ntf, shop_jobs.notify);
  return 'ok';
end $$;
revoke all on function public.job_touch(uuid, text, boolean) from public, anon; grant execute on function public.job_touch(uuid, text, boolean) to authenticated;

-- employees: start and update jobs. They can change jobs they started, and jobs on clients assigned to them.
create or replace function public.emp_job_save(tok text, pid uuid, wid text, d jsonb, ntf boolean) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok); old jsonb; cid uuid; nid text := wid; mx int; clean jsonb;
begin
  if e.status <> 'active' then return jsonb_build_object('error', 'setup'); end if;
  select shop_client into cid from projects where id = pid and shop_id = e.shop_id;
  if not found then return jsonb_build_object('error', 'denied'); end if;
  if not public.shop_plan_ok(e.shop_id) then return jsonb_build_object('error', 'plan'); end if;
  if d is null or pg_column_size(d) > 20000 then return jsonb_build_object('error', 'bad'); end if;
  if nid is null or nid = '' then
    perform pg_advisory_xact_lock(hashtext(pid::text || 'wo'));
    select coalesce(max((substring(rec_id from '([0-9]+)$'))::int), 0) into mx from records where project_id = pid and coll = 'workorders';
    nid := 'WO-U' || lpad((mx + 1)::text, 4, '0');
  elsif nid !~ '^WO-U?[0-9]{1,6}$' then return jsonb_build_object('error', 'bad');
  else
    select data into old from records where project_id = pid and coll = 'workorders' and rec_id = nid;
    if old is null then return jsonb_build_object('error', 'gone'); end if;
    if coalesce(old->'byEmp'->>'id', '') <> e.id::text and not exists (select 1 from shop_assignments a where a.employee_id = e.id and a.client_id = cid and (a.project_id is null or a.project_id = pid)) then
      return jsonb_build_object('error', 'notyours'); end if;
  end if;
  -- only the job fields; prices and the estimate stay with the owner
  select coalesce(jsonb_object_agg(k, v), '{}'::jsonb) into clean from jsonb_each(d) x(k, v)
    where k in ('title', 'status', 'promised', 'dateIn', 'tasks', 'noteClient', 'complaint', 'odometer', 'readyAt', 'pickedAt', 'job');
  if clean ? 'status' and clean->>'status' not in ('Checked in', 'In progress', 'Waiting for parts', 'Done', 'Picked up') then clean := clean - 'status'; end if;
  insert into records (project_id, coll, rec_id, data, updated_at, updated_by)
    values (pid, 'workorders', nid, coalesce(old, jsonb_build_object('archived', false, 'createdAt', now(), 'lines', '[]'::jsonb, 'byEmp', jsonb_build_object('id', e.id, 'name', e.name)))
      || clean || jsonb_build_object('id', nid, 'updatedBy', e.name, 'updatedAt', now()), now(), null)
    on conflict (project_id, coll, rec_id) do update set data = excluded.data, updated_at = now();
  insert into shop_jobs (project_id, wo_id, shop_id, notify) values (pid, nid, e.shop_id, coalesce(ntf, true))
    on conflict (project_id, wo_id) do update set notify = coalesce(ntf, shop_jobs.notify);
  return jsonb_build_object('id', nid);
end $$;
-- open jobs an employee can see: theirs, and ones on clients assigned to them
create or replace function public.emp_jobs(tok text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  if e.status <> 'active' then return '[]'::jsonb; end if;
  return coalesce((select jsonb_agg(r.data || jsonb_build_object('id', r.rec_id, 'pid', p.id, 'bike', p.name, 'client', c.name, 'client_id', c.id, 'phone', c.phone, 'email', c.email <> '' or c.client_user is not null,
      'app', c.client_user is not null, 'mine', coalesce(r.data->'byEmp'->>'id', '') = e.id::text) - array['lines', 'set', 'invoice', 'approval', 'notes'] order by r.data->>'promised' nulls last)
    from records r join projects p on p.id = r.project_id join shop_clients c on c.id = p.shop_client
    where p.shop_id = e.shop_id and r.coll = 'workorders' and coalesce(r.data->>'status', '') not in ('Picked up', 'Declined') and not coalesce((r.data->>'archived')::boolean, false)
      and (coalesce(r.data->'byEmp'->>'id', '') = e.id::text or exists (select 1 from shop_assignments a where a.employee_id = e.id and a.client_id = c.id and (a.project_id is null or a.project_id = p.id)))), '[]'::jsonb);
end $$;
revoke all on function public.emp_job_save(text, uuid, text, jsonb, boolean) from public; grant execute on function public.emp_job_save(text, uuid, text, jsonb, boolean) to anon, authenticated;
revoke all on function public.emp_jobs(text) from public; grant execute on function public.emp_jobs(text) to anon, authenticated;

-- for the notifications worker: who needs to hear about a job, and how to reach them
create or replace function public.shop_jobs_outbox(sec text, pid uuid, wid text) returns table (project_id uuid, wo_id text, kind text, email text, client text, code text, joined boolean,
  shop text, shop_phone text, shop_email text, bike text, title text, promised text, subs jsonb)
language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  return query
    select j.project_id, j.wo_id,
      case when r.data->>'status' = 'Done' then 'ready' else 'start' end,
      coalesce(nullif(u.email, ''), nullif(c.email, ''))::text, c.name, c.code, c.client_user is not null,
      s.name, s.phone, s.email, coalesce(nullif(m.data->>'bike', ''), p.name), r.data->>'title', r.data->>'promised',
      coalesce((select jsonb_agg(jsonb_build_object('endpoint', ps.endpoint, 'p256dh', ps.p256dh, 'auth', ps.auth)) from push_subs ps where ps.user_id = c.client_user), '[]'::jsonb)
    from shop_jobs j join projects p on p.id = j.project_id join shop_clients c on c.id = p.shop_client join shops s on s.id = j.shop_id
      join records r on r.project_id = j.project_id and r.coll = 'workorders' and r.rec_id = j.wo_id
      left join records m on m.project_id = p.id and m.coll = 'meta' and m.rec_id = 'project'
      left join auth.users u on u.id = c.client_user
    where j.notify and p.shop_id = j.shop_id and (pid is null or (j.project_id = pid and j.wo_id = wid))
      and ((r.data->>'status' = 'Done' and j.ready_sent_at is null and coalesce((r.data->>'updatedAt')::timestamptz, now()) > now() - interval '3 days')
        or (j.start_sent_at is null and j.ready_sent_at is null and coalesce(r.data->>'status', '') in ('Checked in', 'In progress', 'Waiting for parts') and j.created_at > now() - interval '2 days'))
      and public.shop_plan_ok(j.shop_id)
    limit 200;
end $$;
create or replace function public.shop_jobs_mark(sec text, pid uuid, wid text, k text) returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  if k = 'ready' then update shop_jobs set ready_sent_at = now(), start_sent_at = coalesce(start_sent_at, now()) where project_id = pid and wo_id = wid;
  else update shop_jobs set start_sent_at = now() where project_id = pid and wo_id = wid; end if;
  get diagnostics n = row_count; return n;
end $$;
-- a phone that unsubscribed or uninstalled: forget it
create or replace function public.push_gone(sec text, ep text, ok boolean) returns int language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  if ok then update push_subs set last_ok = now() where endpoint = ep; else delete from push_subs where endpoint = ep; end if;
  return 1;
end $$;
revoke all on function public.shop_jobs_outbox(text, uuid, text) from public; grant execute on function public.shop_jobs_outbox(text, uuid, text) to anon, authenticated;
revoke all on function public.shop_jobs_mark(text, uuid, text, text) from public; grant execute on function public.shop_jobs_mark(text, uuid, text, text) to anon, authenticated;
revoke all on function public.push_gone(text, text, boolean) from public; grant execute on function public.push_gone(text, text, boolean) to anon, authenticated;

-- one client for the employee app: now also says whether they're on the Revora app (so the job screen knows how they'll hear)
create or replace function public.emp_client(tok text, cid uuid) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  if e.status <> 'active' then return null; end if;
  return (select jsonb_build_object('id', c.id, 'name', c.name, 'phone', c.phone, 'email', c.email, 'notes', c.notes, 'app', c.client_user is not null,
    'bikes', coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'name', p.name,
        'assigned', exists (select 1 from shop_assignments a where a.employee_id = e.id and a.client_id = c.id and (a.project_id is null or a.project_id = p.id)),
        'meta', (select r.data - array['shopValue', 'sale', 'baseBudget', 'budgetChanges'] from records r where r.project_id = p.id and r.coll = 'meta' and r.rec_id = 'project'),
        'maintenance', coalesce((select jsonb_agg((r.data - array['cost', 'partsCost', 'laborCost']) || jsonb_build_object('id', r.rec_id)) from records r where r.project_id = p.id and r.coll = 'maintenance' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'schedule', coalesce((select jsonb_agg(r.data || jsonb_build_object('id', r.rec_id)) from records r where r.project_id = p.id and r.coll = 'schedule' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'mileage', coalesce((select jsonb_agg(r.data || jsonb_build_object('id', r.rec_id)) from records r where r.project_id = p.id and r.coll = 'mileage' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'workorders', coalesce((select jsonb_agg(jsonb_build_object('id', r.rec_id, 'title', r.data->>'title', 'status', r.data->>'status', 'promised', r.data->>'promised')) from records r where r.project_id = p.id and r.coll = 'workorders' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb)
      ) order by p.created_at) from projects p where p.shop_client = c.id and p.shop_id = e.shop_id), '[]'::jsonb))
    from shop_clients c where c.id = cid and c.shop_id = e.shop_id);
end $$;

-- the customer's app: jobs now carry the task list, the note from the shop and who's working on it
create or replace function public.client_home() returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'client_id', c.id, 'name', c.name, 'remind_ok', c.remind_ok,
    'shop', jsonb_build_object('name', s.name, 'phone', s.phone, 'email', s.email, 'address', s.address),
    'bikes', coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'name', p.name,
        'meta', (select jsonb_build_object('bike', r.data->>'bike', 'year', r.data->>'year', 'make', r.data->>'make', 'model', r.data->>'model', 'style', r.data->>'style', 'silhouette', r.data->>'silhouette', 'color', r.data->>'color')
                 from records r where r.project_id = p.id and r.coll = 'meta' and r.rec_id = 'project'),
        'maintenance', coalesce((select jsonb_agg((r.data - array['cost', 'partsCost', 'laborCost', 'receipt', 'receiptDoc', 'technician', 'notes']) || jsonb_build_object('id', r.rec_id))
                 from records r where r.project_id = p.id and r.coll = 'maintenance' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'schedule', coalesce((select jsonb_agg(jsonb_build_object('id', r.rec_id, 'name', r.data->>'name', 'category', r.data->>'category', 'everyMiles', r.data->'everyMiles', 'everyMonths', r.data->'everyMonths', 'lastDate', r.data->>'lastDate', 'lastMiles', r.data->'lastMiles', 'order', r.data->'order'))
                 from records r where r.project_id = p.id and r.coll = 'schedule' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'mileage', coalesce((select jsonb_agg(jsonb_build_object('date', r.data->>'date', 'miles', r.data->'miles'))
                 from records r where r.project_id = p.id and r.coll = 'mileage' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'workorders', coalesce((select jsonb_agg(jsonb_build_object('id', r.rec_id, 'title', r.data->>'title', 'status', r.data->>'status', 'dateIn', r.data->>'dateIn', 'promised', r.data->>'promised',
                   'tasks', coalesce(r.data->'tasks', '[]'::jsonb), 'noteClient', r.data->>'noteClient', 'updatedAt', r.data->>'updatedAt', 'readyAt', r.data->>'readyAt', 'job', coalesce((r.data->>'job')::boolean, false),
                   'mech', split_part(coalesce(r.data->'byEmp'->>'name', ''), ' ', 1)))
                 from records r where r.project_id = p.id and r.coll = 'workorders' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'mods', coalesce((select jsonb_agg(jsonb_build_object('id', r.rec_id, 'name', r.data->>'name', 'brand', r.data->>'brand', 'status', r.data->>'status', 'date', r.data->>'date', 'category', r.data->>'category'))
                 from records r where r.project_id = p.id and r.coll = 'mods' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb)
      ) order by p.created_at) from projects p where p.shop_client = c.id and p.shop_id = c.shop_id), '[]'::jsonb),
    'requests', coalesce((select jsonb_agg(jsonb_build_object('id', q.id, 'project_id', q.project_id, 'kind', q.kind, 'status', q.status, 'token', q.token, 'created_at', q.created_at, 'decided_at', q.decided_at) order by q.created_at desc)
      from shop_requests q where q.client_id = c.id), '[]'::jsonb)
  ) order by c.joined_at), '[]'::jsonb)
  from shop_clients c join shops s on s.id = c.shop_id where c.client_user = auth.uid()
$$;

select 'done' as status, 'Revora Shop jobs and notifications are ready' as message;
