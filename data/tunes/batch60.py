"""Batch 60 bike tunes (top 1000, rows 591-600)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch15 import YE
from batch22 import VJMC
from batch36 import YAMF
from batch51 import INJ
B60 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."

B60.append(mk("yamaha-at1-ct1-125-175-1969", "Yamaha", "AT1 / CT1 125-175", "Yamaha AT1 / CT1 Enduro", [1969, 1972],
  ["at1", "ct1", "at 1", "ct 1", "at2", "ct2", "at3", "ct3", "at1b", "ct1b"], "dualsport", "chain",
  "123 or 171 cc air-cooled two-stroke single, Autolube oil injection, points",
  "Yamaha's small enduros from the start of the trail-bike boom. Autolube oil injection and points ignition.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Autolube", "Check pump"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [YE], lessons={"B": [INJ, POINTS]}))

B60.append(mk("yamaha-yr1-yr2-350-1967", "Yamaha", "YR1 / YR2 350", "Yamaha YR1 / YR2 350", [1967, 1969],
  ["yr1", "yr2", "yr 1", "yr 2", "yr2c", "yr3", "yamaha 350 1968"], "standard", "chain",
  "348 cc air-cooled two-stroke twin, two carbs, Autolube oil injection",
  "Yamaha's first 350 twin, the start of the line that led to the R5 and RD350.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["Autolube", "Check pump"], ["Points", "Gap and time"], ["Parts", "Source early"]],
  TWO, OLD, [VJMC], lessons={"B": [INJ, POINTS]}))

B60.append(mk("yamaha-r5-ds7-1970", "Yamaha", "R5 / DS7", "Yamaha R5 / DS7", [1970, 1972],
  ["r5", "ds7", "r5c", "r5b", "r5a", "ds6", "ds6c", "r 5"], "standard", "chain",
  "247 or 347 cc air-cooled two-stroke twin, two carbs, Autolube oil injection",
  "The two-stroke twins just before the RD. Light and quick, with points and Autolube.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["Autolube", "Check pump"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [INJ, POINTS]}))

B60.append(mk("yamaha-yds-3-big-bear-250-1964", "Yamaha", "YDS-3 / Big Bear 250", "Yamaha YDS-3 / Big Bear", [1964, 1967],
  ["yds-3", "yds3", "big bear", "yds-5", "yds5", "catalina", "yds2", "yds 3"], "standard", "chain",
  "246 cc air-cooled two-stroke twin, two carbs, Autolube on later models",
  "Yamaha's 60s 250 twins, including the Big Bear scrambler. Rare now, with parts to hunt down.",
  [["Two-stroke twin", "Check oiling"], ["Two carbs", "Sync them"], ["Points", "Gap and time"], ["Six-volt", "Check charging"], ["Parts", "Source early"]],
  TWO, OLD, [VJMC], lessons={"B": ["Early ones run premix, later ones have Autolube. Check which yours has before you fill the tank."]}))

B60.append(mk("yamaha-tx500-xs500-1973", "Yamaha", "TX500 / XS500", "Yamaha TX500 / XS500", [1973, 1978],
  ["tx500", "xs500", "xs 500", "tx 500", "xs500c", "xs500e", "xs500d"], "standard", "chain",
  "498 cc air-cooled DOHC eight-valve parallel twin, two carbs, balancer",
  "Yamaha's DOHC 500 twin. A balancer, two carbs and a head that does not forgive overheating.",
  [["DOHC twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Shim check"], ["Oil", "Check level often"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B60.append(mk("yamaha-tx750-1972", "Yamaha", "TX750", "Yamaha TX750", [1972, 1973],
  ["tx750", "tx 750", "tx750a"], "standard", "chain",
  "743 cc air-cooled parallel twin, two carbs, balancer shafts",
  "Yamaha's early 750 twin with balancer shafts. Oil supply and the balancer chain are the known weak spots.",
  [["Big twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Oiling", "Check supply"], ["Balancer", "Check chain"], ["Parts", "Source early"]],
  CARB, OLD, [VJMC], lessons={"H": ["Oil starvation hurt many TX750s. Check the oil level often and look for updated oil-system parts before you ride it hard."]}))

B60.append(mk("yamaha-sr250-1980", "Yamaha", "SR250", "Yamaha SR250", [1980, 1982],
  ["sr250", "sr 250", "sr250 exciter", "sr250g", "sr250 special", "exciter 250"], "standard", "chain",
  "239 cc air-cooled overhead-cam single, carb",
  "Yamaha's small street single of the early 80s. Shares its engine with the XT250.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Cam chain", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B60.append(mk("yamaha-scr950-2017", "Yamaha", "SCR950", "Yamaha SCR950", [2017, 2018],
  ["scr950", "scr 950", "scr-950", "yamaha scr950"], "standard", "belt",
  "942 cc air-cooled V-twin, fuel injected, belt drive",
  "The Bolt engine in a scrambler setup. Fuel injected, air-cooled and belt drive.",
  [["V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Belt", "Check tension"], ["Valves", "Check them"], ["Wheels", "Spokes"]],
  EFI, GENNOTE, [YAMF]))

B60.append(mk("yamaha-xsr900-2016-2021-2016", "Yamaha", "XSR900 (2016-2021)", "Yamaha XSR900 (2016-2021)", [2016, 2021],
  ["xsr900", "xsr 900", "xsr-900", "xsr900 abarth"], "standard", "chain",
  "847 cc liquid-cooled crossplane triple, fuel injected, ride-by-wire",
  "The first XSR900. The MT-09 triple with retro bodywork and a slip-assist clutch.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [YAMF]))

B60.append(mk("yamaha-tracer-9-gt-2021", "Yamaha", "Tracer 9 GT", "Yamaha Tracer 9 GT", [2021, 2026],
  ["tracer 9", "tracer 9 gt", "tracer9", "tracer 9 gt+", "tracer 9 gt plus"], "touring", "chain",
  "890 cc liquid-cooled triple, fuel injected, semi-active suspension",
  "Yamaha's sport tourer on the MT-09 platform. Electronic suspension on the GT, plus side cases and lots of rider aids.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Suspension", "Semi-active"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [YAMF]))

HERO_NAME_B60 = {"yamaha-at1-ct1-125-175-1969": "ENDURO", "yamaha-yr1-yr2-350-1967": "YR1", "yamaha-r5-ds7-1970": "R5",
  "yamaha-yds-3-big-bear-250-1964": "BIG BEAR", "yamaha-tx500-xs500-1973": "XS500", "yamaha-tx750-1972": "TX750", "yamaha-sr250-1980": "SR250",
  "yamaha-scr950-2017": "SCR950", "yamaha-xsr900-2016-2021-2016": "XSR900", "yamaha-tracer-9-gt-2021": "TRACER 9"}
