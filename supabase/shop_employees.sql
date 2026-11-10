-- Revora Shop, part 2: employee profiles with PINs, the master PIN, assignments and more shop details.
-- Employees aren't Revora accounts. The owner adds them; they get a link and a 4-digit PIN, set their own PIN,
-- and log work as themselves on the shop's computer or their own phone. PINs are checked here, never in the browser.
-- Run once in the Supabase SQL editor after shop_crm.sql. Safe to run again.
create extension if not exists pgcrypto with schema extensions;

-- ---------- more shop details (address parts, website, hours, labor rate, tax, services...) ----------
alter table public.shops add column if not exists details jsonb not null default '{}'::jsonb;
do $$ begin alter table public.shops add constraint shops_details_size check (pg_column_size(details) < 20000); exception when duplicate_object then null; end $$;
grant update (details) on public.shops to authenticated;

-- ---------- secrets: no one reads these tables directly ----------
create table if not exists public.shop_secrets (
  shop_id uuid primary key references public.shops(id) on delete cascade,
  master_pin text, fails int not null default 0, locked_until timestamptz
);
alter table public.shop_secrets enable row level security;
revoke all on public.shop_secrets from anon, authenticated;

create table if not exists public.shop_employees (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 80),
  email text not null default '' check (char_length(email) <= 200),
  status text not null default 'invited' check (status in ('invited', 'active', 'removed')),
  created_at timestamptz not null default now(),
  setup_at timestamptz,
  last_seen timestamptz
);
create index if not exists shop_employees_shop on public.shop_employees (shop_id);
alter table public.shop_employees enable row level security;
drop policy if exists "owner sees employees" on public.shop_employees;
create policy "owner sees employees" on public.shop_employees for select using (public.shop_role(shop_id) = 'owner');
revoke insert, update, delete on public.shop_employees from anon, authenticated;

create table if not exists public.shop_emp_secrets (
  employee_id uuid primary key references public.shop_employees(id) on delete cascade,
  pin text, temp_pin text, invite text unique, fails int not null default 0, locked_until timestamptz, invite_sent_at timestamptz
);
alter table public.shop_emp_secrets enable row level security;
revoke all on public.shop_emp_secrets from anon, authenticated;

create table if not exists public.shop_emp_devices (
  token_hash text primary key, employee_id uuid not null references public.shop_employees(id) on delete cascade,
  created_at timestamptz not null default now(), last_seen timestamptz not null default now()
);
alter table public.shop_emp_devices enable row level security;
revoke all on public.shop_emp_devices from anon, authenticated;

create table if not exists public.shop_emp_sessions (
  token_hash text primary key, employee_id uuid not null references public.shop_employees(id) on delete cascade,
  expires_at timestamptz not null
);
alter table public.shop_emp_sessions enable row level security;
revoke all on public.shop_emp_sessions from anon, authenticated;

-- who has who: a whole client, or one of their bikes
create table if not exists public.shop_assignments (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  employee_id uuid not null references public.shop_employees(id) on delete cascade,
  client_id uuid not null references public.shop_clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  created_at timestamptz not null default now()
);
create unique index if not exists shop_assignments_one on public.shop_assignments (employee_id, client_id, coalesce(project_id, '00000000-0000-0000-0000-000000000000'::uuid));
alter table public.shop_assignments enable row level security;
drop policy if exists "owner handles assignments" on public.shop_assignments;
create policy "owner handles assignments" on public.shop_assignments for all using (public.shop_role(shop_id) = 'owner')
  with check (public.shop_role(shop_id) = 'owner'
    and exists (select 1 from shop_employees e where e.id = employee_id and e.shop_id = shop_assignments.shop_id)
    and exists (select 1 from shop_clients c where c.id = client_id and c.shop_id = shop_assignments.shop_id));

-- ---------- helpers ----------
create or replace function public.shop_hash(t text) returns text language sql immutable set search_path = public, extensions as $$
  select encode(extensions.digest(t, 'sha256'), 'hex')
