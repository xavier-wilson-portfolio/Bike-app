-- Revora Shop, part 5: photos on a job, and asking the customer to approve extra work.
-- Both are optional for the mechanic. The customer sees photos on their job card and approves or declines extra work in the app;
-- the shop gets a notification with the answer. Run once in the Supabase SQL editor after shop_jobs.sql. Safe to run again.

-- photos the mechanic takes on a job (a small preview and the full picture, both already shrunk on the phone)
create table if not exists public.shop_job_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  wo_id text not null check (wo_id ~ '^WO-U?[0-9]{1,6}$'),
  shop_id uuid not null references public.shops(id) on delete cascade,
  thumb text not null check (thumb like 'data:image/%' and char_length(thumb) <= 60000),
  img text not null check (img like 'data:image/%' and char_length(img) <= 400000),
  note text not null default '' check (char_length(note) <= 200),
  by_name text not null default '',
  by_emp uuid,
  created_at timestamptz not null default now()
);
create index if not exists shop_job_photos_job on public.shop_job_photos (project_id, wo_id, created_at);
alter table public.shop_job_photos enable row level security;

-- things the customer should hear about, or the shop should: a question (ask) or the customer's answer
create table if not exists public.shop_job_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  wo_id text not null,
  shop_id uuid not null references public.shops(id) on delete cascade,
  kind text not null check (kind in ('ask', 'answer')),
  body jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create index if not exists shop_job_events_open on public.shop_job_events (created_at) where sent_at is null;
alter table public.shop_job_events enable row level security;

-- can this employee work on this job? (they started it, or the client is assigned to them)
create or replace function public.emp_job_ok(e public.shop_employees, pid uuid, wid text) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from projects p join records r on r.project_id = p.id and r.coll = 'workorders' and r.rec_id = wid
    where p.id = pid and p.shop_id = e.shop_id and (coalesce(r.data->'byEmp'->>'id', '') = e.id::text
      or exists (select 1 from shop_assignments a where a.employee_id = e.id and a.client_id = p.shop_client and (a.project_id is null or a.project_id = pid))))
$$;

-- ---------- photos ----------
create or replace function public._job_photo_add(pid uuid, wid text, th text, im text, nt text, who text, eid uuid) returns uuid language plpgsql security definer set search_path = public as $$
declare sid uuid; nid uuid;
begin
  select shop_id into sid from projects where id = pid;
  if not exists (select 1 from records where project_id = pid and coll = 'workorders' and rec_id = wid) then raise exception 'gone'; end if;
  if (select count(*) from shop_job_photos where project_id = pid and wo_id = wid) >= 24 then raise exception 'full'; end if;
  insert into shop_job_photos (project_id, wo_id, shop_id, thumb, img, note, by_name, by_emp) values (pid, wid, sid, th, im, left(coalesce(nt, ''), 200), coalesce(who, ''), eid) returning id into nid;
  update records set data = data || jsonb_build_object('updatedAt', now()), updated_at = now() where project_id = pid and coll = 'workorders' and rec_id = wid;
  return nid;
end $$;
revoke all on function public._job_photo_add(uuid, text, text, text, text, text, uuid) from public, anon, authenticated;
create or replace function public.job_photo_add(pid uuid, wid text, th text, im text, nt text) returns uuid language plpgsql security definer set search_path = public as $$
declare sid uuid;
begin
  select shop_id into sid from projects where id = pid;
  if sid is null or public.shop_role(sid) is null then raise exception 'denied'; end if;
  return public._job_photo_add(pid, wid, th, im, nt, coalesce((select display_name from profiles where id = auth.uid()), ''), null);
end $$;
create or replace function public.emp_job_photo_add(tok text, pid uuid, wid text, th text, im text, nt text) returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  if e.status <> 'active' or not public.emp_job_ok(e, pid, wid) then raise exception 'denied'; end if;
  return public._job_photo_add(pid, wid, th, im, nt, e.name, e.id);
end $$;
-- the previews for a job: the shop, the employee on it, or the customer whose bike it is
create or replace function public._job_photo_list(pid uuid, wid text) returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'thumb', thumb, 'note', note, 'by', split_part(by_name, ' ', 1), 'by_emp', by_emp, 'at', created_at) order by created_at), '[]'::jsonb)
  from shop_job_photos where project_id = pid and wo_id = wid
$$;
revoke all on function public._job_photo_list(uuid, text) from public, anon, authenticated;
create or replace function public.job_photos(pid uuid, wid text) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from projects p left join shop_clients c on c.id = p.shop_client where p.id = pid
    and (public.shop_role(p.shop_id) is not null or (c.client_user is not null and c.client_user = auth.uid()))) then return '[]'::jsonb; end if;
  return public._job_photo_list(pid, wid);
