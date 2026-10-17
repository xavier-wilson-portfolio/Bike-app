-- Revora: work order approval links for shops. The shop sends a long random link; the customer opens it
-- without an account, sees the estimate and approves or declines it once.
-- Run once in the Supabase SQL editor. Safe to run again.
create table if not exists public.wo_links (
  id text primary key check (id ~ '^[A-Za-z0-9]{16,40}$'),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  wo_id text not null check (char_length(wo_id) <= 40),
  data jsonb not null check (pg_column_size(data) < 500000),
  decision text check (decision in ('approved', 'declined')),
  decided_name text check (char_length(decided_name) <= 80),
  decided_note text check (char_length(decided_note) <= 500),
  decided_at timestamptz,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists wo_links_project on public.wo_links (project_id);
alter table public.wo_links enable row level security;
drop policy if exists "team sees approval links" on public.wo_links;
create policy "team sees approval links" on public.wo_links for select using (public.is_member(project_id));
drop policy if exists "editors make approval links" on public.wo_links;
create policy "editors make approval links" on public.wo_links for insert with check (owner = auth.uid() and public.is_member(project_id, true));
drop policy if exists "owner updates approval links" on public.wo_links;
create policy "owner updates approval links" on public.wo_links for update using (owner = auth.uid()) with check (owner = auth.uid() and public.is_member(project_id, true));
drop policy if exists "owner stops approval links" on public.wo_links;
create policy "owner stops approval links" on public.wo_links for delete using (owner = auth.uid());
revoke update on public.wo_links from authenticated, anon;
grant update (data, updated_at, decision, decided_name, decided_note, decided_at) on public.wo_links to authenticated;

-- the customer opens the estimate
create or replace function public.get_wo(t text) returns jsonb language plpgsql security definer set search_path = public as $$
declare d jsonb;
begin
  update wo_links set views = views + 1 where id = t
  returning data || jsonb_build_object('decision', decision, 'decided_name', decided_name, 'decided_at', decided_at) into d;
  return d;
end $$;
revoke all on function public.get_wo(text) from public;
grant execute on function public.get_wo(text) to anon, authenticated;

-- the customer approves or declines, once
create or replace function public.decide_wo(t text, d text, nm text, note text) returns text language plpgsql security definer set search_path = public as $$
begin
  if d not in ('approved', 'declined') then return 'bad'; end if;
  if coalesce(trim(nm), '') = '' then return 'name'; end if;
  update wo_links set decision = d, decided_name = left(trim(nm), 80), decided_note = left(coalesce(note, ''), 500), decided_at = now()
  where id = t and decision is null;
  if found then return 'ok'; end if;
  return 'done';
end $$;
revoke all on function public.decide_wo(text, text, text, text) from public;
grant execute on function public.decide_wo(text, text, text, text) to anon, authenticated;
