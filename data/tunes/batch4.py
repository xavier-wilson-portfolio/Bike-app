"""Batch 4 bike tunes (top 100, rows 32-40; row 31 CB750 DOHC waits for a photo and research)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B4 = []
KZR = dict(name="KZRider forum", url="https://www.kzrider.com/", what="Owner forum for classic Kawasaki fours.")
NGW = dict(name="NGW Club forum", url="https://www.ngwclub.com/", what="Owner forum for early Gold Wings.")

B4.append(dict(id="kawasaki-ninja-500-2024", make="Kawasaki", model="Ninja 500", name="Kawasaki Ninja 500", years=[2024, 2026],
  match=["ninja 500", "ninja500", "ex500", "z500"], style="sport", drive="chain",
  engine="451 cc liquid-cooled parallel twin, fuel injected",
  intro="Kawasaki's newest small Ninja. Early 2024 bikes have a clutch recall to clear first.",
  focus=[["451 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Clutch recall", "Early 2024 bikes"], ["Fairing", "Clips and screws to label"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2024 Ninja 500s built in early 2024 are in recall 25V146 for the clutch release shaft.", reason="A broken clutch release can leave the bike unable to disengage the clutch. The repair is free.")},
  add=[], lessons={}, recalls=[dict(id="25V146", years="2024 (some)", what="Clutch release shaft weld can fail and break the clutch lever action.", fix="Dealer replaces the clutch release shaft free (Kawasaki MC25-04).", src="https://www.rideapart.com/news/754042/kawasaki-ninja500-z500-clutch-recall/")],
  known=[], forums=[]))

B4.append(dict(id="honda-gl1000-gold-wing-1975", make="Honda", model="GL1000", name="Honda GL1000 Gold Wing", years=[1975, 1979],
  match=["gl1000", "gl 1000", "gold wing 1000", "goldwing 1000"], style="standard", drive="shaft",
  engine="999 cc liquid-cooled flat four, belt-driven cams, four carbs, shaft drive",
  intro="The original Gold Wing. Tough engine, but the cam timing belts must be changed by age, not looks.",
  focus=[["999 cc flat four", "Liquid-cooled"], ["Timing belts", "Change by age"], ["Four carbs", "Rebuild as a set"], ["Shaft drive", "Final drive oil"], ["Exhaust", "Mufflers rust out"]],
  remove=CARB,
  patch={},
  add=[step("X-GL1-01", "H", "H-003", "Replace the timing belts", "Replace both cam timing belts unless there's proof they were done recently. Set the crank to TDC first and follow the manual for the cam marks. Think about doing the water pump and thermostat while the front is open.", "Belts can look fine and still fail from age, and a snapped belt can do serious engine damage.", "Goldwingparts.com GL1000/GL1100 buyer's guide", skill="Advanced", hours=3.0)],
  lessons={"G": ["The four carbs are a common headache. Rebuild them as a matched set with updated seals and floats."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Old timing belts", what="Belts fail from age even with low miles.", src="https://www.goldwingparts.com/blogs/goldwing-rider-blog/gl1000-gl1100-buyers-guide"),
         dict(title="Rusted exhaust", what="Mufflers and sometimes headers rust through.", src="https://ngwclub.com/forum/viewtopic.php?p=817129")],
  forums=[NGW]))

B4.append(dict(id="kawasaki-ninja-650-2017", make="Kawasaki", model="Ninja 650", name="Kawasaki Ninja 650", years=[2017, 2026],
  match=["ninja 650", "ninja650", "ex650", "er6f"], style="sport", drive="chain",
  engine="649 cc liquid-cooled parallel twin, fuel injected",
  intro="Kawasaki's middleweight sport twin. Simple and durable, so service history matters most.",
  focus=[["649 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fairing", "Clips and screws to label"], ["Chain drive", "Slack and lube"], ["Shared engine", "Same as Z650 and Vulcan S"]],
  remove=EFI, patch={}, add=[], lessons={}, recalls=[], recallNote=VIN, known=[], forums=[]))

B4.append(dict(id="honda-cb750-nighthawk-1991", make="Honda", model="CB750 Nighthawk", name="Honda CB750 Nighthawk", years=[1991, 2003],
  match=["nighthawk 750", "cb750 nighthawk", "cb750", "rc39"], style="standard", drive="chain",
  engine="747 cc air-cooled DOHC inline four, four carbs",
  intro="A plain, long-lived Honda four. Many sat for years, so carbs and charging are the usual jobs.",
  focus=[["DOHC inline four", "Air-cooled"], ["Four carbs", "Gum up when stored"], ["Charging", "Regulator/rectifier"], ["Parts", "Interchange 1991-2003"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"G": ["A lot of Nighthawks sat in garages for years. Plan on a full carb clean and sync."], "A": ["Almost every part interchanges across 1991-2003, which makes used parts easy to find."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Stored bikes", what="Many sat for years before resale.", src="https://motorcyclistonline.com/how-to/1991-2003-honda-nighthawk-750-smart-money")],
  forums=[]))

B4.append(dict(id="kawasaki-z650-2017", make="Kawasaki", model="Z650", name="Kawasaki Z650", years=[2017, 2026],
  match=["z650", "z 650", "er650"], style="standard", drive="chain",
  engine="649 cc liquid-cooled parallel twin, fuel injected",
  intro="The naked version of the Ninja 650. Easy to work on with the bodywork mostly out of the way.",
  focus=[["649 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Naked bike", "Little bodywork"], ["Chain drive", "Slack and lube"], ["Shared engine", "Same as Ninja 650"]],
  remove=EFI, patch={}, add=[], lessons={}, recalls=[], recallNote=VIN, known=[], forums=[]))

B4.append(dict(id="honda-ct70-1969", make="Honda", model="CT70", name="Honda CT70 Trail 70", years=[1969, 1994],
  match=["ct70", "ct 70", "trail 70", "trail70", "ct70h"], style="standard", drive="chain",
  engine="72 cc air-cooled single, one carb",
  intro="The Trail 70. A tiny single that's simple to rebuild. Fuel lines, gaskets and the carb cause most trouble.",
  focus=[["72 cc single", "Air-cooled"], ["One carb", "Clean or replace"], ["Fuel lines", "Leak with age"], ["Top end", "Gasket leaks"], ["Folding bars", "Check the clamps"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"G": ["Replace old fuel lines and gaskets. A gas smell usually means one of them is leaking."], "H": ["A little tapping from the top end is normal. These have mechanical valve lifters."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Fuel leaks", what="Worn fuel lines and gaskets.", src="https://www.motosport.com/blog/common-issues-on-the-1993-honda-ct70-dirt-bike")],
  forums=[]))

B4.append(dict(id="kawasaki-z900-2017", make="Kawasaki", model="Z900", name="Kawasaki Z900", years=[2017, 2026],
  match=["z900", "z 900", "z900 abs"], style="standard", drive="chain",
  engine="948 cc liquid-cooled inline four, fuel injected",
  intro="Kawasaki's big naked four. Early bikes had recalls for the rear shock mount, brake routing and ABS.",
  focus=[["948 cc inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "Shock mount, brakes, ABS"], ["Chain drive", "Slack and lube"], ["Naked bike", "Little bodywork"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2017-2018 Z900s had rear shock recall 17V703, some 2018 bikes had brake hose routing recall 18V866, and 2019 ABS bikes had ABS unit recall 19V083.", reason="Each one affects braking or the rear suspension. Repairs are free.")},
  add=[], lessons={},
  recalls=[dict(id="17V703", years="2017-2018", what="Rear shock frame mount holes can elongate.", fix="Free dealer repair (Kawasaki MC17-04).", src="https://www.motorcyclistonline.com/kawasaki-recalls-late-model-z900-motorcycle-for-possible-rear-suspension-defect/"),
           dict(id="18V866", years="2018 (some)", what="Rear brake hose and sensor wire may touch the tire.", fix="Free inspection and rerouting (Kawasaki MC18-06).", src="https://www.vehiclesafetyrecalls.com/recall/18V866000"),
           dict(id="19V083", years="2019 ABS", what="ABS unit debris may lock a wheel.", fix="Dealer inspects and replaces the ABS unit free (MC19-01).", src="https://vehiclesafetyrecalls.com/recall/19V083000")],
  known=[], forums=[]))

B4.append(dict(id="kawasaki-z1-1973", make="Kawasaki", model="Z1", name="Kawasaki Z1 / KZ900", years=[1973, 1976],
  match=["z1", "z1 900", "z900 1973", "z1a", "z1b"], style="standard", drive="chain",
  engine="903 cc air-cooled DOHC inline four, four carbs",
  intro="Kawasaki's first big four and a valuable classic. Matching numbers and correct parts matter here.",
  focus=[["903 cc DOHC four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Cam chain", "Listen cold"], ["Numbers", "Frame and engine should match"], ["Tank", "Clean inside before the carbs"]],
  remove=CARB + AIR,
  patch={"A-001": dict(title="Identify your bike exactly", instructions="Record the frame and engine numbers and check that they match the model and year. Watch for reproduction parts sold as original.", reason="A Z1's value depends heavily on matching numbers and original parts.")},
  add=[step("X-Z1-01", "B", "B-004", "Listen for cam chain noise", "Start it cold and listen at the top of the engine. A rattle at idle points at a worn cam chain tensioner.", "Tensioner wear is a known Z1 issue.", "motoryk.com Z1 900 problems", hours=0.3)],
  lessons={"G": ["Get the tank completely clean inside before you fit rebuilt carbs, or rust will clog them again."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Cam chain tensioner wear", what="Rattles at idle when cold.", src="https://motoryk.com/bikes/kawasaki/z1-900/problems"),
         dict(title="Previous owners", what="Owners on KZRider say past owner work is the biggest problem.", src="https://kzrider.com/11-projects/617418-common-problems-among-the-z1-kz-line")],
  forums=[KZR]))

B4.append(dict(id="kawasaki-vulcan-s-2015", make="Kawasaki", model="Vulcan S", name="Kawasaki Vulcan S", years=[2015, 2026],
  match=["vulcan s", "vulcan-s", "en650", "vulcan 650"], style="cruiser", drive="chain",
  engine="649 cc liquid-cooled parallel twin, fuel injected",
  intro="A cruiser built on the Ninja 650 engine. Simple service with a low seat to work around.",
  focus=[["649 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Chain drive", "Slack and lube"], ["Low seat", "Easy to work around"], ["Shared engine", "Same as Ninja 650"]],
  remove=EFI, patch={}, add=[], lessons={}, recalls=[], recallNote=VIN, known=[], forums=[]))

HERO_NAME_B4 = {"kawasaki-ninja-500-2024": "NINJA 500", "honda-gl1000-gold-wing-1975": "GL1000", "kawasaki-ninja-650-2017": "NINJA 650",
  "honda-cb750-nighthawk-1991": "NIGHTHAWK", "kawasaki-z650-2017": "Z650", "honda-ct70-1969": "CT70", "kawasaki-z900-2017": "Z900",
  "kawasaki-z1-1973": "Z1", "kawasaki-vulcan-s-2015": "VULCAN S"}
