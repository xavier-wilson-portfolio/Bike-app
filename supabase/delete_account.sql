-- Lets a signed-in member delete their own account. Everything that references auth.users
-- is set to cascade (profiles, projects and their records, reminders, reports, builds, ...),
-- so removing the auth user removes their data with it. Files in storage are removed by the
-- site first (best effort) because storage objects can't be deleted from SQL.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not signed in'; end if;
  delete from auth.users where id = uid;
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
