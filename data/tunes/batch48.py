"""Batch 48 bike tunes (top 500, rows 471-480)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch19 import AMCA
from batch44 import CLASSIC
from batch47 import mk
B48 = []
INDF = dict(name="Indian Motorcycle Forum", url="https://www.indianmotorcycleforum.com/", what="Owner forum for modern Indian motorcycles.")
VICF = dict(name="Victory Motorcycle Club forums", url="https://www.victorymotorcycleclub.com/", what="Owner club for Victory motorcycles.")
REF = dict(name="Royal Enfield community", url="https://www.royalenfield.com/us/en/", what="Royal Enfield USA, with dealer and owner resources.")
POLNOTE = "Polaris (Indian and Victory) issued several recalls on these bikes. Run your VIN at nhtsa.gov/recalls before you start."
RENOTE = "Royal Enfield has issued recalls on some bikes in these years. Run your VIN at nhtsa.gov/recalls before you start."

B48.append(mk("indian-ftr-1200-2019", "Indian", "FTR 1200", "Indian FTR 1200 / FTR", [2019, 2026],
  ["ftr", "ftr 1200", "ftr1200", "ftr s", "ftr rally", "ftr r carbon", "ftr sport"], "standard", "chain",
  "1203 cc liquid-cooled V-twin, fuel injected",
  "Indian's flat-track styled street bike. Liquid-cooled V-twin with the fuel tank under the seat.",
  [["1203 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fuel tank", "Under seat"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, POLNOTE, [INDF]))

B48.append(mk("indian-chief-1940s-1953-1940", "Indian", "Chief (1940-1953)", "Indian Chief (1940-1953)", [1940, 1953],
  ["chief 1940s", "1947 chief", "1948 chief", "roadmaster chief", "indian chief 74", "chief 80", "blackhawk chief"], "cruiser", "chain",
  "1200 or 1300 cc air-cooled side-valve V-twin, one carb, six-volt",
  "The skirted-fender Indian Chief. Side valves, a hand shift on many, and a lot of specialist parts.",
  [["Flathead V-twin", "Air-cooled"], ["Carb", "Linkert"], ["Six-volt", "Generator"], ["Hand shift", "On many"], ["Parts", "Specialist"]],
  CARB + AIR, OLD, [AMCA]))

B48.append(mk("indian-challenger-pursuit-2020", "Indian", "Challenger / Pursuit", "Indian Challenger / Pursuit", [2020, 2026],
  ["challenger", "indian challenger", "pursuit", "indian pursuit", "challenger dark horse", "pursuit limited", "powerplus"], "touring", "belt",
  "1768 cc liquid-cooled PowerPlus V-twin, fuel injected, belt drive",
  "Indian's liquid-cooled baggers. Lots of electronics, belt drive and a big fairing.",
  [["PowerPlus V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Infotainment", "Ride Command"], ["Cooling", "Coolant and fans"], ["Belt drive", "Check wear"]],
  EFI, POLNOTE, [INDF]))

B48.append(mk("victory-vegas-hammer-kingpin-2003", "Victory", "Vegas / Hammer / Kingpin", "Victory Vegas, Hammer, Kingpin", [2003, 2017],
  ["vegas", "vegas 8 ball", "hammer", "kingpin", "high-ball", "highball", "gunner", "judge", "boardwalk", "jackpot"], "cruiser", "belt",
  "1634 or 1731 cc air/oil-cooled Freedom V-twin, fuel injected, belt drive",
  "Victory's cruisers. Freedom V-twin, belt drive, and a brand that ended in 2017, so some parts need hunting.",
  [["Freedom V-twin", "Air/oil cooled"], ["Fuel injected", "No carbs"], ["Cam tensioners", "Check them"], ["Belt drive", "Check wear"], ["Parts", "Brand ended 2017"]],
  EFI, POLNOTE, [VICF]))

B48.append(mk("victory-cross-country-vision-2008", "Victory", "Cross Country / Vision / Magnum", "Victory Cross Country, Vision, Magnum", [2008, 2017],
  ["cross country", "cross roads", "vision", "vision tour", "magnum", "cross country tour", "victory vision"], "touring", "belt",
  "1731 cc air/oil-cooled Freedom V-twin, fuel injected, belt drive",
  "Victory's baggers and the space-age Vision. Belt drive, lots of bodywork and some hard-to-find parts.",
  [["Freedom V-twin", "Air/oil cooled"], ["Fuel injected", "No carbs"], ["Bodywork", "Many panels"], ["Belt drive", "Check wear"], ["Parts", "Brand ended 2017"]],
  EFI, POLNOTE, [VICF]))

B48.append(mk("royal-enfield-hunter-350-meteor-350-2021", "Royal Enfield", "Hunter 350 / Meteor 350", "Royal Enfield Hunter 350 / Meteor 350", [2021, 2026],
  ["hunter 350", "meteor 350", "hunter", "meteor"], "standard", "chain",
  "349 cc air/oil-cooled J-series single, fuel injected",
  "Royal Enfield's J-platform 350s. Simple, slow and easy to keep running.",
  [["349 cc single", "Air/oil cooled"], ["Fuel injected", "No carbs"], ["Valves", "Screw adjusters"], ["Chain drive", "Slack and lube"], ["Fasteners", "Check them"]],
  EFI, RENOTE, [REF]))

B48.append(mk("royal-enfield-super-meteor-650-shotgun-650-2023", "Royal Enfield", "Super Meteor 650 / Shotgun 650", "Royal Enfield Super Meteor 650 / Shotgun 650", [2023, 2026],
  ["super meteor", "super meteor 650", "shotgun 650", "shotgun"], "cruiser", "chain",
  "648 cc air/oil-cooled parallel twin, fuel injected",
  "Royal Enfield's 650 twin cruisers. The same twin as the Interceptor in a low, long frame.",
  [["648 cc twin", "Air/oil cooled"], ["Fuel injected", "No carbs"], ["Valves", "Screw adjusters"], ["Chain drive", "Slack and lube"], ["Fasteners", "Check them"]],
  EFI, RENOTE, [REF]))

B48.append(mk("royal-enfield-himalayan-450-2024", "Royal Enfield", "Himalayan 450", "Royal Enfield Himalayan 450", [2024, 2026],
  ["himalayan 450", "himalayan 452", "guerrilla 450", "himalayan 2024"], "adventure", "chain",
  "452 cc liquid-cooled Sherpa single, ride-by-wire fuel injection",
  "The liquid-cooled Himalayan. Much more power than the 411, with a round TFT dash.",
  [["452 cc single", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Valves", "Check interval"], ["Spoked wheels", "Check spokes"], ["Chain drive", "Slack and lube"]],
  EFI, RENOTE, [REF]))

B48.append(mk("norton-atlas-dominator-650-1956", "Norton", "Dominator / Atlas / 650SS", "Norton Dominator, 650SS and Atlas", [1956, 1968],
  ["dominator", "atlas", "650ss", "norton atlas", "norton dominator", "dominator 99", "88ss", "featherbed"], "standard", "chain",
  "497 to 745 cc air-cooled parallel twin, Amal carbs, magneto or points",
  "Featherbed-frame Norton twins. Amal carbs, magneto on most, and a lot of vibration on the Atlas.",
  [["Parallel twin", "Air-cooled"], ["Amal carbs", "Clean and sync"], ["Magneto", "Check it"], ["Featherbed frame", "Check welds"], ["Chain drive", "Slack and lube"]],
  CARB + AIR, OLD, [CLASSIC]))

B48.append(mk("bsa-gold-star-dbd34-1938", "BSA", "Gold Star", "BSA Gold Star", [1938, 1963],
  ["gold star", "goldie", "dbd34", "db34", "bsa gold star", "cb34", "zb32"], "standard", "chain",
  "348 or 499 cc air-cooled single, Amal GP carb, magneto",
  "The classic British clubman single. Amal GP carb, magneto and a lot of fakes, so check the numbers.",
  [["Single", "Air-cooled"], ["Amal GP carb", "Tune it"], ["Magneto", "Check it"], ["Numbers", "Check they match"], ["Chain drive", "Slack and lube"]],
  CARB + AIR, OLD, [CLASSIC], lessons={"A": ["Many 'Gold Stars' are built from other BSAs. Check frame and engine numbers against club records before you pay or restore."]}))

HERO_NAME_B48 = {"indian-ftr-1200-2019": "FTR", "indian-chief-1940s-1953-1940": "CHIEF", "indian-challenger-pursuit-2020": "CHALLENGER",
  "victory-vegas-hammer-kingpin-2003": "VEGAS", "victory-cross-country-vision-2008": "CROSS COUNTRY", "royal-enfield-hunter-350-meteor-350-2021": "HUNTER 350",
  "royal-enfield-super-meteor-650-shotgun-650-2023": "SUPER METEOR", "royal-enfield-himalayan-450-2024": "HIMALAYAN 450",
  "norton-atlas-dominator-650-1956": "ATLAS", "bsa-gold-star-dbd34-1938": "GOLD STAR"}
