"""Batch 12 bike tunes (top 500, rows 111-120)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B12 = []
CBXC = dict(name="CBX Club", url="https://www.cbxclub.com/", what="Owner club and forum for the Honda CBX six.")
CTF = dict(name="Honda Trail CT forum", url="https://www.tapatalk.com/groups/hondatrailcts/", what="Owner forum for the CT90, CT110 and other Honda trail bikes.")
GWP = dict(name="Goldwingparts.com rider blog", url="https://www.goldwingparts.com/blogs/goldwing-rider-blog", what="Gold Wing repair notes by model.")
BELTS = step("X-GW-BELT", "H", "H-003", "Replace the timing belts", "If you can't prove the timing belts were changed in the last 10 years, replace them and the tensioners. Look at the water pump while the front cover is off.", "A snapped timing belt on these engines can bend valves.", "The GS Resources Gold Wing thread", skill="Advanced", hours=3.0)

B12.append(dict(id="honda-cb900f-1979", make="Honda", model="CB900F", name="Honda CB900F", years=[1979, 1983],
  match=["cb900f", "cb 900f", "cb900 super sport", "cb900c", "cb900"], style="standard", drive="chain",
  engine="902 cc air-cooled DOHC 16-valve inline four, four carbs",
  intro="Honda's early-80s 900 four. Cam chain tensioners and charging parts need attention on old ones.",
  focus=[["902 cc DOHC four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Cam chain tensioner", "Listen at cold start"], ["Charging", "Test the R/R"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={},
  add=[step("X-CB9-01", "H", "H-003", "Check the cam chain tensioner", "Listen for a rattle at cold start. Check the tensioner and guides for cracks.", "Worn tensioners and cracked guides let the cam chain slap.", "Honda V4 and inline-four tensioner notes", hours=1.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Cam chain tensioners", what="Honda fours of this era often have tired cam chain tensioners.", src="https://math.uwaterloo.ca/~rblander/V4_info.html")],
  forums=[]))

B12.append(dict(id="honda-cbx-1978", make="Honda", model="CBX", name="Honda CBX", years=[1978, 1982],
  match=["cbx", "cbx1000", "cbx 1000", "honda six"], style="standard", drive="chain",
  engine="1047 cc air-cooled DOHC 24-valve inline six, six carbs",
  intro="Honda's six-cylinder icon. Reliable if used. Six carbs are the big job on a bike that sat.",
  focus=[["1047 cc inline six", "Air-cooled"], ["Six carbs", "Clog when stored"], ["Starting", "Hard after storage"], ["Exhaust", "Costly to replace"], ["Cam chain", "Check tensioners"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"G": ["If the bike sits for weeks, modern fuel can clog all six carbs. Drain the carbs before storage."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Carbs after storage", what="Six Keihin carbs clog with modern fuel residue if the bike isn't run regularly.", src="https://www.real-classic.co.uk/?p=1107122")],
  forums=[CBXC]))

B12.append(dict(id="honda-super-cub-c90-1966", make="Honda", model="Super Cub C90", name="Honda Super Cub C90", years=[1966, 2003],
  match=["c90", "super cub 90", "cub 90", "c90 cub", "cm90", "cm91", "passport"], style="scooter", drive="chain",
  engine="89 cc air-cooled OHC single, one carb, semi-automatic gearbox",
  intro="The step-through Cub. Simple and tough. Rust, old wiring and a gummed carb are the usual jobs.",
  focus=[["89 cc single", "Air-cooled"], ["One carb", "Clean the tiny jets"], ["Rust", "Frame and fenders"], ["Wiring", "Old connectors"], ["Valve clearance", "Closes up"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"H": ["Check the valve clearances. On these small Hondas they tend to close up and the engine runs poorly."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Rust and electrics", what="Rust and old electrics are the usual trouble on aging C90s.", src="https://bigbikereviews.com/honda-c90/")],
  forums=[]))

B12.append(dict(id="honda-ct90-trail-1966", make="Honda", model="CT90 Trail", name="Honda CT90 Trail 90", years=[1966, 1979],
  match=["ct90", "trail 90", "ct 90", "ct200", "trail90"], style="scooter", drive="chain",
  engine="89 cc air-cooled OHC single, one carb, dual-range gearbox (most)",
  intro="Honda's step-through trail bike. Simple to bring back. Mind the cam timing on reassembly.",
  focus=[["89 cc single", "Air-cooled"], ["One carb", "Pilot jet clogs"], ["Cam timing", "Align the marks"], ["Rectifier", "Common upgrade"], ["Plug cap", "Check the lead"]],
  remove=CARB + AIR, patch={},
  add=[step("X-CT9-01", "H", "H-003", "Check cam timing marks on reassembly", "The cam can go in two ways. Line up the marks on the cam and sprocket before you button it up.", "A cam fitted 180 degrees out is a common reason a rebuilt CT90 won't start.", "CT90 restoration blog", hours=0.5)],
  lessons={"G": ["The pilot jet has a tiny hole that clogs with varnish. Make sure you can see light through it."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Won't start after rebuild", what="Installing the cam 180 degrees out is a common mistake.", src="https://ct90restoration.blogspot.com/2019/02/my-approach-to-getting-ct90-that-wont.html")],
  forums=[CTF]))

B12.append(dict(id="honda-monkey-125-2019", make="Honda", model="Monkey 125", name="Honda Monkey 125", years=[2019, 2026],
  match=["monkey", "monkey 125", "z125"], style="scooter", drive="chain",
  engine="124 cc air-cooled SOHC single, fuel injected",
  intro="Honda's modern mini bike. Very simple. Mostly routine service and a reflector recall on early bikes.",
  focus=[["124 cc single", "Air-cooled"], ["Fuel injected", "No carb"], ["Reflector recall", "2020-2021"], ["Chain drive", "Slack and lube"], ["Valve clearance", "Check on time"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Many 2020-2021 Monkeys were in recall 21V382 because the rear reflector may not be bright enough.", reason="A dim reflector makes the bike harder to see at night. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="21V382", years="2020-2021", what="Rear reflector lens may not be bright enough.", fix="Dealer replaces the reflector free.", src="https://vehiclesafetyrecalls.com/recall/21V382000")],
  known=[], forums=[]))

B12.append(dict(id="honda-ruckus-2003", make="Honda", model="Ruckus", name="Honda Ruckus", years=[2003, 2026],
  match=["ruckus", "zoomer", "nps50"], style="scooter", drive="belt",
  engine="49 cc liquid-cooled single, carb (to 2017) or fuel injection, CVT belt drive",
  intro="A cult 50 cc scooter. Starting problems usually trace to the battery, fuel filter or carb.",
  focus=[["49 cc single", "Liquid-cooled"], ["Carb or EFI", "Clean if stored"], ["Battery", "Starting trouble"], ["Drive belt", "Check width"], ["Final drive oil", "Check level"]],
  remove=[], patch={},
  add=[step("X-RUK-01", "G", "G-001", "Check the drive belt and final drive oil", "Measure the CVT belt width against spec and check the final drive oil level at the check bolt.", "A worn belt slips, and low final drive oil wears the gears.", "Maintenance Schedule Ruckus notes", hours=1.0)],
  lessons={"G": ["If it dies when cold or won't climb hills, clean the carb and replace the fuel filter first."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Starting", what="A weak battery is a frequent cause of no-start. Tight valves can also cause trouble.", src="https://cararac.com/blog/honda-ruckus-problems-and-ways-to-fix.html")],
  forums=[]))

B12.append(dict(id="honda-gold-wing-gl1500-1988", make="Honda", model="Gold Wing GL1500", name="Honda Gold Wing GL1500", years=[1988, 2000],
  match=["gl1500", "gold wing 1500", "goldwing 1500", "gl1500se", "gl1500a", "gl1500i", "aspencade 1500"], style="touring", drive="shaft",
  engine="1520 cc liquid-cooled flat six, two carbs, shaft drive",
  intro="The six-cylinder Wing. Very tough. Starter clutch and charging parts are the usual wear items.",
  focus=[["1520 cc flat six", "Liquid-cooled"], ["Two carbs", "Clean if stored"], ["Starter clutch", "Grinds or slips"], ["Charging", "Stator and R/R"], ["Shaft drive", "Final drive oil"]],
  remove=CARB, patch={},
  add=[step("X-GL15-01", "F", "F-004", "Check the starter clutch", "If the starter grinds or spins without engaging, the starter clutch is worn or sticky.", "The starter clutch is one of the most common GL1500 complaints.", "Engine Patrol Gold Wing notes", hours=1.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Starter clutch", what="The starter clutch can wear and cause grinding or slow engagement.", src="https://vincheck.info/report/honda/gl1500a/1988")],
  forums=[GWP]))

for i, m, n, y, cc, extra in [("honda-gold-wing-gl1100-1980", "Gold Wing GL1100", "Honda Gold Wing GL1100", [1980, 1983], "1085", ["gl1100", "gold wing 1100", "goldwing 1100", "gl1100i", "interstate 1100", "aspencade 1100"]),
                              ("honda-gold-wing-gl1200-1984", "Gold Wing GL1200", "Honda Gold Wing GL1200", [1984, 1987], "1182", ["gl1200", "gold wing 1200", "goldwing 1200", "gl1200a", "gl1200i", "aspencade"])]:
    B12.append(dict(id=i, make="Honda", model=m, name=n, years=y, match=extra, style="touring", drive="shaft",
      engine=cc + " cc liquid-cooled flat four, timing belts, shaft drive",
      intro="A flat-four Gold Wing. Timing belts and the stator, which sits behind the engine, are the big jobs.",
      focus=[["Flat four", "Liquid-cooled"], ["Timing belts", "Change by age"], ["Stator", "Engine must come out"], ["Pulse generator", "Cuts out hot"], ["Shaft drive", "Final drive oil"]],
      remove=CARB, patch={}, add=[BELTS],
      lessons={"F": ["The stator sits at the back of the engine and the engine has to come out to change it. Test charging before you decide."]},
      recalls=[], recallNote=OLD,
      known=[dict(title="Timing belts", what="Replace them every 10 years or 100,000 miles, even if they look fine.", src="https://www.thegsresources.com/_forum/forum/other-bikes/other-questions/86883-goldwing-what-are-the-usual-suspects-to-watch-out-for?p=1521205")],
      forums=[GWP]))

B12.append(dict(id="honda-cl450-scrambler-1968", make="Honda", model="CL450 Scrambler", name="Honda CL450 Scrambler", years=[1968, 1974],
  match=["cl450", "cl 450", "cl450 scrambler"], style="standard", drive="chain",
  engine="444 cc air-cooled DOHC parallel twin, torsion bar valve springs, two CV carbs",
  intro="The scrambler version of the CB450 'Black Bomber' twin. Shares most engine parts with the CB450.",
  focus=[["444 cc DOHC twin", "Torsion bar valves"], ["Two CV carbs", "Diaphragms age"], ["High pipes", "Rust and heat shields"], ["Charging", "Test the rectifier"], ["Points ignition", "Set the gap"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"G": ["Check the CV carb diaphragms for pinholes while the carbs are apart."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

HERO_NAME_B12 = {"honda-cb900f-1979": "CB900F", "honda-cbx-1978": "CBX", "honda-super-cub-c90-1966": "C90", "honda-ct90-trail-1966": "CT90",
  "honda-monkey-125-2019": "MONKEY", "honda-ruckus-2003": "RUCKUS", "honda-gold-wing-gl1500-1988": "GL1500", "honda-gold-wing-gl1100-1980": "GL1100",
  "honda-gold-wing-gl1200-1984": "GL1200", "honda-cl450-scrambler-1968": "CL450"}
