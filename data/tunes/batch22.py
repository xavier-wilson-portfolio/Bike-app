"""Batch 22 bike tunes (top 500, rows 211-220)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch21 import REFLECTOR
B22 = []
VJMC = dict(name="Vintage Japanese Motorcycle Club", url="https://www.vjmc.org/", what="Club for owners of older Japanese bikes.")

B22.append(dict(id="honda-nighthawk-650-700s-1982", make="Honda", model="Nighthawk 650 / 700S", name="Honda Nighthawk 650 / 700S", years=[1982, 1986],
  match=["nighthawk 650", "cb650sc", "nighthawk 700s", "cb700sc", "nighthawk s", "cb650 nighthawk"], style="standard", drive="shaft",
  engine="655 or 696 cc air-cooled DOHC inline four, four carbs, shaft drive, hydraulic lifters",
  intro="Early-80s Nighthawk fours with shaft drive and self-adjusting valves. The charging system is the usual weak spot.",
  focus=[["Inline four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Hydraulic lifters", "No valve shims"], ["Charging", "Check R/R"], ["Shaft drive", "Change the oil"]],
  remove=CARB + AIR, patch={},
  add=[step("X-NH6-01", "F", "F-002", "Test the charging system", "Check battery voltage at idle and at 5,000 rpm. Below about 13 V at speed points at the regulator/rectifier or stator.", "Regulator/rectifier failure is a common Nighthawk problem.", "motoryk.com Nighthawk problems", hours=1.0)],
  lessons={"H": ["The valves use hydraulic lifters. Change the oil on time, because old oil makes them tick."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Regulator/rectifier", what="Regulator/rectifier failure kills the charging system and leaves a flat battery.", src="https://www.motoryk.com/bikes/honda/cb750-nighthawk/problems")],
  forums=[VJMC]))

B22.append(dict(id="honda-cb77-superhawk-1961", make="Honda", model="CB77 Super Hawk", name="Honda CB77 Super Hawk", years=[1961, 1967],
  match=["cb77", "super hawk", "superhawk", "cb 77", "cb72", "hawk 250"], style="standard", drive="chain",
  engine="305 cc air-cooled SOHC parallel twin, two carbs, points ignition",
  intro="Honda's early 305 twin. Original parts are scarce, so keep and restore what came with the bike.",
  focus=[["305 cc twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Points ignition", "Gap and timing"], ["Drum brakes", "Shoes and cables"], ["Original parts", "Scarce"]],
  remove=CARB + AIR, patch={},
  add=[], lessons={"A": ["Photograph everything before you take it apart. Many CB77 parts are hard to find now."]},
  recalls=[], recallNote=OLD, known=[], forums=[VJMC]))

B22.append(dict(id="honda-ca77-dream-305-1960", make="Honda", model="CA77 Dream 305", name="Honda CA77 Dream 305", years=[1960, 1969],
  match=["ca77", "dream 305", "ca 77", "ca72", "dream 250", "honda dream"], style="standard", drive="chain",
  engine="305 cc air-cooled SOHC parallel twin, single carb, points ignition, enclosed chain",
  intro="The pressed-steel Dream. One carb, a fully enclosed chain and a lot of sheet metal to restore.",
  focus=[["305 cc twin", "Air-cooled"], ["Single carb", "Clean it out"], ["Points ignition", "Gap and timing"], ["Enclosed chain", "Check it"], ["Pressed-steel frame", "Rust"]],
  remove=CARB + AIR, patch={},
  add=[step("X-CA7-01", "E", "E-002", "Check the frame and chain case for rust", "Look over the pressed-steel frame and the chain enclosure for rust-through, especially at the seams and underneath.", "The Dream uses a pressed-steel frame and enclosed chain case, which trap water.", "Owner experience", hours=0.5)],
  lessons={}, recalls=[], recallNote=OLD, known=[], forums=[VJMC]))

B22.append(dict(id="honda-z50-mini-trail-1968", make="Honda", model="Z50 Mini Trail", name="Honda Z50 Mini Trail", years=[1968, 1999],
  match=["z50", "mini trail", "z50a", "z50r", "z50j", "monkey bike", "z 50"], style="dualsport", drive="chain",
  engine="49 cc air-cooled SOHC single, single carb, semi-automatic gearbox",
  intro="The classic kids' mini bike. A tiny carb that clogs if you look at it, and simple everything else.",
  focus=[["49 cc single", "Air-cooled"], ["Tiny carb", "Clogs easily"], ["Semi-auto", "No clutch lever"], ["Chain drive", "Slack and lube"], ["Points or CDI", "Depends on year"]],
  remove=CARB + AIR + ["H-005"], patch={},
  add=[], lessons={"G": ["The carb jets are tiny. Clean them with a fine wire or carb cleaner, never by drilling."]},
  recalls=[], recallNote=OLD, known=[], forums=[VJMC]))

B22.append(dict(id="honda-trail-125-ct125-2021", make="Honda", model="Trail 125 (CT125)", name="Honda Trail 125 (CT125)", years=[2021, 2026],
  match=["ct125", "trail 125", "ct 125", "ct125a", "hunter cub"], style="dualsport", drive="chain",
  engine="125 cc air-cooled single, fuel injected, semi-automatic gearbox",
  intro="Honda's modern trail bike. Some 2021 bikes have a gearshift pedal recall.",
  focus=[["125 cc single", "Air-cooled"], ["Fuel injected", "No carbs"], ["Shift pedal recall", "2021"], ["Semi-auto", "No clutch lever"], ["Chain drive", "Slack and lube"]],
  remove=EFI + AIR + ["H-005"],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2021 bikes are in recall 21V804 because the gearshift pedal weld can fail.", reason="A broken shift pedal leaves you stuck in gear. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="21V804", years="2021 (some)", what="The gearshift pedal arm weld may fail and the pedal may break off.", fix="Dealer replaces the gearshift pedal assembly free.", src="https://vehiclesafetyrecalls.com/recall/21V804000")],
  known=[], forums=[]))

B22.append(dict(id="honda-pcx125-150-2010", make="Honda", model="PCX125 / PCX150 / PCX160", name="Honda PCX", years=[2010, 2026],
  match=["pcx", "pcx125", "pcx150", "pcx160", "pcx 150", "pcx 125"], style="scooter", drive="belt",
  engine="125, 150 or 160 cc liquid-cooled single, fuel injected, CVT",
  intro="Honda's best-selling small scooter. Some accessory top box mounts were recalled.",
  focus=[["Small single", "Liquid-cooled"], ["Fuel injected", "No carb"], ["CVT belt", "Inspect"], ["Coolant", "Change it"], ["Top box mount", "Accessory recall"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. If the scooter has a Honda accessory rear trunk, check the base against recall 16E023. Those trunk bases can let the box fall off.", reason="A top box falling off in traffic is a hazard to you and others. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="16E023", years="Accessory trunk bases sold for 2013-2016 PCX150 (also fitted to PCX125)", what="Accessory rear trunk base may let the trunk come off.", fix="Honda replaces the trunk base free.", src="https://vehiclesafetyrecalls.com/recall/16E023000")],
  known=[], forums=[]))

B22.append(dict(id="honda-metropolitan-2002", make="Honda", model="Metropolitan (NCH50 / NCW50)", name="Honda Metropolitan", years=[2002, 2026],
  match=["metropolitan", "nch50", "ncw50", "jazz", "met 50", "honda metro"], style="scooter", drive="belt",
  engine="49 cc single, carb (NCH50) or fuel injected (NCW50), CVT",
  intro="Honda's 50 cc retro scooter. 2016-2025 bikes are in a transmission case seal recall.",
  focus=[["49 cc single", "Small and simple"], ["Carb or EFI", "Depends on year"], ["Trans case recall", "2016-2025"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"]],
  remove=AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2016-2025 Metropolitans are in recall 24V825 because the transmission case may not seal and can leak fluid.", reason="Leaking transmission fluid can reach the rear tire. The fix is free.")},
  add=[], lessons={"G": ["Older NCH50 scooters have a carb. 2016-on NCW50 scooters are fuel injected. Skip the steps that don't match."]},
  recalls=[dict(id="24V825", years="2016-2025", what="The transmission case may not seal to the crankcase and can leak transmission fluid.", fix="Dealer inspects and repairs the transmission case free.", src="https://www.carwhere.com/recalls/campaign/24V825000")],
  known=[], forums=[]))

B22.append(dict(id="honda-xr650r-2000", make="Honda", model="XR650R", name="Honda XR650R", years=[2000, 2007],
  match=["xr650r", "xr 650r", "big red pig", "brp"], style="dualsport", drive="chain",
  engine="649 cc liquid-cooled single, carb",
  intro="The Big Red Pig. A liquid-cooled 650 single built for the desert, with a carb and a big appetite for valve checks.",
  focus=[["649 cc single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Valves", "Check often"], ["Cooling", "Hoses and radiators"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={},
  add=[], lessons={}, recalls=[], recallNote=VIN, known=[],
  forums=[dict(name="ThumperTalk", url="https://www.thumpertalk.com/", what="Owner forum for four-stroke dirt and dual-sport bikes.")]))

B22.append(dict(id="honda-crf250l-2013", make="Honda", model="CRF250L", name="Honda CRF250L", years=[2013, 2020],
  match=["crf250l", "crf 250l", "crf250 rally", "crf250l rally", "crf250m"], style="dualsport", drive="chain",
  engine="250 cc liquid-cooled single, fuel injected",
  intro="Honda's small dual-sport. 2014-2015 bikes have a starter relay recall, and some 2020 bikes have a reflector recall.",
  focus=[["250 cc single", "Liquid-cooled"], ["Fuel injected", "No carb"], ["Starter relay", "2014-2015 recall"], ["Chain drive", "Slack and lube"], ["Valves", "Shim type"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2014-2015 bikes are in recall 15V439 (starter relay). Some 2020 bikes are in recall 21V382 (rear reflector).", reason="Both fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="15V439", years="2014-2015", what="Starter relay switch problem.", fix="Dealer replaces the starter relay free.", src="https://recallcheck.net/recall/15V439000"), REFLECTOR],
  known=[], forums=[]))

B22.append(dict(id="honda-vtr1000-super-hawk-1997", make="Honda", model="VTR1000F Super Hawk", name="Honda VTR1000F Super Hawk", years=[1997, 2005],
  match=["super hawk", "superhawk", "vtr1000", "vtr1000f", "firestorm", "vtr 1000"], style="sport", drive="chain",
  engine="996 cc liquid-cooled 90-degree V-twin, carbs",
  intro="Honda's big V-twin sport bike. Side-mounted radiators and large carbs.",
  focus=[["996 cc V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Side radiators", "Check hoses"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={},
  add=[], lessons={}, recalls=[], recallNote=VIN, known=[], forums=[]))

HERO_NAME_B22 = {"honda-nighthawk-650-700s-1982": "NIGHTHAWK", "honda-cb77-superhawk-1961": "SUPER HAWK", "honda-ca77-dream-305-1960": "DREAM 305",
  "honda-z50-mini-trail-1968": "Z50", "honda-trail-125-ct125-2021": "TRAIL 125", "honda-pcx125-150-2010": "PCX", "honda-metropolitan-2002": "METROPOLITAN",
  "honda-xr650r-2000": "XR650R", "honda-crf250l-2013": "CRF250L", "honda-vtr1000-super-hawk-1997": "SUPER HAWK"}
