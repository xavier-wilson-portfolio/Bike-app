-- Revora: public build pages. One page per bike, under a long random link.
-- Anyone with the link can see that one page through get_build(); nobody can list other people's pages.
-- Run once in the Supabase SQL editor. Safe to run again.
create table if not exists public.shared_builds (
  id text primary key check (id ~ '^[A-Za-z0-9]{16,40}$'),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text check (char_length(title) <= 160),
  data jsonb not null check (pg_column_size(data) < 3000000),
  views int not null default 0,
  likes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shared_builds enable row level security;
drop policy if exists "team sees build page" on public.shared_builds;
create policy "team sees build page" on public.shared_builds for select using (public.is_member(project_id));
drop policy if exists "editors publish build page" on public.shared_builds;
create policy "editors publish build page" on public.shared_builds for insert with check (owner = auth.uid() and public.is_member(project_id, true));
drop policy if exists "owner updates build page" on public.shared_builds;
create policy "owner updates build page" on public.shared_builds for update using (owner = auth.uid()) with check (owner = auth.uid() and public.is_member(project_id, true));
drop policy if exists "owner stops build page" on public.shared_builds;
create policy "owner stops build page" on public.shared_builds for delete using (owner = auth.uid());
revoke update on public.shared_builds from authenticated, anon;
grant update (data, updated_at, title) on public.shared_builds to authenticated;

-- open a page: counts the view and returns the page with its view and like counts
create or replace function public.get_build(t text) returns jsonb language plpgsql security definer set search_path = public as $$
declare d jsonb;
begin
  update shared_builds set views = views + 1 where id = t
  returning data || jsonb_build_object('views', views, 'likes', likes) into d;
  return d;
end $$;
revoke all on function public.get_build(text) from public;
grant execute on function public.get_build(text) to anon, authenticated;

-- a thumbs-up from a visitor
create or replace function public.like_build(t text) returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update shared_builds set likes = likes + 1 where id = t returning likes into n;
  return n;
end $$;
revoke all on function public.like_build(text) from public;
grant execute on function public.like_build(text) to anon, authenticated;