$$;
create or replace function public.shop_pin4() returns text language sql volatile as $$ select lpad(floor(random() * 10000)::int::text, 4, '0') $$;
-- the employee behind a session token (and it keeps the session alive for 12 more hours)
create or replace function public.emp_of(tok text) returns public.shop_employees language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees; h text := public.shop_hash(coalesce(tok, ''));
begin
  select x.* into e from shop_emp_sessions s join shop_employees x on x.id = s.employee_id where s.token_hash = h and s.expires_at > now() and x.status <> 'removed';
  if e.id is null then raise exception 'locked' using errcode = 'P0001'; end if;
  update shop_emp_sessions set expires_at = now() + interval '12 hours' where token_hash = h;
  update shop_employees set last_seen = now() where id = e.id and (last_seen is null or last_seen < now() - interval '5 minutes');
  return e;
end $$;
-- check a PIN for an employee, counting wrong tries (5 wrong = locked for 10 minutes)
create or replace function public.emp_pin_check(eid uuid, p text) returns text language plpgsql security definer set search_path = public, extensions as $$
declare s shop_emp_secrets;
begin
  select * into s from shop_emp_secrets where employee_id = eid;
  if s.employee_id is null then return 'wrong'; end if;
  if s.locked_until > now() then return 'locked'; end if;
  if s.pin is not null and s.pin = extensions.crypt(coalesce(p, ''), s.pin) then update shop_emp_secrets set fails = 0 where employee_id = eid; return 'ok'; end if;
  if s.pin is null and s.temp_pin is not null and s.temp_pin = coalesce(p, '') then update shop_emp_secrets set fails = 0 where employee_id = eid; return 'setup'; end if;
  update shop_emp_secrets set fails = case when fails + 1 >= 5 then 0 else fails + 1 end, locked_until = case when fails + 1 >= 5 then now() + interval '10 minutes' else locked_until end where employee_id = eid;
  return 'wrong';
end $$;
create or replace function public.emp_new_session(eid uuid) returns text language plpgsql security definer set search_path = public, extensions as $$
declare t text := public.shop_token(32);
begin
  delete from shop_emp_sessions where expires_at < now();
  insert into shop_emp_sessions (token_hash, employee_id, expires_at) values (public.shop_hash(t), eid, now() + interval '12 hours');
  update shop_employees set last_seen = now() where id = eid;
  return t;
end $$;

-- ---------- the owner: master PIN ----------
create or replace function public.shop_set_master_pin(old text, p text) returns text language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; cur text;
begin
  select id into sid from shops where owner = auth.uid(); if sid is null then return 'denied'; end if;
  if coalesce(p, '') !~ '^[0-9]{4}$' then return 'bad'; end if;
  select master_pin into cur from shop_secrets where shop_id = sid;
  if cur is not null and cur <> extensions.crypt(coalesce(old, ''), cur) then return 'wrong'; end if;
  insert into shop_secrets (shop_id, master_pin) values (sid, extensions.crypt(p, extensions.gen_salt('bf')))
    on conflict (shop_id) do update set master_pin = excluded.master_pin, fails = 0, locked_until = null;
  return 'ok';
end $$;
create or replace function public.shop_master_unlock(p text) returns text language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; s shop_secrets;
begin
  select id into sid from shops where owner = auth.uid(); if sid is null then return 'denied'; end if;
  select * into s from shop_secrets where shop_id = sid;
  if s.master_pin is null then return 'nopin'; end if;
  if s.locked_until > now() then return 'locked'; end if;
  if s.master_pin = extensions.crypt(coalesce(p, ''), s.master_pin) then update shop_secrets set fails = 0 where shop_id = sid; return 'ok'; end if;
  update shop_secrets set fails = case when fails + 1 >= 5 then 0 else fails + 1 end, locked_until = case when fails + 1 >= 5 then now() + interval '10 minutes' else locked_until end where shop_id = sid;
  return 'wrong';
end $$;
create or replace function public.shop_has_master_pin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from shop_secrets x join shops s on s.id = x.shop_id where s.owner = auth.uid() and x.master_pin is not null)
$$;

