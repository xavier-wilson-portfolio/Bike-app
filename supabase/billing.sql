-- Revora: paid plans through Stripe. Stripe tells the billing worker when someone pays, renews or cancels,
-- and the worker calls billing_set() to change that person's plan. A secret made inside the database
-- (never typed by hand) proves the call is from the worker. No Supabase secret key is needed.
-- Run once in the Supabase SQL editor. Safe to run again.
alter table public.profiles add column if not exists paid boolean not null default false;
alter table public.profiles add column if not exists stripe_customer text;
create unique index if not exists profiles_stripe_customer on public.profiles (stripe_customer) where stripe_customer is not null;

create table if not exists public.billing_secret (id int primary key default 1 check (id = 1), secret text not null);
alter table public.billing_secret enable row level security;   -- no policies: nobody can read it through the API
revoke all on public.billing_secret from anon, authenticated;
insert into public.billing_secret (id, secret) values (1, replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')) on conflict (id) do nothing;

create or replace function public.billing_set(sec text, uid uuid, cust text, pl text, until timestamptz) returns text
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if sec is null or sec <> (select secret from billing_secret where id = 1) then return 'denied'; end if;
  if pl not in ('free', 'rider', 'restorer', 'shop') then return 'bad plan'; end if;
  if uid is not null then
    update profiles set plan = pl, plan_until = until, paid = (pl <> 'free'), plan_chosen = true,
      stripe_customer = coalesce(nullif(cust, ''), stripe_customer) where id = uid;
  else
    update profiles set plan = pl, plan_until = until, paid = (pl <> 'free') where stripe_customer = cust;
  end if;
  get diagnostics n = row_count;
  return case when n > 0 then 'ok' else 'nouser' end;
end $$;
revoke all on function public.billing_set(text, uuid, text, text, timestamptz) from public;
grant execute on function public.billing_set(text, uuid, text, text, timestamptz) to anon, authenticated;

-- signed-in people can see whether their own plan is paid
grant select (paid) on public.profiles to authenticated;

-- shows the secret once so you can copy it into Cloudflare
select secret as "Copy this into Cloudflare as BILLING_SECRET" from public.billing_secret;
