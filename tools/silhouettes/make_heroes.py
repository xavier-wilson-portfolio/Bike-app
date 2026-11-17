"""Project header for each library bike: the real photo, color graded, tan filter, model name
in Revora blue behind the bike. Needs scaled-<id>.jpg and mask-<id>.npy from grab2.py.
Writes img/hero/<id>.jpg. Run from the folder that holds the scaled photos and masks."""
import json, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import hero_lib
from PIL import ImageDraw
R = pathlib.Path(__file__).resolve().parents[2]
hero_lib.W, hero_lib.H = 1600, 900
import hero as H0; H0.W, H0.H = 1600, 900
def build(i, name):
    img = hero_lib.hero(i, name, "")
    return img
if __name__ == "__main__":
    out = R / "img" / "hero"; out.mkdir(exist_ok=True)
    for t in sorted((R / "data" / "tunes").glob("*.json")):
        if t.name == "index.json": continue
        j = json.loads(t.read_text())
        if not j.get("heroName") or not pathlib.Path(f"mask-{j['id']}.npy").exists(): continue
        build(j["id"], j["heroName"]).save(out / f"{j['id']}.jpg", quality=86, optimize=True, progressive=True)
        print(j["id"])
