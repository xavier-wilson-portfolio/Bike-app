"""Batch 2 bike tunes (top 100, rows 12-20). Same format as make_tunes.py."""
def step(id, phase, after, title, instructions, reason, src, safety="Normal", skill="Intermediate", hours=1.0, tools=""):
    return dict(id=id, phase=phase, after=after, title=title, instructions=instructions, reason=reason, src=src, safety=safety, skill=skill, estHours=hours, tools=tools)
CARB = ["G-005"]; EFI = ["G-004"]; AIR = ["H-004"]
OLD = "Any recalls on bikes this old were closed long ago."
VIN = "No recalls found for these years when this course was written. Run your VIN at nhtsa.gov/recalls to be sure."
REBEL_HB = dict(id="26V500", years="2017-2023, 2025-2026", what="Handlebar lock screw can loosen and fall between the frame and steering stem.", fix="Free repair at a Honda dealer (Honda code KUO).", src="https://www.motorcycle.com/bikes/news/honda-recalls-rebel-300-rebel-500-and-scl500-for-loose-screws-44669233")
B2 = []

B2.append(dict(id="honda-rebel-300-2017", make="Honda", model="Rebel 300", name="Honda Rebel 300", years=[2017, 2026],
  match=["rebel 300", "rebel300", "cmx300", "cmx 300"], style="cruiser", drive="chain",
  engine="286 cc liquid-cooled single, fuel injected",
  intro="Honda's small Rebel. A simple single that new riders keep for years, so recalls and basic service matter most.",
  focus=[["286 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Chain drive", "Slack and lube"], ["Open recalls", "Handlebar lock screw"], ["Low seat", "Easy to work around"]],
  remove=EFI, patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Rebel 300s from 2017-2023 and 2025-2026 are in recall 26V500 for the handlebar lock screw, and some 2020-2021 bikes had a rear reflector recall (21V382). Book any open recall with a Honda dealer.", reason="Recall work is free, and the handlebar screw can interfere with steering.")},
  add=[], lessons={"A": ["2017-2018 bikes also had an EVAP canister hose service campaign (Honda KJ3). Ask the dealer whether yours was done."]},
  recalls=[REBEL_HB, dict(id="21V382", years="2020-2021", what="Rear reflector may be too dim.", fix="Dealer replaces the reflector free.", src="https://www.rideapart.com/news/511787/recall-honda-rear-reflector-defect/")],
  known=[dict(title="EVAP canister hose", what="2017-2018 service campaign for a hose that lets fuel vapor through.", src="https://static.nhtsa.gov/odi/tsbs/2018/MC-10143374-9999.pdf")], forums=[]))

