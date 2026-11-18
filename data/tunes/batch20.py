"""Batch 20 bike tunes (top 500, rows 191-200)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch19 import SPLINE, UKGS
B20 = []
KBK = dict(name="BMW Motorcycle Tech (Snowbum)", url="https://bmwmotorcycletech.info/", what="Long-running technical notes for classic BMW K and R bikes.")
TRF = dict(name="The Triumph Forum", url="https://www.thetriumphforum.com/", what="Owner forum for modern and classic Triumphs.")
INJ_RECALL = dict(id="14V694", years="2014-2015 (some, Feb-Aug 2014 build)", what="Fuel injector may activate when it shouldn't.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/14V694000")

B20.append(dict(id="bmw-g310gs-2017", make="BMW", model="G310GS", name="BMW G310GS", years=[2017, 2026],
  match=["g310gs", "g 310 gs", "g310 gs"], style="adventure", drive="chain",
  engine="313 cc liquid-cooled single, fuel injected",
  intro="BMW's small adventure single. Early bikes had side stand and brake caliper recalls.",
  focus=[["313 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Side stand recall", "2018"], ["Caliper recall", "2018-2020"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2018 G310GS bikes are in recall 18V408 (side stand and frame). 2018-2020 bikes are in recall 19V593 (brake calipers may corrode).", reason="Both fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="18V408", years="2018", what="Repeated side stand use can damage the stand and the frame, and the bike may fall over.", fix="Dealer fits a reinforcement plate and new stand, or replaces the frame, free.", src="https://vehiclesafetyrecalls.com/recall/18V408000"),
           dict(id="19V593", years="2018-2020", what="Front and rear brake calipers may corrode and stick or drag.", fix="Dealer replaces the calipers free.", src="https://auto-recalls.justia.com/bmw/g310-gs/2018/19v593000")],
  known=[], forums=[]))

B20.append(dict(id="bmw-r-ninet-2014", make="BMW", model="R nineT", name="BMW R nineT", years=[2014, 2026],
  match=["r ninet", "r nine t", "rninet", "r9t", "r ninet scrambler", "r ninet pure", "r ninet racer", "r ninet urban gs"], style="standard", drive="shaft",
  engine="1170 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  intro="BMW's retro boxer. Early bikes had a swingarm pivot bolt recall. Grease the drive splines.",
  focus=[["1170 cc boxer", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Swingarm recall", "2014-2017"], ["Shaft drive", "Splines"], ["Brakes", "Fluid cap recall"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2014-2017 bikes are in recall 17V502 (swingarm pivot pin bolts may loosen). Some 2018-2020 bikes are in recall 20V166 (brake fluid reservoir cap).", reason="Both fixes are free.")},
  add=[SPLINE], lessons={},
  recalls=[dict(id="17V502", years="2014-2017", what="Right-side swingarm pivot pin bolts may loosen.", fix="Dealer cleans and refits the bolts free.", src="https://vehiclesafetyrecalls.com/recall/17V502000"),
           dict(id="20V166", years="2018-2020 (some)", what="Brake fluid reservoir cap problem.", fix="Dealer replaces the cap free.", src="https://recallcheck.net/recall/20V166000")],
  known=[], forums=[]))

B20.append(dict(id="bmw-k75-k100-1983", make="BMW", model="K75/K100", name="BMW K75 / K100", years=[1983, 1995],
  match=["k75", "k100", "k 75", "k 100", "k75s", "k75c", "k75rt", "k100rs", "k100rt", "k100lt", "flying brick"], style="standard", drive="shaft",
  engine="740 cc triple (K75) or 987 cc four (K100), liquid-cooled, fuel injected, shaft drive",
  intro="BMW's flying brick. The in-tank fuel pump, the oil/water pump and the splines are the usual jobs.",
  focus=[["Laid-down engine", "Liquid-cooled"], ["Fuel injected", "In-tank pump"], ["Oil/water pump", "Rebuild"], ["Splines", "Lube them"], ["Side stand switch", "Kills the pump"]],
  remove=EFI, patch={},
  add=[step("X-KB-01", "G", "G-004", "Renew the in-tank fuel parts", "Pull the fuel pump, its rubber mounts, the hoses and the float. Replace anything that has gone hard or soft. Use hose rated for submerged EFI use.", "Old fuel kills the pump rubbers and hoses. These are the classic K-bike failures after storage.", "BMW MOA forum", hours=2.0),
       SPLINE],
  lessons={"F": ["If the fuel pump won't run, check the side stand switch first. It is in the pump relay circuit."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Trouble spots", what="After the fuel system, the rear crank O-ring and the oil/water pump are the historic trouble spots. They need renewing every decade or two.", src="https://forums.bmwmoa.org/goto/post?id=1326598")],
  forums=[KBK]))

B20.append(dict(id="triumph-bonneville-2001", make="Triumph", model="Bonneville (air-cooled 865)", name="Triumph Bonneville (air-cooled)", years=[2001, 2015],
  match=["bonneville", "bonneville t100", "bonneville se", "bonneville 865", "bonneville 790", "bonnie"], style="standard", drive="chain",
  engine="790 or 865 cc air/oil-cooled DOHC parallel twin, carbs (to 2007) or fuel injected",
  intro="The modern air-cooled Bonnie. Early ones have carbs, later ones are fuel injected. Some 2014-2015 bikes had an injector recall.",
  focus=[["Parallel twin", "Air/oil-cooled"], ["Carb or EFI", "Depends on year"], ["2014-15 recall", "Injectors"], ["Chain drive", "Slack and lube"], ["Oil cooler", "Check unions"]],
  remove=AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2014-2015 Bonnevilles built Feb-Aug 2014 are in recall 14V694 for the fuel injectors.", reason="The fix is free.")},
  add=[], lessons={"G": ["2001-2007 bikes have carbs. Later ones are fuel injected. Skip the steps that don't match your bike."]},
  recalls=[INJ_RECALL],
  known=[dict(title="Carbs then EFI", what="Early 2001-2007 bikes are carbureted. Later bikes are fuel injected.", src="https://motoryk.com/blog/2026-04-20-used-triumph-bonneville-buying-guide-classic-style-modern-re")],
  forums=[TRF]))

B20.append(dict(id="triumph-thruxton-1200-2016", make="Triumph", model="Thruxton 1200", name="Triumph Thruxton 1200", years=[2016, 2026],
  match=["thruxton 1200", "thruxton r", "thruxton 1200r", "thruxton rs"], style="cafe", drive="chain",
  engine="1200 cc liquid-cooled parallel twin, fuel injected",
  intro="Triumph's modern cafe racer. Bikes with the accessory cafe fairing had a wiring recall.",
  focus=[["1200 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fairing recall", "Accessory fairing"], ["Chain drive", "Slack and lube"], ["Electronics", "Updates"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2016-2018 bikes fitted with the accessory cafe racer fairing are in recall 19E029 because the fairing can damage the wiring.", reason="Damaged wiring can kill the lights or stall the engine. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="19E029", years="2016-2018 (with accessory fairing)", what="The accessory cafe fairing may damage the wiring, causing loss of lights or a stall.", fix="Dealer replaces the wire conduits free.", src="https://vehiclesafetyrecalls.com/recall/19E029000")],
  known=[], forums=[TRF]))

B20.append(dict(id="triumph-speed-triple-1050-2005", make="Triumph", model="Speed Triple 1050", name="Triumph Speed Triple 1050", years=[2005, 2015],
  match=["speed triple", "speed triple 1050", "speed triple r", "speedie"], style="standard", drive="chain",
  engine="1050 cc liquid-cooled inline triple, fuel injected",
  intro="The classic streetfighter triple. The regulator/rectifier and the clocks are the known weak spots.",
  focus=[["1050 cc triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Charging", "R/R known weak"], ["Clocks", "Water gets in"], ["Starter sprag", "Check"]],
  remove=EFI, patch={},
  add=[step("X-ST1-01", "F", "F-002", "Test the regulator/rectifier", "Check battery voltage at idle and at 5,000 rpm. Look at the R/R connector for heat damage. Replace with a better unit if it is weak.", "The regulator/rectifier is a known weak spot on Speed Triples.", "Kiwi Rider long-term test", hours=1.0)],
  lessons={"F": ["Avoid jet washing near the clocks. The 1050 clocks are known to fail."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Regulator/rectifier", what="The regulator/rectifier is a known weak spot on Speed Triples.", src="https://kiwirider.co.nz/kiwi-rider-december-2020-vol1/0353186001606795730/p48")],
  forums=[TRF]))

B20.append(dict(id="triumph-tiger-800-2011", make="Triumph", model="Tiger 800", name="Triumph Tiger 800", years=[2011, 2019],
  match=["tiger 800", "tiger 800 xc", "tiger 800 xcx", "tiger 800 xrx", "tiger 800 xr"], style="adventure", drive="chain",
  engine="800 cc liquid-cooled inline triple, fuel injected",
  intro="A popular mid-size adventure triple. Early and 2014-2015 bikes had engine management and injector recalls.",
  focus=[["800 cc triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "2011-12, 2014-15"], ["Chain drive", "Slack and lube"], ["Off-road wear", "Bearings"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2011-2012 bikes are in recall 11V434 (engine management software). Some 2014-2015 bikes are in recall 14V694 (fuel injectors).", reason="Both fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="11V434", years="2011-2012 (some)", what="Engine management software problem.", fix="Free dealer repair (Triumph recall 431).", src="https://www.vehiclesafetyrecalls.com/recall/11V434000"), INJ_RECALL],
  known=[], forums=[TRF]))

B20.append(dict(id="triumph-trident-t150-1968", make="Triumph", model="Trident T150", name="Triumph Trident T150", years=[1968, 1975],
  match=["trident", "t150", "t150v", "t160", "trident t150", "rocket 3"], style="standard", drive="chain",
  engine="740 cc air-cooled OHV triple, three carbs, points ignition",
  intro="Triumph's 1969 triple. Clean carbs and points, and a clutch that fully releases, make it a good bike.",
  focus=[["740 cc triple", "Air-cooled"], ["Three carbs", "Clean and sync"], ["Points", "Set and time"], ["Clutch", "Hard to find neutral"], ["Gearbox", "Four or five speed"]],
  remove=CARB + AIR, patch={},
  add=[step("X-T15-01", "H", "H-005", "Set up the clutch release", "Adjust the clutch so it fully releases. Check the clutch bearing.", "A clutch that doesn't fully release makes neutral hard to find, a common Trident problem.", "Greg Marsh T150V notes", hours=1.0)],
  lessons={"E": ["Early T150s are four-speed. The T150V from 1972 is five-speed, and a front disc came in 1973."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Neutral", what="It is a common Trident problem to struggle to find neutral when the clutch doesn't fully release.", src="https://gregmarsh.com/mc/Triumph/T150VJJ.aspx")],
  forums=[]))

B20.append(dict(id="ktm-390-duke-2013", make="KTM", model="390 Duke", name="KTM 390 Duke", years=[2013, 2026],
  match=["390 duke", "duke 390", "ktm 390", "390duke"], style="standard", drive="chain",
  engine="373 or 399 cc liquid-cooled single, fuel injected",
  intro="A light, fun single. Several recent model years have throttle, fuel cap and ECU recalls.",
  focus=[["Single cylinder", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Recalls", "2022-2025"], ["Chain drive", "Slack and lube"], ["Valves", "Check on time"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2022-2023 bikes are in recall 26V196 (water in the e-throttle can cause loss of drive). 2024 bikes are in recall 25V740 (fuel cap seal leak). 2024-2025 bikes are in recall 25V825 (loss of drive power).", reason="Losing drive in traffic is dangerous. The fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="26V196", years="2022-2023 (some)", what="Water may enter the e-throttle unit and cause loss of drive power. Expands recall 25V598.", fix="Dealer replaces the throttle assembly free.", src="https://www.vehiclesafetyrecalls.com/recall/26V196000"),
           dict(id="25V740", years="2024 (some)", what="Fuel filler cap seal may crack and leak fuel.", fix="Free dealer repair.", src="https://www.vehiclesafetyrecalls.com/recall/25V740000"),
           dict(id="25V825", years="2024-2025 (some)", what="Loss of drive power.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/25V825000")],
  known=[], forums=[]))

B20.append(dict(id="ktm-690-enduro-r-2008", make="KTM", model="690 Enduro R", name="KTM 690 Enduro R", years=[2008, 2026],
  match=["690 enduro", "690 enduro r", "ktm 690", "690r"], style="dualsport", drive="chain",
  engine="654 or 690 cc liquid-cooled single, fuel injected",
  intro="A powerful single-cylinder dual-sport. Fuel pump failures are the most reported problem.",
  focus=[["Big single", "Liquid-cooled"], ["Fuel injected", "In-tank pump"], ["Fuel pump", "Common failure"], ["Water pump", "Seal weeps"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={},
  add=[step("X-690-01", "G", "G-004", "Check the fuel pump and filter", "Check fuel pressure and the in-tank filter. Look for black residue in the tank from a worn pump. Don't run the tank dry.", "Fuel pump failure is one of the most common 690 problems, and a dying pump can clog the filter and injector.", "Engine Patrol 690 notes", hours=1.5)],
  lessons={}, recalls=[], recallNote=VIN,
  known=[dict(title="Fuel pump", what="Fuel pump failure is one of the most common 690 Enduro R problems.", src="https://enginepatrol.com/?p=7910")],
  forums=[]))

HERO_NAME_B20 = {"bmw-g310gs-2017": "G310GS", "bmw-r-ninet-2014": "R NINET", "bmw-k75-k100-1983": "K100", "triumph-bonneville-2001": "BONNEVILLE",
  "triumph-thruxton-1200-2016": "THRUXTON", "triumph-speed-triple-1050-2005": "SPEED TRIPLE", "triumph-tiger-800-2011": "TIGER 800",
  "triumph-trident-t150-1968": "TRIDENT", "ktm-390-duke-2013": "390 DUKE", "ktm-690-enduro-r-2008": "690 ENDURO"}
