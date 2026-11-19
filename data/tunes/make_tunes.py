"""Batch 1 bike tunes. Each tune sits on top of its style course (data/packs/restore-<style>):
remove = steps that don't apply to this bike, patch = steps rewritten for it, add = its own steps,
plus its recalls, known problems, tips and owner forums. Facts carry the source they came from.
Numbers that only the factory manual gives stay out. Run: python3 data/tunes/make_tunes.py"""
import json, pathlib
HERE = pathlib.Path(__file__).parent

def step(id, phase, after, title, instructions, reason, src, safety="Normal", skill="Intermediate", hours=1.0, tools=""):
    return dict(id=id, phase=phase, after=after, title=title, instructions=instructions, reason=reason, src=src, safety=safety, skill=skill, estHours=hours, tools=tools)

CARB = ["G-005"]            # fuel injection check
EFI = ["G-004"]             # carb rebuild
AIR = ["H-004"]             # cooling system service

T = []

T.append(dict(id="honda-cb750-sohc", make="Honda", model="CB750", name="Honda CB750 (SOHC four)", years=[1969, 1978],
  match=["cb750", "cb 750", "cb750k", "cb750f", "cb750a", "cb750 four", "cb750 super sport"], style="standard", drive="chain",
  engine="736 cc air-cooled SOHC inline four, four carbs, dry sump",
  intro="Honda's first big four. Four carbs, points ignition and a dry-sump engine that keeps its oil in a separate tank.",
  focus=[["736 cc SOHC four", "Air-cooled, one cam"], ["Dry sump", "Oil lives in a separate tank"], ["Four carbs", "Rebuilt and synced as a set"], ["Points ignition", "Gap and timing"], ["Cam chain", "Listen for tensioner rattle"]],
  remove=CARB + AIR,
  patch={"G-004": dict(title="Rebuild the four carbs as a set", instructions="Take the carb bank off as one unit. Strip one carb at a time and keep each carb's parts in its own labeled tray. Clean every jet and passage, fit new float bowl gaskets and o-rings, set the float heights, then refit the bank.",
                       reason="The four carbs work as one synced system. Mixing parts between them, or rebuilding only one, is how a SOHC ends up running on three.")},
  add=[step("X-CB7-01", "B", "B-004", "Listen for cam chain rattle", "Start it cold and listen at the top of the engine at idle and around 2,000 rpm. A rattle that fades as it warms points at the cam chain tensioner.", "A worn cam chain tensioner is the most common top-end noise on these engines.", "motoryk.com/bikes/honda/cb750", hours=0.3),
       step("X-CB7-02", "H", "H-001", "Check the oil in the separate tank", "This engine is dry sump: the oil lives in a tank under the seat, not in the crankcase. Check the level with the dipstick in the tank, the way the manual says, and look for leaks at the tank lines.", "Checking it like a wet-sump bike gives a wrong reading. Oil that seems to leak from the cases can come from the tank lines.", "Dry-sump layout, vintage buyer guides"),
       step("X-CB7-03", "L", "L-001", "Check the fork sliders before fitting seals", "Before fitting new fork seals, look inside the seal bore for scores. A seal levered out with a screwdriver in the past often scars the alloy, and oil then wicks past the new seal.", "Owners report new seals leaking on scored sliders.", "sohc.co.uk forum", hours=0.3)],
  lessons={"A": ["Write down the engine number. Early K0 bikes differ from later K models in many small parts."], "G": ["Rebuild one carb at a time and keep each one's parts apart."]},
  recalls=[], recallNote="Any recalls on bikes this old were closed long ago. Check that past owners didn't skip key service instead.",
  known=[dict(title="Cam chain tensioner", what="Rattle at idle and around 2,000 rpm, loudest when cold.", src="https://motoryk.com/bikes/honda/cb750"),
         dict(title="Carbs that won't sync", what="'Just needs the carbs cleaned' usually means a full rebuild of all four.", src="https://ava.ead.domalberto.edu.br/1975-honda-cb750-sale"),
         dict(title="Scored fork sliders", what="New seals leak if an old seal was pried out and scratched the alloy.", src="https://www.sohc.co.uk/index.php/topic,4315.0.html")],
  forums=[dict(name="SOHC.co.uk forum", url="https://www.sohc.co.uk/", what="Owner forum for single-cam Honda fours."), dict(name="CB750.com forum", url="https://www.cb750.com/", what="Restoration threads and engine rebuild help.")]))

