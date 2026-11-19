"""Batch 74 bike tunes (top 1000, rows 731-740)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch20 import TRF
from batch43 import TRNOTE
B74 = []
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."
PREUNIT = "The gearbox is separate from the engine and has its own oil. Check and change both, and set the primary chain."

B74.append(mk("triumph-thunderbird-6t-1950", "Triumph", "Thunderbird 6T", "Triumph Thunderbird 6T", [1950, 1966],
  ["6t", "thunderbird 6t", "thunderbird 650", "tbird 6t", "triumph 6t"], "standard", "chain",
  "649 cc air-cooled OHV parallel twin, one carb, pre-unit then unit construction",
  "Triumph's touring 650 of the 50s and 60s. One carb, a mild tune and the bathtub rear panel on some years.",
  [["OHV twin", "Air-cooled"], ["Carb", "Clean it out"], ["Ignition", "Mag or points"], ["Primary", "Set chain"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TRF], lessons={"K": [PREUNIT]}))

B74.append(mk("triumph-speed-twin-5t-1938", "Triumph", "Speed Twin 5T", "Triumph Speed Twin 5T", [1938, 1958],
  ["5t", "speed twin", "speed twin 5t", "speed twin 500", "triumph 5t"], "standard", "chain",
  "498 cc air-cooled OHV pre-unit parallel twin, one carb, magneto",
  "Edward Turner's twin that set the pattern for British bikes. Pre-unit, magneto ignition and girder or telescopic forks.",
  [["Pre-unit twin", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Parts", "Source early"]],
  CARB, OLD, [TRF], lessons={"K": [PREUNIT]}))

B74.append(mk("triumph-tiger-100-tr5-trophy-pre-unit-500-1946", "Triumph", "Tiger 100 / TR5 Trophy (pre-unit 500)", "Triumph Tiger 100 / TR5 Trophy (pre-unit)", [1946, 1958],
  ["tr5", "tr5 trophy", "tiger 100", "t100 pre-unit", "trophy 500", "tiger 100 1950"], "standard", "chain",
  "498 cc air-cooled OHV pre-unit parallel twin, magneto",
  "Triumph's sporty pre-unit 500s. The TR5 Trophy is the trials and enduro version.",
  [["Pre-unit twin", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Parts", "Source early"]],
  CARB, OLD, [TRF], lessons={"K": [PREUNIT]}))

B74.append(mk("triumph-tr25w-trophy-250-blazer-1968", "Triumph", "TR25W Trophy 250 / Blazer", "Triumph TR25W Trophy 250", [1968, 1970],
  ["tr25w", "trophy 250", "blazer", "tr25", "blazer ss", "t25"], "standard", "chain",
  "247 cc air-cooled OHV single, one carb, points",
  "Triumph's 250 single, built on the BSA B25 design. Simple, with points and a short-stroke engine.",
  [["OHV single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Oil", "Check level"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TRF], lessons={"B": [POINTS]}))

B74.append(mk("triumph-trident-750-900-hinckley-1991", "Triumph", "Trident 750 / 900 (Hinckley)", "Triumph Trident 750 / 900 (Hinckley)", [1991, 1998],
  ["trident 900", "trident 750", "trident", "t300", "trident 900 sprint", "trident sprint"], "standard", "chain",
  "749 or 885 cc liquid-cooled DOHC triple, three carbs",
  "The first Hinckley Triumphs. A modular triple with three carbs and a spine frame.",
  [["Triple", "Liquid-cooled"], ["Three carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TRF]))

B74.append(mk("triumph-trophy-900-1200-hinckley-1991", "Triumph", "Trophy 900 / 1200 (Hinckley)", "Triumph Trophy 900 / 1200 (Hinckley)", [1991, 2003],
  ["trophy 900", "trophy 1200", "trophy", "triumph trophy 1200", "trophy 1200 1997"], "touring", "chain",
  "885 cc triple or 1180 cc four, liquid-cooled, carbs",
  "Triumph's 90s sport tourers. Triple or four, a big fairing and carbs that need care.",
  [["Triple or four", "Liquid-cooled"], ["Carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TRF]))

B74.append(mk("triumph-daytona-955i-t595-1997", "Triumph", "Daytona 955i / T595", "Triumph Daytona 955i / T595", [1997, 2006],
  ["daytona 955i", "t595", "daytona 955", "955i", "daytona t595", "daytona 955i centennial"], "sport", "chain",
  "955 cc liquid-cooled triple, fuel injected, single-sided swingarm",
  "Triumph's big triple sport bike. Fuel injected, with an aluminum perimeter frame.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  EFI, TRNOTE, [TRF]))

B74.append(mk("triumph-speed-triple-955-t509-1997", "Triumph", "Speed Triple 955 / T509", "Triumph Speed Triple 955 / T509", [1997, 2004],
  ["speed triple 955", "t509", "speed triple 885", "speed triple", "speedie 955"], "standard", "chain",
  "885 or 955 cc liquid-cooled triple, fuel injected",
  "The bug-eyed Speed Triples. Fuel injected triples, twin round headlights and an aluminum frame.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  EFI, TRNOTE, [TRF]))

B74.append(mk("triumph-tiger-885-955i-1993", "Triumph", "Tiger 885 / 955i", "Triumph Tiger 885 / 955i", [1993, 2006],
  ["tiger 885", "tiger 955i", "tiger 955", "tiger 900", "tiger 885i", "tiger t709"], "adventure", "chain",
  "885 or 955 cc liquid-cooled triple, carbs then fuel injection",
  "Triumph's early Tigers. A tall triple with carbs on the first ones and fuel injection later.",
  [["Triple", "Liquid-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  [], TRNOTE, [TRF]))

B74.append(mk("triumph-legend-tt-thunderbird-900-adventurer-1995", "Triumph", "Legend TT / Thunderbird 900 / Adventurer", "Triumph Thunderbird 900 / Legend TT / Adventurer", [1995, 2003],
  ["thunderbird 900", "legend tt", "adventurer", "thunderbird sport", "legend", "thunderbird 885"], "cruiser", "chain",
  "885 cc liquid-cooled triple, three carbs",
  "Triumph's retro triples of the late 90s. Three carbs and classic styling on the modular frame.",
  [["Triple", "Liquid-cooled"], ["Three carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, TRNOTE, [TRF]))

HERO_NAME_B74 = {"triumph-thunderbird-6t-1950": "THUNDERBIRD", "triumph-speed-twin-5t-1938": "SPEED TWIN", "triumph-tiger-100-tr5-trophy-pre-unit-500-1946": "TIGER 100",
  "triumph-tr25w-trophy-250-blazer-1968": "TR25W", "triumph-trident-750-900-hinckley-1991": "TRIDENT", "triumph-trophy-900-1200-hinckley-1991": "TROPHY",
  "triumph-daytona-955i-t595-1997": "DAYTONA", "triumph-speed-triple-955-t509-1997": "SPEED TRIPLE", "triumph-tiger-885-955i-1993": "TIGER",
  "triumph-legend-tt-thunderbird-900-adventurer-1995": "THUNDERBIRD"}
