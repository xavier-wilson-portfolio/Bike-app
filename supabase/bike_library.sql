-- Revora bike library: real specs per bike generation, each number with its source page.
-- Paid members get every number. Free members and guests get one real number (oil with filter change)
-- and the rest hidden, so the real values never leave the database for them.
-- New bikes are queued and built by the library worker (library-worker/worker.js), which signs in with WORKER_SECRET.

create table if not exists public.bike_library (
  id text primary key,
  make text not null,
  model text not null,
  y0 int, y1 int,           -- years the source manual covers
  n0 int, n1 int,           -- years of the same generation (close enough to show, with a "check yours" note)
  match text[] not null default '{}',
  data jsonb not null,      -- specs, torque, sources, diagrams, guides
  status text not null default 'ready',   -- ready | partial (some numbers not found)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.bike_library enable row level security;   -- no direct access; only through the functions below

create table if not exists public.library_queue (
  id bigserial primary key,
  key text not null unique,            -- year|make|model, lowercased
  year int, make text not null, model text not null,
  requested_by uuid,
  status text not null default 'queued',   -- queued | working | done | none | failed
  tries int not null default 0,
  library_id text,
  note text,
  created_at timestamptz not null default now(),
  started_at timestamptz, done_at timestamptz
);
alter table public.library_queue enable row level security;

create table if not exists public.library_keys (id int primary key default 1, secret text not null, check (id = 1));
alter table public.library_keys enable row level security;
insert into public.library_keys (id, secret) values (1, md5(random()::text || clock_timestamp()::text) || md5(random()::text || txid_current()::text)) on conflict (id) do nothing;

create or replace function public._lib_norm(s text) returns text language sql immutable as $$ select regexp_replace(lower(coalesce(s, '')), '[^a-z0-9]+', '', 'g') $$;

create or replace function public._lib_paid() returns boolean language plpgsql stable security definer set search_path = public as $$
declare p record; pl text;
begin
  if auth.uid() is null then return false; end if;
  if lower(coalesce(auth.jwt() ->> 'email', '')) = 'xavier.j.wilson101@gmail.com' then return true; end if;
  select plan, plan_until into p from profiles where id = auth.uid();
  pl := coalesce(p.plan, 'free');
  if pl <> 'free' and p.plan_until is not null and p.plan_until < now() then pl := 'free'; end if;
  return pl <> 'free';
end $$;

create or replace function public._lib_find(mk text, mdl text, yr int) returns public.bike_library language plpgsql stable security definer set search_path = public as $$
declare r public.bike_library; m text := _lib_norm(mdl); k text := _lib_norm(mk);
begin
  if k = '' or m = '' then return null; end if;
  select * into r from bike_library b
   where _lib_norm(b.make) = k
     and exists (select 1 from unnest(b.match || array[b.model]) x where _lib_norm(x) <> '' and (m = _lib_norm(x) or m like _lib_norm(x) || '%' or position(_lib_norm(x) in m) > 0))
   order by (yr is null or (yr between b.y0 and b.y1)) desc, (yr is null or (yr between b.n0 and b.n1)) desc, b.updated_at desc
   limit 1;
  if r.id is null then return null; end if;
  if yr is not null and not (yr between coalesce(r.n0, r.y0) and coalesce(r.n1, r.y1)) then return null; end if;
  return r;
end $$;

-- what the bike page asks for. Returns { found, full, entry, queue }
create or replace function public.lib_lookup(mk text, mdl text, yr int default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare r public.bike_library; is_full boolean := _lib_paid(); d jsonb; q record; masked jsonb;
begin
  r := _lib_find(mk, mdl, yr);
  select status, created_at, note into q from library_queue where key = lower(coalesce(yr::text, '') || '|' || _lib_norm(mk) || '|' || _lib_norm(mdl));
  if r.id is null then
    return jsonb_build_object('found', false, 'full', is_full, 'queue', case when q.status is null then null else jsonb_build_object('status', q.status, 'since', q.created_at, 'note', q.note) end);
  end if;
  d := r.data || jsonb_build_object('id', r.id, 'make', r.make, 'model', r.model, 'years', jsonb_build_array(r.y0, r.y1), 'near', jsonb_build_array(r.n0, r.n1), 'status', r.status);
  if not is_full then
    -- keep one real number as a taste; hide the rest (same length, so the blur looks right)
    select coalesce(jsonb_agg(case when s ->> 'k' = 'oilCap' then s else s || jsonb_build_object('v', regexp_replace(s ->> 'v', '[0-9]', '8', 'g'), 'locked', true) end), '[]'::jsonb)
      into masked from jsonb_array_elements(coalesce(d -> 'specs', '[]')) s;
    d := d || jsonb_build_object('specs', masked,
      'torque', (select coalesce(jsonb_agg(t || jsonb_build_object('v', regexp_replace(t ->> 'v', '[0-9]', '8', 'g'), 'locked', true)), '[]'::jsonb) from jsonb_array_elements(coalesce(d -> 'torque', '[]')) t),
      'diagrams', '{}'::jsonb, 'locked', true);
  end if;
  return jsonb_build_object('found', true, 'full', is_full, 'entry', d);
end $$;

-- ask for a bike that isn't in the library yet. Anyone signed in can queue it (an upgrade starts it early);
-- the worker only builds it once the person who asked is on a paid plan.
create or replace function public.lib_request(mk text, mdl text, yr int default null) returns text language plpgsql security definer set search_path = public as $$
declare k text;
begin
  if auth.uid() is null then return 'signin'; end if;
  if length(coalesce(mk, '')) < 2 or length(coalesce(mdl, '')) < 1 or length(mk) > 40 or length(mdl) > 60 then return 'bad'; end if;
  if (_lib_find(mk, mdl, yr)).id is not null then return 'ready'; end if;
  k := lower(coalesce(yr::text, '') || '|' || _lib_norm(mk) || '|' || _lib_norm(mdl));
  insert into library_queue (key, year, make, model, requested_by) values (k, yr, trim(mk), trim(mdl), auth.uid())
    on conflict (key) do update set requested_by = coalesce(library_queue.requested_by, excluded.requested_by),
      status = case when library_queue.status in ('failed') and library_queue.tries < 3 then 'queued' else library_queue.status end;
  return 'queued';
end $$;

-- ---------- worker side (WORKER_SECRET) ----------
create or replace function public._lib_ok(s text) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from library_keys where id = 1 and secret = s) $$;

-- next bike to build: oldest queued one whose asker is paying (or the admin). Marks it working.
create or replace function public.lib_queue_next(s text) returns jsonb language plpgsql security definer set search_path = public as $$
declare q record;
begin
  if not _lib_ok(s) then return null; end if;
  update library_queue set status = 'queued' where status = 'working' and started_at < now() - interval '10 minutes';
  select lq.* into q from library_queue lq left join profiles p on p.id = lq.requested_by
   where lq.status = 'queued' and lq.tries < 3
     and (coalesce(p.plan, 'free') <> 'free' and (p.plan_until is null or p.plan_until > now())
          or lq.requested_by in (select id from auth.users where lower(email) = 'xavier.j.wilson101@gmail.com'))
   order by lq.created_at limit 1 for update of lq skip locked;
  if q.id is null then return null; end if;
  update library_queue set status = 'working', started_at = now(), tries = tries + 1 where id = q.id;
  return jsonb_build_object('id', q.id, 'year', q.year, 'make', q.make, 'model', q.model,
    'built_today', (select count(*) from library_queue where done_at > now() - interval '1 day' and status in ('done', 'none')));
end $$;

create or replace function public.lib_save(s text, qid bigint, e jsonb, outcome text) returns text language plpgsql security definer set search_path = public as $$
declare lid text;
begin
  if not _lib_ok(s) then return 'denied'; end if;
  if outcome = 'done' and e is not null and e ? 'id' then
    lid := e ->> 'id';
    insert into bike_library (id, make, model, y0, y1, n0, n1, match, data, status)
    values (lid, e ->> 'make', e ->> 'model', (e -> 'years' ->> 0)::int, (e -> 'years' ->> 1)::int, (e -> 'near' ->> 0)::int, (e -> 'near' ->> 1)::int,
            coalesce(array(select jsonb_array_elements_text(e -> 'match')), '{}'), e - 'id' - 'make' - 'model' - 'years' - 'near' - 'match', coalesce(e ->> 'status', 'ready'))
    on conflict (id) do update set data = excluded.data, match = excluded.match, y0 = excluded.y0, y1 = excluded.y1, n0 = excluded.n0, n1 = excluded.n1, status = excluded.status, updated_at = now();
  end if;
  update library_queue set status = case when outcome in ('done', 'none', 'failed', 'queued') then outcome else 'failed' end,
    library_id = coalesce(lid, library_id), done_at = case when outcome in ('done', 'none') then now() else done_at end,
    note = left(e ->> 'note', 300) where id = qid;
  return 'ok';
end $$;


revoke all on function public.lib_queue_next(text), public.lib_save(text, bigint, jsonb, text), public._lib_ok(text), public._lib_find(text, text, int), public._lib_paid() from public;
grant execute on function public.lib_queue_next(text), public.lib_save(text, bigint, jsonb, text) to anon, authenticated;
grant execute on function public.lib_lookup(text, text, int) to anon, authenticated;
grant execute on function public.lib_request(text, text, int) to authenticated;

-- the worker's secret: copy it from here into the worker's WORKER_SECRET setting
-- select secret from public.library_keys;
