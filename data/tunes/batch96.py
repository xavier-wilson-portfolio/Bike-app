"""Batch 96 bike tunes (top 1000, rows 951-960)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch30 import GUZ, REF
from batch46 import APRF, APRNOTE
from batch38 import SCOOT
from batch79 import GUZNOTE
from batch81 import EURO
B96 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B96.append(mk("moto-guzzi-1000-sp-spada-1978", "Moto Guzzi", "1000 SP / Spada", "Moto Guzzi 1000 SP / Spada", [1978, 1990],
  ["1000 sp", "spada", "sp1000", "sp 1000", "spada 1000", "sp ii", "sp iii", "1000 spada"], "touring", "shaft",
  "949 cc air-cooled 90-degree V-twin, two carbs, shaft drive, linked brakes",
  "Guzzi's big sport tourer of the late 70s and 80s. A full fairing, linked brakes and shaft drive.",
  [["V-twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Linked brakes", "Check them"], ["Three oils", "Change all"], ["Shaft", "Change oil"]],
  CARB, OLD, [GUZ], lessons={"K": [GUZNOTE]}))

B96.append(mk("moto-guzzi-quota-1000-1100-1992", "Moto Guzzi", "Quota 1000 / 1100", "Moto Guzzi Quota 1000 / 1100", [1992, 2001],
  ["quota", "quota 1000", "quota 1100", "quota es", "1100 es", "guzzi quota"], "adventure", "shaft",
  "949 or 1064 cc air-cooled V-twin, fuel injected, shaft drive",
  "Guzzi's tall adventure twin of the 90s. Fuel injection, shaft drive and a lot of weight up high.",
  [["V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Set them"], ["Three oils", "Change all"], ["Shaft", "Change oil"]],
  EFI, OLD, [GUZ], lessons={"K": [GUZNOTE]}))

B96.append(mk("moto-guzzi-centauro-1997", "Moto Guzzi", "Centauro", "Moto Guzzi Centauro", [1997, 1999],
  ["centauro", "centauro 1000", "guzzi centauro", "centauro gt", "centauro sport"], "standard", "shaft",
  "992 cc air-cooled four-valve V-twin, fuel injected, shaft drive",
  "Guzzi's odd-looking roadster with the Daytona four-valve engine. Rare, with unique bodywork.",
  [["V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Three oils", "Change all"], ["Shaft", "Change oil"]],
  EFI, OLD, [GUZ], lessons={"K": [GUZNOTE]}))

B96.append(mk("moto-guzzi-mille-gt-1987", "Moto Guzzi", "Mille GT", "Moto Guzzi Mille GT", [1987, 1993],
  ["mille gt", "mille", "1000 gt", "guzzi mille gt", "mille gt 1000"], "standard", "shaft",
  "949 cc air-cooled 90-degree V-twin, two carbs, shaft drive",
  "Guzzi's simple big-block standard. Two carbs, round headlight and very little to go wrong.",
  [["V-twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Set them"], ["Three oils", "Change all"], ["Shaft", "Change oil"]],
  CARB, OLD, [GUZ], lessons={"K": [GUZNOTE]}))

B96.append(mk("moto-guzzi-stornello-1960", "Moto Guzzi", "Stornello", "Moto Guzzi Stornello", [1960, 1975],
  ["stornello", "stornello 125", "stornello 160", "stornello scrambler", "stornello sport"], "standard", "chain",
  "123 or 160 cc air-cooled OHV single",
  "Guzzi's small pushrod single of the 60s and 70s. Simple, light and rare outside Italy.",
  [["OHV single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Valves", "Set them"], ["Parts", "Source early"]],
  CARB, OLD, [GUZ]))

B96.append(mk("aprilia-pegaso-650-1992", "Aprilia", "Pegaso 650", "Aprilia Pegaso 650", [1992, 2009],
  ["pegaso", "pegaso 650", "pegaso strada", "pegaso trail", "pegaso factory", "pegaso cube"], "dualsport", "chain",
  "652 cc liquid-cooled Rotax single, carbs then fuel injection",
  "Aprilia's road-leaning single. A Rotax engine shared with the BMW F650 on early ones, then a Minarelli-built Yamaha engine.",
  [["Single", "Liquid-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Check them"], ["Oil", "Check system"], ["Chain drive", "Slack and lube"]],
  [], APRNOTE, [APRF]))

B96.append(mk("aprilia-scarabeo-500-atlantic-500-2001", "Aprilia", "Scarabeo 500 / Atlantic 500", "Aprilia Scarabeo 500 / Atlantic 500", [2001, 2015],
  ["scarabeo 500", "atlantic 500", "atlantic", "scarabeo 250", "atlantic 250", "scarabeo"], "scooter", "belt",
  "460 cc liquid-cooled single, fuel injected, CVT",
  "Aprilia's big-wheel and maxi scooters. A Piaggio-family single, a CVT and a lot of plastic.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Bodywork", "Many panels"]],
  EFI, APRNOTE, [SCOOT]))

B96.append(mk("royal-enfield-thunderbird-350-500-2002", "Royal Enfield", "Thunderbird 350 / 500", "Royal Enfield Thunderbird 350 / 500", [2002, 2020],
  ["thunderbird", "thunderbird 350", "thunderbird 500", "thunderbird x", "tbird 500", "re thunderbird"], "cruiser", "chain",
  "346 or 499 cc air-cooled single, carb then fuel injection",
  "Royal Enfield's cruiser single. Twin-spark heads on later ones, fuel injection on the 500.",
  [["Single", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Set them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  [], GENNOTE, [REF]))

B96.append(mk("benelli-502c-2019", "Benelli", "502C", "Benelli 502C", [2019, 2026],
  ["502c", "502 c", "benelli 502c", "502"], "cruiser", "chain",
  "500 cc liquid-cooled parallel twin, fuel injected",
  "Benelli's sporty cruiser on the 500 twin. Built by QJ, with parts supply that depends on the dealer.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Parts", "Check supply"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [EURO]))

B96.append(mk("benelli-tnt-1130-tnt-899-tre-k-2005", "Benelli", "TNT 1130 / TNT 899 / TRE-K", "Benelli TNT 1130 / TNT 899 / TRE-K", [2005, 2016],
  ["tnt 1130", "tnt 899", "tre-k", "tre k", "tnt", "tnt sport", "tnt cafe racer", "trek 1130"], "standard", "chain",
  "899 or 1131 cc liquid-cooled triple, fuel injected, side radiators",
  "Benelli's Italian triples before QJ. Strong engines, but electrics and parts supply need checking.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Side radiators"], ["Electrics", "Check them"], ["Parts", "Source early"]],
  EFI, GENNOTE, [EURO]))

HERO_NAME_B96 = {"moto-guzzi-1000-sp-spada-1978": "SPADA", "moto-guzzi-quota-1000-1100-1992": "QUOTA", "moto-guzzi-centauro-1997": "CENTAURO",
  "moto-guzzi-mille-gt-1987": "MILLE GT", "moto-guzzi-stornello-1960": "STORNELLO", "aprilia-pegaso-650-1992": "PEGASO",
  "aprilia-scarabeo-500-atlantic-500-2001": "ATLANTIC", "royal-enfield-thunderbird-350-500-2002": "THUNDERBIRD", "benelli-502c-2019": "502C",
  "benelli-tnt-1130-tnt-899-tre-k-2005": "TNT 1130"}
