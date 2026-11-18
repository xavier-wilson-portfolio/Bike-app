"""Batch 11 bike tunes (top 500, rows 101-110)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B11 = []
HONDA_CHG = dict(title="Charging system", what="The regulator/rectifier and stator connector run hot and fail on many 1990s-2000s Hondas.", src="https://motorandwheels.com/problems-with-honda-vt-1100-spirit-shadow/")
RR_STEP = lambda p, src: step(p, "F", "F-002", "Check the regulator/rectifier and stator plug", "Measure battery voltage at idle and at 5,000 rpm. Look for a melted or brown stator connector and a scorched regulator. Clean and solder the connections if needed.", "Hot connectors and a failing regulator are a common way these bikes stop charging.", src, hours=1.0)

B11.append(dict(id="honda-shadow-vt1100-1985", make="Honda", model="Shadow VT1100", name="Honda Shadow 1100", years=[1985, 2007],
  match=["shadow 1100", "vt1100", "shadow spirit", "shadow sabre", "shadow ace", "shadow aero 1100", "vt1100c"], style="cruiser", drive="shaft",
  engine="1099 cc liquid-cooled V-twin, carbs, shaft drive",
  intro="Honda's long-running 1100 cruiser. Very durable. Charging parts and gummed carbs are the usual trouble.",
  focus=[["1099 cc V-twin", "Liquid-cooled"], ["Carbs", "Gum up in storage"], ["Charging", "Stator plug and R/R"], ["Shaft drive", "Grease the splines"], ["Petcock", "Check for leaks"]],
  remove=CARB, patch={}, add=[RR_STEP("X-VT11-01", "Valkyrie Riders forum")],
  lessons={"E": ["Grease the driveshaft splines when the rear wheel is out. Dry splines wear out."]},
  recalls=[], recallNote=OLD, known=[HONDA_CHG], forums=[]))

B11.append(dict(id="honda-shadow-aero-750-2004", make="Honda", model="Shadow Aero 750", name="Honda Shadow Aero 750", years=[2004, 2016],
  match=["shadow aero", "shadow phantom", "shadow spirit 750", "aero 750"], style="cruiser", drive="shaft",
  engine="745 cc liquid-cooled V-twin, carb (to 2009) or fuel injection (2010 on), shaft drive",
  intro="A very common Honda cruiser. Check the bank angle sensor recall on 2010-2016 bikes.",
  focus=[["745 cc V-twin", "Liquid-cooled"], ["Carb or EFI", "EFI from 2010"], ["Recalls", "Fuel valve, sensor wire"], ["Shaft drive", "Final drive oil"], ["Charging", "Test the R/R"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2007-2008 VT750s were in recall 08V141 for a fuel valve that can drip fuel. 2010-2016 Shadow 750s were in recall 15V874 because the bank angle sensor wire can rub through and stall the engine.", reason="A stall or a fuel leak is a crash or fire risk. Repairs are free.")},
  add=[], lessons={"G": ["2004-2009 bikes have a carb. 2010 and later are fuel injected. Skip the steps that don't match your bike."]},
  recalls=[dict(id="15V874", years="2010-2016", what="Bank angle sensor wire can rub on the harness and stall the engine.", fix="Free dealer repair (Honda JW7).", src="https://www.motorcyclistonline.com/recall-news-honda-recalls-2010-2016-vt750-shadow-cruisers-for-potential-stalling-issue/"),
           dict(id="08V141", years="2007-2008 (some)", what="Fuel control valve diaphragm may drip fuel.", fix="Dealer replaces the diaphragm free.", src="https://thekneeslider.com/honda-recalls-vt600-vt750-vtx1300/")],
  known=[], forums=[]))

B11.append(dict(id="honda-vtx1300-2003", make="Honda", model="VTX1300", name="Honda VTX1300", years=[2003, 2009],
  match=["vtx1300", "vtx 1300", "vtx1300c", "vtx1300r", "vtx1300s", "vtx1300t"], style="cruiser", drive="shaft",
  engine="1312 cc liquid-cooled V-twin, carb, shaft drive",
  intro="Honda's mid-size power cruiser. Simple to own. Check the fuel valve recall on 2007-2008 bikes.",
  focus=[["1312 cc V-twin", "Liquid-cooled"], ["One carb", "Clean if stored"], ["Fuel valve recall", "2007-2008"], ["Shaft drive", "Final drive oil"], ["Charging", "Test the R/R"]],
  remove=CARB,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2007-2008 VTX1300s were in recall 08V141 because the fuel control valve diaphragm can drip fuel.", reason="Leaking fuel is a fire risk. The repair is free.")},
  add=[], lessons={},
  recalls=[dict(id="08V141", years="2007-2008 (some)", what="Fuel control valve diaphragm may drip fuel.", fix="Dealer replaces the diaphragm free.", src="https://thekneeslider.com/honda-recalls-vt600-vt750-vtx1300/")],
  known=[], forums=[]))

B11.append(dict(id="honda-vtx1800-2002", make="Honda", model="VTX1800", name="Honda VTX1800", years=[2002, 2008],
  match=["vtx1800", "vtx 1800", "vtx1800c", "vtx1800r", "vtx1800s", "vtx1800n", "vtx1800f", "vtx1800t"], style="cruiser", drive="shaft",
  engine="1795 cc liquid-cooled V-twin, fuel injected, shaft drive",
  intro="Honda's huge-torque cruiser. Check the rear wheel and final drive flange bearings, a common owner complaint.",
  focus=[["1795 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Rear flange bearings", "Wear early"], ["Shaft drive", "Final drive oil"], ["2002 recalls", "Swingarm, gearbox"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some early 2002 VTX1800s were recalled for a swingarm weld and a transmission circlip.", reason="Both can cause a crash. Repairs are free.")},
  add=[step("X-VTX18-01", "E", "E-002", "Check the rear wheel and final drive bearings", "With the rear wheel out, check the wheel bearings and the final drive flange bearing for roughness or play.", "Owners report worn flange bearings on these bikes, often found at a tire change.", "NHTSA owner complaints", hours=1.0)],
  lessons={}, recalls=[], recallNote=VIN,
  known=[dict(title="Rear flange bearings", what="Final drive flange and rear wheel bearings wear early on many VTX1800s.", src="https://vindecoder.site/makes/honda/vtx1800/2004")],
  forums=[]))

B11.append(dict(id="honda-cbr1000rr-2004", make="Honda", model="CBR1000RR", name="Honda CBR1000RR", years=[2004, 2016],
  match=["cbr1000rr", "cbr 1000rr", "fireblade", "cbr1000"], style="sport", drive="chain",
  engine="998 cc liquid-cooled inline four, fuel injected",
  intro="Honda's liter superbike. Check the fuel pump recall on 2008-2016 bikes and look for crash damage.",
  focus=[["998 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fuel pump recall", "2008-2016"], ["Crash damage", "Frame, subframe"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Many 2008-2016 CBR1000RRs are in recall 24V864 for a fuel pump that can fail and stall the engine.", reason="A stall at speed can cause a crash. The repair is free.")},
  add=[], lessons={"E": ["Check the frame spars, subframe and fairing mounts for scrapes and cracks."]},
  recalls=[dict(id="24V864", years="2008-2016 (some)", what="Fuel pump can fail and stall the engine.", fix="Dealer inspects and replaces the fuel pump free.", src="https://motorsportsnewswire.com/?p=195115")],
  known=[], forums=[]))

B11.append(dict(id="honda-cbr250r-2011", make="Honda", model="CBR250R", name="Honda CBR250R", years=[2011, 2013],
  match=["cbr250r", "cbr 250r", "cbr250"], style="sport", drive="chain",
  engine="249 cc liquid-cooled single, fuel injected",
  intro="A simple learner sport bike. Some owners report stalling when downshifting to a stop.",
  focus=[["249 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Stalling", "On downshift"], ["Chain drive", "Slack and lube"], ["Drops", "Check levers and pegs"]],
  remove=EFI, patch={}, add=[],
  lessons={"G": ["If it stalls when you pull the clutch to stop, check idle speed and the throttle body first."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Stalling on downshift", what="Owners have reported the engine dying when downshifting with the clutch in. NHTSA looked into it and closed the case.", src="https://vehicleflaws.com/vehicle/honda/cbr250r/2013")],
  forums=[]))

B11.append(dict(id="honda-cb1100-2013", make="Honda", model="CB1100", name="Honda CB1100", years=[2013, 2021],
  match=["cb1100", "cb 1100", "cb1100ex", "cb1100rs"], style="standard", drive="chain",
  engine="1140 cc air/oil-cooled DOHC inline four, fuel injected",
  intro="Honda's modern retro four. Very reliable. Mostly routine service.",
  focus=[["1140 cc four", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Valve clearances", "Screw adjusters"], ["Chain drive", "Slack and lube"], ["Chrome", "Check for pitting"]],
  remove=EFI + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[dict(name="CB1100 Community Forum", url="https://cb1100forum.net/forum/", what="Owner forum for the CB1100.")]))

B11.append(dict(id="honda-xr650l-1993", make="Honda", model="XR650L", name="Honda XR650L", years=[1993, 2026],
  match=["xr650l", "xr 650l", "xr650"], style="dualsport", drive="chain",
  engine="644 cc air/oil-cooled SOHC single, one carb",
  intro="A simple, tough big single. Keep the valves adjusted and expect to fix the lean stock jetting.",
  focus=[["644 cc single", "Air/oil-cooled"], ["One carb", "Lean from factory"], ["Valve clearances", "Check often"], ["Pulse generator", "Causes stalls"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={},
  add=[step("X-XR6-01", "H", "H-003", "Check valve clearances", "Set the valves to spec with the engine cold. The screw adjusters are easy to reach.", "Valves that drift out of clearance cause stalling and long-term damage.", "Motor and Wheels XR650L notes", hours=1.0)],
  lessons={"G": ["The stock carb runs lean. Backfiring on decel and poor throttle response usually mean it needs re-jetting."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Valves and stalling", what="Valves fall out of clearance and cause stalling. A failing pulse generator can too.", src="https://motorandwheels.com/problems-with-honda-xr600-650l/")],
  forums=[]))

B11.append(dict(id="honda-st1300-2003", make="Honda", model="ST1300", name="Honda ST1300", years=[2003, 2013],
  match=["st1300", "st 1300", "pan european", "st1300a"], style="touring", drive="shaft",
  engine="1261 cc liquid-cooled V4, fuel injected, shaft drive",
  intro="Honda's V4 sport tourer. Durable. Check the rear brake hose recall on 2008-2010 bikes.",
  focus=[["1261 cc V4", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Rear brake hose recall", "2008-2010"], ["Shaft drive", "Final drive oil"], ["Linked brakes", "Bleed correctly"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2008-2010 ST1300s were in recall 11V356 because the rear brake reservoir hose can be damaged when the suspension bottoms out.", reason="A damaged hose can leak brake fluid and lose the rear brake. The repair is free.")},
  add=[], lessons={},
  recalls=[dict(id="11V356", years="2008-2010", what="Rear brake reservoir hose can be damaged and leak fluid.", fix="Dealer replaces the hose free.", src="https://calemonlaw.com/blog/?p=2318")],
  known=[], forums=[]))

B11.append(dict(id="honda-vfr800-interceptor-1998", make="Honda", model="VFR800 Interceptor", name="Honda VFR800 Interceptor", years=[1998, 2017],
  match=["vfr800", "vfr 800", "interceptor", "vfr800fi", "vfr800 vtec"], style="sport", drive="chain",
  engine="781 cc liquid-cooled V4, gear-driven cams (1998-2001) or VTEC (2002 on), fuel injected",
  intro="Honda's V4 sport tourer. Regulator/rectifier failures and cam chain tensioners on VTEC bikes are the known issues.",
  focus=[["781 cc V4", "Liquid-cooled"], ["Regulator/rectifier", "Fails from heat"], ["Cam tensioners", "VTEC bikes"], ["Fuel injected", "No carbs"], ["Chain drive", "Single-sided arm"]],
  remove=EFI, patch={},
  add=[RR_STEP("X-VFR-01", "VFR World forum"),
       step("X-VFR-02", "H", "H-003", "Listen for cam chain rattle", "On a cold start, listen for a rattle in the first 30 seconds. On 2002 and later VTEC bikes, the front tensioner is the usual culprit.", "Worn tensioners let the cam chain slap.", "Motor and Wheels VFR notes", hours=0.5)],
  lessons={}, recalls=[], recallNote=VIN,
  known=[dict(title="Regulator/rectifier", what="Premature regulator/rectifier failure is the most common VFR800 complaint.", src="https://motorandwheels.com/common-problems-honda-interceptor/")],
  forums=[dict(name="VFR World", url="https://vfrworld.com/", what="Owner forum for Honda VFRs.")]))

HERO_NAME_B11 = {"honda-shadow-vt1100-1985": "SHADOW", "honda-shadow-aero-750-2004": "AERO", "honda-vtx1300-2003": "VTX1300", "honda-vtx1800-2002": "VTX1800",
  "honda-cbr1000rr-2004": "CBR1000RR", "honda-cbr250r-2011": "CBR250R", "honda-cb1100-2013": "CB1100", "honda-xr650l-1993": "XR650L",
  "honda-st1300-2003": "ST1300", "honda-vfr800-interceptor-1998": "VFR800"}
