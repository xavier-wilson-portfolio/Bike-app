"""Batch 38 bike tunes (top 500, rows 371-380)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch31 import CARB4
from batch36 import YAMF
B38 = []
TWO = CARB + AIR + ["H-003"]
GSXRF = dict(name="GSXR.com", url="https://www.gsxr.com/", what="Owner forum for Suzuki GSX-R models, including the early oil-cooled bikes.")
SCOOT = dict(name="Modern Vespa / scooter forums", url="https://www.modernvespa.com/forum/", what="Big general scooter forum with sections for Yamaha scooters.")
TWOOIL = "Check the oil injection: the tank feeds the pump, the lines are bled, and the pump cable opens with the throttle."

B38.append(dict(id="yamaha-pw50-1981", make="Yamaha", model="PW50", name="Yamaha PW50 (Pee Wee)", years=[1981, 2026],
  match=["pw50", "pw 50", "pee wee", "peewee 50", "yamaha pw50", "y-zinger"], style="dualsport", drive="shaft",
  engine="49 cc air-cooled two-stroke single, carb, automatic, shaft drive",
  intro="The kids' bike most riders started on. Two-stroke with oil injection, automatic, and shaft drive.",
  focus=[["49 cc two-stroke", "Oil injected"], ["Carb", "Clean it out"], ["Automatic", "No clutch"], ["Shaft drive", "Check oil"], ["Throttle limiter", "Set for the rider"]],
  remove=TWO, patch={}, add=[], lessons={"G": [TWOOIL], "B": ["Set the throttle limiter screw for the rider's skill before the first ride."]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B38.append(dict(id="yamaha-dt175-dt100-1974", make="Yamaha", model="DT175 / DT100", name="Yamaha DT175 / DT100", years=[1974, 1981],
  match=["dt175", "dt100", "dt 175", "dt 100", "dt125", "dt 125", "enduro 175"], style="dualsport", drive="chain",
  engine="97 to 171 cc air-cooled two-stroke single, carb, Autolube oil injection",
  intro="Yamaha's small two-stroke enduros. Autolube oil injection, six-volt electrics on many, and points.",
  focus=[["Two-stroke", "Autolube"], ["Carb", "Clean it out"], ["Oil pump", "Bleed it"], ["Points", "Gap and time"], ["Six-volt", "On many"]],
  remove=TWO, patch={}, add=[], lessons={"G": [TWOOIL]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

B38.append(dict(id="yamaha-yr-rd200-1973", make="Yamaha", model="RD200", name="Yamaha RD200", years=[1973, 1976],
  match=["rd200", "rd 200", "rd200b", "rd200dx", "cs5"], style="standard", drive="chain",
  engine="195 cc air-cooled two-stroke twin, two carbs, Autolube",
  intro="A small two-stroke twin that punches above its size. Two carbs, Autolube and points.",
  focus=[["Two-stroke twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Oil pump", "Bleed it"], ["Points", "Two sets"], ["Crank seals", "Check them"]],
  remove=TWO, patch={}, add=[], lessons={"G": [TWOOIL], "B": ["A two-stroke with leaking crank seals runs lean and can seize. Get the seals checked before riding hard."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

B38.append(dict(id="yamaha-zuma-125-yw125-2009", make="Yamaha", model="Zuma 125 (YW125)", name="Yamaha Zuma 125", years=[2009, 2026],
  match=["zuma 125", "yw125", "yw 125", "zuma125", "bws 125"], style="scooter", drive="belt",
  engine="125 cc air-cooled single, fuel injected, CVT",
  intro="The chunky 125 Zuma. Fuel injected, with a fuel pump recall on 2009 scooters.",
  focus=[["125 cc single", "Air-cooled"], ["Fuel injected", "No carbs"], ["Fuel pump", "2009 recall"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2009 Zuma 125s are in recall 13V035 for a fuel pump that can starve the engine and stall it in hot weather.", reason="The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="13V035", years="2009", what="Fuel pump may have wrong internal clearances and can fail, stalling the engine.", fix="Dealer replaces the fuel pump with a new design free.", src="https://vehiclesafetyrecalls.com/recall/13V035000")],
  known=[], forums=[SCOOT]))

B38.append(dict(id="yamaha-xj900-xj1100-maxim-1982", make="Yamaha", model="XJ1100 Maxim / XJ900", name="Yamaha XJ1100 Maxim / XJ900 Seca", years=[1982, 1985],
  match=["xj1100", "xj 1100", "maxim 1100", "xj1100 maxim", "xj900", "xj 900", "seca 900", "xj900rk"], style="standard", drive="shaft",
  engine="853 to 1101 cc air-cooled inline four, four carbs, shaft drive",
  intro="Yamaha's big shaft-drive fours of the early 80s. Four carbs, shaft drive and old wiring.",
  focus=[["Inline four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Shaft drive", "Change the oil"], ["Charging", "Check R/R"], ["Starter", "Check clutch"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[YAMF]))

B38.append(dict(id="yamaha-seca-ii-xj600-1992", make="Yamaha", model="Seca II (XJ600)", name="Yamaha Seca II (XJ600)", years=[1992, 1998],
  match=["seca ii", "seca 2", "xj600", "xj600s", "xj 600", "diversion 600"], style="standard", drive="chain",
  engine="598 cc air-cooled inline four, four carbs",
  intro="A simple air-cooled 600 four with a half fairing. Four carbs and not much else to worry about.",
  focus=[["598 cc four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Valves", "Shim under bucket"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[YAMF]))

B38.append(dict(id="yamaha-fz600-fz700-fz750-1985", make="Yamaha", model="FZ600 / FZ700 / FZ750", name="Yamaha FZ600 / FZ700 / FZ750", years=[1985, 1991],
  match=["fz600", "fz700", "fz750", "fz 750", "fz 600", "fz 700", "fazer 750"], style="sport", drive="chain",
  engine="598 to 749 cc liquid- or air-cooled inline four, four carbs, five valves per cylinder on the 700 and 750",
  intro="Yamaha's mid-80s sport fours. The 750 brought the five-valve head. Four carbs on all of them.",
  focus=[["Inline four", "Sport tune"], ["Four carbs", "Rebuild as a set"], ["Charging", "Check R/R"], ["Cooling", "Check hoses"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[YAMF]))

B38.append(dict(id="yamaha-smax-xmax-2014", make="Yamaha", model="SMAX / XMAX", name="Yamaha SMAX / XMAX", years=[2014, 2026],
  match=["xmax", "x-max", "xmax 300", "czd300", "smax", "s-max", "smax 155", "xc155"], style="scooter", drive="belt",
  engine="155 or 292 cc liquid-cooled single, fuel injected, CVT",
  intro="Yamaha's modern maxi-scooters. 2018-2022 XMAXs have a cam retainer bolt recall that NHTSA flagged do-not-ride.",
  focus=[["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cam retainer", "XMAX recall"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2018-2022 XMAXs are in recall 25V778 (camshaft retainer bolt). 2018-2020 XMAXs are in 20V611 (rear reflector) and some 2019-2020 bikes in 21V048 (VIN label).", reason="The cam bolt can stall the engine. All fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="25V778", years="2018-2022 XMAX (some)", what="Camshaft retainer bolt can loosen and the cam can come loose, stalling the engine.", fix="Free dealer repair.", src="https://motorsportsnewswire.com/?p=203407"),
           dict(id="20V611", years="2018-2020 XMAX", what="Condensation can collect on the rear reflector lens and make it less effective.", fix="Dealer replaces the rear reflector free.", src="https://vehicleflaws.com/recall/20V611000"),
           dict(id="21V048", years="2019-2020 XMAX (some)", what="VIN on the federal certification label may not match the frame.", fix="Dealer checks and replaces the label free.", src="https://vehiclesafetyrecalls.com/recall/21V048000")],
  known=[], forums=[SCOOT]))

B38.append(dict(id="yamaha-tenere-xt660z-2008", make="Yamaha", model="XT660Z Tenere", name="Yamaha XT660Z Tenere", years=[2008, 2016],
  match=["xt660z", "xt660", "tenere 660", "xt 660", "xt660r", "xt660x"], style="adventure", drive="chain",
  engine="660 cc liquid-cooled single, fuel injected",
  intro="Yamaha's 660 single adventure bike. Mostly sold outside the US, so many here are imports.",
  focus=[["660 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Import papers", "Check title"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={"A": ["Many US XT660Zs are imports. Make sure the title and VIN paperwork match before you put money in."]},
  recalls=[], recallNote=VIN, known=[], forums=[YAMF]))

B38.append(dict(id="suzuki-gsx-r1100-1986", make="Suzuki", model="GSX-R1100", name="Suzuki GSX-R1100", years=[1986, 1998],
  match=["gsx-r1100", "gsxr1100", "gsx r1100", "gsxr 1100", "gixxer 1100"], style="sport", drive="chain",
  engine="1052 to 1074 cc oil-cooled (later liquid-cooled) inline four, four carbs",
  intro="The big early GSX-R. Oil-cooled until 1992, then water-cooled. Four carbs either way.",
  focus=[["Inline four", "Oil or water cooled"], ["Four carbs", "Rebuild as a set"], ["Oil cooler", "Check lines"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4], "E": ["Oil-cooled GSX-Rs depend on the oil to cool the engine. Use the oil spec in the manual and check the cooler lines for leaks."]},
  recalls=[], recallNote=OLD, known=[], forums=[GSXRF]))

HERO_NAME_B38 = {"yamaha-pw50-1981": "PW50", "yamaha-dt175-dt100-1974": "DT175", "yamaha-yr-rd200-1973": "RD200", "yamaha-zuma-125-yw125-2009": "ZUMA 125",
  "yamaha-xj900-xj1100-maxim-1982": "MAXIM", "yamaha-seca-ii-xj600-1992": "SECA II", "yamaha-fz600-fz700-fz750-1985": "FZ750",
  "yamaha-smax-xmax-2014": "XMAX", "yamaha-tenere-xt660z-2008": "TENERE", "suzuki-gsx-r1100-1986": "GSX-R1100"}
