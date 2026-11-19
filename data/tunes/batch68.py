"""Batch 68 bike tunes (top 1000, rows 671-680)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch38 import SCOOT
from batch22 import VJMC
from batch67 import SUZF, CCI
B68 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
SIMPNOTE = "Most of these were sold new outside the US, so the NHTSA search may not cover them. Ask a Suzuki dealer to check the frame number."
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."

B68.append(mk("suzuki-x6-hustler-t250-t350-1966", "Suzuki", "X6 Hustler / T250 / T350", "Suzuki X6 Hustler / T250 / T350", [1966, 1972],
  ["x6", "x-6", "hustler", "x6 hustler", "t250", "t350", "t20", "t 250", "t 350"], "standard", "chain",
  "247 or 315 cc air-cooled two-stroke twin, two carbs, Posi-Force oil injection, six-speed",
  "Suzuki's fast 60s two-stroke twins. Oil injection, a six-speed box and points ignition.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["Oil pump", "Check lines"], ["Points", "Gap and time"], ["Parts", "Source early"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI, POINTS]}))

B68.append(mk("suzuki-tc100-tc120-trail-cat-1967", "Suzuki", "TC100 / TC120 Trail Cat", "Suzuki TC100 / TC120 Trail Cat", [1967, 1977],
  ["tc100", "tc120", "trail cat", "tc 120", "tc 100", "tc185", "tc90"], "dualsport", "chain",
  "97 to 183 cc air-cooled two-stroke single, oil injection, dual-range gearbox",
  "Suzuki's small trail bikes with a high and low range. Oil injection, points and a simple frame.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Dual range", "Check lever"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI, POINTS]}))

B68.append(mk("suzuki-rv90-rv125-vanvan-1972", "Suzuki", "RV90 / RV125 VanVan", "Suzuki RV90 / RV125 VanVan", [1972, 1977],
  ["rv90", "rv125", "rv 125", "rv 90", "vanvan 125", "rv75", "vanvan 90"], "dualsport", "chain",
  "79 to 123 cc air-cooled two-stroke single, oil injection, balloon tires",
  "The original fat-tire VanVan. A two-stroke with oil injection and very wide, soft tires.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Oil pump", "Check lines"], ["Tires", "Hard to find"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI]}))

B68.append(mk("suzuki-re5-rotary-1975", "Suzuki", "RE5 Rotary", "Suzuki RE5 Rotary", [1975, 1976],
  ["re5", "re-5", "re5m", "re5a", "suzuki rotary", "re 5"], "standard", "chain",
  "497 cc liquid-cooled single-rotor Wankel engine, two-stage carb, oil injection for the rotor",
  "Suzuki's rotary bike. A Wankel engine with its own oiling, cooling and ignition quirks. Go slow and find a specialist.",
  [["Rotary engine", "Liquid-cooled"], ["Carb", "Two-stage"], ["Rotor oiling", "Check pump"], ["Ignition", "Two plugs"], ["Parts", "Source early"]],
  CARB, OLD, [VJMC], lessons={"B": ["The rotor seals get their oil from a pump fed by a separate tank. Check that system works before you run the engine."]}))

B68.append(mk("suzuki-intruder-vs700-vs750-1985", "Suzuki", "Intruder VS700 / VS750", "Suzuki Intruder VS700 / VS750", [1985, 1991],
  ["vs700", "vs750", "intruder 700", "intruder 750", "vs750glp", "vs700glp", "vs 750"], "cruiser", "shaft",
  "694 or 747 cc liquid-cooled 45-degree V-twin, two carbs, shaft drive",
  "The first Suzuki Intruders. A liquid-cooled V-twin, shaft drive and the classic chopper look.",
  [["V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Cooling", "Coolant and hoses"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [SUZF]))

B68.append(mk("suzuki-marauder-vz800-1997", "Suzuki", "Marauder VZ800", "Suzuki Marauder VZ800", [1997, 2004],
  ["vz800", "marauder 800", "marauder vz800", "vz 800", "marauder"], "cruiser", "chain",
  "805 cc liquid-cooled V-twin, two carbs",
  "Suzuki's low drag-style cruiser before it became the Boulevard M50. Two carbs and a chain final drive.",
  [["V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Cooling", "Coolant and hoses"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [SUZF]))

B68.append(mk("suzuki-boulevard-c109r-2008", "Suzuki", "Boulevard C109R", "Suzuki Boulevard C109R", [2008, 2011],
  ["c109r", "c109", "boulevard c109r", "vlr1800", "c109rt", "c109r touring"], "cruiser", "shaft",
  "1783 cc liquid-cooled V-twin, fuel injected, shaft drive",
  "Suzuki's big classic-style cruiser. The M109R engine in a full-fender bike with shaft drive.",
  [["Big V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Coolant and fan"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [SUZF]))

B68.append(mk("suzuki-boulevard-s50-2005", "Suzuki", "Boulevard S50", "Suzuki Boulevard S50", [2005, 2009],
  ["s50", "boulevard s50", "vs800 s50", "s 50"], "cruiser", "shaft",
  "805 cc liquid-cooled V-twin, two carbs, shaft drive",
  "The Intruder 800 renamed. A simple V-twin, two carbs and shaft drive.",
  [["V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Cooling", "Coolant and hoses"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, GENNOTE, [SUZF]))

B68.append(mk("suzuki-address-110-2016", "Suzuki", "Address 110", "Suzuki Address 110", [2016, 2020],
  ["address 110", "address", "uk110", "uk 110", "suzuki address"], "scooter", "belt",
  "113 cc air-cooled single, fuel injected, CVT",
  "Suzuki's small commuter scooter. Fuel injected, light and cheap to run.",
  [["Single", "Air-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Brakes", "Check them"]],
  EFI, GENNOTE, [SCOOT]))

B68.append(mk("suzuki-rgv250-1988", "Suzuki", "RGV250", "Suzuki RGV250 Gamma", [1988, 1996],
  ["rgv250", "rgv 250", "rgv250 gamma", "vj22", "vj21", "vj23", "rgv"], "sport", "chain",
  "249 cc liquid-cooled two-stroke V-twin, two carbs, oil injection, power valves",
  "Suzuki's two-stroke V-twin sport bike, mostly sold outside the US. Power valves, oil injection and race-bred parts.",
  [["Two-stroke", "Oil injection"], ["Two carbs", "Clean and sync"], ["Power valves", "Clean them"], ["Cooling", "Coolant and hoses"], ["Parts", "Source early"]],
  TWO, SIMPNOTE, [SUZF], lessons={"B": [CCI]}))

HERO_NAME_B68 = {"suzuki-x6-hustler-t250-t350-1966": "HUSTLER", "suzuki-tc100-tc120-trail-cat-1967": "TRAIL CAT", "suzuki-rv90-rv125-vanvan-1972": "VANVAN",
  "suzuki-re5-rotary-1975": "RE5", "suzuki-intruder-vs700-vs750-1985": "INTRUDER", "suzuki-marauder-vz800-1997": "MARAUDER",
  "suzuki-boulevard-c109r-2008": "C109R", "suzuki-boulevard-s50-2005": "S50", "suzuki-address-110-2016": "ADDRESS", "suzuki-rgv250-1988": "RGV250"}
