"""Batch 39 bike tunes (top 500, rows 381-390)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch31 import CARB4
from batch38 import GSXRF
B39 = []
TWO = CARB + AIR + ["H-003"]
SVR = dict(name="SVRider", url="https://www.svrider.com/", what="Owner forum for Suzuki SV650, SV1000 and Gladius.")
VSTR = dict(name="StromTrooper", url="https://www.stromtrooper.com/", what="Owner forum for Suzuki V-Strom models.")
RR16 = dict(id="16V018", years="2008-2012 (model list varies)", what="Regulator/rectifier can fail and stop charging the battery, which can stall the engine.", fix="Dealer replaces the regulator/rectifier free.", src="https://www.vehiclesafetyrecalls.com/recall/16V018000")
DIRT4 = "Four-stroke motocross engines need frequent valve checks and oil changes. Follow the hour-based schedule in the manual, not the calendar."

B39.append(dict(id="suzuki-gsx-r750-early-1985", make="Suzuki", model="GSX-R750 (oil-cooled and early)", name="Suzuki GSX-R750 (1985-1995)", years=[1985, 1995],
  match=["gsx-r750", "gsxr750", "gsxr 750", "gixxer 750", "gsx r750", "slingshot"], style="sport", drive="chain",
  engine="749 cc oil-cooled (water-cooled from 1992) inline four, four carbs",
  intro="The first GSX-R750s. Oil-cooled until 1992, four carbs, and a big part of sportbike history.",
  focus=[["749 cc four", "Oil or water cooled"], ["Four carbs", "Rebuild as a set"], ["Oil cooler", "Check lines"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4], "E": ["Oil-cooled GSX-Rs depend on the oil to cool the engine. Use the oil spec in the manual and check the cooler lines for leaks."]},
  recalls=[], recallNote=OLD, known=[], forums=[GSXRF]))

B39.append(dict(id="suzuki-rm-z250-2004", make="Suzuki", model="RM-Z250", name="Suzuki RM-Z250", years=[2004, 2026],
  match=["rm-z250", "rmz250", "rmz 250", "rm-z 250"], style="dualsport", drive="chain",
  engine="249 cc liquid-cooled four-stroke single, carb then fuel injection",
  intro="Suzuki's 250 four-stroke motocross bike. Hour-based service, valves to check and no lights.",
  focus=[["249 cc single", "Four-stroke"], ["Fuel", "Carb or EFI"], ["Valves", "Check by hours"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=[], patch={}, add=[], lessons={"H": [DIRT4]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B39.append(dict(id="suzuki-gsx1300bk-b-king-2008", make="Suzuki", model="B-King (GSX1300BK)", name="Suzuki B-King", years=[2008, 2012],
  match=["b-king", "bking", "gsx1300bk", "b king", "gsx1300bka"], style="standard", drive="chain",
  engine="1340 cc liquid-cooled inline four (Hayabusa engine), fuel injected",
  intro="The naked Hayabusa. Fuel injected and huge. 2008 bikes are in a regulator/rectifier recall.",
  focus=[["1340 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Regulator", "2008 recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2008 B-Kings are in recall 16V018 for the regulator/rectifier.", reason="A failed regulator can stall the engine. The fix is free.")},
  add=[], lessons={},
  recalls=[RR16], known=[], forums=[]))

B39.append(dict(id="suzuki-tl1000r-1998", make="Suzuki", model="TL1000R", name="Suzuki TL1000R", years=[1998, 2003],
  match=["tl1000r", "tl 1000r", "tlr", "tl1000 r"], style="sport", drive="chain",
  engine="996 cc liquid-cooled 90-degree V-twin, fuel injected, rotary rear damper",
  intro="Suzuki's V-twin superbike. Fuel injected, with a rotary rear damper and a cam chain tensioner worth checking.",
  focus=[["996 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Rear damper", "Rotary"], ["Cam chain", "Check tensioners"], ["Charging", "Check R/R"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[SVR]))

B39.append(dict(id="suzuki-sv650-second-gen-2003", make="Suzuki", model="SV650 (2003-2016)", name="Suzuki SV650 / SV650S (2003-2016)", years=[2003, 2016],
  match=["sv650", "sv 650", "sv650s", "sv650n", "sv650a"], style="standard", drive="chain",
  engine="645 cc liquid-cooled V-twin, fuel injected",
  intro="The second SV650. Fuel injected and easy to live with. Some California bikes had a fuel tank recall.",
  focus=[["645 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fuel tank", "CA recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. California-spec 2003-2005 SV650s and some 2006 bikes are in recall 06V013 for a fuel tank that can crack at a bracket weld.", reason="A cracked tank can leak fuel. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="06V013", years="2003-2006 California models (some)", what="Fuel tank can crack at the vapor separator bracket weld and leak.", fix="Free dealer repair.", src="https://vehicleflaws.com/vehicle/suzuki/sv650/2005")],
  known=[], forums=[SVR]))

B39.append(dict(id="suzuki-gladius-sfv650-2009", make="Suzuki", model="Gladius (SFV650)", name="Suzuki Gladius (SFV650)", years=[2009, 2015],
  match=["gladius", "sfv650", "sfv 650", "gladius 650"], style="standard", drive="chain",
  engine="645 cc liquid-cooled V-twin, fuel injected",
  intro="The SV650 engine in a styled steel frame. 2009-2010 bikes are in a regulator/rectifier recall.",
  focus=[["645 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Regulator", "2009-10 recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2009-2010 Gladius bikes are in recall 16V018 for the regulator/rectifier.", reason="A failed regulator can stall the engine. The fix is free.")},
  add=[], lessons={},
  recalls=[RR16], known=[], forums=[SVR]))

B39.append(dict(id="suzuki-v-strom-800de-2023", make="Suzuki", model="V-Strom 800DE / 800", name="Suzuki V-Strom 800DE / 800", years=[2023, 2026],
  match=["v-strom 800", "vstrom 800", "v-strom 800de", "800de", "dl800", "v strom 800", "v-strom 800re"], style="adventure", drive="chain",
  engine="776 cc liquid-cooled parallel twin, fuel injected, ride-by-wire",
  intro="Suzuki's newer middleweight adventure bike. Early 800DEs had a rear tire recall that NHTSA flagged do-not-ride.",
  focus=[["776 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Rear tire", "2023-24 recall"], ["Electronics", "Ride modes"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2023-2024 800DE and 800DE Adventure bikes are in recall 24V535 for the original rear tire.", reason="The tread can separate. Don't ride on the original rear tire until it is checked. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="24V535", years="2023-2024 800DE (some)", what="Original rear tire tread can separate from the tire.", fix="Dealer replaces the rear tire free.", src="https://www.advpulse.com/?p=113253")],
  known=[], forums=[VSTR]))

B39.append(dict(id="suzuki-gsx-8s-gsx-8r-2023", make="Suzuki", model="GSX-8S / GSX-8R", name="Suzuki GSX-8S / GSX-8R", years=[2023, 2026],
  match=["gsx-8s", "gsx8s", "gsx-8r", "gsx8r", "gsx 8s", "gsx 8r", "gsx800"], style="standard", drive="chain",
  engine="776 cc liquid-cooled parallel twin, fuel injected, ride-by-wire",
  intro="Suzuki's 800 twin street bikes. Some early 2024 GSX-8Rs had a drive chain recall.",
  focus=[["776 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Drive chain", "2024 recall"], ["Electronics", "Ride modes"], ["Cooling", "Coolant and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2024 GSX-8Rs are in recall 24V081 for a drive chain with missing rivets.", reason="A chain that comes apart cuts drive to the rear wheel. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="24V081", years="2024 GSX-8R (some)", what="Drive chain may be missing rivets and can come apart.", fix="Dealer inspects and replaces the chain free.", src="https://vehiclesafetyrecalls.com/recall/24V081000")],
  known=[], forums=[]))

B39.append(dict(id="suzuki-dr-z125-dr-z70-2003", make="Suzuki", model="DR-Z125 / DR-Z70", name="Suzuki DR-Z125 / DR-Z70", years=[2003, 2026],
  match=["dr-z125", "drz125", "drz 125", "dr-z70", "drz70", "drz125l"], style="dualsport", drive="chain",
  engine="67 or 124 cc air-cooled single, carb",
  intro="Suzuki's small kids' and trail bikes. One carb and simple everything.",
  focus=[["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Screw adjusters"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B39.append(dict(id="suzuki-rm250-two-stroke-1976", make="Suzuki", model="RM250 (two-stroke)", name="Suzuki RM250 (two-stroke)", years=[1976, 2012],
  match=["rm250", "rm 250", "rm250 two stroke", "rm250 2 stroke"], style="dualsport", drive="chain",
  engine="249 cc two-stroke single, carb, premix",
  intro="Suzuki's 250 two-stroke motocross bike. Premix, a top end that wears and no lights.",
  focus=[["Two-stroke", "Premix"], ["Top end", "Check compression"], ["Carb", "Clean and jet"], ["Power valve", "Clean it"], ["Chain drive", "Slack and lube"]],
  remove=TWO, patch={},
  add=[step("X-RM25-01", "G", "G-004", "Check compression and the top end", "Do a compression test. Low numbers mean the piston and rings are due. Clean the power valve while you are in there.", "A tired top end and a gummed power valve are the most common problems on a used two-stroke.", "Two-stroke basics", hours=1.5)],
  lessons={"B": ["It runs on premix. Mix the oil into the fuel at the ratio in the manual. There is no oil tank."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

HERO_NAME_B39 = {"suzuki-gsx-r750-early-1985": "GSX-R750", "suzuki-rm-z250-2004": "RM-Z250", "suzuki-gsx1300bk-b-king-2008": "B-KING",
  "suzuki-tl1000r-1998": "TL1000R", "suzuki-sv650-second-gen-2003": "SV650", "suzuki-gladius-sfv650-2009": "GLADIUS",
  "suzuki-v-strom-800de-2023": "V-STROM 800", "suzuki-gsx-8s-gsx-8r-2023": "GSX-8S", "suzuki-dr-z125-dr-z70-2003": "DR-Z125", "suzuki-rm250-two-stroke-1976": "RM250"}
