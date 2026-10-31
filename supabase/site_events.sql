-- Revora: sign-up funnel. The site adds a row when someone opens the main page, the demo, the bike search,
-- the sign-up page, sends the sign-up form, or gets a new account. Anyone can add rows, nobody can read them
-- except the admin (through admin_funnel). No names or emails are stored, only a random per-visit id.
-- Run once in the Supabase SQL editor. Safe to run again.
create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  sid text not null check (length(sid) <= 40),
  ev text not null check (length(ev) <= 40),
  detail text check (length(detail) <= 200),
  mobile boolean,
  inapp boolean,
  ref text check (length(ref) <= 200)
);
create index if not exists site_events_at on public.site_events (at);
alter table public.site_events enable row level security;
drop policy if exists "anyone adds events" on public.site_events;
create policy "anyone adds events" on public.site_events for insert to anon, authenticated with check (true);
grant insert on public.site_events to anon, authenticated;

create or replace function public.admin_funnel(days int default 7) returns table (ev text, visits bigint, phones bigint, in_app bigint)
language sql stable security definer set search_path = public as $$
  select e.ev, count(distinct e.sid), count(distinct e.sid) filter (where e.mobile), count(distinct e.sid) filter (where e.inapp)
  from site_events e
  where public.is_admin() and e.at > now() - make_interval(days => greatest(1, least(days, 90)))
  group by e.ev
$$;
revoke all on function public.admin_funnel(int) from public, anon;
grant execute on function public.admin_funnel(int) to authenticated;
