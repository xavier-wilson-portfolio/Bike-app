"""Batch 89 bike tunes (top 1000, rows 881-890)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch19 import AMCA
from batch22 import VJMC
from batch51 import MOPED
from batch55 import TT, PREMIX
from batch81 import EURO
B89 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
MOPEDB = "Moped two-strokes run premix. Mix the oil into the fuel at the ratio in the manual, usually around 50 to 1 with modern oil."

B89.append(mk("whizzer-whizzer-motorbike-h-j-300-1939", "Whizzer", "Whizzer motorbike (H, J, 300)", "Whizzer motorbike", [1939, 1965],
  ["whizzer", "whizzer h", "whizzer j", "whizzer 300", "pacemaker whizzer", "sportsman", "whizzer motorbike"], "standard", "belt",
  "138 to 199 cc air-cooled four-stroke single, side-valve, belt drive, bicycle frame",
  "The bicycle engine kit that became a motorbike. A small flathead, a belt drive and bicycle-style brakes.",
  [["Flathead single", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Belt", "Check tension"], ["Brakes", "Bicycle type"]],
  CARB, OLD, [AMCA]))

B89.append(mk("allstate-allstate-puch-175-250-1951", "Allstate", "Allstate (Puch) 175 / 250", "Allstate (Puch) 175 / 250", [1951, 1970],
  ["allstate", "allstate 250", "allstate 175", "puch 250", "sears allstate", "twingle", "sgs 250"], "standard", "chain",
  "125 to 248 cc air-cooled split-single two-stroke, premix",
  "The Puch bikes sold by Sears. Many have the split-single 'twingle' engine with two pistons and one combustion chamber.",
  [["Split single", "Premix"], ["Carb", "Clean it out"], ["Top end", "Two pistons"], ["Ignition", "Check it"], ["Chain case", "Check inside"]],
  TWO, OLD, [VJMC], lessons={"B": [PREMIX]}))

B89.append(mk("puch-maxi-newport-moped-1977", "Puch", "Maxi / Newport moped", "Puch Maxi / Newport", [1977, 1990],
  ["maxi", "puch maxi", "newport", "maxi s", "maxi luxe", "magnum", "puch newport", "e50"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, E50 engine, premix, pedals",
  "The classic Austrian moped. The E50 engine, premix and a huge tuning and parts scene.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Clutch", "Check pads"], ["Pedals", "Lube chain"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [MOPEDB]}))

B89.append(mk("tomos-a3-a35-moped-1977", "Tomos", "A3 / A35 moped", "Tomos A3 / A35", [1977, 2014],
  ["tomos", "a3", "a35", "a55", "targa", "sprint", "lx", "streetmate", "bullet", "revival"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, premix, pedals",
  "The Slovenian mopeds. Simple two-strokes, premix and a large online owner community.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Clutch", "Check it"], ["Pedals", "Lube chain"], ["Brakes", "Drums"]],
  TWO, GENNOTE, [MOPED], lessons={"B": [MOPEDB]}))

B89.append(mk("motobecane-mobylette-50v-moped-1960", "Motobecane", "Mobylette / 50V moped", "Motobecane Mobylette / 50V", [1960, 1990],
  ["mobylette", "50v", "motobecane", "moby", "40v", "av88", "mobylette 50v", "motobecane 50v"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, variator, premix, pedals",
  "The French mopeds. A belt variator, premix and a pressed-steel or tube frame depending on model.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Variator", "Inspect"], ["Pedals", "Lube chain"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [MOPEDB]}))

B89.append(mk("peugeot-103-moped-1971", "Peugeot", "103 moped", "Peugeot 103", [1971, 1990],
  ["103", "peugeot 103", "103 sp", "103 vogue", "102", "104", "105", "103 mvl"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, premix, variator on some",
  "Peugeot's long-running moped. Simple two-stroke, premix and a lot of tuning parts in Europe.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Variator", "Inspect"], ["Pedals", "Lube chain"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [MOPEDB]}))

B89.append(mk("batavus-va-hs50-moped-1976", "Batavus", "VA / HS50 moped", "Batavus VA / HS50", [1976, 1985],
  ["batavus", "va", "hs50", "regency", "starflite", "batavus va", "laura"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, Laura engine, premix, pedals",
  "The Dutch mopeds with the Laura engine. Simple two-strokes, premix and a pedal start.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Clutch", "Check it"], ["Pedals", "Lube chain"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [MOPEDB]}))

B89.append(mk("rokon-trail-breaker-1960", "Rokon", "Trail-Breaker", "Rokon Trail-Breaker", [1960, 2026],
  ["trail-breaker", "trailbreaker", "rokon", "ranger", "scout", "rokon trailbreaker", "rokon ranger"], "dualsport", "chain",
  "Small air-cooled single, two- or four-stroke depending on year, two-wheel drive, automatic",
  "The two-wheel-drive trail machine. Hollow wheels that hold fuel or water, an automatic drive and chains to both wheels.",
  [["Engine", "Check type"], ["Carb", "Clean it out"], ["Drive", "Check clutch"], ["2WD chains", "Slack and lube"], ["Wheels", "Check seals"]],
  CARB, GENNOTE, [TT]))

B89.append(mk("bridgestone-350-gtr-175-hurricane-1966", "Bridgestone", "350 GTR / 175 Hurricane", "Bridgestone 350 GTR / 175 Hurricane", [1966, 1971],
  ["350 gtr", "gtr", "hurricane", "bridgestone 350", "bridgestone 175", "350 gto", "dual twin", "bridgestone"], "standard", "chain",
  "177 or 345 cc air-cooled rotary-valve two-stroke twin, oil injection",
  "Bridgestone's high-quality two-stroke twins. Rotary valves, oil injection and parts that are now very hard to find.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["Rotary valves", "Check covers"], ["Ignition", "Check it"], ["Parts", "Source early"]],
  TWO, OLD, [VJMC], lessons={"B": ["It has oil injection, not premix. Keep the oil tank filled and check the pump before you start it."]}))

B89.append(mk("mz-etz-250-ts-250-1973", "MZ", "ETZ 250 / TS 250", "MZ ETZ 250 / TS 250", [1973, 1990],
  ["etz 250", "ts 250", "etz251", "etz 251", "ts250", "etz250", "mz 250", "etz 150", "ts 150"], "standard", "chain",
  "143 or 243 cc air-cooled two-stroke single, premix or oil injection, enclosed chain",
  "The East German MZ two-strokes. Simple, tough, with fully enclosed chains and oil injection on some ETZs.",
  [["Two-stroke", "Check oiling"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Chain cases", "Check rubber"], ["Parts", "Check supply"]],
  TWO, OLD, [EURO], lessons={"B": ["Some ETZs have oil injection and others run premix. Check yours before you fill it."]}))

HERO_NAME_B89 = {"whizzer-whizzer-motorbike-h-j-300-1939": "WHIZZER", "allstate-allstate-puch-175-250-1951": "ALLSTATE", "puch-maxi-newport-moped-1977": "MAXI",
  "tomos-a3-a35-moped-1977": "TOMOS", "motobecane-mobylette-50v-moped-1960": "MOBYLETTE", "peugeot-103-moped-1971": "PEUGEOT 103",
  "batavus-va-hs50-moped-1976": "BATAVUS", "rokon-trail-breaker-1960": "ROKON", "bridgestone-350-gtr-175-hurricane-1966": "BRIDGESTONE",
  "mz-etz-250-ts-250-1973": "MZ"}
