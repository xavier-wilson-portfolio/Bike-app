"""Batch 69 bike tunes (top 1000, rows 681-690)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch18 import GSR
from batch38 import GSXRF
from batch22 import VJMC
from batch55 import TT, PREMIX
from batch67 import SUZF, CCI
B69 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B69.append(mk("suzuki-gsx-8t-gsx-8tt-2025", "Suzuki", "GSX-8T / GSX-8TT", "Suzuki GSX-8T / GSX-8TT", [2025, 2026],
  ["gsx-8t", "gsx8t", "gsx-8tt", "gsx8tt", "gsx 8t", "gsx 8tt"], "standard", "chain",
  "776 cc liquid-cooled parallel twin, fuel injected, ride-by-wire",
  "Suzuki's retro-styled 800 twins. The GSX-8S engine with round-light bodywork and rider aids.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [SUZF]))

B69.append(mk("suzuki-ts400-apache-1972", "Suzuki", "TS400 Apache", "Suzuki TS400 Apache", [1972, 1977],
  ["ts400", "apache", "ts 400", "ts400 apache"], "dualsport", "chain",
  "396 cc air-cooled two-stroke single, CCI oil injection",
  "Suzuki's big 70s enduro. A torquey two-stroke with CCI oil injection and a hard kick.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["CCI pump", "Check it"], ["Ignition", "Check spark"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI]}))

B69.append(mk("suzuki-pe175-pe250-pe400-1977", "Suzuki", "PE175 / PE250 / PE400", "Suzuki PE175 / PE250 / PE400", [1977, 1984],
  ["pe175", "pe250", "pe400", "pe 175", "pe 250", "pe 400"], "dualsport", "chain",
  "174 to 396 cc air-cooled two-stroke single, carb, premix",
  "Suzuki's enduro two-strokes of the late 70s. Premix, long-travel suspension and a lot of trail history.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Suspension", "Rebuild it"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B69.append(mk("suzuki-madura-gv700-gv1200-1984", "Suzuki", "Madura GV700 / GV1200", "Suzuki Madura GV700 / GV1200", [1984, 1986],
  ["madura", "gv700", "gv1200", "gv 1200", "gv700gl", "gv1200gl", "madura 1200", "madura 700"], "cruiser", "shaft",
  "699 or 1165 cc liquid-cooled V4, four carbs, shaft drive",
  "Suzuki's V4 cruisers of the mid 80s. Four carbs in the vee, liquid cooling and shaft drive.",
  [["V4", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Cooling", "Coolant and fan"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [GSR]))

B69.append(mk("suzuki-cavalcade-gv1400-1986", "Suzuki", "Cavalcade GV1400", "Suzuki Cavalcade GV1400", [1986, 1988],
  ["cavalcade", "gv1400", "gv 1400", "gv1400gd", "gv1400gt", "cavalcade lxe"], "touring", "shaft",
  "1360 cc liquid-cooled V4, four carbs, shaft drive",
  "Suzuki's big 80s full dresser. A V4, air-adjustable suspension and lots of bodywork.",
  [["V4", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Cooling", "Coolant and fan"], ["Air suspension", "Check leaks"], ["Shaft", "Change oil"]],
  CARB, OLD, [GSR]))

B69.append(mk("suzuki-xn85-turbo-1983", "Suzuki", "XN85 Turbo", "Suzuki XN85 Turbo", [1983, 1983],
  ["xn85", "xn 85", "xn85 turbo", "suzuki turbo", "xn85d"], "sport", "chain",
  "673 cc air-cooled inline four, turbocharged, fuel injected",
  "Suzuki's one-year turbo bike. Fuel injection, a turbo and parts that are now very rare.",
  [["Inline four", "Air-cooled"], ["Turbo", "Check bearings"], ["Fuel injected", "Check system"], ["Oil lines", "Check turbo feed"], ["Parts", "Source early"]],
  EFI, OLD, [GSR], lessons={"H": ["The turbo is oiled by the engine. Check the feed and return lines and change the oil before the first start."]}))

B69.append(mk("suzuki-gs700e-gs750es-1983", "Suzuki", "GS700E / GS750ES", "Suzuki GS700E / GS750ES", [1983, 1985],
  ["gs700e", "gs750es", "gs700es", "gs 750es", "gs 700e", "gs750e 1983"], "sport", "chain",
  "694 or 747 cc air-cooled DOHC inline four, four carbs, anti-dive forks",
  "Suzuki's mid-80s sport fours. Half fairing, anti-dive forks and four carbs.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Anti-dive", "Check seals"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [GSR]))

B69.append(mk("suzuki-gs250t-gs300l-1980", "Suzuki", "GS250T / GS300L", "Suzuki GS250T / GS300L", [1980, 1982],
  ["gs250t", "gs300l", "gs 250t", "gs250tx", "gs300", "gs 300", "gs250"], "standard", "chain",
  "249 or 299 cc air-cooled SOHC parallel twin, two carbs",
  "Suzuki's small GS twins. Simple air-cooled engines with two carbs and electric start.",
  [["Twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Check them"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [GSR]))

B69.append(mk("suzuki-gsx-r1000-2017-on-2017", "Suzuki", "GSX-R1000 (2017 on)", "Suzuki GSX-R1000 (2017 on)", [2017, 2026],
  ["gsx-r1000", "gsxr1000", "gsxr 1000", "gixxer 1000", "gsx-r1000r", "gsxr1000r", "l7"], "sport", "chain",
  "999 cc liquid-cooled inline four, fuel injected, variable valve timing",
  "The L7-on GSX-R1000. Variable valve timing, a full electronics suite and an IMU on the R.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [GSXRF]))

B69.append(mk("suzuki-hayabusa-2022-on-2022", "Suzuki", "Hayabusa (2022 on)", "Suzuki Hayabusa (2022 on)", [2022, 2026],
  ["hayabusa", "busa", "gsx1300r", "hayabusa 2022", "gsx 1300 r", "gen 3 busa"], "sport", "chain",
  "1340 cc liquid-cooled inline four, fuel injected, ride-by-wire",
  "The third-generation Hayabusa. The same big four, updated with an IMU and a full set of rider aids.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [GSXRF]))

HERO_NAME_B69 = {"suzuki-gsx-8t-gsx-8tt-2025": "GSX-8T", "suzuki-ts400-apache-1972": "APACHE", "suzuki-pe175-pe250-pe400-1977": "PE250",
  "suzuki-madura-gv700-gv1200-1984": "MADURA", "suzuki-cavalcade-gv1400-1986": "CAVALCADE", "suzuki-xn85-turbo-1983": "XN85",
  "suzuki-gs700e-gs750es-1983": "GS750ES", "suzuki-gs250t-gs300l-1980": "GS300L", "suzuki-gsx-r1000-2017-on-2017": "GSX-R1000",
  "suzuki-hayabusa-2022-on-2022": "HAYABUSA"}
