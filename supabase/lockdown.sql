-- Revora: every account except the admin is a regular user who can only change their own things.
-- Run once in the Supabase SQL editor. Safe to run again.

-- the one admin account
create or replace function public.is_admin() returns boolean language sql stable as $$
  select coalesce(lower(auth.jwt() ->> 'email') = 'xavier.j.wilson101@gmail.com', false)
$$;

-- projects: an owner can't hand a project to someone else's account
drop policy if exists "owner edits project" on public.projects;
create policy "owner edits project" on public.projects for update
  using (owner = auth.uid()) with check (owner = auth.uid());

-- sharing: owners add people only through add_member (which checks the email has an account),
-- and the owner row can't be changed or removed
drop policy if exists "owner manages members" on public.project_members;
drop policy if exists "owner changes member roles" on public.project_members;
create policy "owner changes member roles" on public.project_members for update
  using (role <> 'owner' and exists (select 1 from public.projects p where p.id = project_id and p.owner = auth.uid()))
  with check (role in ('editor', 'viewer'));
drop policy if exists "owner removes members" on public.project_members;
create policy "owner removes members" on public.project_members for delete
  using (role <> 'owner' and exists (select 1 from public.projects p where p.id = project_id and p.owner = auth.uid()));

-- bike requests: only through vote_bike, signed in, and nobody else's votes
drop policy if exists "signed in adds requests" on public.bike_requests;
create or replace function public.vote_bike(k text, l text) returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  if char_length(k) > 80 or char_length(l) > 120 then raise exception 'too long'; end if;
  insert into bike_requests (key, label, votes) values (k, l, array[auth.uid()])
  on conflict (key) do update set votes = (select array(select distinct unnest(bike_requests.votes || auth.uid())));
end $$;
drop policy if exists "admin manages requests" on public.bike_requests;
create policy "admin manages requests" on public.bike_requests for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin deletes requests" on public.bike_requests;
create policy "admin deletes requests" on public.bike_requests for delete using (public.is_admin());

-- reminders: the queue the email worker reads (from reminders.sql), only ever emailed to the account's own address
create table if not exists public.reminder_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  email text not null,
  send_on date not null,
  due_on date,
  kind text not null default 'service',
  item_key text not null,
  bike text,
  title text not null,
  body text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists reminder_queue_due on public.reminder_queue (send_on) where sent_at is null;
alter table public.reminder_queue enable row level security;
drop policy if exists "own reminders" on public.reminder_queue;
create policy "own reminders" on public.reminder_queue for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and lower(email) = lower(auth.jwt() ->> 'email') and public.is_member(project_id));

-- feedback: anyone can send, only the admin can read it
drop policy if exists "admin reads feedback" on public.feedback;
create policy "admin reads feedback" on public.feedback for select using (public.is_admin());
grant select on public.feedback to authenticated;

-- profiles: people change their own name and settings, never their plan
revoke update on public.profiles from authenticated, anon;
grant update (display_name, prefs) on public.profiles to authenticated;
