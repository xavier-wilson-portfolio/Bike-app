"""Batch 32 bike tunes (top 500, rows 311-320)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch21 import REFLECTOR
from batch31 import STARTER
B32 = []
SCOOT = dict(name="Modern Vespa / scooter forums", url="https://www.modernvespa.com/forum/", what="Big general scooter forum with sections for Honda scooters.")
XRS = dict(name="XR's Only", url="https://www.xrsonly.com/", what="Parts and know-how for Honda XR dirt bikes.")
VALVES1 = "Air-cooled Honda singles need the valve clearance checked often. A tight exhaust valve is the usual cause of hard starting."

B32.append(dict(id="honda-helix-cn250-1986", make="Honda", model="Helix CN250", name="Honda Helix (CN250)", years=[1986, 2007],
  match=["helix", "cn250", "cn 250", "honda helix", "helix 250", "fusion 250"], style="scooter", drive="belt",
  engine="244 cc liquid-cooled single, carb, CVT",
  intro="Honda's long, low touring scooter. Lots of bodywork to remove and one carb that clogs when it sits.",
  focus=[["244 cc single", "Liquid-cooled"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Bodywork", "Many panels"]],
  remove=CARB, patch={}, add=[], lessons={"G": ["The carb hides under the bodywork. Bag and label every panel screw as it comes out."]},
  recalls=[], recallNote=OLD, known=[], forums=[SCOOT]))

B32.append(dict(id="honda-forza-300-350-2014", make="Honda", model="Forza 300 / 350", name="Honda Forza (NSS300 / NSS350)", years=[2014, 2026],
  match=["forza", "forza 300", "forza 350", "nss300", "nss350", "nss300a", "forza 125"], style="scooter", drive="belt",
  engine="279 or 330 cc liquid-cooled single, fuel injected, CVT",
  intro="Honda's midsize maxi-scooter. Early 2014-2015 bikes had fuel pump and brake line recalls, so check those first.",
  focus=[["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Fuel pump", "2014-2015 recalls"], ["Cooling", "Coolant and hoses"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2014-2015 NSS300 Forzas had two fuel pump recalls (14V672 and 16V661), some 2014 bikes a rear brake line recall (16V109), and 2014-2015 bikes a starter relay recall (15V439).", reason="A seized fuel pump stalls the engine while riding. All fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="14V672", years="2014", what="A resin bracket inside the fuel pump can swell and jam the impeller, so the engine can stall.", fix="Dealer replaces the fuel pump free.", src="https://vehiclesafetyrecalls.com/recall/14V672000"),
           dict(id="16V661", years="2014-2015 (some)", what="Fuel pump can seize and stop fuel flow, so the engine stalls.", fix="Dealer replaces the fuel pump free.", src="https://static.nhtsa.gov/odi/rcl/2016/RCRIT-16V661-0493.pdf"),
           dict(id="16V109", years="2014 (Jun-Sep 2013 build)", what="Rear brake line joint may not be torqued right and can leak fluid.", fix="Dealer checks and fixes the joint free.", src="https://vehiclesafetyrecalls.com/recall/16V109000"),
           STARTER],
  known=[], forums=[SCOOT]))

B32.append(dict(id="honda-silver-wing-fsc600-2002", make="Honda", model="Silver Wing FSC600", name="Honda Silver Wing (FSC600)", years=[2002, 2013],
  match=["silver wing", "silverwing", "fsc600", "fsc 600", "silver wing 600", "fsc600a"], style="scooter", drive="belt",
  engine="582 cc liquid-cooled parallel twin, fuel injected, CVT",
  intro="Honda's 600 twin maxi-scooter. Early 2002-2004 bikes had several recalls, from the rear wheel to the stand.",
  focus=[["582 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Early recalls", "2002-2004"], ["Cooling", "Coolant and hoses"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2002 Silver Wings had a rear wheel recall (02V250), 2002-2003 bikes a handlebar recall (03V513), and 2002-2004 bikes a stand recall (04V290).", reason="These are old, but a bike that missed them still has the fault.")},
  add=[], lessons={},
  recalls=[dict(id="02V250", years="2002", what="Rear wheel spokes can fail and the wheel can collapse.", fix="Dealer replaces the rear wheel free.", src="https://www.carproblemzoo.com/recalls/honda-silverwing.php"),
           dict(id="03V513", years="2002-2003", what="Handlebar problem that could cause a loss of steering control.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/honda/fsc600/2003/03v513000"),
           dict(id="04V290", years="2002-2004", what="Kickstand or center stand can come loose and fall off.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/honda/fsc600/2003/04v290000")],
  known=[], forums=[SCOOT]))

B32.append(dict(id="honda-reflex-nss250-2001", make="Honda", model="Reflex NSS250", name="Honda Reflex (NSS250)", years=[2001, 2007],
  match=["reflex", "nss250", "nss 250", "honda reflex", "reflex 250", "nss250a"], style="scooter", drive="belt",
  engine="249 cc liquid-cooled single, carb, CVT",
  intro="The Forza's older sibling. One carb, a CVT belt and a lot of panels.",
  focus=[["249 cc single", "Liquid-cooled"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Bodywork", "Many panels"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[SCOOT]))

B32.append(dict(id="honda-adv150-adv160-2020", make="Honda", model="ADV150 / ADV160", name="Honda ADV150 / ADV160", years=[2020, 2026],
  match=["adv150", "adv160", "adv 150", "adv 160", "honda adv"], style="scooter", drive="belt",
  engine="149 or 157 cc liquid-cooled single, fuel injected, CVT",
  intro="Honda's adventure-styled small scooter. Some 2024-2025 ADV160s have an oil pump recall that can leave you without drive.",
  focus=[["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Oil pump gear", "2024-25 recall"], ["Cooling", "Coolant and hoses"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2024-2025 ADV160s are in recall 25V195 (oil pump driven gear).", reason="If the gear fails you lose drive power. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="25V195", years="2024-2025 ADV160 (some)", what="Oil pump driven gear may fail, causing a loss of drive power.", fix="Dealer replaces the oil pump driven gear free.", src="https://www.vehiclesafetyrecalls.com/recall/25V195000")],
  known=[], forums=[SCOOT]))

B32.append(dict(id="honda-super-cub-c125-2019", make="Honda", model="Super Cub C125", name="Honda Super Cub C125", years=[2019, 2026],
  match=["super cub", "c125", "supercub", "super cub 125", "c125 super cub"], style="standard", drive="chain",
  engine="125 cc air-cooled single, fuel injected, four-speed semi-auto",
  intro="The modern Super Cub. Simple to work on. 2020-2021 bikes had a reflector recall, and Honda has an emissions recall on 2019-2024 bikes.",
  focus=[["125 cc single", "Air-cooled"], ["Fuel injected", "No carbs"], ["Semi-auto", "No clutch lever"], ["Recalls", "Reflector, fuel system"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls and ask a Honda dealer too. 2020-2021 C125s are in recall 21V382 (rear reflector). Honda also has an emissions recall on all 2019-2024 C125s for the fuel system.", reason="Both fixes are free.")},
  add=[], lessons={"F": ["The C125 has an automatic clutch. Don't hunt for a clutch cable to adjust."]},
  recalls=[REFLECTOR], known=[], forums=[]))

B32.append(dict(id="honda-xr250r-xr250l-1986", make="Honda", model="XR250R / XR250L", name="Honda XR250R / XR250L", years=[1986, 2004],
  match=["xr250r", "xr250l", "xr250", "xr 250", "xr 250r", "xr 250l"], style="dualsport", drive="chain",
  engine="249 cc air-cooled four-valve single, carb",
  intro="The XR250 trail bike. Simple, tough, and very often ridden hard and stored wet.",
  focus=[["249 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check often"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"H": [VALVES1]},
  recalls=[], recallNote=OLD, known=[], forums=[XRS]))

B32.append(dict(id="honda-xr400r-1996", make="Honda", model="XR400R", name="Honda XR400R", years=[1996, 2004],
  match=["xr400r", "xr400", "xr 400", "xr 400r"], style="dualsport", drive="chain",
  engine="397 cc air-cooled four-valve single, carb, kick start",
  intro="A kick-start air-cooled dirt bike. Many have been plated for the street.",
  focus=[["397 cc single", "Air-cooled"], ["Kick start", "Learn the drill"], ["Carb", "Clean it out"], ["Valves", "Check often"], ["Air filter", "Foam, oiled"]],
  remove=CARB, patch={}, add=[], lessons={"H": [VALVES1]},
  recalls=[], recallNote=OLD, known=[], forums=[XRS]))

B32.append(dict(id="honda-xr600r-1985", make="Honda", model="XR600R", name="Honda XR600R", years=[1985, 2000],
  match=["xr600r", "xr600", "xr 600", "xr 600r"], style="dualsport", drive="chain",
  engine="591 cc air-cooled four-valve single, carb, kick start",
  intro="The big air-cooled XR. Kick start only, with a decompression lever you need to use.",
  focus=[["591 cc single", "Air-cooled"], ["Kick start", "Use the decomp"], ["Carb", "Clean it out"], ["Valves", "Check often"], ["Air filter", "Foam, oiled"]],
  remove=CARB, patch={}, add=[], lessons={"H": [VALVES1], "B": ["Find top dead center with the decompression lever before you kick. A big single can kick back hard."]},
  recalls=[], recallNote=OLD, known=[], forums=[XRS]))

B32.append(dict(id="honda-xl250-xl350-1972", make="Honda", model="XL250 / XL350", name="Honda XL250 / XL350", years=[1972, 1985],
  match=["xl250", "xl350", "xl 250", "xl 350", "xl250s", "xl350r", "xl250r", "motosport 250"], style="dualsport", drive="chain",
  engine="248 or 339 cc air-cooled single, carb, points ignition on early bikes",
  intro="Honda's early dual-sport singles. Points ignition on the first ones, six-volt on some, and old wiring everywhere.",
  focus=[["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Ignition", "Points on early bikes"], ["Valves", "Check often"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"H": [VALVES1]},
  recalls=[], recallNote=OLD, known=[], forums=[XRS]))

HERO_NAME_B32 = {"honda-helix-cn250-1986": "HELIX", "honda-forza-300-350-2014": "FORZA", "honda-silver-wing-fsc600-2002": "SILVER WING",
  "honda-reflex-nss250-2001": "REFLEX", "honda-adv150-adv160-2020": "ADV160", "honda-super-cub-c125-2019": "SUPER CUB",
  "honda-xr250r-xr250l-1986": "XR250", "honda-xr400r-1996": "XR400R", "honda-xr600r-1985": "XR600R", "honda-xl250-xl350-1972": "XL350"}
