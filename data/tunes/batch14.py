"""Batch 14 bike tunes (top 500, rows 131-140)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B14 = []
KZR = dict(name="KZRider forum", url="https://www.kzrider.com/", what="Owner forum for classic Kawasakis.")
KZ13 = dict(name="KZ1300 forum", url="https://kz1300.kzrider.com/", what="Owner forum for the Kawasaki Z1300 six.")
KT = dict(name="Kawasaki Triples forum", url="https://www.tapatalk.com/groups/kawasakitriples/", what="Owner forum for Kawasaki two-stroke triples.")

B14.append(dict(id="kawasaki-vulcan-2000-2004", make="Kawasaki", model="Vulcan 2000", name="Kawasaki Vulcan 2000", years=[2004, 2010],
  match=["vulcan 2000", "vn2000", "vulcan 2000 classic"], style="cruiser", drive="belt",
  engine="2053 cc liquid-cooled V-twin, fuel injected, belt drive",
  intro="Kawasaki's huge V-twin cruiser. Check the 2004 brake hose recall and the front belt pulley.",
  focus=[["2053 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["2004 recall", "Brake hose"], ["Belt drive", "Front pulley"], ["Charging", "Stator and R/R"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2004 Vulcan 2000s were in recall 04V367 for a brake hose.", reason="A brake hose fault can cost you braking. The repair is free.")},
  add=[step("X-V2K-01", "E", "E-002", "Check the front belt pulley", "With the cover off, check the front drive pulley teeth and the pulley nut. Owners report stripped front pulleys.", "A stripped pulley leaves you with no drive.", "NHTSA owner complaints", hours=1.0)],
  lessons={}, recalls=[dict(id="04V367", years="2004 (some)", what="Brake hose recall on some 2004 bikes.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/kawasaki/vulcan-2000/2004/04v367000")],
  known=[], forums=[]))

B14.append(dict(id="kawasaki-w650-w800-1999", make="Kawasaki", model="W650/W800", name="Kawasaki W650 / W800", years=[1999, 2016],
  match=["w650", "w800", "w 650", "w 800", "w400"], style="standard", drive="chain",
  engine="676 cc (W650, carbs) or 773 cc (W800, fuel injected) air-cooled SOHC parallel twin, bevel-drive cam",
  intro="Kawasaki's retro twin with a bevel-driven cam. Very reliable. The bevel drive must be set up right after any work.",
  focus=[["Air-cooled twin", "Bevel-drive cam"], ["Carb or EFI", "W650 carbs, W800 EFI"], ["Bevel drive", "Listen and look for weeps"], ["Carb diaphragms", "Crack with age"], ["Chain drive", "Slack and lube"]],
  remove=AIR, patch={},
  add=[step("X-W65-01", "H", "H-003", "Check the bevel drive", "Listen for unusual noise from the bevel drive tower and look for oil weeping at the top and bottom of the shaft.", "The bevel drive is easy to set up wrong during service, and that causes wear.", "Return of the Cafe Racers W650 notes", hours=0.5)],
  lessons={"G": ["W650s have carbs and W800s are fuel injected. Skip the steps that don't match your bike."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Bevel drive setup", what="Owners say the bevel drive adjustment is different from Ducati's and often gets done wrong during service.", src="https://www.returnofthecaferacers.com/?p=1060")],
  forums=[]))

B14.append(dict(id="kawasaki-kz1300-1979", make="Kawasaki", model="KZ1300", name="Kawasaki KZ1300 / Z1300", years=[1979, 1989],
  match=["kz1300", "z1300", "kz 1300", "voyager 1300", "zn1300"], style="standard", drive="shaft",
  engine="1286 cc liquid-cooled DOHC inline six, three carbs (later fuel injected), shaft drive",
  intro="Kawasaki's liquid-cooled six. The water pump drive and its mechanical seal are the big worry.",
  focus=[["1286 cc inline six", "Liquid-cooled"], ["Water pump seal", "Check for water in oil"], ["Carbs or EFI", "Depends on year"], ["Shaft drive", "Final drive oil"], ["Cooling", "Thermostat and flow"]],
  remove=[], patch={},
  add=[step("X-Z13-01", "H", "H-004", "Check the water pump and its seal", "Check the oil for coolant and the weep hole for drips. Inspect the water pump drive and mechanical seal.", "A failed mechanical seal puts coolant in the oil.", "KZ1300 forum", skill="Advanced", hours=3.0)],
  lessons={"G": ["Early bikes have carbs and later ones are fuel injected. Skip the steps that don't match your bike."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Water pump seal", what="A broken water pump mechanical seal can let coolant into the oil.", src="https://kz1300.kzrider.com/forum/engines/4053-waterpump-mechanical-seal?start=12")],
  forums=[KZ13]))

B14.append(dict(id="kawasaki-h2-mach-iv-1972", make="Kawasaki", model="H2 Mach IV", name="Kawasaki H2 Mach IV 750", years=[1972, 1975],
  match=["h2", "mach iv", "mach 4", "h2 750", "h2a", "h2b", "h2c"], style="standard", drive="chain",
  engine="748 cc air-cooled two-stroke triple, three carbs, CDI ignition, oil injection",
  intro="Kawasaki's wild 750 triple. Crank seals between the cylinders and the oil pump decide whether it survives.",
  focus=[["748 cc two-stroke triple", "Air-cooled"], ["Crank seals", "Need a specialist"], ["Oil injection", "Pump and lines"], ["Three carbs", "Clean and sync"], ["Handling", "Check steering head"]],
  remove=CARB + AIR + ["H-003"], patch={},
  add=[step("X-H2-01", "H", "H-001", "Leak-down test the crankcase", "Pressure test each crankcase. The center seals between cylinders can't be changed without pressing the crank apart.", "Dried-out crank seals are expected on triples that sat, and leaking seals make a cylinder run lean.", "Grassroots Motorsports H1 thread", skill="Advanced", hours=2.0)],
  lessons={"H": ["Have the crank rebuilt by a shop that knows Kawasaki triple cranks."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Crank seals", what="Multi-cylinder two-strokes have seals between the cylinders that dry out with age.", src="https://grassrootsmotorsports.com/forum/build-projects-and-project-cars/1971-kawasaki-h1/138158/page1")],
  forums=[KT]))

B14.append(dict(id="kawasaki-kz1000-police-1982", make="Kawasaki", model="KZ1000 Police", name="Kawasaki KZ1000P Police", years=[1982, 2005],
  match=["kz1000p", "kz1000 police", "kzp", "kz1000-p", "police kawasaki"], style="standard", drive="chain",
  engine="1015 cc air-cooled DOHC inline four, four carbs, high-output alternator",
  intro="The long-running Kawasaki police bike. Tough engine. Fleet wear and hacked police wiring are the usual trouble.",
  focus=[["1015 cc DOHC four", "Air-cooled"], ["Four carbs", "Pilot jets clog"], ["Charging", "R/R and connectors"], ["Police wiring", "Check every splice"], ["Cam chain tensioner", "Cold rattle"]],
  remove=CARB + AIR, patch={},
  add=[step("X-KZP-01", "F", "F-003", "Check the police wiring", "Trace any leftover radio, siren and light wiring. Remove what isn't used and check for melted connectors.", "Ex-police wiring is often cut and spliced, and it causes battery drain and shorts.", "Motoryk KZ1000P notes", hours=2.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Charging and wiring", what="The alternator, regulator/rectifier and hacked police wiring are the classic weak points.", src="https://motoryk.com/bikes/kawasaki/kz1000p")],
  forums=[KZR]))

B14.append(dict(id="kawasaki-ninja-900-gpz900r-1984", make="Kawasaki", model="Ninja 900 / GPz900R", name="Kawasaki Ninja 900 / GPz900R", years=[1984, 1990],
  match=["gpz900r", "gpz 900r", "ninja 900", "zx900", "zx900a", "top gun ninja"], style="sport", drive="chain",
  engine="908 cc liquid-cooled DOHC 16-valve inline four, four carbs",
  intro="The first Ninja. A strong engine. Age brings tired wiring, cam chain tensioners and hard-to-find parts.",
  focus=[["908 cc four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Cam chain tensioner", "Rattle"], ["Wiring", "Brittle and corroded"], ["Parts", "Bodywork scarce"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD,
  known=[dict(title="Wiring", what="The harness can become brittle and corroded with age.", src="https://atvutv.neocities.org/kawasaki-gpz900r-problems")],
  forums=[KZR]))

B14.append(dict(id="kawasaki-zrx1100-1200-1997", make="Kawasaki", model="ZRX1100/1200", name="Kawasaki ZRX1100 / ZRX1200", years=[1997, 2005],
  match=["zrx1100", "zrx1200", "zrx", "zrx1200r", "zrx1200s"], style="standard", drive="chain",
  engine="1052 or 1164 cc liquid-cooled DOHC inline four, four carbs",
  intro="Kawasaki's retro muscle bike. Strong and simple. Carb sync and the charging system are the usual jobs.",
  focus=[["Big inline four", "Liquid-cooled"], ["Four carbs", "Sync and floats"], ["Charging", "Stator and R/R"], ["Brakes", "Check for warped discs"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[],
  lessons={"G": ["If it sat, clean the carbs and set float levels. Sync them after."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Carbs", what="The Keihin CVK carbs gum up and need cleaning if the bike sat.", src="https://atvutv.neocities.org/kawasaki-zrx-1100-problems")],
  forums=[]))

B14.append(dict(id="kawasaki-klx300-2021", make="Kawasaki", model="KLX300", name="Kawasaki KLX300", years=[2021, 2026],
  match=["klx300", "klx 300", "klx300sm", "klx300r"], style="dualsport", drive="chain",
  engine="292 cc liquid-cooled DOHC single, fuel injected",
  intro="A light, simple dual-sport. Mostly routine service and off-road wear.",
  focus=[["292 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valve clearances", "Check on time"], ["Off-road wear", "Bearings and chain"], ["Air filter", "Clean often"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B14.append(dict(id="kawasaki-z400-2019", make="Kawasaki", model="Z400", name="Kawasaki Z400", years=[2019, 2026],
  match=["z400", "z 400", "z400 abs"], style="standard", drive="chain",
  engine="399 cc liquid-cooled parallel twin, fuel injected",
  intro="The naked Ninja 400. Check the 2021 cam chain tensioner recall, which carries a do-not-ride warning.",
  focus=[["399 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Tensioner recall", "2021"], ["Chain drive", "Slack and lube"], ["Drops", "Levers and pegs"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Some 2021 Z400 ABS bikes are in recall 20V774 because the cam chain tensioner may be too weak. Kawasaki says not to ride until it's replaced.", reason="A failed tensioner can wreck the engine. The repair is free.")},
  add=[], lessons={},
  recalls=[dict(id="20V774", years="2021 (some)", what="Cam chain tensioner may be improperly heat-treated and fail. Do not ride until repaired.", fix="Dealer replaces the tensioner free.", src="https://vehiclesafetyrecalls.com/recall/20V774000")],
  known=[], forums=[]))

B14.append(dict(id="kawasaki-vulcan-800-1995", make="Kawasaki", model="Vulcan 800", name="Kawasaki Vulcan 800", years=[1995, 2006],
  match=["vulcan 800", "vn800", "vulcan 800 classic", "vulcan 800 drifter", "drifter 800"], style="cruiser", drive="chain",
  engine="805 cc liquid-cooled V-twin, one carb, chain drive",
  intro="A simple mid-size Vulcan. Unlike most cruisers it uses a chain. Charging and the carb are the usual jobs.",
  focus=[["805 cc V-twin", "Liquid-cooled"], ["One carb", "Clean if stored"], ["Chain drive", "Slack and lube"], ["Charging", "Stator and R/R"], ["Cooling", "Check coolant"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD,
  known=[dict(title="Chain drive", what="The VN800 is chain-driven, so it needs regular chain care.", src="https://maintenanceschedule.com/?p=4565")],
  forums=[]))

HERO_NAME_B14 = {"kawasaki-vulcan-2000-2004": "VULCAN 2000", "kawasaki-w650-w800-1999": "W650", "kawasaki-kz1300-1979": "KZ1300", "kawasaki-h2-mach-iv-1972": "H2",
  "kawasaki-kz1000-police-1982": "KZ1000P", "kawasaki-ninja-900-gpz900r-1984": "GPZ900R", "kawasaki-zrx1100-1200-1997": "ZRX", "kawasaki-klx300-2021": "KLX300",
  "kawasaki-z400-2019": "Z400", "kawasaki-vulcan-800-1995": "VULCAN 800"}
