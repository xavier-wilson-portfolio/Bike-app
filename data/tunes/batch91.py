"""Batch 91 bike tunes (top 1000, rows 901-910)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch22 import VJMC
from batch32 import XRS
from batch38 import SCOOT
from batch29 import ADVR
from batch15 import YE, XT
from batch55 import TT
from batch51 import INJ
from batch54 import DIRTNOTE
B91 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B91.append(mk("honda-xr75-1973", "Honda", "XR75", "Honda XR75", [1973, 1978],
  ["xr75", "xr 75", "xr75k", "xr75 1975"], "dualsport", "chain",
  "72 cc air-cooled four-stroke single, carb, kick start",
  "Honda's first small XR. A four-stroke kids' racer that is still easy to keep running.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XRS]))

B91.append(mk("honda-cb1000-big-one-1993", "Honda", "CB1000 (Big One)", "Honda CB1000 Big One", [1993, 1994],
  ["cb1000", "big one", "cb1000f", "sc30", "cb 1000", "cb1000 big one"], "standard", "chain",
  "998 cc liquid-cooled DOHC inline four, four carbs",
  "Honda's big naked four of the early 90s. The CBR1000F engine in a standard bike.",
  [["Inline four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B91.append(mk("honda-sh150i-2010", "Honda", "SH150i", "Honda SH150i", [2010, 2014],
  ["sh150i", "sh150", "sh 150", "sh150i honda", "sh125"], "scooter", "belt",
  "153 cc liquid-cooled single, fuel injected, CVT",
  "Honda's big-wheel commuter scooter. Fuel injected, liquid cooled and a flat floor.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Cooling", "Coolant level"], ["Gear oil", "Change it"]],
  EFI, GENNOTE, [SCOOT]))

B91.append(mk("honda-elite-110-nhx110-2010", "Honda", "Elite 110 (NHX110)", "Honda Elite 110", [2010, 2011],
  ["elite 110", "nhx110", "nhx 110", "lead 110", "honda elite 110"], "scooter", "belt",
  "108 cc liquid-cooled single, fuel injected, CVT",
  "Honda's 2010 commuter scooter. Fuel injected, with a lot of under-seat storage.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Cooling", "Coolant level"], ["Gear oil", "Change it"]],
  EFI, GENNOTE, [SCOOT]))

B91.append(mk("honda-xr150l-2023", "Honda", "XR150L", "Honda XR150L", [2023, 2026],
  ["xr150l", "xr150", "xr 150l", "xr 150"], "dualsport", "chain",
  "149 cc air-cooled single, carb, electric start",
  "Honda's simple small dual-sport. A carb, drum rear brake and very low running costs.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Air filter", "Clean it"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [XRS]))

B91.append(mk("honda-crf250f-2019", "Honda", "CRF250F", "Honda CRF250F", [2019, 2026],
  ["crf250f", "crf 250f", "crf250 f"], "dualsport", "chain",
  "249 cc air-cooled single, fuel injected, electric start",
  "Honda's trail 250. Fuel injected and air cooled, built for trail riding rather than racing.",
  [["Single", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  EFI, DIRTNOTE, [TT]))

B91.append(mk("honda-transalp-xl600v-1989", "Honda", "Transalp XL600V", "Honda Transalp XL600V", [1989, 1990],
  ["xl600v", "transalp", "transalp 600", "xl 600v", "xl650v", "transalp 650"], "adventure", "chain",
  "583 cc liquid-cooled 52-degree V-twin, two carbs",
  "The first Transalp, sold in the US for two years. A tough V-twin with two carbs and a half fairing.",
  [["V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Charging", "Check R/R"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [ADVR]))

B91.append(mk("yamaha-xt200-1982", "Yamaha", "XT200", "Yamaha XT200", [1982, 1983],
  ["xt200", "xt 200", "xt200j", "xt200k"], "dualsport", "chain",
  "196 cc air-cooled overhead-cam single, carb, electric start",
  "Yamaha's early-80s 200 dual-sport. Electric start, a monoshock and a simple single.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Cam chain", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XT]))

B91.append(mk("yamaha-bw80-bw200-big-wheel-1986", "Yamaha", "BW80 / BW200 Big Wheel", "Yamaha BW80 / BW200 Big Wheel", [1986, 1990],
  ["bw200", "bw80", "big wheel", "bw350", "bw 200", "bw 80", "yamaha big wheel"], "dualsport", "chain",
  "79 to 348 cc air-cooled single, two- or four-stroke, fat tires",
  "Yamaha's fat-tire trail bikes. The BW80 is a two-stroke; the BW200 and BW350 are four-strokes.",
  [["Single", "Check type"], ["Carb", "Clean it out"], ["Valves or top end", "Check"], ["Tires", "Hard to find"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TT], lessons={"B": ["The BW80 is a two-stroke with oil injection. The bigger ones are four-strokes. Check which one you have."]}))

B91.append(mk("yamaha-rd250-rd125-1973", "Yamaha", "RD250 / RD125", "Yamaha RD250 / RD125", [1973, 1975],
  ["rd250", "rd125", "rd 250", "rd 125", "rd250a", "rd125a"], "standard", "chain",
  "123 or 247 cc air-cooled reed-valve two-stroke twin, Autolube oil injection",
  "The smaller RDs. Reed-valve two-stroke twins with Autolube and points.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["Autolube", "Check pump"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [YE], lessons={"B": [INJ]}))

HERO_NAME_B91 = {"honda-xr75-1973": "XR75", "honda-cb1000-big-one-1993": "BIG ONE", "honda-sh150i-2010": "SH150I", "honda-elite-110-nhx110-2010": "ELITE 110",
  "honda-xr150l-2023": "XR150L", "honda-crf250f-2019": "CRF250F", "honda-transalp-xl600v-1989": "TRANSALP", "yamaha-xt200-1982": "XT200",
  "yamaha-bw80-bw200-big-wheel-1986": "BW200", "yamaha-rd250-rd125-1973": "RD250"}
