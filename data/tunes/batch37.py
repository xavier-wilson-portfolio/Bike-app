"""Batch 37 bike tunes (top 500, rows 361-370)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch36 import YAMF, MT07F
B37 = []
TWO = CARB + AIR + ["H-003"]
STARF = dict(name="Star Bike Forums", url="https://www.starbikeforums.com/", what="Owner forum for Yamaha Star cruisers.")
VENTF = dict(name="Venture Riders", url="https://www.ventureriders.org/", what="Owner club for Yamaha Venture touring bikes.")
BRK = dict(id="20V814", years="2018-2021 (some)", what="Front brake switch can fail from silicon oxide buildup, leaving the brake light on or cutting out cruise control.", fix="Dealer replaces the front brake switch free.", src="https://vehiclesafetyrecalls.com/recall/20V814000")

B37.append(dict(id="yamaha-xsr700-2018", make="Yamaha", model="XSR700", name="Yamaha XSR700", years=[2018, 2026],
  match=["xsr700", "xsr 700", "xsr-700", "xsr700 xtribute"], style="standard", drive="chain",
  engine="689 cc liquid-cooled CP2 parallel twin, fuel injected",
  intro="The retro MT-07. Some 2018 bikes had a chain guard bolt recall.",
  focus=[["689 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Chain guard", "2018 recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2018 XSR700s are in recall 18V483 for chain guard bolts that can loosen.", reason="The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="18V483", years="2018 (some)", what="Chain guard mounting bolts can loosen from vibration.", fix="Dealer replaces both chain guard bolts free.", src="https://vehiclesafetyrecalls.com/recall/18V483000")],
  known=[], forums=[MT07F]))

B37.append(dict(id="yamaha-virago-xv920-xv1000-1981", make="Yamaha", model="Virago XV920 / XV1000", name="Yamaha Virago 920 / 1000", years=[1981, 1985],
  match=["virago 920", "xv920", "virago 1000", "xv1000", "xv 920", "xv920r", "tr1"], style="cruiser", drive="shaft",
  engine="920 or 981 cc air-cooled V-twin, two carbs, shaft or chain drive",
  intro="The early big Viragos. Two carbs, a starter that is known to give trouble, and a monoshock frame.",
  focus=[["V-twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Starter", "Known weak point"], ["Charging", "Check R/R"], ["Final drive", "Shaft or chain"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"F": ["Virago starters are a known weak point. If it grinds or slips, check the starter clutch and gear before buying a new starter."]},
  recalls=[], recallNote=OLD, known=[], forums=[STARF]))

B37.append(dict(id="yamaha-xv1600-1700-road-star-warrior-2002", make="Yamaha", model="Road Star Warrior", name="Yamaha Road Star Warrior (XV1700PC)", years=[2002, 2010],
  match=["road star warrior", "warrior", "xv1700pc", "star warrior", "xv17pc", "warrior 1700"], style="cruiser", drive="belt",
  engine="1670 cc air-cooled V-twin, fuel injected, belt drive",
  intro="Yamaha's sport cruiser. Fuel injected, belt drive and an aluminum frame. Early bikes had several recalls.",
  focus=[["1670 cc V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Belt drive", "Check wear"], ["Early recalls", "2002-2007"], ["Charging", "Check R/R"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2002 Warriors had a fuel tank mount recall (02V181), 2002-2003 bikes a transmission recall (03V309), and some later bikes a pickup coil wire recall (07V039).", reason="These are old, but a bike that missed one still has the fault.")},
  add=[], lessons={},
  recalls=[dict(id="02V181", years="2002", what="Fuel tank mounting problem.", fix="Free dealer repair.", src="https://vehicleflaws.com/vehicle/yamaha/xv1700pc/2002"),
           dict(id="03V309", years="2002-2003", what="Transmission defect.", fix="Free dealer repair.", src="https://vehicleflaws.com/vehicle/yamaha/xv17pcp/2003"),
           dict(id="07V039", years="Some Warriors (VIN check)", what="Pickup coil lead wires can break while running, stalling the engine with no restart.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/07V039000")],
  known=[], forums=[STARF]))

B37.append(dict(id="yamaha-midnight-star-xv1900-roadliner-stratoliner-2006", make="Yamaha", model="Roadliner / Stratoliner / Midnight Star 1900", name="Yamaha Roadliner / Stratoliner (XV1900)", years=[2006, 2013],
  match=["roadliner", "stratoliner", "xv1900", "xv19", "midnight star 1900", "star roadliner", "star stratoliner"], style="cruiser", drive="belt",
  engine="1854 cc air-cooled V-twin, fuel injected, belt drive",
  intro="Yamaha's big 1900 cruisers. Fuel injected and belt drive. Some 2006 bikes had a throttle cable recall.",
  focus=[["1854 cc V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Belt drive", "Check wear"], ["Throttle cable", "2006 recall"], ["Charging", "Check R/R"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2006 XV1900s are in recall 07V147 for the throttle cables.", reason="The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="07V147", years="2006 (some)", what="Throttle cable problem.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/yamaha/xv19/2006/07v147000")],
  known=[], forums=[STARF]))

B37.append(dict(id="yamaha-royal-star-venture-1999", make="Yamaha", model="Royal Star Venture", name="Yamaha Royal Star Venture", years=[1999, 2013],
  match=["royal star venture", "rsv", "xvz13td", "royal star venture s", "venture 1300"], style="touring", drive="shaft",
  engine="1294 cc liquid-cooled V4, four carbs, shaft drive",
  intro="Yamaha's full-dress V4 tourer. Four carbs under a lot of bodywork, and shaft drive.",
  focus=[["1294 cc V4", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Shaft drive", "Change the oil"], ["Fairing", "Lots of wiring"], ["Charging", "Check R/R"]],
  remove=CARB, patch={}, add=[], lessons={"G": ["The carbs sit in the V under the tank. Plan for the time it takes to get to them."]},
  recalls=[], recallNote=VIN, known=[], forums=[VENTF]))

B37.append(dict(id="yamaha-star-venture-2018", make="Yamaha", model="Star Venture", name="Yamaha Star Venture / Eluder", years=[2018, 2021],
  match=["star venture", "xv1900 venture", "star eluder", "eluder", "venture tc", "star venture tc"], style="touring", drive="belt",
  engine="1854 cc air-cooled V-twin, fuel injected, belt drive",
  intro="Yamaha's modern full-dress tourer. Lots of electronics, and a front brake switch recall on many bikes.",
  focus=[["1854 cc V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Brake switch", "Recall"], ["Infotainment", "Lots of wiring"], ["Belt drive", "Check wear"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Many 2018-2021 Star Ventures and 2018 Eluders are in recall 20V814 for the front brake switch.", reason="NHTSA flagged it do-not-ride until fixed. The fix is free.")},
  add=[], lessons={},
  recalls=[BRK], known=[], forums=[VENTF]))

B37.append(dict(id="yamaha-xt600-1984", make="Yamaha", model="XT600", name="Yamaha XT600", years=[1984, 1995],
  match=["xt600", "xt 600", "xt600e", "xt600z", "tenere 600", "xt600a"], style="dualsport", drive="chain",
  engine="595 cc air-cooled four-valve single, carb",
  intro="Yamaha's big air-cooled dual-sport single. Simple and tough, with a valve check that matters.",
  focus=[["595 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check often"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[YAMF]))

B37.append(dict(id="yamaha-xt350-1985", make="Yamaha", model="XT350", name="Yamaha XT350", years=[1985, 2000],
  match=["xt350", "xt 350", "xt350 dual sport"], style="dualsport", drive="chain",
  engine="346 cc air-cooled four-valve single, two carbs",
  intro="A light, well-liked Yamaha dual-sport. Twin carbs on one cylinder and simple everything else.",
  focus=[["346 cc single", "Air-cooled"], ["Twin carbs", "Clean both"], ["Valves", "Check often"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[YAMF]))

B37.append(dict(id="yamaha-tt-r125-tt-r230-2000", make="Yamaha", model="TT-R125 / TT-R230", name="Yamaha TT-R125 / TT-R230", years=[2000, 2026],
  match=["tt-r125", "ttr125", "tt-r230", "ttr230", "ttr 125", "ttr 230", "tt-r225", "ttr225", "tt-r110", "ttr110"], style="dualsport", drive="chain",
  engine="124 to 223 cc air-cooled single, carb",
  intro="Yamaha's trail bikes for new riders. One carb, simple and very common.",
  focus=[["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Screw adjusters"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B37.append(dict(id="yamaha-yz250-two-stroke-1974", make="Yamaha", model="YZ250 (two-stroke)", name="Yamaha YZ250 (two-stroke)", years=[1974, 2026],
  match=["yz250", "yz 250", "yz250x", "yz250 two stroke", "yz250 2 stroke"], style="dualsport", drive="chain",
  engine="249 cc two-stroke single, carb, premix",
  intro="Yamaha's long-running 250 two-stroke. Premix, a top end that wears and no lights.",
  focus=[["Two-stroke", "Premix"], ["Top end", "Check compression"], ["Carb", "Clean and jet"], ["Power valve", "Clean it"], ["Chain drive", "Slack and lube"]],
  remove=TWO, patch={},
  add=[step("X-YZ25-01", "G", "G-004", "Check compression and the top end", "Do a compression test. Low numbers mean the piston and rings are due. Pull and clean the power valve while you are in there.", "A tired top end and a gummed power valve are the most common problems on a used two-stroke.", "Two-stroke basics", hours=1.5)],
  lessons={"B": ["It runs on premix. Mix the oil into the fuel at the ratio in the manual. There is no oil tank."]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

HERO_NAME_B37 = {"yamaha-xsr700-2018": "XSR700", "yamaha-virago-xv920-xv1000-1981": "VIRAGO", "yamaha-xv1600-1700-road-star-warrior-2002": "WARRIOR",
  "yamaha-midnight-star-xv1900-roadliner-stratoliner-2006": "ROADLINER", "yamaha-royal-star-venture-1999": "VENTURE", "yamaha-star-venture-2018": "STAR VENTURE",
  "yamaha-xt600-1984": "XT600", "yamaha-xt350-1985": "XT350", "yamaha-tt-r125-tt-r230-2000": "TT-R", "yamaha-yz250-two-stroke-1974": "YZ250"}
