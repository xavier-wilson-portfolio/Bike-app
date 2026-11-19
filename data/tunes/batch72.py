"""Batch 72 bike tunes (top 1000, rows 711-720)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch19 import AMCA, UKGS, F650
from batch27 import MOA, BMWNOTE
from batch10 import AIRH
from batch55 import PREMIX
B72 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B72.append(mk("harley-davidson-model-165-st-165-1953", "Harley-Davidson", "Model 165 / ST 165", "Harley-Davidson Model 165 / ST 165", [1953, 1959],
  ["model 165", "st 165", "st165", "st-165", "harley 165"], "standard", "chain",
  "165 cc air-cooled two-stroke single, premix",
  "The bigger version of Harley's DKW-based two-stroke. Premix, a magneto and simple running gear.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Top end", "Check piston"], ["Parts", "Source early"]],
  TWO, OLD, [AMCA], lessons={"B": [PREMIX]}))

B72.append(mk("bmw-r25-r26-r27-singles-1950", "BMW", "R25 / R26 / R27 singles", "BMW R25 / R26 / R27", [1950, 1966],
  ["r25", "r26", "r27", "r25/3", "r25/2", "r 26", "r 27", "bmw single"], "standard", "shaft",
  "247 cc air-cooled OHV single, carb, shaft drive",
  "BMW's 250 singles of the 50s and 60s. Shaft drive, a magneto or coil ignition and a strong parts supply from specialists.",
  [["OHV single", "Air-cooled"], ["Carb", "Clean it out"], ["Ignition", "Check spark"], ["Valves", "Set them"], ["Shaft", "Change oil"]],
  CARB, OLD, [AIRH]))

B72.append(mk("bmw-r51-3-r67-plunger-1951", "BMW", "R51/3 / R67 (plunger)", "BMW R51/3 / R67 (plunger)", [1951, 1956],
  ["r51/3", "r67", "r67/2", "r67/3", "r51/2", "r68", "bmw plunger", "r 67"], "standard", "shaft",
  "494 to 594 cc air-cooled OHV boxer twin, two carbs, magneto, plunger rear suspension",
  "BMW's postwar plunger twins. Boxer engines with magnetos, plunger rear ends and very little room for guesswork.",
  [["Boxer twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Magneto", "Check spark"], ["Plungers", "Check them"], ["Shaft", "Change oil"]],
  CARB, OLD, [AIRH]))

B72.append(mk("bmw-k1-k1100rs-k1100lt-1989", "BMW", "K1 / K1100RS / K1100LT", "BMW K1 / K1100RS / K1100LT", [1989, 1999],
  ["k1", "k1100rs", "k1100lt", "k 1100", "k1100", "k1 bmw", "k 1100 rs", "k 1100 lt"], "touring", "shaft",
  "987 or 1092 cc liquid-cooled flat inline four, fuel injected, shaft drive",
  "BMW's flying-brick fours of the 90s. Bosch fuel injection, Paralever on the K1 and a lot of bodywork.",
  [["Flat four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Coolant and fan"], ["Spline", "Check clutch"], ["Shaft", "Change oil"]],
  EFI, OLD, [MOA], lessons={"K": ["Check and grease the clutch and transmission input splines. Dry splines are a known cause of wear on these."]}))

B72.append(mk("bmw-k1200rs-k1200gt-1997", "BMW", "K1200RS / K1200GT", "BMW K1200RS / K1200GT", [1997, 2005],
  ["k1200rs", "k 1200 rs", "k1200 rs", "k1200gt 2003", "k1200rs abs"], "touring", "shaft",
  "1171 cc liquid-cooled flat inline four, fuel injected, shaft drive",
  "BMW's big sport tourers before the K1200S. Rubber-mounted engine, Paralever and Telelever.",
  [["Flat four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Coolant and fan"], ["Brakes", "Check ABS"], ["Shaft", "Change oil"]],
  EFI, BMWNOTE, [MOA]))

B72.append(mk("bmw-r1200gs-air-cooled-2004", "BMW", "R1200GS (air-cooled)", "BMW R1200GS (air-cooled)", [2004, 2012],
  ["r1200gs", "r 1200 gs", "r1200 gs", "r1200gsa", "1200gs", "r1200gs hexhead", "r1200gs camhead", "r1200gs adventure"], "adventure", "shaft",
  "1170 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  "The hexhead and camhead GS. Fuel injected, Telelever up front and a final drive worth checking for leaks and play.",
  [["Boxer twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Final drive", "Check play"], ["Brakes", "Check ABS"], ["Shaft", "Change oil"]],
  EFI, BMWNOTE, [UKGS]))

B72.append(mk("bmw-r1200st-2005", "BMW", "R1200ST", "BMW R1200ST", [2005, 2007],
  ["r1200st", "r 1200 st", "r1200 st"], "touring", "shaft",
  "1170 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  "BMW's short-lived sport tourer with the odd headlight. The hexhead boxer in a lighter bike than the RT.",
  [["Boxer twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Final drive", "Check play"], ["Brakes", "Check ABS"], ["Shaft", "Change oil"]],
  EFI, BMWNOTE, [MOA]))

B72.append(mk("bmw-r1200s-hp2-sport-2006", "BMW", "R1200S / HP2 Sport", "BMW R1200S / HP2 Sport", [2006, 2010],
  ["r1200s", "r 1200 s", "hp2 sport", "hp2s", "r1200s sport"], "sport", "shaft",
  "1170 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  "BMW's sporty boxers. The HP2 Sport has DOHC heads and lots of carbon, so parts are costly.",
  [["Boxer twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Final drive", "Check play"], ["Shaft", "Change oil"]],
  EFI, BMWNOTE, [MOA]))

B72.append(mk("bmw-hp2-enduro-megamoto-2005", "BMW", "HP2 Enduro / Megamoto", "BMW HP2 Enduro / Megamoto", [2005, 2009],
  ["hp2 enduro", "hp2 megamoto", "hp2", "megamoto", "hp2e", "hp2 mm"], "dualsport", "shaft",
  "1170 cc air/oil-cooled boxer twin, fuel injected, shaft drive, air shock",
  "BMW's light off-road boxer. Long-travel forks, an air shock on the Enduro and a final drive to check.",
  [["Boxer twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Air shock", "Check pressure"], ["Final drive", "Check play"], ["Shaft", "Change oil"]],
  EFI, BMWNOTE, [UKGS]))

B72.append(mk("bmw-f650-funduro-st-1994", "BMW", "F650 Funduro / ST", "BMW F650 Funduro / ST", [1994, 1999],
  ["f650", "funduro", "f650st", "f 650", "f650 funduro", "f 650 st", "f650 strada"], "dualsport", "chain",
  "652 cc liquid-cooled four-valve Rotax single, two carbs",
  "BMW's first single of the modern era, built with Aprilia and Rotax. Chain drive, two carbs and a dry-sump oil tank in the frame.",
  [["Rotax single", "Liquid-cooled"], ["Two carbs", "Clean them"], ["Valves", "Shim check"], ["Oil", "Dry sump"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [F650]))

HERO_NAME_B72 = {"harley-davidson-model-165-st-165-1953": "MODEL 165", "bmw-r25-r26-r27-singles-1950": "R27", "bmw-r51-3-r67-plunger-1951": "R67",
  "bmw-k1-k1100rs-k1100lt-1989": "K1100", "bmw-k1200rs-k1200gt-1997": "K1200RS", "bmw-r1200gs-air-cooled-2004": "R1200GS",
  "bmw-r1200st-2005": "R1200ST", "bmw-r1200s-hp2-sport-2006": "R1200S", "bmw-hp2-enduro-megamoto-2005": "HP2", "bmw-f650-funduro-st-1994": "F650"}
