"""Batch 71 bike tunes (top 1000, rows 701-710)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch19 import AMCA
from batch27 import HDNOTE, HDF, XLF
B71 = []
TWO = CARB + AIR + ["H-003"]
TCNOTE = "Twin Cam engines from these years use spring-loaded cam chain tensioners with plastic shoes. Check the shoes for wear before you trust the engine."

B71.append(mk("harley-davidson-night-train-standard-custom-deuce-twin-cam-2000", "Harley-Davidson", "Night Train / Standard / Custom / Deuce (Twin Cam)", "Harley-Davidson Twin Cam Softail (Night Train, Standard, Custom, Deuce)", [2000, 2009],
  ["night train", "fxstb", "softail standard", "fxst", "fxstd", "deuce", "softail deuce", "fxstc", "softail custom"], "cruiser", "belt",
  "88 or 96 cubic inch Twin Cam B V-twin, counterbalanced, carb or fuel injection, belt drive",
  "The Twin Cam Softails. A counterbalanced engine in a rigid-look frame, with carbs or injection depending on year.",
  [["Twin Cam B", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Cam tensioners", "Check shoes"], ["Belt", "Check tension"], ["Primary", "Change oil"]],
  [], HDNOTE, [HDF], lessons={"E": [TCNOTE]}))

B71.append(mk("harley-davidson-rocker-rocker-c-2008", "Harley-Davidson", "Rocker / Rocker C", "Harley-Davidson Rocker / Rocker C", [2008, 2011],
  ["rocker", "rocker c", "fxcw", "fxcwc", "softail rocker"], "cruiser", "belt",
  "96 cubic inch Twin Cam B V-twin, fuel injected, belt drive, 240 rear tire",
  "Harley's long chopper-style Softail. A wide rear tire, a fender that moves with the swingarm and the 96 engine.",
  [["Twin Cam B", "Air-cooled"], ["Fuel injected", "No carbs"], ["Cam tensioners", "Check shoes"], ["Belt", "Check tension"], ["Rear fender", "Check mounts"]],
  EFI, HDNOTE, [HDF], lessons={"E": [TCNOTE]}))

B71.append(mk("harley-davidson-cross-bones-2008", "Harley-Davidson", "Cross Bones", "Harley-Davidson Cross Bones", [2008, 2011],
  ["cross bones", "crossbones", "flstsb", "softail cross bones"], "cruiser", "belt",
  "96 cubic inch Twin Cam B V-twin, fuel injected, belt drive, springer front end",
  "A dark bobber-style Softail with a springer fork. The fork has its own bushings and springs to check.",
  [["Twin Cam B", "Air-cooled"], ["Fuel injected", "No carbs"], ["Springer fork", "Check bushings"], ["Belt", "Check tension"], ["Primary", "Change oil"]],
  EFI, HDNOTE, [HDF], lessons={"L": ["The springer front end pivots on bushings and rockers. Check them for play and grease them before you ride."]}))

B71.append(mk("harley-davidson-x350-x500-2024", "Harley-Davidson", "X350 / X500", "Harley-Davidson X350 / X500", [2024, 2026],
  ["x350", "x500", "x 350", "x 500", "harley x350", "harley x500"], "standard", "chain",
  "353 or 500 cc liquid-cooled parallel twin, fuel injected",
  "Harley's small twins built with Qianjiang. Liquid-cooled parallel twins, nothing like the big V-twins inside.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, HDNOTE, [HDF]))

B71.append(mk("harley-davidson-ss250-sx250-sx175-1974", "Harley-Davidson", "SS250 / SX250 / SX175", "Harley-Davidson SS / SX two-strokes", [1974, 1978],
  ["ss250", "sx250", "sx175", "ss175", "ss 250", "sx 250", "sx 175", "aermacchi sx"], "dualsport", "chain",
  "174 or 243 cc air-cooled two-stroke single, built by Aermacchi",
  "Harley's Italian-built two-strokes of the 70s. Street and trail versions, with parts that are now hard to find.",
  [["Two-stroke", "Check oiling"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check spark"], ["Parts", "Source early"]],
  TWO, OLD, [AMCA], lessons={"B": ["Check whether yours has a working oil pump or runs premix before you fill the tank."]}))

B71.append(mk("harley-davidson-flt-tour-glide-shovelhead-1980", "Harley-Davidson", "FLT Tour Glide (Shovelhead)", "Harley-Davidson FLT Tour Glide (Shovelhead)", [1980, 1984],
  ["flt", "flt tour glide", "tour glide shovelhead", "fltc shovelhead", "flt 80", "shovelhead tour glide"], "touring", "chain",
  "80 cubic inch Shovelhead V-twin, carb, rubber-mounted, five-speed",
  "The first rubber-mounted Harley tourer. A Shovelhead in the FLT frame, with a frame-mounted fairing and enclosed chain.",
  [["Shovelhead", "Air-cooled"], ["Carb", "Clean it out"], ["Rubber mounts", "Check them"], ["Charging", "Check R/R"], ["Enclosed chain", "Oil and adjust"]],
  CARB, OLD, [HDF]))

B71.append(mk("harley-davidson-xlcr-cafe-racer-1977", "Harley-Davidson", "XLCR Cafe Racer", "Harley-Davidson XLCR", [1977, 1978],
  ["xlcr", "xlcr cafe racer", "xlcr1000", "xlcr 1000", "harley cafe racer"], "cafe", "chain",
  "1000 cc Ironhead V-twin, carb, siamese exhaust",
  "Harley's black cafe racer from the late 70s. An Ironhead in a unique frame with many one-year parts.",
  [["Ironhead twin", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Set them"], ["Charging", "Check R/R"], ["Parts", "Source early"]],
  CARB, OLD, [XLF]))

B71.append(mk("harley-davidson-road-king-evo-1994", "Harley-Davidson", "Road King (Evo)", "Harley-Davidson Road King (Evo)", [1994, 1998],
  ["road king", "flhr", "road king evo", "flhr evo", "flhri", "flhrci", "road king classic"], "touring", "belt",
  "80 cubic inch Evolution V-twin, carb or fuel injection, belt drive",
  "The first Road Kings. An Evo engine in the FLH frame, with a removable windshield and bags.",
  [["Evo twin", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Charging", "Check R/R"], ["Belt", "Check tension"], ["Primary", "Change oil"]],
  [], HDNOTE, [HDF]))

B71.append(mk("harley-davidson-cvo-limited-ultra-2006", "Harley-Davidson", "CVO Limited / Ultra", "Harley-Davidson CVO Limited / Ultra", [2006, 2026],
  ["cvo limited", "cvo ultra", "flhtkse", "flhtcuse", "cvo ultra classic", "cvo road glide ultra", "cvo electra glide"], "touring", "belt",
  "103 to 121 cubic inch V-twin, fuel injected, belt drive",
  "Harley's factory custom tourers. Bigger engines, lots of electronics and special paint you do not want to scratch.",
  [["Big twin", "Air/oil/liquid"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Belt", "Check tension"], ["Paint", "Protect it"]],
  EFI, HDNOTE, [HDF]))

B71.append(mk("harley-davidson-sport-glide-flsb-2018", "Harley-Davidson", "Sport Glide (FLSB)", "Harley-Davidson Sport Glide", [2018, 2021],
  ["sport glide", "flsb", "softail sport glide"], "touring", "belt",
  "107 cubic inch Milwaukee-Eight V-twin, fuel injected, belt drive",
  "A light Softail tourer with a small fairing and quick-release bags. The Milwaukee-Eight 107 in the newer Softail frame.",
  [["Milwaukee-Eight", "Oil and air cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Belt", "Check tension"], ["Primary", "Change oil"]],
  EFI, HDNOTE, [HDF]))

HERO_NAME_B71 = {"harley-davidson-night-train-standard-custom-deuce-twin-cam-2000": "NIGHT TRAIN", "harley-davidson-rocker-rocker-c-2008": "ROCKER",
  "harley-davidson-cross-bones-2008": "CROSS BONES", "harley-davidson-x350-x500-2024": "X500", "harley-davidson-ss250-sx250-sx175-1974": "SX250",
  "harley-davidson-flt-tour-glide-shovelhead-1980": "TOUR GLIDE", "harley-davidson-xlcr-cafe-racer-1977": "XLCR", "harley-davidson-road-king-evo-1994": "ROAD KING",
  "harley-davidson-cvo-limited-ultra-2006": "CVO", "harley-davidson-sport-glide-flsb-2018": "SPORT GLIDE"}