B2.append(dict(id="honda-cb550-four-1974", make="Honda", model="CB550", name="Honda CB550 Four", years=[1974, 1978],
  match=["cb550", "cb 550", "cb550k", "cb550f", "cb550 four", "cb550 super sport"], style="standard", drive="chain",
  engine="544 cc air-cooled SOHC inline four, four carbs",
  intro="The middle of Honda's SOHC four family, between the CB500 and CB750. Tough engine; neglect is its main enemy.",
  focus=[["SOHC inline four", "Air-cooled"], ["Four Keihin carbs", "Rebuild and sync as a set"], ["Cam chain", "Stretches on high miles"], ["Tank and frame rust", "Check inside and at the pivot"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR,
  patch={"A-003": dict(title="Get the service manual", instructions="Get the Honda factory service manual for your year, or the Haynes manual that covers the CB400F and CB550 fours.", reason="Every torque value, clearance and capacity in this course comes from the manual."),
         "G-004": dict(title="Rebuild the four carbs as a set", instructions="Take the carb bank off as one unit. Strip one carb at a time and keep each one's parts in its own tray. Clean every jet and passage, fit new gaskets and o-rings, set the float heights, refit, then sync all four.", reason="Dried gaskets, varnished jets and stuck float needles are the usual trouble after storage.")},
  add=[step("X-CB5-01", "B", "B-004", "Listen for cam chain noise", "Start it cold and listen at the top of the engine. A rattle that won't settle points at a stretched cam chain or tired tensioner.", "A stretched cam chain is common on high-mileage engines and can damage the top end if left.", "motoryk.com 1977 CB550 buyer's guide", hours=0.3),
       step("X-CB5-02", "E", "E-002", "Check the frame at the swingarm pivot", "Clean and inspect the lower frame rails and the area around the swingarm pivot for rust.", "That's where frame rust usually starts on these bikes.", "motoryk.com CB550K guide", hours=0.5)],
  lessons={"G": ["Look inside the tank with a light. Internal rust needs a liner kit or a new tank before it clogs the rebuilt carbs."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Gummed carbs", what="Dried gaskets, varnished jets and stuck floats after storage.", src="https://motoryk.com/blog/honda-cb550-four-super-sport-cb550k-common-problems"),
         dict(title="Stretched cam chain", what="Common on high-mileage engines.", src="https://motoryk.com/blog/1977-honda-cb550-buyer-s-guide-what-to-inspect-before-you-buy"),
         dict(title="Frame rust", what="Lower rails and swingarm pivot.", src="https://motoryk.com/blog/honda-cb550-four-super-sport-cb550k-common-problems")],
  forums=[dict(name="SOHC.co.uk forum", url="https://www.sohc.co.uk/", what="Owner forum for single-cam Honda fours.")]))

B2.append(dict(id="honda-rebel-1100-2021", make="Honda", model="Rebel 1100", name="Honda Rebel 1100", years=[2021, 2026],
  match=["rebel 1100", "rebel1100", "cmx1100", "cmx 1100", "rebel 1100 dct"], style="cruiser", drive="chain",
  engine="1,084 cc liquid-cooled parallel twin, fuel injected, manual or DCT",
  intro="The big Rebel, with the Africa Twin's twin engine. Some have Honda's DCT automatic gearbox.",
  focus=[["1,084 cc twin", "Liquid-cooled"], ["Manual or DCT", "Check which you have"], ["Fuel injected", "No carbs"], ["Chain drive", "Slack and lube"], ["Recalls", "Radiator cap, oil leak"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Every 2021 Rebel 1100 was in recall 21V987 for the radiator cap, and some 2024-2025 bikes are in recall 25V358 for an engine oil leak. Book any open recall with a Honda dealer.", reason="Both repairs are free. A bad radiator cap can spray hot coolant.")},
  add=[], lessons={"A": ["Note whether yours is a manual or a DCT. Clutch and gearbox service is different for each."]},
  recalls=[dict(id="21V987", years="2021", what="Radiator cap may not seal and can leak or spray hot coolant.", fix="Dealer replaces the cap and refills coolant free (Honda KN1).", src="https://vehiclesafetyrecalls.com/recall/21V987000"),
           dict(id="25V358", years="2024-2025 (some)", what="Possible engine oil leak.", fix="Free dealer repair (Honda KS2).", src="https://www.advpulse.com/?p=120690")],
  known=[], forums=[]))

B2.append(dict(id="honda-cb500-four-1971", make="Honda", model="CB500", name="Honda CB500 Four", years=[1971, 1973],
  match=["cb500", "cb 500", "cb500 four", "cb500k", "cb500k0", "cb500k1", "cb500k2"], style="standard", drive="chain",
  engine="498 cc air-cooled SOHC inline four, four carbs",
  intro="Honda's first middleweight four. Smooth and well built, with a few electrical weak spots to sort.",
  focus=[["SOHC inline four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Fuse box", "Known weak spot"], ["Charging", "Stator is costly"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={},
  add=[step("X-CB4-01", "F", "F-003", "Replace the fuse box if it's tired", "Check the original fuse box for heat damage, melted plastic and loose clips. Replace it if there's any doubt.", "The fuse box is a common failure point on these bikes, and it's easy to replace.", "classicmotorsports.com forum", hours=0.7)],
  lessons={"F": ["Test the charging system before buying parts. Stators can be expensive, so confirm it's the stator first."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Fuse box meltdown", what="The original fuse box can overheat and fail.", src="https://classicmotorsports.com/forum/sprockets/looking-at-a-non-running-cb500-four-learn-me-please/82307/page1")],
  forums=[dict(name="SOHC.co.uk forum", url="https://www.sohc.co.uk/", what="Owner forum for single-cam Honda fours.")]))

B2.append(dict(id="honda-grom-2022", make="Honda", model="Grom", name="Honda Grom", years=[2022, 2026],
  match=["grom", "msx125", "msx 125"], style="standard", drive="chain",
  engine="124 cc air-cooled single, fuel injected, five-speed",
  intro="Honda's mini bike, with a huge mod scene. Most Groms have been changed somewhere, so note what's stock.",
  focus=[["124 cc single", "Air-cooled"], ["Fuel injected", "No carbs"], ["Five-speed", "Since 2022"], ["Mod scene", "Note what isn't stock"], ["Chain drive", "Slack and lube"]],
  remove=EFI + AIR, patch={}, add=[], lessons={"B": ["Most Groms have aftermarket parts. List every non-stock part in the Mods section before you start."]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B2.append(dict(id="honda-cb400f-super-sport-1975", make="Honda", model="CB400F", name="Honda CB400F Super Sport", years=[1975, 1977],
  match=["cb400f", "cb 400 f", "cb400 four", "400 four", "cb400f super sport"], style="cafe", drive="chain",
  engine="408 cc air-cooled SOHC inline four, four 20 mm carbs, six-speed",
  intro="The 400 Four, with its four-into-one exhaust. A small, complex four that rewards careful work.",
  focus=[["408 cc SOHC four", "Air-cooled"], ["Four 20 mm carbs", "Small and fussy"], ["Six-speed", "Clutch shaft splines"], ["4-into-1 exhaust", "Hard to replace"], ["Oil pressure switch", "Common fault"]],
  remove=CARB + AIR,
  patch={"A-003": dict(title="Get the service manual", instructions="Get the Honda factory service manual, or the Haynes manual that covers the CB400F and CB550 fours.", reason="Every torque value, clearance and capacity in this course comes from the manual.")},
  add=[step("X-C4F-01", "F", "F-005", "Test the oil pressure switch", "With the ignition on and the engine off, the oil light should come on. Start it and it should go out. Check for oil seeping from the switch.", "The oil pressure switch is a common fault on these bikes.", "RealClassic CB400F", hours=0.3),
       step("X-C4F-02", "H", "H-005", "Check the clutch shaft splines", "With the clutch cover off, check the clutch shaft splines for wear and notching.", "Worn splines eventually stop the clutch from releasing properly.", "sohc.co.uk forum", hours=0.5)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Oil pressure switch", what="A common fault on the 400 Four.", src="https://www.real-classic.co.uk/?p=1107118"),
         dict(title="Clutch shaft splines", what="Wear over time until the clutch drags.", src="https://www.sohc.co.uk/index.php/topic,28427.0.html")],
  forums=[dict(name="SOHC.co.uk forum", url="https://www.sohc.co.uk/", what="Has a CB350/400 Four section.")]))

B2.append(dict(id="honda-cbr600rr-2007", make="Honda", model="CBR600RR", name="Honda CBR600RR", years=[2007, 2012],
  match=["cbr600rr", "cbr 600 rr", "cbr600", "pc40", "600rr"], style="sport", drive="chain",
  engine="599 cc liquid-cooled inline four, fuel injected",
  intro="Honda's 600 supersport. The charging system and a fuel pump recall are the big things to check.",
  focus=[["599 cc inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Regulator/rectifier", "Runs hot"], ["Fuel pump recall", "24V864"], ["Fairing", "Clips and screws to label"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Certain 2007 and 2009-2012 CBR600RRs are in recall 24V864 for a fuel pump impeller that can deform. Book any open recall with a Honda dealer.", reason="A failing fuel pump can stall the bike. The repair is free."),
         "F-002": dict(title="Test the charging system", instructions="With a charged battery, measure voltage at the battery at idle and at higher rpm. If it's low or high, test the regulator/rectifier and the stator.", reason="The regulator/rectifier on these bikes can overheat and fail, leaving a dead battery.")},
  add=[], lessons={},
  recalls=[dict(id="24V864", years="2007, 2009-2012 (some)", what="Fuel pump impeller can deform, causing a no-start or stall.", fix="Free dealer repair (Honda KR2-KR5).", src="https://au7o.io/motorcycle-issues/honda-cbr600rr?year=2012")],
  known=[dict(title="Regulator/rectifier", what="Can overheat and burn out, killing the battery.", src="https://enginepatrol.com/honda-cbr600rr-common-problems/")],
  forums=[]))

B2.append(dict(id="honda-cb450-1965", make="Honda", model="CB450", name="Honda CB450", years=[1965, 1974],
  match=["cb450", "cb 450", "black bomber", "cb450k"], style="standard", drive="chain",
  engine="444 cc air-cooled DOHC parallel twin, torsion bar valve springs, CV carbs",
  intro="The Black Bomber. Honda's first big twin, with torsion bars in place of coil valve springs.",
  focus=[["DOHC parallel twin", "Air-cooled"], ["Torsion bar valves", "No coil springs"], ["CV carbs", "Clean and sync"], ["Long-stored bikes", "Check bar tension"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={},
  add=[step("X-CB45-01", "H", "H-003", "Check the torsion bar tension", "With the cam covers off, check each valve's torsion bar for equal tension when you remove and refit it. Replace any that are weak.", "A torsion bar can lose strength if the engine sat for years with that valve held open.", "vintagehondatwins.com forum", skill="Advanced", hours=2.0)],
  lessons={"H": ["Keep each torsion bar, follower and cam part with its own valve. Mixed-up valve gear is a common cause of bad Black Bomber engines."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Tired torsion bars", what="Bars can weaken on engines that sat with a valve open.", src="https://www.vintagehondatwins.com/forums/goto/post?id=54856"),
         dict(title="Mixed-up valve gear", what="Swapped parts between valves cause problems.", src="https://yewemmgee.blogspot.com/2010/12/honda-cb450-black-bomber.html")],
  forums=[dict(name="Vintage Honda Twins forum", url="https://www.vintagehondatwins.com/", what="Owner forum for CB/CL 350 and 450 twins.")]))

B2.append(dict(id="honda-cbr500r-2013", make="Honda", model="CBR500R", name="Honda CBR500R", years=[2013, 2018],
  match=["cbr500r", "cbr 500 r", "cbr500"], style="sport", drive="chain",
  engine="471 cc liquid-cooled parallel twin, fuel injected",
  intro="Honda's 500 sport twin, shares its engine with the Rebel 500. Simple and long-lived.",
  focus=[["471 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fairing", "Clips and screws to label"], ["Chain drive", "Slack and lube"], ["Shared engine", "Same family as Rebel 500"]],
  remove=EFI, patch={}, add=[], lessons={}, recalls=[], recallNote=VIN, known=[], forums=[]))

HERO_NAME_B2 = {"honda-rebel-300-2017": "REBEL 300", "honda-cb550-four-1974": "CB550", "honda-rebel-1100-2021": "REBEL 1100", "honda-cb500-four-1971": "CB500",
  "honda-grom-2022": "GROM", "honda-cb400f-super-sport-1975": "CB400F", "honda-cbr600rr-2007": "CBR600RR", "honda-cb450-1965": "CB450", "honda-cbr500r-2013": "CBR500R"}
