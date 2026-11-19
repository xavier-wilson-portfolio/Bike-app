"""Batch 83 bike tunes (top 1000, rows 821-830)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch55 import TT, PREMIX
B83 = []
TWO = CARB + AIR + ["H-003"]
DIRTX = "Off-road and trials models are often not in the NHTSA recall search. Ask a dealer for the make to run the frame number."
TRIALS = dict(name="TrialsCentral", url="https://www.trialscentral.com/", what="Forum for trials riders, with sections for most trials makes.")

B83.append(mk("gasgas-ec-250-300-spanish-2000", "GasGas", "EC 250 / 300 (Spanish)", "GasGas EC 250 / 300 (Spanish era)", [2000, 2019],
  ["ec 300", "ec 250", "ec300", "ec250", "ec 200", "xc 300", "gas gas ec", "ec racing"], "dualsport", "chain",
  "249 or 299 cc liquid-cooled two-stroke single, carb, premix",
  "The Spanish-built GasGas enduros. Premix two-strokes known for strong low-end power and simple maintenance.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Power valve", "Clean it"], ["Cooling", "Coolant and hoses"]],
  TWO, DIRTX, [TT], lessons={"B": [PREMIX]}))

B83.append(mk("gasgas-txt-trials-1995", "GasGas", "TXT trials", "GasGas TXT trials", [1995, 2026],
  ["txt", "txt pro", "txt 280", "txt 300", "txt 250", "txt racing", "txt gp", "gas gas txt"], "dualsport", "chain",
  "125 to 299 cc liquid-cooled two-stroke single, carb, premix",
  "GasGas trials bikes. Very light, no seat, premix and parts that wear from constant clutch use.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Clutch", "Check plates"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, DIRTX, [TRIALS], lessons={"B": [PREMIX]}))

B83.append(mk("gasgas-mc-ex-2021-on-2021", "GasGas", "MC / EX (2021 on)", "GasGas MC / EX (2021 on)", [2021, 2026],
  ["mc 450f", "mc 250f", "ex 350f", "ex 300", "mc 125", "ex 450f", "mc 250", "ec 300 2021"], "dualsport", "chain",
  "125 to 450 cc liquid-cooled two- or four-stroke single, fuel injected on most",
  "The KTM-era GasGas bikes. Shared engines with KTM and Husqvarna, and service intervals in hours.",
  [["Single", "Check type"], ["Fuel", "Check system"], ["Valves or top end", "Check"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], DIRTX, [TT], lessons={"B": ["Models with an F are four-strokes. The others are two-strokes; check if yours is injected or runs premix."]}))

B83.append(mk("beta-rr-250-300-two-stroke-2013", "Beta", "RR 250 / 300 two-stroke", "Beta RR 250 / 300 two-stroke", [2013, 2026],
  ["300 rr", "250 rr", "rr 300", "rr 250", "300 rr race", "beta 300", "xtrainer", "x-trainer", "200 rr"], "dualsport", "chain",
  "249 or 293 cc liquid-cooled two-stroke single, oil injection or premix, carb or injection",
  "Beta's two-stroke enduros. Many have oil injection, so check the system before you mix fuel.",
  [["Two-stroke", "Check oiling"], ["Fuel", "Carb or TBI"], ["Top end", "Check piston"], ["Power valve", "Clean it"], ["Cooling", "Coolant and hoses"]],
  TWO, DIRTX, [TT], lessons={"B": ["Many Beta RRs have oil injection. Check for an oil tank and pump; if it has been removed, it needs premix."]}))

B83.append(mk("beta-rr-350-390-430-480-four-stroke-2010", "Beta", "RR 350 / 390 / 430 / 480 four-stroke", "Beta RR 350-480 four-stroke", [2010, 2026],
  ["350 rr", "390 rr", "430 rr", "480 rr", "rr 430", "rr 480", "rr-s", "350 rr-s", "500 rr-s", "400 rr", "450 rr", "520 rr"], "dualsport", "chain",
  "349 to 478 cc liquid-cooled four-stroke single, fuel injected",
  "Beta's four-stroke enduros. Fuel injected, electric start and road-legal RR-S versions.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  EFI, DIRTX, [TT]))

B83.append(mk("beta-evo-trials-2009", "Beta", "Evo trials", "Beta Evo trials", [2009, 2026],
  ["evo", "beta evo", "evo 300", "evo 250", "evo 125", "rev 3", "rev3", "evo factory"], "dualsport", "chain",
  "125 to 300 cc liquid-cooled two- or four-stroke single",
  "Beta's trials bikes. Light, low and hard on clutches; most are premix two-strokes.",
  [["Single", "Check type"], ["Carb", "Clean it out"], ["Clutch", "Check plates"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  [], DIRTX, [TRIALS], lessons={"B": ["Most Evo trials bikes are two-strokes that run premix. The 300 SS four-stroke uses engine oil instead. Check which one you have."]}))

B83.append(mk("sherco-se-sef-enduro-2014", "Sherco", "SE / SEF enduro", "Sherco SE / SEF enduro", [2014, 2026],
  ["sef 300", "se 300", "sef 250", "se 250", "sef 450", "sef 500", "sherco 300", "se-r", "sef-r", "st 300"], "dualsport", "chain",
  "125 to 500 cc liquid-cooled two- or four-stroke single",
  "Sherco's French enduros. SE models are two-strokes, SEF are four-strokes, both with short service intervals.",
  [["Single", "Check type"], ["Fuel", "Check system"], ["Valves or top end", "Check"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], DIRTX, [TT], lessons={"B": ["SE models are two-strokes that run premix. SEF models are four-strokes. Check which one you have."]}))

B83.append(mk("montesa-cota-247-348-1968", "Montesa", "Cota 247 / 348", "Montesa Cota 247 / 348", [1968, 1985],
  ["cota", "cota 247", "cota 348", "cota 123", "cota 349", "cota 200", "montesa cota"], "dualsport", "chain",
  "123 to 349 cc air-cooled two-stroke single, premix",
  "Montesa's classic trials bikes. Premix two-strokes with a big vintage trials following.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Ignition", "Check flywheel"], ["Clutch", "Check it"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [TRIALS], lessons={"B": [PREMIX]}))

B83.append(mk("montesa-cappra-king-scorpion-1966", "Montesa", "Cappra / King Scorpion", "Montesa Cappra / King Scorpion", [1966, 1980],
  ["cappra", "king scorpion", "scorpion", "cappra 250", "cappra 360", "enduro 250 montesa", "vr cappra"], "dualsport", "chain",
  "247 to 360 cc air-cooled two-stroke single, premix",
  "Montesa's motocross and enduro bikes of the 60s and 70s. Premix two-strokes with magneto ignition.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check flywheel"], ["Parts", "Source early"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B83.append(mk("ossa-pioneer-stiletto-mar-1967", "Ossa", "Pioneer / Stiletto / MAR", "Ossa Pioneer / Stiletto / MAR", [1967, 1982],
  ["pioneer", "stiletto", "mar", "ossa mar", "ossa pioneer", "phantom", "super pioneer", "ossa 250"], "dualsport", "chain",
  "174 to 244 cc air-cooled two-stroke single, premix",
  "The Spanish Ossas for trials, enduro and motocross. Premix two-strokes with flywheel magnetos.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check flywheel"], ["Parts", "Source early"]],
  TWO, OLD, [TRIALS], lessons={"B": [PREMIX]}))

HERO_NAME_B83 = {"gasgas-ec-250-300-spanish-2000": "EC 300", "gasgas-txt-trials-1995": "TXT", "gasgas-mc-ex-2021-on-2021": "GASGAS",
  "beta-rr-250-300-two-stroke-2013": "300 RR", "beta-rr-350-390-430-480-four-stroke-2010": "430 RR", "beta-evo-trials-2009": "EVO",
  "sherco-se-sef-enduro-2014": "SHERCO", "montesa-cota-247-348-1968": "COTA", "montesa-cappra-king-scorpion-1966": "CAPPRA", "ossa-pioneer-stiletto-mar-1967": "OSSA"}
