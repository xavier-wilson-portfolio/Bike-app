"""Batch 50 bike tunes (top 500, rows 491-500)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch38 import SCOOT
from batch34 import KAWF
B50 = []
TWO = CARB + AIR + ["H-003"]
LAMF = dict(name="Lambretta Club USA", url="https://www.lambrettaclubusa.org/", what="US club for classic Lambretta scooters.")
SPYF = dict(name="Spyder Lovers", url="https://www.spyderlovers.com/", what="Owner forum for Can-Am Spyder and Ryker.")
CFF = dict(name="CFMoto forum", url="https://www.cfmotoforum.com/", what="Owner forum for CFMoto motorcycles.")
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
PREMIX = "It runs on premix. Mix the oil into the fuel at the ratio in the manual."

B50.append(mk("lambretta-li-tv-sx-1958", "Lambretta", "Li / TV / SX", "Lambretta Li, TV and SX", [1958, 1971],
  ["lambretta", "li 150", "tv 175", "sx 200", "sx 150", "li special", "gp 200", "lambretta li", "lambretta sx"], "scooter", "chain",
  "125 to 198 cc air-cooled two-stroke single, carb, four-speed hand shift",
  "Classic Lambrettas. Hand shift, premix, a frame under removable side panels, and points ignition.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Hand shift", "Cables"], ["Points", "Gap and time"], ["Frame", "Check rust"]],
  TWO, OLD, [LAMF], lessons={"B": [PREMIX]}))

B50.append(mk("kymco-like-150-people-150-2005", "Kymco", "Like 150 / People 150", "Kymco Like 150 / People 150", [2005, 2026],
  ["like 150", "like 50", "like 200", "people 150", "people gt", "kymco like", "kymco people", "agility"], "scooter", "belt",
  "49 to 163 cc air-cooled single, carb or fuel injection, CVT",
  "Kymco's small retro and commuter scooters. Simple and cheap to run.",
  [["Small single", "Air-cooled"], ["Fuel", "Carb or EFI"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Brakes", "Check pads"]],
  [], GENNOTE, [SCOOT]))

B50.append(mk("kymco-downtown-300-ak-550-2009", "Kymco", "Downtown 300i / AK 550", "Kymco Downtown 300i / AK 550", [2009, 2026],
  ["downtown 300", "downtown 300i", "downtown 350", "ak 550", "ak550", "xciting", "xciting 400"], "scooter", "belt",
  "299 cc single or 550 cc twin, liquid-cooled, fuel injected, CVT or belt",
  "Kymco's maxi-scooters. Fuel injected, lots of storage and lots of plastic.",
  [["Engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Bodywork", "Many panels"]],
  EFI, GENNOTE, [SCOOT]))

B50.append(mk("piaggio-mp3-250-400-500-2007", "Piaggio", "MP3 250 / 400 / 500", "Piaggio MP3", [2007, 2026],
  ["mp3", "mp3 500", "mp3 400", "mp3 250", "piaggio mp3", "mp3 530", "yourban"], "scooter", "belt",
  "244 to 530 cc liquid-cooled single, fuel injected, CVT, two front wheels",
  "Piaggio's tilting three-wheeler. Two front wheels on a parallelogram, with a tilt lock to service.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Tilt lock", "Check it works"], ["Front linkage", "Check play"], ["CVT belt", "Inspect"]],
  EFI, GENNOTE, [SCOOT], lessons={"L": ["The front tilting linkage has bushings and bearings of its own. Check for play before you trust the steering."]}))

B50.append(mk("piaggio-bv-350-fly-150-2007", "Piaggio", "BV 350 / Fly 150", "Piaggio BV (Beverly) 350 / Fly 150", [2007, 2026],
  ["bv 350", "bv350", "beverly", "bv 250", "fly 150", "fly 50", "piaggio fly", "piaggio bv"], "scooter", "belt",
  "49 to 330 cc single, air- or liquid-cooled, fuel injected or carb, CVT",
  "Piaggio's big-wheel and commuter scooters. Simple, with a CVT and plastic bodywork.",
  [["Single", "Air or liquid cooled"], ["Fuel", "Carb or EFI"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Bodywork", "Many panels"]],
  [], GENNOTE, [SCOOT]))

B50.append(mk("cfmoto-300nk-650nk-700cl-x-2017", "CFMoto", "300NK / 650NK / 700CL-X", "CFMoto 300NK / 650NK / 700CL-X", [2017, 2026],
  ["300nk", "650nk", "700cl-x", "700 cl-x", "300ss", "650gt", "ibex 800", "450ss", "800nk"], "standard", "chain",
  "292 to 799 cc liquid-cooled single or twin, fuel injected",
  "CFMoto's road bikes. Fuel injected, with parts and dealer support that vary by area.",
  [["Engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Parts", "Check supply"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [CFF]))

B50.append(mk("kawasaki-klr250-1985", "Kawasaki", "KLR250", "Kawasaki KLR250", [1985, 2005],
  ["klr250", "klr 250", "klr250 dual sport", "kl250"], "dualsport", "chain",
  "249 cc liquid-cooled four-valve single, carb",
  "The smaller KLR. One carb, liquid cooled, and a balancer chain to check.",
  [["249 cc single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Balancer", "Adjust chain"], ["Valves", "Check often"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [KAWF]))

B50.append(mk("can-am-spyder-rt-f3-2008", "Can-Am", "Spyder RT / F3 / RS", "Can-Am Spyder (RT, F3, RS, ST)", [2008, 2026],
  ["spyder", "spyder rt", "spyder f3", "spyder rs", "spyder st", "can-am spyder"], "touring", "belt",
  "990 cc V-twin or 1330 cc Rotax triple, fuel injected, belt drive, two front wheels",
  "Can-Am's three-wheelers. Two wheels in front, car-like steering and lots of electronics.",
  [["Rotax engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Front end", "Ball joints"], ["Electronics", "VSS / ABS"], ["Belt drive", "Check wear"]],
  EFI, GENNOTE, [SPYF], lessons={"L": ["The front end has ball joints and tie rods like a car. Check them for play and torn boots."]}))

B50.append(mk("hyosung-gt250r-gv250-aquila-2002", "Hyosung", "GT250R / GV250 Aquila", "Hyosung GT250R / GV250 Aquila", [2002, 2018],
  ["gt250r", "gt250", "gv250", "aquila", "gt650r", "gv650", "comet 250"], "standard", "chain",
  "249 or 647 cc V-twin, carbs then fuel injection",
  "Hyosung's small V-twins. Cheap and simple, with electrical connectors and parts supply to check.",
  [["V-twin", "Air/oil or liquid"], ["Fuel", "Carbs or EFI"], ["Charging", "Check R/R"], ["Parts", "Check supply"], ["Chain drive", "Slack and lube"]],
  [], GENNOTE, []))

B50.append(mk("bultaco-sherpa-t-pursang-1964", "Bultaco", "Sherpa T / Pursang", "Bultaco Sherpa T / Pursang", [1964, 1979],
  ["sherpa t", "sherpa", "pursang", "bultaco", "matador", "alpina", "frontera"], "dualsport", "chain",
  "125 to 350 cc air-cooled two-stroke single, Amal or Bing carb, premix",
  "The Spanish trials and motocross Bultacos. Premix two-strokes, magneto ignition and a strong club scene.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Magneto", "Check it"], ["Crank seals", "Check them"], ["Chain drive", "Slack and lube"]],
  TWO, OLD, [], lessons={"B": [PREMIX]}))

HERO_NAME_B50 = {"lambretta-li-tv-sx-1958": "LAMBRETTA", "kymco-like-150-people-150-2005": "LIKE 150", "kymco-downtown-300-ak-550-2009": "DOWNTOWN",
  "piaggio-mp3-250-400-500-2007": "MP3", "piaggio-bv-350-fly-150-2007": "BV 350", "cfmoto-300nk-650nk-700cl-x-2017": "CFMOTO", "kawasaki-klr250-1985": "KLR250",
  "can-am-spyder-rt-f3-2008": "SPYDER", "hyosung-gt250r-gv250-aquila-2002": "AQUILA", "bultaco-sherpa-t-pursang-1964": "SHERPA"}
