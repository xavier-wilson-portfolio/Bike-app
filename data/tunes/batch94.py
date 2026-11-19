"""Batch 94 bike tunes (top 1000, rows 931-940)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch22 import VJMC
from batch19 import AMCA
from batch29 import ADVR
from batch20 import TRF
from batch43 import TRNOTE
from batch51 import MOPED
from batch55 import PREMIX
from batch67 import CCI
B94 = []
TWO = CARB + AIR + ["H-003"]
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."

B94.append(mk("suzuki-fa50-shuttle-1980", "Suzuki", "FA50 Shuttle", "Suzuki FA50 Shuttle", [1980, 1983],
  ["fa50", "shuttle", "fa 50", "suzuki shuttle"], "scooter", "chain",
  "49 cc air-cooled two-stroke single, CCI oil injection, automatic",
  "Suzuki's step-through moped of the early 80s. Oil injection and a one-speed automatic.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Auto clutch", "Inspect"], ["Exhaust", "Check carbon"], ["Brakes", "Drums"]],
  TWO, OLD, [MOPED], lessons={"B": [CCI]}))

B94.append(mk("suzuki-dr800-big-1990", "Suzuki", "DR800 Big", "Suzuki DR800 Big", [1990, 1997],
  ["dr800", "dr big", "dr 800", "dr750 big", "dr800s", "dr big 800"], "adventure", "chain",
  "779 cc air/oil-cooled single, two carbs, two balancer shafts",
  "Suzuki's huge single with the beak. Oil-cooled, two carbs and a big tank; most were sold outside the US.",
  [["Big single", "Air/oil-cooled"], ["Two carbs", "Clean them"], ["Valves", "Check them"], ["Starter", "Check clutch"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [ADVR]))

B94.append(mk("harley-davidson-mt350-mt500-military-1993", "Harley-Davidson", "MT350 / MT500 military", "Harley-Davidson MT350 / MT500", [1993, 2000],
  ["mt500", "mt350", "mt350e", "mt 500", "mt 350", "harley mt500", "armstrong mt500"], "dualsport", "chain",
  "348 or 482 cc air-cooled Rotax single, carb",
  "Harley's military dual-sports, built from the Armstrong design with Rotax engines. Most were sold to armed forces.",
  [["Rotax single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Oil", "Dry sump"], ["Parts", "Source early"]],
  CARB, OLD, [ADVR]))

B94.append(mk("harley-davidson-rapido-baja-100-1968", "Harley-Davidson", "Rapido / Baja 100", "Harley-Davidson Rapido / Baja 100", [1968, 1972],
  ["rapido", "baja", "baja 100", "ml125", "msr100", "harley rapido"], "dualsport", "chain",
  "98 or 123 cc air-cooled Aermacchi two-stroke single, premix",
  "Harley's small Italian-built trail two-strokes. Premix and parts that are hard to find.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check spark"], ["Parts", "Source early"]],
  TWO, OLD, [AMCA], lessons={"B": [PREMIX]}))

B94.append(mk("harley-davidson-m-50-m-65-leggero-1965", "Harley-Davidson", "M-50 / M-65 / Leggero", "Harley-Davidson M-50 / M-65 / Leggero", [1965, 1972],
  ["m-50", "m-65", "leggero", "m50", "m65", "shortster", "x90", "m-65s"], "standard", "chain",
  "49 to 90 cc air-cooled Aermacchi two-stroke single, premix",
  "Harley's tiny Italian two-strokes. Premix, small parts and a lot of rust on most survivors.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Ignition", "Check spark"], ["Frame", "Check rust"], ["Parts", "Source early"]],
  TWO, OLD, [AMCA], lessons={"B": [PREMIX]}))

B94.append(mk("triumph-tiger-850-sport-2021", "Triumph", "Tiger 850 Sport", "Triumph Tiger 850 Sport", [2021, 2026],
  ["tiger 850", "tiger 850 sport", "tiger850"], "adventure", "chain",
  "888 cc liquid-cooled T-plane triple, fuel injected",
  "The road-focused budget Tiger. The Tiger 900 engine tuned for less power, with simpler suspension.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, TRNOTE, [TRF]))

B94.append(mk("triumph-daytona-900-1200-hinckley-1993", "Triumph", "Daytona 900 / 1200 (Hinckley)", "Triumph Daytona 900 / 1200 (Hinckley)", [1993, 1997],
  ["daytona 900", "daytona 1200", "daytona super iii", "daytona 750", "daytona 1000", "super iii"], "sport", "chain",
  "885 cc triple or 1180 cc four, liquid-cooled, carbs",
  "Triumph's early Hinckley sport bikes. A modular triple or four with carbs and a big fairing.",
  [["Triple or four", "Liquid-cooled"], ["Carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TRF]))

B94.append(mk("triumph-x75-hurricane-1973", "Triumph", "X75 Hurricane", "Triumph X75 Hurricane", [1973, 1973],
  ["x75", "x-75", "hurricane", "triumph hurricane", "bsa hurricane", "x75 hurricane"], "standard", "chain",
  "740 cc air-cooled OHV triple, three carbs, three-pipe exhaust",
  "Craig Vetter's one-year triple. A Trident engine, a one-piece fiberglass tank and seat and very collectible.",
  [["OHV triple", "Air-cooled"], ["Three carbs", "Clean and sync"], ["Points", "Gap and time"], ["Fiberglass", "Check cracks"], ["Parts", "Source early"]],
  CARB, OLD, [TRF], lessons={"B": [POINTS]}))

B94.append(mk("triumph-terrier-t15-1953", "Triumph", "Terrier T15", "Triumph Terrier T15", [1953, 1956],
  ["terrier", "t15", "t 15", "triumph terrier", "terrier 150"], "standard", "chain",
  "149 cc air-cooled OHV unit single",
  "Triumph's first unit-construction single, the father of the Tiger Cub. Small, simple and rare now.",
  [["OHV single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Plunger rear", "Check it"], ["Parts", "Source early"]],
  CARB, OLD, [TRF], lessons={"B": [POINTS]}))

B94.append(mk("triumph-3ta-5ta-unit-350-500-1957", "Triumph", "3TA / 5TA (unit 350 / 500)", "Triumph 3TA Twenty-One / 5TA Speed Twin", [1957, 1966],
  ["3ta", "5ta", "twenty-one", "twenty one", "tiger 90", "t90", "speed twin 5ta", "3ta twenty-one"], "standard", "chain",
  "349 or 490 cc air-cooled OHV unit parallel twin, one carb, points",
  "Triumph's first unit twins. The bathtub rear enclosure on many, one carb and points ignition.",
  [["Unit twin", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Primary", "Set chain"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TRF], lessons={"B": [POINTS]}))

HERO_NAME_B94 = {"suzuki-fa50-shuttle-1980": "SHUTTLE", "suzuki-dr800-big-1990": "DR BIG", "harley-davidson-mt350-mt500-military-1993": "MT500",
  "harley-davidson-rapido-baja-100-1968": "RAPIDO", "harley-davidson-m-50-m-65-leggero-1965": "LEGGERO", "triumph-tiger-850-sport-2021": "TIGER 850",
  "triumph-daytona-900-1200-hinckley-1993": "DAYTONA", "triumph-x75-hurricane-1973": "HURRICANE", "triumph-terrier-t15-1953": "TERRIER",
  "triumph-3ta-5ta-unit-350-500-1957": "3TA"}
