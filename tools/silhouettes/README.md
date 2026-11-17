# Bike pictures, step by step (run for every new bike)

1. Find a licensed side-view photo of the exact model and generation on Wikimedia Commons
   (CC BY, CC BY-SA, CC0 or public domain). Plain background traces best. Add it to meta.json with
   the file name, page, artist and license.
2. `grab2.py <id>`: cuts the bike out of the photo. Add a box entry for the bike (outer box, sure
   background, sure bike) and a wheel entry in wfit.py, then check chk-<id>.jpg by eye.
3. `trace.py <id>`: the bike's own silhouette, a straight scan of the photo with nothing drawn in.
   Copy out-<id>.svg to img/sil/<id>.svg and add its credit to img/sil/credits.json.
4. `make_heroes.py`: the project header. Real photo, color grade, tan filter over the photo, model
   name in Revora light blue (#8DBBD8) behind the bike. Writes img/hero/<id>.jpg. Set the name in
   HERO_NAME in data/tunes/make_tunes.py.
5. `python3 data/tunes/make_tunes.py`, then `python3 build/build.py`.

Course covers (engine, tank, wheel, rear, headlight) are not made per bike: each bike uses its
style's set (`style_covers.py`, files like engine-standard.svg). Brakes and tools covers are shared.
An owner's own photo gets the same grade and tan filter in the browser, with the name across the top.

Update: step 2 now uses `isnet.py <id>` (the IS-Net background-removal model, isnet-general-use.onnx
from the rembg releases on GitHub) on the photos the `bike-photos` GitHub workflow downloads. It cuts
the bike out in about two seconds and is much cleaner than the hand-boxed GrabCut in grab2.py, which is
kept only as a fallback. Check chk-<id>.jpg by eye: a second bike parked right behind can get kept.
