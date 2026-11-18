"""Batch 13 bike tunes (top 500, rows 121-130)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B13 = []

B13.append(dict(id="honda-sl350-1969", make="Honda", model="SL350", name="Honda SL350", years=[1969, 1973],
  match=["sl350", "sl 350", "motosport 350"], style="dualsport", drive="chain",
  engine="325 cc air-cooled SOHC parallel twin, two carbs",
  intro="Honda's early dual-purpose 350 twin. It shares most of its engine with the CB/CL350.",
  focus=[["325 cc twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Points ignition", "Set the gap"], ["Cam chain", "Adjust the tensioner"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"H": ["Parts are shared with the CB350 and CL350, which makes the engine easy to source."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

B13.append(dict(id="honda-cb1000r-2008", make="Honda", model="CB1000R", name="Honda CB1000R", years=[2008, 2026],
  match=["cb1000r", "cb 1000r", "cb1000 r"], style="standard", drive="chain",
  engine="998 cc liquid-cooled inline four, fuel injected",
  intro="Honda's naked liter bike. Mostly routine service. Check for crash damage on the single-sided swingarm.",
  focus=[["998 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Single-sided arm", "Check the hub"], ["Chain drive", "Slack and lube"], ["Crash damage", "Bars, pegs, radiator"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B13.append(dict(id="honda-nc700x-2012", make="Honda", model="NC700X", name="Honda NC700X", years=[2012, 2015],
  match=["nc700x", "nc700", "nc 700x", "nc700xd"], style="adventure", drive="chain",
  engine="670 cc liquid-cooled parallel twin, fuel injected, manual or DCT",
  intro="Honda's practical commuter-adventure twin. Check the drive chain and starter relay recalls.",
  focus=[["670 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Manual or DCT", "Know which"], ["Chain recall", "2012"], ["Storage bin", "Where the tank usually is"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2012 NC700Xs were in recall 12V461 because the drive chain plates may not have been hardened correctly. Some 2014-2016 NC700s were in recall 15V439 for the starter relay switch.", reason="A broken chain or a stall can cause a crash. Repairs are free.")},
  add=[], lessons={"G": ["DCT bikes need the DCT clutch and filter serviced on schedule."]},
  recalls=[dict(id="12V461", years="2012 (some)", what="Drive chain plates may not be properly hardened and can fracture.", fix="Dealer inspects and replaces the chain free.", src="https://www.motorcyclistonline.com/news/recall-hondas-new-2012-nc700x")],
  known=[], forums=[]))

B13.append(dict(id="honda-crf450l-2019", make="Honda", model="CRF450L", name="Honda CRF450L", years=[2019, 2020],
  match=["crf450l", "crf 450l", "crf450rl"], style="dualsport", drive="chain",
  engine="449 cc liquid-cooled single, fuel injected",
  intro="A street-legal version of Honda's motocross 450. High-strung and needs frequent service.",
  focus=[["449 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Horn recall", "2019"], ["Valve clearances", "Check often"], ["Off-road wear", "Bearings and chain"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. All 2019 CRF450Ls were in recall 19V703 because the horn mount can break and the horn can fall off.", reason="The fix is free and quick.")},
  add=[], lessons={},
  recalls=[dict(id="19V703", years="2019", what="Horn mount can break and the horn can detach.", fix="Dealer replaces the horn and mount free.", src="https://ultimatemotorcycling.com/2019/10/17/honda-recalls-2019-crf450l-due-to-horn-bracket-defect/")],
  known=[], forums=[]))

B13.append(dict(id="honda-magna-v45-v65-1982", make="Honda", model="Magna V45/V65", name="Honda Magna V45 / V65", years=[1982, 1986],
  match=["magna", "v45", "v65", "v45 magna", "v65 magna", "vf700c", "vf750c", "vf1100c", "sabre"], style="cruiser", drive="shaft",
  engine="748 or 1098 cc liquid-cooled V4, four carbs, shaft drive",
  intro="Honda's early V4 cruisers. Fast and smooth. Early engines are known for cam and rocker wear.",
  focus=[["V4 engine", "Liquid-cooled"], ["Cam wear", "Early engines"], ["Four carbs", "Clean and sync"], ["Charging", "Stator connector"], ["Shaft drive", "Final drive oil"]],
  remove=CARB, patch={},
  add=[step("X-V4-01", "H", "H-003", "Inspect the cams and rockers", "With the valve covers off, look at the cam lobes and rocker faces for pitting and wear. Check the oil feed to the heads.", "Premature cam and rocker wear is the best-known problem on first-generation Honda V4s.", "The Honda V4 Cam Story", skill="Advanced", hours=3.0)],
  lessons={"H": ["Warm the engine fully before riding hard. Low oil flow to the top end at low rpm is part of the cam wear story."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Cam wear", what="Early V4 engines wore cam lobes, rocker faces and cam bearings prematurely.", src="https://www.math.uwaterloo.ca/~rblander/V4_cams.html")],
  forums=[]))

B13.append(dict(id="kawasaki-klr650-1987", make="Kawasaki", model="KLR650 (first gen)", name="Kawasaki KLR650 (1987-2007)", years=[1987, 2007],
  match=["klr650", "klr 650", "kl650", "klr"], style="dualsport", drive="chain",
  engine="651 cc liquid-cooled DOHC single, one carb, balancer shaft",
  intro="The first-generation KLR. Tough and simple. Upgrade the 'doohickey' balancer tensioner before it fails.",
  focus=[["651 cc single", "Liquid-cooled"], ["Doohickey", "Upgrade it"], ["One carb", "Jetting"], ["Chain drive", "Slack and lube"], ["Oil use", "Check level often"]],
  remove=CARB, patch={},
  add=[step("X-KLR-01", "H", "H-001", "Replace the doohickey and spring", "Fit an upgraded balancer chain idler lever and torsion spring, then set the balancer chain tension.", "The stock welded lever and spring can break, the balancer chain goes slack, and the engine can be destroyed.", "Law Abiding Biker KLR notes", skill="Advanced", hours=3.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Doohickey", what="The balancer chain tensioner lever and spring are prone to failure on 1987-2007 KLRs.", src="https://happy-trail.com/klr650-doohickey-balancer-idle-lever-parts-tools-all-years.html")],
  forums=[]))

B13.append(dict(id="kawasaki-ninja-250-ex250-2008", make="Kawasaki", model="Ninja 250 EX250", name="Kawasaki Ninja 250R", years=[2008, 2012],
  match=["ninja 250", "ninja 250r", "ex250", "ex250j"], style="sport", drive="chain",
  engine="249 cc liquid-cooled parallel twin, carbs",
  intro="The classic learner Ninja. Very tough. Check the few early recalls and look for drop damage.",
  focus=[["249 cc twin", "Liquid-cooled"], ["Carbs", "Clean if stored"], ["Recalls", "Several small ones"], ["Drops", "Levers, pegs, fairing"], ["Chain drive", "Slack and lube"]],
  remove=CARB,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Recalls include the front brake hose bracket on some 2008 bikes (08V115), engine case oil leaks on some 2009-2010 bikes (09V464) and passenger footpeg circlips on some 2012 bikes (12V081).", reason="These affect brakes, oil on the tire and pegs. Repairs are free.")},
  add=[], lessons={},
  recalls=[dict(id="09V464", years="2009-2010 (some)", what="Porous engine case may leak oil onto the rear tire.", fix="Free dealer inspection and repair.", src="https://www.autoevolution.com/news/kawasaki-recalls-2009-2010-ninja-250r-bikes-14464.html")],
  known=[], forums=[]))

B13.append(dict(id="kawasaki-ninja-zx-10r-2004", make="Kawasaki", model="Ninja ZX-10R", name="Kawasaki Ninja ZX-10R", years=[2004, 2020],
  match=["zx-10r", "zx10r", "ninja zx-10r", "zx1000"], style="sport", drive="chain",
  engine="998 cc liquid-cooled inline four, fuel injected",
  intro="Kawasaki's liter superbike. Several recalls across the years. Check for track and crash wear.",
  focus=[["998 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "R/R, gears, ECU"], ["Crash damage", "Frame and subframe"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Recalls include the regulator/rectifier on 2008-2011 bikes (12V064), transmission gears on 2016-2018 bikes, and an ECU backfire fix on 2019-2020 bikes (20V307).", reason="These can strand you, lock the gearbox or cause a fire. Repairs are free.")},
  add=[], lessons={"E": ["Check the frame spars, subframe and fairing mounts for scrapes and cracks."]},
  recalls=[dict(id="12V064", years="2008-2011 (some)", what="Regulator/rectifier may not charge the battery properly.", fix="Dealer replaces the regulator free.", src="https://vehiclesafetyrecalls.com/recall/12V064000"),
           dict(id="20V307", years="2019-2020", what="ECU programming can cause backfires that damage the air suction valves.", fix="Dealer reprograms the ECU and replaces damaged parts free.", src="https://vehiclesafetyrecalls.com/recall/20V307000")],
  known=[dict(title="Transmission gears", what="Kawasaki recalled 2016-2018 ZX-10Rs because hard shifting could break gears.", src="https://www.thedrive.com/motorcycles/18508/kawasaki-recalls-zx-10r-motorcycles-for-weak-gears.md")],
  forums=[]))

B13.append(dict(id="kawasaki-concours-14-2008", make="Kawasaki", model="Concours 14", name="Kawasaki Concours 14", years=[2008, 2016],
  match=["concours 14", "concours", "zg1400", "c14", "1400gtr"], style="touring", drive="shaft",
  engine="1352 cc liquid-cooled inline four, variable valve timing, fuel injected, shaft drive",
  intro="Kawasaki's sport tourer. Strong engine. Check the 2008-2012 recall and the ABS on high-mile bikes.",
  focus=[["1352 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["2008-2012 recall", "Run the VIN"], ["Shaft drive", "Final drive oil"], ["ABS", "Check function"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2008-2012 Concours 14s were in recall 12V343. Police-model bikes had several more.", reason="Open recalls are free to fix.")},
  add=[], lessons={},
  recalls=[dict(id="12V343", years="2008-2012", what="Kawasaki safety recall on 2008-2012 Concours 14 models. Check the VIN for details.", fix="Free dealer repair.", src="https://recallcheck.net/recall/12V343000")],
  known=[], forums=[]))

B13.append(dict(id="kawasaki-vulcan-1500-1600-1987", make="Kawasaki", model="Vulcan 1500/1600", name="Kawasaki Vulcan 1500 / 1600", years=[1987, 2008],
  match=["vulcan 1500", "vulcan 1600", "vn1500", "vn1600", "vulcan classic"], style="cruiser", drive="shaft",
  engine="1470 or 1552 cc liquid-cooled V-twin, carb or fuel injection, shaft drive",
  intro="Kawasaki's big Vulcans. Tough engines. Check the 2003-2004 oil filter recall on some models.",
  focus=[["Big V-twin", "Liquid-cooled"], ["Carb or EFI", "Depends on model"], ["Oil filter recall", "2003-2004"], ["Shaft drive", "Final drive oil"], ["Charging", "Test the R/R"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2003 Vulcan 1500 Classic, Drifter, 1600 Classic and 2003-2004 Mean Streak and Nomad FI bikes were in recall 04V023 because high oil pressure on a cold start can deform the oil filter.", reason="A deformed filter can leak oil. The repair is free.")},
  add=[], lessons={"G": ["Some Vulcans have a carb and some are fuel injected. Skip the steps that don't match your bike."]},
  recalls=[dict(id="04V023", years="2003-2004 (some models)", what="High oil pressure at cold start can deform the oil filter cartridge.", fix="Free dealer repair.", src="https://vehicleflaws.com/vehicle/kawasaki/vn1500-e6/2003")],
  known=[], forums=[]))

HERO_NAME_B13 = {"honda-sl350-1969": "SL350", "honda-cb1000r-2008": "CB1000R", "honda-nc700x-2012": "NC700X", "honda-crf450l-2019": "CRF450L",
  "honda-magna-v45-v65-1982": "MAGNA", "kawasaki-klr650-1987": "KLR650", "kawasaki-ninja-250-ex250-2008": "NINJA 250", "kawasaki-ninja-zx-10r-2004": "ZX-10R",
  "kawasaki-concours-14-2008": "CONCOURS", "kawasaki-vulcan-1500-1600-1987": "VULCAN"}
