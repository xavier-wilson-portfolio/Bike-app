"""Batch 62 bike tunes (top 1000, rows 611-620)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch16 import XJB, VTF
from batch15 import YE
from batch36 import YAMF
from batch22 import VJMC
from batch51 import INJ
from batch55 import TT, PREMIX
B62 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
KDIRT = "Off-road models are not always in the NHTSA recall search. Ask a Kawasaki dealer to run the VIN as well."

B62.append(mk("yamaha-xj650lj-seca-turbo-1982", "Yamaha", "XJ650LJ Seca Turbo", "Yamaha XJ650 Seca Turbo", [1982, 1983],
  ["seca turbo", "xj650lj", "xj650 turbo", "xj650t", "xj 650 turbo", "yamaha turbo"], "sport", "shaft",
  "653 cc air-cooled DOHC inline four, turbocharged, carbs, shaft drive",
  "Yamaha's early-80s turbo bike. A blow-through carb setup, a turbo to inspect and shaft drive.",
  [["Inline four", "Air-cooled"], ["Turbo", "Check bearings"], ["Carbs", "Clean and sync"], ["Oil lines", "Check turbo feed"], ["Shaft", "Change oil"]],
  CARB, OLD, [XJB], lessons={"H": ["The turbo is oiled by the engine. Check the feed and return lines and change the oil before the first start."]}))

B62.append(mk("yamaha-gts1000-1993", "Yamaha", "GTS1000", "Yamaha GTS1000", [1993, 1994],
  ["gts1000", "gts 1000", "gts1000a", "gts"], "touring", "chain",
  "1002 cc liquid-cooled inline four, fuel injected, hub-center steering",
  "Yamaha's odd sport tourer with a swingarm front end instead of forks. Rare, with unique steering parts.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Front swingarm", "Check bearings"], ["Cooling", "Coolant and fan"], ["Parts", "Source early"]],
  EFI, OLD, [YAMF], lessons={"L": ["The front end is a swingarm with a hub-center steering linkage. Check every pivot for play before you ride it."]}))

B62.append(mk("yamaha-tdm850-1992", "Yamaha", "TDM850", "Yamaha TDM850", [1992, 1993],
  ["tdm850", "tdm 850", "tdm", "tdm900", "tdm 900"], "standard", "chain",
  "849 cc liquid-cooled parallel twin, two carbs",
  "Yamaha's tall road twin. Sold in the US for two years, with the engine family of the Super Tenere.",
  [["Twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [YAMF]))

B62.append(mk("yamaha-ysr50-1987", "Yamaha", "YSR50", "Yamaha YSR50", [1987, 1992],
  ["ysr50", "ysr 50", "ysr80", "ysr 80"], "standard", "chain",
  "49 cc air-cooled two-stroke single, Autolube oil injection, five-speed",
  "Yamaha's tiny sport bike. A two-stroke with Autolube and a frame that racers love to modify.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Autolube", "Check pump"], ["Exhaust", "Check carbon"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [INJ]}))

B62.append(mk("yamaha-vmax-1700-2009", "Yamaha", "VMAX 1700", "Yamaha VMAX 1700", [2009, 2020],
  ["vmax 1700", "vmax", "v-max", "v max", "vmx17", "vmx1700", "vmax 2009"], "cruiser", "shaft",
  "1679 cc liquid-cooled V4, fuel injected, shaft drive",
  "The second-gen VMAX. A huge V4 with fuel injection, a slipper clutch and shaft drive.",
  [["V4", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Coolant and fan"], ["Brakes", "Check ABS"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [YAMF]))

B62.append(mk("yamaha-xv500-virago-500-1983", "Yamaha", "XV500 Virago 500", "Yamaha XV500 Virago", [1983, 1984],
  ["xv500", "xv 500", "virago 500", "xv500k", "xv500l"], "cruiser", "shaft",
  "494 cc air-cooled V-twin, two carbs, shaft drive",
  "The early small Virago. An air-cooled V-twin with shaft drive and a starter clutch to check.",
  [["V-twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Starter", "Check clutch"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [VTF]))

B62.append(mk("yamaha-sr185-exciter-1982", "Yamaha", "SR185 / Exciter", "Yamaha SR185 Exciter", [1982, 1983],
  ["sr185", "sr 185", "exciter 185", "exciter", "sr185 exciter", "exciter i"], "standard", "chain",
  "183 cc air-cooled overhead-cam single, carb",
  "Yamaha's small street single of the early 80s. Simple and light, with a single carb.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Cam chain", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B62.append(mk("yamaha-rx50-rx-s-1983", "Yamaha", "RX50 / RX-S", "Yamaha RX50 / RX-S", [1983, 1990],
  ["rx50", "rx 50", "rx-s", "rxs", "rx100", "rxs100", "rx 100", "rx-k"], "standard", "chain",
  "49 to 98 cc air-cooled two-stroke single, Autolube oil injection",
  "Yamaha's small two-stroke commuters. Autolube, points or CDI, and a simple chassis.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Autolube", "Check pump"], ["Exhaust", "Check carbon"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [INJ]}))

B62.append(mk("yamaha-exciter-virago-125-1997", "Yamaha", "Exciter / Virago 125", "Yamaha Virago 125 (XV125)", [1997, 2001],
  ["xv125", "xv 125", "virago 125", "xv125s", "virago xv125"], "cruiser", "chain",
  "124 cc air-cooled V-twin, carb",
  "Yamaha's smallest V-twin cruiser. A little air-cooled twin with chain drive.",
  [["V-twin", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [VTF]))

B62.append(mk("kawasaki-kx125-1974", "Kawasaki", "KX125", "Kawasaki KX125", [1974, 2008],
  ["kx125", "kx 125", "kx125 two stroke"], "dualsport", "chain",
  "124 cc two-stroke single, air- then liquid-cooled, carb, premix",
  "Kawasaki's 125 motocross two-stroke. Premix, a power valve on later years and regular top-end rebuilds.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Power valve", "Clean it"], ["Chain drive", "Slack and lube"]],
  TWO, KDIRT, [TT], lessons={"B": [PREMIX]}))

HERO_NAME_B62 = {"yamaha-xj650lj-seca-turbo-1982": "SECA TURBO", "yamaha-gts1000-1993": "GTS1000", "yamaha-tdm850-1992": "TDM850",
  "yamaha-ysr50-1987": "YSR50", "yamaha-vmax-1700-2009": "VMAX", "yamaha-xv500-virago-500-1983": "VIRAGO", "yamaha-sr185-exciter-1982": "EXCITER",
  "yamaha-rx50-rx-s-1983": "RX50", "yamaha-exciter-virago-125-1997": "VIRAGO 125", "kawasaki-kx125-1974": "KX125"}
