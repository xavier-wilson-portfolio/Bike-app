-- Revora library: let a short make name match ("Harley" finds Harley-Davidson). Safe to run again.
create or replace function public._lib_find(mk text, mdl text, yr int) returns public.bike_library language plpgsql stable security definer set search_path = public as $$
declare r public.bike_library; m text := _lib_norm(mdl); k text := _lib_norm(mk);
begin
  if k = '' or m = '' then return null; end if;
  select * into r from bike_library b
   where (_lib_norm(b.make) = k or (length(k) >= 4 and _lib_norm(b.make) like k || '%'))
     and exists (select 1 from unnest(b.match || array[b.model]) x where _lib_norm(x) <> '' and (m = _lib_norm(x) or m like _lib_norm(x) || '%' or position(_lib_norm(x) in m) > 0))
   order by (yr is null or (yr between b.y0 and b.y1)) desc, (yr is null or (yr between b.n0 and b.n1)) desc, b.updated_at desc
   limit 1;
  if r.id is null then return null; end if;
  if yr is not null and not (yr between coalesce(r.n0, r.y0) and coalesce(r.n1, r.y1)) then return null; end if;
  return r;
end $$;
