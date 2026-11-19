"""Batch 93 bike tunes (top 1000, rows 921-930)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch22 import VJMC
from batch18 import GSR
from batch67 import SUZF, CCI
from batch66 import SDIRT
from batch55 import TT, PREMIX
B93 = []
TWO = CARB + AIR + ["H-003"]
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."

B93.append(mk("suzuki-gr650-tempter-1983", "Suzuki", "GR650 Tempter", "Suzuki GR650 Tempter", [1983, 1983],
  ["gr650", "tempter", "gr 650", "gr650 tempter", "gr650x"], "standard", "chain",
  "651 cc air-cooled DOHC parallel twin, two carbs, two-mass flywheel",
  "Suzuki's one-year 650 twin for the US. A dual-mass flywheel and two carbs, with some parts hard to find.",
  [["DOHC twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Parts", "Source early"]],
  CARB, OLD, [GSR]))

B93.append(mk("suzuki-gsx1100g-1991", "Suzuki", "GSX1100G", "Suzuki GSX1100G", [1991, 1993],
  ["gsx1100g", "gsx 1100g", "gsx1100 g", "gsx1100gk"], "standard", "shaft",
  "1127 cc air/oil-cooled DOHC inline four, four carbs, shaft drive",
  "Suzuki's early-90s shaft-drive standard. The oil-cooled GSX-R family engine in a comfortable bike.",
  [["Inline four", "Air/oil-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [GSR]))

B93.append(mk("suzuki-vx800-1990", "Suzuki", "VX800", "Suzuki VX800", [1990, 1993],
  ["vx800", "vx 800", "vx800l", "vx800 suzuki"], "standard", "shaft",
  "805 cc liquid-cooled 45-degree V-twin, two carbs, shaft drive",
  "Suzuki's V-twin standard of the early 90s. The Intruder engine in a sporty frame with shaft drive.",
  [["V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Cooling", "Coolant and hoses"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [SUZF]))

B93.append(mk("suzuki-dr100-dr125-sp125-1982", "Suzuki", "DR100 / DR125 / SP125", "Suzuki DR100 / DR125 / SP125", [1982, 1985],
  ["dr100", "dr125", "sp125", "dr 125", "dr 100", "sp 125", "dr125s"], "dualsport", "chain",
  "98 or 124 cc air-cooled overhead-cam single, carb",
  "Suzuki's small four-stroke trail bikes of the early 80s. Simple and easy to keep running.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Cam chain", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TT]))

B93.append(mk("suzuki-jr50-jr80-1978", "Suzuki", "JR50 / JR80", "Suzuki JR50 / JR80", [1978, 2006],
  ["jr50", "jr80", "jr 50", "jr 80", "suzuki jr50"], "dualsport", "chain",
  "49 or 79 cc air-cooled two-stroke single, CCI oil injection on the JR50",
  "Suzuki's kids' dirt bikes. The JR50 has an automatic box and oil injection; the JR80 has a clutch.",
  [["Two-stroke", "Check oiling"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Exhaust", "Check carbon"], ["Chain drive", "Slack and lube"]],
  TWO, SDIRT, [TT], lessons={"B": [CCI]}))

B93.append(mk("suzuki-a100-1966", "Suzuki", "A100", "Suzuki A100", [1966, 1977],
  ["a100", "a 100", "suzuki a100", "as100", "ac100", "a50", "a70"], "standard", "chain",
  "98 cc air-cooled rotary-valve two-stroke single, oil injection",
  "Suzuki's long-running small commuter. A rotary-valve two-stroke with oil injection and points.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Oil pump", "Check lines"], ["Points", "Gap and time"], ["Chain case", "Check inside"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI, POINTS]}))

B93.append(mk("suzuki-ts50-ts75-ts90-1970", "Suzuki", "TS50 / TS75 / TS90", "Suzuki TS50 / TS75 / TS90", [1970, 1977],
  ["ts50", "ts75", "ts90", "ts 90", "honcho", "ts90 honcho", "ts 75", "gaucho"], "dualsport", "chain",
  "49 to 89 cc air-cooled two-stroke single, CCI oil injection",
  "Suzuki's small trail two-strokes. CCI oil injection, points and simple running gear.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["CCI pump", "Check it"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI, POINTS]}))

B93.append(mk("suzuki-t200-invader-1967", "Suzuki", "T200 Invader", "Suzuki T200 Invader", [1967, 1969],
  ["t200", "invader", "t 200", "t200 invader", "x5", "x-5"], "standard", "chain",
  "196 cc air-cooled two-stroke twin, Posi-Force oil injection",
  "Suzuki's small two-stroke twin of the late 60s. Oil injection, two carbs and points.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["Oil pump", "Check lines"], ["Points", "Gap and time"], ["Parts", "Source early"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI, POINTS]}))

B93.append(mk("suzuki-t125-stinger-1969", "Suzuki", "T125 Stinger", "Suzuki T125 Stinger", [1969, 1972],
  ["t125", "stinger", "t125 stinger", "t 125"], "standard", "chain",
  "124 cc air-cooled two-stroke twin, cylinders nearly horizontal, oil injection",
  "Suzuki's little twin with almost flat cylinders. Oil injection, two carbs and parts that are hard to find.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["Oil pump", "Check lines"], ["Points", "Gap and time"], ["Parts", "Source early"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI, POINTS]}))

B93.append(mk("suzuki-dr-z50-2010", "Suzuki", "DR-Z50", "Suzuki DR-Z50", [2010, 2026],
  ["dr-z50", "drz50", "drz 50", "dr-z 50"], "dualsport", "chain",
  "49 cc air-cooled four-stroke single, carb, three-speed automatic",
  "Suzuki's smallest kids' bike. A four-stroke with an automatic three-speed and electric start.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Auto clutch", "Adjust it"], ["Air filter", "Clean it"], ["Chain drive", "Slack and lube"]],
  CARB, SDIRT, [TT]))

HERO_NAME_B93 = {"suzuki-gr650-tempter-1983": "GR650", "suzuki-gsx1100g-1991": "GSX1100G", "suzuki-vx800-1990": "VX800", "suzuki-dr100-dr125-sp125-1982": "DR125",
  "suzuki-jr50-jr80-1978": "JR50", "suzuki-a100-1966": "A100", "suzuki-ts50-ts75-ts90-1970": "TS90", "suzuki-t200-invader-1967": "INVADER",
  "suzuki-t125-stinger-1969": "STINGER", "suzuki-dr-z50-2010": "DR-Z50"}
