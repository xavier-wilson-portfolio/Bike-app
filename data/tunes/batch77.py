"""Batch 77 bike tunes (top 1000, rows 761-770)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch29 import KTMF, ADVR
from batch45 import KTMNOTE
from batch55 import TT, PREMIX
B77 = []
TWO = CARB + AIR + ["H-003"]
KDIRT2 = "Off-road models are not always in the NHTSA recall search. Ask a KTM dealer to run the VIN as well."

B77.append(mk("ktm-125-sx-150-sx-250-sx-two-stroke-1990", "KTM", "125 SX / 150 SX / 250 SX (two-stroke)", "KTM 125 / 150 / 250 SX (two-stroke)", [1990, 2026],
  ["125 sx", "150 sx", "250 sx", "125sx", "150sx", "250sx", "ktm 125 sx", "ktm 250 sx"], "dualsport", "chain",
  "124 to 249 cc liquid-cooled two-stroke single, carb then injection on newer years, premix",
  "KTM's motocross two-strokes. Premix on most years, a power valve, and top ends that need regular rebuilds.",
  [["Two-stroke", "Premix"], ["Fuel", "Carb or TBI"], ["Top end", "Check piston"], ["Power valve", "Clean it"], ["Hours", "Log them"]],
  TWO, KDIRT2, [TT], lessons={"B": [PREMIX]}))

B77.append(mk("ktm-250-sx-f-350-sx-f-2005", "KTM", "250 SX-F / 350 SX-F", "KTM 250 SX-F / 350 SX-F", [2005, 2026],
  ["250 sx-f", "350 sx-f", "250 sxf", "350 sxf", "250 xc-f", "350 xc-f", "250 xcf", "350 xcf"], "dualsport", "chain",
  "249 or 349 cc liquid-cooled four-stroke single, carb then fuel injection",
  "KTM's small-bore motocross four-strokes. They rev very high and need valve checks measured in hours.",
  [["Race single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], KDIRT2, [TT]))

B77.append(mk("ktm-450-sx-f-2003", "KTM", "450 SX-F", "KTM 450 SX-F", [2003, 2026],
  ["450 sx-f", "450 sxf", "450 xc-f", "450 xcf", "450 sx", "ktm 450 sx-f"], "dualsport", "chain",
  "449 cc liquid-cooled four-stroke single, carb then fuel injection",
  "KTM's open-class motocross four-stroke. Electric start on later years and a strict service schedule in hours.",
  [["Race single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], KDIRT2, [TT]))

B77.append(mk("ktm-85-sx-105-sx-2003", "KTM", "85 SX / 105 SX", "KTM 85 SX / 105 SX", [2003, 2026],
  ["85 sx", "105 sx", "85sx", "105sx", "105 xc", "ktm 85"], "dualsport", "chain",
  "85 or 105 cc liquid-cooled two-stroke single, carb, premix",
  "KTM's big-wheel and small-wheel kids' motocross bikes. Premix and a top end that wears fast.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, KDIRT2, [TT], lessons={"B": [PREMIX]}))

B77.append(mk("ktm-450-530-exc-2004", "KTM", "450 / 530 EXC", "KTM 450 / 530 EXC", [2004, 2011],
  ["450 exc", "530 exc", "450 xc-w", "530 xc-w", "450 exc-r", "530 exc-r", "450 xcw", "530 xcw"], "dualsport", "chain",
  "449 or 510 cc liquid-cooled four-stroke single, carb, electric start",
  "KTM's big enduros before the EXC-F. Carbs, electric start and a dry-sump oil system.",
  [["Single", "Liquid-cooled"], ["Carb", "Check jetting"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  CARB, KDIRT2, [KTMF]))

B77.append(mk("ktm-200-exc-xc-w-1998", "KTM", "200 EXC / XC-W", "KTM 200 EXC / XC-W", [1998, 2016],
  ["200 exc", "200 xc-w", "200 xcw", "200 mxc", "200 xc", "ktm 200 exc"], "dualsport", "chain",
  "193 cc liquid-cooled two-stroke single, carb, premix",
  "KTM's light 200 two-stroke enduro. Premix, a power valve on some years and a big following on tight trails.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, KDIRT2, [KTMF], lessons={"B": [PREMIX]}))

B77.append(mk("ktm-lc4-620-duke-620-1994", "KTM", "LC4 620 / Duke 620", "KTM LC4 620 / Duke 620", [1994, 1998],
  ["lc4 620", "duke 620", "620 duke", "620 egs", "620 sc", "620 rxc", "620 lc4", "duke i"], "dualsport", "chain",
  "609 cc liquid-cooled four-valve single, carb, kick or electric start",
  "KTM's 90s big single, as an enduro or the first Duke. A dry-sump engine with a kick start on many.",
  [["Big single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Starting", "Decompressor"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [KTMF]))

B77.append(mk("ktm-950-super-enduro-950-sm-990-smt-2006", "KTM", "950 Super Enduro / 950 SM / 990 SMT", "KTM 950 Super Enduro / 950 SM / 990 SMT", [2006, 2013],
  ["950 super enduro", "950 sm", "990 smt", "990 sm", "990 smr", "super enduro 950", "950 supermoto", "990 supermoto"], "dualsport", "chain",
  "942 or 999 cc liquid-cooled 75-degree V-twin, carbs then fuel injection",
  "KTM's LC8 off-road and supermoto twins. The 950s have carbs, the 990s have fuel injection.",
  [["LC8 twin", "Liquid-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  [], KTMNOTE, [ADVR]))

B77.append(mk("ktm-1190-rc8-2008", "KTM", "1190 RC8", "KTM 1190 RC8", [2008, 2015],
  ["1190 rc8", "rc8", "rc8r", "rc8 r", "1190 rc8 r", "rc 8"], "sport", "chain",
  "1148 or 1195 cc liquid-cooled 75-degree V-twin, fuel injected",
  "KTM's V-twin superbike. A trellis frame, adjustable ergonomics and an LC8 engine with a dry sump.",
  [["LC8 twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, KTMNOTE, [KTMF]))

B77.append(mk("ktm-390-smc-r-390-enduro-r-2025", "KTM", "390 SMC R / 390 Enduro R", "KTM 390 SMC R / 390 Enduro R", [2025, 2026],
  ["390 smc r", "390 enduro r", "390 enduro", "390 smc", "smc r 390", "enduro r 390"], "dualsport", "chain",
  "399 cc liquid-cooled single, fuel injected",
  "KTM's small supermoto and enduro on the new 390 platform. Fuel injected and light.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, KTMNOTE, [KTMF]))

HERO_NAME_B77 = {"ktm-125-sx-150-sx-250-sx-two-stroke-1990": "250 SX", "ktm-250-sx-f-350-sx-f-2005": "350 SX-F", "ktm-450-sx-f-2003": "450 SX-F",
  "ktm-85-sx-105-sx-2003": "85 SX", "ktm-450-530-exc-2004": "530 EXC", "ktm-200-exc-xc-w-1998": "200 EXC", "ktm-lc4-620-duke-620-1994": "LC4 620",
  "ktm-950-super-enduro-950-sm-990-smt-2006": "950 SE", "ktm-1190-rc8-2008": "RC8", "ktm-390-smc-r-390-enduro-r-2025": "390 SMC R"}
