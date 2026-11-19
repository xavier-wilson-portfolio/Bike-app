"""Batch 67 bike tunes (top 1000, rows 661-670)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch55 import TT, PREMIX
from batch66 import SDIRT
from batch22 import VJMC
B67 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
SUZF = dict(name="Suzuki Forums", url="https://www.suzuki-forums.com/forums/", what="General owner forum for Suzuki motorcycles.")
CCI = "Suzuki's CCI system pumps oil into the engine, so it does not need premix. Check the oil tank, pump and lines. If the pump was removed, it runs premix."

B67.append(mk("suzuki-rmx250-1989", "Suzuki", "RMX250", "Suzuki RMX250", [1989, 1999],
  ["rmx250", "rmx 250", "rmx250s", "rmx250r"], "dualsport", "chain",
  "249 cc liquid-cooled two-stroke single, carb, premix",
  "Suzuki's two-stroke enduro of the 90s. Premix, a power valve and wide-ratio gearing.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Power valve", "Clean it"], ["Cooling", "Coolant and hoses"]],
  TWO, SDIRT, [TT], lessons={"B": [PREMIX]}))

B67.append(mk("suzuki-ds80-ds100-ds185-1978", "Suzuki", "DS80 / DS100 / DS185", "Suzuki DS80 / DS100 / DS185", [1978, 1981],
  ["ds80", "ds100", "ds185", "ds 80", "ds 100", "ds 185", "ds250"], "dualsport", "chain",
  "79 to 183 cc air-cooled two-stroke single, carb",
  "Suzuki's small off-road two-strokes of the late 70s. Simple trail bikes with a kick start.",
  [["Two-stroke", "Check oiling"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check spark"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [TT], lessons={"B": [CCI]}))

B67.append(mk("suzuki-sp370-sp400-1978", "Suzuki", "SP370 / SP400", "Suzuki SP370 / SP400", [1978, 1980],
  ["sp370", "sp400", "sp 370", "sp 400", "dr370", "dr400"], "dualsport", "chain",
  "369 or 396 cc air-cooled overhead-cam single, carb, kick start",
  "Suzuki's first four-stroke dual-sports. A big single, a kick start and a decompressor.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Starting", "Decompressor"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B67.append(mk("suzuki-dr250-dr250s-1982", "Suzuki", "DR250 / DR250S", "Suzuki DR250 / DR250S", [1982, 1990],
  ["dr250", "dr250s", "dr 250", "dr 250s", "sp250"], "dualsport", "chain",
  "249 cc air-cooled overhead-cam single, carb, kick start",
  "Suzuki's 80s 250 trail four-stroke. Air cooled and simple, with a kick start.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Cam chain", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TT]))

B67.append(mk("suzuki-vanvan-200-2003", "Suzuki", "VanVan 200", "Suzuki VanVan 200", [2003, 2017],
  ["vanvan 200", "van van 200", "rv200", "vanvan", "van van", "rv 200"], "standard", "chain",
  "199 cc air-cooled single, carb, fat tires",
  "Suzuki's fat-tire fun bike. The DR200 family single with a low seat and balloon tires.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Tires", "Check age"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [SUZF]))

B67.append(mk("suzuki-gn400-1980", "Suzuki", "GN400", "Suzuki GN400", [1980, 1981],
  ["gn400", "gn 400", "gn400x", "gn400t", "gn400l"], "standard", "chain",
  "396 cc air-cooled overhead-cam single, carb",
  "Suzuki's early-80s 400 single. The SP400 engine in a street frame.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Starting", "Decompressor"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B67.append(mk("suzuki-gsx-r125-gsx-s125-2017", "Suzuki", "GSX-R125 / GSX-S125", "Suzuki GSX-R125 / GSX-S125", [2017, 2026],
  ["gsx-r125", "gsxr125", "gsx-s125", "gsxs125", "gsx r125", "gsx s125"], "sport", "chain",
  "124 cc liquid-cooled DOHC single, fuel injected",
  "Suzuki's small sport single. Fuel injected and keyless on some, with a six-speed box.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant level"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [SUZF]))

B67.append(mk("suzuki-gsx1250fa-2011", "Suzuki", "GSX1250FA", "Suzuki GSX1250FA", [2011, 2012],
  ["gsx1250fa", "gsx1250", "gsx 1250", "gsx1250f", "gsx 1250fa"], "touring", "chain",
  "1255 cc liquid-cooled inline four, fuel injected, ABS",
  "Suzuki's faired Bandit 1250. Fuel injected, liquid cooled, with ABS and a lot of low-end pull.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [SUZF]))

B67.append(mk("suzuki-gsx650f-2008", "Suzuki", "GSX650F", "Suzuki GSX650F", [2008, 2016],
  ["gsx650f", "gsx 650f", "gsx650", "gsx 650"], "sport", "chain",
  "656 cc liquid-cooled inline four, fuel injected",
  "Suzuki's faired Bandit 650. A friendly four with fuel injection and a full fairing.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [SUZF]))

B67.append(mk("suzuki-gt185-gt250-1973", "Suzuki", "GT185 / GT250", "Suzuki GT185 / GT250", [1973, 1977],
  ["gt185", "gt250", "gt 185", "gt 250", "gt185 adventurer", "gt250 hustler"], "standard", "chain",
  "184 or 247 cc air-cooled two-stroke twin, two carbs, CCI oil injection, Ram Air head",
  "Suzuki's small two-stroke twins of the 70s. Ram Air cylinder heads, CCI oil injection and points.",
  [["Two-stroke twin", "Oil injection"], ["Two carbs", "Sync them"], ["CCI pump", "Check it"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [VJMC], lessons={"B": [CCI]}))

HERO_NAME_B67 = {"suzuki-rmx250-1989": "RMX250", "suzuki-ds80-ds100-ds185-1978": "DS185", "suzuki-sp370-sp400-1978": "SP400",
  "suzuki-dr250-dr250s-1982": "DR250", "suzuki-vanvan-200-2003": "VANVAN", "suzuki-gn400-1980": "GN400", "suzuki-gsx-r125-gsx-s125-2017": "GSX-R125",
  "suzuki-gsx1250fa-2011": "GSX1250FA", "suzuki-gsx650f-2008": "GSX650F", "suzuki-gt185-gt250-1973": "GT250"}
