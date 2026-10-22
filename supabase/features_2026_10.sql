-- Revora: logbook import, Plan this job, public builds gallery with comments, and moving a bike to its new owner.
-- Run once in the Supabase SQL editor. Safe to run again.

-- ---------- AI limits: two new kinds ----------
alter table public.ai_usage drop constraint if exists ai_usage_kind_check;
alter table public.ai_usage add constraint ai_usage_kind_check check (kind in ('chat', 'scan', 'import', 'plan'));
create or replace function public.use_ai(kind text) returns text language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare p record; pl text; used int; cap int; life int;
begin
  if auth.uid() is null then return 'signin'; end if;
  if use_ai.kind not in ('chat', 'scan', 'import', 'plan') then return 'bad'; end if;
  if lower(coalesce(auth.jwt() ->> 'email', '')) = 'xavier.j.wilson101@gmail.com' then pl := 'shop';
  else
    select plan, plan_until into p from profiles where id = auth.uid();
    pl := coalesce(p.plan, 'free'); if pl = 'pro' then pl := 'rider'; end if;
    if pl <> 'free' and p.plan_until is not null and p.plan_until < now() then pl := 'free'; end if;
  end if;
  select coalesce(sum(n), 0) into life from ai_usage a where a.user_id = auth.uid() and a.kind = use_ai.kind;
  if use_ai.kind = 'scan' then
    if pl not in ('restorer', 'shop') then return 'locked'; end if;
    cap := 200;
  elsif use_ai.kind = 'import' then          -- bringing in old records: everyone, so Free has a full history from day one
    if pl = 'free' and life >= 15 then return 'limit'; end if;
    cap := 30;
  elsif use_ai.kind = 'plan' then            -- Plan this job: 2 to try on Free, Rider 10 a day, Restorer and Shop as many as they like
    if pl = 'free' and life >= 2 then return 'limit'; end if;
    cap := case when pl = 'free' then 2 when pl = 'rider' then 10 else 300 end;
  else
    if pl = 'free' and life >= 3 then return 'limit'; end if;
    cap := case when pl = 'free' then 3 when pl = 'rider' then 10 else 300 end;
  end if;
  insert into ai_usage (user_id, day, kind, n) values (auth.uid(), current_date, use_ai.kind, 1)
  on conflict (user_id, day, kind) do update set n = ai_usage.n + 1
  where ai_usage.n < cap
  returning n into used;
  if used is null then return 'limit'; end if;
  return 'ok';
end $$;
revoke all on function public.use_ai(text) from public;
grant execute on function public.use_ai(text) to authenticated;

-- ---------- builds gallery: owners choose to list their page ----------
alter table public.shared_builds add column if not exists in_gallery boolean not null default false;
grant update (data, updated_at, title, in_gallery) on public.shared_builds to authenticated;

