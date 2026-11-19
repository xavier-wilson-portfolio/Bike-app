"""Batch 59 bike tunes (top 1000, rows 581-590)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch15 import YE, XT
from batch51 import INJ
from batch55 import TT, PREMIX
from batch58 import YDIRT
B59 = []
TWO = CARB + AIR + ["H-003"]

B59.append(mk("yamaha-yz465-yz490-1980", "Yamaha", "YZ465 / YZ490", "Yamaha YZ465 / YZ490", [1980, 1990],
  ["yz465", "yz490", "yz 465", "yz 490", "it465", "it490"], "dualsport", "chain",
  "465 or 487 cc two-stroke single, air- then liquid-cooled, carb, premix",
  "Yamaha's open-class two-strokes of the 80s. Big power, premix and a hard kick.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Suspension", "Rebuild it"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [YE], lessons={"B": [PREMIX]}))

B59.append(mk("yamaha-it175-it250-1977", "Yamaha", "IT175 / IT250", "Yamaha IT175 / IT250", [1977, 1983],
  ["it175", "it250", "it 175", "it 250", "it200", "it125", "it400", "it 200"], "dualsport", "chain",
  "123 to 397 cc air-cooled two-stroke single, carb, premix",
  "Yamaha's enduro two-strokes. Premix, a monoshock rear and lights for the trail.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Monoshock", "Check it"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [YE], lessons={"B": [PREMIX]}))

B59.append(mk("yamaha-tt600-1983", "Yamaha", "TT600", "Yamaha TT600", [1983, 1990],
  ["tt600", "tt 600", "tt600n", "tt600s"], "dualsport", "chain",
  "595 cc air-cooled four-valve single, carb, kick start",
  "Yamaha's big off-road four-stroke of the 80s. Kick start, a decompressor and the XT600 family engine.",
  [["Big single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Starting", "Decompressor"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XT]))

B59.append(mk("yamaha-tt-r250-1999", "Yamaha", "TT-R250", "Yamaha TT-R250", [1999, 2006],
  ["tt-r250", "ttr250", "ttr 250", "tt-r 250", "ttr-250"], "dualsport", "chain",
  "249 cc air-cooled four-valve single, carb, electric start",
  "Yamaha's best-loved trail 250. Electric start, a DOHC single and good suspension for its class.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Shim check"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  CARB, YDIRT, [TT]))

B59.append(mk("yamaha-tt-r50-tt-r90-tt-r110-2000", "Yamaha", "TT-R50 / TT-R90 / TT-R110", "Yamaha TT-R50 / TT-R90", [2000, 2026],
  ["tt-r50", "ttr50", "tt-r90", "ttr90", "ttr 50", "ttr 90", "tt-r50e", "tt-r90e"], "dualsport", "chain",
  "49 or 89 cc air-cooled four-stroke single, carb, automatic clutch, electric start",
  "Yamaha's kids' trail bikes. Electric start, an automatic clutch and a carb that hates old fuel.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Auto clutch", "Adjust it"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  CARB, YDIRT, [TT]))

B59.append(mk("yamaha-pw80-1983", "Yamaha", "PW80", "Yamaha PW80", [1983, 2006],
  ["pw80", "pw 80", "peewee 80", "pee wee 80", "y-zinger 80"], "dualsport", "chain",
  "79 cc air-cooled two-stroke single, oil injection, automatic clutch",
  "Yamaha's step-up kids' bike. A two-stroke with oil injection and a three-speed with an automatic clutch.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Auto clutch", "Inspect"], ["Exhaust", "Check carbon"], ["Chain drive", "Slack and lube"]],
  TWO, YDIRT, [TT], lessons={"B": [INJ]}))

B59.append(mk("yamaha-xt550-1982", "Yamaha", "XT550", "Yamaha XT550", [1982, 1983],
  ["xt550", "xt 550", "xt550j", "xt550k"], "dualsport", "chain",
  "558 cc air-cooled four-valve single, two-stage dual carb, kick start",
  "Yamaha's early-80s big dual-sport. A two-stage carb setup and a monoshock rear.",
  [["Big single", "Air-cooled"], ["Two-stage carb", "Clean and set"], ["Valves", "Check them"], ["Starting", "Decompressor"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XT]))

B59.append(mk("yamaha-xt250-1980-1983-1980", "Yamaha", "XT250 (1980-1983)", "Yamaha XT250 (1980-1983)", [1980, 1983],
  ["xt250", "xt 250", "xt250h", "xt250g", "xt250j"], "dualsport", "chain",
  "249 cc air-cooled overhead-cam single, carb, kick start",
  "The first XT250. A simple air-cooled single with a monoshock and a kick start.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Cam chain", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XT]))

B59.append(mk("yamaha-dt360-dt400-1973", "Yamaha", "DT360 / DT400", "Yamaha DT360 / DT400", [1973, 1978],
  ["dt360", "dt400", "dt 360", "dt 400", "rt360", "rt3", "dt400b"], "dualsport", "chain",
  "351 or 397 cc air-cooled two-stroke single, Autolube oil injection",
  "Yamaha's big 70s enduros. Two-strokes with Autolube oil injection and a lot of torque.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Autolube", "Check pump"], ["Points/CDI", "Check spark"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [YE], lessons={"B": [INJ]}))

B59.append(mk("yamaha-rt100-rt180-1990", "Yamaha", "RT100 / RT180", "Yamaha RT100 / RT180", [1990, 2000],
  ["rt100", "rt180", "rt 100", "rt 180"], "dualsport", "chain",
  "98 or 171 cc air-cooled two-stroke single, Autolube oil injection",
  "Yamaha's simple trail two-strokes of the 90s. Oil injection, a kick start and very few parts to fail.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Autolube", "Check pump"], ["Exhaust", "Check carbon"], ["Chain drive", "Slack and lube"]],
  TWO, YDIRT, [YE], lessons={"B": [INJ]}))

HERO_NAME_B59 = {"yamaha-yz465-yz490-1980": "YZ490", "yamaha-it175-it250-1977": "IT250", "yamaha-tt600-1983": "TT600", "yamaha-tt-r250-1999": "TT-R250",
  "yamaha-tt-r50-tt-r90-tt-r110-2000": "TT-R90", "yamaha-pw80-1983": "PW80", "yamaha-xt550-1982": "XT550", "yamaha-xt250-1980-1983-1980": "XT250",
  "yamaha-dt360-dt400-1973": "DT400", "yamaha-rt100-rt180-1990": "RT180"}