-- ---------- the owner: employees ----------
create or replace function public.shop_add_employee(nm text, em text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; eid uuid; inv text := public.shop_token(24); tp text := public.shop_pin4(); e text := lower(btrim(coalesce(em, '')));
begin
  select id into sid from shops where owner = auth.uid(); if sid is null then return null; end if;
  if e <> '' and e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return jsonb_build_object('error', 'bad'); end if;
  if (select count(*) from shop_employees where shop_id = sid and status <> 'removed') >= 25 then return jsonb_build_object('error', 'full'); end if;
  insert into shop_employees (shop_id, name, email) values (sid, left(btrim(coalesce(nm, '')), 80), e) returning id into eid;
  insert into shop_emp_secrets (employee_id, temp_pin, invite) values (eid, tp, inv);
  return jsonb_build_object('id', eid, 'invite', inv, 'pin', tp);
end $$;
-- a new link and starting PIN (their own PIN and any signed-in phones stop working)
create or replace function public.shop_reset_employee(eid uuid) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare inv text := public.shop_token(24); tp text := public.shop_pin4();
begin
  if not exists (select 1 from shop_employees e join shops s on s.id = e.shop_id where e.id = eid and s.owner = auth.uid()) then return null; end if;
  update shop_emp_secrets set pin = null, temp_pin = tp, invite = inv, fails = 0, locked_until = null, invite_sent_at = null where employee_id = eid;
  update shop_employees set status = 'invited', setup_at = null where id = eid;
  delete from shop_emp_devices where employee_id = eid; delete from shop_emp_sessions where employee_id = eid;
  return jsonb_build_object('id', eid, 'invite', inv, 'pin', tp);
end $$;
create or replace function public.shop_remove_employee(eid uuid) returns text language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from shop_employees e join shops s on s.id = e.shop_id where e.id = eid and s.owner = auth.uid()) then return 'denied'; end if;
  update shop_employees set status = 'removed' where id = eid;
  update shop_emp_secrets set pin = null, temp_pin = null, invite = null where employee_id = eid;
  delete from shop_emp_devices where employee_id = eid; delete from shop_emp_sessions where employee_id = eid;
  delete from shop_assignments where employee_id = eid;
  return 'ok';
end $$;
create or replace function public.shop_rename_employee(eid uuid, nm text) returns text language plpgsql security definer set search_path = public as $$
begin
  update shop_employees e set name = left(btrim(coalesce(nm, '')), 80) from shops s where s.id = e.shop_id and e.id = eid and s.owner = auth.uid();
  return case when found then 'ok' else 'denied' end;
