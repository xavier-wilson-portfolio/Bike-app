"""Batch 9 bike tunes (top 100, rows 83-92)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B9 = []
OJB = dict(name="Old Japanese Bikes GT Resource", url="https://www.oldjapanesebikes.com/mraxl_GT_Resource/user_tips/page-2", what="Owner tips for Suzuki GT two-stroke triples.")
FMH = dict(name="Fix My Hog", url="https://www.fixmyhog.com/", what="Harley-Davidson how-to videos and buyer guides by year.")

B9.append(dict(id="suzuki-gt380-1972", make="Suzuki", model="GT380", name="Suzuki GT380", years=[1972, 1978],
  match=["gt380", "gt 380", "sebring"], style="standard", drive="chain",
  engine="371 cc air-cooled two-stroke triple, three carbs, Ram Air head, oil injection",
  intro="Suzuki's small two-stroke triple. Check the oil injection system before anything else.",
  focus=[["371 cc two-stroke triple", "Air-cooled, Ram Air"], ["Oil injection", "Pump, lines, linkage"], ["Three carbs", "Clean and sync"], ["Crank seals", "Outer seals leak"], ["Exhaust", "Baffles clog"]],
  remove=CARB + AIR + ["H-003"], patch={},
  add=[step("X-GT3-01", "H", "H-001", "Service the oil injection system", "Check the injector pump, its shaft seal, the lines and the check valves. Check the link from the carb to the pump. Bleed the lines so every cylinder gets oil.", "A two-stroke with no oil seizes. The pump linkage and line leaks are known weak points.", "Old Japanese Bikes GT Resource", hours=1.5)],
  lessons={"H": ["Crank seals on the GT380 are small. Outer seals can often be changed without splitting the cases."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Oil injection", what="The carb-to-pump linkage joint and the pump shaft seal are known failure points.", src="https://www.oldjapanesebikes.com/mraxl_GT_Resource/user_tips/page-2")],
  forums=[OJB]))

B9.append(dict(id="harley-davidson-softail-2018", make="Harley-Davidson", model="Softail (M8)", name="Harley-Davidson Softail (Milwaukee-Eight)", years=[2018, 2026],
  match=["softail", "fat boy", "heritage classic", "street bob", "low rider", "low rider s", "breakout", "fat bob", "deluxe", "flhc", "flhcs", "fxlrs", "fxbb"], style="cruiser", drive="belt",
  engine="Milwaukee-Eight 107 or 114 V-twin, fuel injected, belt drive",
  intro="The 2018-on Softail frame with the Milwaukee-Eight. Check the rear shock adjuster recall first.",
  focus=[["Milwaukee-Eight", "107 or 114 cu in"], ["Fuel injected", "No carbs"], ["Shock adjuster recall", "Can puncture the tire"], ["Belt drive", "Check for cracks"], ["Oil sumping", "Early bikes"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Many 2018-2024 Softails (Heritage, Low Rider S and ST, Deluxe and others) are in recall 25V375. The rear shock preload adjuster bracket can break and puncture the rear tire. Bikes fixed under the earlier recall 23V591 need the new fix too.", reason="A sudden flat rear tire can cause a crash. The repair is free and quick.")},
  add=[], lessons={},
  recalls=[dict(id="25V375", years="2018-2024 (several models)", what="Rear shock preload adjuster bracket can break and puncture the rear tire.", fix="Dealer fits a new bracket free (Harley recall 0188).", src="https://www.rideapart.com/news/762791/harley-softail-recall-rear-tire-blowout/")],
  known=[], forums=[FMH]))

B9.append(dict(id="suzuki-gs500e-1989", make="Suzuki", model="GS500E", name="Suzuki GS500E", years=[1989, 2009],
  match=["gs500", "gs 500", "gs500e", "gs500f"], style="standard", drive="chain",
  engine="487 cc air/oil-cooled DOHC parallel twin, two carbs",
  intro="A tough, common learner bike. Most problems come from varnished carbs and old wiring.",
  focus=[["487 cc twin", "Air/oil-cooled"], ["Two carbs", "Varnish and diaphragms"], ["Wiring", "Connectors and grounds"], ["Chain drive", "Sprockets and chain"], ["High miles", "Check the history"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"G": ["Check the carb slide diaphragms for cracks while the carbs are apart. Cracked diaphragms cause flat spots."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Carbs", what="Varnished jets cause poor idle, hesitation and hard starting.", src="https://vincheck.info/report/suzuki/gs500e/2007")],
  forums=[]))

B9.append(dict(id="harley-davidson-dyna-2006", make="Harley-Davidson", model="Dyna", name="Harley-Davidson Dyna", years=[2006, 2017],
  match=["dyna", "street bob", "fat bob", "wide glide", "super glide", "low rider", "switchback", "fxd", "fxdb", "fxdf", "fxdwg", "fxdl"], style="cruiser", drive="belt",
  engine="Twin Cam 96 or 103 V-twin, fuel injected (some 2006 carbureted), belt drive, six-speed",
  intro="The rubber-mount Twin Cam Dyna. Hydraulic cam tensioners, but the shoes still wear and should be checked.",
  focus=[["Twin Cam 96/103", "Air-cooled"], ["Cam tensioner shoes", "Inspect for wear"], ["Fuel injected", "Some 2006 carbs"], ["Belt drive", "Check for cracks"], ["Six-speed", "Check shifting"]],
  remove=AIR, patch={},
  add=[step("X-DYNA-01", "H", "H-003", "Inspect the cam chain tensioner shoes", "Take off the cam cover and look at the tensioner shoes for wear grooves and chunks missing. Replace them if they are worn.", "Worn shoes drop plastic into the oil and can let the cam chain slap.", "Fix My Hog cam tensioner notes", hours=1.5)],
  lessons={"G": ["Most 2006-2017 Dynas are fuel injected, but some 2006 bikes have a carb. Skip the steps that don't match your bike."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Cam tensioners", what="Harley moved Dynas to hydraulic tensioners in 2006, but the shoes still wear and are worth checking at higher miles.", src="https://www.fixmyhog.com/post/cam-chain-adjuster-shoes/")],
  forums=[FMH]))

B9.append(dict(id="harley-davidson-sportster-ironhead-1972", make="Harley-Davidson", model="Sportster Ironhead", name="Harley-Davidson Sportster Ironhead", years=[1972, 1985],
  match=["ironhead", "ironhead sportster", "xlh", "xlch", "xls", "xlx", "xr1000"], style="cruiser", drive="chain",
  engine="1000 cc air-cooled Ironhead V-twin, one carb, chain drive",
  intro="The cast-iron-head Sportster. Simple, but most have been through several cheap owners.",
  focus=[["1000 cc Ironhead", "Iron heads"], ["One carb", "Often swapped"], ["Cases", "Check for cracks"], ["Charging", "Generator or alternator"], ["Chain drive", "Sprockets and chain"]],
  remove=EFI + AIR, patch={},
  add=[step("X-IRON-01", "E", "E-002", "Check the engine cases", "Look for cracks, stripped threads and broken bolts in the cases. On pre-1973 cases, check the lower right transmission area near the speedometer drive.", "Cracked or mismatched cases cause leaks and gearbox trouble.", "Classic Motorcycle Build Ironhead notes", hours=1.0)],
  lessons={"A": ["Many Ironheads have had several owners who skimped on parts. Check what has been changed before you trust anything."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Engine cases", what="Early cases crack near the speedometer drive, and mismatched cases cause gearbox wear.", src="https://www.classic-motorcycle-build.com/ironhead-engine-cases.html")],
  forums=[]))

B9.append(dict(id="bmw-r1250gs-2019", make="BMW", model="R1250GS", name="BMW R1250GS", years=[2019, 2023],
  match=["r1250gs", "r 1250 gs", "r1250 gs", "r1250gsa", "1250gs", "gs adventure"], style="adventure", drive="shaft",
  engine="1254 cc air/liquid-cooled boxer twin, ShiftCam, fuel injected, shaft drive",
  intro="BMW's ShiftCam boxer. Every 2019-2023 bike was in the gearbox input shaft recall.",
  focus=[["1254 cc boxer", "Air/liquid-cooled"], ["Fuel injected", "No carbs"], ["Gearbox recall", "All 2019-2023"], ["Shaft drive", "Final drive oil"], ["Electronics", "Check for faults"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. All 2019-2023 R1250GS and GS Adventure bikes are in recall 23V011 for the gearbox input shaft. The fix is new engine control software.", reason="A broken input shaft can lock the rear wheel. The update is free.")},
  add=[], lessons={},
  recalls=[dict(id="23V011", years="2019-2023", what="Gearbox input shaft can be damaged or break and lock the rear wheel.", fix="Dealer updates the engine control software free.", src="https://www.rideapart.com/news/633453/bmw-r1250gs-gearbox-shaft-recall/")],
  known=[], forums=[]))

B9.append(dict(id="harley-davidson-shovelhead-flh-1966", make="Harley-Davidson", model="Shovelhead FLH", name="Harley-Davidson Shovelhead FLH", years=[1966, 1984],
  match=["shovelhead", "shovel", "flh", "electra glide", "flhs"], style="touring", drive="chain",
  engine="1200 or 1340 cc air-cooled Shovelhead V-twin, one carb, chain drive",
  intro="The Shovelhead big twin. Expect oil leaks and valve guide wear. Later bikes got the better oil pump and guides.",
  focus=[["Shovelhead V-twin", "74 or 80 cu in"], ["Oil leaks", "The Shovelhead drip"], ["Valve guides", "Smoke and oil use"], ["One carb", "Often swapped"], ["Vibration", "Check every bolt"]],
  remove=EFI + AIR, patch={},
  add=[step("X-SHOV-01", "H", "H-003", "Check the valve guides", "Look for blue smoke on start-up and oil on the plugs. Wiggle-test the valves in the guides with the heads off.", "Valves and guides were a weak spot, especially on AMF-era engines.", "Shovelhead engine history", skill="Advanced", hours=2.0),
       step("X-SHOV-02", "E", "E-002", "Re-torque fasteners", "Go over every engine mount, bracket and fender bolt and tighten to spec. These engines shake bolts loose.", "Loose bolts lead to cracked brackets and lost parts.", "Shovelhead tech tips", hours=1.0)],
  lessons={"H": ["For leaks, start with a leak-down test, then check head gaskets, rocker covers and the oil pump."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Oil leaks", what="Leaks from head gaskets, rocker covers and the oil pump are so common owners call it the Shovelhead drip.", src="https://cararac.com/blog/shovelhead-problems-harley-engine-flaws.html")],
  forums=[FMH]))

B9.append(dict(id="bmw-r1200gs-2013", make="BMW", model="R1200GS", name="BMW R1200GS (water-cooled)", years=[2013, 2018],
  match=["r1200gs", "r 1200 gs", "r1200 gs", "r1200gsa", "1200gs", "gs lc"], style="adventure", drive="shaft",
  engine="1170 cc air/liquid-cooled boxer twin, fuel injected, shaft drive",
  intro="The first water-cooled GS. Check the fork tube recall before anything else.",
  focus=[["1170 cc boxer", "Air/liquid-cooled"], ["Fuel injected", "No carbs"], ["Fork tube recall", "2014-2017"], ["Shaft drive", "Final drive oil"], ["Off-road wear", "Bearings and spokes"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Water-cooled GS and GS Adventure bikes built from November 2013 to June 2017 were recalled because the fixed fork tube can separate after a hard hit. Dealers fit an extra fork tube bush.", reason="A separated fork tube can cause a loss of steering. The repair is free.")},
  add=[], lessons={"E": ["After any hard hit or crash, have the fork tubes checked even if the recall bush is fitted."]},
  recalls=[dict(id="BMW fork tube recall", years="2014-2017 (built Nov 2013 to Jun 2017)", what="Fixed fork tube can separate from its top plug after a hard hit.", fix="Dealer fits an extra fork tube bush free, or replaces a damaged fork.", src="https://www.asphaltandrubber.com/?p=139397")],
  known=[], forums=[]))

B9.append(dict(id="harley-davidson-evolution-softail-1984", make="Harley-Davidson", model="Evolution Softail", name="Harley-Davidson Evolution Softail", years=[1984, 1999],
  match=["evo softail", "evolution softail", "fxst", "flstc", "flstf", "fat boy", "heritage softail", "softail custom", "springer softail", "evo"], style="cruiser", drive="belt",
  engine="1340 cc air-cooled Evolution V-twin, one carb, belt drive (most)",
  intro="The Evo Softail. Reliable, but base gasket and rocker box leaks are almost a given.",
  focus=[["1340 cc Evolution", "Air-cooled"], ["Base gaskets", "Weep oil"], ["One carb", "CV carb on most"], ["Belt drive", "Check for cracks"], ["Early clutch", "1984-89 noisy"]],
  remove=EFI + AIR, patch={},
  add=[step("X-EVO-01", "H", "H-001", "Check the base and rocker box gaskets", "Clean the engine and look for oil at the cylinder base, especially near the oil return, and at the rocker boxes. Plan a top-end reseal if they weep.", "Base gasket leaks are the best-known Evo fault and get worse as the gasket bakes.", "Fix My Hog Evo top-end notes", hours=0.5)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Base and rocker gaskets", what="Most Evos that haven't been rebuilt leak at the base and rocker box gaskets.", src="https://www.fixmyhog.com/video/evolution-top-end-introduction-033091")],
  forums=[FMH]))

B9.append(dict(id="triumph-bonneville-t120-2016", make="Triumph", model="Bonneville T120", name="Triumph Bonneville T120", years=[2016, 2026],
  match=["t120", "bonneville t120", "bonneville", "t120 black"], style="standard", drive="chain",
  engine="1200 cc liquid-cooled parallel twin, fuel injected",
  intro="The modern liquid-cooled Bonneville. Several recalls, so run the VIN first.",
  focus=[["1200 cc twin", "Liquid-cooled"], ["Fuel injected", "Looks like carbs"], ["Recalls", "Several by year"], ["Chain drive", "Slack and lube"], ["Clutch cable", "Check routing"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. T120 recalls include sticking throttle with heated grips (2016-2017, 17V035), clutch cable routing (2016-2019, 19V133), a loose left front brake disc (2023, 23V146) and a wiring and charging recall (2022-2024, 26V078).", reason="Several of these affect brakes or throttle. Repairs are free.")},
  add=[], lessons={},
  recalls=[dict(id="23V146", years="2023 (some)", what="Left front brake disc may be loose and can detach.", fix="Dealer replaces the damper and disc bolts free.", src="https://www.rideapart.com/news/657649/triumph-bonneville-t120-recall-2023/"),
           dict(id="17V035", years="2016-2017 with heated grips", what="Heated grips can expand and make the throttle stick open.", fix="Free dealer repair.", src="https://www.motorcyclistonline.com/triumph-recalls-2016-2017-bonneville-t120-for-sticking-throttle-issue")],
  known=[], forums=[]))

HERO_NAME_B9 = {"suzuki-gt380-1972": "GT380", "harley-davidson-softail-2018": "SOFTAIL", "suzuki-gs500e-1989": "GS500", "harley-davidson-dyna-2006": "DYNA",
  "harley-davidson-sportster-ironhead-1972": "IRONHEAD", "bmw-r1250gs-2019": "R1250GS", "harley-davidson-shovelhead-flh-1966": "SHOVELHEAD",
  "bmw-r1200gs-2013": "R1200GS", "harley-davidson-evolution-softail-1984": "EVO", "triumph-bonneville-t120-2016": "T120"}