T.append(dict(id="kawasaki-kz650", make="Kawasaki", model="KZ650", name="Kawasaki KZ650", years=[1977, 1983],
  match=["kz650", "kz 650", "z650", "kz650b", "kz650c", "kz650d", "kz650f", "kz650h", "kz650 csr", "kz650 sr"], style="standard", drive="chain",
  engine="652 cc air-cooled DOHC inline four, four carbs",
  intro="A light, quick DOHC four. Cheap to buy, well supported, and mostly let down by tired ignition parts and old rubber.",
  focus=[["DOHC inline four", "Air-cooled"], ["Four carbs", "Keep each carb's parts apart"], ["Points (early)", "Points and auto advancer"], ["Old o-rings", "Leaks come one at a time"], ["JIS screws", "Use JIS bits, not Phillips"]],
  remove=CARB + AIR,
  patch={},
  add=[step("X-KZ6-01", "A", "A-004", "Get JIS screwdriver bits", "The cross-head screws on the KZ are JIS, not Phillips. Buy a set of JIS bits before you touch the engine covers or carbs.", "Phillips bits cam out and strip JIS screws, which turns a 5-minute job into drilling out screws.", "kzrider.com forum", skill="Basic", hours=0.2, tools="JIS screwdriver set"),
       step("X-KZ6-02", "F", "F-004", "Service the points and auto advancer", "On points bikes, fit new Kawasaki points and condenser, set the gap, and free up the automatic timing advancer under the right-hand cover. Then set the timing.", "Worn points and a sticky advancer cause misfires and flat spots that look like carb trouble.", "kzrider.com forum", hours=1.5),
       step("X-KZ6-03", "H", "H-005", "Check the clutch cushion rubbers", "With the clutch apart, check the rubber dampers in the clutch basket. After a few decades they break up.", "Broken cushion rubbers make the clutch rattle and clunk.", "sidyoung.com", hours=0.5),
       step("X-KZ6-04", "H", "H-006", "Track down o-ring leaks", "Clean the engine and find each leak at its source. Many come from the engine's rubber o-rings, which age out one at a time.", "Fixing the right o-ring beats chasing the same leak across the cases.", "kzrider.com forum", hours=1.0)],
  lessons={"A": ["Buy the Kawasaki service manual. Owners on KZRider point new restorers to it first."], "G": ["Keep each carb's parts in a container marked with its number."]},
  recalls=[], recallNote="Any recalls on bikes this old were closed long ago.",
  known=[dict(title="Points ignition", what="Worn points and a sticky advancer cause high-rpm misfires.", src="https://kzrider.com/forum/2-engine/598111-1977-kz650?start=0"),
         dict(title="Rubber o-ring leaks", what="Many small o-rings in the engine fail one at a time.", src="https://kzrider.com/forum/13-bike-related/607091-77-kz650c-pre-purchase-inspection"),
         dict(title="Clutch cushion rubbers", what="Dampers in the clutch break up with age.", src="https://sidyoung.com/refreshing-a-tired-z650/"),
         dict(title="Varnished carbs", what="Bikes that sat often start only on choke until the jets are cleaned.", src="https://kzrider.com/forum/10-new-members/435271-new-bike-first-kz-1981-csr-650-19000-original-mi")],
  forums=[dict(name="KZRider forum", url="https://kzrider.com/", what="The main KZ owner forum, with a section for every model.")]))

T.append(dict(id="yamaha-xs650", make="Yamaha", model="XS650", name="Yamaha XS650", years=[1970, 1983],
  match=["xs650", "xs 650", "xs1", "xs2", "tx650", "xs650 special", "xs650 heritage special"], style="standard", drive="chain",
  engine="653 cc air-cooled SOHC parallel twin, two carbs",
  intro="A tough parallel twin with a huge following and parts supply. Most trouble on these bikes is electrical.",
  focus=[["SOHC parallel twin", "Air-cooled, roller-bearing bottom end"], ["Charging system", "Brushes, rectifier, regulator"], ["Battery-run ignition", "A weak battery causes odd faults"], ["Cam chain", "Adjust it, check the guide"], ["Two carbs", "Clean and sync"]],
  remove=CARB + AIR,
  patch={"F-002": dict(title="Test the charging system", instructions="With a fully charged battery, measure the voltage at the battery at idle, at 1,200 rpm and at 3,000 rpm, and write the readings in Measurements. If it isn't charging, check the brushes, rectifier, regulator and grounds in that order.", reason="The charging system is the XS650's best-known weak spot, and the ignition runs off the battery.")},
  add=[step("X-XS6-01", "H", "H-003", "Adjust the cam chain", "Adjust the cam chain tension the way the manual describes. If it's noisy after adjusting, check the cam chain guide for wear.", "Owners adjust the cam chain as routine. A worn guide makes the top end rattle.", "xs650.com forum", hours=0.7)],
  lessons={"F": ["Charging voltage on a healthy XS650 is about 12.6 V at idle, 13.5 V at 1,200 rpm and 14.5 V at 3,000 rpm (source: Revival Cycles XS650 troubleshooting guide)."], "A": ["Use the XS650.com VIN lookup to confirm your exact model and year."]},
  recalls=[], recallNote="Any recalls on bikes this old were closed long ago.",
  known=[dict(title="Charging system", what="Worn brushes, a failed rectifier or regulator, or bad grounds.", src="https://revivalparts.freshdesk.com/support/solutions/articles/17000130384-electrical-troubleshooting-guide"),
         dict(title="Cam chain and guide", what="Needs regular adjusting, and the guide wears.", src="https://www.xs650.com/threads/cam-chain-guide.63774/page-2"),
         dict(title="Weak battery", what="The ignition runs off the battery, so a tired one causes odd faults.", src="https://www.xs650.com/goto/post?id=158549")],
  forums=[dict(name="XS650.com", url="https://www.xs650.com/", what="Owner forum with a large tech reference section."), dict(name="XS650 tech references", url="https://www.xs650.com/pages/tech/", what="Model ID, engine, carbs and wiring articles.")]))

