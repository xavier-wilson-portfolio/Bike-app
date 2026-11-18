"""Batch 28 bike tunes (top 500, rows 271-280)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch19 import UKGS, SPLINE
from batch20 import TRF, KBK
from batch27 import BMWNOTE, MOA
B28 = []
BMW_BRAKELIGHT = dict(id="20V146", years="2020 (some)", what="Emergency stop signal can make the brake light flash instead of staying on.", fix="Dealer reprograms the emergency stop signal free.", src="https://auto-recalls.justia.com/bmw/f850gs/2020/20v146000")
TRI_ALT = dict(id="24V785", years="2022 Street models, 2022-2024 Bonnevilles, 2023-2024 Scrambler 900 and Speed Twin 900 (some)", what="Alternator wiring may short and overheat.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/24V785000")
TRI_ALT2 = dict(id="26V078", years="2022 Street models, 2022-2024 Bonnevilles, 2023-2024 Scrambler 900 and Speed Twin 900 (some)", what="Alternator or regulator problem on the same range of bikes.", fix="Free dealer repair.", src="https://static.nhtsa.gov/odi/rcl/2026/RCAK-26V078-6564.pdf")

B28.append(dict(id="bmw-s1000rr-2010", make="BMW", model="S1000RR", name="BMW S1000RR", years=[2010, 2026],
  match=["s1000rr", "s 1000 rr", "s1000 rr", "m1000rr"], style="sport", drive="chain",
  engine="999 cc liquid-cooled inline four, fuel injected",
  intro="BMW's superbike. Several recalls, from 2012 connecting rod bolts to a 2026 ignition lock recall on 2020-on bikes.",
  focus=[["999 cc four", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Recalls", "Several years"], ["Chain drive", "Slack and lube"], ["Valves", "Finger followers"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Some 2012 bikes are in recall 12V177 (connecting rod bolts). Some 2020 bikes are in recall 20V146 (brake light). 2022 bikes are in recall 22V752 (clutch cover bolts). Some 2023 bikes are in recall 23V123 (brake lever). 2020-2026 bikes are in recall 26V478 (ignition lock can fail and stall the engine).", reason="A loose rod bolt or a stall at speed is serious. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="12V177", years="2012 (Sep 2011-Apr 2012 build)", what="Connecting rod bolts problem.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/12V177000"),
           BMW_BRAKELIGHT,
           dict(id="22V752", years="2022", what="Clutch cover bolts were not lubricated, so the cover can loosen and leak oil.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/22V752000"),
           dict(id="23V123", years="2023 (some)", what="Hand brake lever problem can reduce braking.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/bmw/s-1000-rr/2023/23v123000"),
           dict(id="26V478", years="2020-2026", what="Ignition lock may fail and stall the engine.", fix="Free dealer repair.", src="https://www.carwhere.com/recalls/campaign/26V478000")],
  known=[], forums=[MOA]))

B28.append(dict(id="bmw-r80g-s-1980", make="BMW", model="R80G/S", name="BMW R80G/S", years=[1980, 1987],
  match=["r80g/s", "r80gs", "r 80 g/s", "r80 g/s", "paris dakar", "r80 gs", "g/s"], style="adventure", drive="shaft",
  engine="798 cc air-cooled boxer twin, two carbs, Monolever shaft drive",
  intro="The first GS. An airhead boxer with the single-sided Monolever. Check the splines and the final drive.",
  focus=[["798 cc boxer", "Air-cooled"], ["Two carbs", "Bing CV"], ["Monolever", "Single-sided"], ["Shaft drive", "Splines"], ["Charging", "Diode board"]],
  remove=CARB + AIR, patch={}, add=[SPLINE],
  lessons={"G": ["The Bing carbs need their diaphragms checked and the two sides balanced after any work."]},
  recalls=[], recallNote=OLD, known=[], forums=[UKGS, KBK]))

B28.append(dict(id="bmw-f750gs-f850gs-2018", make="BMW", model="F750GS / F850GS", name="BMW F750GS / F850GS", years=[2018, 2026],
  match=["f750gs", "f850gs", "f 750 gs", "f 850 gs", "f850gs adventure", "f850 gsa"], style="adventure", drive="chain",
  engine="853 cc liquid-cooled parallel twin, fuel injected",
  intro="BMW's middleweight parallel-twin GS. Some 2020 bikes are in a brake light recall.",
  focus=[["853 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Brake light", "2020 recall"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2020 F750GS and F850GS bikes are in recall 20V146 (brake light flashes under hard braking).", reason="The fix is free.")},
  add=[], lessons={}, recalls=[BMW_BRAKELIGHT], known=[], forums=[UKGS]))

B28.append(dict(id="bmw-r1200c-1997", make="BMW", model="R1200C", name="BMW R1200C", years=[1997, 2004],
  match=["r1200c", "r 1200 c", "r1200 c", "r1200cl", "r1200c montauk", "r1200c independent"], style="cruiser", drive="shaft",
  engine="1170 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  intro="BMW's boxer cruiser. Shaft drive, Telelever front and the usual oilhead jobs.",
  focus=[["1170 cc boxer", "Air/oil-cooled"], ["Fuel injected", "Throttle bodies"], ["Shaft drive", "Splines"], ["Telelever", "Check ball joint"], ["Charging", "Check alternator belt"]],
  remove=EFI + AIR, patch={}, add=[SPLINE],
  lessons={"G": ["Balance the two throttle bodies after any work on them."]},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B28.append(dict(id="triumph-bonneville-t120-1959", make="Triumph", model="Bonneville T120 (pre-unit and unit)", name="Triumph Bonneville T120 (1959-1975)", years=[1959, 1975],
  match=["t120", "t120r", "bonneville 650", "t120v", "bonneville 1960s"], style="standard", drive="chain",
  engine="649 cc air-cooled OHV parallel twin, two carbs, points ignition",
  intro="The classic Bonneville. Twin Amal carbs, points, and a lot of oil seeping out of places it shouldn't.",
  focus=[["Parallel twin", "Air-cooled"], ["Twin Amals", "Wear in the slides"], ["Points ignition", "Gap and timing"], ["Oil-in-frame", "1971-on"], ["Electrics", "Lucas"]],
  remove=CARB + AIR, patch={},
  add=[step("X-T12-01", "G", "G-004", "Check the Amal carb slides and bodies for wear", "Pull the slides and check for side-to-side play in the bodies. Worn Amals let air past and make the idle hunt. New or resleeved bodies fix it.", "Amal carbs wear their slides and bores, and a rebuild kit alone won't cure that.", "Classic Triumph practice", hours=1.0)],
  lessons={"H": ["From 1971 the oil lives in the frame. Check the level the way the manual says for your year."]},
  recalls=[], recallNote=OLD, known=[], forums=[TRF]))

B28.append(dict(id="triumph-street-twin-speed-twin-900-2016", make="Triumph", model="Street Twin / Speed Twin 900", name="Triumph Street Twin / Speed Twin 900", years=[2016, 2026],
  match=["street twin", "speed twin 900", "street cup", "street twin goldline", "speed twin 900 2023"], style="standard", drive="chain",
  engine="900 cc liquid-cooled parallel twin, fuel injected",
  intro="Triumph's modern 900 twin. Several wiring and alternator recalls across the years.",
  focus=[["900 cc twin", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Wiring recalls", "Several years"], ["Chain drive", "Slack and lube"], ["Charging", "Alternator recalls"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Some 2016 bikes are in recall 16V163 (wiring). 2016-2018 bikes also had a wider wiring recall. 2019-2020 bikes are in recall 20V472 (misrouted harness). 2022 bikes and 2023-on Speed Twin 900s are in recalls 24V785 and 26V078 (alternator wiring).", reason="Wiring faults can stall the engine or cause a fire. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="16V163", years="2016 (Sep-Nov 2015 build)", what="Wiring problem.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/triumph/street-twin/2016/16v163000"),
           dict(id="20V472", years="2019-2020", what="Wiring harness may be misrouted and get damaged against the headstock.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/20V472000"),
           TRI_ALT, TRI_ALT2],
  known=[], forums=[TRF]))

B28.append(dict(id="triumph-scrambler-900-1200-2006", make="Triumph", model="Scrambler 900 / 1200", name="Triumph Scrambler 900 / 1200", years=[2006, 2026],
  match=["triumph scrambler", "scrambler 900", "scrambler 1200", "street scrambler", "scrambler 1200 xe", "scrambler 1200 xc", "scrambler 865"], style="standard", drive="chain",
  engine="865 cc air/oil-cooled twin (2006-2016), or 900 or 1200 cc liquid-cooled twin (2017-on)",
  intro="Triumph's scrambler line. Early bikes share the air-cooled Bonneville engine, later ones the liquid-cooled 900 and 1200.",
  focus=[["Parallel twin", "Air or liquid"], ["Carb or EFI", "Early or late"], ["High pipes", "Heat shields"], ["Chain drive", "Slack and lube"], ["Charging", "Alternator recalls"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2019-2020 Street Scramblers are in recall 20V472 (misrouted harness). 2022 Street Scramblers and 2023-2024 Scrambler 900s are in recalls 24V785 and 26V078 (alternator wiring).", reason="Every fix is free.")},
  add=[], lessons={"G": ["2006-2007 bikes have carbs. Later ones are fuel injected. Skip the steps that don't match."], "H": ["2006-2016 bikes are air/oil-cooled and have no coolant to change."]},
  recalls=[dict(id="20V472", years="2019-2020 Street Scrambler", what="Wiring harness may be misrouted and get damaged against the headstock.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/20V472000"),
           TRI_ALT, TRI_ALT2],
  known=[], forums=[TRF]))

B28.append(dict(id="triumph-rocket-iii-2004", make="Triumph", model="Rocket III / Rocket 3", name="Triumph Rocket III / Rocket 3", years=[2004, 2026],
  match=["rocket iii", "rocket 3", "rocket iii touring", "rocket 3 r", "rocket 3 gt", "rocket iii roadster"], style="cruiser", drive="shaft",
  engine="2294 or 2458 cc liquid-cooled inline triple, fuel injected, shaft drive",
  intro="The biggest production motorcycle engine. Shaft drive, huge torque and several brake recalls on the new Rocket 3.",
  focus=[["Huge triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Rear brake", "Recalls 2020-2024"], ["Shaft drive", "Final drive oil"], ["Tires", "Heavy wear"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Some 2005 bikes are in recall 05V004 (final drive unit). 2006 bikes are in recall 06V063 (handlebar clamp bolts). 2020-2021 Rocket 3s are in recall 20V740 (air in the ABS modulator). 2020-2024 Rocket 3s are in recall 23V730 (rear brake master cylinder).", reason="Brake and final drive faults are crash risks. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="05V004", years="2005 (some)", what="Final drive unit problem.", fix="Dealer replaces the final drive unit free.", src="https://auto-recalls.justia.com/triumph/rocket-iii/2005/05v004000"),
           dict(id="06V063", years="2006 (some)", what="Handlebar clamp bolts may not be tight.", fix="Dealer checks and tightens the clamp bolts free.", src="https://auto-recalls.justia.com/triumph/rocket-iii/2006/06v063000"),
           dict(id="20V740", years="2020-2021 Rocket 3", what="Air in the ABS modulator can reduce rear braking.", fix="Dealer flushes and replaces the rear brake fluid free.", src="https://auto-recalls.justia.com/triumph/rocket-3-r/2020/20v740000"),
           dict(id="23V730", years="2020-2024 Rocket 3", what="Rear brake master cylinder problem can lengthen stopping distance.", fix="Free dealer repair.", src="https://carcomplaintdata.com/recalls/23V730000")],
  known=[], forums=[TRF]))

B28.append(dict(id="triumph-daytona-675-2006", make="Triumph", model="Daytona 675", name="Triumph Daytona 675", years=[2006, 2017],
  match=["daytona 675", "daytona 675r", "675r", "d675"], style="sport", drive="chain",
  engine="675 cc liquid-cooled inline triple, fuel injected",
  intro="Triumph's triple-cylinder sport bike. The 2006-2009 regulator/rectifier recall is the one to check first.",
  focus=[["675 cc triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["R/R recall", "2006-2009"], ["Recalls", "Several years"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2006-2009 bikes are in recall 12V445 (regulator/rectifier). Some 2011-2012 bikes are in recall 13V032 (wheel bearings). 2012-2013 bikes are in recalls 13V104 (turn signal stems), 13V215 (throttle cables, 2012) and 13V319 (ABS). Some 2014-2015 675Rs are in recall 15V255 (rear shock).", reason="Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="12V445", years="2006-2009", what="Regulator/rectifier can overheat and stop charging.", fix="Dealer fits a Shindengen regulator/rectifier free.", src="https://recallcheck.net/recall/12V445000"),
           dict(id="13V032", years="2011-2012 (some)", what="Wheel bearings of unknown quality may fail early.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/13V032000"),
           dict(id="13V104", years="2012-2013", what="Turn signal stems may break.", fix="Dealer replaces the stems free.", src="https://vehiclesafetyrecalls.com/recall/13V104000"),
           dict(id="13V215", years="2012 (Jul-Oct build)", what="Throttle cables may be routed so they hinder the throttle.", fix="Dealer fits a throttle cable guide free.", src="https://vehiclesafetyrecalls.com/recall/13V215000"),
           dict(id="13V319", years="2012-2013 with ABS", what="ABS may malfunction and let the wheels lock.", fix="Dealer replaces the ABS modulator free.", src="https://vehiclesafetyrecalls.com/recall/13V319000"),
           dict(id="15V255", years="2014-2015 Daytona 675R", what="Rear shock damping rod nut may loosen.", fix="Dealer replaces the rear shock free.", src="https://vehiclesafetyrecalls.com/recall/15V255000")],
  known=[], forums=[dict(name="Triumph675.net", url="https://www.triumph675.net/", what="Owner forum for the Daytona 675 and Street Triple.")]))

B28.append(dict(id="triumph-tiger-1050-explorer-1200-2007", make="Triumph", model="Tiger 1050 / Tiger Explorer 1200", name="Triumph Tiger 1050 / Tiger Explorer 1200", years=[2007, 2021],
  match=["tiger 1050", "tiger explorer", "explorer 1200", "tiger 1200", "tiger 1200 xc", "tiger 1200 xr", "tiger sport 1050", "tiger xcx", "tiger xrt"], style="adventure", drive="shaft",
  engine="1050 cc triple (Tiger 1050, chain) or 1215 cc triple (Explorer and Tiger 1200, shaft), liquid-cooled, fuel injected",
  intro="Triumph's big triples. The Tiger 1050 is a road bike with a chain, the Explorer and Tiger 1200 have shaft drive.",
  focus=[["Triple", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire on 1200"], ["Recalls", "Explorer and 1200"], ["Chain or shaft", "Depends on model"], ["Charging", "Check R/R"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2012-2014 Tiger Explorers are in recall 14V009 (throttle signal can shut the engine down). 2018-2020 Tiger 1200s are in recall 20V236 (front brake pads may corrode and lose their friction material).", reason="An engine shutdown or failing pads is a crash risk. Both fixes are free.")},
  add=[], lessons={"E": ["The Tiger 1050 has a chain. The Explorer and Tiger 1200 have shaft drive. Skip the steps that don't match."]},
  recalls=[dict(id="14V009", years="2012-2014 Tiger Explorer (some)", what="Throttle position signal fault can shut the engine down.", fix="Free dealer repair.", src="https://www.vehiclesafetyrecalls.com/recall/14V009000"),
           dict(id="20V236", years="2018-2020 Tiger 1200", what="Front brake pads may corrode and the friction material can come off the backing plate.", fix="Dealer replaces the front pads free.", src="https://carcomplaintdata.com/recalls/20v236000")],
  known=[], forums=[TRF]))

HERO_NAME_B28 = {"bmw-s1000rr-2010": "S1000RR", "bmw-r80g-s-1980": "R80G/S", "bmw-f750gs-f850gs-2018": "F850GS", "bmw-r1200c-1997": "R1200C",
  "triumph-bonneville-t120-1959": "BONNEVILLE", "triumph-street-twin-speed-twin-900-2016": "STREET TWIN", "triumph-scrambler-900-1200-2006": "SCRAMBLER",
  "triumph-rocket-iii-2004": "ROCKET III", "triumph-daytona-675-2006": "DAYTONA 675", "triumph-tiger-1050-explorer-1200-2007": "TIGER"}
