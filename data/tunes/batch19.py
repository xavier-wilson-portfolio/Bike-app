"""Batch 19 bike tunes (top 500, rows 181-190)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch18 import TC_STEP, TC_KNOWN, FMH2
B19 = []
AMCA = dict(name="AMCA forum", url="https://forum.antiquemotorcycle.org/bboard/", what="Antique Motorcycle Club of America forum, with a Panhead section.")
UKGS = dict(name="UKGSer forum", url="https://www.ukgser.com/community/", what="Owner forum for BMW GS models.")
F650 = dict(name="F650.com", url="https://f650.com/", what="Owner forum and FAQs for BMW F650 and F800 models.")
SPLINE = step("X-BGS-01", "E", "E-002", "Lube the drive splines", "Pull the rear drive and clean and grease the shaft splines with a moly paste. Look for oil in the swingarm.", "Dry splines wear and fail. Most owners forget to grease them.", "Motoryk R1150GS notes", skill="Advanced", hours=2.5)

B19.append(dict(id="harley-davidson-sportster-s-2021", make="Harley-Davidson", model="Sportster S", name="Harley-Davidson Sportster S", years=[2021, 2026],
  match=["sportster s", "rh1250s", "sportster s 1250"], style="cruiser", drive="belt",
  engine="1252 cc liquid-cooled Revolution Max V-twin, fuel injected, belt drive",
  intro="The liquid-cooled Sportster. Check the upper triple clamp recall before riding.",
  focus=[["1252 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Triple clamp recall", "2021-2026"], ["Belt drive", "Tension"], ["Electronics", "Updates"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Many 2021-2026 Sportster S bikes are in recall 26V075 because the upper triple clamp may fracture. It expands the earlier recall 25V590, so bikes fixed under that one need the new fix too.", reason="A broken triple clamp can cost you steering. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="26V075", years="2021-2026", what="Upper triple clamp may fracture. Expands recall 25V590.", fix="Free dealer repair (Harley recall 0191).", src="https://recallcheck.net/make/harley-davidson/rh1250s/2022"),
           dict(id="22V030", years="2021 (some)", what="Instrument cluster may not show the speedometer and neutral light when cold.", fix="Dealer updates the cluster software free.", src="https://vehiclesafetyrecalls.com/recall/22V030000")],
  known=[], forums=[]))

B19.append(dict(id="harley-davidson-pan-america-2021", make="Harley-Davidson", model="Pan America", name="Harley-Davidson Pan America", years=[2021, 2026],
  match=["pan america", "ra1250", "ra1250s", "pan america 1250", "pan america special"], style="adventure", drive="chain",
  engine="1252 cc liquid-cooled Revolution Max V-twin, fuel injected, chain drive",
  intro="Harley's adventure bike. Early 2021 bikes had seat base and instrument cluster recalls.",
  focus=[["1252 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["2021 recalls", "Seat base, cluster"], ["Chain drive", "Slack and lube"], ["Off-road wear", "Bearings"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2021 bikes are in recall 21V924 (seat base) and 22V030 (instrument cluster).", reason="Both fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="21V924", years="2021 (some)", what="Seat base may not be fastened properly, and the handhold part can fracture.", fix="Free dealer repair (Harley recall 0178).", src="https://www.rideapart.com/news/552305/harley-pan-america-2021-recall/"),
           dict(id="22V030", years="2021 (some)", what="Instrument cluster may not show the speedometer and neutral light when cold.", fix="Dealer updates the cluster software free.", src="https://vehiclesafetyrecalls.com/recall/22V030000")],
  known=[], forums=[]))

B19.append(dict(id="harley-davidson-v-rod-2002", make="Harley-Davidson", model="V-Rod", name="Harley-Davidson V-Rod", years=[2002, 2017],
  match=["v-rod", "vrod", "v rod", "vrsc", "vrsca", "night rod", "night rod special", "muscle", "v-rod muscle"], style="cruiser", drive="belt",
  engine="1130 or 1250 cc liquid-cooled Revolution DOHC V-twin, fuel injected, belt drive",
  intro="Harley's liquid-cooled muscle cruiser. Cooling leaks, cam chain tensioners and the under-seat tank are things to check.",
  focus=[["Revolution V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Radiator leaks"], ["Cam tensioner", "Cold rattle"], ["Fuel tank", "Under the seat"]],
  remove=EFI, patch={}, add=[],
  lessons={"G": ["The fuel tank sits under the seat. Check it for rust if the bike was stored."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Tensioner and cooling", what="Cam chain tensioner wear and radiator leaks are the most reported problems.", src="https://motoryk.com/bikes/harley-davidson/vrsca-v-rod")],
  forums=[]))

B19.append(dict(id="harley-davidson-panhead-1948", make="Harley-Davidson", model="Panhead", name="Harley-Davidson Panhead", years=[1948, 1965],
  match=["panhead", "pan head", "hydra-glide", "duo-glide"], style="cruiser", drive="chain",
  engine="61 or 74 cu in air-cooled OHV V-twin, one carb, generator",
  intro="Harley's 1948-1965 big twin. Oil leaks, a correct engine and a sound front end are the big checks.",
  focus=[["OHV V-twin", "Air-cooled"], ["One carb", "Linkert or later"], ["Oil leaks", "Rocker covers, pump"], ["Generator", "Six or 12 volt"], ["Numbers", "Engine matches year"]],
  remove=CARB + AIR, patch={},
  add=[step("X-PAN-01", "H", "H-001", "Find the oil leaks", "Check the rocker covers, the oil pump and its return line, and the oil filter housing. Look for hairline cracks on cast pumps.", "Panheads are known for oil leaks, and a cracked pump line drips oil while stored.", "AMCA Panhead forum", hours=2.0)],
  lessons={"A": ["Check the engine number is right for the year and model before you buy."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Rocker covers", what="The stock rocker covers are known for oil seepage.", src="https://www.jpcycles.com/product/custom-cycle-engineering-rocker-box-covers-for-harley-panhead-1948-1965")],
  forums=[AMCA]))

B19.append(dict(id="harley-davidson-fxr-1982", make="Harley-Davidson", model="FXR", name="Harley-Davidson FXR", years=[1982, 1994],
  match=["fxr", "fxrs", "fxlr", "fxrt", "fxrd", "super glide fxr", "low rider fxr"], style="cruiser", drive="belt",
  engine="80 cu in air-cooled V-twin (Shovelhead early, Evolution from 1984), one carb, rubber mounted",
  intro="The rubber-mounted Harley people love for its handling. Check the frame and the usual Evo leaks.",
  focus=[["Evo V-twin", "Air-cooled"], ["One carb", "CV or Bendix"], ["Frame", "Cracks at mounts"], ["Oil leaks", "Primary and shifter"], ["Primary", "Chain and clutch"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"E": ["Look closely for frame cracks around the engine mounts."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Frame and primary", what="Inspect for frame cracks around the engine mounts and check the primary chain and clutch.", src="https://vincheck.info/?p=102598")],
  forums=[]))

B19.append(dict(id="harley-davidson-dyna-1991", make="Harley-Davidson", model="Dyna (Evo/early Twin Cam)", name="Harley-Davidson Dyna (1991-2005)", years=[1991, 2005],
  match=["dyna", "fxd", "fxdl", "fxdwg", "wide glide", "super glide", "low rider", "fxdx", "dyna glide"], style="cruiser", drive="belt",
  engine="Evolution 80 cu in (1991-1998) or Twin Cam 88 (1999-2005) V-twin, carb or fuel injected",
  intro="Early Dynas came with the Evo, later ones with the Twin Cam 88. On Twin Cams, check the cam chain tensioner shoes.",
  focus=[["Evo or Twin Cam", "Depends on year"], ["Carb or EFI", "Mostly carbs"], ["Cam tensioners", "1999-2005 TC"], ["Oil leaks", "Normal sumping"], ["Belt drive", "Check for cracks"]],
  remove=AIR, patch={}, add=[TC_STEP],
  lessons={"H": ["The tensioner step only applies to 1999-2005 Twin Cam bikes. Evo bikes use a different cam drive."], "G": ["Most of these have a carb. Skip the fuel injection steps if yours does."]},
  recalls=[], recallNote=OLD, known=[TC_KNOWN], forums=[FMH2]))

B19.append(dict(id="bmw-r1150gs-1999", make="BMW", model="R1150GS", name="BMW R1150GS", years=[1999, 2004],
  match=["r1150gs", "r 1150 gs", "1150gs", "r1150gs adventure", "r1150gsa"], style="adventure", drive="shaft",
  engine="1130 cc oil/air-cooled boxer twin, fuel injected, shaft drive",
  intro="The classic big GS. Grease the splines, watch the final drive and keep the throttle bodies in sync.",
  focus=[["1130 cc boxer", "Oil/air-cooled"], ["Fuel injected", "Sync throttle bodies"], ["Splines", "Grease them"], ["Final drive", "Leaks and whine"], ["ABS", "Pump failures"]],
  remove=EFI + AIR, patch={}, add=[SPLINE], lessons={},
  recalls=[], recallNote=VIN,
  known=[dict(title="Final drive", what="The final drive is a known weak point. Check for oil leaks and listen for whine.", src="https://motoryk.com/bikes/bmw/r-1150-gs")],
  forums=[UKGS]))

B19.append(dict(id="bmw-r1100gs-1994", make="BMW", model="R1100GS", name="BMW R1100GS", years=[1994, 1999],
  match=["r1100gs", "r 1100 gs", "1100gs"], style="adventure", drive="shaft",
  engine="1085 cc oil/air-cooled boxer twin, fuel injected, shaft drive",
  intro="The first oilhead GS. Owners point to the final drive bearing, the front brake hose and the clutch arm.",
  focus=[["1085 cc boxer", "Oil/air-cooled"], ["Fuel injected", "Sync throttle bodies"], ["Final drive", "Bearing"], ["Brake hose", "Front master"], ["Clutch arm", "Actuator wear"]],
  remove=EFI + AIR, patch={}, add=[SPLINE], lessons={},
  recalls=[], recallNote=OLD,
  known=[dict(title="Common issues", what="Owners report the final drive bearing, the front master cylinder brake hose and the clutch actuator arm as common issues.", src="https://www.ukgser.com/community/threads/r1100gs-common-issues.205846/post-2683609")],
  forums=[UKGS]))

B19.append(dict(id="bmw-f800gs-2008", make="BMW", model="F800GS", name="BMW F800GS", years=[2008, 2018],
  match=["f800gs", "f 800 gs", "f800 gs", "f800gsa", "f650gs twin", "f700gs"], style="adventure", drive="chain",
  engine="798 cc liquid-cooled parallel twin, fuel injected, chain drive",
  intro="A capable mid-size GS. The water pump seal is the known weak spot. Watch the weep hole.",
  focus=[["798 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Water pump", "Weep hole"], ["Chain drive", "Slack and lube"], ["Off-road wear", "Bearings"]],
  remove=EFI, patch={},
  add=[step("X-F8-01", "H", "H-004", "Check the water pump weep hole", "Look under the water pump for coolant drips from the weep hole. Check the oil for a milky look.", "Worn water pump seals are a known fault on the 800 twins.", "UKGSer F800GS thread", hours=0.5)],
  lessons={}, recalls=[], recallNote=VIN,
  known=[dict(title="Water pump seals", what="Owners say the water pump seals fail and leak from the weep hole on the 800 twin engines.", src="https://www.ukgser.com/community/threads/f800-gs-coolant-leak.206902/")],
  forums=[UKGS, F650]))

B19.append(dict(id="bmw-f650gs-2000", make="BMW", model="F650GS", name="BMW F650GS (single)", years=[2000, 2007],
  match=["f650gs", "f 650 gs", "f650gs dakar", "f650 dakar", "g650gs"], style="adventure", drive="chain",
  engine="652 cc liquid-cooled Rotax single, fuel injected, chain drive",
  intro="A light, simple single-cylinder GS. The water pump seals are the famous weak spot.",
  focus=[["652 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Water pump", "Seals wear"], ["Chain drive", "Slack and lube"], ["Head bearings", "Check play"]],
  remove=EFI, patch={},
  add=[step("X-F65-01", "H", "H-004", "Check the water pump seals", "Look for coolant at the weep hole and check the oil for a milky look. If either shows, replace the seals and the pump shaft.", "The shaft wears a groove at the seals. Milky oil means both seals have failed.", "F650.com water pump FAQ", skill="Advanced", hours=2.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Water pump", what="The pump shaft wears a groove at the seals, and frothy oil means stop and fix it.", src="https://faq.f650.com/FAQs/Water_Pump_Seal_Repair_FAQ.htm")],
  forums=[F650]))

HERO_NAME_B19 = {"harley-davidson-sportster-s-2021": "SPORTSTER S", "harley-davidson-pan-america-2021": "PAN AMERICA", "harley-davidson-v-rod-2002": "V-ROD",
  "harley-davidson-panhead-1948": "PANHEAD", "harley-davidson-fxr-1982": "FXR", "harley-davidson-dyna-1991": "DYNA", "bmw-r1150gs-1999": "R1150GS",
  "bmw-r1100gs-1994": "R1100GS", "bmw-f800gs-2008": "F800GS", "bmw-f650gs-2000": "F650GS"}
