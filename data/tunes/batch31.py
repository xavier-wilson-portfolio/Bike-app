"""Batch 31 bike tunes (top 500, rows 301-310)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B31 = []
CBRF = dict(name="CBR Forum", url="https://www.cbrforum.com/", what="Owner forum for Honda CBR models.")
VFRD = dict(name="VFRDiscussion", url="https://www.vfrdiscussion.com/", what="Owner forum for Honda VFR and Interceptor models.")
SHADOWF = dict(name="Shadow Riders", url="https://www.shadowriders.com/", what="Owner forum for Honda Shadows and other Honda cruisers.")
STARTER = dict(id="15V439", years="2014-2015 (model list varies)", what="Starter relay switch can fail, so the bike may not start, or the starter may keep running.", fix="Dealer replaces the starter relay free.", src="https://recallcheck.net/recall/15V439000")
CARB4 = "Rebuild one carb at a time and keep each one's parts apart."
V4CAM = step("X-V4-01", "H", "H-003", "Check for cam and rocker wear", "With the valve covers off, look at the cam lobes and rocker pads for pitting or flat spots. Early Honda V4s are known for cam wear, often from poor oiling or old oil.", "Worn cams on early V4 Interceptors are a known weak point.", "Owner experience", skill="Advanced", hours=3.0)

B31.append(dict(id="honda-cbr600f2-f3-1991", make="Honda", model="CBR600F2 / F3", name="Honda CBR600F2 / F3", years=[1991, 1998],
  match=["cbr600f2", "cbr600f3", "cbr600 f2", "cbr600 f3", "f2", "f3"], style="sport", drive="chain",
  engine="599 cc liquid-cooled inline four, four carbs",
  intro="The 1990s CBR600. Four carbs, plenty of plastic, and usually a few owners' worth of wear.",
  focus=[["599 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Charging", "Check R/R"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[CBRF]))

B31.append(dict(id="honda-cbr600-hurricane-1987", make="Honda", model="CBR600 Hurricane", name="Honda CBR600 Hurricane (CBR600F)", years=[1987, 1990],
  match=["cbr600 hurricane", "hurricane 600", "cbr600f hurricane", "cbr600 1988", "cbr600f1"], style="sport", drive="chain",
  engine="598 cc liquid-cooled inline four, four carbs",
  intro="The first CBR600. Fully enclosed bodywork, four carbs and a lot of fasteners to keep track of.",
  focus=[["598 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Full fairing", "Many fasteners"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[CBRF]))

B31.append(dict(id="honda-cbr1000f-hurricane-1987", make="Honda", model="CBR1000F Hurricane", name="Honda CBR1000F", years=[1987, 1996],
  match=["cbr1000f", "cbr1000 hurricane", "hurricane 1000", "cbr 1000f"], style="sport", drive="chain",
  engine="998 cc liquid-cooled inline four, four carbs, linked brakes on later bikes",
  intro="Honda's big enclosed sport tourer of the late 80s and early 90s. Later bikes have linked brakes.",
  focus=[["998 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Linked brakes", "Later bikes"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4], "K": ["Later bikes have linked brakes. Bleed them in the order the manual gives."]},
  recalls=[], recallNote=OLD, known=[], forums=[CBRF]))

B31.append(dict(id="honda-vfr750f-interceptor-1986", make="Honda", model="VFR750F Interceptor", name="Honda VFR750F", years=[1986, 1997],
  match=["vfr750", "vfr750f", "vfr 750", "interceptor 750 1990", "vfr750 interceptor"], style="sport", drive="chain",
  engine="748 cc liquid-cooled V4, gear-driven cams, four carbs",
  intro="The VFR that fixed the early V4's cam problems with gear-driven cams. Four carbs in the V and a single-sided swingarm from 1990.",
  focus=[["748 cc V4", "Gear-driven cams"], ["Four carbs", "In the V"], ["Charging", "R/R and stator"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={},
  add=[step("X-VFR7-01", "F", "F-002", "Test the charging system", "Check voltage at idle and at 5,000 rpm. Below about 13 V at speed points at the regulator/rectifier or stator. Check the connectors for heat damage too.", "Regulator/rectifier and stator failures are a common VFR problem.", "VFRDiscussion", hours=1.0)],
  lessons={"G": ["The carbs sit in the V of the engine. Plan for the time it takes to get to them."]},
  recalls=[], recallNote=OLD, known=[], forums=[VFRD]))

B31.append(dict(id="honda-vf500f-interceptor-1984", make="Honda", model="VF500F Interceptor", name="Honda VF500F Interceptor", years=[1984, 1986],
  match=["vf500f", "vf500", "interceptor 500", "vf 500f", "vf500c magna"], style="sport", drive="chain",
  engine="498 cc liquid-cooled V4, four carbs",
  intro="The small V4 Interceptor. Four tiny carbs in the V and a lot of 1980s wiring.",
  focus=[["498 cc V4", "Liquid-cooled"], ["Four carbs", "In the V"], ["Cam wear", "Check it"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[V4CAM], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[VFRD]))

B31.append(dict(id="honda-vf750f-vf1000f-interceptor-1983", make="Honda", model="VF750F / VF1000F Interceptor", name="Honda VF750F / VF1000F Interceptor", years=[1983, 1986],
  match=["vf750f", "vf1000f", "vf750 interceptor", "vf1000 interceptor", "vf1000r", "interceptor 750 1983"], style="sport", drive="chain",
  engine="748 or 998 cc liquid-cooled V4, chain-driven cams, four carbs",
  intro="The first V4 Interceptors. Fast for their day, with chain-driven cams that are known to wear.",
  focus=[["V4", "Liquid-cooled"], ["Four carbs", "In the V"], ["Cam wear", "Known issue"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[V4CAM], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[VFRD]))

B31.append(dict(id="honda-shadow-ace-750-1998", make="Honda", model="Shadow ACE 750", name="Honda Shadow ACE 750 (VT750C)", years=[1998, 2003],
  match=["shadow ace 750", "ace 750", "vt750c ace", "vt750cd", "shadow ace deluxe", "ace tourer"], style="cruiser", drive="chain",
  engine="745 cc liquid-cooled V-twin, two carbs",
  intro="The retro-styled Shadow 750. Two carbs and chain drive.",
  focus=[["745 cc V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"], ["Fuel petcock", "Vacuum type"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[SHADOWF]))

B31.append(dict(id="honda-vt1300-fury-stateline-sabre-interstate-2010", make="Honda", model="VT1300 Fury / Stateline / Sabre / Interstate", name="Honda VT1300 (Fury, Stateline, Sabre, Interstate)", years=[2010, 2020],
  match=["fury", "vt1300cx", "stateline", "vt1300cr", "sabre 1300", "vt1300cs", "interstate 1300", "vt1300ct", "vt1300"], style="cruiser", drive="shaft",
  engine="1312 cc liquid-cooled V-twin, fuel injected, shaft drive",
  intro="Honda's 1300 cruisers. Some 2014-2015 bikes have a starter relay recall, and a few Furies a fuel tank weld recall.",
  focus=[["1312 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Shaft drive", "Change the oil"], ["Starter relay", "2014-2015 recall"], ["Cooling", "Hoses and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2014-2015 VT1300 bikes are in recall 15V439 (starter relay). A few 2010, 2016 and 2017 Furies are in recall 17V805 (fuel tank bracket welds missing).", reason="A fuel leak is a fire risk. Both fixes are free.")},
  add=[], lessons={},
  recalls=[STARTER,
           dict(id="17V805", years="2010, 2016-2017 Fury (20 bikes)", what="Fuel tank may be missing welds at the mounting bracket, so the bracket can separate and fuel can leak.", fix="Dealer inspects the welds and replaces the tank if needed, free.", src="https://auto-recalls.justia.com/honda/vt1300cx/2017/17v805000")],
  known=[], forums=[SHADOWF]))

B31.append(dict(id="honda-ctx700-2014", make="Honda", model="CTX700", name="Honda CTX700", years=[2014, 2018],
  match=["ctx700", "ctx 700", "ctx700n", "ctx700d", "ctx700dct"], style="standard", drive="chain",
  engine="670 cc liquid-cooled parallel twin, fuel injected, manual or DCT automatic",
  intro="Honda's low, easy-going 700 twin. Some early ABS bikes had a recall, and 2014-2015 bikes a starter relay recall.",
  focus=[["670 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["DCT option", "Automatic"], ["Starter relay", "2014-2015 recall"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 235 early 2014 CTX700ND bikes are in recall 13V307 (ABS modulator). 2014-2015 CTX700s are in recall 15V439 (starter relay).", reason="Both fixes are free.")},
  add=[], lessons={"J": ["DCT bikes have no clutch lever. Check the DCT fluid and filter at the service intervals in the manual."]},
  recalls=[dict(id="13V307", years="2014 CTX700ND (Mar-Apr 2013 build)", what="ABS may malfunction and let the wheels lock.", fix="Dealer replaces the ABS modulator free.", src="https://vehiclesafetyrecalls.com/recall/13V307000"), STARTER],
  known=[], forums=[]))

B31.append(dict(id="honda-elite-80-ch80-1985", make="Honda", model="Elite 80 (CH80)", name="Honda Elite 80", years=[1985, 2007],
  match=["elite 80", "ch80", "elite80", "honda elite", "elite 50", "aero 80"], style="scooter", drive="belt",
  engine="80 cc air-cooled four-stroke single, carb, CVT",
  intro="A long-running small Honda scooter. One small carb that clogs when old fuel sits in it.",
  focus=[["80 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Drum brakes", "Shoes and cables"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[]))

HERO_NAME_B31 = {"honda-cbr600f2-f3-1991": "CBR600F3", "honda-cbr600-hurricane-1987": "HURRICANE", "honda-cbr1000f-hurricane-1987": "CBR1000F",
  "honda-vfr750f-interceptor-1986": "VFR750F", "honda-vf500f-interceptor-1984": "VF500F", "honda-vf750f-vf1000f-interceptor-1983": "INTERCEPTOR",
  "honda-shadow-ace-750-1998": "SHADOW ACE", "honda-vt1300-fury-stateline-sabre-interstate-2010": "FURY", "honda-ctx700-2014": "CTX700", "honda-elite-80-ch80-1985": "ELITE 80"}
