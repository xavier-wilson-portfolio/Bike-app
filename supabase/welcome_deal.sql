-- Revora: the welcome deal in the welcome emails (48 hours for members from Oct 23 noon to 3:45 PM ET, 24 hours after that). Run once in the Supabase SQL editor after welcome_emails.sql. Safe to run again.
-- New members (on Free) get: thanks + the deal right after they join, "about 24 hours left" at hour 24 and "about 3 hours left" at hour 45.
-- The old day-3 "launch prices" email is gone. The clock starts when they confirm their email, the same moment the app's countdown uses.
-- People on Free who joined before the deal started get one email (step 103) saying their deal runs until deal_from + 48 hours.
-- Steps: 1 thanks · 2 the deal · 101 24 hours left · 102 3 hours left · 4 features (day 7) · 5 check-in (day 14) · 6+ every 2 weeks.
alter table public.welcome_settings add column if not exists deal_from timestamptz not null default '2026-10-23 16:00:00+00';
-- from short_from on, new members get 24 hours instead of 48: the deal email says 24, then "about 12 hours left" (111) and "3 hours left" (112)
alter table public.welcome_settings add column if not exists short_from timestamptz not null default '2026-10-23 19:45:00+00';

drop function if exists public.welcome_due(text, boolean);
create or replace function public.welcome_due(sec text, preview boolean default false) returns table (user_id uuid, email text, name text, step int, bikes int, free boolean, deal_hours int)
language plpgsql security definer set search_path = public as $$
declare s welcome_settings;
begin
  if not welcome_secret_ok(sec) then raise exception 'denied'; end if;
  select * into s from welcome_settings where id = 1;
  if not s.enabled and not preview then return; end if;
  return query
  with base as (
    select u.id, u.email::text as em, coalesce(nullif(p.display_name, ''), split_part(u.email, '@', 1)) as nm,
      coalesce(u.email_confirmed_at, u.created_at) as joined,
      ((coalesce(p.plan, 'free') = 'free' or (p.plan_until is not null and p.plan_until < now())) and not coalesce(p.paid, false) and not coalesce(p.comp, false)) as on_free,
      (select count(*)::int from projects pr where pr.owner = u.id) as nb,
      (select max(w.sent_at) from welcome_log w where w.user_id = u.id and w.step < 100) as last_sent,
      (select max(w.step) from welcome_log w where w.user_id = u.id and w.step < 100) as last_step,
      exists (select 1 from welcome_log w where w.user_id = u.id and w.step = 101) as sent24,
      exists (select 1 from welcome_log w where w.user_id = u.id and w.step = 102) as sent3,
      exists (select 1 from welcome_log w where w.user_id = u.id and w.step = 111) as sent12s,
      exists (select 1 from welcome_log w where w.user_id = u.id and w.step = 112) as sent3s
    from auth.users u left join profiles p on p.id = u.id
    where u.email_confirmed_at is not null and u.created_at >= s.since
      and lower(u.email) <> 'xavier.j.wilson101@gmail.com' and not coalesce(p.email_opt_out, false)
  ), nx as (
    select b.*, case when b.last_step is null then 1
                     when b.last_step < 2 and b.on_free then 2
                     when b.last_step < 4 then 4
                     else b.last_step + 1 end as n
    from base b
  ), regular as (
    select x.id, x.em, x.nm, x.n, x.nb, x.on_free, x.joined, case when x.joined >= s.short_from then 24 else 48 end as dh
    from nx x
    where x.joined + case x.n when 1 then interval '0 minutes' when 2 then interval '0 minutes'
                              when 4 then interval '7 days' when 5 then interval '14 days' else interval '14 days' + (x.n - 5) * interval '14 days' end <= now()
      and (x.last_sent is null or x.n = 2 or x.last_sent < now() - interval '44 hours')
  ), deal as (
    -- 48-hour members (joined between deal_from and short_from): 24 hours left (101) and 3 hours left (102)
    select b.id, b.em, b.nm, case when now() >= b.joined + interval '45 hours' then 102 else 101 end, b.nb, b.on_free, b.joined, 48
    from base b
    where b.on_free and b.last_step is not null and b.joined >= s.deal_from and b.joined < s.short_from
      and ((now() >= b.joined + interval '24 hours' and now() < b.joined + interval '45 hours' and not b.sent24)
        or (now() >= b.joined + interval '45 hours' and now() < b.joined + interval '48 hours' and not b.sent3))
    union all
    -- 24-hour members (joined from short_from on): about 12 hours left (111) and 3 hours left (112)
    select b.id, b.em, b.nm, case when now() >= b.joined + interval '21 hours' then 112 else 111 end, b.nb, b.on_free, b.joined, 24
    from base b
    where b.on_free and b.last_step is not null and b.joined >= s.short_from
      and ((now() >= b.joined + interval '12 hours' and now() < b.joined + interval '21 hours' and not b.sent12s)
        or (now() >= b.joined + interval '21 hours' and now() < b.joined + interval '24 hours' and not b.sent3s))
  ), older as (
    -- one email (step 103) to people on Free who joined before the deal started: their 48 hours run from deal_from
    select u.id, u.email::text, coalesce(nullif(p.display_name, ''), split_part(u.email, '@', 1)), 103,
      (select count(*)::int from projects pr where pr.owner = u.id), true, coalesce(u.email_confirmed_at, u.created_at), 48
    from auth.users u left join profiles p on p.id = u.id
    where u.email_confirmed_at is not null and coalesce(u.email_confirmed_at, u.created_at) < s.deal_from
      and now() >= s.deal_from and now() < s.deal_from + interval '44 hours'
      and lower(u.email) <> 'xavier.j.wilson101@gmail.com' and not coalesce(p.email_opt_out, false)
      and (coalesce(p.plan, 'free') = 'free' or (p.plan_until is not null and p.plan_until < now())) and not coalesce(p.paid, false) and not coalesce(p.comp, false)
      and not exists (select 1 from welcome_log w where w.user_id = u.id and w.step = 103)
  )
  select r.id, r.em, r.nm, r.n, r.nb, r.on_free, r.dh from (select * from regular union all select * from deal union all select * from older) r
  order by r.joined
  limit 500;
end $$;
revoke all on function public.welcome_due(text, boolean) from public;
grant execute on function public.welcome_due(text, boolean) to anon, authenticated;

select 'Welcome deal emails are ready' as done;
