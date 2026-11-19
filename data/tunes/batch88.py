"""Batch 88 bike tunes (top 1000, rows 871-880)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch50 import SPYF
from batch42 import BUELLF
from batch48 import VICF
from batch19 import AMCA
from batch55 import TT, PREMIX
from batch81 import EURO
B88 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
FLAT = "It is a flathead. The valves sit beside the cylinder, so set the tappets with the engine cold and check the valve guides for wear."

B88.append(mk("can-am-ryker-2019", "Can-Am", "Ryker", "Can-Am Ryker", [2019, 2026],
  ["ryker", "ryker 600", "ryker 900", "ryker rally", "can-am ryker", "ryker sport"], "touring", "shaft",
  "600 cc twin or 900 cc triple, Rotax, fuel injected, CVT, shaft drive, two front wheels",
  "Can-Am's lighter three-wheeler. A twist-and-go CVT, shaft drive and car-like front suspension.",
  [["Rotax engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Front end", "Ball joints"], ["Shaft", "Check oil"]],
  EFI, GENNOTE, [SPYF], lessons={"L": ["The front end has ball joints and tie rods like a car. Check them for play and torn boots."]}))

B88.append(mk("can-am-qualifier-mx-sonic-two-stroke-1973", "Can-Am", "Qualifier / MX / Sonic (two-stroke)", "Can-Am Qualifier / MX / Sonic", [1973, 1987],
  ["qualifier", "can-am mx", "sonic", "tnt", "can-am 250", "can-am 175", "asp", "can-am 500", "mx-6"], "dualsport", "chain",
  "125 to 500 cc air-cooled Rotax two-stroke single, rotary valve, premix",
  "Can-Am's Bombardier-built motocross and enduro bikes. Rotax rotary-valve two-strokes and premix.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Rotary valve", "Check it"], ["Top end", "Check piston"], ["Parts", "Source early"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B88.append(mk("dnepr-mt-m72-sidecar-soviet-1950", "Dnepr", "MT / M72 sidecar (Soviet)", "Dnepr MT / M72 sidecar", [1950, 1995],
  ["dnepr", "mt-11", "mt-16", "m72", "k-750", "mt 11", "kmz", "mt-10", "k750"], "standard", "shaft",
  "650 to 750 cc air-cooled boxer twin, two carbs, shaft drive, sidecar",
  "The Kiev-built Soviet boxers. Side-valve or OHV boxers with sidecars, shaft drive and parts quality that varies a lot.",
  [["Boxer twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Ignition", "Check points"], ["Sidecar", "Check mounts"], ["Shaft", "Change oil"]],
  CARB, OLD, [EURO]))

B88.append(mk("victory-v92c-v92sc-v92tc-1999", "Victory", "V92C / V92SC / V92TC", "Victory V92C / V92SC / V92TC", [1999, 2003],
  ["v92c", "v92sc", "v92tc", "v92", "sport cruiser", "touring cruiser", "v92 classic", "v92c deluxe"], "cruiser", "belt",
  "1507 cc air/oil-cooled SOHC V-twin, fuel injected, belt drive",
  "The first Victory cruisers. A Freedom-predecessor V-twin with fuel injection and belt drive.",
  [["V-twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Charging", "Check stator"], ["Belt", "Check tension"], ["Parts", "Check supply"]],
  EFI, GENNOTE, [VICF]))

B88.append(mk("victory-octane-2017", "Victory", "Octane", "Victory Octane", [2017, 2017],
  ["octane", "victory octane", "octane 1200"], "cruiser", "belt",
  "1179 cc liquid-cooled 60-degree V-twin, fuel injected, belt drive",
  "Victory's last model, built on the Indian Scout platform. Most engine parts are shared with the Scout.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Cooling", "Coolant and fan"], ["Belt", "Check tension"]],
  EFI, GENNOTE, [VICF]))

B88.append(mk("buell-rr1000-rr1200-rs1200-1987", "Buell", "RR1000 / RR1200 / RS1200", "Buell RR1000 / RR1200 / RS1200", [1987, 1993],
  ["rr1000", "rr1200", "rs1200", "rss1200", "buell rr1000", "buell rr1200", "battletwin"], "sport", "belt",
  "998 or 1203 cc air-cooled Harley V-twin, carb, rubber-mounted",
  "Erik Buell's early hand-built sport bikes with Harley engines. Very few made, and bodywork parts are rare.",
  [["Harley twin", "Air-cooled"], ["Carb", "Clean it out"], ["Rubber mounts", "Check them"], ["Belt", "Check tension"], ["Parts", "Source early"]],
  CARB, OLD, [BUELLF]))

B88.append(mk("excelsior-henderson-super-x-1999", "Excelsior-Henderson", "Super X", "Excelsior-Henderson Super X", [1999, 2000],
  ["super x", "excelsior henderson", "eh super x", "super x 1999", "excelsior-henderson"], "cruiser", "belt",
  "1386 cc air/oil-cooled DOHC V-twin, fuel injected, belt drive",
  "The short-lived revival from Minnesota. About 2,000 built, and parts now come from owners and salvage.",
  [["V-twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Front end", "Check play"], ["Belt", "Check tension"], ["Parts", "Source early"]],
  EFI, OLD, [VICF]))

B88.append(mk("henderson-four-kj-de-luxe-1920", "Henderson", "Four (KJ / De Luxe)", "Henderson Four (KJ / De Luxe)", [1920, 1931],
  ["henderson", "henderson four", "kj", "de luxe", "deluxe", "kj henderson", "henderson kj"], "touring", "chain",
  "1301 cc air-cooled inline four, F-head or side-valve, one carb",
  "The American inline four built by Excelsior. Very rare, very valuable and best restored with club help.",
  [["Inline four", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Set them"], ["Oiling", "Check system"], ["Parts", "Source early"]],
  CARB, OLD, [AMCA]))

B88.append(mk("cushman-eagle-highlander-pacemaker-1936", "Cushman", "Eagle / Highlander / Pacemaker", "Cushman Eagle / Highlander / Pacemaker", [1936, 1965],
  ["cushman", "eagle", "highlander", "pacemaker", "cushman eagle", "silver eagle"], "scooter", "chain",
  "Cushman Husky air-cooled side-valve single, one carb, two-speed on many",
  "The American scooters with the Husky flathead engine. Simple, rugged and well supported by the Cushman club.",
  [["Flathead single", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Clutch", "Adjust it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [AMCA], lessons={"E": [FLAT]}))

B88.append(mk("simplex-servi-cycle-1935", "Simplex", "Servi-Cycle", "Simplex Servi-Cycle", [1935, 1960],
  ["servi-cycle", "simplex", "servicycle", "simplex automatic", "simplex servi-cycle"], "standard", "belt",
  "125 cc air-cooled two-stroke single, belt drive, automatic clutch on later models",
  "The New Orleans-built light motorcycle. A small two-stroke, belt drive and very simple controls.",
  [["Two-stroke", "Check oiling"], ["Carb", "Clean it out"], ["Belt", "Check tension"], ["Magneto", "Check spark"], ["Parts", "Source early"]],
  TWO, OLD, [AMCA], lessons={"B": ["Most of these run premix. Check the owner's guide or the club before you mix fuel."]}))

HERO_NAME_B88 = {"can-am-ryker-2019": "RYKER", "can-am-qualifier-mx-sonic-two-stroke-1973": "CAN-AM", "dnepr-mt-m72-sidecar-soviet-1950": "DNEPR",
  "victory-v92c-v92sc-v92tc-1999": "V92C", "victory-octane-2017": "OCTANE", "buell-rr1000-rr1200-rs1200-1987": "RR1200",
  "excelsior-henderson-super-x-1999": "SUPER X", "henderson-four-kj-de-luxe-1920": "HENDERSON", "cushman-eagle-highlander-pacemaker-1936": "CUSHMAN",
  "simplex-servi-cycle-1935": "SERVI-CYCLE"}
