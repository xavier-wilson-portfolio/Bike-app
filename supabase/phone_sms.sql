-- Revora: mobile numbers and text consent. Kept in their own table so teammates never see someone's number.
-- Run once in the Supabase SQL editor. Safe to run again.
create table if not exists public.contact_prefs (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  phone text check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$'),
  sms_ok boolean not null default false,
  sms_ok_at timestamptz,
  asked_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.contact_prefs enable row level security;
drop policy if exists "own contact prefs" on public.contact_prefs;
create policy "own contact prefs" on public.contact_prefs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "admin reads contact prefs" on public.contact_prefs;
create policy "admin reads contact prefs" on public.contact_prefs for select using (public.is_admin());
grant select, insert, update on public.contact_prefs to authenticated;

-- the admin people list now includes the number and whether they said yes to texts
drop function if exists public.admin_people();
create or replace function public.admin_people() returns table (
  email text, name text, joined timestamptz, last_seen timestamptz, plan text, paid boolean, comp boolean, trial boolean, plan_until timestamptz, bikes int, phone text, sms_ok boolean
) language sql stable security definer set search_path = public as $$
  select u.email::text, coalesce(p.display_name, ''), u.created_at, u.last_sign_in_at, coalesce(p.plan, 'free'),
    coalesce(p.paid, false), coalesce(p.comp, false), coalesce(p.trial_used and not p.paid, false), p.plan_until,
    (select count(*)::int from projects pr where pr.owner = u.id), c.phone, coalesce(c.sms_ok, false)
  from auth.users u left join profiles p on p.id = u.id left join contact_prefs c on c.user_id = u.id
  where public.is_admin()
  order by u.created_at desc
$$;
revoke all on function public.admin_people() from public;
grant execute on function public.admin_people() to authenticated;
