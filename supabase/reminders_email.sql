-- Revora: email reminders. The reminders worker calls these two functions with the same secret the billing
-- worker uses (billing_secret), so no Supabase secret key is needed.
-- Only people on Rider, Restorer or Shop (or a trial, or a gift code) get emails. Run once. Safe to run again.
create table if not exists public.reminder_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  email text not null,
  send_on date not null,
  due_on date,
  kind text not null default 'service',
  item_key text not null,
  bike text,
  title text not null,
  body text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists reminder_queue_due on public.reminder_queue (send_on) where sent_at is null;
alter table public.reminder_queue enable row level security;
drop policy if exists "own reminders" on public.reminder_queue;
create policy "own reminders" on public.reminder_queue for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and lower(email) = lower(auth.jwt() ->> 'email') and public.is_member(project_id));

-- reminders that should go out today, for people whose plan includes them, always to the account's own email
create or replace function public.reminders_due(sec text) returns table (id uuid, email text, bike text, kind text, title text, body text, send_on date, due_on date)
language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  return query
    select q.id, u.email::text, q.bike, q.kind, q.title, q.body, q.send_on, q.due_on
    from reminder_queue q
    join auth.users u on u.id = q.user_id
    left join profiles p on p.id = q.user_id
    where q.sent_at is null and q.send_on <= current_date and q.send_on > current_date - 60
      and lower(u.email) = lower(q.email)
      and (lower(u.email) = 'xavier.j.wilson101@gmail.com'
           or (coalesce(p.plan, 'free') not in ('free') and (p.plan_until is null or p.plan_until > now())))
    order by q.send_on
    limit 500;
end $$;

create or replace function public.reminders_mark(sec text, ids uuid[]) returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  update reminder_queue set sent_at = now() where reminder_queue.id = any(ids) and sent_at is null;
  get diagnostics n = row_count;
  return n;
end $$;

revoke all on function public.reminders_due(text) from public;
revoke all on function public.reminders_mark(text, uuid[]) from public;
grant execute on function public.reminders_due(text) to anon, authenticated;
grant execute on function public.reminders_mark(text, uuid[]) to anon, authenticated;

select 'Email reminders are ready' as done;
