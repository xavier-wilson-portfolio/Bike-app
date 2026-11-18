"""Batch 21 bike tunes (top 500, rows 201-210)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B21 = []
CB750F = dict(name="CB750.com", url="https://www.cb750.com/", what="Owner forum for SOHC and DOHC CB750s.")
CBR = dict(name="CBR Forum", url="https://www.cbrforum.com/", what="Owner forum for Honda CBR models.")
REFLECTOR = dict(id="21V382", years="2020-2021 (some)", what="Rear reflector lens may be too dim to meet the lighting standard.", fix="Dealer replaces the rear reflector free.", src="https://vehiclesafetyrecalls.com/recall/21V382000")

B21.append(dict(id="honda-cb750-dohc-1979", make="Honda", model="CB750 DOHC", name="Honda CB750 DOHC", years=[1979, 1983],
  match=["cb750 dohc", "cb750k", "cb750f", "cb750c", "cb750 custom", "cb750 super sport", "cb750k ltd", "cb750 1980", "cb750 1981", "cb750 1982"], style="standard", drive="chain",
  engine="749 cc air-cooled DOHC 16-valve inline four, four carbs",
  intro="The twin-cam CB750 that replaced the SOHC. The primary chain tensioner and the cam chain tensioner are the parts to check.",
  focus=[["749 cc DOHC four", "Air-cooled, 16 valves"], ["Four carbs", "Rebuild as a set"], ["Primary tensioner", "Wheels wear"], ["Cam chain", "Manual tensioner"], ["Charging", "Check R/R"]],
  remove=CARB + AIR, patch={},
  add=[step("X-CBD-01", "B", "B-004", "Listen for a knock low in the engine", "Start it cold and listen near the starter motor area. A knock there can be a worn primary chain tensioner. Drop the oil pan and look for pieces of the tensioner wheels.", "Worn primary chain tensioners are a known DOHC CB750 problem, and the parts are hard to find new.", "cb750.com forum", hours=0.5)],
  lessons={"G": ["Rebuild one carb at a time and keep each one's parts apart."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Primary chain tensioner", what="Owners report knocking near the starter from a worn primary chain tensioner. Parts are no longer sold by Honda.", src="https://www.cb750.com/goto/post?id=13801")],
  forums=[CB750F]))

B21.append(dict(id="honda-cb500f-cb500x-2013", make="Honda", model="CB500F / CB500X", name="Honda CB500F / CB500X", years=[2013, 2026],
  match=["cb500f", "cb500x", "cb 500f", "cb 500x", "cb500", "nx500"], style="standard", drive="chain",
  engine="471 cc liquid-cooled parallel twin, fuel injected",
  intro="Honda's light 500 twin. Several model years have recalls, from rocker arm bolts to the ABS unit.",
  focus=[["471 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "Several years"], ["Chain drive", "Slack and lube"], ["Valves", "Shim type"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Early 2013 CB500X bikes are in recall 14V056 (rocker arm shaft bolts). 2014-2015 bikes are in recall 15V439 (starter relay). Some 2019-2020 CB500X ABS bikes are in recall 21V690 (ABS modulator leak). Some 2020-2021 bikes are in recall 21V382 (rear reflector).", reason="Each fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="14V056", years="2013 (Apr-Jul build)", what="Rocker arm shaft retaining bolts may loosen.", fix="Dealer replaces the bolts free.", src="https://auto-recalls.justia.com/honda/cb500x/2013/14v056000"),
           dict(id="15V439", years="2014-2015", what="Starter relay switch problem.", fix="Dealer replaces the starter relay free.", src="https://recallcheck.net/recall/15V439000"),
           dict(id="21V690", years="2019-2020 CB500X ABS (some)", what="Excess grease in the ABS modulator can trap debris and leak brake fluid.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/honda/cb500x/2020/21v690000"),
           REFLECTOR],
  known=[], forums=[]))

B21.append(dict(id="honda-cb650r-2019", make="Honda", model="CB650R", name="Honda CB650R", years=[2019, 2026],
  match=["cb650r", "cb 650r", "cb650f", "cbr650r", "cbr650f"], style="standard", drive="chain",
  engine="649 cc liquid-cooled inline four, fuel injected",
  intro="Honda's Neo Sports Cafe four. Some 2024 bikes have a gear shift arm recall.",
  focus=[["649 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Shift arm recall", "2024"], ["Chain drive", "Slack and lube"], ["Valves", "Shim type"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2024 bikes are in recall 25V107 (gear shift arm can come off). Some 2020-2021 bikes are in recall 21V382 (rear reflector).", reason="Losing the shifter means you can't change gear. The fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="25V107", years="2024 (some)", what="Gear shift arm fasteners may loosen and the arm may come off, so you can't shift.", fix="Dealer replaces the gear shift arm free.", src="https://vehiclesafetyrecalls.com/recall/25V107000"),
           REFLECTOR],
  known=[], forums=[]))

B21.append(dict(id="honda-cbr600f4i-1999", make="Honda", model="CBR600F4i", name="Honda CBR600F4 / F4i", years=[1999, 2006],
  match=["cbr600f4i", "cbr600f4", "f4i", "cbr 600 f4i", "cbr600 f4"], style="sport", drive="chain",
  engine="599 cc liquid-cooled inline four, carbs (F4) or fuel injected (F4i)",
  intro="The last of Honda's all-round CBR600F line. The 1999-2000 F4 has carbs, the 2001-2006 F4i is fuel injected.",
  focus=[["599 cc four", "Liquid-cooled"], ["Carb or EFI", "F4 or F4i"], ["Cam chain tensioner", "Listen for it"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=[], patch={},
  add=[step("X-F4-01", "B", "B-004", "Listen for cam chain tensioner rattle", "Start it cold and listen at the right side of the head. A rattle that fades as it warms can be the cam chain tensioner.", "Owners have reported repeated cam chain tensioner trouble on these bikes.", "NHTSA owner complaint", hours=0.3)],
  lessons={"G": ["1999-2000 F4 bikes have carbs. 2001-2006 F4i bikes are fuel injected. Skip the steps that don't match."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Cam chain tensioner", what="An owner complaint to NHTSA reports ongoing cam chain tensioner trouble on a 2002 F4i.", src="https://vehicleflaws.com/vehicle/honda/cbr600f4/2002")],
  forums=[CBR]))

B21.append(dict(id="honda-cbr900rr-fireblade-1992", make="Honda", model="CBR900RR Fireblade", name="Honda CBR900RR Fireblade", years=[1992, 1999],
  match=["cbr900rr", "cbr 900rr", "fireblade", "cbr893", "cbr918", "cbr919", "cbr900"], style="sport", drive="chain",
  engine="893 or 918 cc liquid-cooled inline four, carbs",
  intro="The original light superbike. Carbs, a 16-inch front wheel on early bikes, and a lot of 1990s plastic to get off.",
  focus=[["893/918 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Charging", "Check R/R"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={},
  add=[], lessons={"G": ["Rebuild one carb at a time and keep each one's parts apart."]},
  recalls=[], recallNote=OLD, known=[], forums=[CBR]))

B21.append(dict(id="honda-cbr1100xx-blackbird-1997", make="Honda", model="CBR1100XX Blackbird", name="Honda CBR1100XX Blackbird", years=[1997, 2007],
  match=["cbr1100xx", "blackbird", "cbr 1100xx", "cbr1100", "super blackbird"], style="sport", drive="chain",
  engine="1137 cc liquid-cooled inline four, carbs (1997-98) or fuel injected (1999-2007)",
  intro="Honda's big sport tourer. Early bikes have carbs, later ones are fuel injected. Linked brakes need care when bleeding.",
  focus=[["1137 cc four", "Liquid-cooled"], ["Carb or EFI", "Depends on year"], ["Linked brakes", "Bleed order"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=[], patch={},
  add=[], lessons={"G": ["1997-1998 bikes have carbs. 1999-on bikes are fuel injected. Skip the steps that don't match."], "K": ["The front and rear brakes are linked. Bleed them in the order the manual gives."]},
  recalls=[], recallNote=VIN, known=[], forums=[CBR]))

B21.append(dict(id="honda-shadow-600-vlx-1988", make="Honda", model="Shadow 600 VLX", name="Honda Shadow VLX 600", years=[1988, 2007],
  match=["vlx", "vlx600", "shadow 600", "vt600", "vt600c", "vt600cd", "shadow vlx", "shadow vlx deluxe"], style="cruiser", drive="chain",
  engine="583 cc liquid-cooled V-twin, single carb",
  intro="A small, simple Shadow. One carb, chain drive, and a lot of them sat for years before resale.",
  focus=[["583 cc V-twin", "Liquid-cooled"], ["Single carb", "Clean it out"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"], ["Fuel petcock", "Vacuum type"]],
  remove=CARB, patch={},
  add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[dict(name="Shadow Riders", url="https://www.shadowriders.com/", what="Owner forum for Honda Shadows.")]))

B21.append(dict(id="honda-valkyrie-1500-1997", make="Honda", model="Valkyrie 1500", name="Honda Valkyrie (GL1500C)", years=[1997, 2003],
  match=["valkyrie", "gl1500c", "valkyrie 1500", "valkyrie interstate", "gl1500cf", "valkyrie tourer"], style="cruiser", drive="shaft",
  engine="1520 cc liquid-cooled flat six, six carbs, shaft drive",
  intro="A Gold Wing flat six in a cruiser. Six carbs to sync, and a shaft drive to grease.",
  focus=[["1520 cc flat six", "Liquid-cooled"], ["Six carbs", "Sync them"], ["Shaft drive", "Spline lube"], ["Rear wheel bearings", "Check"], ["Cooling", "Hoses and fan"]],
  remove=CARB, patch={},
  add=[step("X-VK-01", "L", "L-001", "Check the rear wheel bearings", "With the rear wheel off the ground, rock it side to side and spin it. Any play or roughness means new bearings.", "Owners of the Interstate model have reported repeated rear wheel bearing failures.", "NHTSA owner complaint", hours=0.5)],
  lessons={"G": ["Sync all six carbs after a rebuild. It is a long job, so set aside the time."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Rear wheel bearings", what="An owner of a 1999 Valkyrie Interstate reported the left rear wheel bearing failing three times.", src="https://vehicleflaws.com/vehicle/honda/gl1500cf/1999")],
  forums=[dict(name="Valkyrie Riders Cruiser Club", url="https://www.valkyrieforum.com/", what="Owner club and forum for Valkyries.")]))

B21.append(dict(id="honda-pacific-coast-pc800-1989", make="Honda", model="Pacific Coast PC800", name="Honda Pacific Coast PC800", years=[1989, 1998],
  match=["pc800", "pacific coast", "pc 800", "pacific coast 800"], style="touring", drive="shaft",
  engine="800 cc liquid-cooled V-twin, carbs, shaft drive",
  intro="Honda's enclosed commuter tourer. Most of the work is getting the bodywork off without breaking tabs.",
  focus=[["800 cc V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Bodywork", "Old plastic tabs"], ["Shaft drive", "Spline lube"], ["Cooling", "Hoses and fan"]],
  remove=CARB, patch={},
  add=[step("X-PC8-01", "A", "A-002", "Take the bodywork off with care", "Follow the panel order in the manual. Bag and label every screw. Old plastic tabs crack, so work slowly and warm the panels if it's cold.", "Nearly every job on a PC800 starts with removing the body panels.", "Owner experience", skill="Beginner", hours=1.5)],
  lessons={}, recalls=[], recallNote=OLD, known=[], forums=[]))

B21.append(dict(id="honda-hawk-gt-nt650-1988", make="Honda", model="Hawk GT NT650", name="Honda Hawk GT (NT650)", years=[1988, 1991],
  match=["hawk gt", "nt650", "hawk 650", "bros 650", "brat hawk"], style="standard", drive="chain",
  engine="647 cc liquid-cooled V-twin, two carbs, single-sided swingarm",
  intro="A cult favorite with a single-sided swingarm. Simple to work on, but the bikes are old and parts are getting scarce.",
  focus=[["647 cc V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Single-sided swingarm", "Eccentric adjuster"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"]],
  remove=CARB, patch={},
  add=[], lessons={"E": ["Chain slack is set with the eccentric hub on the single-sided swingarm, not with axle adjusters."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

HERO_NAME_B21 = {"honda-cb750-dohc-1979": "CB750", "honda-cb500f-cb500x-2013": "CB500X", "honda-cb650r-2019": "CB650R", "honda-cbr600f4i-1999": "CBR600F4I",
  "honda-cbr900rr-fireblade-1992": "FIREBLADE", "honda-cbr1100xx-blackbird-1997": "BLACKBIRD", "honda-shadow-600-vlx-1988": "SHADOW VLX",
  "honda-valkyrie-1500-1997": "VALKYRIE", "honda-pacific-coast-pc800-1989": "PC800", "honda-hawk-gt-nt650-1988": "HAWK GT"}
