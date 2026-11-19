"""Batch 98 bike tunes (top 1000, rows 971-980)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch19 import AMCA
from batch27 import HDF
from batch51 import MOPED
from batch81 import EURO
B98 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
MOPEDB = "Moped two-strokes run premix. Mix the oil into the fuel at the ratio in the manual, usually around 50 to 1 with modern oil."
CUSTOM = "Custom builders used S&S or similar engines, so most engine parts are available. Frame, bodywork and wiring parts are another matter; photograph everything before you take it apart."
FLAT = "It is a flathead or F-head. Set the tappets with the engine cold and check the valve guides for wear."

B98.append(mk("garelli-eureka-vip-moped-1970", "Garelli", "Eureka / VIP moped", "Garelli Eureka / VIP", [1970, 1985],
  ["garelli", "eureka", "vip", "garelli vip", "katia"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, premix, pedals",
  "The Italian Garelli mopeds. Simple two-strokes, premix and a pedal start.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Clutch", "Check it"], ["Pedals", "Lube chain"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [MOPEDB]}))

B98.append(mk("horex-imperator-regina-1950", "Horex", "Imperator / Regina", "Horex Imperator / Regina", [1950, 1960],
  ["regina", "imperator", "horex regina", "horex imperator", "resident", "regina 350", "imperator 500"], "standard", "chain",
  "342 or 392 cc OHV single (Regina) or 392 to 497 cc OHC twin (Imperator), air-cooled",
  "The postwar Horex road bikes. The Regina single and the Imperator twin, both rare outside Germany.",
  [["Engine", "Air-cooled"], ["Carb", "Clean it out"], ["Ignition", "Check it"], ["Valves", "Set them"], ["Parts", "Source early"]],
  CARB, OLD, [EURO]))

B98.append(mk("kreidler-florett-1957", "Kreidler", "Florett", "Kreidler Florett", [1957, 1982],
  ["florett", "kreidler florett", "rs", "rmc", "florett rs", "kreidler"], "standard", "chain",
  "49 cc air-cooled two-stroke single, premix",
  "The German 50 cc moped and light bike. Premix, a pressed-steel frame and a strong owner club.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Ignition", "Check flywheel"], ["Clutch", "Check it"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [MOPED], lessons={"B": [MOPEDB]}))

B98.append(mk("mz-baghira-skorpion-1994", "MZ", "Baghira / Skorpion", "MZ Baghira / Skorpion", [1994, 2002],
  ["baghira", "skorpion", "mz skorpion", "mz baghira", "skorpion tour", "skorpion sport"], "standard", "chain",
  "660 cc Yamaha-built single, liquid-cooled, carb",
  "The post-reunification MZs. Yamaha 660 singles in new frames, with engine parts easy and chassis parts hard.",
  [["Yamaha single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Electrics", "Check them"], ["Parts", "Source early"]],
  CARB, OLD, [EURO]))

B98.append(mk("excelsior-super-x-1925-1931-1925", "Excelsior", "Super X (1925-1931)", "Excelsior Super X", [1925, 1931],
  ["super x", "excelsior super x", "super-x", "excelsior 45", "super x 45"], "standard", "chain",
  "45 cubic inch air-cooled F-head or pocket-valve V-twin, unit construction",
  "Excelsior's 45 twin from Chicago. Unit construction, a geared primary and parts that come from the club.",
  [["V-twin", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Set tappets"], ["Oiling", "Check system"], ["Parts", "Source early"]],
  CARB, OLD, [AMCA], lessons={"E": [FLAT]}))

B98.append(mk("indian-brave-warrior-arrow-1949", "Indian", "Brave / Warrior / Arrow", "Indian Brave / Warrior / Arrow", [1949, 1953],
  ["warrior", "brave", "arrow", "indian warrior", "indian brave", "indian arrow", "warrior tt", "scout 1949"], "standard", "chain",
  "220 cc single (Arrow, Brave) or 436 cc OHV twin (Scout, Warrior), air-cooled",
  "Indian's postwar lightweights. Modern ideas, rushed into production, with reliability problems to watch for.",
  [["Engine", "Air-cooled"], ["Carb", "Clean it out"], ["Ignition", "Check it"], ["Valves", "Set them"], ["Parts", "Source early"]],
  CARB, OLD, [AMCA]))

B98.append(mk("big-dog-k9-pitbull-wolf-1994", "Big Dog", "K9 / Pitbull / Wolf", "Big Dog K9 / Pitbull / Wolf", [1994, 2011],
  ["big dog", "k9", "pitbull", "wolf", "mastiff", "chopper", "ridgeback", "bulldog", "coyote"], "cruiser", "belt",
  "107 to 117 cubic inch S&S V-twin, carb or fuel injection, belt drive",
  "Big Dog's production choppers with S&S engines. Engine parts are easy; frame, wiring and bodywork parts are not.",
  [["S&S twin", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Wiring", "Check it"], ["Belt", "Check tension"], ["Parts", "Source early"]],
  [], OLD, [HDF], lessons={"L": [CUSTOM]}))

B98.append(mk("american-ironhorse-texas-chopper-lsc-slammer-1995", "American IronHorse", "Texas Chopper / LSC / Slammer", "American IronHorse", [1995, 2008],
  ["texas chopper", "lsc", "slammer", "legend", "outlaw", "classic", "bandera", "ironhorse"], "cruiser", "belt",
  "107 to 124 cubic inch S&S or TP V-twin, carb or fuel injection, belt drive",
  "American IronHorse's production customs. S&S engines and wide rear tires, from a company that closed in 2008.",
  [["Big twin", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Wiring", "Check it"], ["Belt", "Check tension"], ["Parts", "Source early"]],
  [], OLD, [HDF], lessons={"L": [CUSTOM]}))

B98.append(mk("confederate-hellcat-wraith-1995", "Confederate", "Hellcat / Wraith", "Confederate Hellcat / Wraith", [1995, 2017],
  ["hellcat", "wraith", "confederate", "fighter", "g2 hellcat", "p51", "x132"], "cruiser", "belt",
  "1852 to 2163 cc air-cooled V-twin, carb or fuel injection",
  "Confederate's hand-built bikes. Very few made, so treat every part as irreplaceable and work from photos.",
  [["Big twin", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Frame", "Check welds"], ["Belt", "Check tension"], ["Parts", "Source early"]],
  [], GENNOTE, [HDF]))

B98.append(mk("motus-mst-mstr-2014", "Motus", "MST / MSTR", "Motus MST / MSTR", [2014, 2018],
  ["mst", "mstr", "motus mst", "motus mstr", "mst-r", "baby block"], "touring", "chain",
  "1650 cc liquid-cooled V4 (Baby Block), direct injection",
  "Motus's American sport tourer with a V4 built from a small-block car engine design. Very few made.",
  [["V4", "Liquid-cooled"], ["Direct injection", "Check system"], ["Cooling", "Coolant and fan"], ["Electronics", "Scan for codes"], ["Parts", "Source early"]],
  EFI, GENNOTE, [HDF]))

HERO_NAME_B98 = {"garelli-eureka-vip-moped-1970": "GARELLI", "horex-imperator-regina-1950": "REGINA", "kreidler-florett-1957": "FLORETT",
  "mz-baghira-skorpion-1994": "SKORPION", "excelsior-super-x-1925-1931-1925": "SUPER X", "indian-brave-warrior-arrow-1949": "WARRIOR",
  "big-dog-k9-pitbull-wolf-1994": "BIG DOG", "american-ironhorse-texas-chopper-lsc-slammer-1995": "IRONHORSE", "confederate-hellcat-wraith-1995": "HELLCAT",
  "motus-mst-mstr-2014": "MOTUS"}
