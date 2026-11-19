"""Batch 64 bike tunes (top 1000, rows 631-640)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch34 import KAWF
from batch14 import KZR
from batch22 import VJMC
from batch51 import INJ
B64 = []
TWO = CARB + AIR + ["H-003"]
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."
SLUBE = "It has Kawasaki's Superlube oil injection, not premix. Keep the oil tank filled with two-stroke oil and check the pump cable and lines."

B64.append(mk("kawasaki-klr600-1984", "Kawasaki", "KLR600", "Kawasaki KLR600", [1984, 1986],
  ["klr600", "klr 600", "kl600", "klr600e", "klr600 b1"], "dualsport", "chain",
  "564 cc liquid-cooled four-valve single, carb, kick or electric start",
  "The KLR before the 650. Liquid cooled, with a balancer and an electric start on the later E model.",
  [["Big single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Balancer", "Check chain"], ["Starting", "Decompressor"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [KAWF]))

B64.append(mk("kawasaki-ke100-ke125-ke175-1976", "Kawasaki", "KE100 / KE125 / KE175", "Kawasaki KE100 / KE125 / KE175", [1976, 2001],
  ["ke100", "ke125", "ke175", "ke 100", "ke 125", "ke 175", "kd125"], "dualsport", "chain",
  "99 to 174 cc air-cooled two-stroke single, Superlube oil injection",
  "Kawasaki's small trail two-strokes. Oil injection, a simple frame and a very long production run on the KE100.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Oil pump", "Check lines"], ["Ignition", "Check spark"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [KZR], lessons={"B": [SLUBE]}))

B64.append(mk("kawasaki-f7-175-f8-250-bison-1971", "Kawasaki", "F7 175 / F8 250 Bison", "Kawasaki F7 / F8 Bison", [1971, 1975],
  ["f7", "f8", "bison", "f7 175", "f8 250", "f8 bison", "f5 bighorn", "bighorn", "f9"], "dualsport", "chain",
  "174 to 346 cc air-cooled two-stroke single, Superlube oil injection, points",
  "Kawasaki's early-70s enduros. Two-strokes with oil injection, points and rotary valves on some models.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Oil pump", "Check lines"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [KZR], lessons={"B": [SLUBE, POINTS]}))

B64.append(mk("kawasaki-g3-g4-g5-90-100-trail-1969", "Kawasaki", "G3 / G4 / G5 90-100 trail", "Kawasaki G3 / G4 / G5 trail", [1969, 1975],
  ["g3", "g4", "g5", "g3ss", "g3tr", "g4tr", "g31m", "kawasaki 90"], "dualsport", "chain",
  "89 or 99 cc air-cooled rotary-valve two-stroke single, Superlube oil injection",
  "Kawasaki's small rotary-valve trail bikes. A dual-range box on some, oil injection and points.",
  [["Two-stroke", "Oil injection"], ["Rotary valve", "Check cover"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Six-volt", "Check charging"]],
  TWO, OLD, [KZR], lessons={"B": [SLUBE, POINTS]}))

B64.append(mk("kawasaki-a1-samurai-a7-avenger-1966", "Kawasaki", "A1 Samurai / A7 Avenger", "Kawasaki A1 Samurai / A7 Avenger", [1966, 1971],
  ["a1", "a7", "samurai", "avenger", "a1 samurai", "a7 avenger", "a1ss", "a7ss"], "standard", "chain",
  "247 or 338 cc air-cooled rotary-valve two-stroke twin, two carbs, Superlube oil injection",
  "Kawasaki's rotary-valve twins from the 60s. Carbs on the sides of the engine, oil injection and points.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["Rotary valves", "Check covers"], ["Points", "Gap and time"], ["Parts", "Source early"]],
  TWO, OLD, [VJMC], lessons={"B": [SLUBE, POINTS]}))

B64.append(mk("kawasaki-w1-w2-650-1966", "Kawasaki", "W1 / W2 650", "Kawasaki W1 / W2 650", [1966, 1971],
  ["w1", "w2", "w1ss", "w2ss", "w2tt", "w1 650", "w2 650", "w1sa"], "standard", "chain",
  "624 cc air-cooled OHV parallel twin, one or two carbs, points",
  "Kawasaki's British-style 650 twin, grown from the Meguro. Pushrods, points and a lot of vibration.",
  [["OHV twin", "Air-cooled"], ["Carbs", "Clean and sync"], ["Points", "Gap and time"], ["Pushrods", "Set valves"], ["Parts", "Source early"]],
  CARB, OLD, [VJMC], lessons={"B": [POINTS]}))

B64.append(mk("kawasaki-kz1100-spectre-1981", "Kawasaki", "KZ1100 / Spectre", "Kawasaki KZ1100 / Spectre", [1981, 1983],
  ["kz1100", "kz 1100", "spectre", "kz1100 spectre", "kz1100a", "kz1100d", "kz1100 ltd", "z1100"], "standard", "shaft",
  "1089 cc air-cooled DOHC inline four, four carbs, shaft drive",
  "Kawasaki's big shaft-drive four of the early 80s. Four carbs, a strong engine and a shaft to service.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [KZR]))

B64.append(mk("kawasaki-kz305-gpz305-1981", "Kawasaki", "KZ305 / GPz305", "Kawasaki KZ305 / GPz305", [1981, 1988],
  ["kz305", "kz 305", "gpz305", "csr305", "ex305", "kz305 ltd", "gpz 305"], "standard", "chain",
  "306 cc air-cooled SOHC parallel twin, two carbs",
  "Kawasaki's small twin of the 80s. Some years used a toothed belt instead of a chain.",
  [["Twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Check them"], ["Charging", "Check R/R"], ["Final drive", "Chain or belt"]],
  CARB, OLD, [KZR], lessons={"K": ["Check whether yours has a chain or a belt final drive. A belt needs the right tension and no oil on it."]}))

B64.append(mk("kawasaki-kz750-twin-kz750b-1976", "Kawasaki", "KZ750 twin (KZ750B)", "Kawasaki KZ750 twin", [1976, 1979],
  ["kz750b", "kz750 twin", "kz 750 twin", "z750 twin", "kz750", "kz 750"], "standard", "chain",
  "745 cc air-cooled DOHC parallel twin, two carbs, balancer",
  "Kawasaki's big 70s twin. Two carbs, a gear-driven balancer and a simple chassis.",
  [["DOHC twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Shim check"], ["Balancer", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [KZR]))

B64.append(mk("kawasaki-eliminator-600-900-zl-1985", "Kawasaki", "Eliminator 600 / 900 (ZL)", "Kawasaki Eliminator 600 / 900 (ZL)", [1985, 1997],
  ["zl600", "zl900", "zl1000", "eliminator 600", "eliminator 900", "eliminator 1000", "zl 600", "zl 900"], "cruiser", "shaft",
  "592 to 997 cc liquid-cooled inline four, four carbs, shaft drive",
  "Kawasaki's dragster-styled fours. A sport engine in a cruiser frame, with shaft drive.",
  [["Inline four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Cooling", "Coolant and fan"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [KAWF]))

HERO_NAME_B64 = {"kawasaki-klr600-1984": "KLR600", "kawasaki-ke100-ke125-ke175-1976": "KE100", "kawasaki-f7-175-f8-250-bison-1971": "BISON",
  "kawasaki-g3-g4-g5-90-100-trail-1969": "G4", "kawasaki-a1-samurai-a7-avenger-1966": "SAMURAI", "kawasaki-w1-w2-650-1966": "W1",
  "kawasaki-kz1100-spectre-1981": "KZ1100", "kawasaki-kz305-gpz305-1981": "KZ305", "kawasaki-kz750-twin-kz750b-1976": "KZ750",
  "kawasaki-eliminator-600-900-zl-1985": "ELIMINATOR"}
