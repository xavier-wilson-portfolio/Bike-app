"""Batch 54 bike tunes (top 1000, rows 531-540)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch31 import SHADOWF, VFRD
from batch32 import XRS
from batch12 import GWP
from batch22 import VJMC
B54 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
DIRTNOTE = "Off-road models are not always in the NHTSA recall search. Ask a Honda dealer to run the VIN as well."

B54.append(mk("honda-valkyrie-gl1800c-2014", "Honda", "Valkyrie (GL1800C)", "Honda Valkyrie (GL1800C)", [2014, 2015],
  ["valkyrie", "gl1800c", "valkyrie 1800", "gl1800c valkyrie", "valkyrie 2014"], "cruiser", "shaft",
  "1832 cc liquid-cooled flat six, fuel injected, shaft drive",
  "The stripped-down Gold Wing of 2014. Same six, less bodywork, and a short production run.",
  [["Flat six", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Coolant and hoses"], ["Brakes", "Linked system"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [GWP]))

B54.append(mk("honda-dn-01-2009", "Honda", "DN-01", "Honda DN-01", [2009, 2010],
  ["dn-01", "dn01", "dn 01", "honda dn-01"], "cruiser", "shaft",
  "680 cc liquid-cooled V-twin, fuel injected, hydraulic automatic transmission, shaft drive",
  "Honda's odd automatic cruiser. A hydraulic transmission that needs the right fluid and a dealer tool for some jobs.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["HFT gearbox", "Check fluid"], ["Cooling", "Coolant and fan"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [SHADOWF]))

B54.append(mk("honda-nm4-2015", "Honda", "NM4", "Honda NM4", [2015, 2016],
  ["nm4", "nm4 vultus", "vultus", "nm 4", "honda nm4"], "cruiser", "chain",
  "745 cc liquid-cooled parallel twin, fuel injected, DCT",
  "Honda's sci-fi cruiser. The NC700 family engine with a dual-clutch box and a lot of bodywork.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["DCT", "Check filters"], ["Bodywork", "Many panels"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [SHADOWF]))

B54.append(mk("honda-ctx1300-2014", "Honda", "CTX1300", "Honda CTX1300", [2014, 2016],
  ["ctx1300", "ctx 1300", "ctx1300d", "ctx1300a"], "touring", "shaft",
  "1261 cc liquid-cooled V4, fuel injected, shaft drive",
  "Honda's V4 bagger. The ST1300 engine tuned for torque, with linked brakes and a shaft.",
  [["V4", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Coolant and hoses"], ["Brakes", "Linked system"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [SHADOWF]))

B54.append(mk("honda-vfr800x-crossrunner-2016", "Honda", "VFR800X Crossrunner", "Honda VFR800X Crossrunner", [2016, 2017],
  ["vfr800x", "crossrunner", "vfr 800x", "vfr800x crossrunner"], "adventure", "chain",
  "782 cc liquid-cooled V4, fuel injected, VTEC",
  "The tall-bars VFR. The same V4 with VTEC, on a frame with more suspension travel.",
  [["V4", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [VFRD]))

B54.append(mk("honda-nt700v-2010", "Honda", "NT700V", "Honda NT700V Deauville", [2010, 2010],
  ["nt700v", "deauville", "nt700", "nt 700v", "nt700va"], "touring", "shaft",
  "680 cc liquid-cooled V-twin, fuel injected, shaft drive",
  "Honda's commuter tourer, sold in the US for one year. Built-in bags, shaft drive and a linked ABS on some.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fairing", "Many panels"], ["Cooling", "Coolant and hoses"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, []))

B54.append(mk("honda-cb500-twin-pc32-1994", "Honda", "CB500 twin (PC32)", "Honda CB500 twin (PC32)", [1994, 2003],
  ["cb500", "cb 500", "pc32", "cb500s", "cb500 twin", "cb500 1996"], "standard", "chain",
  "499 cc liquid-cooled parallel twin, two carbs, six-speed",
  "Honda's 90s twin, famous as a tough commuter. Two carbs and a long-lasting engine.",
  [["Twin", "Liquid-cooled"], ["Two carbs", "Sync them"], ["Valves", "Shim check"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [VJMC]))

B54.append(mk("honda-gb500-tt-1989", "Honda", "GB500 TT", "Honda GB500 TT", [1989, 1990],
  ["gb500", "gb 500", "gb500tt", "gb500 tt", "tourist trophy", "gb400"], "cafe", "chain",
  "498 cc air-cooled four-valve single, one carb, five-speed",
  "Honda's cafe single. Kick and electric start, a single carb and parts that are getting scarce.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Starting", "Decompressor"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B54.append(mk("honda-xr100r-xr80r-1985", "Honda", "XR100R / XR80R", "Honda XR100R / XR80R", [1985, 2003],
  ["xr100r", "xr80r", "xr100", "xr80", "xr 100", "xr 80", "xr 100r"], "dualsport", "chain",
  "80 or 99 cc air-cooled four-stroke single, carb, kick start",
  "Honda's small four-stroke dirt bikes. Simple, tough and often ridden hard by kids.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  CARB, DIRTNOTE, [XRS]))

B54.append(mk("honda-xr200r-1981", "Honda", "XR200R", "Honda XR200R", [1981, 2002],
  ["xr200r", "xr200", "xr 200", "xr 200r", "xr185"], "dualsport", "chain",
  "195 cc air-cooled four-stroke single, carb, kick start",
  "Honda's middle XR. A simple air-cooled single that is easy to keep running.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  CARB, DIRTNOTE, [XRS]))

HERO_NAME_B54 = {"honda-valkyrie-gl1800c-2014": "VALKYRIE", "honda-dn-01-2009": "DN-01", "honda-nm4-2015": "NM4", "honda-ctx1300-2014": "CTX1300",
  "honda-vfr800x-crossrunner-2016": "CROSSRUNNER", "honda-nt700v-2010": "NT700V", "honda-cb500-twin-pc32-1994": "CB500",
  "honda-gb500-tt-1989": "GB500", "honda-xr100r-xr80r-1985": "XR100R", "honda-xr200r-1981": "XR200R"}
