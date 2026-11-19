"""Batch 57 bike tunes (top 1000, rows 561-570)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch29 import ADVR
from batch38 import SCOOT
from batch31 import CBRF, VFRD, SHADOWF
from batch22 import VJMC
from batch51 import MOPED, INJ
B57 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
IMPNOTE = "Most of these were sold new outside the US, so the NHTSA search may not cover them. Ask a Honda dealer to check the frame number."

B57.append(mk("honda-africa-twin-xrv650-xrv750-1988", "Honda", "Africa Twin XRV650 / XRV750", "Honda Africa Twin XRV650 / XRV750", [1988, 2003],
  ["xrv750", "xrv650", "xrv 750", "rd07", "rd04", "africa twin 750", "africa twin 650", "africa twin"], "adventure", "chain",
  "647 or 742 cc liquid-cooled V-twin, two carbs",
  "The original Africa Twin. A rally-styled V-twin with two carbs, a big tank and a lot of bodywork to remove for any job.",
  [["V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Charging", "Check R/R"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  CARB, IMPNOTE, [ADVR], lessons={"F": ["Check the regulator/rectifier and its connector. A failed regulator is a well-known problem on these."]}))

B57.append(mk("honda-rebel-450-cmx450-1986", "Honda", "Rebel 450 (CMX450)", "Honda Rebel 450 (CMX450)", [1986, 1987],
  ["rebel 450", "cmx450", "cmx450c", "cmx 450", "rebel450"], "cruiser", "chain",
  "447 cc air-cooled parallel twin, two carbs, six-speed",
  "The bigger Rebel of the 80s. The Nighthawk 450 twin in a low cruiser frame.",
  [["447 cc twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Check them"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [SHADOWF]))

B57.append(mk("honda-cb-1-cb400f-1989", "Honda", "CB-1 (CB400F)", "Honda CB-1", [1989, 1990],
  ["cb-1", "cb1", "cb 1", "cb400f", "nc27", "cb-1 400"], "standard", "chain",
  "399 cc liquid-cooled DOHC inline four, four carbs, gear-driven cams",
  "Honda's little naked four, sold in the US for two years. Revs high, with gear-driven cams and four small carbs.",
  [["Inline four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B57.append(mk("honda-nsr250r-1987", "Honda", "NSR250R", "Honda NSR250R", [1987, 1999],
  ["nsr250r", "nsr250", "nsr 250", "mc18", "mc21", "mc28", "nsr250 se", "nsr250 sp"], "sport", "chain",
  "249 cc liquid-cooled two-stroke V-twin, two carbs, oil injection, power valves",
  "Honda's two-stroke sport bike, built for Japan. Power valves, oil injection and electronics that are hard to replace.",
  [["Two-stroke", "Oil injection"], ["Two carbs", "Clean and sync"], ["Power valves", "Clean them"], ["Electronics", "Check PGM unit"], ["Cooling", "Coolant and hoses"]],
  TWO, IMPNOTE, [CBRF], lessons={"B": [INJ]}))

B57.append(mk("honda-vfr400r-nc30-1989", "Honda", "VFR400R NC30", "Honda VFR400R NC30", [1989, 1992],
  ["nc30", "vfr400r", "vfr400", "vfr 400", "nc24", "rvf400", "nc35"], "sport", "chain",
  "399 cc liquid-cooled V4, gear-driven cams, four carbs, single-sided swingarm",
  "The small RC30. A gray-import V4 with gear-driven cams that revs past 14,000 rpm.",
  [["V4", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and hoses"], ["Parts", "Source early"]],
  CARB, IMPNOTE, [VFRD]))

B57.append(mk("honda-cbr250rr-mc22-1990", "Honda", "CBR250RR (MC22)", "Honda CBR250RR (MC22)", [1990, 1994],
  ["mc22", "cbr250rr", "cbr 250rr", "cbr250rr mc22", "mc19", "cbr250r mc19"], "sport", "chain",
  "249 cc liquid-cooled inline four, four carbs, gear-driven cams",
  "Honda's tiny four, built for Japan. Redlines near 19,000 rpm, with four very small carbs.",
  [["Inline four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and hoses"], ["Parts", "Source early"]],
  CARB, IMPNOTE, [CBRF]))

B57.append(mk("honda-cb500t-1975", "Honda", "CB500T", "Honda CB500T", [1975, 1976],
  ["cb500t", "cb 500t", "cb500 twin", "cb500t twin"], "standard", "chain",
  "498 cc air-cooled DOHC parallel twin, two carbs, five-speed",
  "Honda's DOHC twin of the mid 70s, grown from the CB450. Two carbs, points and a torsion-bar valve setup.",
  [["DOHC twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Points", "Gap and time"], ["Cam chain", "Adjust it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B57.append(mk("yamaha-riva-125-180-1983", "Yamaha", "Riva 125 / 180", "Yamaha Riva 125 / 180", [1983, 1990],
  ["riva 125", "riva 180", "xc125", "xc180", "xc 180", "riva 200", "xc200"], "scooter", "belt",
  "123 to 183 cc air-cooled four-stroke single, carb, CVT",
  "Yamaha's 80s scooters. Air-cooled four-strokes with a CVT and a lot of aging plastic.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Bodywork", "Many panels"]],
  CARB, OLD, [SCOOT]))

B57.append(mk("yamaha-riva-50-jog-razz-1983", "Yamaha", "Riva 50 / Jog / Razz", "Yamaha Riva 50 / Jog / Razz", [1983, 2001],
  ["riva 50", "jog", "razz", "cy50", "sh50", "ca50", "yamaha jog", "jog 50"], "scooter", "belt",
  "49 cc air-cooled two-stroke single, oil injection, CVT",
  "Yamaha's small two-stroke scooters. Oil injection, a CVT and simple drum brakes.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Exhaust", "Check carbon"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [INJ]}))

B57.append(mk("yamaha-c3-2005", "Yamaha", "C3", "Yamaha C3", [2005, 2014],
  ["c3", "yamaha c3", "xf50", "xf 50"], "scooter", "belt",
  "49 cc liquid-cooled four-stroke single, CVT",
  "Yamaha's boxy 50 cc scooter. A liquid-cooled four-stroke with a CVT and lots of storage.",
  [["49 cc single", "Liquid-cooled"], ["Fuel", "Check system"], ["CVT belt", "Inspect"], ["Cooling", "Coolant level"], ["Gear oil", "Change it"]],
  [], GENNOTE, [SCOOT]))

HERO_NAME_B57 = {"honda-africa-twin-xrv650-xrv750-1988": "AFRICA TWIN", "honda-rebel-450-cmx450-1986": "REBEL 450", "honda-cb-1-cb400f-1989": "CB-1",
  "honda-nsr250r-1987": "NSR250R", "honda-vfr400r-nc30-1989": "NC30", "honda-cbr250rr-mc22-1990": "CBR250RR", "honda-cb500t-1975": "CB500T",
  "yamaha-riva-125-180-1983": "RIVA", "yamaha-riva-50-jog-razz-1983": "JOG", "yamaha-c3-2005": "C3"}
