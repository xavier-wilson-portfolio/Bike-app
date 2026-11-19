"""Batch 30 bike tunes (top 500, rows 291-300)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch29 import ADVR, KTMF
B30 = []
REF = dict(name="ADVrider", url="https://www.advrider.com/f/", what="Large riding forum with Royal Enfield owner threads.")
RE_REFLECT = dict(id="24V713", years="2023 (Nov 2022-Mar 2023 build)", what="Side and rear reflectors don't meet the lighting standard.", fix="Dealer replaces the side and rear reflectors free.", src="https://auto-recalls.justia.com/royal-enfield/hunter/2023/24v713000")
GUZ = dict(name="Moto Guzzi National Owners Club", url="https://www.mgnoc.org/", what="US owner club for Moto Guzzi.")
INDF = dict(name="HDForums", url="https://www.hdforums.com/", what="Large V-twin owner forum.")

B30.append(dict(id="ktm-950-990-adventure-2003", make="KTM", model="950 / 990 Adventure", name="KTM 950 / 990 Adventure", years=[2003, 2013],
  match=["990 adventure", "950 adventure", "990 adv", "950 adv", "990 adventure r", "990 adventure s"], style="adventure", drive="chain",
  engine="942 or 999 cc liquid-cooled LC8 V-twin, carbs (950) or fuel injected (990)",
  intro="KTM's first big LC8 adventure bikes. The 950 has carbs, the 990 is fuel injected. Twin fuel tanks and a lot of desert miles on most.",
  focus=[["LC8 V-twin", "Liquid-cooled"], ["Carb or EFI", "950 or 990"], ["Twin tanks", "Check the crossover"], ["Water pump", "Seal weeps"], ["Chain drive", "Slack and lube"]],
  remove=[], patch={}, add=[],
  lessons={"G": ["The 950 has carbs. The 990 is fuel injected. Skip the steps that don't match."]},
  recalls=[], recallNote="KTM issued recall actions for the 990 Adventure and the 990 Adventure ABS. Run your VIN at nhtsa.gov/recalls or ask a KTM dealer.",
  known=[dict(title="KTM recall actions", what="KTM lists recall actions for the 990 Adventure and the 990 Adventure ABS on its safety page.", src="https://www.ktm.com/en-us/service/Safety.html?year=2015")],
  forums=[ADVR, KTMF]))

B30.append(dict(id="royal-enfield-classic-350-500-2009", make="Royal Enfield", model="Classic 350 / 500", name="Royal Enfield Classic 350 / 500", years=[2009, 2026],
  match=["classic 350", "classic 500", "royal enfield classic", "re classic", "classic chrome", "g5 classic", "reborn classic"], style="standard", drive="chain",
  engine="346 or 499 cc air-cooled single, fuel injected",
  intro="Royal Enfield's retro single. Simple and slow-revving. Some 2023 bikes are in a reflector recall.",
  focus=[["Single cylinder", "Air-cooled"], ["Fuel injected", "No carb"], ["Reflector recall", "2023"], ["Chain drive", "Slack and lube"], ["Valves", "Check on time"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2023 Classic 350s are in recall 24V713 (side and rear reflectors).", reason="The fix is free.")},
  add=[], lessons={},
  recalls=[RE_REFLECT], known=[], forums=[REF]))

B30.append(dict(id="royal-enfield-bullet-500-1955", make="Royal Enfield", model="Bullet 350 / 500", name="Royal Enfield Bullet", years=[1955, 2020],
  match=["bullet", "bullet 500", "bullet 350", "royal enfield bullet", "bullet electra", "bullet g5", "bullet c5", "bullet military", "enfield bullet"], style="standard", drive="chain",
  engine="346 or 499 cc air-cooled pushrod single, carb (iron barrel and AVL) or fuel injected (UCE, 2009-on)",
  intro="The long-running Indian-built Bullet. Early iron-barrel engines, then the AVL lean-burn engine, then the fuel-injected UCE from 2009.",
  focus=[["Pushrod single", "Air-cooled"], ["Carb or EFI", "Depends on year"], ["Engine type", "Iron, AVL or UCE"], ["Chain drive", "Slack and lube"], ["Electrics", "Old wiring"]],
  remove=AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2009 Bullet G5 Classic EFI bikes are in recall 09V235 (clutch).", reason="The fix is free if it was never done.")},
  add=[], lessons={"A": ["Work out which engine you have first: iron barrel, AVL or UCE. Parts don't swap between them."], "G": ["Bikes before 2009 have a carb. UCE bikes are fuel injected. Skip the steps that don't match."]},
  recalls=[dict(id="09V235", years="2009 Bullet G5 Classic EFI (some)", what="Clutch assembly problem.", fix="Free dealer repair.", src="https://vehicleflaws.com/recall/24V713000")],
  known=[], forums=[REF]))

B30.append(dict(id="royal-enfield-continental-gt-650-2019", make="Royal Enfield", model="Continental GT 650", name="Royal Enfield Continental GT 650", years=[2019, 2026],
  match=["continental gt 650", "continental gt", "gt 650", "continental 650", "re gt650"], style="cafe", drive="chain",
  engine="648 cc air/oil-cooled parallel twin, fuel injected",
  intro="Royal Enfield's 650 cafe racer. Early bikes had a brake caliper corrosion recall.",
  focus=[["648 cc twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Caliper recall", "2018-2020"], ["Chain drive", "Slack and lube"], ["Valves", "Screw adjusters"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2018-2020 bikes are in recall 21V045 (road salt can corrode the brake calipers). Some 2023 bikes are in recall 24V713 (reflectors).", reason="Corroded calipers can drag or lose braking. Both fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="21V045", years="2018-2020", what="Road salt can corrode the brake calipers, making them drag or brake poorly.", fix="Dealer replaces the front and rear calipers free.", src="https://vehiclesafetyrecalls.com/recall/21V045000"),
           RE_REFLECT],
  known=[], forums=[REF]))

B30.append(dict(id="moto-guzzi-v7-2008", make="Moto Guzzi", model="V7", name="Moto Guzzi V7 (2008-on)", years=[2008, 2026],
  match=["v7", "v7 classic", "v7 ii", "v7 iii", "v7 racer", "v7 stone", "v7 special", "v7 850", "moto guzzi v7"], style="standard", drive="shaft",
  engine="744 or 853 cc air-cooled transverse V-twin, fuel injected, shaft drive",
  intro="Moto Guzzi's modern retro twin. Shaft drive and a simple air-cooled engine. Some 2017 V7 IIIs had a brake hose recall.",
  focus=[["Transverse V-twin", "Air-cooled"], ["Fuel injected", "Throttle bodies"], ["Shaft drive", "Change the oil"], ["Brake hose recall", "2017 V7 III"], ["Valves", "Screw adjusters"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2017 V7 III models are in recall 17V380 (front ABS brake hose can rub and leak).", reason="A brake fluid leak cuts front braking. The fix is free.")},
  add=[], lessons={"G": ["Balance the two throttle bodies after any work on them."]},
  recalls=[dict(id="17V380", years="2017 V7 III (Nov 2015-May 2017 build)", what="Front ABS brake hose may rub on the secondary air connection and leak.", fix="Dealer fits a hose mount and replaces any damaged hose free.", src="https://vehiclesafetyrecalls.com/recall/17V380000")],
  known=[], forums=[GUZ]))

B30.append(dict(id="moto-guzzi-850-le-mans-1976", make="Moto Guzzi", model="850 Le Mans", name="Moto Guzzi 850 Le Mans", years=[1976, 1993],
  match=["850 le mans", "le mans 850", "le mans 1000", "le mans ii", "le mans iii"], style="sport", drive="shaft",
  engine="844 or 949 cc air-cooled transverse V-twin, two carbs, shaft drive",
  intro="Guzzi's classic sport twin. Big Dell'Orto carbs, linked brakes and a shaft drive.",
  focus=[["Transverse V-twin", "Air-cooled"], ["Dell'Orto carbs", "Sync them"], ["Linked brakes", "Check the valve"], ["Shaft drive", "Change the oil"], ["Points ignition", "Gap and timing"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"K": ["The foot pedal works the rear and one front brake together. Bleed and check the system as a whole."]},
  recalls=[], recallNote=OLD, known=[], forums=[GUZ]))

B30.append(dict(id="indian-scout-2015", make="Indian", model="Scout (liquid-cooled)", name="Indian Scout (2015-on)", years=[2015, 2026],
  match=["indian scout", "scout", "scout sixty", "scout bobber", "scout rogue", "scout 101", "scout bobber twenty"], style="cruiser", drive="belt",
  engine="999 or 1133 cc liquid-cooled V-twin, fuel injected, belt drive",
  intro="Indian's liquid-cooled Scout. Several brake and fuel pump recalls across the years.",
  focus=[["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Brake recalls", "Several years"], ["Belt drive", "Check for cracks"], ["Cooling", "Hoses and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Some 2015 bikes are in recall 15V142 (rear brake master cylinder). 2017-2018 bikes are in recall 18V416 (air in the ABS). 2015-2019 bikes with an accessory brake lever may be in recall 19E007. 2021-2022 bikes are in recall 22V837 (fuel pump). 2025 bikes are in recall 24V970 (false neutral on the display).", reason="Brake and fuel pump faults are crash risks. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="15V142", years="2015 (some)", what="Rear brake master cylinder problem can reduce or remove rear braking.", fix="Dealer inspects and replaces the rear master cylinder free.", src="https://vehiclesafetyrecalls.com/recall/15V142000"),
           dict(id="18V416", years="2017-2018", what="Air may be left in the ABS after assembly, reducing braking.", fix="Free dealer repair.", src="https://www.motorcyclepowersportsnews.com/indian-motorcycle-to-recall-certain-scout-motorcycles/"),
           dict(id="19E007", years="2015-2019 with accessory brake lever", what="Accessory brake lever adjuster set wrong can make the front brake drag.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/indian/scout/2015/19e007000"),
           dict(id="22V837", years="2021-2022", what="Fuel pump can fail and stall the engine.", fix="Free dealer repair.", src="https://vehicleflaws.com/recall/22V837000"),
           dict(id="24V970", years="2025", what="Display may show neutral when the bike is in gear.", fix="Free dealer software update.", src="https://www.vehiclesafetyrecalls.com/recall/24V970000")],
  known=[], forums=[INDF]))

B30.append(dict(id="indian-chief-2014", make="Indian", model="Chief (Thunder Stroke 111)", name="Indian Chief (2014-on)", years=[2014, 2026],
  match=["indian chief", "chief classic", "chief vintage", "chief dark horse", "chieftain", "springfield", "roadmaster", "thunder stroke"], style="cruiser", drive="belt",
  engine="1811 cc air/oil-cooled Thunder Stroke 111 V-twin (116 from 2020), fuel injected, belt drive",
  intro="The modern Chief family. The Thunder Stroke 111 bikes had several recalls, including a fuel rail recall on 2014-2017 bikes.",
  focus=[["Thunder Stroke V-twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Fuel rail recall", "2014-2017"], ["Belt drive", "Check for cracks"], ["Lighting recalls", "2014"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2014-2016 Thunder Stroke bikes are in recall 16V446 (misfire can overheat the exhaust). 2014-2017 bikes are in recall 16V877 (fuel rail can leak). 2014 Chiefs are in recall 19V339 (headlight). 2014-2019 bikes are in recall 19V776 (gear position switch). Some 2014 Chiefs are also in recall 22V635 (headlight software).", reason="A fuel leak is a fire risk. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="16V446", years="2014-2016 (some)", what="An ignition misfire can overheat the exhaust and create a fire risk.", fix="Free dealer repair.", src="https://static.nhtsa.gov/odi/rcl/2016/RCLRPT-16V446-1614.PDF"),
           dict(id="16V877", years="2014-2017", what="Fuel rail may leak fuel.", fix="Free dealer repair.", src="https://www.motorcyclistonline.com/indian-recalls-23746-late-model-motorcycles-for-potential-fuel-leak"),
           dict(id="19V339", years="2014", what="Forward lighting may go out.", fix="Free dealer repair.", src="https://static.nhtsa.gov/odi/rcl/2019/RCONL-19V339-1937.pdf"),
           dict(id="19V776", years="2014-2019", what="Gear position switch problem.", fix="Free dealer repair.", src="https://vehicleflaws.com/vehicle/indian/chieftain/2014"),
           dict(id="22V635", years="2014 Chief (some)", what="Headlight control software problem.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/indian/chief/2014/22v635000")],
  known=[], forums=[INDF]))

B30.append(dict(id="vespa-px150-p200e-1977", make="Vespa", model="PX / P200E", name="Vespa PX / P series", years=[1977, 2017],
  match=["vespa px", "px150", "px200", "p200e", "p125x", "p150x", "vespa p200", "px125", "vespa p series"], style="scooter", drive="belt",
  engine="123-198 cc air-cooled two-stroke single, carb, four-speed hand-shift gearbox",
  intro="The classic geared Vespa. A two-stroke with a twist-grip gear change and a steel body that rusts underneath.",
  focus=[["Two-stroke single", "Air-cooled"], ["Carb", "Dell'Orto"], ["Hand shift", "Cables"], ["Steel body", "Floor rust"], ["Oil", "Premix or autolube"]],
  remove=CARB + AIR + ["H-003"], patch={},
  add=[step("X-VPX-01", "E", "E-002", "Check the floor and frame for rust", "Look under the floor mat, along the runners and under the engine cowls. The steel body is the frame, so rust here is structural.", "Vespa bodies are monocoque, and floor rust is the classic killer.", "Owner experience", hours=0.5),
       step("X-VPX-02", "G", "G-004", "Check the oil supply", "Find out if it is premix or has autolube. On autolube bikes, check the oil tank and pump line. On premix, mix fuel and oil at the ratio for your model.", "A two-stroke with no oil seizes quickly.", "Two-stroke basics", hours=0.5)],
  lessons={"J": ["Gear and clutch cables run from the left grip. Adjust them together so the gears select cleanly."]},
  recalls=[], recallNote=OLD, known=[], forums=[dict(name="Modern Vespa", url="https://www.modernvespa.com/forum/", what="Owner forum for Vespa scooters, classic and modern.")]))

B30.append(dict(id="bsa-a65-lightning-thunderbolt-1962", make="BSA", model="A65 Lightning / Thunderbolt", name="BSA A65 (Lightning, Thunderbolt, Spitfire)", years=[1962, 1972],
  match=["a65", "bsa a65", "lightning", "thunderbolt", "spitfire", "firebird scrambler", "bsa lightning", "bsa thunderbolt", "a50"], style="standard", drive="chain",
  engine="654 cc air-cooled OHV unit-construction parallel twin, one or two Amal carbs, points ignition",
  intro="BSA's unit 650 twin. Amal carbs, points, Lucas electrics and a timing-side main bearing that needs checking.",
  focus=[["650 twin", "Air-cooled"], ["Amal carbs", "Wear in the slides"], ["Points ignition", "Gap and timing"], ["Timing-side bush", "Check it"], ["Electrics", "Lucas"]],
  remove=CARB + AIR, patch={},
  add=[step("X-A65-01", "B", "B-004", "Check the bottom end before a full rebuild", "Check oil pressure and listen for knocking at the timing side. Ask about the timing-side main bush and whether it has been converted to a bearing.", "The A65's timing-side plain bush is a known weak point when worn.", "Classic BSA practice", skill="Advanced", hours=1.0)],
  lessons={"G": ["Lightnings run twin Amals. Thunderbolts run one. Check what you have before buying parts."]},
  recalls=[], recallNote=OLD, known=[], forums=[dict(name="BSA Owners Club", url="https://www.bsaoc.org/", what="Club for BSA owners.")]))

HERO_NAME_B30 = {"ktm-950-990-adventure-2003": "990 ADVENTURE", "royal-enfield-classic-350-500-2009": "CLASSIC 350", "royal-enfield-bullet-500-1955": "BULLET",
  "royal-enfield-continental-gt-650-2019": "CONTINENTAL GT", "moto-guzzi-v7-2008": "V7", "moto-guzzi-850-le-mans-1976": "LE MANS",
  "indian-scout-2015": "SCOUT", "indian-chief-2014": "CHIEF", "vespa-px150-p200e-1977": "VESPA PX", "bsa-a65-lightning-thunderbolt-1962": "A65"}
