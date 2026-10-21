-- Revora: the admin gives someone a free plan by email, no code needed.
-- If they already have an account it applies right away; if not, it applies the moment they sign up with that email.
-- Run once in the Supabase SQL editor (after gift_codes.sql). Safe to run again.
alter table public.profiles add column if not exists comp boolean not null default false;

create table if not exists public.comp_grants (
  email text primary key check (email = lower(btrim(email)) and email like '%_@_%'),
  plan text not null check (plan in ('rider', 'restorer', 'shop')),
  until timestamptz,                         -- empty = never ends
  note text check (char_length(note) <= 200),
  applied_at timestamptz,                    -- when it reached their account
  created_at timestamptz not null default now()
);
alter table public.comp_grants enable row level security;
drop policy if exists "admin sees grants" on public.comp_grants;
create policy "admin sees grants" on public.comp_grants for select using (public.is_admin());

-- give (or change) a free plan: applied | waiting | denied | bad plan | bad email
create or replace function public.grant_plan(em text, pl text, till timestamptz default null, nt text default null) returns text
language plpgsql security definer set search_path = public as $$
declare e text := lower(btrim(coalesce(em, ''))); uid uuid;
begin
  if not public.is_admin() then return 'denied'; end if;
  if pl not in ('rider', 'restorer', 'shop') then return 'bad plan'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return 'bad email'; end if;
  select id into uid from auth.users where lower(email) = e limit 1;
  insert into comp_grants (email, plan, until, note, applied_at) values (e, pl, till, left(nt, 200), case when uid is null then null else now() end)
    on conflict (email) do update set plan = excluded.plan, until = excluded.until, note = excluded.note, applied_at = excluded.applied_at;
  if uid is null then return 'waiting'; end if;
  update profiles set plan = pl, plan_until = till, plan_chosen = true, comp = true where id = uid;
  return 'applied';
end $$;
revoke all on function public.grant_plan(text, text, timestamptz, text) from public;
grant execute on function public.grant_plan(text, text, timestamptz, text) to authenticated;

-- take it back: they drop to Free (a paid Stripe plan they buy later still works)
create or replace function public.revoke_plan(em text) returns text
language plpgsql security definer set search_path = public as $$
declare e text := lower(btrim(coalesce(em, ''))); uid uuid;
begin
  if not public.is_admin() then return 'denied'; end if;
  delete from comp_grants where email = e;
  select id into uid from auth.users where lower(email) = e limit 1;
  if uid is not null then update profiles set plan = 'free', plan_until = null, comp = false where id = uid and comp; end if;
  return 'ok';
end $$;
revoke all on function public.revoke_plan(text) from public;
grant execute on function public.revoke_plan(text) to authenticated;

-- when someone signs up with an email that has a waiting grant, give it to them
-- (named so it runs after on_auth_user_created, which makes the profile)
create or replace function public.apply_comp_grant() returns trigger language plpgsql security definer set search_path = public as $$
declare g comp_grants;
begin
  select * into g from comp_grants where email = lower(new.email);
  if found then
    update profiles set plan = g.plan, plan_until = g.until, plan_chosen = true, comp = true where id = new.id;
    update comp_grants set applied_at = now() where email = g.email;
  end if;
  return new;
end $$;
drop trigger if exists on_auth_user_zz_comp on auth.users;
create trigger on_auth_user_zz_comp after insert on auth.users for each row execute function public.apply_comp_grant();
