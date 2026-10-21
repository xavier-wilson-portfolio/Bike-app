-- Revora: emails to new sign-ups. Step 1 says thanks (everyone). Step 2 (day 3) and step 3 (day 8) go only to people
-- still on Free and invite them to try or pick a plan. The reminders worker sends them once a day with the shared secret.
-- Nothing goes out until welcome_settings.enabled is true. Run once in the Supabase SQL editor. Safe to run again.
alter table public.profiles add column if not exists email_opt_out boolean not null default false;

create table if not exists public.welcome_settings (id int primary key default 1 check (id = 1), enabled boolean not null default false, since timestamptz not null default now() - interval '14 days');
insert into public.welcome_settings (id) values (1) on conflict (id) do nothing;
alter table public.welcome_settings enable row level security;

create table if not exists public.welcome_log (
  user_id uuid not null references auth.users(id) on delete cascade,
  step int not null check (step between 1 and 3),
  sent_at timestamptz not null default now(),
  primary key (user_id, step)
);
alter table public.welcome_log enable row level security;
drop policy if exists "admin sees welcome log" on public.welcome_log;
create policy "admin sees welcome log" on public.welcome_log for select using (public.is_admin());

create or replace function public.welcome_secret_ok(sec text) returns boolean language sql stable security definer set search_path = public as $$
  select sec is not null and btrim(sec) = btrim((select secret from billing_secret where id = 1))
$$;
revoke all on function public.welcome_secret_ok(text) from public;

-- who should get which email right now (one step per person per run)
create or replace function public.welcome_due(sec text, preview boolean default false) returns table (user_id uuid, email text, name text, step int, bikes int)
language plpgsql security definer set search_path = public as $$
declare s welcome_settings;
begin
  if not welcome_secret_ok(sec) then raise exception 'denied'; end if;
  select * into s from welcome_settings where id = 1;
  if not s.enabled and not preview then return; end if;
  return query
  with base as (
    select u.id, u.email::text as email, coalesce(nullif(p.display_name, ''), split_part(u.email, '@', 1)) as name, u.created_at,
      (coalesce(p.plan, 'free') = 'free' or (p.plan_until is not null and p.plan_until < now())) as on_free,
      coalesce(p.paid, false) or coalesce(p.comp, false) as covered,
      (select count(*)::int from projects pr where pr.owner = u.id) as bikes,
      (select max(sent_at) from welcome_log w where w.user_id = u.id) as last_sent,
      (select max(w.step) from welcome_log w where w.user_id = u.id) as last_step
    from auth.users u left join profiles p on p.id = u.id
    where u.email_confirmed_at is not null and u.created_at >= s.since
      and lower(u.email) <> 'xavier.j.wilson101@gmail.com' and not coalesce(p.email_opt_out, false)
  )
  select b.id, b.email, b.name,
    case when b.last_step is null then 1 else b.last_step + 1 end, b.bikes
  from base b
  where (b.last_step is null and b.created_at < now() - interval '15 minutes')
     or (b.last_step = 1 and b.on_free and not b.covered and b.created_at < now() - interval '3 days' and b.last_sent < now() - interval '40 hours')
     or (b.last_step = 2 and b.on_free and not b.covered and b.created_at < now() - interval '8 days' and b.last_sent < now() - interval '3 days')
  order by b.created_at
  limit 200;
end $$;

create or replace function public.welcome_mark(sec text, uid uuid, st int) returns text
language plpgsql security definer set search_path = public as $$
begin
  if not welcome_secret_ok(sec) then raise exception 'denied'; end if;
  insert into welcome_log (user_id, step) values (uid, st) on conflict do nothing;
  return 'ok';
end $$;

create or replace function public.welcome_unsub(sec text, uid uuid) returns text
language plpgsql security definer set search_path = public as $$
begin
  if not welcome_secret_ok(sec) then raise exception 'denied'; end if;
  update profiles set email_opt_out = true where id = uid;
  return 'ok';
end $$;

-- the admin switches sending on or off from the People panel
create or replace function public.welcome_switch(turn_on boolean) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'denied'; end if;
  update welcome_settings set enabled = turn_on where id = 1;
  return turn_on;
end $$;
create or replace function public.welcome_state() returns table (enabled boolean, sent int, last_sent timestamptz)
language sql stable security definer set search_path = public as $$
  select s.enabled, (select count(*)::int from welcome_log), (select max(sent_at) from welcome_log) from welcome_settings s where s.id = 1 and public.is_admin()
$$;

revoke all on function public.welcome_due(text, boolean) from public;
revoke all on function public.welcome_mark(text, uuid, int) from public;
revoke all on function public.welcome_unsub(text, uuid) from public;
revoke all on function public.welcome_switch(boolean) from public;
revoke all on function public.welcome_state() from public;
grant execute on function public.welcome_due(text, boolean) to anon, authenticated;
grant execute on function public.welcome_mark(text, uuid, int) to anon, authenticated;
grant execute on function public.welcome_unsub(text, uuid) to anon, authenticated;
grant execute on function public.welcome_switch(boolean) to authenticated;
grant execute on function public.welcome_state() to authenticated;
