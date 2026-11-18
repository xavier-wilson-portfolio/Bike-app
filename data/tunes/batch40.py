"""Batch 40 bike tunes (top 500, rows 391-400)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch31 import CARB4
from batch39 import RR16, VSTR, DIRT4
B40 = []
TWO = CARB + AIR + ["H-003"]
SUZF = dict(name="Suzuki Cycles forum", url="https://www.suzukicycles.org/", what="Owner site for vintage Suzuki motorcycles.")
BLVD = dict(name="Suzuki Boulevard forums", url="https://www.boulevardriders.com/", what="Owner forum for Suzuki Boulevard and Intruder cruisers.")
GSR = dict(name="The GS Resources", url="https://www.thegsresources.com/", what="Owner forum for air-cooled Suzuki GS fours.")

B40.append(dict(id="suzuki-ts185-ts250-1971", make="Suzuki", model="TS185 / TS250", name="Suzuki TS185 / TS250", years=[1971, 1981],
  match=["ts185", "ts250", "ts 185", "ts 250", "ts125", "ts100"], style="dualsport", drive="chain",
  engine="183 or 246 cc air-cooled two-stroke single, carb, Posi-Force oil injection",
  intro="Suzuki's two-stroke trail bikes of the 70s. Oil injection, points and six-volt electrics on many.",
  focus=[["Two-stroke", "Oil injected"], ["Carb", "Clean it out"], ["Oil pump", "Bleed it"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  remove=TWO, patch={}, add=[], lessons={"G": ["Check the oil injection: the tank feeds the pump, the lines are bled, and the pump cable opens with the throttle."]},
  recalls=[], recallNote=OLD, known=[], forums=[SUZF]))

B40.append(dict(id="suzuki-gn125-gn250-1982", make="Suzuki", model="GN125 / GN250", name="Suzuki GN125 / GN250", years=[1982, 2001],
  match=["gn125", "gn250", "gn 125", "gn 250", "gn125e"], style="standard", drive="chain",
  engine="124 or 249 cc air-cooled single, one carb",
  intro="Suzuki's simple small singles. Cheap, slow and easy to fix.",
  focus=[["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Screw adjusters"], ["Drum rear", "Shoes and rod"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[]))

B40.append(dict(id="suzuki-dr-z250-2001", make="Suzuki", model="DR-Z250", name="Suzuki DR-Z250", years=[2001, 2007],
  match=["dr-z250", "drz250", "drz 250", "dr-z 250"], style="dualsport", drive="chain",
  engine="249 cc air-cooled single, carb",
  intro="A small street-legal Suzuki trail bike. One carb and simple service.",
  focus=[["249 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Shim type"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B40.append(dict(id="suzuki-gs1150-1984", make="Suzuki", model="GS1150", name="Suzuki GS1150E / ES", years=[1984, 1986],
  match=["gs1150", "gs 1150", "gs1150e", "gs1150es", "gs1150g"], style="standard", drive="chain",
  engine="1135 cc air-cooled inline four, four carbs",
  intro="The last of the big air-cooled GS fours. Four carbs, anti-dive forks and lots of torque.",
  focus=[["1135 cc four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Anti-dive", "Check seals"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[GSR]))

B40.append(dict(id="suzuki-intruder-800-volusia-c50-1992", make="Suzuki", model="Intruder 800 / Volusia", name="Suzuki Intruder 800 / Volusia 800", years=[1992, 2004],
  match=["intruder 800", "vs800", "vs 800", "volusia", "volusia 800", "vl800 volusia", "vs800gl"], style="cruiser", drive="shaft",
  engine="805 cc liquid-cooled V-twin, two carbs, shaft drive",
  intro="Suzuki's 800 cruisers before the Boulevard name. Two carbs and shaft drive.",
  focus=[["805 cc V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Shaft drive", "Change the oil"], ["Charging", "Check R/R"], ["Cooling", "Coolant and fan"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[BLVD]))

B40.append(dict(id="suzuki-intruder-1500-lc-c90-1998", make="Suzuki", model="Intruder 1500 LC / Boulevard C90", name="Suzuki Intruder 1500 LC / Boulevard C90", years=[1998, 2014],
  match=["intruder 1500", "vl1500", "vl 1500", "c90", "boulevard c90", "c90t", "c90 boss"], style="cruiser", drive="shaft",
  engine="1462 cc liquid-cooled V-twin, carbs then fuel injection, shaft drive",
  intro="Suzuki's 1500 cruiser. 1998-2005 bikes and some 2006 bikes have a fuel tank recall that Suzuki said not to ride with.",
  focus=[["1462 cc V-twin", "Liquid-cooled"], ["Fuel", "Carbs then EFI"], ["Fuel tank", "1998-2006 recall"], ["Shaft drive", "Change the oil"], ["Charging", "Stator"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. All 1998-2005 VL1500s and some 2006 VL1500 and C90 bikes are in recall 06V025 for a fuel tank that can seep fuel.", reason="Seeping fuel is a fire risk. Suzuki said not to ride an affected bike until it is fixed. The fix is free.")},
  add=[], lessons={"G": ["Check which you have. Carbureted bikes get the carb steps; fuel-injected bikes skip them."]},
  recalls=[dict(id="06V025", years="1998-2005, some 2006", what="Fuel tank can seep fuel, which is a fire risk.", fix="Dealer inspects and replaces the fuel tank free.", src="https://auto-recalls.justia.com/suzuki/vl1500/2001/06v025000")],
  known=[], forums=[BLVD]))

B40.append(dict(id="suzuki-boulevard-m90-m109r2-2009", make="Suzuki", model="Boulevard M90", name="Suzuki Boulevard M90", years=[2009, 2019],
  match=["m90", "boulevard m90", "vz1500", "m90 boulevard"], style="cruiser", drive="shaft",
  engine="1462 cc liquid-cooled V-twin, fuel injected, shaft drive",
  intro="The middle Boulevard muscle cruiser. 2009-2010 bikes are in a regulator/rectifier recall.",
  focus=[["1462 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Regulator", "2009-10 recall"], ["Shaft drive", "Change the oil"], ["Cooling", "Coolant and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2009-2010 M90s are in recall 16V018 for the regulator/rectifier.", reason="A failed regulator can stall the engine. The fix is free.")},
  add=[], lessons={},
  recalls=[RR16], known=[], forums=[BLVD]))

B40.append(dict(id="suzuki-rm-z450-2005", make="Suzuki", model="RM-Z450", name="Suzuki RM-Z450", years=[2005, 2026],
  match=["rm-z450", "rmz450", "rmz 450", "rm-z 450"], style="dualsport", drive="chain",
  engine="449 cc liquid-cooled four-stroke single, fuel injected on later bikes",
  intro="Suzuki's 450 four-stroke motocross bike. Hour-based service, valves to check and no lights.",
  focus=[["449 cc single", "Four-stroke"], ["Fuel", "Carb or EFI"], ["Valves", "Check by hours"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=[], patch={}, add=[], lessons={"H": [DIRT4]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B40.append(dict(id="suzuki-rg500-gamma-rg250-1985", make="Suzuki", model="RG500 Gamma / RG250", name="Suzuki RG500 Gamma / RG250 Gamma", years=[1985, 1987],
  match=["rg500", "rg 500", "rg500 gamma", "rg250", "rg250 gamma", "gamma"], style="sport", drive="chain",
  engine="498 cc square-four or 247 cc twin two-stroke, liquid-cooled, multiple carbs",
  intro="Suzuki's GP-replica two-strokes. Never sold new in the US, so most here are imports. Expensive parts and careful work.",
  focus=[["Two-stroke", "Liquid-cooled"], ["Carbs", "Rebuild as a set"], ["Crank seals", "Check them"], ["Oil injection", "Bleed the pump"], ["Import papers", "Check title"]],
  remove=TWO, patch={}, add=[],
  lessons={"A": ["These were never sold new in the US. Make sure the title and import paperwork match the VIN before you put money in."], "B": ["A two-stroke with leaking crank seals runs lean and can seize. Get the seals checked before riding hard."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

B40.append(dict(id="suzuki-dl650-v-strom-first-gen-2004", make="Suzuki", model="V-Strom 650 (2004-2011)", name="Suzuki V-Strom 650 (DL650, 2004-2011)", years=[2004, 2011],
  match=["v-strom 650", "vstrom 650", "v strom 650", "dl650", "wee-strom", "weestrom", "dl650a"], style="adventure", drive="chain",
  engine="645 cc liquid-cooled V-twin, fuel injected",
  intro="The first V-Strom 650. The SV650 engine in a tall, comfortable bike that people ride for a very long time.",
  focus=[["645 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Charging", "Check stator"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[VSTR]))

HERO_NAME_B40 = {"suzuki-ts185-ts250-1971": "TS250", "suzuki-gn125-gn250-1982": "GN250", "suzuki-dr-z250-2001": "DR-Z250", "suzuki-gs1150-1984": "GS1150",
  "suzuki-intruder-800-volusia-c50-1992": "INTRUDER", "suzuki-intruder-1500-lc-c90-1998": "C90", "suzuki-boulevard-m90-m109r2-2009": "M90",
  "suzuki-rm-z450-2005": "RM-Z450", "suzuki-rg500-gamma-rg250-1985": "RG500", "suzuki-dl650-v-strom-first-gen-2004": "V-STROM"}
