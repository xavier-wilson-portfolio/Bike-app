"""Batch 99 bike tunes (top 1000, rows 981-990)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch42 import BUELLF
from batch38 import SCOOT
from batch55 import TT
from batch87 import CHINANOTE
from batch86 import TWOFOUR
B99 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
MINI = "These use a small horizontal-shaft engine like a lawnmower's. Engine parts are cheap and common; check the governor, the clutch or torque converter and the chain guard."

B99.append(mk("ebr-1190rx-1190sx-2014", "EBR", "1190RX / 1190SX", "EBR 1190RX / 1190SX", [2014, 2019],
  ["1190rx", "1190sx", "ebr 1190", "1190 rx", "1190 sx", "ebr", "1190rs"], "sport", "belt",
  "1190 cc liquid-cooled 72-degree V-twin, fuel injected, rim-mounted front brake",
  "Erik Buell Racing's superbike. A perimeter rotor on the front wheel, fuel in the frame and limited parts support.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Rim brake", "Check rotor"], ["Fuel frame", "Check leaks"], ["Parts", "Source early"]],
  EFI, GENNOTE, [BUELLF]))

B99.append(mk("buell-super-cruiser-hammerhead-1190-2024", "Buell", "Super Cruiser / Hammerhead 1190", "Buell Super Cruiser / Hammerhead 1190", [2024, 2026],
  ["hammerhead", "hammerhead 1190", "super cruiser", "buell super cruiser", "buell hammerhead", "1190 hammerhead"], "standard", "belt",
  "1190 cc liquid-cooled V-twin, fuel injected",
  "The revived Buell brand's new models on the 1190 engine. Low volume, so check parts support before you start.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Rim brake", "Check rotor"], ["Cooling", "Coolant and fan"], ["Parts", "Check supply"]],
  EFI, GENNOTE, [BUELLF]))

B99.append(mk("baja-motorsports-doodle-bug-mb165-minibike-2006", "Baja Motorsports", "Doodle Bug / MB165 minibike", "Baja Doodle Bug / MB165", [2006, 2019],
  ["doodle bug", "doodlebug", "mb165", "mb200", "baja minibike", "db30", "mini baja"], "standard", "chain",
  "97 to 196 cc air-cooled small-engine single, pull start, centrifugal clutch",
  "Cheap folding and frame mini bikes. Small lawnmower-type engines and a centrifugal clutch.",
  [["Small engine", "Air-cooled"], ["Carb", "Clean it out"], ["Clutch", "Centrifugal"], ["Governor", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, CHINANOTE, [TT], lessons={"L": [MINI]}))

B99.append(mk("monster-moto-80-212-minibike-2010", "Monster Moto", "80 / 212 minibike", "Monster Moto 80 / 212", [2010, 2020],
  ["monster moto", "mm-b80", "mm-b212", "classic 212", "monster 80", "monster moto 212"], "standard", "chain",
  "79 to 212 cc air-cooled small-engine single, pull start, centrifugal clutch",
  "Mini bikes sold through big-box stores. Small horizontal-shaft engines and simple frames.",
  [["Small engine", "Air-cooled"], ["Carb", "Clean it out"], ["Clutch", "Centrifugal"], ["Governor", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, CHINANOTE, [TT], lessons={"L": [MINI]}))

B99.append(mk("kayo-tt125-k2-k4-2018", "Kayo", "TT125 / K2 / K4", "Kayo TT125 / K2 / K4", [2018, 2026],
  ["tt125", "k2", "k4", "kayo tt125", "kayo k2", "kayo k4", "tsd 110", "kayo 250"], "dualsport", "chain",
  "107 to 249 cc air-cooled four-stroke single, carb",
  "Kayo's budget dirt and pit bikes. Simple Chinese-built singles with parts that interchange with many brands.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  CARB, CHINANOTE, [TT]))

B99.append(mk("apollo-agb-37-db-x18-dirt-bike-2010", "Apollo", "AGB-37 / DB-X18 dirt bike", "Apollo dirt bikes", [2010, 2026],
  ["apollo", "agb-37", "db-x18", "dbx18", "agb37", "apollo 125", "db-x19", "rfz"], "dualsport", "chain",
  "107 to 250 cc air-cooled four-stroke single, carb",
  "Apollo's budget pit and dirt bikes. Horizontal or upright Chinese singles with very common parts.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  CARB, CHINANOTE, [TT]))

B99.append(mk("rps-hawk-250-2012", "RPS", "Hawk 250", "RPS Hawk 250", [2012, 2020],
  ["hawk 250", "rps hawk", "hawk", "dlx 250", "hawk dlx"], "dualsport", "chain",
  "229 cc air-cooled single, carb, electric start",
  "A popular budget dual-sport. A simple Chinese single with a carb and electric start.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  CARB, CHINANOTE, [TT]))

B99.append(mk("genuine-blur-220-venture-grande-2007", "Genuine", "Blur 220 / Venture / Grande", "Genuine Blur / Venture / Grande", [2007, 2020],
  ["blur", "blur 220", "venture", "grande", "venture 50", "grande 150", "blur sr"], "scooter", "belt",
  "49 to 220 cc single, two- or four-stroke, CVT",
  "Genuine's other scooters. The Blur 220 is a sporty four-stroke; the Venture and Grande are retro commuters.",
  [["Single", "Check type"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Brakes", "Check them"]],
  CARB, GENNOTE, [SCOOT], lessons={"B": [TWOFOUR]}))

B99.append(mk("daelim-daystar-vjf250-2006", "Daelim", "Daystar / VJF250", "Daelim Daystar / VJF250", [2006, 2013],
  ["daystar", "daystar 250", "vjf250", "vjf 250", "roadwin", "vl125"], "cruiser", "chain",
  "249 cc liquid-cooled V-twin, carb or fuel injection",
  "Daelim's small V-twin cruiser from Korea. Built with Honda-era know-how, with parts supply now thin.",
  [["V-twin", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Cooling", "Coolant and hoses"], ["Parts", "Check supply"], ["Chain drive", "Slack and lube"]],
  [], GENNOTE, [SCOOT]))

B99.append(mk("zontes-350-t-r-x-d-2023", "Zontes", "350 (T / R / X / D)", "Zontes 350", [2023, 2026],
  ["zontes 350", "350t", "350r", "350x", "350d", "zt350", "zontes 350t"], "standard", "chain",
  "348 cc liquid-cooled single, fuel injected, keyless",
  "Zontes's 350 range. Keyless ignition, electronic features and parts that come through the importer.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Check keyless"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, CHINANOTE, [TT]))

HERO_NAME_B99 = {"ebr-1190rx-1190sx-2014": "EBR 1190", "buell-super-cruiser-hammerhead-1190-2024": "HAMMERHEAD", "baja-motorsports-doodle-bug-mb165-minibike-2006": "DOODLE BUG",
  "monster-moto-80-212-minibike-2010": "MONSTER MOTO", "kayo-tt125-k2-k4-2018": "KAYO", "apollo-agb-37-db-x18-dirt-bike-2010": "APOLLO",
  "rps-hawk-250-2012": "HAWK 250", "genuine-blur-220-venture-grande-2007": "BLUR", "daelim-daystar-vjf250-2006": "DAYSTAR", "zontes-350-t-r-x-d-2023": "ZONTES"}
