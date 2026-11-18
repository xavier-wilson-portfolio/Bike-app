"""Batch 10 bike tunes (top 100, rows 93-100)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B10 = []
AIRH = dict(name="Airheads Beemer Club", url="https://www.airheads.org/", what="Tech library and owner club for BMW airhead twins.")
NOC = dict(name="Norton Owners Club", url="https://www.nortonownersclub.org/", what="Owner club and forum for Nortons.")
AXN = dict(name="Access Norton forum", url="https://www.accessnorton.com/", what="Owner forum for Norton Commandos and other British twins.")

B10.append(dict(id="triumph-bonneville-t140-1973", make="Triumph", model="Bonneville T140", name="Triumph Bonneville T140", years=[1973, 1983],
  match=["t140", "t140v", "t140e", "t140d", "bonneville 750", "tr7", "tiger 750"], style="standard", drive="chain",
  engine="744 cc air-cooled OHV parallel twin, two Amal carbs, oil in frame",
  intro="The last Meriden Bonneville. Spares are easy. Bikes that sat for decades need a real rebuild.",
  focus=[["744 cc OHV twin", "Air-cooled"], ["Two Amal carbs", "Wear fast"], ["Oil in frame", "Clean the tank"], ["Lucas electrics", "Points or electronic"], ["Seals", "Gearbox output shaft"]],
  remove=CARB + AIR, patch={},
  add=[step("X-T14-01", "H", "H-001", "Clean the oil tank in the frame", "Drain the frame oil tank and flush out sludge. Check the strainer. If the frame was blasted, make sure no grit is left inside.", "Sludge or blast grit in the frame tank goes straight into the engine.", "Motorcycle Classics oil-in-frame notes", hours=1.5)],
  lessons={"H": ["Bikes that stood for decades usually have hard seals and corroded internals. Plan on a full engine rebuild."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Long storage", what="Hard oil seals and corroded engine and gearbox internals are common on bikes that sat for years.", src="https://www.pressreader.com/uk/classic-bike-uk/20180901/282862256737502")],
  forums=[]))

B10.append(dict(id="triumph-street-triple-765-2017", make="Triumph", model="Street Triple 765", name="Triumph Street Triple 765", years=[2017, 2026],
  match=["street triple", "street triple 765", "street triple rs", "street triple r", "street triple s", "765"], style="sport", drive="chain",
  engine="765 cc liquid-cooled inline triple, fuel injected",
  intro="Triumph's naked triple. Mostly routine service. Check recalls and crash damage.",
  focus=[["765 cc triple", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Recalls", "Run the VIN"], ["Crash damage", "Bars, pegs, radiator"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2018-2020 Street Triple RS bikes were in a Triumph recall (SRAN579) for the Brembo front brake.", reason="Brake recalls are free to fix and matter.")},
  add=[], lessons={"E": ["Check the bar ends, footpegs, levers and radiator for crash damage."]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B10.append(dict(id="bmw-r75-5-and-6-airheads-1970", make="BMW", model="R75/5", name="BMW R75/5 and /6", years=[1970, 1976],
  match=["r75/5", "r75 5", "r75/6", "r60/5", "r50/5", "r90/6", "r90s", "slash 5", "/5"], style="standard", drive="shaft",
  engine="745 cc air-cooled boxer twin, two Bing carbs, shaft drive",
  intro="The /5 and /6 airheads. Tough engines. The charging parts and starter relay cause most trouble.",
  focus=[["Boxer twin", "Air-cooled"], ["Two Bing carbs", "Easy to service"], ["Diode board", "Solder joints fail"], ["Timing chain", "Check tensioner"], ["Shaft drive", "Splines and U-joints"]],
  remove=CARB + AIR, patch={},
  add=[step("X-AH5-01", "F", "F-002", "Check the diode board", "With the battery disconnected, take off the front cover. Check the solder joints on the large diodes, the ground wires and the rubber mounts.", "Diode board failures usually start at a cracked solder joint on a power diode.", "Airheads Beemer Club", hours=1.0)],
  lessons={"F": ["The /5 starter relay can act like a weak battery. Check it before buying a new battery."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Diode board", what="Most diode board failures are at the solder joints of the large power diodes.", src="https://airheads.org/page/11/?p=0")],
  forums=[AIRH]))

B10.append(dict(id="royal-enfield-interceptor-650-2019", make="Royal Enfield", model="Interceptor 650", name="Royal Enfield Interceptor 650", years=[2019, 2026],
  match=["interceptor", "interceptor 650", "int 650"], style="standard", drive="chain",
  engine="648 cc air/oil-cooled SOHC parallel twin, fuel injected",
  intro="Royal Enfield's 650 twin. Simple and easy to work on. Check the brake caliper recall.",
  focus=[["648 cc twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Brake recall", "Caliper corrosion"], ["Chain drive", "Slack and lube"], ["Finish", "Check for rust"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2018-2020 Interceptor and Continental GT 650s were in recall 21V045 because road salt can corrode the brake calipers.", reason="Corroded calipers can drag or lose braking. The repair is free.")},
  add=[], lessons={"K": ["If the bike was ridden in winter, look closely at the calipers and brake lines for corrosion."]},
  recalls=[dict(id="21V045", years="2018-2020", what="Road salt can corrode the brake calipers.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/royal-enfield/interceptor-650/2019/21v045000")],
  known=[], forums=[]))

B10.append(dict(id="bmw-r100-airheads-1976", make="BMW", model="R100", name="BMW R100 airheads", years=[1976, 1995],
  match=["r100", "r100/7", "r100rs", "r100rt", "r100s", "r100gs", "r100r", "r80", "r65", "airhead"], style="standard", drive="shaft",
  engine="980 cc air-cooled boxer twin, two Bing carbs, shaft drive",
  intro="The big airheads. Charging system care and a timing chain check cover most of the risks.",
  focus=[["980 cc boxer", "Air-cooled"], ["Two Bing carbs", "Sync them"], ["Diode board", "Grounds and mounts"], ["Timing chain", "Tensioner wear"], ["Shaft drive", "Splines"]],
  remove=CARB + AIR, patch={},
  add=[step("X-AH1-01", "F", "F-002", "Check the charging system", "Measure battery voltage at full output; it should be at least 13.2 V. Check the diode board solder joints and replace its rubber mounts and ground wires when you have it out.", "High resistance in the charging circuit wastes power as heat and kills batteries.", "California BMW charging notes", hours=1.0),
       step("X-AH1-02", "H", "H-003", "Listen for timing chain noise", "Listen at the front of the engine for clatter. A worn tensioner is cheap and easy to replace.", "A worn timing chain tensioner causes clatter and chain wear.", "Classic Bike Hub airhead notes", hours=0.5)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Charging", what="Excess resistance in the charging circuit is a common cause of a flat battery.", src="https://horizonsunlimited.com/node/2545")],
  forums=[AIRH]))

B10.append(dict(id="royal-enfield-himalayan-411-2018", make="Royal Enfield", model="Himalayan 411", name="Royal Enfield Himalayan 411", years=[2018, 2023],
  match=["himalayan", "himalayan 411", "himalayan 410"], style="adventure", drive="chain",
  engine="411 cc air/oil-cooled SOHC single, fuel injected",
  intro="A simple, slow adventure single. Most 2017-2021 bikes needed new brake calipers under recall.",
  focus=[["411 cc single", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Caliper recall", "2017-2021"], ["Chain drive", "Slack and lube"], ["Off-road wear", "Bearings and spokes"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2017-2021 Himalayans are in recall 23V129 because road salt can corrode the front and rear calipers. Dealers replace both calipers.", reason="Corroded calipers can cause a total loss of braking. The repair is free.")},
  add=[], lessons={},
  recalls=[dict(id="23V129", years="2017-2021", what="Road salt can corrode the brake calipers and cause a loss of braking.", fix="Dealer replaces front and rear calipers free.", src="https://www.rideapart.com/news/656284/royal-enfield-himalayan-brakes-recall/")],
  known=[], forums=[]))

B10.append(dict(id="norton-commando-1968", make="Norton", model="Commando", name="Norton Commando", years=[1968, 1977],
  match=["commando", "norton commando", "commando 750", "commando 850", "fastback", "roadster", "interstate"], style="standard", drive="chain",
  engine="745 or 828 cc air-cooled OHV parallel twin, two Amal carbs, Isolastic mounts",
  intro="The Isolastic-mounted British twin. Isolastic shims and wet sumping are the two things to understand.",
  focus=[["750 or 850 twin", "Air-cooled"], ["Isolastics", "Shim correctly"], ["Wet sumping", "Oil drains to sump"], ["Two Amal carbs", "Inlet leaks"], ["Matching numbers", "Check the frame"]],
  remove=CARB + AIR, patch={},
  add=[step("X-NOR-01", "E", "E-002", "Check and shim the Isolastics", "Check the front and rear Isolastic mounts for play. When shimming, keep the shims even on both sides.", "Worn or badly shimmed Isolastics make the bike handle badly and shake.", "Norton Owners Club forum", skill="Advanced", hours=2.0),
       step("X-NOR-02", "H", "H-001", "Check for wet sumping", "Note the oil tank level when you park the bike and again a few days later. If a lot has drained into the sump, check the oil pump and timing cover seals.", "A worn pump can starve the top end of oil. Some wet sumping on a stored bike is normal.", "Motorcycle Classics wet sumping guide", hours=0.5)],
  lessons={"H": ["Don't fit an anti-drain tap. Forgetting to open it can wreck the engine."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Wet sumping", what="Oil drains from the tank to the sump when the bike sits. It is common on dry-sump British twins.", src="https://www.motorcycleclassics.com/classic-motorcycle-repair/solving-wet-sumping-issues-on-norton-commandos-zm0z21jazbut/")],
  forums=[NOC, AXN]))

B10.append(dict(id="ducati-scrambler-800-2015", make="Ducati", model="Scrambler 800", name="Ducati Scrambler 800", years=[2015, 2022],
  match=["scrambler", "ducati scrambler", "scrambler 800", "scrambler icon", "full throttle", "cafe racer", "desert sled", "night shift"], style="standard", drive="chain",
  engine="803 cc air-cooled L-twin, Desmodue, fuel injected, belt-driven cams",
  intro="Ducati's air-cooled Scrambler. The cam belts and valve service on schedule are the big jobs.",
  focus=[["803 cc L-twin", "Air-cooled"], ["Cam belts", "Replace on time"], ["Desmo valves", "Check clearances"], ["Recalls", "Some years"], ["Chain drive", "Slack and lube"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Recalls include a side stand pivot nut on 2015-2016 bikes, the front brake master cylinder on 2017-2018 Cafe Racers (17V812), and turn signals on 2021 Night Shift bikes (21V361).", reason="The side stand and brake recalls are safety items. Repairs are free.")},
  add=[step("X-DSC-01", "H", "H-003", "Check cam belt age and valve service", "Find out when the cam belts were last replaced and when the desmo valves were last checked. If you can't prove it, do both.", "A cam belt that breaks wrecks the engine.", "Ducati service schedule", skill="Advanced", hours=3.0)],
  lessons={}, recalls=[dict(id="17V812", years="2017-2018 Cafe Racer", what="Front brake master cylinder may fail.", fix="Dealer replaces the master cylinder piston free.", src="https://motorcyclistonline.com/8000-late-model-ducati-motorcycles-being-recalled-for-brakes-that-may-fail")],
  known=[], forums=[]))

HERO_NAME_B10 = {"triumph-bonneville-t140-1973": "T140", "triumph-street-triple-765-2017": "STREET TRIPLE", "bmw-r75-5-and-6-airheads-1970": "R75/5",
  "royal-enfield-interceptor-650-2019": "INTERCEPTOR", "bmw-r100-airheads-1976": "R100", "royal-enfield-himalayan-411-2018": "HIMALAYAN",
  "norton-commando-1968": "COMMANDO", "ducati-scrambler-800-2015": "SCRAMBLER"}
