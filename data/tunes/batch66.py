"""Batch 66 bike tunes (top 1000, rows 651-660)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch34 import KAWF, VULF
from batch14 import KZR
from batch55 import TT, PREMIX
from batch62 import KDIRT
B66 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
SDIRT = "Off-road models are not always in the NHTSA recall search. Ask a Suzuki dealer to run the VIN as well."

B66.append(mk("kawasaki-super-sherpa-kl250g-2000", "Kawasaki", "Super Sherpa (KL250G)", "Kawasaki Super Sherpa", [2000, 2009],
  ["super sherpa", "kl250g", "kl250 super sherpa", "sherpa 250", "kl 250g"], "dualsport", "chain",
  "249 cc air-cooled DOHC single, carb, electric start",
  "Kawasaki's light, low dual-sport. Air cooled, electric start and a carb that needs clean fuel.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Shim check"], ["Air filter", "Clean and oil"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [KAWF]))

B66.append(mk("kawasaki-ksr110-2003", "Kawasaki", "KSR110", "Kawasaki KSR110", [2003, 2005],
  ["ksr110", "ksr 110", "ksr", "ksr80", "ksr 80"], "standard", "chain",
  "111 cc air-cooled single, carb, four-speed",
  "Kawasaki's small mini-bike before the Z125. Simple, light and easy to work on.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Clutch", "Adjust cable"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [KAWF]))

B66.append(mk("kawasaki-z650rs-2022", "Kawasaki", "Z650RS", "Kawasaki Z650RS", [2022, 2026],
  ["z650rs", "z650 rs", "z650rs 50th", "z650rs anniversary"], "standard", "chain",
  "649 cc liquid-cooled parallel twin, fuel injected",
  "Kawasaki's retro middleweight. The Z650 twin with round lights and classic bodywork.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [KAWF]))

B66.append(mk("kawasaki-kz1000j-kz1000k-ltd-1981", "Kawasaki", "KZ1000J / KZ1000K LTD", "Kawasaki KZ1000J / KZ1000K LTD", [1981, 1983],
  ["kz1000j", "kz1000k", "kz1000 j", "kz1000k ltd", "z1000j", "kz1000 1982", "kz1000 csr"], "standard", "chain",
  "998 cc air-cooled DOHC inline four, four carbs",
  "The early-80s KZ1000s. A shorter-stroke engine than the Z1 line, four carbs and a strong frame.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [KZR]))

B66.append(mk("kawasaki-klx250-1993-2007-1993", "Kawasaki", "KLX250 (1993-2007)", "Kawasaki KLX250 (1993-2007)", [1993, 2007],
  ["klx250", "klx 250", "klx250r", "klx250s", "klx250es", "klx250 1995"], "dualsport", "chain",
  "249 cc liquid-cooled DOHC single, carb",
  "The earlier KLX250s. Liquid cooled, with carbs and kick or electric start depending on the year.",
  [["Single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Valves", "Shim check"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [TT]))

B66.append(mk("kawasaki-klx650r-1993", "Kawasaki", "KLX650R", "Kawasaki KLX650R", [1993, 1996],
  ["klx650r", "klx650", "klx 650", "klx 650r", "klx650c"], "dualsport", "chain",
  "651 cc liquid-cooled four-valve single, carb",
  "Kawasaki's 90s off-road big single. Lighter and sportier than the KLR, with a carb and kick start.",
  [["Big single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Valves", "Shim check"], ["Starting", "Decompressor"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TT]))

B66.append(mk("kawasaki-ltd-450-en450-1985", "Kawasaki", "LTD 450 / EN450", "Kawasaki 454 LTD (EN450)", [1985, 1990],
  ["en450", "ltd 450", "454 ltd", "en450a", "kz454", "454ltd", "en 450"], "cruiser", "belt",
  "454 cc liquid-cooled DOHC parallel twin, two carbs, belt drive",
  "Kawasaki's small cruiser of the 80s. Half a ZX900 engine, belt drive and two carbs.",
  [["Twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and hoses"], ["Belt", "Check tension"]],
  CARB, OLD, [VULF]))

B66.append(mk("suzuki-tm250-tm400-cyclone-1971", "Suzuki", "TM250 / TM400 Cyclone", "Suzuki TM250 / TM400 Cyclone", [1971, 1975],
  ["tm250", "tm400", "cyclone", "tm 400", "tm 250", "tm125", "tm100", "tm400 cyclone"], "dualsport", "chain",
  "123 to 396 cc air-cooled two-stroke single, carb, premix",
  "Suzuki's early-70s motocross two-strokes. The TM400 is known for sudden power. Premix and points.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check spark"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B66.append(mk("suzuki-rm125-1975", "Suzuki", "RM125", "Suzuki RM125", [1975, 2012],
  ["rm125", "rm 125", "rm125 two stroke"], "dualsport", "chain",
  "124 cc two-stroke single, air- then liquid-cooled, carb, premix",
  "Suzuki's 125 motocross two-stroke. Premix, a power valve on later years and regular top-end rebuilds.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Power valve", "Clean it"], ["Chain drive", "Slack and lube"]],
  TWO, SDIRT, [TT], lessons={"B": [PREMIX]}))

B66.append(mk("suzuki-rm80-rm85-1977", "Suzuki", "RM80 / RM85", "Suzuki RM80 / RM85", [1977, 2026],
  ["rm80", "rm85", "rm 85", "rm 80", "rm85l", "rm100", "rm60", "rm65"], "dualsport", "chain",
  "60 to 99 cc two-stroke single, liquid-cooled on most years, carb, premix",
  "Suzuki's mini motocross two-strokes. Premix and a top end that wears fast.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, SDIRT, [TT], lessons={"B": [PREMIX]}))

HERO_NAME_B66 = {"kawasaki-super-sherpa-kl250g-2000": "SHERPA", "kawasaki-ksr110-2003": "KSR110", "kawasaki-z650rs-2022": "Z650RS",
  "kawasaki-kz1000j-kz1000k-ltd-1981": "KZ1000J", "kawasaki-klx250-1993-2007-1993": "KLX250", "kawasaki-klx650r-1993": "KLX650R",
  "kawasaki-ltd-450-en450-1985": "454 LTD", "suzuki-tm250-tm400-cyclone-1971": "CYCLONE", "suzuki-rm125-1975": "RM125", "suzuki-rm80-rm85-1977": "RM85"}
