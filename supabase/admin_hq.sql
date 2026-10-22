-- Revora: admin dashboard on the garage page. Lets the admin mark feedback as done.
-- Run once in the Supabase SQL editor. Safe to run again.
alter table public.feedback add column if not exists done_at timestamptz;
drop policy if exists "admin updates feedback" on public.feedback;
create policy "admin updates feedback" on public.feedback for update using (public.is_admin()) with check (public.is_admin());
grant update (done_at) on public.feedback to authenticated;
