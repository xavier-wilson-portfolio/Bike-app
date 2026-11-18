"""Batch 18 bike tunes (top 500, rows 171-180)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B18 = []
GSR = dict(name="The GS Resources forum", url="https://www.thegsresources.com/_forum/", what="Owner forum for Suzuki GS fours and twins.")
FMH2 = dict(name="Fix My Hog", url="https://fixmyhog.com/", what="Harley repair videos, including Twin Cam tensioner work.")
TC_STEP = step("X-TC-01", "H", "H-003", "Inspect the cam chain tensioner shoes", "Pull the cam cover and look at the plastic tensioner shoes. If they are worn deep or cracked, replace them, or fit the later hydraulic tensioners or a gear drive.", "The spring-loaded shoes on 1999-2006 Twin Cams wear through and can send debris into the oil pump.", "Fix My Hog Twin Cam tensioner notes", skill="Advanced", hours=2.5)
TC_KNOWN = dict(title="Cam chain tensioners", what="1999-2006 Twin Cams (except the 2006 Dyna) use spring-loaded plastic tensioner shoes that wear out. Harley moved to hydraulic tensioners in 2006 and 2007.", src="https://fixmyhog.com/video/twin-cam-gear-drive-conversion-015478")
TC_LESSON = {"G": ["Some Twin Cams have a carb and others are fuel injected. Skip the steps that don't match your bike."], "H": ["Twin Cams from 2007 on have hydraulic tensioners and don't share the early shoe problem."]}

B18.append(dict(id="suzuki-s40-savage-1986", make="Suzuki", model="S40 Savage", name="Suzuki Savage / Boulevard S40", years=[1986, 2019],
  match=["savage", "ls650", "s40", "boulevard s40", "savage 650"], style="cruiser", drive="belt",
  engine="652 cc air-cooled SOHC single, one carb, belt drive",
  intro="A simple big-single cruiser. Keep up with valve adjustments, the carb and the belt.",
  focus=[["652 cc single", "Air-cooled"], ["One carb", "Clean if stored"], ["Valves", "Screw adjusters"], ["Belt drive", "Tension"], ["Brakes", "Weak front"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"H": ["The valves need regular adjustment. Don't skip it."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Valve adjustments", what="Older bikes wear on valve adjustments and the clutch. Brakes are a common complaint.", src="https://vincheck.info/?p=80846")],
  forums=[]))

B18.append(dict(id="suzuki-intruder-1400-1987", make="Suzuki", model="Intruder 1400", name="Suzuki Intruder 1400", years=[1987, 2004],
  match=["intruder 1400", "vs1400", "vs 1400", "boulevard s83", "s83"], style="cruiser", drive="shaft",
  engine="1360 cc air/oil-cooled SOHC V-twin, two carbs, four-speed, shaft drive",
  intro="A tough, long-lived cruiser. Carbs and starting problems are the usual jobs.",
  focus=[["1360 cc V-twin", "Air/oil-cooled"], ["Two carbs", "Clean and sync"], ["Starting", "Single click"], ["Shaft drive", "Final drive oil"], ["Four-speed", "Normal for it"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD,
  known=[dict(title="Starting", what="A single click at the starter button is one of the most reported problems.", src="https://atvutv.neocities.org/suzuki-intruder-1400-problems")],
  forums=[]))

B18.append(dict(id="suzuki-gs450-1980", make="Suzuki", model="GS450", name="Suzuki GS450", years=[1980, 1988],
  match=["gs450", "gs 450", "gs450e", "gs450l", "gs450t", "gs450txz"], style="standard", drive="chain",
  engine="448 cc air-cooled DOHC parallel twin, two carbs",
  intro="A light, simple twin. Clean carbs, set valves and air leaks decide how it runs.",
  focus=[["448 cc twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Valves", "Check clearances"], ["Intake boots", "No air leaks"], ["Tank", "Check for rust"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"G": ["Clean carbs, set valves, no intake leaks, a clean tank and a working petcock all have to be right for it to run well."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Running basics", what="Clean carbs, adjusted valves, no intake air leaks, a clean tank and a working petcock are needed for these bikes to run properly.", src="https://www.thegsresources.com/_forum/forum/featured-forums/gs-owners/1701789-buying-a-650g")],
  forums=[GSR]))

B18.append(dict(id="suzuki-gs650-1981", make="Suzuki", model="GS650", name="Suzuki GS650", years=[1981, 1983],
  match=["gs650", "gs 650", "gs650g", "gs650e", "gs650gl"], style="standard", drive="shaft",
  engine="673 cc air-cooled DOHC inline four, four carbs (G models shaft drive, E models chain)",
  intro="A capable early-80s four. Most are shaft-drive G models. The basics of carbs, valves and air leaks matter most.",
  focus=[["673 cc four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shims on top"], ["Shaft drive", "Most G models"], ["Tank", "Check for rust"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"E": ["The G is shaft drive. The rarer E is chain drive and shares little else with the G."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="G vs E", what="The G is the common model. The chain-drive E is rare and quite different.", src="https://www.thegsresources.com/_forum/forum/technical-forums/projects-rebuilds/67234-83-gs650g-project-which-direction-to-go")],
  forums=[GSR]))

B18.append(dict(id="suzuki-t500-titan-1968", make="Suzuki", model="T500 Titan", name="Suzuki T500 Titan", years=[1968, 1975],
  match=["t500", "titan", "t 500", "gt500", "cobra 500"], style="standard", drive="chain",
  engine="492 cc air-cooled two-stroke twin, two carbs, oil injection",
  intro="Suzuki's big two-stroke twin. Crank seals and the gearbox oil level are the big worries.",
  focus=[["492 cc two-stroke twin", "Air-cooled"], ["Crank seals", "Leak test"], ["Gearbox", "Check 4th and 5th"], ["Oil pump", "Seals"], ["Two carbs", "Clean and sync"]],
  remove=CARB + AIR + ["H-003"], patch={},
  add=[step("X-T5-01", "H", "H-001", "Leak-down test the crankcase", "Seal the ports and pressure test at about 6-8 psi to check the crank seals.", "Old crank seals dry out and make it run lean.", "DoTheTon T500 thread", skill="Advanced", hours=2.0)],
  lessons={"H": ["Early T500s had too little gearbox oil. Suzuki's bulletin T-3 raised it from 1200cc to 1400cc. Use the higher level."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Gearbox oil", what="Suzuki raised the oil capacity from 1200cc to 1400cc to stop early 4th and 5th gear failures.", src="https://mail.oldjapanesebikes.com/1968_T500/page-2")],
  forums=[]))

for i, m, n, st, mt, y in [("harley-davidson-electra-glide-1999", "Electra Glide (Twin Cam)", "ELECTRA GLIDE", "touring", ["electra glide", "flht", "flhtc", "flhtcu", "ultra classic", "street glide", "flhx"], [1999, 2016]),
                           ("harley-davidson-road-king-1999", "Road King (Twin Cam)", "ROAD KING", "touring", ["road king", "flhr", "flhrc", "flhrs"], [1999, 2016]),
                           ("harley-davidson-fat-boy-2000", "Fat Boy (Twin Cam)", "FAT BOY", "cruiser", ["fat boy", "flstf", "flstfb", "fat boy lo"], [2000, 2017]),
                           ("harley-davidson-heritage-softail-2000", "Heritage Softail (Twin Cam)", "HERITAGE", "cruiser", ["heritage softail", "heritage classic", "flstc", "flst"], [2000, 2017])]:
    B18.append(dict(id=i, make="Harley-Davidson", model=m, name="Harley-Davidson "+m, years=y, match=mt, style=st, drive="belt",
      engine="Twin Cam 88, 96 or 103 V-twin, carb or fuel injected, belt drive",
      intro="A Twin Cam Harley. On 1999-2006 bikes, check the cam chain tensioner shoes before anything else.",
      focus=[["Twin Cam V-twin", "88, 96 or 103"], ["Carb or EFI", "Depends on year"], ["Cam tensioners", "1999-2006"], ["Belt drive", "Check for cracks"], ["Charging", "Stator and R/R"]],
      remove=AIR, patch={}, add=[TC_STEP], lessons=TC_LESSON,
      recalls=[], recallNote=VIN, known=[TC_KNOWN], forums=[FMH2]))

B18.append(dict(id="harley-davidson-street-750-2015", make="Harley-Davidson", model="Street 750", name="Harley-Davidson Street 750", years=[2015, 2020],
  match=["street 750", "xg750", "street rod", "xg750a", "street 500", "xg500"], style="cruiser", drive="belt",
  engine="749 cc liquid-cooled Revolution X V-twin, fuel injected, belt drive",
  intro="Harley's small liquid-cooled twin. Many were in a brake caliper corrosion recall.",
  focus=[["749 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Brake recall", "Calipers"], ["Belt drive", "Check tension"], ["Cooling", "Check coolant"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2016-2019 Street 500 and 750 bikes are in recall 18V927 because salt corrosion in the brake calipers can make the brakes drag.", reason="Dragging brakes can affect stability. Dealers fit new calipers free.")},
  add=[], lessons={},
  recalls=[dict(id="18V927", years="2016-2019", what="Brake caliper piston bore corrosion can make the brakes drag.", fix="Dealer fits new front and rear calipers free (Harley recall 0174).", src="https://vehiclesafetyrecalls.com/recall/18V927000")],
  known=[], forums=[]))

HERO_NAME_B18 = {"suzuki-s40-savage-1986": "SAVAGE", "suzuki-intruder-1400-1987": "INTRUDER", "suzuki-gs450-1980": "GS450", "suzuki-gs650-1981": "GS650",
  "suzuki-t500-titan-1968": "T500", "harley-davidson-electra-glide-1999": "ELECTRA GLIDE", "harley-davidson-road-king-1999": "ROAD KING",
  "harley-davidson-fat-boy-2000": "FAT BOY", "harley-davidson-heritage-softail-2000": "HERITAGE", "harley-davidson-street-750-2015": "STREET 750"}
