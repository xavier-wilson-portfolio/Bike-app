-- Revora: gift codes. The admin makes a code; whoever enters it gets that plan for as long as their account exists.
-- Run once in the Supabase SQL editor. Safe to run again.
alter table public.profiles add column if not exists comp boolean not null default false;

create table if not exists public.gift_codes (
  code text primary key check (code ~ '^[A-Z0-9-]{4,32}$'),
  plan text not null default 'shop' check (plan in ('rider', 'restorer', 'shop')),
  max_uses int check (max_uses is null or max_uses > 0),   -- empty = no limit
  uses int not null default 0,
  note text check (char_length(note) <= 200),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.gift_codes enable row level security;
drop policy if exists "admin manages gift codes" on public.gift_codes;
create policy "admin manages gift codes" on public.gift_codes for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.gift_redemptions (
  code text not null references public.gift_codes(code) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  at timestamptz not null default now(),
  primary key (code, user_id)
);
alter table public.gift_redemptions enable row level security;
drop policy if exists "admin sees redemptions" on public.gift_redemptions;
create policy "admin sees redemptions" on public.gift_redemptions for select using (public.is_admin());

-- someone enters a code: ok:<plan> | invalid | full | used | signin
create or replace function public.redeem_code(c text) returns text language plpgsql security definer set search_path = public as $$
declare g gift_codes; k text := upper(btrim(coalesce(c, '')));
begin
  if auth.uid() is null then return 'signin'; end if;
  select * into g from gift_codes where code = k and active for update;
  if not found then return 'invalid'; end if;
  if exists (select 1 from gift_redemptions where code = k and user_id = auth.uid()) then return 'used'; end if;
  if g.max_uses is not null and g.uses >= g.max_uses then return 'full'; end if;
  update gift_codes set uses = uses + 1 where code = k;
  insert into gift_redemptions (code, user_id, email) values (k, auth.uid(), auth.jwt() ->> 'email');
  update profiles set plan = g.plan, plan_until = null, plan_chosen = true, comp = true where id = auth.uid();
  return 'ok:' || g.plan;
end $$;
revoke all on function public.redeem_code(text) from public;
grant execute on function public.redeem_code(text) to authenticated;

-- a gifted account isn't dropped to Free if an old Stripe subscription ends
create or replace function public.billing_set(sec text, uid uuid, cust text, pl text, until timestamptz) returns text
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where id = 1)) then return 'denied'; end if;
  if pl not in ('free', 'rider', 'restorer', 'shop') then return 'bad plan'; end if;
  if uid is not null then
    update profiles set plan = pl, plan_until = until, paid = (pl <> 'free'), plan_chosen = true,
      stripe_customer = coalesce(nullif(cust, ''), stripe_customer) where id = uid and not (comp and pl = 'free');
  else
    update profiles set plan = pl, plan_until = until, paid = (pl <> 'free') where stripe_customer = cust and not (comp and pl = 'free');
  end if;
  get diagnostics n = row_count;
  return case when n > 0 then 'ok' else 'nouser' end;
end $$;

grant select (comp) on public.profiles to authenticated;