end $$;
create or replace function public.emp_job_photos(tok text, pid uuid, wid text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  if e.status <> 'active' or not exists (select 1 from projects where id = pid and shop_id = e.shop_id) then return '[]'::jsonb; end if;
  return public._job_photo_list(pid, wid);
end $$;
-- one full-size picture
create or replace function public.job_photo(pid uuid, id uuid) returns text language sql stable security definer set search_path = public as $$
  select ph.img from shop_job_photos ph join projects p on p.id = ph.project_id left join shop_clients c on c.id = p.shop_client
  where ph.id = job_photo.id and ph.project_id = pid and (public.shop_role(p.shop_id) is not null or (c.client_user is not null and c.client_user = auth.uid()))
$$;
create or replace function public.emp_job_photo(tok text, pid uuid, id uuid) returns text language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  if e.status <> 'active' then return null; end if;
  return (select ph.img from shop_job_photos ph where ph.id = emp_job_photo.id and ph.project_id = pid and ph.shop_id = e.shop_id);
end $$;
create or replace function public.job_photo_del(id uuid) returns text language plpgsql security definer set search_path = public as $$
begin
  delete from shop_job_photos ph where ph.id = job_photo_del.id and public.shop_role(ph.shop_id) is not null;
  return case when found then 'ok' else 'denied' end;
end $$;
create or replace function public.emp_job_photo_del(tok text, id uuid) returns text language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  delete from shop_job_photos ph where ph.id = emp_job_photo_del.id and ph.shop_id = e.shop_id and ph.by_emp = e.id;
  return case when found then 'ok' else 'denied' end;
end $$;

-- ---------- asking the customer to approve extra work ----------
create or replace function public._job_ask(pid uuid, wid text, t text, price numeric, ph uuid, who text) returns jsonb language plpgsql security definer set search_path = public as $$
declare d jsonb; sid uuid; aid text := 'A' || substr(md5(random()::text), 1, 8); a jsonb;
begin
  if char_length(btrim(coalesce(t, ''))) < 2 then raise exception 'bad'; end if;
  select r.data, p.shop_id into d, sid from records r join projects p on p.id = r.project_id where r.project_id = pid and r.coll = 'workorders' and r.rec_id = wid for update of r;
  if d is null then raise exception 'gone'; end if;
  if jsonb_array_length(coalesce(d->'asks', '[]'::jsonb)) >= 15 then raise exception 'full'; end if;
  if ph is not null and not exists (select 1 from shop_job_photos where id = ph and project_id = pid and wo_id = wid) then ph := null; end if;
  a := jsonb_build_object('id', aid, 't', left(btrim(t), 160), 'price', case when price is null or price <= 0 then null else round(least(price, 100000), 2) end,
    'photo', ph, 'status', 'asked', 'by', split_part(coalesce(who, ''), ' ', 1), 'at', now());
  d := d || jsonb_build_object('asks', coalesce(d->'asks', '[]'::jsonb) || jsonb_build_array(a), 'updatedAt', now());
  update records set data = d, updated_at = now() where project_id = pid and coll = 'workorders' and rec_id = wid;
  insert into shop_job_events (project_id, wo_id, shop_id, kind, body) values (pid, wid, sid, 'ask', a);
  return d;
end $$;
revoke all on function public._job_ask(uuid, text, text, numeric, uuid, text) from public, anon, authenticated;
create or replace function public.job_ask(pid uuid, wid text, t text, price numeric, ph uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare sid uuid;
begin
  select shop_id into sid from projects where id = pid;
  if sid is null or public.shop_role(sid) is null then raise exception 'denied'; end if;
  return public._job_ask(pid, wid, t, price, ph, coalesce((select display_name from profiles where id = auth.uid()), ''));
end $$;
create or replace function public.emp_job_ask(tok text, pid uuid, wid text, t text, price numeric, ph uuid) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  if e.status <> 'active' or not public.emp_job_ok(e, pid, wid) then raise exception 'denied'; end if;
  return public._job_ask(pid, wid, t, price, ph, e.name);
end $$;
-- the customer says yes or no. Yes puts it on the job's work list.
create or replace function public.client_job_answer(pid uuid, wid text, aid text, yes boolean) returns text language plpgsql security definer set search_path = public as $$
declare d jsonb; sid uuid; a jsonb; na jsonb; who text;
begin
  select r.data, p.shop_id, c.name into d, sid, who from records r join projects p on p.id = r.project_id join shop_clients c on c.id = p.shop_client
    where r.project_id = pid and r.coll = 'workorders' and r.rec_id = wid and c.client_user = auth.uid() for update of r;
  if d is null then return 'denied'; end if;
  select x into a from jsonb_array_elements(coalesce(d->'asks', '[]'::jsonb)) x where x->>'id' = aid;
  if a is null then return 'gone'; end if;
  if a->>'status' <> 'asked' then return 'done'; end if;
  select jsonb_agg(case when x->>'id' = aid then x || jsonb_build_object('status', case when yes then 'yes' else 'no' end, 'decidedAt', now()) else x end order by o)
    into na from jsonb_array_elements(d->'asks') with ordinality q(x, o);
  d := d || jsonb_build_object('asks', na, 'updatedAt', now());
  if yes then d := d || jsonb_build_object('tasks', coalesce(d->'tasks', '[]'::jsonb) || jsonb_build_array(jsonb_build_object('t', a->>'t', 'done', false, 'ask', aid))); end if;
  update records set data = d, updated_at = now() where project_id = pid and coll = 'workorders' and rec_id = wid;
  insert into shop_job_events (project_id, wo_id, shop_id, kind, body) values (pid, wid, sid, 'answer', a || jsonb_build_object('status', case when yes then 'yes' else 'no' end, 'client', who));
  return 'ok';
end $$;
revoke all on function public.client_job_answer(uuid, text, text, boolean) from public, anon; grant execute on function public.client_job_answer(uuid, text, text, boolean) to authenticated;

-- ---------- for the notifications worker ----------
-- asks go to the customer; answers go to the shop owner and staff
create or replace function public.shop_job_events_outbox(sec text, pid uuid, wid text) returns table (id uuid, kind text, project_id uuid, wo_id text, email text, client text, code text, joined boolean,
  shop text, shop_phone text, shop_email text, bike text, body jsonb, subs jsonb)
language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  return query
    select ev.id, ev.kind, ev.project_id, ev.wo_id,
      case when ev.kind = 'ask' then coalesce(nullif(u.email, ''), nullif(c.email, ''))::text else null end, c.name, c.code, c.client_user is not null,
      s.name, s.phone, s.email, coalesce(nullif(m.data->>'bike', ''), p.name), ev.body,
      coalesce((select jsonb_agg(jsonb_build_object('endpoint', ps.endpoint, 'p256dh', ps.p256dh, 'auth', ps.auth)) from push_subs ps
        where case when ev.kind = 'ask' then ps.user_id = c.client_user else (ps.user_id = s.owner or ps.user_id in (select st.user_id from shop_staff st where st.shop_id = s.id)) end), '[]'::jsonb)
    from shop_job_events ev join projects p on p.id = ev.project_id join shop_clients c on c.id = p.shop_client join shops s on s.id = ev.shop_id
      left join records m on m.project_id = p.id and m.coll = 'meta' and m.rec_id = 'project'
      left join auth.users u on u.id = c.client_user
    where ev.sent_at is null and ev.created_at > now() - interval '3 days' and (pid is null or (ev.project_id = pid and ev.wo_id = wid)) and public.shop_plan_ok(ev.shop_id)
    order by ev.created_at limit 200;
end $$;
create or replace function public.shop_job_events_mark(sec text, id uuid) returns int language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  update shop_job_events ev set sent_at = now() where ev.id = shop_job_events_mark.id; return 1;
end $$;
revoke all on function public.shop_job_events_outbox(text, uuid, text) from public; grant execute on function public.shop_job_events_outbox(text, uuid, text) to anon, authenticated;
revoke all on function public.shop_job_events_mark(text, uuid) from public; grant execute on function public.shop_job_events_mark(text, uuid) to anon, authenticated;
revoke all on function public.job_photo_add(uuid, text, text, text, text) from public, anon; grant execute on function public.job_photo_add(uuid, text, text, text, text) to authenticated;
revoke all on function public.job_photos(uuid, text) from public, anon; grant execute on function public.job_photos(uuid, text) to authenticated;
revoke all on function public.job_photo(uuid, uuid) from public, anon; grant execute on function public.job_photo(uuid, uuid) to authenticated;
revoke all on function public.job_photo_del(uuid) from public, anon; grant execute on function public.job_photo_del(uuid) to authenticated;
revoke all on function public.job_ask(uuid, text, text, numeric, uuid) from public, anon; grant execute on function public.job_ask(uuid, text, text, numeric, uuid) to authenticated;
revoke all on function public.emp_job_ok(public.shop_employees, uuid, text) from public, anon, authenticated;

-- the customer's app: jobs also carry the questions from the shop and how many photos there are
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
                   'mech', split_part(coalesce(r.data->'byEmp'->>'name', ''), ' ', 1), 'asks', coalesce(r.data->'asks', '[]'::jsonb),
                   'photos', (select count(*) from shop_job_photos ph where ph.project_id = p.id and ph.wo_id = r.rec_id)))
                 from records r where r.project_id = p.id and r.coll = 'workorders' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'mods', coalesce((select jsonb_agg(jsonb_build_object('id', r.rec_id, 'name', r.data->>'name', 'brand', r.data->>'brand', 'status', r.data->>'status', 'date', r.data->>'date', 'category', r.data->>'category'))
                 from records r where r.project_id = p.id and r.coll = 'mods' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb)
      ) order by p.created_at) from projects p where p.shop_client = c.id and p.shop_id = c.shop_id), '[]'::jsonb),
    'requests', coalesce((select jsonb_agg(jsonb_build_object('id', q.id, 'project_id', q.project_id, 'kind', q.kind, 'status', q.status, 'token', q.token, 'created_at', q.created_at, 'decided_at', q.decided_at) order by q.created_at desc)
      from shop_requests q where q.client_id = c.id), '[]'::jsonb)
  ) order by c.joined_at), '[]'::jsonb)
  from shop_clients c join shops s on s.id = c.shop_id where c.client_user = auth.uid()
$$;

select 'done' as status, 'Revora Shop photos and approvals are ready' as message;