end $$;
-- on the owner's computer: an employee taps their name and types their PIN
create or replace function public.shop_owner_emp_unlock(eid uuid, p text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r text;
begin
  if not exists (select 1 from shop_employees e join shops s on s.id = e.shop_id where e.id = eid and s.owner = auth.uid() and e.status <> 'removed') then return jsonb_build_object('error', 'denied'); end if;
  r := public.emp_pin_check(eid, p);
  if r not in ('ok', 'setup') then return jsonb_build_object('error', r); end if;
  return jsonb_build_object('session', public.emp_new_session(eid), 'setup', r = 'setup');
end $$;

-- ---------- employees on their own phone ----------
-- opening the link: the starting PIN (or their own PIN, on a new phone) signs this device in as them
create or replace function public.emp_claim(inv text, p text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare eid uuid; r text; dev text := public.shop_token(40);
begin
  if coalesce(inv, '') !~ '^[A-Za-z0-9]{20,40}$' then return jsonb_build_object('error', 'link'); end if;
  select x.employee_id into eid from shop_emp_secrets x join shop_employees e on e.id = x.employee_id where x.invite = inv and e.status <> 'removed';
  if eid is null then return jsonb_build_object('error', 'link'); end if;
  r := public.emp_pin_check(eid, p);
  if r not in ('ok', 'setup') then return jsonb_build_object('error', r); end if;
  insert into shop_emp_devices (token_hash, employee_id) values (public.shop_hash(dev), eid);
  return jsonb_build_object('device', dev, 'session', public.emp_new_session(eid), 'setup', r = 'setup');
end $$;
-- the link page before the PIN: which shop it's for
create or replace function public.emp_invite_info(inv text) returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('shop', s.name, 'name', e.name, 'setup', x.pin is null) from shop_emp_secrets x join shop_employees e on e.id = x.employee_id join shops s on s.id = e.shop_id
  where x.invite = inv and e.status <> 'removed' and coalesce(inv, '') ~ '^[A-Za-z0-9]{20,40}$'
$$;
-- the phone's lock screen
create or replace function public.emp_device(dev text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r jsonb;
begin
  select jsonb_build_object('shop', s.name, 'name', e.name, 'id', e.id) into r from shop_emp_devices d join shop_employees e on e.id = d.employee_id join shops s on s.id = e.shop_id
    where d.token_hash = public.shop_hash(coalesce(dev, '')) and e.status <> 'removed';
  if r is not null then update shop_emp_devices set last_seen = now() where token_hash = public.shop_hash(dev); end if;
  return r;
end $$;
create or replace function public.emp_unlock(dev text, p text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare eid uuid; r text;
begin
  select d.employee_id into eid from shop_emp_devices d join shop_employees e on e.id = d.employee_id where d.token_hash = public.shop_hash(coalesce(dev, '')) and e.status <> 'removed';
  if eid is null then return jsonb_build_object('error', 'device'); end if;
  r := public.emp_pin_check(eid, p);
  if r not in ('ok', 'setup') then return jsonb_build_object('error', r); end if;
  return jsonb_build_object('session', public.emp_new_session(eid), 'setup', r = 'setup');
end $$;
create or replace function public.emp_forget_device(dev text) returns text language sql security definer set search_path = public, extensions as $$
  delete from shop_emp_devices where token_hash = public.shop_hash(coalesce(dev, '')) returning 'ok'
$$;
-- first time: their name, their email, their own PIN
create or replace function public.emp_setup(tok text, nm text, em text, p text) returns text language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok); m text := lower(btrim(coalesce(em, '')));
begin
  if coalesce(p, '') !~ '^[0-9]{4}$' then return 'bad'; end if;
  if btrim(coalesce(nm, '')) = '' then return 'name'; end if;
  if m <> '' and m !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return 'email'; end if;
  update shop_employees set name = left(btrim(nm), 80), email = m, status = 'active', setup_at = coalesce(setup_at, now()) where id = e.id;
  update shop_emp_secrets set pin = extensions.crypt(p, extensions.gen_salt('bf')), temp_pin = null, fails = 0 where employee_id = e.id;
  return 'ok';
end $$;
create or replace function public.emp_lock(tok text) returns text language sql security definer set search_path = public, extensions as $$
  delete from shop_emp_sessions where token_hash = public.shop_hash(coalesce(tok, '')) returning 'ok'
$$;

-- ---------- what an employee can see and do ----------
create or replace function public.emp_ctx(tok text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  if e.status = 'invited' then return jsonb_build_object('setup', true, 'employee', jsonb_build_object('id', e.id, 'name', e.name, 'email', e.email)); end if;
  return (select jsonb_build_object('employee', jsonb_build_object('id', e.id, 'name', e.name, 'email', e.email),
    'shop', jsonb_build_object('id', s.id, 'name', s.name, 'phone', s.phone, 'email', s.email, 'address', s.address, 'details', s.details), 'plan_ok', public.shop_plan_ok(s.id)) from shops s where s.id = e.shop_id);
end $$;
-- bikes assigned to them (by client or by bike) and bikes they've logged work on
create or replace function public.emp_home(tok text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  if e.status <> 'active' then return null; end if;
  return jsonb_build_object(
    'bikes', coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'name', p.name, 'client_id', c.id, 'client', c.name, 'phone', c.phone,
        'assigned', exists (select 1 from shop_assignments a where a.employee_id = e.id and a.client_id = c.id and (a.project_id is null or a.project_id = p.id)),
        'last', (select max(r.data->>'date') from records r where r.project_id = p.id and r.coll = 'maintenance' and r.data->'byEmp'->>'id' = e.id::text)) order by c.name)
      from projects p join shop_clients c on c.id = p.shop_client
      where p.shop_id = e.shop_id and (exists (select 1 from shop_assignments a where a.employee_id = e.id and a.client_id = c.id and (a.project_id is null or a.project_id = p.id))
        or exists (select 1 from records r where r.project_id = p.id and r.coll = 'maintenance' and r.data->'byEmp'->>'id' = e.id::text))), '[]'::jsonb),
    'recent', coalesce((select jsonb_agg(x order by x->>'date' desc) from (select jsonb_build_object('pid', p.id, 'bike', p.name, 'client', c.name, 'client_id', c.id, 'date', r.data->>'date', 'service', r.data->>'service', 'id', r.rec_id) x
      from records r join projects p on p.id = r.project_id join shop_clients c on c.id = p.shop_client
      where p.shop_id = e.shop_id and r.coll = 'maintenance' and r.data->'byEmp'->>'id' = e.id::text order by r.data->>'date' desc limit 25) q), '[]'::jsonb));
end $$;
create or replace function public.emp_search(tok text, q text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok); t text := lower(btrim(coalesce(q, ''))); d text := regexp_replace(coalesce(q, ''), '\D', '', 'g');
begin
  if e.status <> 'active' or char_length(t) < 2 then return '[]'::jsonb; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'phone', c.phone,
      'bikes', coalesce((select jsonb_agg(p.name order by p.created_at) from projects p where p.shop_client = c.id and p.shop_id = e.shop_id), '[]'::jsonb)) order by c.name)
    from (select * from shop_clients c where c.shop_id = e.shop_id and (lower(c.name) like '%' || t || '%' or lower(c.code) = t or (char_length(d) >= 3 and regexp_replace(c.phone, '\D', '', 'g') like '%' || d || '%')
      or exists (select 1 from projects p where p.shop_client = c.id and lower(p.name) like '%' || t || '%')) order by c.name limit 15) c), '[]'::jsonb);
