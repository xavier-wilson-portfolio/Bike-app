-- Revora plans: Free, Rider, Restorer, Shop, plus the 30-day Restorer trial and the plan chooser after sign-up.
-- Run once in the Supabase SQL editor. Safe to run again.
alter table public.profiles drop constraint if exists profiles_plan_check;
alter table public.profiles add constraint profiles_plan_check check (plan in ('free', 'rider', 'restorer', 'shop', 'pro'));
alter table public.profiles add column if not exists trial_used boolean not null default false;
alter table public.profiles add column if not exists plan_chosen boolean not null default false;
-- people can mark that they've picked a plan, but never set the plan itself (that's the trial below, or payments later)
revoke update on public.profiles from authenticated, anon;
grant update (display_name, prefs, plan_chosen) on public.profiles to authenticated;

-- one free 30-day Restorer trial per account
create or replace function public.start_trial() returns text language plpgsql security definer set search_path = public as $$
declare used boolean;
begin
  if auth.uid() is null then return 'signin'; end if;
  select trial_used into used from profiles where id = auth.uid();
  -- the trial now starts on Stripe with a card (30 free days, then $9.99 a month), so this no longer hands out free plans
  return 'card';
end $$;
revoke all on function public.start_trial() from public;
grant execute on function public.start_trial() to authenticated;
