-- Service reminders: the app writes each project's upcoming reminders here; a daily Cloudflare
-- worker (reminders-worker/) emails the ones that are due and marks them sent.
-- Run once in the Supabase SQL editor.
create table if not exists public.reminder_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  email text not null,
  send_on date not null,
  due_on date,
  kind text not null default 'service',       -- service | odometer
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
  using (user_id = auth.uid()) with check (user_id = auth.uid());
