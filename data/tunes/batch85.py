"""Batch 85 bike tunes (top 1000, rows 841-850)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch44 import CLASSIC
from batch10 import NOC
from batch55 import PREMIX
B85 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
MAG = "It runs a magneto. Check the points, the condenser and the slip ring before you blame the carb."
PREUNIT = "The gearbox is separate from the engine and has its own oil. Check and change both, and set the primary chain."
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."
BSAOC = dict(name="BSA Owners Club", url="https://www.bsaoc.org/", what="Owner club for BSA motorcycles, with tech help and parts.")

B85.append(mk("matchless-g11-g12-g15-twins-ajs-31-1956", "Matchless", "G11 / G12 / G15 twins (AJS 31)", "Matchless G11 / G12 / G15 (AJS 31)", [1956, 1969],
  ["g12", "g11", "g15", "g12csr", "ajs 31", "ajs 30", "g9", "matchless g12", "g15 csr"], "standard", "chain",
  "498 to 745 cc air-cooled OHV parallel twin, magneto or coil",
  "The AMC twins. A three-bearing crank on the bigger ones, a separate gearbox and Norton engines on the G15.",
  [["OHV twin", "Air-cooled"], ["Carb", "Clean it out"], ["Ignition", "Mag or points"], ["Gearbox", "Separate oil"], ["Parts", "Source early"]],
  CARB, OLD, [CLASSIC], lessons={"B": [MAG], "K": [PREUNIT]}))

B85.append(mk("norton-commando-961-new-2010", "Norton", "Commando 961 (new)", "Norton Commando 961", [2010, 2019],
  ["commando 961", "961", "commando 961 sport", "commando 961 cafe racer", "961 se", "dominator 961", "norton 961"], "standard", "chain",
  "961 cc air/oil-cooled OHV parallel twin, fuel injected",
  "The revived Norton twin. Fuel injected, built in small numbers, with parts support that has been uneven.",
  [["OHV twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Oil leaks", "Check them"], ["Parts", "Check supply"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [NOC]))

B85.append(mk("norton-es2-model-50-manx-1947", "Norton", "ES2 / Model 50 / Manx", "Norton ES2 / Model 50 / Manx", [1947, 1963],
  ["es2", "model 50", "manx", "norton manx", "international", "model 30", "model 40", "norton es2"], "standard", "chain",
  "348 or 490 cc air-cooled single, pushrod or overhead-cam, magneto",
  "Norton's singles, from the ES2 road bike to the Manx racer. Magneto ignition and a separate gearbox.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Parts", "Source early"]],
  CARB, OLD, [NOC], lessons={"B": [MAG], "K": [PREUNIT]}))

B85.append(mk("bsa-a10-golden-flash-super-rocket-1950", "BSA", "A10 Golden Flash / Super Rocket", "BSA A10 Golden Flash / Super Rocket", [1950, 1963],
  ["a10", "golden flash", "super rocket", "road rocket", "rocket gold star", "bsa a10", "spitfire scrambler"], "standard", "chain",
  "646 cc air-cooled OHV pre-unit parallel twin, magneto",
  "BSA's 650 pre-unit twin. A magneto, a separate gearbox and plunger or swingarm frames.",
  [["Pre-unit twin", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [BSAOC], lessons={"B": [MAG], "K": [PREUNIT]}))

B85.append(mk("bsa-a7-shooting-star-1946", "BSA", "A7 / Shooting Star", "BSA A7 / Shooting Star", [1946, 1962],
  ["a7", "shooting star", "bsa a7", "star twin", "a7ss", "a7 shooting star"], "standard", "chain",
  "495 or 497 cc air-cooled OHV pre-unit parallel twin, magneto",
  "BSA's 500 pre-unit twin. The smaller brother of the A10, with the same layout and quirks.",
  [["Pre-unit twin", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [BSAOC], lessons={"B": [MAG], "K": [PREUNIT]}))

B85.append(mk("bsa-b31-b33-1945", "BSA", "B31 / B33", "BSA B31 / B33", [1945, 1960],
  ["b31", "b33", "bsa b31", "bsa b33", "b32", "b34"], "standard", "chain",
  "348 or 499 cc air-cooled OHV single, magneto",
  "BSA's everyday singles. Simple, tough and close cousins of the Gold Star.",
  [["OHV single", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [BSAOC], lessons={"B": [MAG], "K": [PREUNIT]}))

B85.append(mk("bsa-bantam-d1-d14-b175-1948", "BSA", "Bantam D1-D14 / B175", "BSA Bantam", [1948, 1971],
  ["bantam", "d1", "d7", "d10", "d14", "b175", "bsa bantam", "d3", "d5"], "standard", "chain",
  "123 to 172 cc air-cooled two-stroke single, premix, flywheel magneto",
  "BSA's little two-stroke, based on the DKW RT125. Premix, a flywheel magneto and a huge production run.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Flywheel mag", "Check spark"], ["Crank seals", "Check them"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [BSAOC], lessons={"B": [PREMIX]}))

B85.append(mk("bsa-rocket-3-a75-1968", "BSA", "Rocket 3 (A75)", "BSA Rocket 3 (A75)", [1968, 1972],
  ["rocket 3", "a75", "rocket three", "bsa rocket 3", "a75r", "a75v", "rocket 3 1971"], "standard", "chain",
  "740 cc air-cooled OHV triple, three carbs, points",
  "BSA's triple, sister to the Triumph Trident. Three carbs, three sets of points and an inclined engine.",
  [["OHV triple", "Air-cooled"], ["Three carbs", "Clean and sync"], ["Points", "Gap and time"], ["Clutch", "Diaphragm type"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [BSAOC], lessons={"B": [POINTS]}))

B85.append(mk("bsa-starfire-b25-1967", "BSA", "Starfire / B25", "BSA Starfire / B25", [1967, 1971],
  ["starfire", "b25", "b25ss", "b25t", "b25 starfire", "c25", "barracuda"], "standard", "chain",
  "247 cc air-cooled OHV unit single, points",
  "BSA's 250 unit single. Light, with points ignition and an engine that wants the oil changed often.",
  [["OHV single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Oil", "Change often"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [BSAOC], lessons={"B": [POINTS]}))

B85.append(mk("bsa-gold-star-650-2022-2022", "BSA", "Gold Star 650 (2022)", "BSA Gold Star 650", [2022, 2026],
  ["gold star", "gold star 650", "bsa gold star 650", "goldstar 650", "goldie 650"], "standard", "chain",
  "652 cc liquid-cooled four-valve single, fuel injected",
  "The revived BSA single, built by Mahindra's Classic Legends. Fuel injected, with a Rotax-derived engine.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [BSAOC]))

HERO_NAME_B85 = {"matchless-g11-g12-g15-twins-ajs-31-1956": "G12", "norton-commando-961-new-2010": "COMMANDO 961", "norton-es2-model-50-manx-1947": "MANX",
  "bsa-a10-golden-flash-super-rocket-1950": "GOLDEN FLASH", "bsa-a7-shooting-star-1946": "SHOOTING STAR", "bsa-b31-b33-1945": "B33",
  "bsa-bantam-d1-d14-b175-1948": "BANTAM", "bsa-rocket-3-a75-1968": "ROCKET 3", "bsa-starfire-b25-1967": "STARFIRE", "bsa-gold-star-650-2022-2022": "GOLD STAR"}
