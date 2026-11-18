"""Batch 25 bike tunes (top 500, rows 241-250)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B25 = []
STARF = dict(name="Star Bike Forum", url="https://www.starbikeforum.com/", what="Owner forum for Yamaha Star cruisers.")
VSTAR_FUEL = dict(id="11V533", years="2007 V Star 1300 and 2009-2012 V Star 950 (some)", what="The fuel delivery pipe may not seal and can leak fuel.", fix="Dealer replaces the fuel delivery pipe free.", src="https://static.nhtsa.gov/odi/rcl/2011/RCAK-11V533-7841.pdf")
GSXR = dict(name="Gixxer.com", url="https://www.gixxer.com/", what="Owner forum for Suzuki GSX-R models.")

B25.append(dict(id="yamaha-v-star-950-2009", make="Yamaha", model="V Star 950", name="Yamaha V Star 950", years=[2009, 2017],
  match=["v star 950", "vstar 950", "xvs95", "v star 950 tourer", "v-star 950"], style="cruiser", drive="belt",
  engine="942 cc air-cooled V-twin, fuel injected, belt drive",
  intro="A mid-size fuel-injected Star cruiser. Some 2009-2012 bikes are in a fuel pipe recall.",
  focus=[["942 cc V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Fuel pipe recall", "2009-2012"], ["Belt drive", "Tension and wear"], ["Valves", "Check on time"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Some 2009-2012 V Star 950s are in recall 11V533 because the fuel delivery pipe may leak.", reason="A fuel leak near a hot engine is a fire risk. The fix is free.")},
  add=[], lessons={}, recalls=[VSTAR_FUEL], known=[], forums=[STARF]))

B25.append(dict(id="yamaha-v-star-1300-2007", make="Yamaha", model="V Star 1300", name="Yamaha V Star 1300", years=[2007, 2017],
  match=["v star 1300", "vstar 1300", "xvs1300", "xvs13", "v star 1300 tourer", "v-star 1300", "v star 1300 deluxe"], style="cruiser", drive="belt",
  engine="1304 cc liquid-cooled V-twin, fuel injected, belt drive",
  intro="Yamaha's liquid-cooled Star cruiser. Some 2007 bikes are in a fuel pipe recall.",
  focus=[["1304 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fuel pipe recall", "2007"], ["Belt drive", "Tension and wear"], ["Cooling", "Hoses and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Some 2007 V Star 1300s are in recall 11V533 because the fuel delivery pipe may leak.", reason="A fuel leak near a hot engine is a fire risk. The fix is free.")},
  add=[], lessons={}, recalls=[VSTAR_FUEL], known=[], forums=[STARF]))

B25.append(dict(id="yamaha-venture-xvz1200-1300-1983", make="Yamaha", model="Venture XVZ1200 / XVZ1300", name="Yamaha Venture (XVZ12 / XVZ13)", years=[1983, 1993],
  match=["venture", "xvz1200", "xvz1300", "venture royale", "xvz12", "xvz13", "yamaha venture"], style="touring", drive="shaft",
  engine="1198 or 1294 cc liquid-cooled V4, four carbs, shaft drive",
  intro="Yamaha's first big V4 tourer. Four carbs in the V, a lot of plastic, and a shaft drive.",
  focus=[["V4", "Liquid-cooled"], ["Four carbs", "In the V"], ["Shaft drive", "Spline lube"], ["Cooling", "Hoses and fan"], ["Charging", "Check R/R"]],
  remove=CARB, patch={}, add=[], lessons={"G": ["The carbs sit in the V of the engine. Plan for the time it takes to get to them, and rebuild them as a set."]},
  recalls=[], recallNote=OLD, known=[], forums=[dict(name="Venture Riders International", url="https://www.ventureriders.org/", what="Owner club for Yamaha Ventures.")]))

B25.append(dict(id="yamaha-xs850-triple-1980", make="Yamaha", model="XS850", name="Yamaha XS850 Triple", years=[1980, 1981],
  match=["xs850", "xs 850", "xs850g", "xs850s", "xs850 special"], style="standard", drive="shaft",
  engine="826 cc air-cooled DOHC inline triple, three carbs, shaft drive",
  intro="Yamaha's shaft-drive triple. Three carbs to rebuild and sync, and an engine that runs well once they are right.",
  focus=[["826 cc triple", "Air-cooled"], ["Three carbs", "Rebuild as a set"], ["Shaft drive", "Change the oil"], ["Charging", "Check R/R"], ["Ignition", "Check timing"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": ["Rebuild one carb at a time and keep each one's parts apart."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

B25.append(dict(id="yamaha-xt225-serow-1992", make="Yamaha", model="XT225 / Serow 225", name="Yamaha XT225 (Serow)", years=[1992, 2007],
  match=["xt225", "xt 225", "serow", "serow 225", "xt250 serow"], style="dualsport", drive="chain",
  engine="223 cc air-cooled single, carb",
  intro="A light, simple trail bike. Air-cooled, one carb, and easy to keep running.",
  focus=[["223 cc single", "Air-cooled"], ["Single carb", "Clean it out"], ["Chain drive", "Slack and lube"], ["Valves", "Screw adjusters"], ["Electric start", "Check battery"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[dict(name="ThumperTalk", url="https://www.thumpertalk.com/", what="Owner forum for four-stroke dirt and dual-sport bikes.")]))

B25.append(dict(id="yamaha-tmax-2001", make="Yamaha", model="TMAX", name="Yamaha TMAX", years=[2001, 2026],
  match=["tmax", "t-max", "xp500", "xp530", "xp560", "tmax 500", "tmax 530", "tmax 560"], style="scooter", drive="belt",
  engine="499, 530 or 562 cc liquid-cooled parallel twin, fuel injected, CVT",
  intro="Yamaha's sporty maxi-scooter. A twin-cylinder engine, CVT and belt final drive.",
  focus=[["Parallel twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Final drive belt", "Check"], ["Coolant", "Change it"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B25.append(dict(id="yamaha-vino-125-2004", make="Yamaha", model="Vino 125", name="Yamaha Vino 125", years=[2004, 2009],
  match=["vino 125", "vino125", "yj125", "vino"], style="scooter", drive="belt",
  engine="124 cc air-cooled single, carb, CVT",
  intro="A small retro scooter. One carb and a CVT. Most problems come from old fuel.",
  focus=[["124 cc single", "Air-cooled"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Gear oil", "Change it"], ["Brakes", "Drum rear"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B25.append(dict(id="yamaha-stryker-raider-2008", make="Yamaha", model="Raider / Stryker", name="Yamaha Raider / Stryker", years=[2008, 2017],
  match=["raider", "xv1900 raider", "stryker", "xvs1300 stryker", "xv19c", "star raider", "star stryker"], style="cruiser", drive="belt",
  engine="1854 cc air-cooled V-twin (Raider) or 1304 cc liquid-cooled V-twin (Stryker), fuel injected, belt drive",
  intro="Yamaha's factory choppers. The Raider uses the big 1900 air-cooled twin, the Stryker the liquid-cooled 1300.",
  focus=[["V-twin", "Air or liquid"], ["Fuel injected", "No carbs"], ["Belt drive", "Tension and wear"], ["Long fork", "Check head bearings"], ["Valves", "Check on time"]],
  remove=EFI, patch={}, add=[], lessons={"H": ["The Raider is air-cooled and has no radiator. Skip the coolant steps on a Raider."]},
  recalls=[], recallNote=VIN, known=[], forums=[STARF]))

B25.append(dict(id="suzuki-gsx-r600-1997", make="Suzuki", model="GSX-R600", name="Suzuki GSX-R600", years=[1997, 2010],
  match=["gsx-r600", "gsxr600", "gsxr 600", "gixxer 600", "gsx-r 600", "gsxr"], style="sport", drive="chain",
  engine="599 cc liquid-cooled inline four, carbs (1997-2000) or fuel injected",
  intro="Suzuki's middleweight GSX-R. 2004-2010 bikes are in a big front brake master cylinder recall.",
  focus=[["599 cc four", "Liquid-cooled"], ["Carb or EFI", "Depends on year"], ["Brake recall", "2004-2010"], ["Charging", "R/R recall"], ["Chain drive", "Slack and lube"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2004-2010 bikes are in recall 13V449 (front brake master cylinder). 2008-2010 bikes are in recall 16V018 (regulator/rectifier).", reason="A weak front brake is a crash risk. Both fixes are free.")},
  add=[], lessons={"G": ["1997-2000 bikes have carbs. 2001-on bikes are fuel injected. Skip the steps that don't match."]},
  recalls=[dict(id="13V449", years="2004-2010 (in this range)", what="Gas can form in the front brake master cylinder and reduce braking.", fix="Dealer replaces the front master cylinder free.", src="https://auto-recalls.justia.com/suzuki/gsxr600/2006/13v449000"),
           dict(id="16V018", years="2008-2010", what="Regulator/rectifier circuit board can lift off its case, causing a stall or no-start.", fix="Dealer replaces the regulator/rectifier free.", src="https://static.nhtsa.gov/odi/rcl/2016/RCMN-16V018-3272.pdf")],
  known=[], forums=[GSXR]))

B25.append(dict(id="suzuki-sv1000-2003", make="Suzuki", model="SV1000 / SV1000S", name="Suzuki SV1000", years=[2003, 2008],
  match=["sv1000", "sv1000s", "sv 1000", "sv1000n"], style="standard", drive="chain",
  engine="996 cc liquid-cooled 90-degree V-twin, fuel injected",
  intro="The big brother to the SV650. Some 2003-2006 bikes are in a fuel tank recall.",
  focus=[["996 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fuel tank recall", "2003-2006"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2003 SV1000 and 2003-2006 SV1000S bikes are in recall 06V013 for the fuel tank.", reason="A fuel tank fault can leak fuel. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="06V013", years="2003 SV1000, 2003-2006 SV1000S", what="Fuel tank assembly problem.", fix="Free dealer repair.", src="https://www.motorcycle.com/news/news2867.html")],
  known=[], forums=[dict(name="SVRider", url="https://www.svrider.com/", what="Owner forum for the SV650 and SV1000.")]))

HERO_NAME_B25 = {"yamaha-v-star-950-2009": "V STAR 950", "yamaha-v-star-1300-2007": "V STAR 1300", "yamaha-venture-xvz1200-1300-1983": "VENTURE",
  "yamaha-xs850-triple-1980": "XS850", "yamaha-xt225-serow-1992": "XT225", "yamaha-tmax-2001": "TMAX", "yamaha-vino-125-2004": "VINO 125",
  "yamaha-stryker-raider-2008": "RAIDER", "suzuki-gsx-r600-1997": "GSX-R600", "suzuki-sv1000-2003": "SV1000"}
