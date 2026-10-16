-- Revora: per-person settings (pinned projects, page tips) and the feedback inbox.
-- Run once in the Supabase SQL editor. Safe to run again.

alter table public.profiles add column if not exists prefs jsonb not null default '{}'::jsonb;
grant update (display_name, prefs) on public.profiles to authenticated;

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid references auth.users on delete set null,
  email text check (char_length(email) <= 320),
  kind text check (kind in ('idea', 'problem', 'question', 'praise')),
  rating int check (rating between 1 and 5),
  message text not null check (char_length(message) between 1 and 3000),
  page text check (char_length(page) <= 60),
  bike text check (char_length(bike) <= 120),
  app_build text check (char_length(app_build) <= 40),
  device text check (char_length(device) <= 220)
);
alter table public.feedback enable row level security;
-- anyone can send feedback; signed-in people can only send it as themselves. Nobody can read it from the app.
drop policy if exists "send feedback" on public.feedback;
create policy "send feedback" on public.feedback for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
grant insert on public.feedback to anon, authenticated;
