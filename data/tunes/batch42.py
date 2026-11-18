"""Batch 42 bike tunes (top 500, rows 411-420)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch27 import BMWNOTE, MOA
B42 = []
BUELLF = dict(name="BadWeB", url="https://www.badweatherbikers.com/buell/", what="Long-running Buell owner forum.")
BUELLNOTE = "Buell and Harley-Davidson issued several recalls on these bikes. Run your VIN at nhtsa.gov/recalls before you start."
BOXER = "Boxer twins need the valve clearance checked on both sides and the throttle bodies synced. Do both at the same service."

B42.append(dict(id="harley-davidson-buell-xb9-xb12-2003", make="Buell", model="XB9 / XB12 (Firebolt, Lightning, Ulysses)", name="Buell XB9 / XB12", years=[2003, 2010],
  match=["xb9", "xb12", "firebolt", "lightning", "ulysses", "xb12r", "xb12s", "xb9sx", "city x", "xb12x"], style="sport", drive="belt",
  engine="984 or 1203 cc air/oil-cooled V-twin (Sportster based), fuel injected, belt drive",
  intro="The XB Buells. Fuel in the frame, oil in the swingarm, belt drive and a rim-mounted front brake.",
  focus=[["V-twin", "Air/oil cooled"], ["Fuel injected", "No carbs"], ["Oil in swingarm", "Check level"], ["Belt drive", "Check wear"], ["Rim brake", "Front"]],
  remove=EFI, patch={}, add=[], lessons={"E": ["The oil lives in the swingarm and the fuel in the frame. Check the oil with the bike upright and warm, as the manual says."]},
  recalls=[], recallNote=BUELLNOTE, known=[], forums=[BUELLF]))

B42.append(dict(id="harley-davidson-buell-s1-x1-m2-tube-frame-1995", make="Buell", model="S1 / X1 / M2 / S3 (tube frame)", name="Buell tube-frame (S1, X1, M2, S3)", years=[1995, 2002],
  match=["s1 lightning", "x1 lightning", "m2 cyclone", "cyclone", "s3 thunderbolt", "thunderbolt", "s1w", "x1"], style="sport", drive="belt",
  engine="1203 cc air-cooled Sportster-based V-twin, carb or fuel injection, belt drive",
  intro="The tube-frame Buells. Sportster engine, carb on most, fuel injection on the X1 and later S3s.",
  focus=[["1203 cc V-twin", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Rubber mounts", "Check them"], ["Primary", "Chain and oil"], ["Belt drive", "Check wear"]],
  remove=[], patch={}, add=[], lessons={"G": ["Check which you have. Carbureted bikes get the carb steps; fuel-injected bikes skip them."]},
  recalls=[], recallNote=BUELLNOTE, known=[], forums=[BUELLF]))

B42.append(dict(id="harley-davidson-buell-blast-2000", make="Buell", model="Blast", name="Buell Blast", years=[2000, 2009],
  match=["blast", "buell blast", "p3", "blast 500"], style="standard", drive="belt",
  engine="492 cc air-cooled single, one carb, belt drive",
  intro="Buell's 500 single, used in a lot of rider courses. One carb and a belt.",
  focus=[["492 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Belt drive", "Check wear"], ["Valves", "Hydraulic lifters"], ["Bodywork", "Plastic panels"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=BUELLNOTE, known=[], forums=[BUELLF]))

B42.append(dict(id="harley-davidson-buell-1125r-1125cr-2008", make="Buell", model="1125R / 1125CR", name="Buell 1125R / 1125CR", years=[2008, 2010],
  match=["1125r", "1125cr", "buell 1125", "1125 r", "1125 cr"], style="sport", drive="belt",
  engine="1125 cc liquid-cooled Rotax Helicon V-twin, fuel injected, belt drive",
  intro="The liquid-cooled Buells with a Rotax engine. Fuel injected, belt drive, and some known charging and cooling issues.",
  focus=[["1125 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Charging", "Stator, R/R"], ["Cooling", "Hoses and fans"], ["Belt drive", "Check wear"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=BUELLNOTE, known=[], forums=[BUELLF]))

B42.append(dict(id="bmw-r1100rt-r1150rt-1996", make="BMW", model="R1100RT / R1150RT", name="BMW R1100RT / R1150RT", years=[1996, 2005],
  match=["r1100rt", "r1150rt", "r 1100 rt", "r 1150 rt", "r1150rt-p", "r1100rt-p"], style="touring", drive="shaft",
  engine="1085 or 1130 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  intro="The oilhead RT tourers. Fuel injected boxer, shaft drive, and on R1150RTs a servo ABS that needs care.",
  focus=[["Boxer twin", "Air/oil cooled"], ["Fuel injected", "Sync bodies"], ["Final drive", "Check oil and play"], ["Servo ABS", "R1150RT"], ["Fairing", "Many panels"]],
  remove=EFI, patch={}, add=[], lessons={"H": [BOXER], "K": ["Servo-assisted ABS on the R1150RT needs a special bleed procedure. Read the manual before touching the brakes."]},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B42.append(dict(id="bmw-r1100s-1999", make="BMW", model="R1100S", name="BMW R1100S", years=[1999, 2005],
  match=["r1100s", "r 1100 s", "r1100 s", "r1100s boxer cup"], style="sport", drive="shaft",
  engine="1085 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  intro="BMW's sporty oilhead. Fuel injected boxer, shaft drive and a single-sided swingarm.",
  focus=[["Boxer twin", "Air/oil cooled"], ["Fuel injected", "Sync bodies"], ["Final drive", "Check oil and play"], ["Clutch", "Dry, check spline"], ["Charging", "Check alternator belt"]],
  remove=EFI, patch={}, add=[], lessons={"H": [BOXER]},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B42.append(dict(id="bmw-r850r-r1100r-r1150r-1994", make="BMW", model="R850R / R1100R / R1150R", name="BMW R850R / R1100R / R1150R", years=[1994, 2006],
  match=["r850r", "r1100r", "r1150r", "r 850 r", "r 1100 r", "r 1150 r", "r1150r rockster", "rockster"], style="standard", drive="shaft",
  engine="848 to 1130 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  intro="The naked oilhead roadsters. Simple, tough and easy to work on for a BMW.",
  focus=[["Boxer twin", "Air/oil cooled"], ["Fuel injected", "Sync bodies"], ["Final drive", "Check oil and play"], ["Clutch", "Dry, check spline"], ["Charging", "Check alternator belt"]],
  remove=EFI, patch={}, add=[], lessons={"H": [BOXER]},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B42.append(dict(id="bmw-k1200s-k1300s-2005", make="BMW", model="K1200S / K1300S", name="BMW K1200S / K1300S", years=[2005, 2016],
  match=["k1200s", "k1300s", "k 1200 s", "k 1300 s", "k1200r", "k1300r", "k1200gt", "k1300gt"], style="sport", drive="shaft",
  engine="1157 or 1293 cc liquid-cooled inline four, fuel injected, shaft drive, Duolever front",
  intro="BMW's fast K-bikes. Inline four laid forward, shaft drive and Duolever front suspension.",
  focus=[["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Final drive", "Check oil and play"], ["Duolever", "Check bearings"], ["Electronics", "CANbus"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B42.append(dict(id="bmw-k1600gt-gtl-2011", make="BMW", model="K1600GT / GTL / B", name="BMW K1600GT / GTL / B", years=[2011, 2026],
  match=["k1600gt", "k1600gtl", "k1600b", "k 1600", "k1600", "grand america", "k1600 grand america"], style="touring", drive="shaft",
  engine="1649 cc liquid-cooled inline six, fuel injected, shaft drive",
  intro="BMW's six-cylinder tourers. Lots of electronics, shaft drive and several recalls over the years.",
  focus=[["Inline six", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "CANbus"], ["Final drive", "Check oil and play"], ["Bodywork", "Many panels"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B42.append(dict(id="bmw-f800st-f800s-2006", make="BMW", model="F800ST / F800S / F800GT", name="BMW F800ST / F800S / F800GT", years=[2006, 2019],
  match=["f800st", "f800s", "f800gt", "f 800 st", "f 800 s", "f 800 gt", "f800r"], style="sport", drive="belt",
  engine="798 cc liquid-cooled parallel twin, fuel injected, belt drive",
  intro="BMW's 800 twins for the road. Belt final drive, fuel tank under the seat and a counter-balancer arm in the engine.",
  focus=[["798 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Belt drive", "Check wear"], ["Fuel pump", "Under seat"], ["Cooling", "Coolant and fan"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

HERO_NAME_B42 = {"harley-davidson-buell-xb9-xb12-2003": "BUELL XB", "harley-davidson-buell-s1-x1-m2-tube-frame-1995": "BUELL", "harley-davidson-buell-blast-2000": "BLAST",
  "harley-davidson-buell-1125r-1125cr-2008": "1125R", "bmw-r1100rt-r1150rt-1996": "R1150RT", "bmw-r1100s-1999": "R1100S", "bmw-r850r-r1100r-r1150r-1994": "R1150R",
  "bmw-k1200s-k1300s-2005": "K1300S", "bmw-k1600gt-gtl-2011": "K1600", "bmw-f800st-f800s-2006": "F800ST"}
