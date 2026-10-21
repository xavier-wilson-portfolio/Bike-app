-- Revora: emails to new sign-ups and an email every two weeks after. Deal emails only go to people on Free. The reminders worker sends them once a day with the shared secret.
-- Nothing goes out until welcome_settings.enabled is true. Run once in the Supabase SQL editor. Safe to run again.
alter table public.profiles add column if not exists email_opt_out boolean not null default false;

create table if not exists public.welcome_settings (id int primary key default 1 check (id = 1), enabled boolean not null default false, since timestamptz not null default now() - interval '14 days');
insert into public.welcome_settings (id) values (1) on conflict (id) do nothing;
alter table public.welcome_settings enable row level security;

create table if not exists public.welcome_log (
  user_id uuid not null references auth.users(id) on delete cascade,
  step int not null check (step >= 1),
  sent_at timestamptz not null default now(),
  primary key (user_id, step)
);
alter table public.welcome_log enable row level security;
alter table public.welcome_log drop constraint if exists welcome_log_step_check;
alter table public.welcome_log add constraint welcome_log_step_check check (step >= 1);
drop policy if exists "admin sees welcome log" on public.welcome_log;
create policy "admin sees welcome log" on public.welcome_log for select using (public.is_admin());

create or replace function public.welcome_secret_ok(sec text) returns boolean language sql stable security definer set search_path = public as $$
  select sec is not null and btrim(sec) = btrim((select secret from billing_secret where id = 1))
$$;
revoke all on function public.welcome_secret_ok(text) from public;

-- who should get which email right now (one email per person per run; the worker sends step 2 right after step 1)
-- 1 thanks (everyone, right away) · 2 deals (Free only, right away) · 3 deals reminder (Free only, day 3)
-- 4 features + socials (everyone, day 7) · 5 check-in (everyone, day 14) · 6+ every 2 weeks after that (everyone)
drop function if exists public.welcome_due(text, boolean);
create or replace function public.welcome_due(sec text, preview boolean default false) returns table (user_id uuid, email text, name text, step int, bikes int, free boolean)
language plpgsql security definer set search_path = public as $$
declare s welcome_settings;
begin
  if not welcome_secret_ok(sec) then raise exception 'denied'; end if;
  select * into s from welcome_settings where id = 1;
  if not s.enabled and not preview then return; end if;
  return query
  with base as (
    select u.id, u.email::text as em, coalesce(nullif(p.display_name, ''), split_part(u.email, '@', 1)) as nm, u.created_at as joined,
      ((coalesce(p.plan, 'free') = 'free' or (p.plan_until is not null and p.plan_until < now())) and not coalesce(p.paid, false) and not coalesce(p.comp, false)) as on_free,
      (select count(*)::int from projects pr where pr.owner = u.id) as nb,
      (select max(w.sent_at) from welcome_log w where w.user_id = u.id) as last_sent,
      (select max(w.step) from welcome_log w where w.user_id = u.id) as last_step
    from auth.users u left join profiles p on p.id = u.id
    where u.email_confirmed_at is not null and u.created_at >= s.since
      and lower(u.email) <> 'xavier.j.wilson101@gmail.com' and not coalesce(p.email_opt_out, false)
  ), nx as (
    select b.*, case when b.last_step is null then 1
                     when b.last_step < 3 and b.on_free then b.last_step + 1
                     when b.last_step < 4 then 4
                     else b.last_step + 1 end as n
    from base b
  )
  select x.id, x.em, x.nm, x.n, x.nb, x.on_free
  from nx x
  where x.joined + case x.n when 1 then interval '15 minutes' when 2 then interval '15 minutes' when 3 then interval '3 days'
                            when 4 then interval '7 days' when 5 then interval '14 days' else interval '14 days' + (x.n - 5) * interval '14 days' end <= now()
    and (x.last_sent is null or x.n = 2 or x.last_sent < now() - interval '44 hours')
  order by x.joined
  limit 300;
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
