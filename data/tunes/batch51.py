"""Batch 51 bike tunes (top 1000, rows 501-510)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch3 import VHT
from batch22 import VJMC
B51 = []
TWO = CARB + AIR + ["H-003"]
MOPED = dict(name="Moped Army", url="https://www.mopedarmy.com/", what="Owner community and wiki for mopeds and small two-strokes.")
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."
INJ = "It has oil injection, not premix. Keep the oil tank filled with two-stroke oil and check the pump line for cracks."

B51.append(mk("honda-cb125s-1971", "Honda", "CB125S", "Honda CB125S", [1971, 1985],
  ["cb125s", "cb125", "cb 125", "cb125s1", "cb125j", "cl125"], "standard", "chain",
  "122 cc air-cooled overhead-cam single, one carb, five-speed",
  "Honda's long-running small single. Simple and cheap to run, with points, a cam chain and one carb.",
  [["122 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Cam chain", "Adjust it"], ["Chain drive", "Slack and lube"]],
  [], OLD, [VJMC], lessons={"B": [POINTS]}))

B51.append(mk("honda-cb100-cl100-1970", "Honda", "CB100 / CL100", "Honda CB100 / CL100", [1970, 1973],
  ["cb100", "cl100", "cb 100", "cl 100", "cb100k", "cl100s"], "standard", "chain",
  "99 cc air-cooled overhead-cam single, one carb, five-speed",
  "Honda's 100 cc street and scrambler singles. Same engine, different pipes and bars.",
  [["99 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Cam chain", "Adjust it"], ["Six-volt", "Check charging"]],
  [], OLD, [VJMC], lessons={"B": [POINTS]}))

B51.append(mk("honda-cl72-cl77-scrambler-1962", "Honda", "CL72 / CL77 Scrambler", "Honda CL72 / CL77 Scrambler", [1962, 1967],
  ["cl72", "cl77", "cl 72", "cl 77", "scrambler 250", "scrambler 305", "cl77 scrambler"], "standard", "chain",
  "247 or 305 cc air-cooled overhead-cam twin, two carbs, four-speed",
  "The early Honda scramblers. High pipes, a tube frame and the same twin as the Hawks.",
  [["Twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Points", "Gap and time"], ["High pipes", "Check mounts"], ["Six-volt", "Check charging"]],
  [], OLD, [VHT], lessons={"B": [POINTS]}))

B51.append(mk("honda-s65-s90-1964", "Honda", "S65 / S90", "Honda S65 / S90", [1964, 1969],
  ["s90", "s65", "s 90", "s 65", "honda s90", "cl90", "cs90"], "standard", "chain",
  "63 or 89 cc air-cooled overhead-cam single, laid nearly flat, four-speed",
  "Honda's small sport singles of the 60s. A flat engine, a pressed-steel frame and six-volt electrics.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Frame", "Check rust"], ["Six-volt", "Check charging"]],
  [], OLD, [VJMC], lessons={"B": [POINTS]}))

B51.append(mk("honda-ca95-benly-150-1959", "Honda", "CA95 Benly 150", "Honda CA95 Benly 150", [1959, 1966],
  ["ca95", "ca 95", "benly 150", "benly touring", "ca95 benly", "c95"], "standard", "chain",
  "154 cc air-cooled overhead-cam twin, one carb, four-speed",
  "The small Dream. A pressed-steel frame, a leading-link fork and an enclosed chain.",
  [["Twin", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Leading link", "Check bushings"], ["Chain case", "Check inside"]],
  [], OLD, [VHT], lessons={"L": ["The leading-link fork pivots on bushings. Check for play and grease it before you trust the steering."]}))

B51.append(mk("honda-cb160-1964", "Honda", "CB160", "Honda CB160", [1964, 1969],
  ["cb160", "cb 160", "cl160", "sl160", "ss160", "cb160 sport"], "standard", "chain",
  "161 cc air-cooled overhead-cam twin, two carbs, four-speed",
  "Honda's little sport twin. Revs high, with two small carbs and points.",
  [["Twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Points", "Gap and time"], ["Cam chain", "Adjust it"], ["Chain drive", "Slack and lube"]],
  [], OLD, [VHT], lessons={"B": [POINTS]}))

B51.append(mk("honda-cb92-benly-super-sport-1959", "Honda", "CB92 Benly Super Sport", "Honda CB92 Benly Super Sport", [1959, 1965],
  ["cb92", "cb 92", "benly super sport", "benly ss", "cb92 benly", "c92"], "sport", "chain",
  "125 cc air-cooled overhead-cam twin, one carb, four-speed",
  "Honda's first sport bike. A pressed-steel frame, a leading-link fork and parts that are hard to find.",
  [["Twin", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Leading link", "Check bushings"], ["Parts", "Source early"]],
  [], OLD, [VHT], lessons={"L": ["The leading-link fork pivots on bushings. Check for play and grease it before you trust the steering."]}))

B51.append(mk("honda-c100-super-cub-50-1958", "Honda", "C100 Super Cub 50", "Honda C100 Super Cub", [1958, 1970],
  ["c100", "c102", "ca100", "ca102", "super cub 50", "c 100", "cub 50", "honda 50"], "standard", "chain",
  "49 cc air-cooled overhead-valve single, three-speed with an automatic clutch",
  "The first Super Cub. No clutch lever, a pressed-steel frame and a step-through layout.",
  [["49 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Auto clutch", "Adjust it"], ["Points", "Gap and time"], ["Chain case", "Check inside"]],
  [], OLD, [VJMC], lessons={"B": [POINTS]}))

B51.append(mk("honda-express-na50-1977", "Honda", "Express NA50", "Honda Express NA50 / NC50", [1977, 1983],
  ["express", "na50", "nc50", "express ii", "honda express", "na 50", "nc 50", "urban express"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, oil injection, automatic",
  "Honda's step-through moped of the late 70s. Two-stroke with oil injection and a one-speed automatic.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Auto clutch", "Inspect"], ["Exhaust", "Check carbon"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [INJ]}))

B51.append(mk("honda-hobbit-pa50-1978", "Honda", "Hobbit PA50", "Honda Hobbit PA50", [1978, 1983],
  ["hobbit", "pa50", "pa50ii", "pa 50", "honda hobbit", "camino"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, oil injection, automatic, pedals",
  "Honda's pedal moped. Two-stroke with oil injection, a variator and pedals to start it.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Variator", "Inspect"], ["Pedal chain", "Lube it"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [INJ]}))

HERO_NAME_B51 = {"honda-cb125s-1971": "CB125S", "honda-cb100-cl100-1970": "CB100", "honda-cl72-cl77-scrambler-1962": "CL77",
  "honda-s65-s90-1964": "S90", "honda-ca95-benly-150-1959": "BENLY", "honda-cb160-1964": "CB160", "honda-cb92-benly-super-sport-1959": "CB92",
  "honda-c100-super-cub-50-1958": "SUPER CUB", "honda-express-na50-1977": "EXPRESS", "honda-hobbit-pa50-1978": "HOBBIT"}
