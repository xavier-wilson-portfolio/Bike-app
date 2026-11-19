"""Batch 79 bike tunes (top 1000, rows 781-790)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch30 import GUZ, REF
from batch44 import CLASSIC
B79 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
GUZNOTE = "Guzzi big twins use a car-type dry clutch and a separate gearbox and final drive. Change all three oils, not just the engine oil."

B79.append(mk("royal-enfield-scram-411-2022", "Royal Enfield", "Scram 411", "Royal Enfield Scram 411", [2022, 2025],
  ["scram 411", "scram", "re scram", "scram 411 royal enfield"], "adventure", "chain",
  "411 cc air/oil-cooled single, fuel injected",
  "The street-scrambler version of the Himalayan. A smaller front wheel and less bodywork on the same simple single.",
  [["Single", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [REF]))

B79.append(mk("royal-enfield-bear-650-2025", "Royal Enfield", "Bear 650", "Royal Enfield Bear 650", [2025, 2026],
  ["bear 650", "interceptor bear 650", "re bear", "bear"], "standard", "chain",
  "648 cc air/oil-cooled parallel twin, fuel injected",
  "Royal Enfield's scrambler on the 650 twin platform. Longer suspension and a two-into-one exhaust.",
  [["Twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [REF]))

B79.append(mk("royal-enfield-classic-650-2025", "Royal Enfield", "Classic 650", "Royal Enfield Classic 650", [2025, 2026],
  ["classic 650", "royal enfield classic 650", "re classic 650", "classic 650 twin"], "standard", "chain",
  "648 cc air/oil-cooled parallel twin, fuel injected",
  "The Classic styling on the 650 twin. Heavy, simple and easy to work on.",
  [["Twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [REF]))

B79.append(mk("royal-enfield-interceptor-750-constellation-1960s-1958", "Royal Enfield", "Interceptor 750 / Constellation (1960s)", "Royal Enfield Interceptor 750 / Constellation", [1958, 1970],
  ["interceptor 750", "constellation", "interceptor", "constellation 700", "royal enfield constellation", "interceptor series ii"], "standard", "chain",
  "692 or 736 cc air-cooled OHV parallel twin, two carbs, wet-sump in the frame",
  "The big Redditch-built Enfield twins. Two carbs, a separate gearbox and oiling that needs to be understood before you ride.",
  [["OHV twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Oiling", "Check system"], ["Gearbox", "Separate oil"], ["Parts", "Source early"]],
  CARB, OLD, [CLASSIC]))

B79.append(mk("moto-guzzi-v7-sport-750s-1971", "Moto Guzzi", "V7 Sport / 750S", "Moto Guzzi V7 Sport / 750S", [1971, 1975],
  ["v7 sport", "750s", "750 s3", "v7 sport 750", "guzzi 750s", "750 s"], "sport", "shaft",
  "748 cc air-cooled 90-degree V-twin, two carbs, shaft drive",
  "Guzzi's first sport twin, on the Tonti frame. Very collectible now, with shaft drive and a separate gearbox.",
  [["V-twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Points", "Gap and time"], ["Three oils", "Change all"], ["Shaft", "Change oil"]],
  CARB, OLD, [GUZ], lessons={"K": [GUZNOTE]}))

B79.append(mk("moto-guzzi-850t-t3-convert-1974", "Moto Guzzi", "850T / T3 / Convert", "Moto Guzzi 850T / T3 / Convert", [1974, 1985],
  ["850t", "t3", "850 t3", "convert", "850t3", "t4", "850 t5", "t5", "850t5"], "touring", "shaft",
  "844 cc air-cooled 90-degree V-twin, two carbs, shaft drive, linked brakes",
  "Guzzi's 850 tourers. Linked brakes on the T3, a torque-converter automatic on the Convert.",
  [["V-twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Linked brakes", "Check them"], ["Three oils", "Change all"], ["Shaft", "Change oil"]],
  CARB, OLD, [GUZ], lessons={"K": [GUZNOTE]}))

B79.append(mk("moto-guzzi-v50-v35-v65-small-block-1977", "Moto Guzzi", "V50 / V35 / V65 small block", "Moto Guzzi V50 / V35 / V65", [1977, 1990],
  ["v50", "v35", "v65", "v65 lario", "v65 sp", "v50 monza", "v35 imola", "lario", "v65 florida", "v75"], "standard", "shaft",
  "346 to 743 cc air-cooled 90-degree V-twin, two carbs, shaft drive",
  "Guzzi's small-block twins. Lighter than the big ones, with shaft drive and a lot of shared parts.",
  [["V-twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Set them"], ["Clutch", "Check it"], ["Shaft", "Change oil"]],
  CARB, OLD, [GUZ]))

B79.append(mk("moto-guzzi-california-ii-iii-1982", "Moto Guzzi", "California II / III", "Moto Guzzi California II / III", [1982, 1993],
  ["california ii", "california iii", "california 1000", "california", "cal ii", "cal iii", "california 2", "california 3"], "cruiser", "shaft",
  "949 cc air-cooled 90-degree V-twin, two carbs, shaft drive, linked brakes",
  "Guzzi's big cruisers of the 80s. Linked brakes, two big carbs and a frame-mounted windscreen on many.",
  [["V-twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Linked brakes", "Check them"], ["Three oils", "Change all"], ["Shaft", "Change oil"]],
  CARB, OLD, [GUZ], lessons={"K": [GUZNOTE]}))

B79.append(mk("moto-guzzi-daytona-1000-sport-1100-1992", "Moto Guzzi", "Daytona 1000 / Sport 1100", "Moto Guzzi Daytona 1000 / Sport 1100", [1992, 1999],
  ["daytona 1000", "sport 1100", "guzzi daytona", "daytona rs", "sport 1100i", "1100 sport", "daytona 1000 rs"], "sport", "shaft",
  "992 or 1064 cc air-cooled V-twin, four-valve heads on the Daytona, carbs or fuel injection",
  "Guzzi's 90s sport twins. The Daytona has the high-cam four-valve heads, and both have shaft drive.",
  [["V-twin", "Air-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Check them"], ["Three oils", "Change all"], ["Shaft", "Change oil"]],
  [], OLD, [GUZ], lessons={"K": [GUZNOTE]}))

B79.append(mk("moto-guzzi-v11-sport-v11-le-mans-1999", "Moto Guzzi", "V11 Sport / V11 Le Mans", "Moto Guzzi V11 Sport / V11 Le Mans", [1999, 2005],
  ["v11 sport", "v11 le mans", "v11", "v11 ballabio", "v11 rosso mandello", "v11 cafe sport", "v11 coppa italia"], "sport", "shaft",
  "1064 cc air-cooled 90-degree V-twin, fuel injected, six-speed, shaft drive",
  "Guzzi's sporty V11 range. Fuel injection, a six-speed box and a shaft that needs regular oil changes.",
  [["V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Set them"], ["Three oils", "Change all"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [GUZ], lessons={"K": [GUZNOTE]}))

HERO_NAME_B79 = {"royal-enfield-scram-411-2022": "SCRAM 411", "royal-enfield-bear-650-2025": "BEAR 650", "royal-enfield-classic-650-2025": "CLASSIC 650",
  "royal-enfield-interceptor-750-constellation-1960s-1958": "INTERCEPTOR", "moto-guzzi-v7-sport-750s-1971": "V7 SPORT", "moto-guzzi-850t-t3-convert-1974": "T3",
  "moto-guzzi-v50-v35-v65-small-block-1977": "V65", "moto-guzzi-california-ii-iii-1982": "CALIFORNIA", "moto-guzzi-daytona-1000-sport-1100-1992": "DAYTONA",
  "moto-guzzi-v11-sport-v11-le-mans-1999": "V11"}
