-- Revora Shop: a client book for shops. Clients, their bikes, service logs, reminders, budgets,
-- requests from clients, staff logins, client links and moving a bike to the client's own account.
-- Run once in the Supabase SQL editor (SQL Editor > New query > paste > Run). Safe to run again.

-- ---------- tables ----------
create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  name text not null default '' check (char_length(name) <= 80),
  phone text not null default '' check (char_length(phone) <= 40),
  email text not null default '' check (char_length(email) <= 200),
  address text not null default '' check (char_length(address) <= 200),
  created_at timestamptz not null default now()
);
create table if not exists public.shop_staff (
  shop_id uuid not null references public.shops(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (shop_id, user_id)
);
create table if not exists public.shop_staff_invites (
  shop_id uuid not null references public.shops(id) on delete cascade,
  email text not null check (char_length(email) <= 320),
  created_at timestamptz not null default now(),
  primary key (shop_id, email)
);

-- client codes: 8 letters and numbers, no 0/O/1/I so they're easy to read out loud
create or replace function public.shop_new_code() returns text language plpgsql volatile security definer set search_path = public as $$
declare a text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; c text; i int;
begin
  loop
    c := ''; for i in 1..8 loop c := c || substr(a, 1 + floor(random() * 32)::int, 1); end loop;
    exit when not exists (select 1 from public.shop_clients where code = c);
  end loop;
  return c;
end $$;
create or replace function public.shop_token(len int default 24) returns text language sql volatile as $$
  select string_agg(substr('abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 56)::int, 1), '') from generate_series(1, len)
$$;

create table if not exists public.shop_clients (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null default '' check (char_length(email) <= 200),
  phone text not null default '' check (char_length(phone) <= 40),
  notes text not null default '' check (char_length(notes) <= 2000),
  code text not null unique check (code ~ '^[A-HJ-NP-Z2-9]{8}$'),
  remind_ok boolean not null default false,
  remind_ok_at timestamptz,
  unsub text not null unique,
  client_user uuid references auth.users(id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shop_clients alter column code set default public.shop_new_code();
alter table public.shop_clients alter column unsub set default public.shop_token(24);
create index if not exists shop_clients_shop on public.shop_clients (shop_id);
create index if not exists shop_clients_user on public.shop_clients (client_user) where client_user is not null;

-- money is in its own table so only the shop owner can read it
create table if not exists public.shop_client_money (
  client_id uuid primary key references public.shop_clients(id) on delete cascade,
  shop_id uuid not null references public.shops(id) on delete cascade,
  budget numeric(12,2) not null default 0 check (budget >= 0 and budget < 10000000),
  since date not null default current_date,
  notes text not null default '' check (char_length(notes) <= 1000),
  updated_at timestamptz not null default now()
);

alter table public.shop_client_money add column if not exists since date not null default current_date;

alter table public.projects add column if not exists shop_id uuid references public.shops(id) on delete set null;
alter table public.projects add column if not exists shop_client uuid references public.shop_clients(id) on delete set null;
create index if not exists projects_shop on public.projects (shop_id) where shop_id is not null;

create table if not exists public.shop_requests (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  client_id uuid not null references public.shop_clients(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null check (kind in ('budget', 'report', 'value')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  asked_by_client boolean not null default true,
  token text unique,
  result jsonb check (result is null or pg_column_size(result) < 400000),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id) on delete set null,
  emailed_at timestamptz
);
create index if not exists shop_requests_shop on public.shop_requests (shop_id, status);

create table if not exists public.shop_reminders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  client_id uuid not null references public.shop_clients(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  item_key text not null check (char_length(item_key) <= 60),
  kind text not null default 'service' check (kind in ('service', 'odometer')),
  bike text check (char_length(bike) <= 120),
  title text not null check (char_length(title) <= 200),
  body text check (char_length(body) <= 600),
  send_on date not null,
  due_on date,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists shop_reminders_due on public.shop_reminders (send_on) where sent_at is null;
create index if not exists shop_reminders_project on public.shop_reminders (project_id);

-- ---------- who is who ----------
-- 'owner', 'staff' or null for the signed-in person
create or replace function public.shop_role(s uuid) returns text language sql stable security definer set search_path = public as $$
  select case when exists (select 1 from shops where id = s and owner = auth.uid()) then 'owner'
              when exists (select 1 from shop_staff where shop_id = s and user_id = auth.uid()) then 'staff' end
$$;
-- the shop's owner is on the Shop plan (or is the Revora admin)
create or replace function public.shop_plan_ok(s uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from shops sh join auth.users u on u.id = sh.owner left join profiles p on p.id = sh.owner
    where sh.id = s and (lower(u.email) = 'xavier.j.wilson101@gmail.com'
      or (coalesce(p.plan, 'free') in ('shop', 'pro') and (p.plan_until is null or p.plan_until > now()))))
$$;
-- the shop the signed-in person owns or works at
create or replace function public.my_shop() returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('id', s.id, 'name', s.name, 'phone', s.phone, 'email', s.email, 'address', s.address, 'owner', s.owner,
    'role', public.shop_role(s.id), 'plan_ok', public.shop_plan_ok(s.id),
    'owner_name', (select display_name from profiles where id = s.owner))
  from shops s where s.owner = auth.uid() or exists (select 1 from shop_staff t where t.shop_id = s.id and t.user_id = auth.uid())
  order by (s.owner = auth.uid()) desc limit 1
$$;

-- ---------- row rules ----------
alter table public.shops enable row level security;
alter table public.shop_staff enable row level security;
alter table public.shop_staff_invites enable row level security;
alter table public.shop_clients enable row level security;
alter table public.shop_client_money enable row level security;
alter table public.shop_requests enable row level security;
alter table public.shop_reminders enable row level security;

drop policy if exists "shop team reads shop" on public.shops;
create policy "shop team reads shop" on public.shops for select using (public.shop_role(id) is not null);
drop policy if exists "owner makes shop" on public.shops;
create policy "owner makes shop" on public.shops for insert with check (owner = auth.uid());
drop policy if exists "owner edits shop" on public.shops;
create policy "owner edits shop" on public.shops for update using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "owner deletes shop" on public.shops;
create policy "owner deletes shop" on public.shops for delete using (owner = auth.uid());
revoke update on public.shops from authenticated, anon;
grant update (name, phone, email, address) on public.shops to authenticated;

drop policy if exists "shop team sees staff" on public.shop_staff;
create policy "shop team sees staff" on public.shop_staff for select using (public.shop_role(shop_id) is not null);
drop policy if exists "owner or self removes staff" on public.shop_staff;
create policy "owner or self removes staff" on public.shop_staff for delete using (public.shop_role(shop_id) = 'owner' or user_id = auth.uid());
revoke insert, update on public.shop_staff from authenticated, anon;

drop policy if exists "owner sees invites" on public.shop_staff_invites;
create policy "owner sees invites" on public.shop_staff_invites for select using (public.shop_role(shop_id) = 'owner');
drop policy if exists "owner cancels invites" on public.shop_staff_invites;
create policy "owner cancels invites" on public.shop_staff_invites for delete using (public.shop_role(shop_id) = 'owner');
revoke insert, update on public.shop_staff_invites from authenticated, anon;

drop policy if exists "shop team reads clients" on public.shop_clients;
create policy "shop team reads clients" on public.shop_clients for select using (public.shop_role(shop_id) is not null);
drop policy if exists "client reads own card" on public.shop_clients;
create policy "client reads own card" on public.shop_clients for select using (client_user = auth.uid());
drop policy if exists "shop team adds clients" on public.shop_clients;
create policy "shop team adds clients" on public.shop_clients for insert with check (public.shop_role(shop_id) is not null and client_user is null and public.shop_plan_ok(shop_id));
drop policy if exists "shop team edits clients" on public.shop_clients;
create policy "shop team edits clients" on public.shop_clients for update using (public.shop_role(shop_id) is not null) with check (public.shop_role(shop_id) is not null);
drop policy if exists "owner deletes clients" on public.shop_clients;
create policy "owner deletes clients" on public.shop_clients for delete using (public.shop_role(shop_id) = 'owner');
revoke insert, update on public.shop_clients from authenticated, anon;
grant insert (shop_id, name, email, phone, notes, remind_ok, remind_ok_at) on public.shop_clients to authenticated;
grant update (name, email, phone, notes, remind_ok, remind_ok_at, updated_at) on public.shop_clients to authenticated;

drop policy if exists "owner handles money" on public.shop_client_money;
create policy "owner handles money" on public.shop_client_money for all using (public.shop_role(shop_id) = 'owner')
  with check (public.shop_role(shop_id) = 'owner' and exists (select 1 from shop_clients c where c.id = client_id and c.shop_id = shop_client_money.shop_id));

drop policy if exists "shop team reads requests" on public.shop_requests;
create policy "shop team reads requests" on public.shop_requests for select using (public.shop_role(shop_id) = 'owner' or (public.shop_role(shop_id) = 'staff' and kind <> 'budget'));
drop policy if exists "client reads own requests" on public.shop_requests;
create policy "client reads own requests" on public.shop_requests for select using (exists (select 1 from shop_clients c where c.id = client_id and c.client_user = auth.uid()));
revoke insert, update, delete on public.shop_requests from authenticated, anon;

drop policy if exists "shop team handles reminders" on public.shop_reminders;
create policy "shop team handles reminders" on public.shop_reminders for all using (public.shop_role(shop_id) is not null)
  with check (public.shop_role(shop_id) is not null
    and exists (select 1 from shop_clients c where c.id = client_id and c.shop_id = shop_reminders.shop_id)
    and exists (select 1 from projects p where p.id = project_id and p.shop_id = shop_reminders.shop_id and p.shop_client = shop_reminders.client_id));

-- ---------- shop bikes: the shop owner owns them, staff get edit access ----------
-- a project can only be put in a shop by that shop's owner, and only with that shop's client
create or replace function public.check_project_shop() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.shop_id is null then new.shop_client := null; return new; end if;
  if tg_op = 'UPDATE' and new.shop_id is not distinct from old.shop_id and new.shop_client is not distinct from old.shop_client and new.owner = old.owner then return new; end if;
  if not exists (select 1 from shops where id = new.shop_id and owner = new.owner) then raise exception 'shop bikes belong to the shop owner'; end if;
  if new.shop_client is not null and not exists (select 1 from shop_clients where id = new.shop_client and shop_id = new.shop_id) then raise exception 'that client is not in this shop'; end if;
  if auth.uid() is not null and public.shop_role(new.shop_id) is null then raise exception 'not in this shop'; end if;
  return new;
end $$;
drop trigger if exists projects_shop_check on public.projects;
create trigger projects_shop_check before insert or update of shop_id, shop_client, owner on public.projects for each row execute function public.check_project_shop();

-- staff come and go with the shop's bikes
create or replace function public.sync_shop_members() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and old.shop_id is not null and old.shop_id is distinct from new.shop_id then
    delete from project_members m using shop_staff s where m.project_id = new.id and m.user_id = s.user_id and s.shop_id = old.shop_id and m.role = 'editor' and m.user_id <> new.owner;
    delete from shop_reminders where project_id = new.id;
    delete from shop_requests where project_id = new.id and status = 'pending';
  end if;
  if new.shop_id is not null then
    insert into project_members (project_id, user_id, role) select new.id, s.user_id, 'editor' from shop_staff s where s.shop_id = new.shop_id on conflict do nothing;
  end if;
  return new;
end $$;
drop trigger if exists projects_shop_members on public.projects;
create trigger projects_shop_members after insert or update of shop_id on public.projects for each row execute function public.sync_shop_members();

create or replace function public.sync_staff_projects() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into project_members (project_id, user_id, role) select p.id, new.user_id, 'editor' from projects p where p.shop_id = new.shop_id on conflict do nothing;
    return new;
  end if;
  delete from project_members m using projects p where m.project_id = p.id and p.shop_id = old.shop_id and m.user_id = old.user_id and m.role = 'editor';
  return old;
end $$;
drop trigger if exists shop_staff_projects on public.shop_staff;
create trigger shop_staff_projects after insert or delete on public.shop_staff for each row execute function public.sync_staff_projects();

-- the project list now says which bikes are shop bikes (so they stay out of the personal garage)
create or replace view public.my_projects with (security_invoker = true) as
  select p.id, p.bike_id, p.name, p.created_at, p.owner, m.role,
         (select count(*) from public.project_members x where x.project_id = p.id) as members,
         p.shop_id, p.shop_client
  from public.projects p join public.project_members m on m.project_id = p.id and m.user_id = auth.uid();

-- selling or handing over a bike also takes it out of the shop
create or replace function public.move_project(pid uuid, to_user uuid) returns void language plpgsql security definer set search_path = public as $$
declare old uuid;
begin
  select owner into old from projects where id = pid;
  update projects set shop_id = null, shop_client = null where id = pid;
  update projects set owner = to_user where id = pid;
  delete from project_members where project_id = pid and user_id = old;
  insert into project_members (project_id, user_id, role) values (pid, to_user, 'owner')
    on conflict (project_id, user_id) do update set role = 'owner';
  update shared_builds set owner = to_user where project_id = pid;
  delete from project_transfers where project_id = pid;
end $$;
revoke all on function public.move_project(uuid, uuid) from public, anon, authenticated;

-- ---------- shop setup and staff ----------
create or replace function public.shop_setup(nm text, ph text, em text, ad text) returns uuid language plpgsql security definer set search_path = public as $$
declare sid uuid;
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  insert into shops (owner, name, phone, email, address) values (auth.uid(), left(btrim(coalesce(nm, '')), 80), left(btrim(coalesce(ph, '')), 40), left(btrim(coalesce(em, '')), 200), left(btrim(coalesce(ad, '')), 200))
    on conflict (owner) do update set name = excluded.name, phone = excluded.phone, email = excluded.email, address = excluded.address
    returning id into sid;
  return sid;
end $$;

create or replace function public.shop_add_staff(em text) returns text language plpgsql security definer set search_path = public as $$
declare sid uuid; uid uuid; e text := lower(btrim(coalesce(em, '')));
begin
  select id into sid from shops where owner = auth.uid();
  if sid is null then return 'denied'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return 'bad'; end if;
  if e = lower(coalesce(auth.jwt() ->> 'email', '')) then return 'self'; end if;
  if (select count(*) from shop_staff where shop_id = sid) + (select count(*) from shop_staff_invites where shop_id = sid) >= 10 then return 'full'; end if;
  select id into uid from auth.users where lower(email) = e;
  if uid is not null then
    insert into shop_staff (shop_id, user_id) values (sid, uid) on conflict do nothing;
    return 'added';
  end if;
  insert into shop_staff_invites (shop_id, email) values (sid, e) on conflict do nothing;
  return 'invited';
end $$;

create or replace function public.shop_staff_list() returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'staff', coalesce((select jsonb_agg(jsonb_build_object('user_id', t.user_id, 'email', u.email, 'name', p.display_name, 'added_at', t.added_at) order by t.added_at)
      from shop_staff t join auth.users u on u.id = t.user_id left join profiles p on p.id = t.user_id where t.shop_id = s.id), '[]'::jsonb),
    'invites', coalesce((select jsonb_agg(jsonb_build_object('email', i.email, 'created_at', i.created_at) order by i.created_at) from shop_staff_invites i where i.shop_id = s.id), '[]'::jsonb))
  from shops s where s.owner = auth.uid()
$$;

-- an invited mechanic joins the shop when they create their account
create or replace function public.apply_staff_invite() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into shop_staff (shop_id, user_id) select i.shop_id, new.id from shop_staff_invites i where lower(i.email) = lower(new.email) on conflict do nothing;
  delete from shop_staff_invites where lower(email) = lower(new.email);
  return new;
end $$;
drop trigger if exists on_auth_user_zz_staff on auth.users;
create trigger on_auth_user_zz_staff after insert on auth.users for each row execute function public.apply_staff_invite();

-- ---------- client bikes ----------
-- a new bike for a client, owned by the shop owner (staff can add bikes too)
create or replace function public.shop_new_bike(cid uuid, nm text) returns uuid language plpgsql security definer set search_path = public as $$
declare sid uuid; own uuid; pid uuid;
begin
  select c.shop_id, s.owner into sid, own from shop_clients c join shops s on s.id = c.shop_id where c.id = cid;
  if sid is null or public.shop_role(sid) is null then raise exception 'not in this shop'; end if;
  if not public.shop_plan_ok(sid) then raise exception 'the shop plan is not active'; end if;
  insert into projects (owner, bike_id, name, shop_id, shop_client) values (own, 'custom-bike', left(btrim(coalesce(nm, '')), 80), sid, cid) returning id into pid;
  return pid;
end $$;

-- a new code for a client (the old one stops working; a linked client account stays linked)
create or replace function public.shop_reset_code(cid uuid) returns text language plpgsql security definer set search_path = public as $$
declare sid uuid; c text;
begin
  select shop_id into sid from shop_clients where id = cid;
  if sid is null or public.shop_role(sid) is null then return null; end if;
  c := public.shop_new_code();
  update shop_clients set code = c, updated_at = now() where id = cid;
  return c;
end $$;

-- unlink a client's Revora account from the shop's card
create or replace function public.shop_unlink_client(cid uuid) returns text language plpgsql security definer set search_path = public as $$
declare sid uuid;
begin
  select shop_id into sid from shop_clients where id = cid;
  if sid is null or public.shop_role(sid) is null then return 'denied'; end if;
  update shop_clients set client_user = null, joined_at = null, updated_at = now() where id = cid;
  return 'ok';
end $$;

-- the shop owner hands a bike, with its whole history, to the client's own account
create or replace function public.shop_transfer_bike(pid uuid) returns text language plpgsql security definer set search_path = public as $$
declare sid uuid; cid uuid; own uuid; cu uuid; em text;
begin
  select p.shop_id, p.shop_client, p.owner into sid, cid, own from projects p where p.id = pid;
  if sid is null or public.shop_role(sid) <> 'owner' then return 'denied'; end if;
  select client_user, lower(btrim(email)) into cu, em from shop_clients where id = cid;
  if cu is not null then perform move_project(pid, cu); return 'moved'; end if;
  if coalesce(em, '') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then return 'noemail'; end if;
  select id into cu from auth.users where lower(email) = em;
  if cu is not null then perform move_project(pid, cu); return 'moved'; end if;
  insert into project_transfers (project_id, email, from_user) values (pid, em, own)
    on conflict (project_id) do update set email = excluded.email, from_user = excluded.from_user, created_at = now();
  return 'waiting';
end $$;

-- ---------- the client's side ----------
-- the shop's name for a code, shown on the sign-up page (nothing about the client)
create or replace function public.shop_code_info(c text) returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('shop', s.name, 'bikes', (select count(*) from projects p where p.shop_client = sc.id))
  from shop_clients sc join shops s on s.id = sc.shop_id where sc.code = upper(btrim(coalesce(c, '')))
$$;

-- the client links their account with the code from the shop
create or replace function public.shop_claim(c text) returns text language plpgsql security definer set search_path = public as $$
declare r record;
begin
  if auth.uid() is null then return 'signin'; end if;
  select * into r from shop_clients where code = upper(btrim(coalesce(c, '')));
  if r.id is null then return 'nocode'; end if;
  if r.client_user = auth.uid() then return 'ok'; end if;
  if r.client_user is not null then return 'taken'; end if;
  update shop_clients set client_user = auth.uid(), joined_at = now(), updated_at = now() where id = r.id;
  return 'ok';
end $$;

-- everything a client sees: their shop, their bikes' service history and what's due. No prices, no budget, no shop notes.
create or replace function public.client_home() returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'client_id', c.id, 'name', c.name, 'remind_ok', c.remind_ok,
    'shop', jsonb_build_object('name', s.name, 'phone', s.phone, 'email', s.email, 'address', s.address),
    'bikes', coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'name', p.name,
        'meta', (select jsonb_build_object('bike', r.data->>'bike', 'year', r.data->>'year', 'make', r.data->>'make', 'model', r.data->>'model', 'style', r.data->>'style', 'silhouette', r.data->>'silhouette', 'color', r.data->>'color')
                 from records r where r.project_id = p.id and r.coll = 'meta' and r.rec_id = 'project'),
        'maintenance', coalesce((select jsonb_agg((r.data - array['cost', 'partsCost', 'laborCost', 'receipt', 'receiptDoc', 'technician', 'notes']) || jsonb_build_object('id', r.rec_id))
                 from records r where r.project_id = p.id and r.coll = 'maintenance' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'schedule', coalesce((select jsonb_agg(jsonb_build_object('id', r.rec_id, 'name', r.data->>'name', 'category', r.data->>'category', 'everyMiles', r.data->'everyMiles', 'everyMonths', r.data->'everyMonths', 'lastDate', r.data->>'lastDate', 'lastMiles', r.data->'lastMiles', 'order', r.data->'order'))
                 from records r where r.project_id = p.id and r.coll = 'schedule' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'mileage', coalesce((select jsonb_agg(jsonb_build_object('date', r.data->>'date', 'miles', r.data->'miles'))
                 from records r where r.project_id = p.id and r.coll = 'mileage' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'workorders', coalesce((select jsonb_agg(jsonb_build_object('id', r.rec_id, 'title', r.data->>'title', 'status', r.data->>'status', 'dateIn', r.data->>'dateIn', 'promised', r.data->>'promised'))
                 from records r where r.project_id = p.id and r.coll = 'workorders' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb),
        'mods', coalesce((select jsonb_agg(jsonb_build_object('id', r.rec_id, 'name', r.data->>'name', 'brand', r.data->>'brand', 'status', r.data->>'status', 'date', r.data->>'date', 'category', r.data->>'category'))
                 from records r where r.project_id = p.id and r.coll = 'mods' and not coalesce((r.data->>'archived')::boolean, false)), '[]'::jsonb)
      ) order by p.created_at) from projects p where p.shop_client = c.id and p.shop_id = c.shop_id), '[]'::jsonb),
    'requests', coalesce((select jsonb_agg(jsonb_build_object('id', q.id, 'project_id', q.project_id, 'kind', q.kind, 'status', q.status, 'token', q.token, 'created_at', q.created_at, 'decided_at', q.decided_at) order by q.created_at desc)
      from shop_requests q where q.client_id = c.id), '[]'::jsonb)
  ) order by c.joined_at), '[]'::jsonb)
  from shop_clients c join shops s on s.id = c.shop_id where c.client_user = auth.uid()
$$;

-- the client asks to see the budget, the history report or the bike's value
create or replace function public.client_request(pid uuid, k text) returns text language plpgsql security definer set search_path = public as $$
declare sid uuid; cid uuid;
begin
  if k not in ('budget', 'report', 'value') then return 'bad'; end if;
  select p.shop_id, p.shop_client into sid, cid from projects p join shop_clients c on c.id = p.shop_client where p.id = pid and c.client_user = auth.uid();
  if sid is null then return 'denied'; end if;
  if exists (select 1 from shop_requests where project_id = pid and kind = k and status = 'pending') then return 'waiting'; end if;
  if (select count(*) from shop_requests where client_id = cid and created_at > now() - interval '1 day') >= 10 then return 'slow'; end if;
  insert into shop_requests (shop_id, client_id, project_id, kind) values (sid, cid, pid, k);
  return 'ok';
end $$;

-- the client takes a bike into their own garage. It leaves the shop for good.
create or replace function public.client_take_bike(pid uuid) returns text language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from projects p join shop_clients c on c.id = p.shop_client where p.id = pid and p.shop_id = c.shop_id and c.client_user = auth.uid()) then return 'denied'; end if;
  perform move_project(pid, auth.uid());
  return 'moved';
end $$;

-- the client stops seeing a shop
create or replace function public.client_leave(cid uuid) returns text language sql security definer set search_path = public as $$
  update shop_clients set client_user = null, joined_at = null, updated_at = now() where id = cid and client_user = auth.uid() returning 'ok'
$$;

-- ---------- approving requests, sending documents ----------
-- the shop approves (with the document it made) or declines; staff can't handle budgets
create or replace function public.shop_decide_request(rid uuid, ok boolean, doc jsonb) returns text language plpgsql security definer set search_path = public as $$
declare q record; ro text;
begin
  select * into q from shop_requests where id = rid;
  if q.id is null then return 'gone'; end if;
  ro := public.shop_role(q.shop_id);
  if ro is null or (ro = 'staff' and q.kind = 'budget') then return 'denied'; end if;
  if q.status <> 'pending' then return 'done'; end if;
  if ok and (doc is null or pg_column_size(doc) >= 400000) then return 'bad'; end if;
  update shop_requests set status = case when ok then 'approved' else 'declined' end, decided_at = now(), decided_by = auth.uid(),
    result = case when ok then doc end, token = case when ok then public.shop_token(28) end where id = rid;
  return 'ok';
end $$;

-- the shop sends a document to the client without being asked
create or replace function public.shop_send_doc(pid uuid, k text, doc jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare sid uuid; cid uuid; ro text; t text := public.shop_token(28); rid uuid;
begin
  if k not in ('budget', 'report', 'value') then return null; end if;
  select shop_id, shop_client into sid, cid from projects where id = pid;
  ro := public.shop_role(sid);
  if ro is null or cid is null or (ro = 'staff' and k = 'budget') then return null; end if;
  if doc is null or pg_column_size(doc) >= 400000 then return null; end if;
  insert into shop_requests (shop_id, client_id, project_id, kind, status, asked_by_client, token, result, decided_at, decided_by)
    values (sid, cid, pid, k, 'approved', false, t, doc, now(), auth.uid()) returning id into rid;
  return jsonb_build_object('id', rid, 'token', t);
end $$;

-- anyone with the link opens the document
create or replace function public.get_shop_doc(t text) returns jsonb language sql stable security definer set search_path = public as $$
  select q.result || jsonb_build_object('kind', q.kind, 'sent_at', q.decided_at) from shop_requests q where q.token = t and q.status = 'approved' and t ~ '^[A-Za-z0-9]{20,40}$'
$$;

-- the reminder emails' unsubscribe link
create or replace function public.shop_unsub(t text) returns text language sql security definer set search_path = public as $$
  update shop_clients c set remind_ok = false, updated_at = now() from shops s where s.id = c.shop_id and c.unsub = t returning s.name
$$;

-- ---------- for the email worker (uses the same secret as the billing worker) ----------
create or replace function public.shop_reminders_due(sec text) returns table (id uuid, email text, shop text, shop_phone text, shop_email text, unsub text, client text, bike text, kind text, title text, body text, send_on date, due_on date)
language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  return query
    select q.id, c.email, s.name, s.phone, s.email, c.unsub, c.name, q.bike, q.kind, q.title, q.body, q.send_on, q.due_on
    from shop_reminders q join shop_clients c on c.id = q.client_id join shops s on s.id = q.shop_id join projects p on p.id = q.project_id and p.shop_id = q.shop_id
    where q.sent_at is null and q.send_on <= current_date and q.send_on > current_date - 60
      and c.remind_ok and c.email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and public.shop_plan_ok(q.shop_id)
    order by q.send_on limit 500;
end $$;
create or replace function public.shop_reminders_mark(sec text, ids uuid[]) returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  update shop_reminders set sent_at = now() where shop_reminders.id = any(ids) and sent_at is null;
  get diagnostics n = row_count; return n;
end $$;
-- approved documents that haven't been emailed yet (rid = one request, or null for all of them)
create or replace function public.shop_docs_outbox(sec text, rid uuid) returns table (id uuid, email text, client text, shop text, shop_email text, kind text, token text, bike text)
language plpgsql security definer set search_path = public as $$
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  return query
    select q.id, coalesce(nullif(u.email, ''), c.email)::text, c.name, s.name, s.email, q.kind, q.token, p.name
    from shop_requests q join shop_clients c on c.id = q.client_id join shops s on s.id = q.shop_id join projects p on p.id = q.project_id
    left join auth.users u on u.id = c.client_user
    where q.status = 'approved' and q.emailed_at is null and q.decided_at > now() - interval '3 days' and (rid is null or q.id = rid)
      and coalesce(nullif(u.email, ''), c.email) ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    limit 100;
end $$;
create or replace function public.shop_docs_mark(sec text, ids uuid[]) returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if sec is null or btrim(sec) <> btrim((select secret from billing_secret where billing_secret.id = 1)) then raise exception 'denied'; end if;
  update shop_requests set emailed_at = now() where shop_requests.id = any(ids) and emailed_at is null;
  get diagnostics n = row_count; return n;
end $$;

-- ---------- who may call what ----------
revoke all on function public.shop_new_code() from public, anon, authenticated;
revoke all on function public.shop_token(int) from public, anon, authenticated;
revoke all on function public.check_project_shop() from public, anon, authenticated;
revoke all on function public.sync_shop_members() from public, anon, authenticated;
revoke all on function public.sync_staff_projects() from public, anon, authenticated;
revoke all on function public.apply_staff_invite() from public, anon, authenticated;
do $$ declare f text; begin
  foreach f in array array['shop_plan_ok(uuid)', 'my_shop()', 'shop_setup(text,text,text,text)', 'shop_add_staff(text)', 'shop_staff_list()',
    'shop_new_bike(uuid,text)', 'shop_reset_code(uuid)', 'shop_unlink_client(uuid)', 'shop_transfer_bike(uuid)', 'shop_claim(text)', 'client_home()',
    'client_request(uuid,text)', 'client_take_bike(uuid)', 'client_leave(uuid)', 'shop_decide_request(uuid,boolean,jsonb)', 'shop_send_doc(uuid,text,jsonb)'] loop
    execute 'revoke all on function public.' || f || ' from public, anon';
    execute 'grant execute on function public.' || f || ' to authenticated';
  end loop;
  foreach f in array array['shop_role(uuid)', 'shop_code_info(text)', 'get_shop_doc(text)', 'shop_unsub(text)', 'shop_reminders_due(text)', 'shop_reminders_mark(text,uuid[])', 'shop_docs_outbox(text,uuid)', 'shop_docs_mark(text,uuid[])'] loop
    execute 'revoke all on function public.' || f || ' from public';
    execute 'grant execute on function public.' || f || ' to anon, authenticated';
  end loop;
end $$;
-- the default code and token need these when a client row is added
grant execute on function public.shop_new_code() to authenticated;
grant execute on function public.shop_token(int) to authenticated;

select 'Revora Shop is ready' as done;