T.append(dict(id="suzuki-gs550", make="Suzuki", model="GS550", name="Suzuki GS550", years=[1977, 1980],
  match=["gs550", "gs 550", "gs550e", "gs550l", "gs550b", "gs550ec"], style="standard", drive="chain",
  engine="549 cc air-cooled DOHC inline four, four carbs",
  intro="The GS750's smaller brother, from the same engine family and the same Haynes manual. Overbuilt and long-lived.",
  focus=[["DOHC inline four", "Air-cooled"], ["Shares with the GS750", "Same family, same manual"], ["Four carbs", "Clean and sync"], ["Points ignition", "Gap and timing"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR,
  patch={"A-003": dict(title="Get the service manual", instructions="Get the Suzuki factory service manual for your year, or the Haynes manual no. 363, which covers the 1976-1982 GS550 and GS750 fours.", reason="Every torque value, clearance and capacity in this course comes from the manual.")},
  add=[],
  lessons={"H": ["NGK B8ES is the plug GS Resources owners name for the 1977 GS550. Check your manual for your year.", "Suzuki oil filter 16500-45810 fits the 1977-82 GS550 (Total Motorcycle parts list)."], "K": ["EBC FA38 is listed for the 1977-79 front discs (Total Motorcycle parts list)."]},
  recalls=[], recallNote="Any recalls on bikes this old were closed long ago.",
  known=[dict(title="Bikes that sat", what="Fuel, carbs and brakes need the full sitting-bike routine before the first start.", src="https://www.thegsresources.com/_forum/forum/technical-forums/old-technical-info-forum/22060-1983-suzuki-gs-550-e-12-000-original-miles?p=383593"),
         dict(title="Points ignition", what="Many 'carb' problems on points bikes turn out to be ignition.", src="https://thegsresources.com/_forum/forum/featured-forums/gs-owners/74956-detroit-livonia-mi-78-gs550-new-owner")],
  forums=[dict(name="The GS Resources", url="https://www.thegsresources.com/", what="The main Suzuki GS forum, with carb, wiring and manual downloads.")]))

T.append(dict(id="honda-cb350-twin", make="Honda", model="CB350", name="Honda CB350 / CL350", years=[1968, 1973],
  match=["cb350", "cb 350", "cl350", "cl 350", "cb350k", "cl350k"], style="standard", drive="chain",
  engine="325 cc air-cooled SOHC parallel twin, two carbs",
  intro="A very common first restoration, with a big owner community and good parts supply.",
  focus=[["SOHC parallel twin", "Air-cooled"], ["Centrifugal oil filter", "Clean the slinger"], ["Cam chain tensioner", "Old rubber roller"], ["Points ignition", "Watch cam bearing wear"], ["Two carbs", "Clean and sync"]],
  remove=CARB + AIR,
  patch={"H-001": dict(title="Change the oil and clean the oil slinger", instructions="Drain the oil, then take off the right-hand cover and clean out the centrifugal oil filter (the oil slinger). Look at what's inside it before you clean it.", reason="This engine has no paper filter. Sludge and bits of a broken cam chain roller collect in the slinger.")},
  add=[step("X-CB3-01", "H", "H-001", "Check the cam chain tensioner roller", "Inspect the cam chain tensioner roller. The original was rubber and goes hard and brittle with age. Bits in the oil slinger mean it's breaking up.", "A failing roller lets the cam chain slap and sends debris through the engine.", "Classic Bike Guide via PressReader", hours=1.0),
       step("X-CB3-02", "F", "F-004", "Check the points-side cam bearing", "Before setting the points, check the cam bearing cover on the points side for wear and oil weeping.", "A worn cam bearing lets the points gap and timing wander even after you set them.", "vintagehondatwins.com forum", hours=0.5)],
  lessons={"L": ["Don't overtighten the drive chain. Owners see that often on these bikes."]},
  recalls=[], recallNote="Any recalls on bikes this old were closed long ago.",
  known=[dict(title="Cam chain tensioner roller", what="The rubber roller goes brittle and breaks up.", src="https://www.pressreader.com/uk/classic-bike-guide/20210323/282711934802836"),
         dict(title="Points timing wanders", what="A worn points-side cam bearing changes the gap.", src="https://vintagehondatwins.com/forums/goto/post?id=199182"),
         dict(title="Overtight chain", what="Owners often run the drive chain too tight.", src="https://vintagehondatwins.com/forums/goto/post?id=193108")],
  forums=[dict(name="Vintage Honda Twins forum", url="https://www.vintagehondatwins.com/", what="Owner forum for CB/CL 350 and 450 twins.")]))

T.append(dict(id="honda-rebel-500", make="Honda", model="Rebel 500", name="Honda Rebel 500", years=[2017, 2026],
  match=["rebel 500", "rebel500", "cmx500", "cmx 500"], style="cruiser", drive="chain",
  engine="471 cc liquid-cooled parallel twin, fuel injected",
  intro="A top-selling cruiser. Most owners here are keeping a modern bike healthy, so check the recalls first.",
  focus=[["Parallel twin", "Liquid-cooled"], ["Fuel injected", "No carbs to rebuild"], ["Chain drive", "Slack and lube"], ["Open recalls", "Handlebar lock screw"], ["Low seat", "Easy to work around"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Rebel 500s from 2017-2023 and 2025 are in recall 26V500 for the handlebar lock screw, and some 2020-2021 bikes had a rear reflector recall (21V382). Book any open recall with a Honda dealer.", reason="Recall work is free, and the handlebar screw can interfere with steering.")},
  add=[],
  lessons={"A": ["2017-2018 bikes also had an EVAP canister hose service campaign (Honda KJ3). Ask the dealer whether yours was done."]},
  recalls=[dict(id="26V500", years="2017-2023, 2025", what="Handlebar lock screw can loosen and fall between the frame and steering stem.", fix="Free repair at a Honda dealer (Honda code KUO).", src="https://www.motorcycle.com/bikes/news/honda-recalls-rebel-300-rebel-500-and-scl500-for-loose-screws-44669233"),
           dict(id="21V382", years="2020-2021", what="Rear reflector may be too dim.", fix="Dealer replaces the reflector free.", src="https://vehiclesafetyrecalls.com/recall/21V382000")],
  known=[dict(title="EVAP canister hose", what="2017-2018 service campaign for a hose that lets fuel vapor through.", src="https://static.nhtsa.gov/odi/tsbs/2018/MC-10143374-9999.pdf")],
  forums=[]))

T.append(dict(id="yamaha-mt07-gen1", make="Yamaha", model="MT-07", name="Yamaha MT-07 / FZ-07", years=[2014, 2017],
  match=["mt-07", "mt07", "mt 07", "fz-07", "fz07", "fz 07"], style="standard", drive="chain",
  engine="689 cc liquid-cooled parallel twin (CP2), fuel injected",
  intro="Yamaha's CP2 twin. Sold as the FZ-07 in the US for 2015-2017.",
  focus=[["CP2 parallel twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Chain drive", "Slack and lube"], ["US name FZ-07", "Same bike, 2015-2017"], ["One recall", "2015 battery cable"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2015 FZ-07s built May to September 2014 are in recall 14V657 for the positive battery cable. Book any open recall with a Yamaha dealer.", reason="A pinched battery cable can short and start a fire.")},
  add=[step("X-MT7-01", "D", "D-002", "Check the battery cable under the seat", "With the seat off, look at the positive battery cable where it runs by the seat base and bracket. It should not be pinched or rubbed through.", "This is the spot the 2015 recall fixed.", "NHTSA 14V657", skill="Basic", hours=0.2)],
  lessons={},
  recalls=[dict(id="14V657", years="2015 (built May-Sept 2014)", what="Positive battery cable can be pinched between the seat base and bracket and short.", fix="Dealer replaces the cable and seat bracket free.", src="https://api.nhtsa.gov/recalls/recallsByVehicle?make=YAMAHA&model=FZ07&modelYear=2015")],
  known=[], forums=[]))

T.append(dict(id="kawasaki-ninja-400", make="Kawasaki", model="Ninja 400", name="Kawasaki Ninja 400", years=[2018, 2023],
  match=["ninja 400", "ninja400", "ex400", "ex400g", "ex400h"], style="sport", drive="chain",
  engine="399 cc liquid-cooled parallel twin, fuel injected",
  intro="A very common first sport bike. Fully faired, so most jobs start with taking panels off.",
  focus=[["Parallel twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fairing", "Clips and screws to label"], ["Chain drive", "Slack and lube"], ["2021 recall", "Cam chain tensioner"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2021 Ninja 400s are in recall 20V774 (Kawasaki MC20-13) for a cam chain tensioner that may not have been heat-treated properly. Book any open recall with a Kawasaki dealer.", reason="A damaged tensioner can stall the engine. Kawasaki told owners not to ride affected bikes until fixed.")},
  add=[],
  lessons={},
  recalls=[dict(id="20V774", years="2021", what="Cam chain tensioner may be weak from bad heat treatment and can stall the engine.", fix="Dealer replaces the tensioner free (Kawasaki MC20-13).", src="https://static.nhtsa.gov/odi/rcl/2020/RCRIT-20V774-9630.pdf")],
  known=[], forums=[]))

T.append(dict(id="harley-street-glide-m8", make="Harley-Davidson", model="Street Glide", name="Harley-Davidson Street Glide (Milwaukee-Eight)", years=[2017, 2023],
  match=["street glide", "streetglide", "flhx", "flhxs", "street glide special"], style="touring", drive="belt",
  engine="Milwaukee-Eight V-twin (107 or 114), fuel injected, belt drive",
  intro="Harley's best-selling bagger. Several recalls touch the oil lines, clutch and charging wiring, so start there.",
  focus=[["Milwaukee-Eight", "107 or 114 V-twin"], ["Belt drive", "Tension and wear"], ["Hydraulic clutch", "2017-18 recall"], ["Batwing fairing", "Wiring behind it"], ["Fuel injected", "No carbs"]],
  remove=EFI + ["G-007"],
  patch={"H-004": dict(title="Check the oil cooler and its lines", instructions="The Street Glide's engine is cooled by air and oil. Check the oil cooler for damage and blocked fins, and check every oil cooler line and clamp for leaks and secure fitting.", reason="A loose oil cooler line can dump oil in front of the rear tire. That was the 2017 recall (17V333)."),
         "A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls and ask a Harley dealer to check it too. Street Glides from this era have had recalls for the oil cooler line clamp (2017), the hydraulic clutch actuator (2017-2018) and the voltage regulator wire (2023), among others.", reason="Each of these can cause a crash or leave you stranded. The repairs are free.")},
  add=[step("X-SG8-01", "B", "B-002", "Look for oil at the air cleaner", "Pull the air cleaner cover and look for oil in the filter or backplate.", "Oil there can point to the Milwaukee-Eight sumping problem Harley covered in bulletin M1450.", "au7o.io (bulletin M1450)", skill="Basic", hours=0.3),
       step("X-SG8-02", "H", "H-005", "Check the clutch disengages fully", "With the engine running in neutral, pull the clutch, select first and roll the bike. It should roll freely. If the clutch drags or won't release, check the hydraulic clutch and recall 18V734.", "The 2017-2018 recall covered a secondary clutch actuator that leaks internally.", "au7o.io (NHTSA 18V734)", hours=0.3)],
  lessons={},
  recalls=[dict(id="17V333", years="2017", what="Oil cooler line clamp may be installed wrong and the line can come off.", fix="Dealer checks and corrects the clamps free (Harley 0170).", src="https://vehiclesafetyrecalls.com/recall/17V333000"),
           dict(id="18V734", years="2017-2018", what="Hydraulic clutch secondary actuator can leak internally so the clutch won't disengage.", fix="Free dealer repair (Harley 0173).", src="https://au7o.io/motorcycle-issues/harley-davidson-street-glide?year=2018"),
           dict(id="24V672", years="2023", what="Voltage regulator wire can chafe on the crankcase and blow the main fuse.", fix="Free dealer repair.", src="https://au7o.io/motorcycle-issues/harley-davidson-street-glide?year=2023")],
  known=[dict(title="Oil sumping", what="Excess oil in the crankcase under hard use; oil at the air cleaner (bulletin M1450).", src="https://au7o.io/motorcycle-issues/harley-davidson-street-glide?year=2019")],
  forums=[]))

T.append(dict(id="kawasaki-klr650-gen2", make="Kawasaki", model="KLR650", name="Kawasaki KLR650", years=[2008, 2018],
  match=["klr650", "klr 650", "klr", "kl650", "kl650e"], style="dualsport", drive="chain",
  engine="651 cc liquid-cooled single, one carb",
  intro="The second-generation KLR. Simple, cheap and owner-maintained, with one famous weak part: the doohickey.",
  focus=[["651 cc single", "Liquid-cooled"], ["One carb", "No fuel injection"], ["The doohickey", "Balancer chain lever"], ["2008-09 recalls", "Muffler bolts, harness"], ["Chain drive", "Slack and lube"]],
  remove=["G-005"],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2008-2009 bikes had recalls for the muffler mount bolts (09V059) and a wiring harness that can chafe on the frame (09V062), and 2008 bikes for the turn signals (08V520).", reason="These were all fixed free by dealers if they were done.")},
  add=[step("X-KLR-01", "H", "H-001", "Inspect or upgrade the doohickey", "Check the balancer chain idler lever (the 'doohickey') and its spring. Many owners replace it with an aftermarket kit while the left cover is off.", "The stock part is the KLR's best-known weak spot, and owners still replace it on newer bikes.", "advrider.com", skill="Advanced", hours=2.5),
       step("X-KLR-02", "E", "E-004", "Check the harness where it meets the frame", "Follow the main harness along the frame and look for chafed insulation, especially on 2008-2009 bikes.", "The 09V062 recall fixed a harness that rubbed through and cut engine power.", "au7o.io (NHTSA 09V062)", skill="Basic", hours=0.3)],
  lessons={},
  recalls=[dict(id="09V059", years="2008-2009", what="Muffler mount bolts can loosen.", fix="Dealer strips paint from the tabs and fits new bolts free.", src="https://vehiclesafetyrecalls.com/recall/09V059000"),
           dict(id="09V062", years="2008-2009", what="Main wiring harness can chafe on the frame and cut engine power.", fix="Free dealer repair.", src="https://au7o.io/motorcycle-issues/kawasaki-klr650"),
           dict(id="08V520", years="2008", what="Turn signal assemblies.", fix="Dealer replaces all four turn signals free.", src="https://vehiclesafetyrecalls.com/recall/08V520000")],
  known=[dict(title="The doohickey", what="The balancer chain idler lever and spring can fail.", src="https://www.advrider.com/klr650-doohickey-people-are-still-replacing-this-part-on-3rd-gen-models/")],
  forums=[]))

import sys; sys.path.insert(0, str(HERE)); from batch2 import B2, HERO_NAME_B2
from batch3 import B3, HERO_NAME_B3
from batch4 import B4, HERO_NAME_B4
from batch5 import B5, HERO_NAME_B5
from batch6 import B6, HERO_NAME_B6
from batch7 import B7, HERO_NAME_B7
from batch8 import B8, HERO_NAME_B8
from batch9 import B9, HERO_NAME_B9
from batch10 import B10, HERO_NAME_B10
from batch11 import B11, HERO_NAME_B11
from batch12 import B12, HERO_NAME_B12
from batch13 import B13, HERO_NAME_B13
from batch14 import B14, HERO_NAME_B14
from batch15 import B15, HERO_NAME_B15
from batch16 import B16, HERO_NAME_B16
from batch17 import B17, HERO_NAME_B17
from batch18 import B18, HERO_NAME_B18
from batch19 import B19, HERO_NAME_B19
from batch20 import B20, HERO_NAME_B20
from batch21 import B21, HERO_NAME_B21
from batch22 import B22, HERO_NAME_B22
from batch23 import B23, HERO_NAME_B23
from batch24 import B24, HERO_NAME_B24
from batch25 import B25, HERO_NAME_B25
from batch26 import B26, HERO_NAME_B26
from batch27 import B27, HERO_NAME_B27
from batch28 import B28, HERO_NAME_B28
from batch29 import B29, HERO_NAME_B29
from batch30 import B30, HERO_NAME_B30
from batch31 import B31, HERO_NAME_B31
from batch32 import B32, HERO_NAME_B32
from batch33 import B33, HERO_NAME_B33
from batch34 import B34, HERO_NAME_B34
from batch35 import B35, HERO_NAME_B35
from batch36 import B36, HERO_NAME_B36
from batch37 import B37, HERO_NAME_B37
from batch38 import B38, HERO_NAME_B38
from batch39 import B39, HERO_NAME_B39
from batch40 import B40, HERO_NAME_B40
from batch41 import B41, HERO_NAME_B41
from batch42 import B42, HERO_NAME_B42
from batch43 import B43, HERO_NAME_B43
from batch44 import B44, HERO_NAME_B44
from batch45 import B45, HERO_NAME_B45
from batch46 import B46, HERO_NAME_B46
from batch47 import B47, HERO_NAME_B47
from batch48 import B48, HERO_NAME_B48
from batch49 import B49, HERO_NAME_B49
from batch50 import B50, HERO_NAME_B50
from batch51 import B51, HERO_NAME_B51
from batch52 import B52, HERO_NAME_B52
from batch53 import B53, HERO_NAME_B53
from batch54 import B54, HERO_NAME_B54
from batch55 import B55, HERO_NAME_B55
from batch56 import B56, HERO_NAME_B56
from batch57 import B57, HERO_NAME_B57
from batch58 import B58, HERO_NAME_B58
from batch59 import B59, HERO_NAME_B59
from batch60 import B60, HERO_NAME_B60
from batch61 import B61, HERO_NAME_B61
from batch62 import B62, HERO_NAME_B62
from batch63 import B63, HERO_NAME_B63
from batch64 import B64, HERO_NAME_B64
from batch65 import B65, HERO_NAME_B65
from batch66 import B66, HERO_NAME_B66
from batch67 import B67, HERO_NAME_B67
from batch68 import B68, HERO_NAME_B68
from batch69 import B69, HERO_NAME_B69
from batch70 import B70, HERO_NAME_B70
from batch71 import B71, HERO_NAME_B71
from batch72 import B72, HERO_NAME_B72
from batch73 import B73, HERO_NAME_B73
from batch74 import B74, HERO_NAME_B74
from batch75 import B75, HERO_NAME_B75
from batch76 import B76, HERO_NAME_B76
from batch77 import B77, HERO_NAME_B77
from batch78 import B78, HERO_NAME_B78
from batch79 import B79, HERO_NAME_B79
from batch80 import B80, HERO_NAME_B80
from batch81 import B81, HERO_NAME_B81
from batch82 import B82, HERO_NAME_B82
from batch83 import B83, HERO_NAME_B83
from batch84 import B84, HERO_NAME_B84
from batch85 import B85, HERO_NAME_B85
from batch86 import B86, HERO_NAME_B86
from batch87 import B87, HERO_NAME_B87
from batch88 import B88, HERO_NAME_B88
from batch89 import B89, HERO_NAME_B89
from batch90 import B90, HERO_NAME_B90
from batch91 import B91, HERO_NAME_B91
from batch92 import B92, HERO_NAME_B92
from batch93 import B93, HERO_NAME_B93
from batch94 import B94, HERO_NAME_B94
from batch95 import B95, HERO_NAME_B95
from batch96 import B96, HERO_NAME_B96
from batch97 import B97, HERO_NAME_B97
from batch98 import B98, HERO_NAME_B98
from batch99 import B99, HERO_NAME_B99
from batch100 import B100, HERO_NAME_B100
from batch101 import B101, HERO_NAME_B101
from batch102 import B102, HERO_NAME_B102
from batch103 import B103, HERO_NAME_B103
from batch104 import B104, HERO_NAME_B104
from batch105 import B105, HERO_NAME_B105
from batch106 import B106, HERO_NAME_B106
from batch107 import B107, HERO_NAME_B107
from batch108 import B108, HERO_NAME_B108
from batch109 import B109, HERO_NAME_B109
from batch110 import B110, HERO_NAME_B110
from batch111 import B111, HERO_NAME_B111
from batch112 import B112, HERO_NAME_B112
from batch113 import B113, HERO_NAME_B113
from batch114 import B114, HERO_NAME_B114
from batch115 import B115, HERO_NAME_B115
from batch116 import B116, HERO_NAME_B116
from batch117 import B117, HERO_NAME_B117
from batch118 import B118, HERO_NAME_B118
from batch119 import B119, HERO_NAME_B119
from batch120 import B120, HERO_NAME_B120
from batch121 import B121, HERO_NAME_B121
from batch122 import B122, HERO_NAME_B122
from batch123 import B123, HERO_NAME_B123
from batch124 import B124, HERO_NAME_B124
from batch125 import B125, HERO_NAME_B125
from batch126 import B126, HERO_NAME_B126
from batch127 import B127, HERO_NAME_B127
from batch128 import B128, HERO_NAME_B128
from batch129 import B129, HERO_NAME_B129
from batch130 import B130, HERO_NAME_B130
from batch131 import B131, HERO_NAME_B131
from batch132 import B132, HERO_NAME_B132
from batch133 import B133, HERO_NAME_B133
from batch134 import B134, HERO_NAME_B134
from batch135 import B135, HERO_NAME_B135
from batch136 import B136, HERO_NAME_B136
from batch137 import B137, HERO_NAME_B137
from batch138 import B138, HERO_NAME_B138
from batch139 import B139, HERO_NAME_B139
from batch140 import B140, HERO_NAME_B140
from batch141 import B141, HERO_NAME_B141
from batch142 import B142, HERO_NAME_B142
from batch143 import B143, HERO_NAME_B143
from batch144 import B144, HERO_NAME_B144
from batch145 import B145, HERO_NAME_B145
from batch146 import B146, HERO_NAME_B146
from batch147 import B147, HERO_NAME_B147
from batch148 import B148, HERO_NAME_B148
from batch149 import B149, HERO_NAME_B149
from batch150 import B150, HERO_NAME_B150
from batch151 import B151, HERO_NAME_B151
from batch152 import B152, HERO_NAME_B152
from batch153 import B153, HERO_NAME_B153
from batch154 import B154, HERO_NAME_B154
from batch155 import B155, HERO_NAME_B155
from batch156 import B156, HERO_NAME_B156
from batch157 import B157, HERO_NAME_B157
from batch158 import B158, HERO_NAME_B158
from batch159 import B159, HERO_NAME_B159
from batch160 import B160, HERO_NAME_B160
from batch161 import B161, HERO_NAME_B161
from batch162 import B162, HERO_NAME_B162
from batch163 import B163, HERO_NAME_B163
from batch164 import B164, HERO_NAME_B164
from batch165 import B165, HERO_NAME_B165
from batch166 import B166, HERO_NAME_B166
from batch167 import B167, HERO_NAME_B167
from batch168 import B168, HERO_NAME_B168
from batch169 import B169, HERO_NAME_B169
from batch170 import B170, HERO_NAME_B170
T += B2 + B3 + B4 + B5 + B6 + B7 + B8 + B9 + B10 + B11 + B12 + B13 + B14 + B15 + B16 + B17 + B18 + B19 + B20 + B21 + B22 + B23 + B24 + B25 + B26 + B27 + B28 + B29 + B30 + B31 + B32 + B33 + B34 + B35 + B36 + B37 + B38 + B39 + B40 + B41 + B42 + B43 + B44 + B45 + B46 + B47 + B48 + B49 + B50 + B51 + B52 + B53 + B54 + B55 + B56 + B57 + B58 + B59 + B60 + B61 + B62 + B63 + B64 + B65 + B66 + B67 + B68 + B69 + B70 + B71 + B72 + B73 + B74 + B75 + B76 + B77 + B78 + B79 + B80 + B81 + B82 + B83 + B84 + B85 + B86 + B87 + B88 + B89 + B90 + B91 + B92 + B93 + B94 + B95 + B96 + B97 + B98 + B99 + B100 + B101 + B102 + B103 + B104 + B105 + B106 + B107 + B108 + B109 + B110 + B111 + B112 + B113 + B114 + B115 + B116 + B117 + B118 + B119 + B120 + B121 + B122 + B123 + B124 + B125 + B126 + B127 + B128 + B129 + B130 + B131 + B132 + B133 + B134 + B135 + B136 + B137 + B138 + B139 + B140 + B141 + B142 + B143 + B144 + B145 + B146 + B147 + B148 + B149 + B150 + B151 + B152 + B153 + B154 + B155 + B156 + B157 + B158 + B159 + B160 + B161 + B162 + B163 + B164 + B165 + B166 + B167 + B168 + B169 + B170
HERO_NAME = {"honda-cb750-sohc": "CB750", "honda-rebel-500": "REBEL", "kawasaki-kz650": "KZ650", "yamaha-mt07-gen1": "MT-07", "yamaha-xs650": "XS650", "kawasaki-ninja-400": "NINJA", "suzuki-gs550": "GS550", "harley-street-glide-m8": "GLIDE", "honda-cb350-twin": "CB350", "kawasaki-klr650-gen2": "KLR"}
HERO_NAME.update(HERO_NAME_B2); HERO_NAME.update(HERO_NAME_B3); HERO_NAME.update(HERO_NAME_B4); HERO_NAME.update(HERO_NAME_B5); HERO_NAME.update(HERO_NAME_B6); HERO_NAME.update(HERO_NAME_B7); HERO_NAME.update(HERO_NAME_B8); HERO_NAME.update(HERO_NAME_B9); HERO_NAME.update(HERO_NAME_B10); HERO_NAME.update(HERO_NAME_B11); HERO_NAME.update(HERO_NAME_B12); HERO_NAME.update(HERO_NAME_B13); HERO_NAME.update(HERO_NAME_B14); HERO_NAME.update(HERO_NAME_B15); HERO_NAME.update(HERO_NAME_B16); HERO_NAME.update(HERO_NAME_B17); HERO_NAME.update(HERO_NAME_B18); HERO_NAME.update(HERO_NAME_B19); HERO_NAME.update(HERO_NAME_B20); HERO_NAME.update(HERO_NAME_B21); HERO_NAME.update(HERO_NAME_B22); HERO_NAME.update(HERO_NAME_B23); HERO_NAME.update(HERO_NAME_B24); HERO_NAME.update(HERO_NAME_B25); HERO_NAME.update(HERO_NAME_B26); HERO_NAME.update(HERO_NAME_B27); HERO_NAME.update(HERO_NAME_B28); HERO_NAME.update(HERO_NAME_B29); HERO_NAME.update(HERO_NAME_B30); HERO_NAME.update(HERO_NAME_B31); HERO_NAME.update(HERO_NAME_B32); HERO_NAME.update(HERO_NAME_B33); HERO_NAME.update(HERO_NAME_B34); HERO_NAME.update(HERO_NAME_B35); HERO_NAME.update(HERO_NAME_B36); HERO_NAME.update(HERO_NAME_B37); HERO_NAME.update(HERO_NAME_B38); HERO_NAME.update(HERO_NAME_B39); HERO_NAME.update(HERO_NAME_B40); HERO_NAME.update(HERO_NAME_B41); HERO_NAME.update(HERO_NAME_B42); HERO_NAME.update(HERO_NAME_B43); HERO_NAME.update(HERO_NAME_B44); HERO_NAME.update(HERO_NAME_B45); HERO_NAME.update(HERO_NAME_B46); HERO_NAME.update(HERO_NAME_B47); HERO_NAME.update(HERO_NAME_B48); HERO_NAME.update(HERO_NAME_B49); HERO_NAME.update(HERO_NAME_B50); HERO_NAME.update(HERO_NAME_B51); HERO_NAME.update(HERO_NAME_B52); HERO_NAME.update(HERO_NAME_B53); HERO_NAME.update(HERO_NAME_B54); HERO_NAME.update(HERO_NAME_B55); HERO_NAME.update(HERO_NAME_B56); HERO_NAME.update(HERO_NAME_B57); HERO_NAME.update(HERO_NAME_B58); HERO_NAME.update(HERO_NAME_B59); HERO_NAME.update(HERO_NAME_B60); HERO_NAME.update(HERO_NAME_B61); HERO_NAME.update(HERO_NAME_B62); HERO_NAME.update(HERO_NAME_B63); HERO_NAME.update(HERO_NAME_B64); HERO_NAME.update(HERO_NAME_B65); HERO_NAME.update(HERO_NAME_B66); HERO_NAME.update(HERO_NAME_B67); HERO_NAME.update(HERO_NAME_B68); HERO_NAME.update(HERO_NAME_B69); HERO_NAME.update(HERO_NAME_B70); HERO_NAME.update(HERO_NAME_B71); HERO_NAME.update(HERO_NAME_B72); HERO_NAME.update(HERO_NAME_B73); HERO_NAME.update(HERO_NAME_B74); HERO_NAME.update(HERO_NAME_B75); HERO_NAME.update(HERO_NAME_B76); HERO_NAME.update(HERO_NAME_B77); HERO_NAME.update(HERO_NAME_B78); HERO_NAME.update(HERO_NAME_B79); HERO_NAME.update(HERO_NAME_B80); HERO_NAME.update(HERO_NAME_B81); HERO_NAME.update(HERO_NAME_B82); HERO_NAME.update(HERO_NAME_B83); HERO_NAME.update(HERO_NAME_B84); HERO_NAME.update(HERO_NAME_B85); HERO_NAME.update(HERO_NAME_B86); HERO_NAME.update(HERO_NAME_B87); HERO_NAME.update(HERO_NAME_B88); HERO_NAME.update(HERO_NAME_B89); HERO_NAME.update(HERO_NAME_B90); HERO_NAME.update(HERO_NAME_B91); HERO_NAME.update(HERO_NAME_B92); HERO_NAME.update(HERO_NAME_B93); HERO_NAME.update(HERO_NAME_B94); HERO_NAME.update(HERO_NAME_B95); HERO_NAME.update(HERO_NAME_B96); HERO_NAME.update(HERO_NAME_B97); HERO_NAME.update(HERO_NAME_B98); HERO_NAME.update(HERO_NAME_B99); HERO_NAME.update(HERO_NAME_B100); HERO_NAME.update(HERO_NAME_B101); HERO_NAME.update(HERO_NAME_B102); HERO_NAME.update(HERO_NAME_B103); HERO_NAME.update(HERO_NAME_B104); HERO_NAME.update(HERO_NAME_B105); HERO_NAME.update(HERO_NAME_B106); HERO_NAME.update(HERO_NAME_B107); HERO_NAME.update(HERO_NAME_B108); HERO_NAME.update(HERO_NAME_B109); HERO_NAME.update(HERO_NAME_B110); HERO_NAME.update(HERO_NAME_B111); HERO_NAME.update(HERO_NAME_B112); HERO_NAME.update(HERO_NAME_B113); HERO_NAME.update(HERO_NAME_B114); HERO_NAME.update(HERO_NAME_B115); HERO_NAME.update(HERO_NAME_B116); HERO_NAME.update(HERO_NAME_B117); HERO_NAME.update(HERO_NAME_B118); HERO_NAME.update(HERO_NAME_B119); HERO_NAME.update(HERO_NAME_B120); HERO_NAME.update(HERO_NAME_B121); HERO_NAME.update(HERO_NAME_B122); HERO_NAME.update(HERO_NAME_B123); HERO_NAME.update(HERO_NAME_B124); HERO_NAME.update(HERO_NAME_B125); HERO_NAME.update(HERO_NAME_B126); HERO_NAME.update(HERO_NAME_B127); HERO_NAME.update(HERO_NAME_B128); HERO_NAME.update(HERO_NAME_B129); HERO_NAME.update(HERO_NAME_B130); HERO_NAME.update(HERO_NAME_B131); HERO_NAME.update(HERO_NAME_B132); HERO_NAME.update(HERO_NAME_B133); HERO_NAME.update(HERO_NAME_B134); HERO_NAME.update(HERO_NAME_B135); HERO_NAME.update(HERO_NAME_B136); HERO_NAME.update(HERO_NAME_B137); HERO_NAME.update(HERO_NAME_B138); HERO_NAME.update(HERO_NAME_B139); HERO_NAME.update(HERO_NAME_B140); HERO_NAME.update(HERO_NAME_B141); HERO_NAME.update(HERO_NAME_B142); HERO_NAME.update(HERO_NAME_B143); HERO_NAME.update(HERO_NAME_B144); HERO_NAME.update(HERO_NAME_B145); HERO_NAME.update(HERO_NAME_B146); HERO_NAME.update(HERO_NAME_B147); HERO_NAME.update(HERO_NAME_B148); HERO_NAME.update(HERO_NAME_B149); HERO_NAME.update(HERO_NAME_B150); HERO_NAME.update(HERO_NAME_B151); HERO_NAME.update(HERO_NAME_B152); HERO_NAME.update(HERO_NAME_B153); HERO_NAME.update(HERO_NAME_B154); HERO_NAME.update(HERO_NAME_B155); HERO_NAME.update(HERO_NAME_B156); HERO_NAME.update(HERO_NAME_B157); HERO_NAME.update(HERO_NAME_B158); HERO_NAME.update(HERO_NAME_B159); HERO_NAME.update(HERO_NAME_B160); HERO_NAME.update(HERO_NAME_B161); HERO_NAME.update(HERO_NAME_B162); HERO_NAME.update(HERO_NAME_B163); HERO_NAME.update(HERO_NAME_B164); HERO_NAME.update(HERO_NAME_B165); HERO_NAME.update(HERO_NAME_B166); HERO_NAME.update(HERO_NAME_B167); HERO_NAME.update(HERO_NAME_B168); HERO_NAME.update(HERO_NAME_B169); HERO_NAME.update(HERO_NAME_B170)
CRED = json.loads((HERE.parent.parent / "img" / "sil" / "credits.json").read_text())
AREAS = ["engine", "fuel", "wheels", "brakes", "suspension", "electrical"]
SIL = HERE.parent.parent / "img" / "sil"
idx = []
for t in T:
    if (SIL / (t["id"] + ".svg")).exists():   # traced from a photo of this model (credits in img/sil/credits.json)
        t["silhouette"] = t["id"]
        t["areas"] = []
    t["heroName"] = HERO_NAME.get(t["id"], t["model"].upper())
    if (HERE.parent.parent / "img" / "hero" / (t["id"] + ".jpg")).exists():   # graded photo header, see tools/silhouettes/make_heroes.py
        c = CRED.get(t["id"] + ".svg", {})
        t["hero"] = {"src": "img/hero/" + t["id"] + ".jpg", "artist": c.get("artist", ""), "page": c.get("page", ""), "lic": c.get("lic", ""), "licUrl": c.get("licUrl", "")}
    (HERE / (t["id"] + ".json")).write_text(json.dumps(t, indent=1, ensure_ascii=False))
    idx.append({k: t[k] for k in ("id", "make", "model", "name", "years", "match", "style", "drive")})
(HERE / "index.json").write_text(json.dumps(idx, indent=1, ensure_ascii=False))
print(len(T), "tunes")
