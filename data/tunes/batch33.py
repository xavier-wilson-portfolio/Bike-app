"""Batch 33 bike tunes (top 500, rows 321-330)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch21 import REFLECTOR
from batch31 import STARTER, CARB4
from batch32 import XRS, VALVES1
B33 = []
TWO = CARB + AIR + ["H-003"]
HONDATWINS = dict(name="Honda Twins", url="https://www.hondatwins.net/", what="Owner forum for older Honda twins.")
STOC = dict(name="ST Owners", url="https://www.st-owners.com/", what="Owner forum for Honda ST1100 and ST1300 sport tourers.")
VFRD = dict(name="VFRDiscussion", url="https://www.vfrdiscussion.com/", what="Owner forum for Honda VFR and Interceptor models.")

B33.append(dict(id="honda-xl600r-1983", make="Honda", model="XL600R", name="Honda XL600R", years=[1983, 1987],
  match=["xl600r", "xl600", "xl 600", "xl 600r", "xl600rm"], style="dualsport", drive="chain",
  engine="589 cc air-cooled four-valve single, twin carbs, kick start",
  intro="The street-legal big Honda single of the 80s. Kick start only on most, with two carbs feeding one cylinder.",
  focus=[["589 cc single", "Air-cooled"], ["Twin carbs", "Clean both"], ["Kick start", "Use the decomp"], ["Valves", "Check often"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"H": [VALVES1], "G": ["There are two carbs on one cylinder. The second one only opens at higher throttle, so it gums up first when the bike sits."]},
  recalls=[], recallNote=OLD, known=[], forums=[XRS]))

B33.append(dict(id="honda-cr250r-1978", make="Honda", model="CR250R", name="Honda CR250R (two-stroke)", years=[1978, 2007],
  match=["cr250r", "cr250", "cr 250", "cr 250r", "elsinore 250"], style="dualsport", drive="chain",
  engine="249 cc two-stroke single, carb, premix",
  intro="Honda's 250 two-stroke motocross bike. Premix, a top end that wears, and no lights.",
  focus=[["Two-stroke", "Premix"], ["Top end", "Check compression"], ["Carb", "Clean and jet"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=TWO, patch={},
  add=[step("X-CR25-01", "G", "G-004", "Check compression and the top end", "Do a compression test. Low or uneven numbers mean the piston and rings are due. Look at the piston through the exhaust port for scoring.", "A tired top end is the most common problem on a used two-stroke motocross bike.", "Two-stroke basics", hours=1.0)],
  lessons={"B": ["It runs on premix. Mix the oil into the fuel at the ratio in the manual. There is no oil tank."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

B33.append(dict(id="honda-cb919-599-hornet-2002", make="Honda", model="919 / 599 Hornet", name="Honda 919 (CB900F) / 599 (CB600F Hornet)", years=[2002, 2007],
  match=["919", "cb919", "cb900f 2002", "honda 919", "599", "cb599", "cb600f hornet", "hornet 600", "hornet 900"], style="standard", drive="chain",
  engine="919 cc fuel injected or 599 cc carbureted inline four, liquid-cooled",
  intro="Honda's naked fours of the 2000s. The 919 is fuel injected; the 599 has four carbs.",
  focus=[["Inline four", "Liquid-cooled"], ["Fuel", "EFI on 919, carbs on 599"], ["Charging", "Check R/R"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=[], patch={}, add=[], lessons={"G": ["The 919 is fuel injected. The 599 has four carbs; rebuild those as a set."]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B33.append(dict(id="honda-cb400t-hawk-1978", make="Honda", model="CB400T Hawk", name="Honda CB400T Hawk", years=[1978, 1981],
  match=["cb400t", "hawk", "hawk 400", "cb400 hawk", "cb400a hondamatic", "cm400t", "cb400tii"], style="standard", drive="chain",
  engine="395 cc air-cooled parallel twin, three valves per cylinder, two carbs",
  intro="The 400 Hawk twin. Two CV carbs, a cam chain tensioner to check and a starter clutch that can slip.",
  focus=[["395 cc twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Cam chain", "Check tensioner"], ["Starter clutch", "Can slip"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[HONDATWINS]))

B33.append(dict(id="honda-sl125-sl100-1970", make="Honda", model="SL125 / SL100", name="Honda SL125 / SL100", years=[1970, 1975],
  match=["sl125", "sl100", "sl 125", "sl 100", "motosport 125", "motosport 100"], style="dualsport", drive="chain",
  engine="122 or 99 cc air-cooled OHC single, carb, points, six-volt",
  intro="Small early Honda trail bikes. Six-volt electrics, points and one small carb.",
  focus=[["Small single", "Air-cooled"], ["Six-volt", "Weak lights"], ["Points", "Gap and time"], ["Carb", "Clean it out"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"F": ["These are six-volt bikes. Use six-volt bulbs and a six-volt battery and charger."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

B33.append(dict(id="honda-xl750-transalp-2023", make="Honda", model="XL750 Transalp", name="Honda XL750 Transalp", years=[2023, 2026],
  match=["transalp", "xl750", "xl 750", "transalp 750", "xl750 transalp"], style="adventure", drive="chain",
  engine="755 cc liquid-cooled parallel twin, fuel injected, ride-by-wire",
  intro="Honda's modern middleweight adventure bike. Some 2024-2025 bikes have an oil leak recall for a crankcase sealing bolt.",
  focus=[["755 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Ride modes"], ["Sealing bolt", "2024-25 recall"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2024-2025 Transalps are in recall 25V358 for a crankcase sealing bolt that can leak oil onto the rear tire.", reason="Oil on the tire can cause a crash. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="25V358", years="2024-2025 (some)", what="Crankcase sealing bolt may be faulty and leak oil onto the rear tire.", fix="Dealer replaces the sealing bolt free.", src="https://vehiclesafetyrecalls.com/recall/25V358000")],
  known=[], forums=[]))

B33.append(dict(id="honda-rebel-250-cmx250-1985", make="Honda", model="Rebel 250 (CMX250)", name="Honda Rebel 250", years=[1985, 2016],
  match=["rebel 250", "cmx250", "cmx250c", "rebel250", "cmx 250"], style="cruiser", drive="chain",
  engine="234 cc air-cooled parallel twin, one carb",
  intro="The classic small Rebel. One carb, chain drive and drum rear brake. Very common as a first bike.",
  focus=[["234 cc twin", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Screw adjusters"], ["Drum rear", "Shoes and cable"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": ["Most no-starts on a stored Rebel 250 come from a clogged pilot jet. Clean it first."]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B33.append(dict(id="honda-st1100-1991", make="Honda", model="ST1100", name="Honda ST1100", years=[1991, 2002],
  match=["st1100", "st 1100", "pan european", "st1100a", "pan european 1100"], style="touring", drive="shaft",
  engine="1084 cc liquid-cooled longitudinal V4, four carbs, shaft drive",
  intro="Honda's long-legged V4 sport tourer. Four carbs, shaft drive and a lot of plastic to get off before any job.",
  focus=[["1084 cc V4", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Shaft drive", "Change the oil"], ["Bodywork", "Many panels"], ["ABS/TCS", "Some bikes"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[STOC]))

B33.append(dict(id="honda-vfr1200f-2010", make="Honda", model="VFR1200F", name="Honda VFR1200F", years=[2010, 2017],
  match=["vfr1200f", "vfr1200", "vfr 1200", "vfr1200fd", "vfr1200x crosstourer", "crosstourer"], style="sport", drive="shaft",
  engine="1237 cc liquid-cooled V4, fuel injected, shaft drive, manual or DCT",
  intro="Honda's big shaft-drive V4. 2010 and 2012-2013 bikes had a driveshaft recall and a fuel pump recall.",
  focus=[["1237 cc V4", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Shaft drive", "U-joint recall"], ["DCT option", "Automatic"], ["Fuel pump", "Recall"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2010 and 2012-2013 VFR1200F and FD bikes are in recall 15V821 (driveshaft U-joint) and recall 24V864 (fuel pump).", reason="A broken U-joint can lock the rear wheel. Both fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="15V821", years="2010, 2012-2013", what="Driveshaft U-joint bearings can wear early and break, which can lock the rear wheel.", fix="Dealer replaces the driveshaft free.", src="https://vehiclesafetyrecalls.com/recall/15V821000"),
           dict(id="24V864", years="2010, 2012-2013 (some)", what="Fuel pump can fail and stall the engine.", fix="Dealer inspects and replaces the fuel pump free.", src="https://motorsportsnewswire.com/?p=195115")],
  known=[], forums=[VFRD]))

B33.append(dict(id="honda-cb300r-cb300f-cbr300r-2015", make="Honda", model="CB300R / CB300F / CBR300R", name="Honda CB300R / CB300F / CBR300R", years=[2015, 2026],
  match=["cb300r", "cb300f", "cbr300r", "cbr300", "cb 300r", "cbr 300r", "cb300", "cbr300ra"], style="standard", drive="chain",
  engine="286 cc liquid-cooled single, fuel injected",
  intro="Honda's 300 single in three styles. Several recalls cover different years, so run the VIN.",
  focus=[["286 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "Several"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2015 CB300F and CBR300R bikes are in recall 15V439 (starter relay). 2020-2021 CBR300Rs are in 21V382 (rear reflector). Some 2019 CB300Rs are in 19V412 (transmission circlip), and 2018-2025 CB300Rs are in 25V210 (headlight).", reason="All fixes are free.")},
  add=[], lessons={},
  recalls=[STARTER, REFLECTOR,
           dict(id="19V412", years="2019 CB300R (some)", what="A transmission circlip can come off and misalign the gears.", fix="Dealer replaces the transmission main shaft free.", src="https://vehiclesafetyrecalls.com/recall/19V412000"),
           dict(id="25V210", years="2018-2025 CB300R", what="Headlight may flicker or shut off while riding.", fix="Dealer replaces the headlight assembly free.", src="https://www.vehiclesafetyrecalls.com/recall/25V210000")],
  known=[], forums=[]))

HERO_NAME_B33 = {"honda-xl600r-1983": "XL600R", "honda-cr250r-1978": "CR250R", "honda-cb919-599-hornet-2002": "919",
  "honda-cb400t-hawk-1978": "HAWK", "honda-sl125-sl100-1970": "SL125", "honda-xl750-transalp-2023": "TRANSALP",
  "honda-rebel-250-cmx250-1985": "REBEL 250", "honda-st1100-1991": "ST1100", "honda-vfr1200f-2010": "VFR1200F", "honda-cb300r-cb300f-cbr300r-2015": "CB300R"}
