-- Revora: the admin's list of everyone who signed up, for the People panel on the Plans page.
-- Only the admin gets rows back. Run once in the Supabase SQL editor. Safe to run again.
create or replace function public.admin_people() returns table (
  email text, name text, joined timestamptz, last_seen timestamptz, plan text, paid boolean, comp boolean, trial boolean, plan_until timestamptz, bikes int
) language sql stable security definer set search_path = public as $$
  select u.email::text, coalesce(p.display_name, ''), u.created_at, u.last_sign_in_at, coalesce(p.plan, 'free'),
    coalesce(p.paid, false), coalesce(p.comp, false), coalesce(p.trial_used and not p.paid, false), p.plan_until,
    (select count(*)::int from projects pr where pr.owner = u.id)
  from auth.users u left join profiles p on p.id = u.id
  where public.is_admin()
  order by u.created_at desc
$$;
revoke all on function public.admin_people() from public;
grant execute on function public.admin_people() to authenticated;
