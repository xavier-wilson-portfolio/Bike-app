# Revora (multi-bike)

Restoration help for your exact motorcycle: parts diagrams, part numbers, a step-by-step course and a parts tracker.
Pick your bike, and the whole site fills in from that bike's pack.

## How it's laid out

- `src/` the app, shared by every bike. `src/loader.js` runs first: it picks the bike, fetches its pack, then loads `app.js`.
- `data/packs/<bike-id>/` one folder per bike:
  - `bike.json` year, make, model, specs, shop links, and which extras it has (`extras`: `diagrams3d`, `garage3d`, `paint`, `videos`, `handDiagrams`)
  - `cms/*.json` the parts catalogue, one file per diagram page (reference, part number, name, replacement number)
  - `baseline.json` the starter project: course steps, parts, checks
  - `thumbs/*.webp` optional pictures for 3D diagram cards
- `build/build.py` writes the site to `public/`: `index.html`, `app.js`, `packs/index.json` and `packs/<id>/pack.json`.

## Adding a bike

1. Make `data/packs/<year-make-model>/bike.json` (copy the GS750 one and change it; leave `extras` empty).
2. Add the catalogue pages to `cms/`.
3. Add `baseline.json` (start from the GS750 one).
4. `python3 build/build.py`

Specs and part numbers must come from a real source. If a number isn't known, write VERIFY IN FACTORY SERVICE MANUAL.

## Run locally

    python3 build/build.py && cd public && python3 -m http.server 8000
