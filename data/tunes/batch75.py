"""Batch 75 bike tunes (top 1000, rows 741-750)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch20 import TRF
from batch43 import TRNOTE
from batch29 import DMS
from batch44 import DUCNOTE, DESMOV
B75 = []
BEVEL = "The bevel-drive cams are set with shims and need patience. Check the bevel gear backlash and the desmo shims before you run it hard."

B75.append(mk("triumph-tt600-daytona-600-650-2000", "Triumph", "TT600 / Daytona 600 / 650", "Triumph TT600 / Daytona 600 / 650", [2000, 2005],
  ["tt600", "daytona 600", "daytona 650", "tt 600", "triumph tt600", "speed four"], "sport", "chain",
  "599 or 646 cc liquid-cooled inline four, fuel injected",
  "Triumph's four-cylinder 600s. Fuel injected, with an aluminum frame and the naked Speed Four sibling.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  EFI, TRNOTE, [TRF]))

B75.append(mk("triumph-street-triple-675-2008", "Triumph", "Street Triple 675", "Triumph Street Triple 675", [2008, 2016],
  ["street triple 675", "street triple", "street triple r", "675 street triple", "street triple rx"], "standard", "chain",
  "675 cc liquid-cooled triple, fuel injected",
  "The first Street Triples. The Daytona 675 engine in a naked bike, with a lot of shared parts.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  EFI, TRNOTE, [TRF]))

B75.append(mk("triumph-trophy-se-1200-2013", "Triumph", "Trophy SE 1200", "Triumph Trophy SE 1200", [2013, 2017],
  ["trophy se", "trophy 1200 se", "trophy se 1200", "trophy 2013", "triumph trophy se"], "touring", "shaft",
  "1215 cc liquid-cooled triple, fuel injected, shaft drive, electronic suspension",
  "Triumph's big shaft-drive tourer. The Explorer triple, electronic suspension and a lot of bodywork.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Shaft", "Change oil"]],
  EFI, TRNOTE, [TRF]))

B75.append(mk("triumph-tiger-sport-660-2022", "Triumph", "Tiger Sport 660", "Triumph Tiger Sport 660", [2022, 2026],
  ["tiger sport 660", "tiger 660", "tiger sport 660 2022", "tiger 660 sport"], "touring", "chain",
  "660 cc liquid-cooled triple, fuel injected",
  "Triumph's small sport tourer on the Trident 660 platform. Fuel injected, light and simple to service.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, TRNOTE, [TRF]))

B75.append(mk("triumph-tiger-1200-2022-on-2022", "Triumph", "Tiger 1200 (2022 on)", "Triumph Tiger 1200 (2022 on)", [2022, 2026],
  ["tiger 1200", "tiger 1200 gt", "tiger 1200 rally", "tiger 1200 gt pro", "tiger 1200 rally explorer", "tiger 1200 gt explorer"], "adventure", "shaft",
  "1160 cc liquid-cooled T-plane triple, fuel injected, shaft drive",
  "The 2022 redesign of the big Tiger. A T-plane triple, semi-active suspension and a lighter frame.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Suspension", "Semi-active"], ["Shaft", "Change oil"]],
  EFI, TRNOTE, [TRF]))

B75.append(mk("triumph-daytona-660-2024", "Triumph", "Daytona 660", "Triumph Daytona 660", [2024, 2026],
  ["daytona 660", "daytona660", "triumph daytona 660"], "sport", "chain",
  "660 cc liquid-cooled triple, fuel injected",
  "Triumph's 2024 sport triple. The Trident engine tuned for more power, with a full fairing.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, TRNOTE, [TRF]))

B75.append(mk("ducati-paso-750-906-907-1986", "Ducati", "Paso 750 / 906 / 907", "Ducati Paso 750 / 906 / 907", [1986, 1993],
  ["paso", "paso 750", "paso 906", "907 ie", "907ie", "paso 907", "906 paso"], "sport", "chain",
  "748 or 904 cc air/oil or liquid-cooled desmo V-twin, carb then fuel injection on the 907",
  "Ducati's fully faired Paso. Bodywork hides everything, and the 907 ie brought fuel injection.",
  [["Desmo twin", "Air or liquid"], ["Fuel", "Carb or EFI"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Bodywork", "Many panels"]],
  [], OLD, [DMS], lessons={"H": [DESMOV]}))

B75.append(mk("ducati-pantah-500-600-1980", "Ducati", "Pantah 500 / 600", "Ducati Pantah 500 / 600", [1980, 1984],
  ["pantah", "pantah 500", "pantah 600", "500sl", "600sl", "600tl", "pantah 650"], "sport", "chain",
  "499 to 649 cc air-cooled belt-driven desmo V-twin, two carbs",
  "The first belt-cam Ducati twin. Two carbs, desmo heads and the engine family behind every later air-cooled Ducati.",
  [["Desmo twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Parts", "Source early"]],
  CARB, OLD, [DMS], lessons={"H": [DESMOV]}))

B75.append(mk("ducati-750-sport-750ss-bevel-1972", "Ducati", "750 Sport / 750SS (bevel)", "Ducati 750 Sport / 750SS (bevel)", [1972, 1974],
  ["750 sport", "750ss bevel", "750 super sport", "750 gt", "750gt", "round case", "bevel 750"], "sport", "chain",
  "748 cc air-cooled bevel-drive V-twin, desmo on the SS, two carbs",
  "Ducati's round-case bevel twins. Very valuable now, with bevel-drive cams and parts best sourced from specialists.",
  [["Bevel twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Bevel drive", "Check backlash"], ["Valves", "Shim check"], ["Parts", "Source early"]],
  CARB, OLD, [DMS], lessons={"H": [BEVEL]}))

B75.append(mk("ducati-900ss-mike-hailwood-replica-bevel-1975", "Ducati", "900SS / Mike Hailwood Replica (bevel)", "Ducati 900SS / MHR (bevel)", [1975, 1985],
  ["mhr", "mike hailwood replica", "hailwood replica", "900ss bevel", "900 ss bevel", "mhr 900", "mille mhr", "square case"], "sport", "chain",
  "864 or 973 cc air-cooled bevel-drive desmo V-twin, two carbs",
  "The square-case bevel 900s. Desmo heads, big carbs and the race replica bodywork on the MHR.",
  [["Bevel twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Bevel drive", "Check backlash"], ["Desmo valves", "Shim check"], ["Parts", "Source early"]],
  CARB, OLD, [DMS], lessons={"H": [BEVEL]}))

HERO_NAME_B75 = {"triumph-tt600-daytona-600-650-2000": "TT600", "triumph-street-triple-675-2008": "STREET TRIPLE", "triumph-trophy-se-1200-2013": "TROPHY SE",
  "triumph-tiger-sport-660-2022": "TIGER SPORT", "triumph-tiger-1200-2022-on-2022": "TIGER 1200", "triumph-daytona-660-2024": "DAYTONA 660",
  "ducati-paso-750-906-907-1986": "PASO", "ducati-pantah-500-600-1980": "PANTAH", "ducati-750-sport-750ss-bevel-1972": "750 SPORT",
  "ducati-900ss-mike-hailwood-replica-bevel-1975": "MHR"}
