"""Batch 34 bike tunes (top 500, rows 331-340)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch31 import CARB4
B34 = []
KAWF = dict(name="KawiForums", url="https://www.kawiforums.com/", what="Owner forum for Kawasaki motorcycles.")
VULF = dict(name="Vulcan Riders Association", url="https://www.vulcanriders.org/", what="Owner club and forum for Kawasaki Vulcans.")
COG = dict(name="COG (Concours Owners Group)", url="https://www.cog-online.org/", what="Owner club for Kawasaki Concours sport tourers.")
OILF04 = dict(id="04V023", years="2003-2004 (some Classic, Drifter, Mean Streak, Nomad FI)", what="High oil pressure on a cold start can deform the oil filter cartridge.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/04V023000")
H2CAM = dict(id="22V912", years="2015-2023 (model list varies)", what="Cam chain tensioner plunger can lock, which can stall the engine.", fix="Dealer replaces the cam chain tensioner free.", src="https://vehiclesafetyrecalls.com/recall/22V912000")
H2OIL = dict(id="21V593", years="2020-2021 (some)", what="Oil pressure relief valve problem can cause a loss of oil pressure and an engine stall.", fix="Dealer replaces the valve free.", src="https://vehiclesafetyrecalls.com/recall/21V593000")

B34.append(dict(id="honda-cb750-hornet-2023", make="Honda", model="CB750 Hornet", name="Honda CB750 Hornet", years=[2023, 2026],
  match=["cb750 hornet", "hornet 750", "cb750 2023", "honda hornet", "cb 750 hornet"], style="standard", drive="chain",
  engine="755 cc liquid-cooled parallel twin, fuel injected, ride-by-wire",
  intro="Honda's modern 750 naked twin. Same engine as the Transalp, with rider modes and a TFT dash.",
  focus=[["755 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Ride modes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B34.append(dict(id="kawasaki-ninja-1000-ninja-1000sx-2011", make="Kawasaki", model="Ninja 1000 / Ninja 1000SX", name="Kawasaki Ninja 1000 / 1000SX", years=[2011, 2026],
  match=["ninja 1000", "ninja 1000sx", "ninja1000", "z1000sx", "zx1000 2011", "ninja 1000 abs"], style="sport", drive="chain",
  engine="1043 cc liquid-cooled inline four, fuel injected",
  intro="Kawasaki's sport tourer four. Comfortable, fast and often fitted with bags.",
  focus=[["1043 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Luggage", "Check mounts"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[KAWF]))

B34.append(dict(id="kawasaki-ninja-h2-2015", make="Kawasaki", model="Ninja H2", name="Kawasaki Ninja H2 / H2 SX", years=[2015, 2026],
  match=["ninja h2", "h2", "h2 sx", "ninja h2 sx", "h2 carbon", "zx1000n", "ninja h2 sx se"], style="sport", drive="chain",
  engine="998 cc supercharged liquid-cooled inline four, fuel injected",
  intro="Kawasaki's supercharged four. Most of the work here is on the dealer side, and many bikes are in a cam chain tensioner recall.",
  focus=[["998 cc four", "Supercharged"], ["Fuel injected", "No carbs"], ["Cam tensioner", "Recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Many 2015-2023 H2 models are in recall 22V912 (cam chain tensioner), and some 2020-2021 bikes in 21V593 (oil pressure relief valve).", reason="Both can stall the engine while riding. The fixes are free.")},
  add=[], lessons={"H": ["The supercharger and its service are dealer work for most owners. Follow the manual's intervals."]},
  recalls=[H2CAM, H2OIL], known=[], forums=[KAWF]))

B34.append(dict(id="kawasaki-z-h2-2020", make="Kawasaki", model="Z H2", name="Kawasaki Z H2", years=[2020, 2026],
  match=["z h2", "zh2", "z h2 se", "zr1000k", "z-h2"], style="standard", drive="chain",
  engine="998 cc supercharged liquid-cooled inline four, fuel injected",
  intro="The naked supercharged Kawasaki. 2020-2023 bikes have a cam chain tensioner recall, and some 2020-2021 bikes an oil valve recall.",
  focus=[["998 cc four", "Supercharged"], ["Fuel injected", "No carbs"], ["Cam tensioner", "Recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2020-2023 Z H2s are in recall 22V912 (cam chain tensioner), and some 2020-2021 bikes in 21V593 (oil pressure relief valve).", reason="Both can stall the engine while riding. The fixes are free.")},
  add=[], lessons={},
  recalls=[H2CAM, H2OIL], known=[], forums=[KAWF]))

B34.append(dict(id="kawasaki-z900rs-2018", make="Kawasaki", model="Z900RS", name="Kawasaki Z900RS", years=[2018, 2026],
  match=["z900rs", "z900 rs", "z900rs cafe", "zr900c", "z900rs se"], style="standard", drive="chain",
  engine="948 cc liquid-cooled inline four, fuel injected",
  intro="The retro Kawasaki four. Looks like a Z1, works like a modern bike. A few recalls cover different years.",
  focus=[["948 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "Several"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2018 bikes are in recall 18V866 (rear brake hose routing), some 2019 bikes in 19V083 (ABS unit), and some 2024 bikes in 24V270 (front tire).", reason="All fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="18V866", years="2018 (some)", what="Rear brake hose and wheel sensor wire may be routed wrong and touch the rear tire.", fix="Free dealer repair.", src="https://www.vehiclesafetyrecalls.com/recall/18V866000"),
           dict(id="19V083", years="2019 ABS (some)", what="ABS unit fault that may lock a wheel.", fix="Dealer inspects the ABS unit and replaces it if needed, free.", src="https://auto-recalls.justia.com/kawasaki/z900/2019/19v083000"),
           dict(id="24V270", years="2024 (some)", what="Front tire may have inner wall blistering and fail.", fix="Dealer replaces the front tire free.", src="https://vehiclesafetyrecalls.com/recall/24V270000")],
  known=[], forums=[KAWF]))

B34.append(dict(id="kawasaki-concours-zg1000-1986", make="Kawasaki", model="Concours ZG1000", name="Kawasaki Concours (ZG1000)", years=[1986, 2006],
  match=["concours", "zg1000", "zg 1000", "concours 1000", "c10"], style="touring", drive="shaft",
  engine="997 cc liquid-cooled inline four, four carbs, shaft drive",
  intro="The first Concours, built on the GPz900R engine. Four carbs, shaft drive and a long production run.",
  focus=[["997 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Shaft drive", "Change the oil"], ["Charging", "Check R/R"], ["Bodywork", "Many panels"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[COG]))

B34.append(dict(id="kawasaki-voyager-xii-zg1200-1986", make="Kawasaki", model="Voyager XII (ZG1200)", name="Kawasaki Voyager XII", years=[1986, 2003],
  match=["voyager xii", "voyager 1200", "zg1200", "zg 1200", "voyager 12"], style="touring", drive="shaft",
  engine="1196 cc liquid-cooled inline four, four carbs, shaft drive",
  intro="Kawasaki's full-dress tourer for nearly 20 years. Four carbs, shaft drive and a lot of fairing.",
  focus=[["1196 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Shaft drive", "Change the oil"], ["Fairing", "Lots of wiring"], ["Charging", "Check R/R"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[KAWF]))

B34.append(dict(id="kawasaki-vulcan-1700-voyager-nomad-vaquero-2009", make="Kawasaki", model="Vulcan 1700 Voyager / Nomad / Vaquero", name="Kawasaki Vulcan 1700 (Voyager, Nomad, Vaquero, Classic)", years=[2009, 2023],
  match=["vulcan 1700", "vn1700", "voyager 1700", "vulcan 1700 voyager", "nomad 1700", "vaquero", "vulcan 1700 vaquero", "vulcan 1700 classic"], style="touring", drive="belt",
  engine="1700 cc liquid-cooled V-twin, fuel injected, belt drive",
  intro="Kawasaki's big belt-drive V-twin tourers. 2009-2015 Voyagers and 2011-2015 Vaqueros have an ignition wire recall.",
  focus=[["1700 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Belt drive", "Check wear"], ["Ignition wire", "2009-15 recall"], ["Fairing", "Lots of wiring"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2009-2015 Voyagers and 2011-2015 Vaqueros are in recall 15V550 for an ignition switch wire that can chafe on the tank.", reason="A short can stall the engine. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="15V550", years="2009-2015 Voyager, 2011-2015 Vaquero", what="Ignition switch wire can chafe against the fuel tank and short, stalling the engine.", fix="Dealer replaces damaged switches and adds shielding and padding, free.", src="https://www.vehiclesafetyrecalls.com/recall/15V550000")],
  known=[], forums=[VULF]))

B34.append(dict(id="kawasaki-vulcan-1500-nomad-drifter-1998", make="Kawasaki", model="Vulcan 1500 Nomad / Drifter / Classic", name="Kawasaki Vulcan 1500 (Nomad, Drifter, Classic)", years=[1998, 2008],
  match=["vulcan 1500 nomad", "nomad 1500", "vn1500 nomad", "drifter", "vulcan drifter", "drifter 1500", "vulcan 1500 classic", "vn1500 classic", "nomad"], style="cruiser", drive="shaft",
  engine="1470 cc liquid-cooled V-twin, carb or fuel injected depending on model, shaft drive",
  intro="The later 1500 Vulcans. Some have a carb, some fuel injection. All are shaft drive.",
  focus=[["1470 cc V-twin", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Shaft drive", "Change the oil"], ["Cooling", "Coolant and fan"], ["Charging", "Check R/R"]],
  remove=[], patch={}, add=[], lessons={"G": ["Check which you have. Carbureted bikes get the carb steps; fuel-injected bikes skip them."]},
  recalls=[OILF04], recallNote=VIN, known=[], forums=[VULF]))

B34.append(dict(id="kawasaki-klx110-2002", make="Kawasaki", model="KLX110", name="Kawasaki KLX110", years=[2002, 2026],
  match=["klx110", "klx 110", "klx110l", "klx110r"], style="dualsport", drive="chain",
  engine="112 cc air-cooled single, carb, semi-auto or manual clutch",
  intro="A small kids' and pit bike. One carb, simple to work on, and usually ridden hard.",
  focus=[["112 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Clutch", "Auto or manual"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

HERO_NAME_B34 = {"honda-cb750-hornet-2023": "HORNET", "kawasaki-ninja-1000-ninja-1000sx-2011": "NINJA 1000", "kawasaki-ninja-h2-2015": "NINJA H2",
  "kawasaki-z-h2-2020": "Z H2", "kawasaki-z900rs-2018": "Z900RS", "kawasaki-concours-zg1000-1986": "CONCOURS", "kawasaki-voyager-xii-zg1200-1986": "VOYAGER",
  "kawasaki-vulcan-1700-voyager-nomad-vaquero-2009": "VULCAN 1700", "kawasaki-vulcan-1500-nomad-drifter-1998": "NOMAD", "kawasaki-klx110-2002": "KLX110"}
