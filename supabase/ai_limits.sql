-- Revora: plan limits for the AI, checked by the AI worker on every request.
-- Ask the mechanic: Rider 10 questions a day, Restorer and Shop unlimited. Receipts and parts scan: Restorer and Shop.
-- The worker calls use_ai() with the person's own sign-in, so no secret keys are needed.
-- Run once in the Supabase SQL editor. Safe to run again.
create table if not exists public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  kind text not null check (kind in ('chat', 'scan')),
  n int not null default 0,
  primary key (user_id, day, kind)
);
alter table public.ai_usage enable row level security;
drop policy if exists "see own ai use" on public.ai_usage;
create policy "see own ai use" on public.ai_usage for select using (user_id = auth.uid());
revoke insert, update, delete on public.ai_usage from authenticated, anon;

create or replace function public.use_ai(kind text) returns text language plpgsql security definer set search_path = public as $$
declare p record; pl text; used int; cap int;
begin
  if auth.uid() is null then return 'signin'; end if;
  if kind not in ('chat', 'scan') then return 'bad'; end if;
  if lower(coalesce(auth.jwt() ->> 'email', '')) = 'xavier.j.wilson101@gmail.com' then pl := 'shop';
  else
    select plan, plan_until into p from profiles where id = auth.uid();
    pl := coalesce(p.plan, 'free'); if pl = 'pro' then pl := 'rider'; end if;
    if pl <> 'free' and p.plan_until is not null and p.plan_until < now() then pl := 'free'; end if;
  end if;
  if kind = 'scan' then
    if pl not in ('restorer', 'shop') then return 'locked'; end if;
    cap := 200;                              -- a generous daily ceiling so one account can't run up the bill
  else
    if pl = 'free' then return 'locked'; end if;
    cap := case when pl = 'rider' then 10 else 300 end;
  end if;
  insert into ai_usage (user_id, day, kind, n) values (auth.uid(), current_date, kind, 1)
  on conflict (user_id, day, kind) do update set n = ai_usage.n + 1
  where ai_usage.n < cap
  returning n into used;
  if used is null then return 'limit'; end if;
  return 'ok';
end $$;
revoke all on function public.use_ai(text) from public;
grant execute on function public.use_ai(text) to authenticated;
