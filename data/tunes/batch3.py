"""Batch 3 bike tunes (top 100, rows 21-30)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B3 = []
VHT = dict(name="Vintage Honda Twins forum", url="https://www.vintagehondatwins.com/", what="Owner forum for Honda twins of the 60s and 70s.")
SOHC = dict(name="SOHC.co.uk forum", url="https://www.sohc.co.uk/", what="Owner forum for single-cam Honda fours.")

B3.append(dict(id="honda-cb360-1974", make="Honda", model="CB360", name="Honda CB360", years=[1974, 1976],
  match=["cb360", "cb 360", "cb360t", "cb360g", "cl360"], style="standard", drive="chain",
  engine="356 cc air-cooled SOHC parallel twin, two carbs, six-speed",
  intro="The CB350's replacement. A six-speed twin that's easy to live with once the top end and carbs are right.",
  focus=[["356 cc twin", "Air-cooled"], ["Two carbs", "Rebuild and sync"], ["Rocker shafts", "Early ones wear the cover"], ["Six-speed", "Clutch cable length"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={},
  add=[step("X-C36-01", "H", "H-003", "Check the rocker shafts and cam", "With the valve cover off, check that the rocker shafts can't turn in the cover and look for wear in their sockets and on the cam lobes. Later shafts screw in to stop this.", "Early CB360s used loose rocker shafts that could rotate and wear the cover.", "CB360 history notes", skill="Advanced", hours=1.5)],
  lessons={"H": ["A clutch cable outer that's a few mm too long makes the clutch fussy to adjust. Check it before you blame the clutch."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Loose rocker shafts", what="Early shafts could rotate and wear the head cover.", src="https://carolusmixedup.blogspot.com/2015/07/start-restore-my-cb-360.html"),
         dict(title="Long clutch cables", what="Many replacement cables are about 4 mm too long.", src="https://www.vintagehondatwins.com/forums/goto/post?id=202608")],
  forums=[VHT]))

B3.append(dict(id="honda-crf300l-2021", make="Honda", model="CRF300L", name="Honda CRF300L", years=[2021, 2026],
  match=["crf300l", "crf 300l", "crf300", "crf300la", "crf300l rally"], style="dualsport", drive="chain",
  engine="286 cc liquid-cooled single, fuel injected",
  intro="Honda's light dual-sport. Simple and tough, with a fuel system emissions recall worth checking.",
  focus=[["286 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "Fuel cap, reflector"], ["Off-road wear", "Bearings and chain"], ["Rally version", "Different fairing and tank"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls and ask a Honda dealer about the emissions recall on 2021-2025 CRF300Ls for the fuel system. Some 2021 bikes were also in reflector recall 21V382.", reason="Recall work is free. The emissions recall doesn't apply to the Rally model.")},
  add=[], lessons={"E": ["Trail use wears wheel, steering and swingarm bearings fast. Check them all for play."]},
  recalls=[dict(id="Emissions (L23)", years="2021-2025", what="Fuel system failed a fuel permeation test.", fix="Free dealer repair. Not on Rally models.", src="https://static.nhtsa.gov/odi/tsbs/2025/MC-11024257-0001.pdf"),
           dict(id="21V382", years="2021 (some)", what="Rear reflector may be too dim.", fix="Dealer replaces the reflector free.", src="https://www.rideapart.com/news/511787/recall-honda-rear-reflector-defect/")],
  known=[], forums=[]))

B3.append(dict(id="honda-cb175-cl175-1968", make="Honda", model="CB175", name="Honda CB175 / CL175", years=[1968, 1973],
  match=["cb175", "cl175", "cb 175", "cl 175", "cd175"], style="standard", drive="chain",
  engine="174 cc air-cooled SOHC parallel twin, two carbs",
  intro="A small Honda twin that's simple to learn on. The cam runs straight in the head, so oil care matters.",
  focus=[["174 cc twin", "Air-cooled"], ["Cam in the head", "No bearings, needs clean oil"], ["Two carbs", "Rebuild and sync"], ["Electrics", "Headlight shell wiring"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={},
  add=[step("X-C17-01", "H", "H-003", "Check the cam journals and head", "With the cam out, check the journals and the bearing surfaces in the head for scoring.", "The cams run directly in the head on these small twins, so neglected oil changes show up here.", "Classic Bike Guide expert view", skill="Advanced", hours=1.5)],
  lessons={"H": ["Change the oil often, around every 1,000 miles as Honda said. The cam has no separate bearings."], "F": ["Most lighting faults trace back to the connectors inside the headlight shell."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Cam and head wear", what="Cams run in the head and suffer from old oil.", src="https://www.pressreader.com/uk/classic-bike-guide/20221024/282342568751280")],
  forums=[VHT]))

B3.append(dict(id="honda-gold-wing-gl1800-2001", make="Honda", model="Gold Wing GL1800", name="Honda Gold Wing GL1800", years=[2001, 2017],
  match=["gold wing", "goldwing", "gl1800", "gl 1800", "gl1800 gold wing"], style="touring", drive="shaft",
  engine="1,832 cc liquid-cooled flat six, fuel injected, shaft drive",
  intro="Honda's big touring flat six. Long-lived, with several recalls to clear and linked brakes to service right.",
  focus=[["1,832 cc flat six", "Liquid-cooled"], ["Shaft drive", "Final drive oil"], ["Linked brakes", "Secondary master cylinder"], ["Recalls", "Brakes, airbag"], ["Bodywork", "Lots of panels to label"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Recall 11V567 covered rear brake drag on many 2001-2010 and 2012-2015 GL1800s. Airbag-equipped bikes from 2006-2016 had inflator recalls (16V347, 17V031, 18V045). Book any open recall with a Honda dealer.", reason="Brake drag can overheat the rear brake, and airbag inflators can fail dangerously. Both repairs are free.")},
  add=[], lessons={"K": ["The front and rear brakes are linked through a secondary master cylinder. Follow the manual's bleed order."]},
  recalls=[dict(id="11V567", years="2001-2010, 2012-2015", what="Rear brake may drag after release.", fix="Free dealer repair of the secondary master cylinder.", src="https://www.rideapart.com/news/253890/honda-recalls-certain-gl1800-models/"),
           dict(id="18V045", years="2009-2010, 2012-2016 (airbag)", what="Airbag inflator may explode.", fix="Dealer replaces the airbag module free.", src="https://vehiclesafetyrecalls.com/recall/18V045000")],
  known=[], forums=[]))

B3.append(dict(id="honda-cb200-1973", make="Honda", model="CB200", name="Honda CB200", years=[1973, 1976],
  match=["cb200", "cb 200", "cb200t", "cl200"], style="standard", drive="chain",
  engine="198 cc air-cooled SOHC parallel twin, two carbs",
  intro="The CB175's successor. Cheap and simple, but often worked on badly by past owners.",
  focus=[["198 cc twin", "Air-cooled"], ["Cam boxes", "Check the cam and bearings"], ["Two carbs", "Rebuild and sync"], ["Cam chain", "Worn tunnels"], ["Past owner work", "Check every fastener"]],
  remove=CARB + AIR, patch={},
  add=[step("X-C20-01", "H", "H-003", "Inspect the cam and cam chain", "Pull the points and tach boxes and check the cam ends for wear, then check the cam chain and tensioner for slack and the tunnel for rubbing marks.", "Chewed cams and worn cam chains are common on tired CB200s.", "RideApart Small Bike Rescue", skill="Advanced", hours=1.5)],
  lessons={"B": ["Expect to find missing washers, loose bolts and odd routing from past owners. Check everything as you go."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Worn cam", what="Cam ends and bearing surfaces get chewed up.", src="https://www.rideapart.com/news/269739/1974-honda-cb200-restoration-engine-trouble/")],
  forums=[VHT]))

B3.append(dict(id="honda-africa-twin-crf1100l-2020", make="Honda", model="Africa Twin", name="Honda Africa Twin CRF1100L", years=[2020, 2026],
  match=["africa twin", "crf1100l", "crf1100", "crf 1100", "africa twin adventure sports"], style="adventure", drive="chain",
  engine="1,084 cc liquid-cooled parallel twin, fuel injected, manual or DCT",
  intro="Honda's big adventure twin. Several recalls cover the switchgear, DCT software and Adventure Sports tank.",
  focus=[["1,084 cc twin", "Liquid-cooled"], ["Manual or DCT", "Check which you have"], ["Recalls", "Switch, ECU, tank"], ["Crash bars", "Check mounts after drops"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2020-2022 and 2024-2025 bikes are in recall 25V583 for the left handlebar switch. 2020-2021 DCT bikes had ECU recall 22V662, and 2020 Adventure Sports models had fuel tank recall 20V797.", reason="These can cost you the horn, the headlight switch or engine power. Repairs are free.")},
  add=[], lessons={"E": ["Check the frame and subframe around crash bar and rack mounts for cracks after any drop."]},
  recalls=[dict(id="25V583", years="2020-2022, 2024-2025", what="Left handlebar switch may lose horn and headlight beam control.", fix="Free dealer repair (Honda KS8).", src="https://www.advpulse.com/?p=122431"),
           dict(id="22V662", years="2020-2021 DCT", what="ECU software can stall the engine or cut drive.", fix="Free ECU update.", src="https://vehiclesafetyrecalls.com/recall/22V662000"),
           dict(id="20V797", years="2020 Adventure Sports", what="Fuel filter may clog from tank weld debris.", fix="Free dealer repair (Honda KL4).", src="https://vehiclesafetyrecalls.com/recall/20V797000")],
  known=[], forums=[]))

B3.append(dict(id="honda-cx500-1978", make="Honda", model="CX500", name="Honda CX500", years=[1978, 1983],
  match=["cx500", "cx 500", "gl500", "cx500c", "cx500 custom", "cx650"], style="standard", drive="shaft",
  engine="497 cc liquid-cooled V-twin, pushrod, shaft drive",
  intro="Honda's water-cooled V-twin. Very durable once the cam chain, water pump seal and stator are sorted.",
  focus=[["497 cc V-twin", "Liquid-cooled"], ["Cam chain", "The main worry"], ["Water pump seal", "Engine-out job"], ["Shaft drive", "Final drive oil"], ["Stator", "Fails at high miles"]],
  remove=[],
  patch={"A-002": dict(title="Check the cam chain recall marks", instructions="Look beside the engine number on the lower left crankcase for three punch marks. They show the early cam chain tensioner recall was done. 1978 engines up to CX500E-2034366 were covered.", reason="The early tensioner could break and lock the engine.")},
  add=[step("X-CX5-01", "B", "B-004", "Listen for cam chain rattle", "Start it cold. A rattle that goes away above about 3,000 rpm usually means a worn cam chain. On manual-tensioner bikes, check how much adjustment is left.", "Not replacing a slapping cam chain is the main cause of CX engine failure.", "CX500 FAQ (motofaction.org)", hours=0.5),
       step("X-CX5-02", "H", "H-004", "Check for water pump seal weep", "Look under the water pump cover for coolant weeping. Use silicate-free coolant and distilled water.", "A failed mechanical seal is an engine-out repair.", "CX500 buying tips (motofaction.org)", hours=0.3)],
  lessons={"H": ["Cam chain, water pump seal and stator tend to go around 40,000 miles. Owners often do all three in one engine-out job."]},
  recalls=[], recallNote="The 1978 cam chain tensioner recall is long closed. Check for the punch marks instead.",
  known=[dict(title="Cam chain and tensioner", what="Needs attention to avoid major engine damage.", src="https://rob.motofaction.org/faq/index.html"),
         dict(title="Water pump seal", what="Common failure that needs the engine out.", src="https://canadamotoguide.com/1998/04/30/sonics-workshop-honda-cx500-autopsy")],
  forums=[dict(name="CX500 Forum", url="https://www.cx500forum.com/", what="Owner forum for CX and GL 500/650.")]))

B3.append(dict(id="honda-shadow-750-2004", make="Honda", model="Shadow 750", name="Honda Shadow 750", years=[2004, 2016],
  match=["shadow 750", "shadow", "vt750", "vt750c", "shadow aero", "shadow phantom", "shadow spirit"], style="cruiser", drive="shaft",
  engine="745 cc liquid-cooled V-twin, carbs to 2009, fuel injected from 2010",
  intro="Honda's middleweight cruiser. Carbs on early bikes, fuel injection later, and a bank angle sensor recall.",
  focus=[["745 cc V-twin", "Liquid-cooled"], ["Carb or EFI", "Check your year"], ["Shaft drive", "Final drive oil"], ["Bank angle sensor", "Recall on 2010-2016"], ["Chrome", "Pitting and rust"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2010-2016 VT750s are in recall 15V874 for the bank angle sensor wire.", reason="If the sensor signal drops, the engine can stall while riding. The repair is free."),
         "G-001": dict(title="Find out which fuel system it has", instructions="2004-2009 Shadow 750s use a carburetor. 2010 and later are fuel injected. Do the carb steps or the fuel injection check to match.", reason="The fuel steps are different for each.")},
  add=[], lessons={},
  recalls=[dict(id="15V874", years="2010-2016", what="Bank angle sensor wire can rub through and stall the engine.", fix="Dealer relocates the connector and replaces the sensor free.", src="https://incompliancemag.com/honda-recalls-vt750-motorcycles-for-electrical-system-defect/")],
  known=[], forums=[]))

B3.append(dict(id="honda-cb650-1979", make="Honda", model="CB650", name="Honda CB650", years=[1979, 1982],
  match=["cb650", "cb 650", "cb650c", "cb650 custom"], style="standard", drive="chain",
  engine="627 cc air-cooled SOHC inline four, four carbs",
  intro="The last of Honda's single-cam fours. A good runner once the carbs and charging system are sorted.",
  focus=[["SOHC inline four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Charging", "Test before buying parts"], ["Cam chain", "Listen cold"], ["Drive", "Chain on most, check yours"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": ["Rebuild and sync the four carbs as one set. Mixing jets between carbs is the usual cause of uneven running."]},
  recalls=[], recallNote=OLD, known=[], forums=[SOHC]))

B3.append(dict(id="honda-nc750x-2014", make="Honda", model="NC750X", name="Honda NC750X", years=[2014, 2026],
  match=["nc750x", "nc 750x", "nc750", "nc750xd", "nc700x"], style="adventure", drive="chain",
  engine="745 cc liquid-cooled parallel twin, fuel injected, manual or DCT",
  intro="Honda's practical crossover, with storage where the tank usually is. Some have the DCT gearbox.",
  focus=[["745 cc twin", "Liquid-cooled"], ["Manual or DCT", "Check which you have"], ["Frunk", "Fuel filler under the seat"], ["Recalls", "DCT fuel, front tire"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2021 NC750X DCT bikes were in recall 21V901 for fuel injection programming, and some 2024 bikes are in recall 25V435 for the front tire.", reason="Both can cause a crash. Repairs are free.")},
  add=[], lessons={},
  recalls=[dict(id="21V901", years="2021 DCT", what="Fuel injection programming can starve the engine and stall it.", fix="Free ECU update (Honda KN0).", src="https://www.rideapart.com/news/550782/honda-nc750x-dct-2021-recall/"),
           dict(id="25V435", years="2024 (some)", what="Front tire inner structure may loosen and unravel.", fix="Dealer replaces the tire free.", src="https://itsrecalled.pages.dev/recall/honda-american-honda-motor-co-recalls-2024-honda-nc750x-25v435000/")],
  known=[], forums=[]))

HERO_NAME_B3 = {"honda-cb360-1974": "CB360", "honda-crf300l-2021": "CRF300L", "honda-cb175-cl175-1968": "CB175", "honda-gold-wing-gl1800-2001": "GOLD WING",
  "honda-cb200-1973": "CB200", "honda-africa-twin-crf1100l-2020": "AFRICA TWIN", "honda-cx500-1978": "CX500", "honda-shadow-750-2004": "SHADOW",
  "honda-cb650-1979": "CB650", "honda-nc750x-2014": "NC750X"}
