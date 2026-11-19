"""Batch 61 bike tunes (top 1000, rows 601-610)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch16 import XJB, FJO
from batch36 import YAMF
B61 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B61.append(mk("yamaha-niken-2019", "Yamaha", "Niken", "Yamaha Niken", [2019, 2021],
  ["niken", "niken gt", "yamaha niken", "mxt850"], "touring", "chain",
  "847 cc liquid-cooled triple, fuel injected, two leaning front wheels",
  "Yamaha's three-wheeler that leans. The MT-09 triple up top, with a double front end that has many bearings to check.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Front end", "Check linkage"], ["Tires", "Three to check"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [YAMF], lessons={"L": ["The leaning front end has its own bearings and bushings. Check the linkage for play before you trust the steering."]}))

B61.append(mk("yamaha-fz8-2011", "Yamaha", "FZ8", "Yamaha FZ8", [2011, 2013],
  ["fz8", "fz-8", "fz 8", "fazer 8", "fz8n"], "standard", "chain",
  "779 cc liquid-cooled inline four, fuel injected",
  "The middle FZ. A detuned FZ1 engine in an aluminum frame, sold in the US for three years.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [YAMF]))

B61.append(mk("yamaha-fz6r-2009", "Yamaha", "FZ6R", "Yamaha FZ6R", [2009, 2017],
  ["fz6r", "fz6-r", "fz 6r", "xj6", "xj6 diversion", "xj6f"], "standard", "chain",
  "600 cc liquid-cooled inline four, fuel injected, steel frame",
  "Yamaha's friendly 600 four. A steel frame, an adjustable seat and an engine tuned for the midrange.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [YAMF]))

B61.append(mk("yamaha-yzf-r6-1999-2005-1999", "Yamaha", "YZF-R6 (1999-2005)", "Yamaha YZF-R6 (1999-2005)", [1999, 2005],
  ["yzf-r6", "r6", "yzf r6", "yzfr6", "r6 2003", "r6s", "yzf-r6s"], "sport", "chain",
  "599 cc liquid-cooled inline four, carbs until 2002 then fuel injection",
  "The early R6. Carbs on the first ones, fuel injection from 2003, and a high-revving four either way.",
  [["Inline four", "Liquid-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  [], GENNOTE, [YAMF]))

B61.append(mk("yamaha-yzf-r9-2025", "Yamaha", "YZF-R9", "Yamaha YZF-R9", [2025, 2026],
  ["yzf-r9", "r9", "yzf r9", "yzfr9", "yamaha r9"], "sport", "chain",
  "890 cc liquid-cooled triple, fuel injected, ride-by-wire",
  "Yamaha's triple-powered sport bike. The MT-09 engine in a race-styled chassis with lots of rider aids.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [YAMF]))

B61.append(mk("yamaha-fj600-1984", "Yamaha", "FJ600", "Yamaha FJ600", [1984, 1985],
  ["fj600", "fj 600", "xj600 fj", "fj600l"], "sport", "chain",
  "598 cc air-cooled DOHC inline four, four carbs",
  "Yamaha's small FJ. An air-cooled four with a half fairing, related to the later Seca II.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XJB]))

B61.append(mk("yamaha-fj1100-1984", "Yamaha", "FJ1100", "Yamaha FJ1100", [1984, 1985],
  ["fj1100", "fj 1100", "fj1100l", "fj1100n"], "touring", "chain",
  "1097 cc air-cooled DOHC inline four, four carbs",
  "The first FJ. A big air-cooled four with a perimeter frame and a 16-inch front wheel.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [FJO]))

B61.append(mk("yamaha-xj700-maxim-maxim-x-1985", "Yamaha", "XJ700 Maxim / Maxim X", "Yamaha XJ700 Maxim / Maxim X", [1985, 1986],
  ["xj700", "xj 700", "maxim 700", "maxim x", "xj700x", "xj700 maxim"], "standard", "shaft",
  "699 cc DOHC inline four (air-cooled Maxim, liquid-cooled Maxim X), four carbs, shaft drive",
  "Yamaha's mid-80s 700 Maxims. Shaft drive and four carbs; the X is liquid cooled with a lot more power.",
  [["Inline four", "Air or liquid"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [XJB]))

B61.append(mk("yamaha-xz550-vision-1982", "Yamaha", "XZ550 Vision", "Yamaha XZ550 Vision", [1982, 1983],
  ["xz550", "xz 550", "vision", "vision 550", "xz550rj", "xz550rk", "yamaha vision"], "standard", "shaft",
  "552 cc liquid-cooled V-twin, two downdraft carbs, shaft drive",
  "Yamaha's odd early-80s V-twin. Liquid cooled, shaft drive, and carbs that are known for cold-start trouble.",
  [["V-twin", "Liquid-cooled"], ["Two carbs", "Clean and set"], ["Cooling", "Coolant and hoses"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [XJB]))

B61.append(mk("yamaha-xj400-seca-maxim-1980", "Yamaha", "XJ400 Seca / Maxim", "Yamaha XJ400 Seca / Maxim", [1980, 1983],
  ["xj400", "xj 400", "seca 400", "maxim 400", "xj400 seca", "xj400 maxim", "xj400g"], "standard", "chain",
  "398 cc air-cooled DOHC inline four, four carbs",
  "Yamaha's small four of the early 80s. Four little carbs and a chain final drive.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XJB]))

HERO_NAME_B61 = {"yamaha-niken-2019": "NIKEN", "yamaha-fz8-2011": "FZ8", "yamaha-fz6r-2009": "FZ6R", "yamaha-yzf-r6-1999-2005-1999": "R6",
  "yamaha-yzf-r9-2025": "R9", "yamaha-fj600-1984": "FJ600", "yamaha-fj1100-1984": "FJ1100", "yamaha-xj700-maxim-maxim-x-1985": "MAXIM",
  "yamaha-xz550-vision-1982": "VISION", "yamaha-xj400-seca-maxim-1980": "XJ400"}
