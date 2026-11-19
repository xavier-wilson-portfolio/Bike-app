"""Batch 56 bike tunes (top 1000, rows 551-560)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch32 import XRS
from batch31 import CBRF, VFRD
from batch22 import VJMC
from batch54 import DIRTNOTE
from batch55 import TT, PREMIX
B56 = []
TWO = CARB + AIR + ["H-003"]
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."

B56.append(mk("honda-cr80r-cr85r-1980", "Honda", "CR80R / CR85R", "Honda CR80R / CR85R", [1980, 2007],
  ["cr80r", "cr85r", "cr80", "cr85", "cr 80", "cr 85", "cr85rb", "cr80rb"], "dualsport", "chain",
  "80 or 85 cc two-stroke single, liquid-cooled on most years, carb, premix",
  "Honda's mini motocross two-strokes. Premix, a top end that wears fast and small parts that are easy to lose.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, DIRTNOTE, [TT], lessons={"B": [PREMIX]}))

B56.append(mk("honda-xl100-xl125-1972", "Honda", "XL100 / XL125", "Honda XL100 / XL125", [1972, 1985],
  ["xl100", "xl125", "xl 100", "xl 125", "xl100s", "xl125s"], "dualsport", "chain",
  "99 or 124 cc air-cooled overhead-cam single, carb",
  "Honda's small dual-sports of the 70s and early 80s. Simple singles with points and six-volt electrics on many.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Cam chain", "Adjust it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XRS], lessons={"B": [POINTS]}))

B56.append(mk("honda-xl185-xl200r-1979", "Honda", "XL185 / XL200R", "Honda XL185 / XL200R", [1979, 1984],
  ["xl185", "xl200r", "xl185s", "xl200", "xl 185", "xl 200", "xl 200r"], "dualsport", "chain",
  "180 or 195 cc air-cooled overhead-cam single, carb",
  "Honda's middle dual-sports of the early 80s. Light and simple, with a kick start and a single carb.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Cam chain", "Adjust it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XRS]))

B56.append(mk("honda-xl500s-1979", "Honda", "XL500S", "Honda XL500S", [1979, 1981],
  ["xl500s", "xl500", "xl 500", "xl 500s", "xl500r"], "dualsport", "chain",
  "498 cc air-cooled four-valve single, carb, kick start, decompressor",
  "Honda's big four-valve dual-sport. A 23-inch front wheel, a kick start and a decompressor to get right.",
  [["Big single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Starting", "Decompressor"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XRS]))

B56.append(mk("honda-xr350r-xr500r-1981", "Honda", "XR350R / XR500R", "Honda XR350R / XR500R", [1981, 1985],
  ["xr350r", "xr500r", "xr350", "xr500", "xr 350", "xr 500", "xr 500r"], "dualsport", "chain",
  "339 or 497 cc air-cooled four-valve single, carb, kick start",
  "Honda's big early-80s XRs. Kick start only, with a decompressor and old suspension worth rebuilding.",
  [["Big single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Starting", "Decompressor"], ["Suspension", "Rebuild it"]],
  CARB, OLD, [XRS]))

B56.append(mk("honda-nx650-dominator-1988", "Honda", "NX650 Dominator", "Honda NX650 Dominator", [1988, 1989],
  ["nx650", "nx 650", "dominator", "nx650 dominator", "honda dominator"], "dualsport", "chain",
  "644 cc air-cooled four-valve single, carb, electric start",
  "Honda's big street-leaning dual-sport. The XR600 engine family with electric start and a small fairing.",
  [["Big single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Charging", "Check stator"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XRS]))

B56.append(mk("honda-nx250-nx125-1988", "Honda", "NX250 / NX125", "Honda NX250 / NX125", [1988, 1990],
  ["nx250", "nx125", "nx 250", "nx 125", "ax-1", "ax1"], "dualsport", "chain",
  "124 cc air-cooled or 249 cc liquid-cooled single, carb",
  "Honda's late-80s small dual-sports. The NX250 has a liquid-cooled four-valve engine; the NX125 is air-cooled.",
  [["Single", "Air or liquid"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Cooling", "Check coolant"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XRS]))

B56.append(mk("honda-cb1000c-cb1100f-1983", "Honda", "CB1000C / CB1100F", "Honda CB1000C / CB1100F", [1983, 1983],
  ["cb1000c", "cb1100f", "cb 1100f", "cb 1000c", "cb1100f super sport", "cb1000 custom"], "standard", "chain",
  "973 or 1062 cc air-cooled DOHC inline four, four carbs",
  "Honda's one-year big fours of 1983. The CB1100F is the last of the air-cooled DOHC sport fours; the CB1000C is the custom.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Cam chain", "Check tensioner"], ["Charging", "Check R/R"], ["Final drive", "Chain or shaft"]],
  CARB, OLD, [VJMC]))

B56.append(mk("honda-cb900c-custom-1980", "Honda", "CB900C Custom", "Honda CB900C Custom", [1980, 1982],
  ["cb900c", "cb 900c", "cb900 custom", "cb900c custom"], "standard", "shaft",
  "902 cc air-cooled DOHC inline four, four carbs, ten-speed (dual range), shaft drive",
  "Honda's shaft-drive custom four. A two-range gearbox gives ten speeds, and the shaft needs its own oil.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Dual range", "Check shifter"], ["Cam chain", "Check tensioner"], ["Shaft", "Change oil"]],
  CARB, OLD, [VJMC]))

B56.append(mk("honda-vfr750r-rc30-1990", "Honda", "VFR750R RC30", "Honda VFR750R RC30", [1990, 1991],
  ["rc30", "rc 30", "vfr750r", "vfr 750r", "vfr750r rc30"], "sport", "chain",
  "748 cc liquid-cooled V4, gear-driven cams, four carbs, single-sided swingarm",
  "Honda's homologation V4. Gear-driven cams, titanium rods and parts that cost a lot, so work slowly.",
  [["V4", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and hoses"], ["Parts", "Source early"]],
  CARB, OLD, [VFRD]))

HERO_NAME_B56 = {"honda-cr80r-cr85r-1980": "CR85R", "honda-xl100-xl125-1972": "XL125", "honda-xl185-xl200r-1979": "XL200R", "honda-xl500s-1979": "XL500S",
  "honda-xr350r-xr500r-1981": "XR500R", "honda-nx650-dominator-1988": "DOMINATOR", "honda-nx250-nx125-1988": "NX250", "honda-cb1000c-cb1100f-1983": "CB1100F",
  "honda-cb900c-custom-1980": "CB900C", "honda-vfr750r-rc30-1990": "RC30"}
