-- Revora database. Paste into Supabase: SQL Editor > New query > Run.
-- Safe to run once on a new project.

-- ---------- people ----------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null default '',
  plan text not null default 'free' check (plan in ('free', 'pro')),   -- set by the Stripe webhook, never by the user
  plan_until timestamptz,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "update own name" on public.profiles for update using (auth.uid() = id);
-- users may change their name but not their plan
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- make a profile when someone signs up
create function public.new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.new_user();

-- ---------- projects (one bike someone is restoring) ----------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users on delete cascade default auth.uid(),
  bike_id text not null,             -- matches a pack id, e.g. suzuki-gs750-1977
  name text not null default '',
  created_at timestamptz not null default now()
);
create table public.project_members (
  project_id uuid references public.projects on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor', 'viewer')),
  primary key (project_id, user_id)
);
alter table public.projects enable row level security;
alter table public.project_members enable row level security;

create function public.is_member(p uuid, write boolean default false) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from project_members m where m.project_id = p and m.user_id = auth.uid() and (not write or m.role in ('owner', 'editor')))
$$;

create policy "members read projects" on public.projects for select using (owner = auth.uid() or public.is_member(id));
create policy "anyone signed in creates projects" on public.projects for insert with check (owner = auth.uid());
create policy "owner edits project" on public.projects for update using (owner = auth.uid());
create policy "owner deletes project" on public.projects for delete using (owner = auth.uid());

create policy "members see members" on public.project_members for select using (public.is_member(project_id));
create policy "owner manages members" on public.project_members for all
  using (exists (select 1 from public.projects p where p.id = project_id and p.owner = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.owner = auth.uid()));

-- the owner is always a member
create function public.add_owner_member() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into project_members (project_id, user_id, role) values (new.id, new.owner, 'owner'); return new; end $$;
create trigger on_project_created after insert on public.projects for each row execute function public.add_owner_member();

-- ---------- project records (parts, tasks, notes, have/missing marks...) ----------
-- One row per record, same shape the app already uses: collection + id + the record itself.
create table public.records (
  project_id uuid references public.projects on delete cascade,
  coll text not null,
  rec_id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid(),
  primary key (project_id, coll, rec_id)
);
create index records_project on public.records (project_id, coll);
alter table public.records enable row level security;
create policy "members read records" on public.records for select using (public.is_member(project_id));
create policy "editors write records" on public.records for insert with check (public.is_member(project_id, true));
create policy "editors update records" on public.records for update using (public.is_member(project_id, true));
create policy "editors delete records" on public.records for delete using (public.is_member(project_id, true));
alter publication supabase_realtime add table public.records;   -- live updates for the team

-- ---------- requests for bikes we don't have yet ----------
create table public.bike_requests (
  key text primary key,          -- normalised year-make-model
  label text not null,
  status text not null default 'Queued',
  votes uuid[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.bike_requests enable row level security;
create policy "everyone reads requests" on public.bike_requests for select using (true);
create policy "signed in adds requests" on public.bike_requests for insert with check (auth.uid() is not null and status = 'Queued');
create function public.vote_bike(k text, l text) returns void language sql security definer set search_path = public as $$
  insert into bike_requests (key, label, votes) values (k, l, array[auth.uid()])
  on conflict (key) do update set votes = (select array(select distinct unnest(bike_requests.votes || auth.uid())));
$$;

-- ---------- photo storage ----------
-- Files go in the private "project-files" bucket under <project id>/<file name>.
insert into storage.buckets (id, name, public) values ('project-files', 'project-files', false) on conflict do nothing;
create policy "members read files" on storage.objects for select
  using (bucket_id = 'project-files' and public.is_member(((storage.foldername(name))[1])::uuid));
create policy "editors upload files" on storage.objects for insert
  with check (bucket_id = 'project-files' and public.is_member(((storage.foldername(name))[1])::uuid, true));
create policy "editors delete files" on storage.objects for delete
  using (bucket_id = 'project-files' and public.is_member(((storage.foldername(name))[1])::uuid, true));

-- ---------- team helpers ----------
-- see the names of people you share a project with
create policy "read teammates" on public.profiles for select using (
  exists (select 1 from public.project_members a join public.project_members b on a.project_id = b.project_id
          where a.user_id = auth.uid() and b.user_id = profiles.id));

-- owner adds someone who already has an account, by email
create function public.add_member(p uuid, member_email text, member_role text default 'editor') returns text
language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not exists (select 1 from projects where id = p and owner = auth.uid()) then return 'not_owner'; end if;
  if member_role not in ('editor', 'viewer') then return 'bad_role'; end if;
  select id into uid from auth.users where lower(email) = lower(trim(member_email));
  if uid is null then return 'no_account'; end if;
  insert into project_members (project_id, user_id, role) values (p, uid, member_role)
    on conflict (project_id, user_id) do update set role = excluded.role where project_members.role <> 'owner';
  return 'ok';
end $$;

-- the project list with your role and the owner's name
create view public.my_projects with (security_invoker = true) as
  select p.id, p.bike_id, p.name, p.created_at, p.owner, m.role,
         (select count(*) from public.project_members x where x.project_id = p.id) as members
  from public.projects p join public.project_members m on m.project_id = p.id and m.user_id = auth.uid();
