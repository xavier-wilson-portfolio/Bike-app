-- Revora: bike history report share links. A link is a long random token; anyone with it can read
-- that one snapshot through get_report(), and nobody can list other people's reports.
-- Run once in the Supabase SQL editor. Safe to run again.
create table if not exists public.shared_reports (
  id text primary key check (id ~ '^[A-Za-z0-9]{16,40}$'),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text check (char_length(title) <= 160),
  data jsonb not null check (pg_column_size(data) < 2000000),
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shared_reports enable row level security;
drop policy if exists "team sees links" on public.shared_reports;
create policy "team sees links" on public.shared_reports for select using (public.is_member(project_id));
drop policy if exists "editors make links" on public.shared_reports;
create policy "editors make links" on public.shared_reports for insert with check (owner = auth.uid() and public.is_member(project_id, true));
drop policy if exists "owner updates own links" on public.shared_reports;
create policy "owner updates own links" on public.shared_reports for update using (owner = auth.uid()) with check (owner = auth.uid() and public.is_member(project_id, true));
drop policy if exists "owner stops own links" on public.shared_reports;
create policy "owner stops own links" on public.shared_reports for delete using (owner = auth.uid());
revoke update on public.shared_reports from authenticated, anon;
grant update (data, updated_at, title) on public.shared_reports to authenticated;

create or replace function public.get_report(t text) returns jsonb language plpgsql security definer set search_path = public as $$
declare d jsonb;
begin
  update shared_reports set views = views + 1 where id = t returning data into d;
  return d;
end $$;
revoke all on function public.get_report(text) from public;
grant execute on function public.get_report(text) to anon, authenticated;
