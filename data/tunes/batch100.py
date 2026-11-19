"""Batch 100 bike tunes (top 1000, rows 991-1000)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch38 import SCOOT, GSXRF
from batch29 import ADVR
from batch36 import YAMF
from batch22 import VJMC
from batch55 import TT, PREMIX
from batch87 import CHINANOTE
B100 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B100.append(mk("qj-motor-srk-srv-2023", "QJ Motor", "SRK / SRV", "QJ Motor SRK / SRV", [2023, 2026],
  ["srk", "srv", "srk 600", "srk 700", "srv 550", "qjmotor srk", "srk 400", "srv 300"], "standard", "chain",
  "Up to 698 cc liquid-cooled twin or four, fuel injected",
  "QJ Motor's own-brand road bikes, from the maker that owns Benelli. Fuel injected, with parts through the importer.",
  [["Engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, CHINANOTE, [ADVR]))

B100.append(mk("kove-450-rally-800x-2023", "Kove", "450 Rally / 800X", "Kove 450 Rally / 800X", [2023, 2026],
  ["450 rally", "800x", "kove 450", "kove 800x", "800x pro", "450 rally pro", "kove"], "adventure", "chain",
  "449 cc single or 799 cc parallel twin, liquid-cooled, fuel injected",
  "Kove's light rally and adventure bikes. Short service intervals on the 450 and a young dealer network.",
  [["Engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check often"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, CHINANOTE, [ADVR]))

B100.append(mk("voge-300-rally-525dsx-2023", "Voge", "300 Rally / 525DSX", "Voge 300 Rally / 525DSX", [2023, 2026],
  ["300 rally", "525dsx", "525 dsx", "voge 300 rally", "300ds", "500ds", "650dsx"], "adventure", "chain",
  "292 cc single or 494 cc twin, liquid-cooled, fuel injected",
  "Voge's budget adventure bikes from Loncin. Fuel injected, well equipped and new to most dealers.",
  [["Engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  EFI, CHINANOTE, [ADVR]))

B100.append(mk("vespa-946-2013", "Vespa", "946", "Vespa 946", [2013, 2026],
  ["946", "vespa 946", "946 bellissima", "946 dragon", "946 snake", "946 red"], "scooter", "belt",
  "125 or 150 cc air-cooled single, fuel injected, CVT, aluminum body",
  "Vespa's premium design scooter. An aluminum and steel body, fuel injection and expensive panels.",
  [["Single", "Air-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Body", "Protect paint"], ["Brakes", "Check ABS"]],
  EFI, GENNOTE, [SCOOT]))

B100.append(mk("honda-cb1300-super-four-1998", "Honda", "CB1300 Super Four", "Honda CB1300 Super Four", [1998, 2013],
  ["cb1300", "cb1300 super four", "sc40", "sc54", "cb1300s", "cb 1300", "super four 1300"], "standard", "chain",
  "1284 cc liquid-cooled DOHC inline four, carbs then fuel injection",
  "Honda's big naked four, mostly sold in Japan and Europe. Carbs early, fuel injection from 2003.",
  [["Inline four", "Liquid-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  [], GENNOTE, [VJMC]))

B100.append(mk("yamaha-xjr1200-xjr1300-1995", "Yamaha", "XJR1200 / XJR1300", "Yamaha XJR1200 / XJR1300", [1995, 2016],
  ["xjr1300", "xjr1200", "xjr 1300", "xjr", "xjr1300 racer", "xjr 1200"], "standard", "chain",
  "1188 or 1251 cc air/oil-cooled DOHC inline four, carbs then fuel injection",
  "Yamaha's air-cooled muscle bike. Carbs until 2006, fuel injection after, and a big following in Europe.",
  [["Inline four", "Air/oil-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  [], GENNOTE, [YAMF]))

B100.append(mk("suzuki-hayabusa-2008-2020-2008", "Suzuki", "Hayabusa (2008-2020)", "Suzuki Hayabusa (2008-2020)", [2008, 2020],
  ["hayabusa", "busa", "gsx1300r", "gsx 1300 r", "hayabusa gen 2", "gen 2 busa", "gsx1300r k8"], "sport", "chain",
  "1340 cc liquid-cooled inline four, fuel injected",
  "The second-generation Hayabusa. A bigger engine than the first, Brembo brakes from 2013 and ABS on later ones.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cam chain", "Check tensioner"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [GSXRF]))

B100.append(mk("husaberg-fe-450-570-te-300-1989", "Husaberg", "FE 450 / 570 / TE 300", "Husaberg FE / TE", [1989, 2014],
  ["husaberg", "fe 450", "fe 570", "te 300", "fe 501", "fe 390", "fe450", "fe570", "te 250"], "dualsport", "chain",
  "249 to 565 cc liquid-cooled single, four-stroke (FE) or two-stroke (TE)",
  "The Swedish-born enduros, later built by KTM. FE models are four-strokes, TE are two-strokes.",
  [["Single", "Check type"], ["Fuel", "Carb or EFI"], ["Valves or top end", "Check"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], GENNOTE, [TT], lessons={"B": ["TE models are two-strokes that run premix. FE models are four-strokes. Check which one you have."]}))

B100.append(mk("fantic-caballero-500-700-2018", "Fantic", "Caballero 500 / 700", "Fantic Caballero 500 / 700", [2018, 2026],
  ["caballero", "caballero 500", "caballero 700", "caballero scrambler", "caballero rally", "caballero 125"], "dualsport", "chain",
  "449 cc single or 689 cc twin, liquid-cooled, fuel injected",
  "Fantic's modern scramblers. A Minarelli single or a Yamaha-based twin, with parts through a small dealer network.",
  [["Engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [ADVR]))

B100.append(mk("swm-superdual-gran-milano-2016", "SWM", "Superdual / Gran Milano", "SWM Superdual / Gran Milano", [2016, 2023],
  ["superdual", "gran milano", "superdual 600", "superdual t", "gran milano 440", "silver vase", "ace of spades"], "adventure", "chain",
  "445 or 600 cc liquid-cooled single, fuel injected",
  "The revived SWM bikes, with engines based on old Husqvarna designs. Parts supply varies by country.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [ADVR]))

HERO_NAME_B100 = {"qj-motor-srk-srv-2023": "QJ MOTOR", "kove-450-rally-800x-2023": "KOVE", "voge-300-rally-525dsx-2023": "VOGE", "vespa-946-2013": "946",
  "honda-cb1300-super-four-1998": "CB1300", "yamaha-xjr1200-xjr1300-1995": "XJR1300", "suzuki-hayabusa-2008-2020-2008": "HAYABUSA",
  "husaberg-fe-450-570-te-300-1989": "HUSABERG", "fantic-caballero-500-700-2018": "CABALLERO", "swm-superdual-gran-milano-2016": "SUPERDUAL"}
