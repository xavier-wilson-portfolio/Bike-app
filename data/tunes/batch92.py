"""Batch 92 bike tunes (top 1000, rows 911-920)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch22 import VJMC
from batch15 import YE
from batch14 import KZR
from batch34 import KAWF
from batch23 import ZXF
from batch67 import SUZF
from batch51 import INJ
from batch64 import SLUBE
B92 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B92.append(mk("yamaha-cs3-cs5-200-1971", "Yamaha", "CS3 / CS5 200", "Yamaha CS3 / CS5 200", [1971, 1972],
  ["cs3", "cs5", "cs3b", "cs5e", "cs 5", "yamaha 200 twin"], "standard", "chain",
  "195 cc air-cooled two-stroke twin, Autolube oil injection, electric start",
  "Yamaha's little two-stroke twins with electric start. Autolube, points and a five-speed box.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["Autolube", "Check pump"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [INJ]}))

B92.append(mk("yamaha-lb80-chappy-1973", "Yamaha", "LB80 Chappy", "Yamaha LB80 Chappy", [1973, 1980],
  ["chappy", "lb80", "lb 80", "lb50", "yamaha chappy"], "standard", "chain",
  "49 or 72 cc air-cooled two-stroke single, Autolube oil injection, automatic",
  "Yamaha's fat-tire mini bike. A two-stroke with Autolube and a two-speed automatic.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Autolube", "Check pump"], ["Auto clutch", "Inspect"], ["Tires", "Check age"]],
  TWO, OLD, [VJMC], lessons={"B": [INJ]}))

B92.append(mk("yamaha-gt80-jt1-mini-enduro-1971", "Yamaha", "GT80 / JT1 Mini Enduro", "Yamaha GT80 / JT1 Mini Enduro", [1971, 1980],
  ["gt80", "jt1", "jt2", "gt1", "gt mx", "mini enduro", "gt 80", "gtmx"], "dualsport", "chain",
  "58 to 72 cc air-cooled two-stroke single, Autolube oil injection",
  "Yamaha's mini enduros for kids. Rotary-valve or piston-port two-strokes with Autolube and lights.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Autolube", "Check pump"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [YE], lessons={"B": [INJ]}))

B92.append(mk("yamaha-mx175-mx250-mx360-1973", "Yamaha", "MX175 / MX250 / MX360", "Yamaha MX175 / MX250 / MX360", [1973, 1975],
  ["mx175", "mx250", "mx360", "mx 250", "mx400", "mx100", "mx125"], "dualsport", "chain",
  "171 to 397 cc air-cooled two-stroke single, Autolube oil injection",
  "Yamaha's street-legal motocross bikes of the mid 70s. Autolube, a twin-shock rear and lights.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Autolube", "Check pump"], ["Ignition", "Check spark"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [YE], lessons={"B": [INJ]}))

B92.append(mk("kawasaki-kv75-mt1-kd100-1971", "Kawasaki", "KV75 MT1 / KD100", "Kawasaki KV75 MT1 / KD100", [1971, 1981],
  ["kv75", "mt1", "kd100", "kd 100", "kv 75", "mt-1", "kd80"], "dualsport", "chain",
  "73 to 124 cc air-cooled rotary-valve two-stroke single, Superlube oil injection",
  "Kawasaki's mini bikes and small dirt bikes. Fold-down bars on the MT1, rotary valves and oil injection.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Rotary valve", "Check cover"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [KZR], lessons={"B": [SLUBE]}))

B92.append(mk("kawasaki-kz1000r-eddie-lawson-replica-1982", "Kawasaki", "KZ1000R Eddie Lawson Replica", "Kawasaki KZ1000R Eddie Lawson Replica", [1982, 1983],
  ["kz1000r", "eddie lawson replica", "elr", "kz1000r1", "kz1000r2", "lawson replica", "kz1000 elr"], "sport", "chain",
  "998 cc air-cooled DOHC inline four, four carbs",
  "Kawasaki's superbike replica in lime green. A KZ1000J engine with race styling and very collectible now.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Parts", "Source early"]],
  CARB, OLD, [KZR]))

B92.append(mk("kawasaki-gpz750-turbo-1984", "Kawasaki", "GPz750 Turbo", "Kawasaki GPz750 Turbo", [1984, 1985],
  ["gpz750 turbo", "750 turbo", "zx750e", "ninja turbo", "gpz turbo", "kawasaki turbo"], "sport", "chain",
  "738 cc air-cooled DOHC inline four, turbocharged, fuel injected",
  "Kawasaki's turbo bike, the fastest of the 80s turbo era. Fuel injection, a turbo and an oil system to check first.",
  [["Inline four", "Air-cooled"], ["Turbo", "Check bearings"], ["Fuel injected", "Check system"], ["Oil lines", "Check turbo feed"], ["Parts", "Source early"]],
  EFI, OLD, [KZR], lessons={"H": ["The turbo is oiled by the engine. Check the feed and return lines and change the oil before the first start."]}))

B92.append(mk("kawasaki-ninja-zx-10r-2021-on-2021", "Kawasaki", "Ninja ZX-10R (2021 on)", "Kawasaki Ninja ZX-10R (2021 on)", [2021, 2026],
  ["zx-10r", "zx10r", "ninja zx-10r", "zx-10rr", "zx10rr", "zx 10r", "zx-10r krt"], "sport", "chain",
  "998 cc liquid-cooled inline four, fuel injected, IMU-based electronics",
  "The current ZX-10R. Winglets, a full electronics suite and service intervals worth following closely.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [ZXF]))

B92.append(mk("kawasaki-versys-650-2008-2014-2008", "Kawasaki", "Versys 650 (2008-2014)", "Kawasaki Versys 650 (2008-2014)", [2008, 2014],
  ["versys 650", "versys", "kle650", "versys 650 abs", "kle 650"], "adventure", "chain",
  "649 cc liquid-cooled parallel twin, fuel injected",
  "The first Versys. The Ninja 650 twin with long-travel suspension and an upright seat.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [KAWF]))

B92.append(mk("suzuki-rf600r-rf900r-1993", "Suzuki", "RF600R / RF900R", "Suzuki RF600R / RF900R", [1993, 1997],
  ["rf900r", "rf600r", "rf900", "rf600", "rf 900", "rf 600", "rf400"], "sport", "chain",
  "599 or 937 cc liquid-cooled DOHC inline four, four carbs",
  "Suzuki's 90s sport tourers. Four carbs, a full fairing and a comfortable riding position.",
  [["Inline four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [SUZF]))

HERO_NAME_B92 = {"yamaha-cs3-cs5-200-1971": "CS5", "yamaha-lb80-chappy-1973": "CHAPPY", "yamaha-gt80-jt1-mini-enduro-1971": "MINI ENDURO",
  "yamaha-mx175-mx250-mx360-1973": "MX250", "kawasaki-kv75-mt1-kd100-1971": "KD100", "kawasaki-kz1000r-eddie-lawson-replica-1982": "KZ1000R",
  "kawasaki-gpz750-turbo-1984": "GPZ750 TURBO", "kawasaki-ninja-zx-10r-2021-on-2021": "ZX-10R", "kawasaki-versys-650-2008-2014-2008": "VERSYS",
  "suzuki-rf600r-rf900r-1993": "RF900R"}
