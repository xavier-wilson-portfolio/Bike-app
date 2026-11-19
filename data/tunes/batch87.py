"""Batch 87 bike tunes (top 1000, rows 861-870)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch38 import SCOOT
from batch51 import MOPED
from batch55 import TT, PREMIX
from batch50 import LAMF
B87 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
CHINANOTE = "Many of these were sold under several brand names and may not show up in the NHTSA search. Check with the seller or importer for open recalls."

B87.append(mk("piaggio-ciao-grande-bravo-moped-1967", "Piaggio", "Ciao / Grande / Bravo moped", "Piaggio Ciao / Grande / Bravo", [1967, 2006],
  ["ciao", "grande", "bravo", "piaggio ciao", "si", "boxer", "piaggio bravo", "piaggio grande"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, premix or oil injection, variator on some",
  "Piaggio's pedal mopeds. Simple two-strokes, a single-speed drive and a big parts and tuning scene.",
  [["Two-stroke", "Check oiling"], ["Carb", "Clean it out"], ["Variator", "Inspect"], ["Pedals", "Lube chain"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": ["Check whether yours has an oil tank or runs premix before you fill it."]}))

B87.append(mk("lambretta-ld-d-series-1-2-1947", "Lambretta", "LD / D / Series 1-2", "Lambretta LD / D", [1947, 1962],
  ["ld", "ld 125", "ld 150", "lambretta ld", "lambretta d", "d 125", "d 150", "lambretta c", "lambretta e"], "scooter", "chain",
  "123 or 148 cc air-cooled two-stroke single, premix, shaft drive",
  "The early Lambrettas. Tube frames, shaft drive to the rear wheel and parts that are getting scarce.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Shaft drive", "Check oil"], ["Ignition", "Check flywheel"], ["Parts", "Source early"]],
  TWO, OLD, [LAMF], lessons={"B": [PREMIX]}))

B87.append(mk("lambretta-v-special-new-2018", "Lambretta", "V-Special (new)", "Lambretta V-Special", [2018, 2026],
  ["v-special", "v special", "v125", "v200", "lambretta v200", "lambretta v125", "x300", "g350"], "scooter", "belt",
  "49 to 330 cc single, fuel injected on most, CVT",
  "The modern Lambrettas. A steel body, fuel injection and a CVT; nothing in common with the old ones under the panels.",
  [["Single", "Air or liquid"], ["Fuel injected", "Check system"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Body", "Steel panels"]],
  EFI, GENNOTE, [SCOOT]))

B87.append(mk("italjet-dragster-125-200-2022", "Italjet", "Dragster 125 / 200", "Italjet Dragster 125 / 200", [2022, 2026],
  ["dragster", "dragster 125", "dragster 200", "italjet dragster", "dragster 300"], "scooter", "belt",
  "125 or 181 cc liquid-cooled single, fuel injected, CVT",
  "Italjet's exposed-frame sport scooter. Hub-center steering, liquid cooling and a lot of unique parts.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Hub steering", "Check play"], ["CVT belt", "Inspect"], ["Parts", "Check supply"]],
  EFI, GENNOTE, [SCOOT]))

B87.append(mk("tao-motor-gy6-50-150-scooter-2005", "Tao Motor", "GY6 50 / 150 scooter", "Tao Motor GY6 scooters", [2005, 2026],
  ["gy6", "tao tao", "tao 50", "tao 150", "evo 150", "thunder 50", "lancer", "gy6 150", "139qmb", "157qmj"], "scooter", "belt",
  "49 or 150 cc air-cooled GY6 single, carb, CVT",
  "The common Chinese GY6 scooters. Cheap, simple and shared with many brands, so parts are everywhere.",
  [["GY6 single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["CVT belt", "Inspect"], ["Wiring", "Check connectors"]],
  CARB, CHINANOTE, [SCOOT]))

B87.append(mk("ssr-motorsports-pit-bike-110-125-sr125-sr110-2005", "SSR Motorsports", "Pit bike 110 / 125 (SR125, SR110)", "SSR pit bike (SR110, SR125)", [2005, 2026],
  ["sr125", "sr110", "ssr 125", "ssr pit bike", "sr150", "sr189", "ssr 110", "pit bike"], "dualsport", "chain",
  "107 to 189 cc air-cooled horizontal single, carb",
  "SSR's pit bikes with Honda-style horizontal engines. Simple, cheap and easy to swap parts on.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Clutch", "Adjust it"], ["Chain drive", "Slack and lube"]],
  CARB, CHINANOTE, [TT]))

B87.append(mk("csc-rx3-cyclone-tt250-city-slicker-2014", "CSC", "RX3 Cyclone / TT250 / City Slicker", "CSC RX3 Cyclone / TT250 / City Slicker", [2014, 2026],
  ["rx3", "rx3 cyclone", "tt250", "city slicker", "rx3s", "rx4", "csc rx3", "cyclone"], "adventure", "chain",
  "249 or 449 cc single, fuel injected",
  "CSC's imported adventure and retro bikes, mostly built by Zongshen. Fuel injected and sold factory-direct.",
  [["Single", "Liquid or air"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  EFI, CHINANOTE, [TT]))

B87.append(mk("janus-halcyon-250-gryphon-2016", "Janus", "Halcyon 250 / Gryphon", "Janus Halcyon 250 / Gryphon", [2016, 2026],
  ["halcyon", "halcyon 250", "gryphon", "gryphon 450", "phoenix", "janus halcyon", "halcyon 450"], "standard", "chain",
  "229 or 449 cc air-cooled single, carb or fuel injection",
  "Janus's small hand-built bikes from Indiana. Simple singles and a strong support line from the factory.",
  [["Single", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  [], GENNOTE, [TT]))

B87.append(mk("lifan-kp150-kpr-kps-200-2017", "Lifan", "KP150 / KPR / KPS 200", "Lifan KP150 / KPR / KPS 200", [2017, 2023],
  ["kp150", "kpr", "kps 200", "kpr200", "kp200", "lifan kpr", "kpr 200", "kps"], "standard", "chain",
  "149 to 198 cc single, carb or fuel injection",
  "Lifan's small sport and naked bikes. Cheap, light, with parts supply that depends on the importer.",
  [["Single", "Air or liquid"], ["Fuel", "Carb or EFI"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  [], CHINANOTE, [TT]))

B87.append(mk("coleman-ct200u-minibike-2017", "Coleman", "CT200U minibike", "Coleman CT200U minibike", [2017, 2026],
  ["ct200u", "coleman ct200u", "ct100u", "ct200u-ex", "coleman minibike", "bt200x"], "standard", "chain",
  "196 cc air-cooled OHV small-engine single, pull start, torque converter",
  "Coleman's mini bike with a lawnmower-type engine and a torque converter. Very simple and easy to modify.",
  [["Small engine", "Air-cooled"], ["Carb", "Clean it out"], ["Torque converter", "Check belt"], ["Governor", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [MOPED]))

HERO_NAME_B87 = {"piaggio-ciao-grande-bravo-moped-1967": "CIAO", "lambretta-ld-d-series-1-2-1947": "LAMBRETTA LD", "lambretta-v-special-new-2018": "V-SPECIAL",
  "italjet-dragster-125-200-2022": "DRAGSTER", "tao-motor-gy6-50-150-scooter-2005": "GY6", "ssr-motorsports-pit-bike-110-125-sr125-sr110-2005": "SSR",
  "csc-rx3-cyclone-tt250-city-slicker-2014": "RX3", "janus-halcyon-250-gryphon-2016": "HALCYON", "lifan-kp150-kpr-kps-200-2017": "LIFAN",
  "coleman-ct200u-minibike-2017": "CT200U"}