-- ---------- comments on build pages ----------
create table if not exists public.build_comments (
  id bigint generated always as identity primary key,
  build_id text not null references public.shared_builds(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  body text not null check (char_length(body) between 1 and 600),
  created_at timestamptz not null default now()
);
create index if not exists build_comments_build on public.build_comments (build_id, created_at);
alter table public.build_comments enable row level security;
drop policy if exists "signed in people comment" on public.build_comments;
create policy "signed in people comment" on public.build_comments for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "remove own or on own page" on public.build_comments;
create policy "remove own or on own page" on public.build_comments for delete using (user_id = auth.uid() or exists (select 1 from shared_builds b where b.id = build_id and b.owner = auth.uid()) or public.is_admin());
grant insert, delete on public.build_comments to authenticated;

create or replace function public.list_gallery(sort text default 'new', lim int default 24, off int default 0)
returns table (id text, title text, bike text, style text, status text, cover text, likes int, views int, comments int, updated_at timestamptz)
language sql stable security definer set search_path = public as $$
  select b.id, coalesce(b.title, b.data->'bike'->>'name'), b.data->'bike'->>'name', b.data->'bike'->>'styleName', b.data->>'status',
    coalesce(b.data->'photos'->0->>'src', b.data->'bike'->>'sil'), b.likes, b.views,
    (select count(*)::int from build_comments c where c.build_id = b.id), b.updated_at
  from shared_builds b
  where b.in_gallery
  order by case when sort = 'liked' then b.likes else 0 end desc, b.updated_at desc
  limit least(greatest(lim, 1), 48) offset greatest(off, 0)
$$;

create or replace function public.get_build_comments(t text)
returns table (id bigint, name text, body text, created_at timestamptz, can_delete boolean)
language sql stable security definer set search_path = public as $$
  select c.id, c.name, c.body, c.created_at,
    (auth.uid() is not null and (c.user_id = auth.uid() or b.owner = auth.uid() or public.is_admin()))
  from build_comments c join shared_builds b on b.id = c.build_id
  where c.build_id = t
  order by c.created_at
  limit 200
$$;
revoke all on function public.list_gallery(text, int, int) from public;
revoke all on function public.get_build_comments(text) from public;
grant execute on function public.list_gallery(text, int, int) to anon, authenticated;
grant execute on function public.get_build_comments(text) to anon, authenticated;
-- a build page tells the visitor whether it's in the gallery
create or replace function public.get_build(t text) returns jsonb language plpgsql security definer set search_path = public as $$
declare d jsonb;
begin
  update shared_builds set views = views + 1 where id = t
  returning data || jsonb_build_object('views', views, 'likes', likes, 'gallery', in_gallery) into d;
  return d;
end $$;

-- ---------- selling the bike: move the project and its whole history to the new owner ----------
create table if not exists public.project_transfers (
  project_id uuid primary key references public.projects(id) on delete cascade,
  email text not null check (char_length(email) <= 320),
  from_user uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.project_transfers enable row level security;
drop policy if exists "owner sees own transfers" on public.project_transfers;
create policy "owner sees own transfers" on public.project_transfers for select using (from_user = auth.uid());

create or replace function public.move_project(pid uuid, to_user uuid) returns void language plpgsql security definer set search_path = public as $$
declare old uuid;
begin
  select owner into old from projects where id = pid;
  update projects set owner = to_user where id = pid;
  delete from project_members where project_id = pid and user_id = old;
  insert into project_members (project_id, user_id, role) values (pid, to_user, 'owner')
    on conflict (project_id, user_id) do update set role = 'owner';
  update shared_builds set owner = to_user where project_id = pid;
  delete from project_transfers where project_id = pid;
end $$;
revoke all on function public.move_project(uuid, uuid) from public, anon, authenticated;

create or replace function public.transfer_project(pid uuid, em text) returns text language plpgsql security definer set search_path = public as $$
declare target uuid; e text := lower(btrim(em));
begin
  if not exists (select 1 from projects where id = pid and owner = auth.uid()) then return 'denied'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return 'bad'; end if;
  if e = lower(coalesce(auth.jwt() ->> 'email', '')) then return 'self'; end if;
  select id into target from auth.users where lower(email) = e;
  if target is not null then perform move_project(pid, target); return 'moved'; end if;
  insert into project_transfers (project_id, email, from_user) values (pid, e, auth.uid())
    on conflict (project_id) do update set email = excluded.email, from_user = excluded.from_user, created_at = now();
  return 'waiting';
end $$;
create or replace function public.cancel_transfer(pid uuid) returns text language sql security definer set search_path = public as $$
  delete from project_transfers where project_id = pid and from_user = auth.uid() returning 'ok'
$$;
revoke all on function public.transfer_project(uuid, text) from public;
revoke all on function public.cancel_transfer(uuid) from public;
grant execute on function public.transfer_project(uuid, text) to authenticated;
grant execute on function public.cancel_transfer(uuid) to authenticated;

-- a waiting transfer goes through when the buyer signs up with that email (if the seller still owns the bike)
create or replace function public.apply_project_transfer() returns trigger language plpgsql security definer set search_path = public as $$
declare r record;
begin
  for r in select t.project_id from project_transfers t join projects p on p.id = t.project_id and p.owner = t.from_user where lower(t.email) = lower(new.email) loop
    perform move_project(r.project_id, new.id);
  end loop;
  return new;
end $$;
drop trigger if exists on_auth_user_zz_transfer on auth.users;
create trigger on_auth_user_zz_transfer after insert on auth.users for each row execute function public.apply_project_transfer();

select 'Revora October features are ready' as done;
