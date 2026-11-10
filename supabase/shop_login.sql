-- Revora Shop, part 3: employees log in with their name and a 6-digit PIN, logins last until 6 idle hours (sessions here last 7 days),
-- and no limit on employees. The owner uses their account password (checked by Supabase sign-in), so there's no owner PIN.
-- Run once in the Supabase SQL editor after shop_employees.sql. Safe to run again.

-- 6-digit PINs for employees
create or replace function public.shop_pin6() returns text language sql volatile as $$ select lpad(floor(random() * 1000000)::int::text, 6, '0') $$;
revoke all on function public.shop_pin6() from public, anon, authenticated;

-- no cap on employees (clients never had one)
create or replace function public.shop_add_employee(nm text, em text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; eid uuid; inv text := public.shop_token(24); tp text := public.shop_pin6(); e text := lower(btrim(coalesce(em, '')));
begin
  select id into sid from shops where owner = auth.uid(); if sid is null then return null; end if;
  if e <> '' and e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return jsonb_build_object('error', 'bad'); end if;
  if btrim(coalesce(nm, '')) = '' and e = '' then return jsonb_build_object('error', 'name'); end if;
  insert into shop_employees (shop_id, name, email) values (sid, left(btrim(coalesce(nm, '')), 80), e) returning id into eid;
  insert into shop_emp_secrets (employee_id, temp_pin, invite) values (eid, tp, inv);
  return jsonb_build_object('id', eid, 'invite', inv, 'pin', tp);
end $$;
-- the old staff-account limit goes too
create or replace function public.shop_add_staff(em text) returns text language plpgsql security definer set search_path = public as $$
declare sid uuid; uid uuid; e text := lower(btrim(coalesce(em, '')));
begin
  select id into sid from shops where owner = auth.uid(); if sid is null then return 'denied'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return 'bad'; end if;
  if e = lower(coalesce(auth.jwt() ->> 'email', '')) then return 'self'; end if;
  select id into uid from auth.users where lower(email) = e;
  if uid is not null then insert into shop_staff (shop_id, user_id) values (sid, uid) on conflict do nothing; return 'added'; end if;
  insert into shop_staff_invites (shop_id, email) values (sid, e) on conflict do nothing; return 'invited';
end $$;

create or replace function public.shop_reset_employee(eid uuid) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare inv text := public.shop_token(24); tp text := public.shop_pin6();
begin
  if not exists (select 1 from shop_employees e join shops s on s.id = e.shop_id where e.id = eid and s.owner = auth.uid()) then return null; end if;
  update shop_emp_secrets set pin = null, temp_pin = tp, invite = inv, fails = 0, locked_until = null, invite_sent_at = null where employee_id = eid;
  update shop_employees set status = 'invited', setup_at = null where id = eid;
  delete from shop_emp_devices where employee_id = eid; delete from shop_emp_sessions where employee_id = eid;
  return jsonb_build_object('id', eid, 'invite', inv, 'pin', tp);
end $$;
create or replace function public.emp_setup(tok text, nm text, em text, p text) returns text language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees := public.emp_of(tok); m text := lower(btrim(coalesce(em, '')));
begin
  if coalesce(p, '') !~ '^[0-9]{6}$' then return 'bad'; end if;
  if btrim(coalesce(nm, '')) = '' then return 'name'; end if;
  if m <> '' and m !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return 'email'; end if;
  update shop_employees set name = left(btrim(nm), 80), email = m, status = 'active', setup_at = coalesce(setup_at, now()) where id = e.id;
  update shop_emp_secrets set pin = extensions.crypt(p, extensions.gen_salt('bf')), temp_pin = null, fails = 0 where employee_id = e.id;
  return 'ok';
end $$;

-- sessions last a week on the server; the browser locks after 6 idle hours
create or replace function public.emp_new_session(eid uuid) returns text language plpgsql security definer set search_path = public, extensions as $$
declare t text := public.shop_token(32);
begin
  delete from shop_emp_sessions where expires_at < now();
  insert into shop_emp_sessions (token_hash, employee_id, expires_at) values (public.shop_hash(t), eid, now() + interval '7 days');
  update shop_employees set last_seen = now() where id = eid;
  return t;
end $$;
create or replace function public.emp_of(tok text) returns public.shop_employees language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees; h text := public.shop_hash(coalesce(tok, ''));
begin
  select x.* into e from shop_emp_sessions s join shop_employees x on x.id = s.employee_id where s.token_hash = h and s.expires_at > now() and x.status <> 'removed';
  if e.id is null then raise exception 'locked' using errcode = 'P0001'; end if;
  update shop_emp_sessions set expires_at = now() + interval '7 days' where token_hash = h and expires_at < now() + interval '6 days';
  update shop_employees set last_seen = now() where id = e.id and (last_seen is null or last_seen < now() - interval '5 minutes');
  return e;
end $$;

-- does a typed name match this employee? Full name, first name or email, any capitals
create or replace function public.emp_name_ok(e public.shop_employees, nm text) returns boolean language sql immutable as $$
  select btrim(lower(coalesce(nm, ''))) <> '' and btrim(lower(nm)) in (lower(btrim(e.name)), lower(split_part(btrim(e.name), ' ', 1)), lower(e.email))
$$;
-- on the shop's computer (signed in as the owner): name + PIN
create or replace function public.shop_emp_login(nm text, p text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; n int; eid uuid; r text;
begin
  select id into sid from shops where owner = auth.uid(); if sid is null then return jsonb_build_object('error', 'denied'); end if;
  select count(*), min(e.id::text)::uuid into n, eid from shop_employees e where e.shop_id = sid and e.status <> 'removed' and public.emp_name_ok(e, nm);
  if n = 0 then return jsonb_build_object('error', 'name'); end if;
  if n > 1 then  -- two people with that first name: their full name decides
    select count(*), min(e.id::text)::uuid into n, eid from shop_employees e where e.shop_id = sid and e.status <> 'removed' and lower(btrim(e.name)) = lower(btrim(nm));
    if n <> 1 then return jsonb_build_object('error', 'twins'); end if;
  end if;
  r := public.emp_pin_check(eid, p);
  if r not in ('ok', 'setup') then return jsonb_build_object('error', r); end if;
  return jsonb_build_object('session', public.emp_new_session(eid), 'setup', r = 'setup');
end $$;
-- on an employee's phone: name + PIN, and the name has to be theirs
create or replace function public.emp_unlock_named(dev text, nm text, p text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare e shop_employees; r text;
begin
  select x.* into e from shop_emp_devices d join shop_employees x on x.id = d.employee_id where d.token_hash = public.shop_hash(coalesce(dev, '')) and x.status <> 'removed';
  if e.id is null then return jsonb_build_object('error', 'device'); end if;
  if not public.emp_name_ok(e, nm) then return jsonb_build_object('error', 'name'); end if;
  r := public.emp_pin_check(e.id, p);
  if r not in ('ok', 'setup') then return jsonb_build_object('error', r); end if;
  return jsonb_build_object('session', public.emp_new_session(e.id), 'setup', r = 'setup');
end $$;
-- the employee's phone lock screen no longer shows whose phone it is (they type their name)
create or replace function public.emp_device(dev text) returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare r jsonb;
begin
  select jsonb_build_object('shop', s.name, 'details', s.details, 'address', s.address) into r from shop_emp_devices d join shop_employees e on e.id = d.employee_id join shops s on s.id = e.shop_id
    where d.token_hash = public.shop_hash(coalesce(dev, '')) and e.status <> 'removed';
  if r is not null then update shop_emp_devices set last_seen = now() where token_hash = public.shop_hash(dev); end if;
  return r;
end $$;

drop table if exists public.shop_pin_presets;

do $$ declare f text; begin
  foreach f in array array['shop_emp_login(text,text)'] loop
    execute 'revoke all on function public.' || f || ' from public, anon'; execute 'grant execute on function public.' || f || ' to authenticated';
  end loop;
  foreach f in array array['emp_unlock_named(text,text,text)', 'emp_device(text)'] loop
    execute 'revoke all on function public.' || f || ' from public'; execute 'grant execute on function public.' || f || ' to anon, authenticated';
  end loop;
  execute 'revoke all on function public.emp_name_ok(public.shop_employees,text) from public, anon, authenticated';
end $$;
select 'Revora Shop logins are ready' as done;
