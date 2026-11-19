"""Batch 84 bike tunes (top 1000, rows 831-840)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch55 import TT, PREMIX
from batch44 import CLASSIC
from batch19 import AMCA
from batch81 import EURO
B84 = []
TWO = CARB + AIR + ["H-003"]
MAG = "It runs a magneto. Check the points, the condenser and the slip ring before you blame the carb."
PREUNIT = "The gearbox is separate from the engine and has its own oil. Check and change both, and set the primary chain."

B84.append(mk("cz-250-400-motocross-1965", "CZ", "250 / 400 motocross", "CZ 250 / 400 motocross", [1965, 1980],
  ["cz", "cz 250", "cz 400", "cz 125", "cz motocross", "cz twin port", "cz 380"], "dualsport", "chain",
  "123 to 380 cc air-cooled two-stroke single, premix",
  "The Czech motocross bikes that won world titles. Premix, a flywheel magneto and a gearshift on the left on some.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check flywheel"], ["Parts", "Source early"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B84.append(mk("jawa-350-250-634-638-1960", "Jawa", "350 / 250 (634 / 638)", "Jawa 350 / 250", [1960, 1990],
  ["jawa", "jawa 350", "jawa 250", "634", "638", "jawa 353", "jawa 559", "californian"], "standard", "chain",
  "246 or 344 cc air-cooled two-stroke, single or twin, premix or oil injection",
  "The Czech commuter two-strokes. An automatic clutch on many, and either premix or oil injection depending on year.",
  [["Two-stroke", "Check oiling"], ["Carb", "Clean it out"], ["Auto clutch", "Check it"], ["Points", "Gap and time"], ["Chain case", "Check inside"]],
  TWO, OLD, [EURO], lessons={"B": ["Check whether yours has oil injection or runs premix before you fill the tank."]}))

B84.append(mk("maico-250-400-490-motocross-1970", "Maico", "250 / 400 / 490 motocross", "Maico 250 / 400 / 490 motocross", [1970, 1987],
  ["maico", "maico 490", "maico 400", "maico 250", "maico 440", "maico 501", "maico mc"], "dualsport", "chain",
  "247 to 488 cc air-cooled two-stroke single, premix",
  "The German motocross two-strokes known for great handling. Premix and a big vintage racing scene.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check flywheel"], ["Suspension", "Rebuild it"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B84.append(mk("penton-125-250-ktm-built-1968", "Penton", "125 / 250 (KTM-built)", "Penton 125 / 250", [1968, 1977],
  ["penton", "six days", "jackpiner", "hare scrambler", "penton 125", "penton 250"], "dualsport", "chain",
  "100 to 400 cc air-cooled two-stroke single, Sachs or KTM engine, premix",
  "John Penton's KTM-built enduros. Sachs or KTM engines, premix and a passionate owner community.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check flywheel"], ["Parts", "Source early"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B84.append(mk("hodaka-ace-90-100-super-rat-wombat-1964", "Hodaka", "Ace 90 / 100 / Super Rat / Wombat", "Hodaka Ace / Super Rat / Wombat", [1964, 1978],
  ["hodaka", "ace 90", "ace 100", "super rat", "combat wombat", "wombat", "dirt squirt", "road toad", "thunderdog"], "dualsport", "chain",
  "90 to 250 cc air-cooled two-stroke single, premix",
  "The Oregon-designed, Japan-built trail two-strokes. Premix, simple and well supported by a dedicated club.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B84.append(mk("velocette-venom-thruxton-viper-1955", "Velocette", "Venom / Thruxton / Viper", "Velocette Venom / Thruxton / Viper", [1955, 1971],
  ["venom", "thruxton venom", "viper", "velocette thruxton", "velocette venom", "clubman"], "standard", "chain",
  "349 or 499 cc air-cooled high-cam OHV single, magneto",
  "Velocette's sporting singles. A high camshaft, a fiddly clutch to adjust and a magneto.",
  [["OHV single", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Clutch", "Adjust it"], ["Parts", "Source early"]],
  CARB, OLD, [CLASSIC], lessons={"B": [MAG]}))

B84.append(mk("vincent-rapide-black-shadow-comet-1946", "Vincent", "Rapide / Black Shadow / Comet", "Vincent Rapide / Black Shadow / Comet", [1946, 1955],
  ["rapide", "black shadow", "comet", "vincent", "black lightning", "black prince", "vincent rapide", "series c"], "standard", "chain",
  "499 cc single or 998 cc 50-degree V-twin, air-cooled, magneto",
  "The Vincent twins and singles. Rare and valuable, so source parts from the owners' club and work slowly.",
  [["Engine", "Air-cooled"], ["Carbs", "Clean them"], ["Magneto", "Check spark"], ["Clutch", "Servo type"], ["Parts", "Source early"]],
  CARB, OLD, [CLASSIC], lessons={"B": [MAG]}))

B84.append(mk("ariel-square-four-1931", "Ariel", "Square Four", "Ariel Square Four", [1931, 1959],
  ["square four", "ariel square four", "squariel", "4g", "mk ii square four", "4g mk2"], "standard", "chain",
  "497 to 997 cc air-cooled square four, one carb",
  "Ariel's four-cylinder in a square. Two geared crankshafts, cooling trouble at the back and a long club history.",
  [["Square four", "Air-cooled"], ["Carb", "Clean it out"], ["Ignition", "Check it"], ["Cooling", "Rear cylinders"], ["Parts", "Source early"]],
  CARB, OLD, [CLASSIC]))

B84.append(mk("ariel-arrow-leader-1958", "Ariel", "Arrow / Leader", "Ariel Arrow / Leader", [1958, 1965],
  ["arrow", "leader", "ariel arrow", "ariel leader", "golden arrow", "super sports arrow"], "standard", "chain",
  "247 cc air-cooled two-stroke twin, premix, pressed-steel beam frame",
  "Ariel's 250 two-stroke twins. A pressed-steel frame, a twin-cylinder two-stroke and full bodywork on the Leader.",
  [["Two-stroke twin", "Premix"], ["Carb", "Clean it out"], ["Crank seals", "Check them"], ["Frame", "Check rust"], ["Parts", "Source early"]],
  TWO, OLD, [CLASSIC], lessons={"B": [PREMIX]}))

B84.append(mk("matchless-g80-ajs-model-18-single-1945", "Matchless", "G80 / AJS Model 18 single", "Matchless G80 / AJS Model 18", [1945, 1966],
  ["g80", "g80s", "model 18", "ajs 18", "g3", "g3l", "ajs 16", "matchless g80", "g80cs"], "standard", "chain",
  "348 or 498 cc air-cooled OHV single, magneto",
  "The AMC heavyweight singles. A magneto, a separate gearbox and many shared parts between the Matchless and AJS versions.",
  [["OHV single", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Parts", "Source early"]],
  CARB, OLD, [CLASSIC], lessons={"B": [MAG], "K": [PREUNIT]}))

HERO_NAME_B84 = {"cz-250-400-motocross-1965": "CZ", "jawa-350-250-634-638-1960": "JAWA", "maico-250-400-490-motocross-1970": "MAICO",
  "penton-125-250-ktm-built-1968": "PENTON", "hodaka-ace-90-100-super-rat-wombat-1964": "HODAKA", "velocette-venom-thruxton-viper-1955": "VENOM",
  "vincent-rapide-black-shadow-comet-1946": "VINCENT", "ariel-square-four-1931": "SQUARE FOUR", "ariel-arrow-leader-1958": "ARROW",
  "matchless-g80-ajs-model-18-single-1945": "G80"}
