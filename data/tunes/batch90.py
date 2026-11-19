"""Batch 90 bike tunes (top 1000, rows 891-900)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch44 import CLASSIC
from batch81 import EURO
from batch22 import VJMC
from batch3 import VHT
from batch32 import XRS
from batch55 import TT, PREMIX
B90 = []
TWO = CARB + AIR + ["H-003"]
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."

B90.append(mk("zundapp-ks-750-ks-601-1950", "Zundapp", "KS 750 / KS 601", "Zundapp KS 750 / KS 601", [1950, 1958],
  ["ks 601", "ks601", "ks 750", "ks750", "green elephant", "grune elefant", "zundapp ks"], "standard", "shaft",
  "597 or 751 cc air-cooled OHV boxer twin, shaft drive, often with a sidecar",
  "Zundapp's boxer twins. The KS 601 'Green Elephant' and the wartime KS 750, both with shaft drive and rare parts.",
  [["Boxer twin", "Air-cooled"], ["Carbs", "Clean them"], ["Ignition", "Check it"], ["Gearbox", "Check oil"], ["Shaft", "Change oil"]],
  CARB, OLD, [EURO]))

B90.append(mk("nsu-max-supermax-1952", "NSU", "Max / Supermax", "NSU Max / Supermax", [1952, 1963],
  ["max", "supermax", "nsu max", "special max", "nsu supermax", "nsu 250"], "standard", "chain",
  "247 cc air-cooled overhead-cam single, Ultramax cam drive by eccentric rods",
  "NSU's clever 250 single. The cam is driven by eccentric rods instead of a chain, and the club knows it well.",
  [["OHC single", "Air-cooled"], ["Carb", "Clean it out"], ["Cam drive", "Check rods"], ["Ignition", "Check it"], ["Parts", "Source early"]],
  CARB, OLD, [EURO]))

B90.append(mk("dkw-rt-125-1939", "DKW", "RT 125", "DKW RT 125", [1939, 1965],
  ["rt 125", "rt125", "dkw rt", "dkw 125", "rt 175", "rt 200", "rt 250"], "standard", "chain",
  "123 cc air-cooled two-stroke single, premix",
  "The German two-stroke copied around the world, from the BSA Bantam to the Harley Hummer. Premix and a flywheel magneto.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Flywheel mag", "Check spark"], ["Crank seals", "Check them"], ["Parts", "Source early"]],
  TWO, OLD, [EURO], lessons={"B": [PREMIX]}))

B90.append(mk("greeves-challenger-hawkstone-1957", "Greeves", "Challenger / Hawkstone", "Greeves Challenger / Hawkstone", [1957, 1972],
  ["greeves", "challenger", "hawkstone", "scottish", "griffon", "anglian", "sports twin"], "dualsport", "chain",
  "197 to 380 cc air-cooled two-stroke single, premix, cast-alloy downtube",
  "The British scramblers and trials bikes with the cast-alloy front beam. Premix two-strokes and leading-link forks on many.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Front fork", "Check pivots"], ["Parts", "Source early"]],
  TWO, OLD, [CLASSIC], lessons={"B": [PREMIX]}))

B90.append(mk("rickman-metisse-1960", "Rickman", "Metisse", "Rickman Metisse", [1960, 1975],
  ["metisse", "rickman", "rickman metisse", "metisse mk3", "rickman cr", "rickman enfield"], "dualsport", "chain",
  "Engines from Triumph, BSA, Matchless, Weslake or Japanese makers in a nickel-plated Rickman frame",
  "The Rickman brothers' frame kits. Check what engine yours has, then follow that engine's service notes.",
  [["Engine", "Check donor"], ["Carb", "Clean it out"], ["Frame", "Check welds"], ["Fiberglass", "Check cracks"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [CLASSIC]))

B90.append(mk("honda-cb250-cl250-twin-1968", "Honda", "CB250 / CL250 twin", "Honda CB250 / CL250 twin", [1968, 1973],
  ["cb250", "cl250", "cb 250", "cl 250", "cb250k", "cl250k", "cb250 1970"], "standard", "chain",
  "249 cc air-cooled SOHC parallel twin, two carbs, five-speed",
  "The 250 version of the CB350 twin. Two carbs, points and a lot of shared parts with the 350.",
  [["SOHC twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Points", "Gap and time"], ["Cam chain", "Adjust it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VHT], lessons={"B": [POINTS]}))

B90.append(mk("honda-cb125t-twin-1978", "Honda", "CB125T twin", "Honda CB125T", [1978, 1982],
  ["cb125t", "cb 125t", "cb125tii", "cb125t2"], "standard", "chain",
  "124 cc air-cooled SOHC parallel twin, two carbs",
  "Honda's tiny twin. Two small carbs, a SOHC head and parts that are shared with the CD125.",
  [["Small twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Check them"], ["Cam chain", "Adjust it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B90.append(mk("honda-xl75-xl80s-1977", "Honda", "XL75 / XL80S", "Honda XL75 / XL80S", [1977, 1985],
  ["xl75", "xl80s", "xl80", "xl 75", "xl 80", "xl 80s"], "dualsport", "chain",
  "72 or 80 cc air-cooled four-stroke single, carb",
  "Honda's small dual-sports for young riders. Simple singles with a kick start and lights.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Points", "Gap and time"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [XRS]))

B90.append(mk("honda-mr50-mr175-elsinore-1974", "Honda", "MR50 / MR175 Elsinore", "Honda MR50 / MR175 Elsinore", [1974, 1977],
  ["mr50", "mr175", "mr 175", "mr250", "mr 50", "elsinore mr", "mr175 elsinore"], "dualsport", "chain",
  "49 to 248 cc air-cooled two-stroke single, premix",
  "Honda's small two-stroke Elsinore trail bikes. Premix and simple, with parts that are getting rare.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check spark"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B90.append(mk("honda-qa50-1970", "Honda", "QA50", "Honda QA50", [1970, 1975],
  ["qa50", "qa 50", "honda qa50", "qa50k"], "standard", "chain",
  "49 cc air-cooled overhead-cam single, two-speed with an automatic clutch",
  "Honda's tiny kids' bike from the early 70s. A small OHC engine, an auto clutch and parts that are hard to find.",
  [["49 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["Auto clutch", "Adjust it"], ["Points", "Gap and time"], ["Parts", "Source early"]],
  CARB, OLD, [VJMC]))

HERO_NAME_B90 = {"zundapp-ks-750-ks-601-1950": "ZUNDAPP", "nsu-max-supermax-1952": "NSU MAX", "dkw-rt-125-1939": "DKW RT 125",
  "greeves-challenger-hawkstone-1957": "GREEVES", "rickman-metisse-1960": "METISSE", "honda-cb250-cl250-twin-1968": "CB250",
  "honda-cb125t-twin-1978": "CB125T", "honda-xl75-xl80s-1977": "XL80S", "honda-mr50-mr175-elsinore-1974": "MR175", "honda-qa50-1970": "QA50"}
