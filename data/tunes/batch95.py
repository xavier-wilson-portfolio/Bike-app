"""Batch 95 bike tunes (top 1000, rows 941-950)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch29 import DMS, KTMF
from batch44 import DUCNOTE, DESMOV
from batch45 import KTMNOTE
from batch77 import KDIRT2
from batch12 import GWP
from batch30 import GUZ
from batch55 import TT, PREMIX
B95 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B95.append(mk("ducati-851-888-1987", "Ducati", "851 / 888", "Ducati 851 / 888", [1987, 1994],
  ["851", "888", "ducati 851", "ducati 888", "851 sp", "888 sp", "851 strada", "888 strada"], "sport", "chain",
  "851 or 888 cc liquid-cooled four-valve desmo V-twin, fuel injected",
  "The first four-valve Desmoquattro Ducatis. Fuel injected, belt cams and a dry clutch.",
  [["Desmo twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Dry clutch", "Check plates"]],
  EFI, OLD, [DMS], lessons={"H": [DESMOV]}))

B95.append(mk("ducati-indiana-650-750-1986", "Ducati", "Indiana 650 / 750", "Ducati Indiana", [1986, 1990],
  ["indiana", "indiana 650", "indiana 750", "ducati indiana", "indiana 350"], "cruiser", "chain",
  "649 or 748 cc air-cooled belt-driven desmo V-twin, two carbs",
  "Ducati's Cagiva-era cruiser. A Pantah-family engine in a custom frame, and rare now.",
  [["Desmo twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Parts", "Source early"]],
  CARB, OLD, [DMS], lessons={"H": [DESMOV]}))

B95.append(mk("ducati-streetfighter-v2-2022", "Ducati", "Streetfighter V2", "Ducati Streetfighter V2", [2022, 2026],
  ["streetfighter v2", "sf v2", "streetfighter 955", "streetfighter v2 s"], "standard", "chain",
  "955 cc liquid-cooled Superquadro V-twin, fuel injected",
  "The naked Panigale V2. A Superquadro twin with chain cams and a full electronics package.",
  [["Superquadro twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "Shim check"], ["Electronics", "Scan for codes"], ["Chain drive", "Slack and lube"]],
  EFI, DUCNOTE, [DMS], lessons={"H": [DESMOV]}))

B95.append(mk("ktm-625-660-smc-2004", "KTM", "625 / 660 SMC", "KTM 625 / 660 SMC", [2004, 2007],
  ["625 smc", "660 smc", "smc 625", "smc 660", "625 sxc", "660 rally"], "dualsport", "chain",
  "609 or 654 cc liquid-cooled LC4 single, carb",
  "KTM's LC4 supermotos before the 690. A big single, a carb and a dry-sump oil system.",
  [["LC4 single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Oil", "Dry sump"], ["Chain drive", "Slack and lube"]],
  CARB, KTMNOTE, [KTMF]))

B95.append(mk("ktm-450-smr-2004", "KTM", "450 SMR", "KTM 450 SMR", [2004, 2026],
  ["450 smr", "smr 450", "450 smr ktm", "560 smr", "450 sms"], "dualsport", "chain",
  "449 cc liquid-cooled four-stroke single, carb then fuel injection",
  "KTM's supermoto racer. Based on the SX-F engine, with race-only service intervals.",
  [["Race single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Brakes", "Check them"], ["Hours", "Log them"]],
  [], KDIRT2, [KTMF]))

B95.append(mk("honda-gold-wing-2018-on-2018", "Honda", "Gold Wing (2018 on)", "Honda Gold Wing (2018 on)", [2018, 2026],
  ["gold wing", "goldwing", "gl1800", "gold wing tour", "gl1800b", "gl1800d", "gold wing dct", "gold wing 2018"], "touring", "shaft",
  "1833 cc liquid-cooled flat six, fuel injected, manual or DCT, shaft drive",
  "The redesigned Gold Wing. A double-wishbone front end, a DCT on many and a lot of electronics.",
  [["Flat six", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["DCT", "Check fluid"], ["Electronics", "Scan for codes"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [GWP]))

B95.append(mk("ktm-125-200-duke-2011-2016-2011", "KTM", "125 / 200 Duke (2011-2016)", "KTM 125 / 200 Duke (2011-2016)", [2011, 2016],
  ["125 duke", "200 duke", "duke 125", "duke 200", "ktm 200 duke", "ktm 125 duke"], "standard", "chain",
  "124 or 199 cc liquid-cooled single, fuel injected",
  "The first small Dukes. Fuel injected, light and built in India by Bajaj.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, KTMNOTE, [KTMF]))

B95.append(mk("ktm-gs-mx-air-cooled-two-stroke-1974", "KTM", "GS / MX (air-cooled two-stroke)", "KTM GS / MX (air-cooled)", [1974, 1987],
  ["250 gs", "400 gs", "ktm gs", "ktm mx", "250 mx", "495", "125 gs", "ktm 400"], "dualsport", "chain",
  "125 to 495 cc air-cooled two-stroke single, premix",
  "The early KTMs. Air-cooled premix two-strokes for enduro and motocross, with a strong vintage racing scene.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check flywheel"], ["Parts", "Source early"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B95.append(mk("moto-guzzi-bellagio-2007", "Moto Guzzi", "Bellagio", "Moto Guzzi Bellagio", [2007, 2013],
  ["bellagio", "bellagio 940", "bellagio aquila nera", "guzzi bellagio"], "cruiser", "shaft",
  "936 cc air-cooled 90-degree V-twin, fuel injected, shaft drive",
  "Guzzi's sporty cruiser. The big-block twin with fuel injection and a CARC-style shaft.",
  [["V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Set them"], ["Clutch", "Check it"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [GUZ]))

B95.append(mk("moto-guzzi-nevada-750-1991", "Moto Guzzi", "Nevada 750", "Moto Guzzi Nevada 750", [1991, 2015],
  ["nevada", "nevada 750", "nevada classic", "nevada club", "nevada 350", "nevada aquila nera"], "cruiser", "shaft",
  "744 cc air-cooled 90-degree V-twin, carbs then fuel injection, shaft drive",
  "Guzzi's small-block cruiser. Simple, light for a cruiser, and shaft drive.",
  [["V-twin", "Air-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Set them"], ["Clutch", "Check it"], ["Shaft", "Change oil"]],
  [], GENNOTE, [GUZ]))

HERO_NAME_B95 = {"ducati-851-888-1987": "851", "ducati-indiana-650-750-1986": "INDIANA", "ducati-streetfighter-v2-2022": "STREETFIGHTER V2",
  "ktm-625-660-smc-2004": "625 SMC", "ktm-450-smr-2004": "450 SMR", "honda-gold-wing-2018-on-2018": "GOLD WING", "ktm-125-200-duke-2011-2016-2011": "200 DUKE",
  "ktm-gs-mx-air-cooled-two-stroke-1974": "KTM GS", "moto-guzzi-bellagio-2007": "BELLAGIO", "moto-guzzi-nevada-750-1991": "NEVADA"}
