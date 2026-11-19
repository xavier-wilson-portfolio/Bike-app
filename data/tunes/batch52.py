"""Batch 52 bike tunes (top 1000, rows 511-520)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch38 import SCOOT
from batch31 import CBRF
from batch12 import CTF
from batch22 import VJMC
from batch51 import MOPED, INJ
B52 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."

B52.append(mk("honda-spree-nq50-1984", "Honda", "Spree NQ50", "Honda Spree NQ50", [1984, 1987],
  ["spree", "nq50", "nq 50", "honda spree", "spree 50"], "scooter", "belt",
  "49 cc air-cooled two-stroke single, oil injection, automatic",
  "Honda's tiny 80s scooter. Light, simple, and a two-stroke with its own oil tank.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Drive belt", "Inspect"], ["Exhaust", "Check carbon"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [INJ]}))

B52.append(mk("honda-elite-250-ch250-1985", "Honda", "Elite 250 (CH250)", "Honda Elite 250 (CH250)", [1985, 1988],
  ["elite 250", "ch250", "ch 250", "elite 250 ch250", "elite250"], "scooter", "belt",
  "244 cc liquid-cooled four-stroke single, carb, CVT",
  "Honda's big Elite of the 80s. Liquid cooled, with a CVT and a lot of 80s plastic.",
  [["244 cc single", "Liquid-cooled"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Bodywork", "Many panels"]],
  CARB, OLD, [SCOOT]))

B52.append(mk("honda-big-ruckus-ps250-2005", "Honda", "Big Ruckus (PS250)", "Honda Big Ruckus (PS250)", [2005, 2009],
  ["big ruckus", "ps250", "ps 250", "honda big ruckus"], "scooter", "belt",
  "249 cc liquid-cooled four-stroke single, carb, CVT",
  "The 250 cc Ruckus. Exposed frame, a liquid-cooled single and a CVT.",
  [["249 cc single", "Liquid-cooled"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Frame", "Check welds"]],
  CARB, GENNOTE, [SCOOT]))

B52.append(mk("honda-navi-2022", "Honda", "Navi", "Honda Navi", [2022, 2026],
  ["navi", "honda navi", "nva110", "nva 110", "navi 110"], "scooter", "belt",
  "109 cc air-cooled single, fuel injected, CVT",
  "Honda's small automatic mini-bike. Fuel injected, with a CVT and a storage bin where a tank would be.",
  [["109 cc single", "Air-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Brakes", "Check them"]],
  EFI, GENNOTE, [SCOOT]))

B52.append(mk("honda-grom-2014-2021-2014", "Honda", "Grom (2014-2021)", "Honda Grom (2014-2021)", [2014, 2021],
  ["grom", "msx125", "msx 125", "grom 125", "grom sf"], "standard", "chain",
  "125 cc air-cooled single, fuel injected, four-speed",
  "The first Grom. Fuel injected, a four-speed box and a huge aftermarket.",
  [["125 cc single", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Mods", "Undo bad ones"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [], lessons={"L": ["Most used Groms have been modified. Check for cut wiring, cheap levers and a bad exhaust seal before you set the base tune."]}))

B52.append(mk("honda-st70-st90-trailsport-1970", "Honda", "ST70 / ST90 Trailsport", "Honda ST70 / ST90 (Dax)", [1970, 1980],
  ["st70", "st90", "st 70", "st 90", "trailsport", "dax", "honda dax"], "standard", "chain",
  "72 or 89 cc air-cooled overhead-cam single, three- or four-speed",
  "Honda's Dax. A pressed-steel T-frame, removable bars and a small horizontal single.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Frame", "Check rust"], ["Six-volt", "Check charging"]],
  [], OLD, [CTF], lessons={"B": [POINTS]}))

B52.append(mk("honda-ct110-trail-110-1980", "Honda", "CT110 Trail 110", "Honda CT110 Trail 110", [1980, 1986],
  ["ct110", "ct 110", "trail 110", "trail110", "postie", "postie bike"], "standard", "chain",
  "105 cc air-cooled overhead-cam single, four-speed with an automatic clutch",
  "Honda's Trail 110. A step-through trail bike with an auto clutch, and in some years a dual-range box.",
  [["105 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Auto clutch", "Adjust it"], ["Dual range", "Check lever"], ["Chain drive", "Slack and lube"]],
  [], OLD, [CTF]))

B52.append(mk("honda-motocompo-ncz50-1981", "Honda", "Motocompo NCZ50", "Honda Motocompo", [1981, 1983],
  ["motocompo", "ncz50", "ncz 50", "honda motocompo", "moto compo"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, automatic",
  "Honda's folding scooter, built to fit in the trunk of a City. Small, rare and plastic.",
  [["Two-stroke", "Check oiling"], ["Carb", "Clean it out"], ["Folding bars", "Check latches"], ["Plastic shell", "Check cracks"], ["Parts", "Source early"]],
  TWO, OLD, [MOPED], lessons={"B": ["Check whether yours has a working oil pump or has been set up for premix before you fill the tank."]}))

B52.append(mk("honda-rc51-rvt1000r-2000", "Honda", "RC51 (RVT1000R)", "Honda RC51 (RVT1000R)", [2000, 2006],
  ["rc51", "rc 51", "rvt1000r", "rvt 1000r", "rvt1000", "sp-1", "sp-2", "sp1", "sp2"], "sport", "chain",
  "999 cc liquid-cooled 90-degree V-twin, fuel injected, gear-driven cams",
  "Honda's V-twin superbike. Gear-driven cams, a big fuel injection system and a rear shock worth checking.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Coolant and hoses"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [CBRF], lessons={"F": ["Check the regulator/rectifier and its connector. Heat damage there is a common cause of charging problems on these."]}))

B52.append(mk("honda-cbr929rr-cbr954rr-2000", "Honda", "CBR929RR / CBR954RR", "Honda CBR929RR / CBR954RR Fireblade", [2000, 2003],
  ["cbr929rr", "cbr954rr", "cbr929", "cbr954", "929rr", "954rr", "cbr 929rr", "cbr 954rr", "fireblade"], "sport", "chain",
  "929 or 954 cc liquid-cooled inline four, fuel injected",
  "The first fuel-injected Fireblades. Light and quick, with an early fuel injection system to check.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Coolant and fan"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [CBRF]))

HERO_NAME_B52 = {"honda-spree-nq50-1984": "SPREE", "honda-elite-250-ch250-1985": "ELITE 250", "honda-big-ruckus-ps250-2005": "BIG RUCKUS",
  "honda-navi-2022": "NAVI", "honda-grom-2014-2021-2014": "GROM", "honda-st70-st90-trailsport-1970": "DAX", "honda-ct110-trail-110-1980": "CT110",
  "honda-motocompo-ncz50-1981": "MOTOCOMPO", "honda-rc51-rvt1000r-2000": "RC51", "honda-cbr929rr-cbr954rr-2000": "CBR954RR"}
