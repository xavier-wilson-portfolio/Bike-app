"""Batch 58 bike tunes (top 1000, rows 571-580)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch38 import SCOOT
from batch51 import MOPED, INJ
from batch55 import TT, PREMIX
B58 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
YDIRT = "Off-road models are not always in the NHTSA recall search. Ask a Yamaha dealer to run the VIN as well."

B58.append(mk("yamaha-vino-50-2001", "Yamaha", "Vino 50", "Yamaha Vino 50", [2001, 2015],
  ["vino 50", "yj50", "yj50r", "vino 50 classic", "vino50", "yj50rn"], "scooter", "belt",
  "49 cc single, two-stroke on early years and four-stroke from 2006, carb, CVT",
  "Yamaha's retro 50. Early ones are two-strokes with oil injection; later ones are four-strokes.",
  [["49 cc single", "Check type"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Brakes", "Check them"]],
  CARB, GENNOTE, [SCOOT], lessons={"B": ["Check whether yours is the two-stroke or the four-stroke before you buy oil or parts. The two-stroke has an oil tank under the seat."]}))

B58.append(mk("yamaha-morphous-250-2005", "Yamaha", "Morphous 250", "Yamaha Morphous 250", [2005, 2008],
  ["morphous", "cp250", "cp 250", "morphous 250", "yamaha morphous"], "scooter", "belt",
  "249 cc liquid-cooled single, CVT, long low frame",
  "Yamaha's long, low maxi-scooter. A liquid-cooled single and bodywork that hides everything.",
  [["249 cc single", "Liquid-cooled"], ["Fuel", "Check system"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Bodywork", "Many panels"]],
  [], GENNOTE, [SCOOT]))

B58.append(mk("yamaha-qt50-yamahopper-1979", "Yamaha", "QT50 Yamahopper", "Yamaha QT50 Yamahopper", [1979, 1987],
  ["qt50", "qt 50", "yamahopper", "yamaha hopper", "qt50g"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, oil injection, automatic",
  "Yamaha's little step-through moped. Two-stroke, oil injection and a one-speed automatic.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Auto clutch", "Inspect"], ["Exhaust", "Check carbon"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [INJ]}))

B58.append(mk("yamaha-yz125-1974", "Yamaha", "YZ125", "Yamaha YZ125", [1974, 2026],
  ["yz125", "yz 125", "yz125x", "yz125 two stroke"], "dualsport", "chain",
  "124 cc two-stroke single, air-cooled then liquid-cooled, carb, premix",
  "Yamaha's long-running 125 two-stroke. Premix, a power valve on later years and a top end that needs regular rebuilds.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Power valve", "Clean it"], ["Chain drive", "Slack and lube"]],
  TWO, YDIRT, [TT], lessons={"B": [PREMIX]}))

B58.append(mk("yamaha-yz80-yz85-1978", "Yamaha", "YZ80 / YZ85", "Yamaha YZ80 / YZ85", [1978, 2026],
  ["yz80", "yz85", "yz 80", "yz 85", "yz85lw", "yz80lw"], "dualsport", "chain",
  "79 or 85 cc two-stroke single, liquid-cooled on most years, carb, premix",
  "Yamaha's mini motocross two-strokes. Premix, a fast-wearing top end and parts kids tend to break.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, YDIRT, [TT], lessons={"B": [PREMIX]}))

B58.append(mk("yamaha-yz65-2018", "Yamaha", "YZ65", "Yamaha YZ65", [2018, 2026],
  ["yz65", "yz 65"], "dualsport", "chain",
  "65 cc liquid-cooled two-stroke single, carb, premix, power valve",
  "Yamaha's smallest motocross two-stroke. Premix, a power valve and a six-speed box.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Power valve", "Clean it"], ["Chain drive", "Slack and lube"]],
  TWO, YDIRT, [TT], lessons={"B": [PREMIX]}))

B58.append(mk("yamaha-yz250f-2001", "Yamaha", "YZ250F", "Yamaha YZ250F", [2001, 2026],
  ["yz250f", "yz 250f", "yz250fx", "yz 250fx"], "dualsport", "chain",
  "249 cc liquid-cooled four-stroke single, carb then fuel injection",
  "Yamaha's 250 motocross four-stroke. Revs high and needs valve checks on a schedule in hours.",
  [["Race single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], YDIRT, [TT]))

B58.append(mk("yamaha-yz450f-2003", "Yamaha", "YZ450F", "Yamaha YZ450F", [2003, 2026],
  ["yz450f", "yz 450f", "yz450fx", "yz 450fx", "yz450"], "dualsport", "chain",
  "449 cc liquid-cooled four-stroke single, carb then fuel injection",
  "Yamaha's open-class motocross four-stroke. Later ones have a rearward-slanted engine and an app-tunable ECU.",
  [["Race single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], YDIRT, [TT]))

B58.append(mk("yamaha-wr250f-2001", "Yamaha", "WR250F", "Yamaha WR250F", [2001, 2026],
  ["wr250f", "wr 250f", "wr250f enduro"], "dualsport", "chain",
  "249 cc liquid-cooled four-stroke single, carb then fuel injection, electric start",
  "Yamaha's 250 enduro. Electric start, wide gearing and a lot of shared parts with the YZ250F.",
  [["Single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  [], YDIRT, [TT]))

B58.append(mk("yamaha-wr450f-2003", "Yamaha", "WR450F", "Yamaha WR450F", [2003, 2026],
  ["wr450f", "wr 450f", "wr450", "wr 450"], "dualsport", "chain",
  "449 cc liquid-cooled four-stroke single, carb then fuel injection, electric start",
  "Yamaha's big enduro. Electric start and a wide-ratio box, often plated for street use.",
  [["Single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  [], YDIRT, [TT]))

HERO_NAME_B58 = {"yamaha-vino-50-2001": "VINO 50", "yamaha-morphous-250-2005": "MORPHOUS", "yamaha-qt50-yamahopper-1979": "QT50",
  "yamaha-yz125-1974": "YZ125", "yamaha-yz80-yz85-1978": "YZ85", "yamaha-yz65-2018": "YZ65", "yamaha-yz250f-2001": "YZ250F",
  "yamaha-yz450f-2003": "YZ450F", "yamaha-wr250f-2001": "WR250F", "yamaha-wr450f-2003": "WR450F"}
