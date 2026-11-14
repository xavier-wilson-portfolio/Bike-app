-- Revora: collector cards. There are 9 card designs, and each design has one QR code (revoragarage.com/T/<code>).
-- Scanning it adds that bike's token to your garage, once. Collect all 8 bikes and get 3 free months.
-- Run once in the Supabase SQL editor. Safe to run again.
-- The 9 codes are NOT in this file (this repo is public). Load them with the separate card codes file.

-- design: 1 Sport, 2 Cafe racer, 3 Cruiser, 4 Adventure, 5 Standard, 6 Dual sport, 7 Touring, 8 Scooter, 9 Scooter gold (Legendary)
create table if not exists public.card_codes (
  code text primary key check (code ~ '^[A-Z2-9]{6}$'),
  design int not null unique check (design between 1 and 9),
  created_at timestamptz not null default now()
);
alter table public.card_codes enable row level security;
drop policy if exists "admin manages card codes" on public.card_codes;
create policy "admin manages card codes" on public.card_codes for all using (public.is_admin()) with check (public.is_admin());

-- which tokens each person has (one row per design)
create table if not exists public.card_claims (
  user_id uuid not null references auth.users(id) on delete cascade,
  design int not null check (design between 1 and 9),
  at timestamptz not null default now(),
  primary key (user_id, design)
);
alter table public.card_claims enable row level security;
drop policy if exists "people see their own tokens" on public.card_claims;
create policy "people see their own tokens" on public.card_claims for select using (user_id = auth.uid() or public.is_admin());

-- the 3 free months for a full set: applied (added to their plan) | owed (they pay through Stripe, the admin adds it by hand) | done
create table if not exists public.card_rewards (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  status text not null check (status in ('applied', 'owed', 'done')),
  at timestamptz not null default now()
);
alter table public.card_rewards enable row level security;
drop policy if exists "admin sees card rewards" on public.card_rewards;
create policy "admin sees card rewards" on public.card_rewards for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "people see their own card reward" on public.card_rewards;
create policy "people see their own card reward" on public.card_rewards for select using (user_id = auth.uid());

-- what's on a card, without adding it (works signed out, so the animation can play first)
create or replace function public.card_peek(c text) returns int
language sql security definer set search_path = public stable as $$
  select design from card_codes where code = upper(btrim(coalesce(c, '')));
$$;
revoke all on function public.card_peek(text) from public;
grant execute on function public.card_peek(text) to anon, authenticated;

-- the tokens in my garage
create or replace function public.my_card_tokens() returns table (design int, at timestamptz)
language sql security definer set search_path = public stable as $$
  select design, at from card_claims where user_id = auth.uid() order by design;
$$;
revoke all on function public.my_card_tokens() from public;
grant execute on function public.my_card_tokens() to authenticated;

-- add a scanned card's token to my garage
-- returns {status: added | have | invalid | signin, design, count, reward: applied | owed | null}
-- "have" = this token is already in my garage (the app skips the animation)
create or replace function public.card_claim(c text) returns json
language plpgsql security definer set search_path = public as $$
declare
  k text := upper(btrim(coalesce(c, '')));
  d int; me uuid := auth.uid(); n int; p profiles; rw text := null;
begin
  if me is null then return json_build_object('status', 'signin'); end if;
  select design into d from card_codes where code = k;
  if d is null then return json_build_object('status', 'invalid'); end if;
  if exists (select 1 from card_claims where user_id = me and design = d) then
    return json_build_object('status', 'have', 'design', d, 'count', (select count(distinct least(design, 8)) from card_claims where user_id = me));
  end if;
  insert into card_claims (user_id, design) values (me, d) on conflict do nothing;
  select count(distinct least(design, 8)) into n from card_claims where user_id = me;   -- the gold card counts as the scooter
  if n >= 8 and not exists (select 1 from card_rewards where user_id = me) then
    select * into p from profiles where id = me;
    if coalesce(p.paid, false) and not coalesce(p.comp, false) then
      rw := 'owed';   -- paying through Stripe: the admin adds the 3 months as a credit
    elsif coalesce(p.comp, false) and p.plan_until is null and coalesce(p.plan, 'free') <> 'free' then
      rw := 'owed';   -- already has a free plan with no end date
    else
      update profiles set
        plan = case when coalesce(plan, 'free') in ('free', 'pro', 'rider') or (plan_until is not null and plan_until < now()) then 'restorer' else plan end,
        plan_until = greatest(coalesce(plan_until, now()), now()) + interval '3 months',
        plan_chosen = true, comp = true
      where id = me;
      rw := 'applied';
    end if;
    insert into card_rewards (user_id, email, status) values (me, auth.jwt() ->> 'email', rw);
  end if;
  return json_build_object('status', 'added', 'design', d, 'count', n, 'reward', rw);
end $$;
revoke all on function public.card_claim(text) from public;
grant execute on function public.card_claim(text) to authenticated;

-- admin: how the cards are doing
create or replace function public.card_stats() returns json
language sql security definer set search_path = public stable as $$
  select case when public.is_admin() then json_build_object(
    'scans_by_design', (select coalesce(json_object_agg(design, n), '{}'::json) from (select design, count(*) n from card_claims group by design) x),
    'collectors', (select count(distinct user_id) from card_claims),
    'full_sets', (select count(*) from card_rewards),
    'owed', (select coalesce(json_agg(email), '[]'::json) from card_rewards where status = 'owed')
  ) else null end;
$$;
revoke all on function public.card_stats() from public;
grant execute on function public.card_stats() to authenticated;
