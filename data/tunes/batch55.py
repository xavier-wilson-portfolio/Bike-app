"""Batch 55 bike tunes (top 1000, rows 541-550)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch32 import XRS
from batch54 import DIRTNOTE
B55 = []
TWO = CARB + AIR + ["H-003"]
TT = dict(name="ThumperTalk", url="https://www.thumpertalk.com/", what="Big dirt bike forum with model sections for most off-road bikes.")
PREMIX = "It runs on premix. Mix the oil into the fuel at the ratio in the manual."

B55.append(mk("honda-xr50r-xr70r-1997", "Honda", "XR50R / XR70R", "Honda XR50R / XR70R", [1997, 2003],
  ["xr50r", "xr70r", "xr50", "xr70", "xr 50", "xr 70", "xr 50r", "xr 70r"], "dualsport", "chain",
  "49 or 72 cc air-cooled four-stroke single, carb, automatic clutch",
  "Honda's kids' dirt bikes. Three or four speeds, no clutch lever, and very simple to keep running.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Auto clutch", "Adjust it"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  CARB, DIRTNOTE, [XRS]))

B55.append(mk("honda-crf50f-crf70f-2004", "Honda", "CRF50F / CRF70F", "Honda CRF50F / CRF70F", [2004, 2026],
  ["crf50f", "crf70f", "crf50", "crf70", "crf 50", "crf 70", "crf 50f", "crf 70f"], "dualsport", "chain",
  "49 or 72 cc air-cooled four-stroke single, carb, automatic clutch",
  "The XR50 and XR70 under a new name. Same simple engines with an automatic clutch.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Auto clutch", "Adjust it"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  CARB, DIRTNOTE, [XRS]))

B55.append(mk("honda-crf110f-2013", "Honda", "CRF110F", "Honda CRF110F", [2013, 2026],
  ["crf110f", "crf110", "crf 110", "crf 110f"], "dualsport", "chain",
  "109 cc air-cooled four-stroke single, carb then fuel injection, automatic clutch",
  "Honda's bigger kids' bike. Electric start, an automatic clutch and fuel injection on later years.",
  [["Small single", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Auto clutch", "Adjust it"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  [], DIRTNOTE, [TT]))

B55.append(mk("honda-crf125f-2014", "Honda", "CRF125F", "Honda CRF125F", [2014, 2026],
  ["crf125f", "crf125", "crf 125", "crf 125f", "crf125fb"], "dualsport", "chain",
  "124 cc air-cooled four-stroke single, carb then fuel injection, four-speed",
  "Honda's small trail bike with a real clutch. Easy to work on and hard to kill.",
  [["Small single", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Clutch", "Adjust cable"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  [], DIRTNOTE, [TT]))

B55.append(mk("honda-crf150f-crf230f-2003", "Honda", "CRF150F / CRF230F", "Honda CRF150F / CRF230F", [2003, 2019],
  ["crf150f", "crf230f", "crf150", "crf230", "crf 150f", "crf 230f", "crf 230"], "dualsport", "chain",
  "149 or 223 cc air-cooled four-stroke single, carb, electric start",
  "Honda's trail bikes. Air-cooled, electric start and a carb that does not like old fuel.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  CARB, DIRTNOTE, [TT]))

B55.append(mk("honda-crf250r-2004", "Honda", "CRF250R", "Honda CRF250R", [2004, 2026],
  ["crf250r", "crf 250r", "crf250rx", "crf 250rx"], "dualsport", "chain",
  "249 cc liquid-cooled four-stroke single, carb then fuel injection",
  "Honda's 250 motocross four-stroke. It revs very high and needs valve checks on a schedule measured in hours.",
  [["Race single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], DIRTNOTE, [TT]))

B55.append(mk("honda-crf450r-2002", "Honda", "CRF450R", "Honda CRF450R", [2002, 2026],
  ["crf450r", "crf 450r", "crf450rx", "crf 450rx", "crf450"], "dualsport", "chain",
  "449 cc liquid-cooled four-stroke single, carb then fuel injection",
  "Honda's open-class motocross bike. Strong, but the valves and piston have service intervals in hours.",
  [["Race single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], DIRTNOTE, [TT]))

B55.append(mk("honda-crf250x-crf450x-2004", "Honda", "CRF250X / CRF450X", "Honda CRF250X / CRF450X", [2004, 2017],
  ["crf250x", "crf450x", "crf 250x", "crf 450x", "crf250 x", "crf450 x"], "dualsport", "chain",
  "249 or 449 cc liquid-cooled four-stroke single, carb, electric start",
  "Honda's enduro versions of the CRF racers. Electric start, wider gearing and a carb that is often re-jetted.",
  [["Single", "Liquid-cooled"], ["Carb", "Check jetting"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  CARB, DIRTNOTE, [TT]))

B55.append(mk("honda-cr125r-1973", "Honda", "CR125R", "Honda CR125R", [1973, 2007],
  ["cr125r", "cr125", "cr 125", "cr 125r", "elsinore 125", "cr125m"], "dualsport", "chain",
  "123 cc two-stroke single, air-cooled then liquid-cooled, carb, premix",
  "Honda's 125 motocross two-stroke. Premix, a top end that needs regular rebuilds, and a power valve on later years.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Power valve", "Clean it"], ["Chain drive", "Slack and lube"]],
  TWO, DIRTNOTE, [TT], lessons={"B": [PREMIX]}))

B55.append(mk("honda-cr500r-1984", "Honda", "CR500R", "Honda CR500R", [1984, 2001],
  ["cr500r", "cr500", "cr 500", "cr 500r"], "dualsport", "chain",
  "491 cc liquid-cooled two-stroke single, carb, premix",
  "Honda's big open-class two-stroke. Huge power, premix, and a kick start that takes some practice.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, DIRTNOTE, [TT], lessons={"B": [PREMIX]}))

HERO_NAME_B55 = {"honda-xr50r-xr70r-1997": "XR50R", "honda-crf50f-crf70f-2004": "CRF50F", "honda-crf110f-2013": "CRF110F", "honda-crf125f-2014": "CRF125F",
  "honda-crf150f-crf230f-2003": "CRF230F", "honda-crf250r-2004": "CRF250R", "honda-crf450r-2002": "CRF450R", "honda-crf250x-crf450x-2004": "CRF450X",
  "honda-cr125r-1973": "CR125R", "honda-cr500r-1984": "CR500R"}
