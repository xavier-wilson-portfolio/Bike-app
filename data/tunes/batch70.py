"""Batch 70 bike tunes (top 1000, rows 691-700)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch19 import AMCA
from batch27 import HDNOTE, HDF, XLF
from batch22 import VJMC
from batch67 import CCI
from batch55 import PREMIX
B70 = []
TWO = CARB + AIR + ["H-003"]
FLAT = "It is a flathead. The valves sit beside the cylinder, so set the tappets with the engine cold and check the valve guides for wear."
TOTALLOSS = "Check whether yours has a total-loss or a recirculating oil system before you fill it, and know which one you are running."

B70.append(mk("suzuki-gt125-gt100-1973", "Suzuki", "GT125 / GT100", "Suzuki GT125 / GT100", [1973, 1977],
  ["gt125", "gt100", "gt 125", "gt 100", "gt125 twin"], "standard", "chain",
  "97 to 124 cc air-cooled two-stroke, CCI oil injection",
  "Suzuki's small two-strokes of the 70s. The GT125 is a tiny twin with CCI oil injection.",
  [["Two-stroke", "Oil injection"], ["Carbs", "Clean and sync"], ["CCI pump", "Check it"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI]}))

B70.append(mk("harley-davidson-model-k-kh-1952", "Harley-Davidson", "Model K / KH", "Harley-Davidson Model K / KH", [1952, 1956],
  ["model k", "kh", "kk", "khk", "k model", "khrm", "kr"], "standard", "chain",
  "45 or 55 cubic inch air-cooled side-valve V-twin, unit construction, foot shift",
  "The flathead that came before the Sportster. Unit construction, foot shift and hand-built racing roots.",
  [["Flathead twin", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Set tappets"], ["Ignition", "Points"], ["Parts", "Source early"]],
  CARB, OLD, [AMCA], lessons={"E": [FLAT]}))

B70.append(mk("harley-davidson-servi-car-1932", "Harley-Davidson", "Servi-Car", "Harley-Davidson Servi-Car", [1932, 1973],
  ["servi-car", "servicar", "servi car", "ge", "gel", "g servi-car"], "standard", "chain",
  "45 cubic inch air-cooled side-valve V-twin, three wheels, rear axle",
  "Harley's three-wheel utility trike. The 45 flathead, a car-type rear axle and very long production.",
  [["Flathead twin", "Air-cooled"], ["Carb", "Clean it out"], ["Rear axle", "Check diff"], ["Brakes", "Drums"], ["Parts", "Source early"]],
  CARB, OLD, [AMCA], lessons={"E": [FLAT]}))

B70.append(mk("harley-davidson-hummer-pacer-scat-two-stroke-1948", "Harley-Davidson", "Hummer / Pacer / Scat (two-stroke)", "Harley-Davidson Hummer / Pacer / Scat", [1948, 1966],
  ["hummer", "pacer", "scat", "bt", "bth", "model 125", "ranger", "harley 125"], "standard", "chain",
  "125 or 165 cc air-cooled two-stroke single, premix",
  "Harley's small two-strokes, based on the DKW 125. Premix, a magneto and simple chassis parts.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Top end", "Check piston"], ["Parts", "Source early"]],
  TWO, OLD, [AMCA], lessons={"B": [PREMIX]}))

B70.append(mk("harley-davidson-topper-scooter-1960", "Harley-Davidson", "Topper scooter", "Harley-Davidson Topper", [1960, 1965],
  ["topper", "ah topper", "au topper", "harley topper", "topper scooter"], "scooter", "belt",
  "165 cc air-cooled two-stroke single, premix, belt automatic, pull start",
  "Harley's only scooter. A two-stroke under a fiberglass body, with a belt automatic and a pull starter.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Belt drive", "Inspect"], ["Pull start", "Check rope"], ["Body", "Fiberglass"]],
  TWO, OLD, [AMCA], lessons={"B": [PREMIX]}))

B70.append(mk("harley-davidson-vl-74-flathead-1930", "Harley-Davidson", "VL 74 Flathead", "Harley-Davidson VL 74 Flathead", [1930, 1936],
  ["vl", "vlh", "vld", "vl 74", "74 flathead", "v series", "vlh 80"], "standard", "chain",
  "74 or 80 cubic inch air-cooled side-valve V-twin, total-loss oiling",
  "The big Harley flathead of the early 30s. Total-loss oiling, hand shift and a lot of period parts to source.",
  [["Flathead twin", "Air-cooled"], ["Oiling", "Total loss"], ["Carb", "Clean it out"], ["Valves", "Set tappets"], ["Hand shift", "Check linkage"]],
  CARB, OLD, [AMCA], lessons={"E": [FLAT], "H": [TOTALLOSS]}))

B70.append(mk("harley-davidson-u-ul-flathead-74-80-1937", "Harley-Davidson", "U / UL Flathead 74-80", "Harley-Davidson U / UL Flathead", [1937, 1948],
  ["ul", "uh", "ulh", "u 74", "80 flathead", "ul 74", "u flathead", "ul flathead"], "standard", "chain",
  "74 or 80 cubic inch air-cooled side-valve V-twin, recirculating oil",
  "The big flathead that ran beside the Knucklehead. Recirculating oil, hand shift and a strong club scene.",
  [["Flathead twin", "Air-cooled"], ["Oil pump", "Check it"], ["Carb", "Clean it out"], ["Valves", "Set tappets"], ["Hand shift", "Check linkage"]],
  CARB, OLD, [AMCA], lessons={"E": [FLAT]}))

B70.append(mk("harley-davidson-jd-j-f-head-1915", "Harley-Davidson", "JD / J (F-head)", "Harley-Davidson J / JD (F-head)", [1915, 1929],
  ["jd", "j", "jdh", "f-head", "jd 74", "j 61", "jdh two cam", "harley f-head"], "standard", "chain",
  "61 or 74 cubic inch air-cooled F-head V-twin, total-loss oiling, atmospheric or pushrod inlet",
  "Harley's early big twins. Inlet over exhaust, total-loss oiling and parts that are mostly reproduction now.",
  [["F-head twin", "Air-cooled"], ["Oiling", "Total loss"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Parts", "Source early"]],
  CARB, OLD, [AMCA], lessons={"H": [TOTALLOSS]}))

B70.append(mk("harley-davidson-sportster-xl-xlch-1957-1971-1957", "Harley-Davidson", "Sportster XL / XLCH (1957-1971)", "Harley-Davidson Sportster (1957-1971)", [1957, 1971],
  ["xlch", "xlh", "xl", "early sportster", "sportster 1957", "xl sportster", "xlch 900", "ironhead 1960s"], "standard", "chain",
  "883 cubic centimeter air-cooled OHV V-twin, carb, magneto on many XLCH",
  "The first Ironhead Sportsters. Kick start on the XLCH, magneto ignition and a lot of hand-fitting.",
  [["Ironhead twin", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Valves", "Set them"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XLF]))

B70.append(mk("harley-davidson-street-glide-road-glide-2024-on-2024", "Harley-Davidson", "Street Glide / Road Glide (2024 on)", "Harley-Davidson Street Glide / Road Glide (2024 on)", [2024, 2026],
  ["street glide", "road glide", "flhx", "fltrx", "street glide 2024", "road glide 2024", "streetglide"], "touring", "belt",
  "117 cubic inch Milwaukee-Eight 117 V-twin, fuel injected, belt drive",
  "The 2024 redesign of Harley's baggers. New fairings, a big touch screen and the 117 engine.",
  [["V-twin", "Oil and air cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Belt", "Check tension"], ["Primary", "Change oil"]],
  EFI, HDNOTE, [HDF]))

HERO_NAME_B70 = {"suzuki-gt125-gt100-1973": "GT125", "harley-davidson-model-k-kh-1952": "MODEL K", "harley-davidson-servi-car-1932": "SERVI-CAR",
  "harley-davidson-hummer-pacer-scat-two-stroke-1948": "HUMMER", "harley-davidson-topper-scooter-1960": "TOPPER", "harley-davidson-vl-74-flathead-1930": "VL 74",
  "harley-davidson-u-ul-flathead-74-80-1937": "UL", "harley-davidson-jd-j-f-head-1915": "JD", "harley-davidson-sportster-xl-xlch-1957-1971-1957": "SPORTSTER",
  "harley-davidson-street-glide-road-glide-2024-on-2024": "STREET GLIDE"}
