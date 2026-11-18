"""Batch 27 bike tunes (top 500, rows 261-270)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch18 import TC_STEP, TC_KNOWN, TC_LESSON, FMH2
from batch19 import AMCA, SPLINE
from batch20 import KBK
B27 = []
HDNOTE = "Harley-Davidson has issued several recalls that touch these years. Run your VIN at nhtsa.gov/recalls before you start."
BMWNOTE = "BMW has issued several recalls across these years. Run your VIN at nhtsa.gov/recalls before you start."
HDF = dict(name="HDForums", url="https://www.hdforums.com/", what="Large owner forum for all Harley-Davidson models.")
XLF = dict(name="XLForum", url="https://www.xlforum.net/", what="Owner forum for Harley Sportsters.")
MOA = dict(name="BMW MOA forum", url="https://forums.bmwmoa.org/", what="BMW Motorcycle Owners of America forum.")

B27.append(dict(id="harley-davidson-knucklehead-1936", make="Harley-Davidson", model="Knucklehead (EL/FL)", name="Harley-Davidson Knucklehead", years=[1936, 1947],
  match=["knucklehead", "knuckle", "el", "fl knucklehead", "61 ohv", "74 ohv", "1936 el"], style="cruiser", drive="chain",
  engine="61 or 74 cubic inch air-cooled OHV V-twin, single carb, total-loss or early recirculating oiling, magneto or points",
  intro="Harley's first overhead-valve big twin. A collector bike. Originality and correct parts matter as much as getting it running.",
  focus=[["OHV V-twin", "Air-cooled"], ["Single carb", "Linkert type"], ["Oiling", "Check the pump"], ["Hand shift", "Foot clutch"], ["Originality", "Document it"]],
  remove=CARB + AIR, patch={},
  add=[step("X-KN-01", "A", "A-002", "Record the engine and frame numbers", "Photograph and write down the engine case number and any frame numbers. Compare them to known numbering before you buy parts or value the bike.", "Matching, original numbers make a big difference on a Knucklehead.", "AMCA guidance", skill="Beginner", hours=0.5)],
  lessons={"G": ["Most Knuckleheads use a Linkert carb. Get the right rebuild kit for the model number on the carb."], "F": ["Many early bikes run 6-volt electrics. Check before you buy bulbs or a battery."]},
  recalls=[], recallNote=OLD, known=[], forums=[AMCA]))

B27.append(dict(id="harley-davidson-flathead-wl-45-1937", make="Harley-Davidson", model="WL 45 Flathead", name="Harley-Davidson WL 45 Flathead", years=[1937, 1952],
  match=["wl", "wla", "wl45", "45 flathead", "flathead 45", "wlc", "wr", "liberator"], style="cruiser", drive="chain",
  engine="45 cubic inch (750 cc) air-cooled side-valve V-twin, single carb",
  intro="The 45 flathead, including the WLA army bike. Simple side-valve engine, hand shift and foot clutch.",
  focus=[["45 ci flathead", "Side valves"], ["Single carb", "Linkert type"], ["Hand shift", "Foot clutch"], ["6-volt", "Check electrics"], ["Originality", "Document it"]],
  remove=CARB + AIR + ["H-003"], patch={},
  add=[step("X-WL-01", "A", "A-002", "Record the engine and frame numbers", "Photograph and write down the engine case number. Military WLA bikes and civilian WLs have different number formats.", "Numbers tell you what the bike really is, which matters for parts and value.", "AMCA guidance", skill="Beginner", hours=0.5)],
  lessons={"H": ["A flathead has its valves in the cylinder. Valve work means lifting the heads and cylinders, not a quick shim check."]},
  recalls=[], recallNote=OLD, known=[], forums=[AMCA]))

B27.append(dict(id="harley-davidson-sportster-1200-1988", make="Harley-Davidson", model="Sportster 1200 (solid-mount Evolution)", name="Harley-Davidson Sportster 1200 (1988-2003)", years=[1988, 2003],
  match=["sportster 1200", "xl1200", "xl1200c", "xl1200s", "sportster custom", "sportster sport", "xlh1200", "xlh 1200"], style="cruiser", drive="belt",
  engine="1200 cc air-cooled Evolution V-twin, single carb, solid-mounted, chain or belt final drive",
  intro="The solid-mount Evo Sportster 1200. A single carb and a lot of vibration, which shakes bolts and brackets loose.",
  focus=[["1200 Evo V-twin", "Air-cooled"], ["Single carb", "Keihin CV"], ["Solid mount", "Check every bolt"], ["Charging", "Stator and R/R"], ["Primary", "Separate oil"]],
  remove=AIR + CARB, patch={}, add=[],
  lessons={"E": ["Early bikes have a chain final drive, later ones a belt. Check which yours has."], "H": ["The Sportster primary has its own oil. Change engine oil, primary oil and check the transmission oil level."]},
  recalls=[], recallNote=HDNOTE, known=[], forums=[XLF]))

B27.append(dict(id="harley-davidson-road-glide-1998", make="Harley-Davidson", model="Road Glide (FLTR)", name="Harley-Davidson Road Glide", years=[1998, 2016],
  match=["road glide", "fltr", "fltrx", "fltru", "road glide special", "road glide ultra", "fltrxs"], style="touring", drive="belt",
  engine="Evolution (1998) or Twin Cam 88, 96, 103 or 110 V-twin, carb or fuel injected, belt drive",
  intro="The frame-mounted shark-nose fairing Harley. On 1999-2006 bikes, check the cam chain tensioner shoes first.",
  focus=[["Twin Cam V-twin", "Most years"], ["Carb or EFI", "Depends on year"], ["Cam tensioners", "1999-2006"], ["Belt drive", "Check for cracks"], ["Fairing wiring", "Frame mounted"]],
  remove=AIR, patch={}, add=[TC_STEP], lessons=TC_LESSON,
  recalls=[], recallNote=HDNOTE, known=[TC_KNOWN], forums=[FMH2, HDF]))

B27.append(dict(id="harley-davidson-street-glide-2006", make="Harley-Davidson", model="Street Glide (Twin Cam)", name="Harley-Davidson Street Glide (Twin Cam)", years=[2006, 2016],
  match=["street glide", "flhx", "flhxs", "street glide special", "flhxse", "cvo street glide"], style="touring", drive="belt",
  engine="Twin Cam 88, 96, 103 or 110 V-twin, fuel injected, belt drive",
  intro="The batwing bagger, Twin Cam years. 2006 bikes still have the spring tensioner shoes.",
  focus=[["Twin Cam V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Cam tensioners", "2006"], ["Belt drive", "Check for cracks"], ["Charging", "Stator and R/R"]],
  remove=AIR + EFI, patch={}, add=[TC_STEP],
  lessons={"H": TC_LESSON["H"]},
  recalls=[], recallNote=HDNOTE, known=[TC_KNOWN], forums=[FMH2, HDF]))

B27.append(dict(id="harley-davidson-shovelhead-super-glide-fx-1971", make="Harley-Davidson", model="Shovelhead Super Glide (FX)", name="Harley-Davidson Super Glide (Shovelhead FX)", years=[1971, 1984],
  match=["super glide", "fx", "fxe", "fxs", "low rider", "fxef", "fxwg", "wide glide", "shovelhead super glide"], style="cruiser", drive="chain",
  engine="74 or 80 cubic inch air-cooled Shovelhead V-twin, single carb",
  intro="The original factory custom, Shovelhead era. Points ignition, a single carb and a chain final drive on most.",
  focus=[["Shovelhead V-twin", "Air-cooled"], ["Single carb", "Bendix or Keihin"], ["Points ignition", "Gap and timing"], ["Chain drive", "Slack and lube"], ["Oil leaks", "Expected"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"G": ["Early Shovels use a Bendix carb, later ones a Keihin butterfly carb. Check which one you have before buying parts."]},
  recalls=[], recallNote=OLD, known=[], forums=[HDF]))

B27.append(dict(id="harley-davidson-nightster-975-2022", make="Harley-Davidson", model="Nightster (RH975)", name="Harley-Davidson Nightster 975", years=[2022, 2026],
  match=["nightster 975", "rh975", "nightster", "nightster special", "rh975s"], style="cruiser", drive="belt",
  engine="975 cc liquid-cooled Revolution Max V-twin, fuel injected, belt drive",
  intro="The liquid-cooled Sportster. Some early 2022 bikes have a handlebar recall.",
  focus=[["975 cc V-twin", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Handlebar recall", "2022"], ["Belt drive", "Check for cracks"], ["Cooling", "Hoses and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Some 2022 Nightsters built Dec 2021 to Sep 2022 are in recall 22V745 because the handlebar weld can separate.", reason="A broken handlebar means losing steering. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="22V745", years="2022 (Dec 2021-Sep 2022 build)", what="Handlebar weld may separate between the inner and outer sections.", fix="Dealer replaces the handlebar free.", src="https://vehiclesafetyrecalls.com/recall/22V745000")],
  known=[], forums=[XLF]))

B27.append(dict(id="harley-davidson-softail-deluxe-breakout-2005", make="Harley-Davidson", model="Softail Deluxe / Breakout (Twin Cam)", name="Harley-Davidson Softail Deluxe / Breakout", years=[2005, 2017],
  match=["softail deluxe", "flstn", "breakout", "fxsb", "fxsbse", "cvo breakout", "deluxe"], style="cruiser", drive="belt",
  engine="Twin Cam 88B, 96B, 103B or 110B counterbalanced V-twin, fuel injected, belt drive",
  intro="Twin Cam Softails. 2005-2006 bikes still have the spring tensioner shoes.",
  focus=[["Twin Cam B", "Counterbalanced"], ["Fuel injected", "No carbs"], ["Cam tensioners", "2005-2006"], ["Belt drive", "Check for cracks"], ["Hidden shocks", "Under the frame"]],
  remove=AIR + EFI, patch={}, add=[TC_STEP],
  lessons={"H": TC_LESSON["H"]},
  recalls=[], recallNote=HDNOTE, known=[TC_KNOWN], forums=[FMH2, HDF]))

B27.append(dict(id="bmw-r1200rt-2005", make="BMW", model="R1200RT", name="BMW R1200RT", years=[2005, 2018],
  match=["r1200rt", "r 1200 rt", "r1200 rt", "rt1200", "r1200rt-p", "r1200rt lc"], style="touring", drive="shaft",
  engine="1170 cc air/oil-cooled boxer twin (to 2013) or liquid-cooled boxer (2014-on), fuel injected, shaft drive",
  intro="BMW's boxer tourer. Several recalls over the years, including the 2014 Dynamic ESA rear shock.",
  focus=[["Boxer twin", "Air/oil or liquid"], ["Fuel injected", "No carbs"], ["Recalls", "Several years"], ["Shaft drive", "Splines and final drive"], ["ABS brakes", "Servo on early bikes"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2007-2009 bikes are in recall 09V256 (brake lines may leak). Some 2005-2010 bikes are in recall 15V141 (rear wheel flange). 2014 bikes with Dynamic ESA are in recall 14V320 (rear shock rod can break, with a do-not-ride warning). Older R1200s also had fuel pump flange recalls (13V617 and 20V471).", reason="A broken shock or leaking brake line is a crash risk. Every fix is free.")},
  add=[SPLINE],
  lessons={"H": ["2014-on RTs are liquid-cooled. Earlier ones are air/oil-cooled and have no coolant to change."]},
  recalls=[dict(id="09V256", years="2007-2009", what="Brake lines may leak.", fix="Free dealer repair.", src="https://forums.bmwmoa.org/threads/listing-of-recall-notices.72127/latest"),
           dict(id="15V141", years="2005-2010 (some)", what="Aluminum rear wheel flange can let the wheel bolts loosen.", fix="Dealer fits a steel rear wheel flange free.", src="https://recallcheck.net/recall/15V141000"),
           dict(id="14V320", years="2014 with Dynamic ESA", what="Rear shock piston rod can break without warning.", fix="Dealer replaces the Dynamic ESA shock free.", src="https://auto-recalls.justia.com/bmw/r1200-rt/2014/14v320000")],
  known=[], forums=[MOA]))

B27.append(dict(id="bmw-k1200lt-1999", make="BMW", model="K1200LT", name="BMW K1200LT", years=[1999, 2009],
  match=["k1200lt", "k 1200 lt", "k1200 lt", "klt", "k1200ltc"], style="touring", drive="shaft",
  engine="1171 cc liquid-cooled inline four, fuel injected, shaft drive",
  intro="BMW's big four-cylinder tourer. Heavy, comfortable, with servo ABS brakes and a lot of bodywork.",
  focus=[["1171 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Servo ABS", "Bleed procedure"], ["Shaft drive", "Splines and final drive"], ["Bodywork", "Many panels"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2005 K1200LTs are in recall 04V438 (anti-theft control unit can cut the fuel pump).", reason="BMW has had other recalls in these years too, so check the full VIN list.")},
  add=[SPLINE],
  lessons={"K": ["Early bikes have the servo-assisted integral ABS. Bleeding it takes the BMW procedure and sometimes a dealer tool."]},
  recalls=[dict(id="04V438", years="2005 (some)", what="Anti-theft control unit problem that affects the fuel pump.", fix="Dealer inspects and replaces the anti-theft control unit free.", src="https://auto-recalls.justia.com/bmw/k1200-lt/2005/04v438000")],
  recallNote=BMWNOTE, known=[], forums=[KBK, MOA]))

HERO_NAME_B27 = {"harley-davidson-knucklehead-1936": "KNUCKLEHEAD", "harley-davidson-flathead-wl-45-1937": "WL 45", "harley-davidson-sportster-1200-1988": "SPORTSTER 1200",
  "harley-davidson-road-glide-1998": "ROAD GLIDE", "harley-davidson-street-glide-2006": "STREET GLIDE", "harley-davidson-shovelhead-super-glide-fx-1971": "SUPER GLIDE",
  "harley-davidson-nightster-975-2022": "NIGHTSTER", "harley-davidson-softail-deluxe-breakout-2005": "BREAKOUT", "bmw-r1200rt-2005": "R1200RT", "bmw-k1200lt-1999": "K1200LT"}
