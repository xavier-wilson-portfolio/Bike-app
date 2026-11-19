"""Batch 86 bike tunes (top 1000, rows 851-860)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch38 import SCOOT
from batch51 import MOPED
B86 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
TWOFOUR = "Some years are two-strokes and some are four-strokes. Check yours before you buy oil, plugs or carb parts."

B86.append(mk("genuine-stella-150-2003", "Genuine", "Stella 150", "Genuine Stella 150", [2003, 2016],
  ["stella", "stella 150", "genuine stella", "stella 4t", "stella 2t", "lml star"], "scooter", "chain",
  "150 cc air-cooled single, two-stroke then four-stroke, four-speed hand shift",
  "Genuine's LML-built Vespa-style scooter. A manual hand-shift gearbox and a steel body.",
  [["Single", "Check type"], ["Carb", "Clean it out"], ["Hand shift", "Cables"], ["Body", "Check rust"], ["Brakes", "Drums"]],
  CARB, GENNOTE, [SCOOT], lessons={"B": [TWOFOUR]}))

B86.append(mk("genuine-buddy-50-125-150-170-2005", "Genuine", "Buddy 50 / 125 / 150 / 170", "Genuine Buddy", [2005, 2026],
  ["buddy", "buddy 50", "buddy 125", "buddy 150", "buddy 170", "buddy kick", "buddy international", "genuine buddy"], "scooter", "belt",
  "49 to 170 cc air-cooled single, carb or fuel injection, CVT",
  "Genuine's PGO-built small scooter. Simple and cheap to run, with a CVT and a lot of owner support.",
  [["Single", "Air-cooled"], ["Fuel", "Carb or EFI"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Brakes", "Check them"]],
  [], GENNOTE, [SCOOT], lessons={"B": [TWOFOUR]}))

B86.append(mk("genuine-roughhouse-50-hooligan-170-2007", "Genuine", "Roughhouse 50 / Hooligan 170", "Genuine Roughhouse 50 / Hooligan 170", [2007, 2026],
  ["roughhouse", "roughhouse 50", "hooligan", "hooligan 170", "rough house"], "scooter", "belt",
  "49 cc two-stroke or 170 cc four-stroke, air-cooled, CVT",
  "Genuine's rugged-looking scooters. Small, simple and built to be knocked around.",
  [["Single", "Check type"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Brakes", "Check them"]],
  CARB, GENNOTE, [SCOOT], lessons={"B": [TWOFOUR]}))

B86.append(mk("sym-symba-wolf-fiddle-2008", "SYM", "Symba / Wolf / Fiddle", "SYM Symba / Wolf / Fiddle", [2008, 2026],
  ["symba", "wolf", "wolf 125", "wolf 250", "fiddle", "fiddle ii", "sym symba", "wolf classic"], "standard", "chain",
  "101 to 249 cc air-cooled single, carb or fuel injection",
  "SYM's small bikes and scooters. The Symba is a Cub-style step-through, the Wolf a small motorcycle, the Fiddle a scooter.",
  [["Single", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check them"], ["Drive", "Chain or belt"], ["Brakes", "Check them"]],
  [], GENNOTE, [SCOOT]))

B86.append(mk("sym-citycom-300-hd200-joymax-2008", "SYM", "Citycom 300 / HD200 / Joymax", "SYM Citycom 300 / HD200 / Joymax", [2008, 2026],
  ["citycom", "citycom 300", "hd200", "hd 200", "joymax", "joymax 300", "joymax 125", "hd2"], "scooter", "belt",
  "171 to 278 cc liquid-cooled single, fuel injected, CVT",
  "SYM's bigger commuter scooters. Fuel injected, liquid cooled and built to run high miles.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Bodywork", "Many panels"]],
  EFI, GENNOTE, [SCOOT]))

B86.append(mk("kymco-super-8-super-9-2009", "Kymco", "Super 8 / Super 9", "Kymco Super 8 / Super 9", [2009, 2020],
  ["super 8", "super 9", "super8", "super9", "super 8 150", "super 8 50", "super 9 lc"], "scooter", "belt",
  "49 cc two-stroke or 49 to 150 cc four-stroke, CVT",
  "Kymco's sporty small scooters. The Super 9 is a two-stroke; most Super 8s are four-strokes.",
  [["Single", "Check type"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Brakes", "Check them"]],
  CARB, GENNOTE, [SCOOT], lessons={"B": [TWOFOUR]}))

B86.append(mk("kymco-k-pipe-125-2014", "Kymco", "K-Pipe 125", "Kymco K-Pipe 125", [2014, 2022],
  ["k-pipe", "k pipe", "kpipe", "k-pipe 125", "kpipe 125"], "standard", "chain",
  "124 cc air-cooled single, carb, five-speed",
  "Kymco's small manual mini-bike. A Grom rival with a carb and a five-speed box.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Clutch", "Adjust cable"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [SCOOT]))

B86.append(mk("kymco-venox-250-2003", "Kymco", "Venox 250", "Kymco Venox 250", [2003, 2009],
  ["venox", "venox 250", "kymco venox"], "cruiser", "chain",
  "249 cc liquid-cooled V-twin, carb",
  "Kymco's small V-twin cruiser. Liquid cooled, simple and short on parts support now.",
  [["V-twin", "Liquid-cooled"], ["Carb", "Clean it out"], ["Cooling", "Coolant and hoses"], ["Parts", "Check supply"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [SCOOT]))

B86.append(mk("kymco-cv3-2022", "Kymco", "CV3", "Kymco CV3", [2022, 2026],
  ["cv3", "cv 3", "kymco cv3", "cv3 550"], "scooter", "belt",
  "550 cc liquid-cooled parallel twin, fuel injected, CVT, two leaning front wheels",
  "Kymco's leaning three-wheel maxi-scooter. A 550 cc twin and a front linkage to keep in good shape.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Front linkage", "Check play"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"]],
  EFI, GENNOTE, [SCOOT], lessons={"L": ["The front tilting linkage has its own bearings and bushings. Check for play before you trust the steering."]}))

B86.append(mk("piaggio-typhoon-50-125-2001", "Piaggio", "Typhoon 50 / 125", "Piaggio Typhoon 50 / 125", [2001, 2026],
  ["typhoon", "typhoon 50", "typhoon 125", "piaggio typhoon", "typhoon 80"], "scooter", "belt",
  "49 cc two-stroke or 125 cc four-stroke, air-cooled, CVT",
  "Piaggio's chunky-tire scooter. The 50 is a two-stroke with oil injection on most years; the 125 is a four-stroke.",
  [["Single", "Check type"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Tires", "Check age"]],
  CARB, GENNOTE, [SCOOT], lessons={"B": [TWOFOUR]}))

HERO_NAME_B86 = {"genuine-stella-150-2003": "STELLA", "genuine-buddy-50-125-150-170-2005": "BUDDY", "genuine-roughhouse-50-hooligan-170-2007": "HOOLIGAN",
  "sym-symba-wolf-fiddle-2008": "SYM", "sym-citycom-300-hd200-joymax-2008": "CITYCOM", "kymco-super-8-super-9-2009": "SUPER 8",
  "kymco-k-pipe-125-2014": "K-PIPE", "kymco-venox-250-2003": "VENOX", "kymco-cv3-2022": "CV3", "piaggio-typhoon-50-125-2001": "TYPHOON"}
