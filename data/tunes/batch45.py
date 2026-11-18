"""Batch 45 bike tunes (top 500, rows 441-450)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch29 import DMS, KTMF
from batch44 import DUCNOTE, DESMOV
B45 = []
KTMNOTE = "KTM has issued recalls on some bikes in these years. Run your VIN at nhtsa.gov/recalls before you start."
BELTS = "Ducati timing belts are changed by time as well as miles. If you can't prove when they were done, do them before riding."

def duc(id, model, name, years, match, style, engine, intro, focus, lessons=None, drive="chain"):
    l = {"H": [DESMOV, BELTS]}
    l.update(lessons or {})
    return dict(id=id, make="Ducati", model=model, name=name, years=years, match=match, style=style, drive=drive, engine=engine, intro=intro, focus=focus,
                remove=EFI, patch={}, add=[], lessons=l, recalls=[], recallNote=DUCNOTE, known=[], forums=[DMS])

B45.append(duc("ducati-monster-937-2021", "Monster (937)", "Ducati Monster 937", [2021, 2026],
  ["monster 937", "monster plus", "monster sp", "monster 2021", "monster+"], "standard",
  "937 cc liquid-cooled Testastretta L-twin, fuel injected, aluminum front frame",
  "The newest Monster. Lighter than the old ones, with no trellis frame and lots of electronics.",
  [["937 cc L-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "Long interval"], ["Electronics", "Ride modes"], ["Chain drive", "Slack and lube"]]))
B45[-1]["lessons"] = {"H": [DESMOV]}

B45.append(duc("ducati-desertx-2022", "DesertX", "Ducati DesertX", [2022, 2026],
  ["desertx", "desert x", "desertx rally", "desertx discovery"], "adventure",
  "937 cc liquid-cooled Testastretta L-twin, fuel injected, 21-inch front wheel",
  "Ducati's off-road focused adventure bike. Tall, with a 21-inch front and the 937 twin.",
  [["937 cc L-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "Long interval"], ["Spoked wheels", "Check spokes"], ["Chain drive", "Slack and lube"]]))
B45[-1]["lessons"] = {"H": [DESMOV]}

B45.append(duc("ducati-diavel-2011", "Diavel / XDiavel", "Ducati Diavel / XDiavel", [2011, 2026],
  ["diavel", "xdiavel", "diavel carbon", "diavel 1260", "diavel v4", "xdiavel s"], "cruiser",
  "1198 to 1262 cc Testastretta L-twin (V4 from 2023), fuel injected",
  "Ducati's power cruiser. Big rear tire, big twin, and belt drive on the XDiavel.",
  [["Big twin or V4", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "On schedule"], ["Timing belts", "Change on time"], ["Final drive", "Chain or belt"]]))

B45.append(duc("ducati-st2-st3-st4-1997", "ST2 / ST3 / ST4", "Ducati ST2 / ST3 / ST4", [1997, 2007],
  ["st2", "st3", "st4", "st4s", "ducati st2", "ducati st4", "st3s"], "touring",
  "944 to 996 cc L-twin, air/liquid cooled, fuel injected",
  "Ducati's sport tourers. Fuel injected, desmo valves, timing belts and hard bags.",
  [["L-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "On schedule"], ["Timing belts", "Change on time"], ["Charging", "Check R/R"]]))

B45.append(duc("ducati-748-749-999-1995", "748 / 749 / 999", "Ducati 748 / 749 / 999", [1995, 2006],
  ["748", "749", "999", "ducati 748", "ducati 749", "ducati 999", "749s", "999s"], "sport",
  "748 to 998 cc liquid-cooled Testastretta or Desmoquattro L-twin, fuel injected",
  "The 748 and the Terblanche-era 749 and 999 superbikes. Desmo valves and timing belts that must be kept on schedule.",
  [["L-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "On schedule"], ["Timing belts", "Change on time"], ["Dry clutch", "Check basket"]]))

B45.append(duc("ducati-1098-1198-848-2007", "1098 / 1198 / 848", "Ducati 1098 / 1198 / 848", [2007, 2013],
  ["1098", "1198", "848", "ducati 1098", "ducati 1198", "848 evo", "1198s", "1098s"], "sport",
  "849 to 1198 cc liquid-cooled Testastretta L-twin, fuel injected",
  "The last trellis-frame Ducati superbikes. Desmo valves, timing belts and a dry clutch on the big ones.",
  [["L-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "On schedule"], ["Timing belts", "Change on time"], ["Dry clutch", "1098/1198"]]))

B45.append(duc("ducati-panigale-v4-2018", "Panigale V4", "Ducati Panigale V4", [2018, 2026],
  ["panigale v4", "panigale v4 s", "panigale v4 r", "v4 panigale", "streetfighter v4", "panigale v4s"], "sport",
  "1103 cc liquid-cooled Desmosedici Stradale V4, fuel injected",
  "Ducati's V4 superbike. Cam chains instead of belts, lots of electronics and tight packaging.",
  [["1103 cc V4", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "Long interval"], ["Electronics", "Ride modes"], ["Chain drive", "Slack and lube"]]))
B45[-1]["lessons"] = {"H": [DESMOV]}

B45.append(duc("ducati-scrambler-1100-2018", "Scrambler 1100", "Ducati Scrambler 1100", [2018, 2026],
  ["scrambler 1100", "scrambler 1100 sport", "scrambler 1100 special", "scrambler 1100 pro", "scrambler 1100 tribute"], "standard",
  "1079 cc air/oil-cooled L-twin, fuel injected",
  "The big air-cooled Scrambler. Two-valve desmo heads and timing belts.",
  [["1079 cc L-twin", "Air/oil cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "On schedule"], ["Timing belts", "Change on time"], ["Chain drive", "Slack and lube"]]))

B45.append(dict(id="ktm-200-250-390-duke-gen-2-3-2017", make="KTM", model="125 / 200 / 250 Duke", name="KTM 125 / 200 / 250 Duke", years=[2017, 2026],
  match=["200 duke", "250 duke", "125 duke", "duke 200", "duke 250", "duke 125"], style="standard", drive="chain",
  engine="125 to 249 cc liquid-cooled single, fuel injected",
  intro="KTM's small Dukes. Fuel injected singles on a trellis frame.",
  focus=[["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check interval"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=KTMNOTE, known=[], forums=[KTMF]))

B45.append(dict(id="ktm-rc-390-2015", make="KTM", model="RC 390", name="KTM RC 390", years=[2015, 2026],
  match=["rc 390", "rc390", "rc 200", "rc 125", "ktm rc"], style="sport", drive="chain",
  engine="373 or 399 cc liquid-cooled single, fuel injected",
  intro="KTM's small faired sportbike. Fuel injected single, tight bodywork.",
  focus=[["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check interval"], ["Bodywork", "Many fasteners"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=KTMNOTE, known=[], forums=[KTMF]))

HERO_NAME_B45 = {"ducati-monster-937-2021": "MONSTER", "ducati-desertx-2022": "DESERTX", "ducati-diavel-2011": "DIAVEL", "ducati-st2-st3-st4-1997": "ST4",
  "ducati-748-749-999-1995": "999", "ducati-1098-1198-848-2007": "1098", "ducati-panigale-v4-2018": "PANIGALE V4", "ducati-scrambler-1100-2018": "SCRAMBLER 1100",
  "ktm-200-250-390-duke-gen-2-3-2017": "DUKE", "ktm-rc-390-2015": "RC 390"}
