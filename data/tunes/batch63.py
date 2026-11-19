"""Batch 63 bike tunes (top 1000, rows 621-630)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch34 import KAWF
from batch55 import TT, PREMIX
from batch62 import KDIRT
B63 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B63.append(mk("kawasaki-kx80-kx85-kx100-kx112-1979", "Kawasaki", "KX80 / KX85 / KX100 / KX112", "Kawasaki KX80 / KX85 / KX100 / KX112", [1979, 2026],
  ["kx80", "kx85", "kx100", "kx112", "kx 85", "kx 80", "kx 100", "kx 112"], "dualsport", "chain",
  "80 to 112 cc liquid-cooled two-stroke single, carb, premix",
  "Kawasaki's mini and supermini motocross two-strokes. Premix and a top end that needs regular rebuilds.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, KDIRT, [TT], lessons={"B": [PREMIX]}))

B63.append(mk("kawasaki-kx65-kx60-1985", "Kawasaki", "KX65 / KX60", "Kawasaki KX65 / KX60", [1985, 2026],
  ["kx65", "kx60", "kx 65", "kx 60"], "dualsport", "chain",
  "60 or 65 cc liquid-cooled two-stroke single, carb, premix",
  "Kawasaki's small kids' motocross two-strokes. Premix, a six-speed box and parts that wear fast.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, KDIRT, [TT], lessons={"B": [PREMIX]}))

B63.append(mk("kawasaki-kx250f-2004", "Kawasaki", "KX250F", "Kawasaki KX250F", [2004, 2026],
  ["kx250f", "kx 250f", "kx250x", "kx250 four stroke"], "dualsport", "chain",
  "249 cc liquid-cooled four-stroke single, carb then fuel injection",
  "Kawasaki's 250 motocross four-stroke. High revving, with valve checks measured in hours.",
  [["Race single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], KDIRT, [TT]))

B63.append(mk("kawasaki-kx450f-2006", "Kawasaki", "KX450F", "Kawasaki KX450F", [2006, 2026],
  ["kx450f", "kx 450f", "kx450", "kx 450", "kx450x"], "dualsport", "chain",
  "449 cc liquid-cooled four-stroke single, carb then fuel injection",
  "Kawasaki's open-class motocross bike. Later ones have electric start and a hydraulic clutch.",
  [["Race single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], KDIRT, [TT]))

B63.append(mk("kawasaki-kx500-1983", "Kawasaki", "KX500", "Kawasaki KX500", [1983, 2004],
  ["kx500", "kx 500"], "dualsport", "chain",
  "499 cc liquid-cooled two-stroke single, carb, premix",
  "Kawasaki's big open-class two-stroke. Lots of power, premix and a long production run.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, KDIRT, [TT], lessons={"B": [PREMIX]}))

B63.append(mk("kawasaki-klx300r-1996", "Kawasaki", "KLX300R", "Kawasaki KLX300R", [1996, 2007],
  ["klx300r", "klx 300r", "klx300 1996", "klx300r enduro"], "dualsport", "chain",
  "292 cc liquid-cooled four-valve single, carb, kick start",
  "Kawasaki's off-road 300 four-stroke. Kick start only, liquid cooled and easy to keep running.",
  [["Single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Valves", "Shim check"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  CARB, KDIRT, [TT]))

B63.append(mk("kawasaki-klx400-2003", "Kawasaki", "KLX400", "Kawasaki KLX400", [2003, 2004],
  ["klx400", "klx 400", "klx400sr", "klx400r"], "dualsport", "chain",
  "398 cc liquid-cooled four-valve single, carb",
  "Kawasaki's version of the Suzuki DR-Z400, built by Suzuki. Most DR-Z parts fit.",
  [["Single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Valves", "Shim check"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [TT]))

B63.append(mk("kawasaki-klx140-2008", "Kawasaki", "KLX140", "Kawasaki KLX140", [2008, 2026],
  ["klx140", "klx 140", "klx140l", "klx140g", "klx140r"], "dualsport", "chain",
  "144 cc air-cooled four-stroke single, electric start",
  "Kawasaki's teen and small-adult trail bike. Electric start, a simple air-cooled single and a manual clutch.",
  [["Single", "Air-cooled"], ["Fuel", "Check system"], ["Valves", "Check them"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  [], KDIRT, [TT]))

B63.append(mk("kawasaki-klx230-2020", "Kawasaki", "KLX230", "Kawasaki KLX230", [2020, 2026],
  ["klx230", "klx 230", "klx230r", "klx230s", "klx230sm", "klx230 s"], "dualsport", "chain",
  "233 cc air-cooled single, fuel injected",
  "Kawasaki's small dual-sport. Fuel injected and air cooled, with road-legal and off-road versions.",
  [["Single", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [KAWF]))

B63.append(mk("kawasaki-klx450r-2008", "Kawasaki", "KLX450R", "Kawasaki KLX450R", [2008, 2021],
  ["klx450r", "klx 450r", "klx450", "klx 450"], "dualsport", "chain",
  "449 cc liquid-cooled four-stroke single, electric start",
  "Kawasaki's off-road 450 enduro, built from the KX450F. Electric start and wider gearing.",
  [["Single", "Liquid-cooled"], ["Fuel", "Check system"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  [], KDIRT, [TT]))

HERO_NAME_B63 = {"kawasaki-kx80-kx85-kx100-kx112-1979": "KX85", "kawasaki-kx65-kx60-1985": "KX65", "kawasaki-kx250f-2004": "KX250F",
  "kawasaki-kx450f-2006": "KX450F", "kawasaki-kx500-1983": "KX500", "kawasaki-klx300r-1996": "KLX300R", "kawasaki-klx400-2003": "KLX400",
  "kawasaki-klx140-2008": "KLX140", "kawasaki-klx230-2020": "KLX230", "kawasaki-klx450r-2008": "KLX450R"}