end $$;
-- one client, for logging work: their bikes, schedule, mileage and service history (no prices, no budgets)
create or replace function public.emp_client(tok text, cid uuid) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok);
begin
  if e.status <> 'active' then return null; end if;
  return (select jsonb_build_object('id', c.id, 'name', c.name, 'phone', c.phone, 'email', c.email, 'notes', c.notes,
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
-- logging: service records and odometer readings, stamped with who did it. They can only change their own service records.
create or replace function public.emp_put(tok text, pid uuid, k text, rid text, d jsonb) returns text language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok); old jsonb;
begin
  if e.status <> 'active' then return 'setup'; end if;
  if k not in ('maintenance', 'mileage') or coalesce(rid, '') !~ '^[A-Z]+-U?[0-9]{1,6}$' or d is null or pg_column_size(d) > 20000 then return 'bad'; end if;
  if not exists (select 1 from projects where id = pid and shop_id = e.shop_id) then return 'denied'; end if;
  if not public.shop_plan_ok(e.shop_id) then return 'plan'; end if;
  select data into old from records where project_id = pid and coll = k and rec_id = rid;
  if old is not null and coalesce(old->'byEmp'->>'id', '') <> e.id::text then return 'notyours'; end if;
  insert into records (project_id, coll, rec_id, data, updated_at, updated_by)
    values (pid, k, rid, coalesce(old, '{}'::jsonb) || (d - 'byEmp' - 'byOwner') || jsonb_build_object('id', rid, 'byEmp', jsonb_build_object('id', e.id, 'name', e.name), 'updatedBy', e.name, 'updatedAt', now(), 'doneBy', 'A shop'), now(), null)
    on conflict (project_id, coll, rec_id) do update set data = excluded.data, updated_at = now();
  return 'ok';
end $$;
create or replace function public.emp_new_client(tok text, nm text, ph text, em text, nt text, rem boolean) returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok); cid uuid;
begin
  if e.status <> 'active' or btrim(coalesce(nm, '')) = '' then return null; end if;
  if not public.shop_plan_ok(e.shop_id) then return null; end if;
  insert into shop_clients (shop_id, name, phone, email, notes, remind_ok, remind_ok_at)
    values (e.shop_id, left(btrim(nm), 120), left(btrim(coalesce(ph, '')), 40), left(btrim(coalesce(em, '')), 200), left(coalesce(nt, ''), 2000), coalesce(rem, false) and btrim(coalesce(em, '')) <> '', case when rem then now() end)
    returning id into cid;
  return cid;
end $$;
-- a new bike for a client, with its starting records (bike details, schedule, first odometer reading)
create or replace function public.emp_new_bike(tok text, cid uuid, nm text, recs jsonb) returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok); own uuid; pid uuid; r jsonb;
begin
  if e.status <> 'active' or jsonb_typeof(recs) <> 'array' or jsonb_array_length(recs) > 60 or pg_column_size(recs) > 100000 then return null; end if;
  if not exists (select 1 from shop_clients where id = cid and shop_id = e.shop_id) or not public.shop_plan_ok(e.shop_id) then return null; end if;
  select owner into own from shops where id = e.shop_id;
  insert into projects (owner, bike_id, name, shop_id, shop_client) values (own, 'custom-bike', left(btrim(coalesce(nm, '')), 80), e.shop_id, cid) returning id into pid;
  for r in select * from jsonb_array_elements(recs) loop
    if r->>'coll' in ('meta', 'schedule', 'mileage') and coalesce(r->>'rec_id', '') ~ '^[A-Za-z0-9-]{1,20}$' then
      insert into records (project_id, coll, rec_id, data) values (pid, r->>'coll', r->>'rec_id', r->'data') on conflict do nothing;
    end if;
  end loop;
  return pid;
