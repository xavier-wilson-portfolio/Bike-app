"""Build the multi-bike app.

public/
  index.html          loader: picks the bike, fetches its pack, then loads app.js
  app.js              the shared app (same for every bike)
  packs/index.json    every bike in the library (for search)
  packs/<id>/pack.json      bike info, specs, parts catalogue, diagram thumbnails
  packs/<id>/baseline.json  starter project records (course tasks, parts, checks)
  img/                shared images
"""
import pathlib, json, glob, base64, shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = ROOT / 'src'
out = ROOT / 'public'
out.mkdir(exist_ok=True)

ORDER = ['core.js', 'model.js', 'content.js', 'howto.js', 'art_data.js', 'ui.js', 'plan_gate.js', 'vehicle.js', 'views.js', 'views2.js', 'views3.js', 'views4.js', 'maint.js', 'remind.js', 'mods.js', 'report.js', 'build.js', 'value.js', 'finder.js', 'shop.js', 'workorders.js', 'receipts.js',
         'twin_data.js', 'twin_internals.js', 'twin.js', 'viewer.js', 'diag_draw.js', 'diag_data.js', 'diag_data2.js', 'diag_cms.js', 'diag_gen.js',
         *sorted(p.name for p in src.glob('d3_*.js')), 'd3.js', 'diag.js', 'scan.js', 'chat.js', 'universal.js', 'feedback.js', 'generic.js', 'costs.js', 'papers.js', 'checklists.js', 'wear.js', 'recalls.js', 'plans.js', 'delete_bike.js']
app = '\n'.join((src / f).read_text() for f in ORDER) + '\nboot();\n'
(out / 'app.js').write_text(app)

# ---- packs ----
index = []
for pdir in sorted((ROOT / 'data' / 'packs').iterdir()):
    if not pdir.is_dir():
        continue
    bike = json.loads((pdir / 'bike.json').read_text())
    if (pdir / 'content.json').exists():   # per-bike course, guides, shops and how-tos
        bike['content'] = json.loads((pdir / 'content.json').read_text())
    cms = {pathlib.Path(f).stem: json.load(open(f)) for f in sorted(glob.glob(str(pdir / 'cms' / '*.json')))}
    thumbs = {pathlib.Path(f).stem: 'data:image/webp;base64,' + base64.b64encode(open(f, 'rb').read()).decode()
              for f in sorted(glob.glob(str(pdir / 'thumbs' / '*.webp')))}
    pack = {'bike': bike, 'catalogue': cms, 'thumbs': thumbs}
    od = out / 'packs' / bike['id']
    od.mkdir(parents=True, exist_ok=True)
    (od / 'pack.json').write_text(json.dumps(pack, separators=(',', ':'), ensure_ascii=False))
    if (pdir / 'baseline.json').exists():
        shutil.copy(pdir / 'baseline.json', od / 'baseline.json')
    index.append({k: bike.get(k) for k in ['id', 'year', 'make', 'model', 'variant', 'name', 'short', 'match', 'extras', 'status', 'generic', 'universal', 'styleName', 'reqKeys', 'style', 'silhouette']}
                 | {'diagrams': len(cms)})
(out / 'packs' / 'index.json').write_text(json.dumps(index, separators=(',', ':'), ensure_ascii=False))

shutil.copytree(ROOT / 'img', out / 'img', dirs_exist_ok=True)

css = (src / 'style.css').read_text()
loader = (src / 'cloud.js').read_text() + '\n' + (src / 'report_view.js').read_text() + '\n' + (src / 'build_view.js').read_text() + '\n' + (src / 'wo_view.js').read_text() + '\n' + (src / 'plans_view.js').read_text() + '\n' + (src / 'shop_view.js').read_text() + '\n' + (src / 'loader.js').read_text()
cfg_file = ROOT / 'data' / 'config.json'   # public settings only: Supabase URL and publishable key
cfg = json.loads(cfg_file.read_text()) if cfg_file.exists() else {}
import hashlib
build_id = hashlib.sha1((app + css).encode()).hexdigest()[:10]
loader = 'window.RV_BUILD = "' + build_id + '";\n' + loader
sil = sorted(p.name for p in (ROOT / 'img' / 'sil').glob('*') if p.suffix in ('.webp', '.png', '.jpg', '.svg'))   # black silhouette covers that exist
loader = 'window.RV_CONFIG = ' + json.dumps({**{k: cfg.get(k) for k in ['supabaseUrl', 'supabaseKey', 'aff', 'plansLive', 'payLinks', 'billingPortal', 'primaryHost'] if cfg.get(k)}, 'sil': sil, 'silCredit': json.loads((ROOT / 'img' / 'sil' / 'credits.json').read_text()) if (ROOT / 'img' / 'sil' / 'credits.json').exists() else {}}) + ';\n' + loader
html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Revora</title>
<meta name="description" content="Restore your motorcycle: parts diagrams, part numbers, a step-by-step course and a parts tracker for your exact bike.">
<link rel="icon" type="image/svg+xml" href="img/revora-icon.svg"><link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#17232C"><link rel="apple-touch-icon" href="img/apple-touch-icon.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Revora"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@400;500&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;1,6..12,400&display=swap">
<style>:root{{color-scheme:light}}[hidden]{{display:none!important}}body{{margin:0}}img{{max-width:100%}}
{css}
</style></head><body>
<div id="app"></div>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/environments/RoomEnvironment.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/geometries/RoundedBoxGeometry.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/utils/BufferGeometryUtils.js"></script>
<script>
{loader}
</script>
</body></html>
'''
(out / 'index.html').write_text(html)

# ---- install as an app: manifest and a small service worker that keeps the app shell for offline starts ----
(out / 'manifest.webmanifest').write_text(json.dumps({
    "name": "Revora", "short_name": "Revora", "description": "Your bike's restoration course, maintenance log, receipts and records.",
    "start_url": "./", "scope": "./", "display": "standalone", "background_color": "#17232C", "theme_color": "#17232C",
    "icons": [{"src": "img/app-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "img/app-512.png", "sizes": "512x512", "type": "image/png"},
              {"src": "img/app-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}, indent=1))
(out / 'sw.js').write_text((src / 'sw.js').read_text().replace('__BUILD__', build_id))
print('app.js', len(app), 'bikes', len(index))
