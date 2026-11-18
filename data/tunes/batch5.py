"""Batch 5 bike tunes (top 100, rows 41-52; MT-09 and KZ440 wait for clean photos)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B5 = []
KZR = dict(name="KZRider forum", url="https://www.kzrider.com/", what="Owner forum for classic Kawasakis.")
TRI = dict(name="Kawasaki Triples forum", url="https://www.tapatalk.com/groups/kawasakitriples/", what="Owner forum for Kawasaki two-stroke triples.")

B5.append(dict(id="kawasaki-kz1000-1977", make="Kawasaki", model="KZ1000", name="Kawasaki KZ1000", years=[1977, 1980],
  match=["kz1000", "kz 1000", "z1000 1977", "kz1000a"], style="standard", drive="chain",
  engine="1,015 cc air-cooled DOHC inline four, four carbs",
  intro="The Z1's bigger brother. A tough engine; most trouble comes from past owners and tired charging parts.",
  focus=[["1,015 cc DOHC four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Charging", "Separate regulator and rectifier"], ["Past owner work", "Check every fastener"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"F": ["The stock regulator and rectifier are separate units. Test both before buying parts."], "B": ["Owners on KZRider say careless past owners cause most problems. Check every bolt and wire as you strip it."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Past owner work", what="Owners say careless previous work is the most common problem.", src="https://kzrider.com/forum/2-engine/601724-what-are-common-kz1000-cylinder-head-problems")],
  forums=[KZR]))

B5.append(dict(id="kawasaki-ninja-zx-6r-2019", make="Kawasaki", model="Ninja ZX-6R", name="Kawasaki Ninja ZX-6R", years=[2019, 2026],
  match=["zx-6r", "zx6r", "zx 6r", "ninja zx-6r", "zx636"], style="sport", drive="chain",
  engine="636 cc liquid-cooled inline four, fuel injected",
  intro="Kawasaki's 636 supersport. 2024-2026 bikes are under a do-not-ride recall for the crankshaft bushing.",
  focus=[["636 cc inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Do-not-ride recall", "2024-2026 bikes"], ["Fairing", "Clips and screws to label"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls before anything else. 2024-2026 ZX-6Rs are in recall 25V798 (which replaced 25V376) for a crankshaft bushing that can seize. Kawasaki says not to ride affected bikes until the repair is done.", reason="The engine can lose power or seize while riding.")},
  add=[], lessons={},
  recalls=[dict(id="25V798", years="2024-2026", what="Crankshaft bushing can seize and stop the engine. Do not ride until repaired.", fix="Free dealer repair once Kawasaki releases it. Bikes fixed under 25V376 need the new repair too.", src="https://cdn-fastly.motorcycle.com/bikes/news/kawasaki-ninja-zx-6r-recalled-a-second-time-for-the-same-issue-44657929")],
  known=[], forums=[]))

B5.append(dict(id="kawasaki-kz750-1980", make="Kawasaki", model="KZ750", name="Kawasaki KZ750", years=[1980, 1983],
  match=["kz750", "kz 750", "kz750e", "kz750 ltd", "kz750h", "kz750l"], style="standard", drive="chain",
  engine="738 cc air-cooled DOHC inline four, four carbs",
  intro="A bigger, better KZ650. Same simple four, with a few years of owner neglect to undo.",
  focus=[["738 cc DOHC four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Valve stem seals", "Smoke on startup"], ["Charging", "Test the stator"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"H": ["Smoke on a cold start often means hardened valve stem seals. Viton seals are a common upgrade."]},
  recalls=[], recallNote=OLD, known=[], forums=[KZR]))

B5.append(dict(id="kawasaki-versys-650-2015", make="Kawasaki", model="Versys 650", name="Kawasaki Versys 650", years=[2015, 2021],
  match=["versys 650", "versys", "kle650", "versys 650 lt"], style="adventure", drive="chain",
  engine="649 cc liquid-cooled parallel twin, fuel injected",
  intro="An upright road bike on the Ninja 650 engine. Simple to service, with luggage mounts to check.",
  focus=[["649 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Luggage mounts", "Check for cracks"], ["Chain drive", "Slack and lube"], ["Shared engine", "Same as Ninja 650"]],
  remove=EFI, patch={}, add=[], lessons={}, recalls=[], recallNote=VIN, known=[], forums=[]))

B5.append(dict(id="kawasaki-kz550-1980", make="Kawasaki", model="KZ550", name="Kawasaki KZ550", years=[1980, 1985],
  match=["kz550", "kz 550", "gpz550 1980", "kz550 ltd", "z550"], style="standard", drive="chain",
  engine="553 cc air-cooled DOHC inline four, four carbs",
  intro="A light middleweight four. Easy to work on, and parts are shared with other KZs.",
  focus=[["553 cc DOHC four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Cam chain", "Listen cold"], ["Charging", "Test the stator"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={}, add=[], lessons={}, recalls=[], recallNote=OLD, known=[], forums=[KZR]))

B5.append(dict(id="kawasaki-vulcan-900-2006", make="Kawasaki", model="Vulcan 900", name="Kawasaki Vulcan 900", years=[2006, 2026],
  match=["vulcan 900", "vn900", "vulcan 900 classic", "vulcan 900 custom"], style="cruiser", drive="belt",
  engine="903 cc liquid-cooled V-twin, fuel injected, belt drive",
  intro="Kawasaki's long-running mid-size cruiser. Belt drive and a simple service schedule.",
  focus=[["903 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Belt drive", "Check for cracks and tension"], ["Recalls", "Early fuel hose"], ["Chrome", "Pitting and rust"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Many 2006-2008 Vulcan 900s were in recall 08V114 to inspect and replace a fuel hose.", reason="A damaged fuel hose can leak. The repair is free.")},
  add=[], lessons={},
  recalls=[dict(id="08V114", years="2006-2008", what="Fuel hose may need replacing.", fix="Free dealer inspection and replacement.", src="https://www.vehiclesafetyrecalls.com/recall/08V114000")],
  known=[], forums=[]))

B5.append(dict(id="kawasaki-kz400-1974", make="Kawasaki", model="KZ400", name="Kawasaki KZ400", years=[1974, 1984],
  match=["kz400", "kz 400", "z400", "kz400d", "kz400s"], style="standard", drive="chain",
  engine="398 cc air-cooled SOHC parallel twin",
  intro="Kawasaki's answer to the Honda CB350. A plain, reliable twin that's good to learn on.",
  focus=[["398 cc twin", "Air-cooled"], ["Carbs", "Rebuild and sync"], ["Electric start", "Check the starter"], ["Charging", "Test before buying parts"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"A": ["Get the Kawasaki factory service manual. Owners on KZRider say it saves most beginner mistakes."]},
  recalls=[], recallNote=OLD, known=[], forums=[KZR]))

B5.append(dict(id="yamaha-yzf-r3-2015", make="Yamaha", model="YZF-R3", name="Yamaha YZF-R3", years=[2015, 2018],
  match=["yzf-r3", "r3", "yzf r3", "yzfr3"], style="sport", drive="chain",
  engine="321 cc liquid-cooled parallel twin, fuel injected",
  intro="Yamaha's small sport twin. Early bikes had several recalls, so check them all before you start.",
  focus=[["321 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "Several on 2015-2016"], ["Radiator hose", "Recall 18V861"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2015-2018 R3s were in radiator hose recall 18V861, and 2015-2016 bikes also had recalls for the shifter spring (18V860), clutch bearing, fuel tank bracket and ignition switch.", reason="Several of these can stall the bike or leak coolant. All repairs are free.")},
  add=[], lessons={},
  recalls=[dict(id="18V861", years="2015-2018", what="Upper radiator hose may crack and leak coolant.", fix="Dealer fits a new hose free.", src="https://auto-recalls.justia.com/yamaha/yzf-r3/2017/18v861000"),
           dict(id="18V860", years="2015-2016", what="Gear shift return spring may break.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/18V860000")],
  known=[], forums=[]))

B5.append(dict(id="kawasaki-h1-mach-iii-500-1969", make="Kawasaki", model="H1 Mach III", name="Kawasaki H1 Mach III 500", years=[1969, 1975],
  match=["h1", "mach iii", "mach 3", "h1 500", "kh500", "h1 mach iii"], style="standard", drive="chain",
  engine="499 cc air-cooled two-stroke triple, three carbs, oil injection, CDI",
  intro="The original Kawasaki triple. A fast two-stroke where crank seals and ignition decide everything.",
  focus=[["Two-stroke triple", "Air-cooled"], ["Crank seals", "Dry out with age"], ["Oil injection", "Check the pump"], ["CDI ignition", "Common fault"], ["Brakes", "Weak when new"]],
  remove=CARB + AIR + ["H-003"],
  patch={},
  add=[step("X-H1-01", "H", "H-001", "Check the crank seals", "Pressure or vacuum test the crankcase, or plan on new seals. Old seals between the cylinders leak and let the engine run lean.", "Seals dry out over the decades, and a leaking seal can seize a two-stroke.", "Classic Bike Guide H1 restoration", skill="Advanced", hours=2.0),
       step("X-H1-02", "H", "H-001", "Service the oil injection pump", "Bleed the oil injection lines and check the pump cable adjustment so each cylinder gets oil.", "The engine is lubricated only by the injected oil.", "Retrospective: 1969 Kawasaki H1", hours=1.0)],
  lessons={"F": ["Most H1s use CDI ignition. If it cuts out or won't start when hot, suspect the CDI box or coils first."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Worn crank seals", what="Seals wear and dry out with age.", src="https://www.pressreader.com/uk/classic-bike-guide/20200824/284051964196201")],
  forums=[TRI]))

B5.append(dict(id="yamaha-yzf-r6-2006", make="Yamaha", model="YZF-R6", name="Yamaha YZF-R6", years=[2006, 2016],
  match=["yzf-r6", "r6", "yzf r6", "yzfr6"], style="sport", drive="chain",
  engine="599 cc liquid-cooled inline four, fuel injected",
  intro="Yamaha's high-revving 600. Check the charging system and gearbox before anything else.",
  focus=[["599 cc inline four", "Liquid-cooled"], ["Fuel injected", "Throttle body sync"], ["Charging", "Stator and regulator"], ["Gearbox", "Check every gear"], ["Fairing", "Clips and screws to label"]],
  remove=EFI,
  patch={"F-002": dict(title="Test the charging system", instructions="With a charged battery, measure voltage at the battery at idle and at higher rpm. If it's low or high, test the regulator/rectifier and the stator.", reason="Stator and regulator failures are a known R6 problem.")},
  add=[], lessons={"B": ["On the test ride, run through every gear under load. Gearbox problems are a known R6 complaint."]},
  recalls=[dict(id="10V365", years="2006-2010", what="Front side reflectors mounted at the wrong height.", fix="Free dealer repair.", src="https://www.vehiclesafetyrecalls.com/recall/10V365000")],
  known=[dict(title="Stator and regulator", what="Charging system faults are common on R6s.", src="https://www.slashgear.com/1998333/yamaha-r6-biggest-problems/")],
  forums=[]))

HERO_NAME_B5 = {"kawasaki-kz1000-1977": "KZ1000", "kawasaki-ninja-zx-6r-2019": "ZX-6R", "kawasaki-kz750-1980": "KZ750", "kawasaki-versys-650-2015": "VERSYS",
  "kawasaki-kz550-1980": "KZ550", "kawasaki-vulcan-900-2006": "VULCAN 900", "kawasaki-kz400-1974": "KZ400", "yamaha-yzf-r3-2015": "R3",
  "kawasaki-h1-mach-iii-500-1969": "MACH III", "yamaha-yzf-r6-2006": "R6"}