end $$;
-- keep a bike's reminder emails in step after an employee logs work
create or replace function public.emp_sync_reminders(tok text, pid uuid, rows jsonb) returns text language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok); cid uuid; r jsonb;
begin
  select shop_client into cid from projects where id = pid and shop_id = e.shop_id;
  if cid is null or jsonb_typeof(rows) <> 'array' or jsonb_array_length(rows) > 40 then return 'bad'; end if;
  delete from shop_reminders where project_id = pid and sent_at is null;
  for r in select * from jsonb_array_elements(rows) loop
    if not exists (select 1 from shop_reminders where project_id = pid and item_key = r->>'item_key' and due_on is not distinct from (r->>'due_on')::date and sent_at is not null) then
      insert into shop_reminders (shop_id, client_id, project_id, item_key, kind, bike, title, body, send_on, due_on)
        values (e.shop_id, cid, pid, left(r->>'item_key', 60), 'service', left(r->>'bike', 120), left(r->>'title', 200), left(r->>'body', 600), (r->>'send_on')::date, (r->>'due_on')::date);
    end if;
  end loop;
  return 'ok';
end $$;

-- ---------- invite emails (sent by the reminders worker) ----------
create or replace function public.shop_invite_outbox(sec text, eid uuid) returns table (email text, name text, shop text, invite text, pin text) language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  return query update shop_emp_secrets x set invite_sent_at = now() from shop_employees e join shops s on s.id = e.shop_id
    where x.employee_id = eid and e.id = eid and x.temp_pin is not null and x.invite is not null and e.email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
      and (x.invite_sent_at is null or x.invite_sent_at < now() - interval '2 minutes')
    returning e.email, e.name, s.name, x.invite, x.temp_pin;
end $$;

-- ---------- who may call what ----------
do $$ declare f text; begin
  foreach f in array array['shop_hash(text)', 'shop_pin4()', 'emp_of(text)', 'emp_pin_check(uuid,text)', 'emp_new_session(uuid)'] loop
    execute 'revoke all on function public.' || f || ' from public, anon, authenticated';
  end loop;
  foreach f in array array['shop_set_master_pin(text,text)', 'shop_master_unlock(text)', 'shop_has_master_pin()', 'shop_add_employee(text,text)', 'shop_reset_employee(uuid)',
    'shop_remove_employee(uuid)', 'shop_rename_employee(uuid,text)', 'shop_owner_emp_unlock(uuid,text)'] loop
    execute 'revoke all on function public.' || f || ' from public, anon'; execute 'grant execute on function public.' || f || ' to authenticated';
  end loop;
  foreach f in array array['emp_claim(text,text)', 'emp_invite_info(text)', 'emp_device(text)', 'emp_unlock(text,text)', 'emp_forget_device(text)', 'emp_setup(text,text,text,text)', 'emp_lock(text)',
    'emp_ctx(text)', 'emp_home(text)', 'emp_search(text,text)', 'emp_client(text,uuid)', 'emp_put(text,uuid,text,text,jsonb)', 'emp_new_client(text,text,text,text,text,boolean)',
    'emp_new_bike(text,uuid,text,jsonb)', 'emp_sync_reminders(text,uuid,jsonb)', 'shop_invite_outbox(text,uuid)'] loop
    execute 'revoke all on function public.' || f || ' from public'; execute 'grant execute on function public.' || f || ' to anon, authenticated';
  end loop;
end $$;
grant execute on function public.shop_role(uuid) to anon;

select 'Revora Shop employees are ready' as done;

-- the shop for the signed-in owner, now with its details
create or replace function public.my_shop() returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('id', s.id, 'name', s.name, 'phone', s.phone, 'email', s.email, 'address', s.address, 'details', s.details, 'owner', s.owner,
    'role', public.shop_role(s.id), 'plan_ok', public.shop_plan_ok(s.id),
    'owner_name', (select display_name from profiles where id = s.owner))
  from shops s where s.owner = auth.uid() or exists (select 1 from shop_staff t where t.shop_id = s.id and t.user_id = auth.uid())
  order by (s.owner = auth.uid()) desc limit 1
$$;
select 'Shop details are ready' as done;
