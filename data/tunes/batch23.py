"""Batch 23 bike tunes (top 500, rows 221-230)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B23 = []
ZXF = dict(name="ZX6R.com", url="https://www.zx6r.com/", what="Owner forum for Kawasaki ZX sport bikes.")
VULC = dict(name="Vulcan Riders Association", url="https://www.vulcanriders.org/", what="Owner club for Kawasaki Vulcans.")
CARB4 = "Rebuild one carb at a time and keep each one's parts apart."

B23.append(dict(id="kawasaki-ex500-ninja-500-1987", make="Kawasaki", model="EX500 / Ninja 500R", name="Kawasaki EX500 / Ninja 500R", years=[1987, 2009],
  match=["ex500", "ninja 500", "ninja 500r", "gpz500", "gpz500s", "ex 500", "500r"], style="sport", drive="chain",
  engine="498 cc liquid-cooled DOHC parallel twin, two carbs",
  intro="A long-running starter bike. Two carbs, a liquid-cooled twin, and usually a few owners' worth of wear.",
  focus=[["498 cc twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Cooling", "Hoses and fan"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[],
  forums=[dict(name="Ninja500.org", url="https://ninja500.org/", what="Owner forum for the EX500 and Ninja 500R.")]))

B23.append(dict(id="kawasaki-zx-6r-1995", make="Kawasaki", model="Ninja ZX-6R", name="Kawasaki Ninja ZX-6R", years=[1995, 2018],
  match=["zx-6r", "zx6r", "zx 6r", "ninja zx-6r", "zx636", "636"], style="sport", drive="chain",
  engine="599 or 636 cc liquid-cooled inline four, carbs (to 2002) or fuel injected",
  intro="Kawasaki's long-running middleweight. Carbs on early bikes, EFI later. 2009-2012 bikes had a regulator/rectifier recall.",
  focus=[["Inline four", "Liquid-cooled"], ["Carb or EFI", "Depends on year"], ["R/R recall", "2009-2012"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2009-2012 ZX-6R bikes are in recall 12V064 because the regulator/rectifier may not charge the battery properly.", reason="A flat battery can stall the engine. The fix is free.")},
  add=[], lessons={"G": ["Bikes up to 2002 have carbs. Later bikes are fuel injected. Skip the steps that don't match."]},
  recalls=[dict(id="12V064", years="2009-2012 (Dec 2007-Jul 2011 build)", what="Regulator/rectifier may not charge the battery enough.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/12V064000")],
  known=[], forums=[ZXF]))

B23.append(dict(id="kawasaki-zx-7r-1996", make="Kawasaki", model="Ninja ZX-7R", name="Kawasaki Ninja ZX-7R", years=[1996, 2003],
  match=["zx-7r", "zx7r", "zx 7r", "zx-7rr", "zx750", "ninja zx-7r"], style="sport", drive="chain",
  engine="748 cc liquid-cooled inline four, four carbs",
  intro="Kawasaki's 1990s superbike. Big flat-slide carbs and a heavy chassis. Most survivors need their fuel and cooling systems gone through.",
  focus=[["748 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Cooling", "Hoses and fan"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[ZXF]))

B23.append(dict(id="kawasaki-zx-9r-1994", make="Kawasaki", model="Ninja ZX-9R", name="Kawasaki Ninja ZX-9R", years=[1994, 2003],
  match=["zx-9r", "zx9r", "zx 9r", "zx900", "ninja zx-9r"], style="sport", drive="chain",
  engine="899 cc liquid-cooled inline four, four carbs",
  intro="The big-bore Ninja of the 1990s. Four carbs and a fast road bike's worth of wear items.",
  focus=[["899 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Cooling", "Hoses and fan"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[ZXF]))

B23.append(dict(id="kawasaki-zx-11-zzr1100-1990", make="Kawasaki", model="ZX-11 / ZZR1100", name="Kawasaki ZX-11 / ZZR1100", years=[1990, 2001],
  match=["zx-11", "zx11", "zzr1100", "zzr 1100", "zx1100", "ninja zx-11"], style="sport", drive="chain",
  engine="1052 cc liquid-cooled inline four, four carbs, ram air",
  intro="The 1990s top-speed king. Four carbs, ram air and a lot of weight on the chain and brakes.",
  focus=[["1052 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Ram air", "Check ducts"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[ZXF]))

B23.append(dict(id="kawasaki-zx-14-2006", make="Kawasaki", model="Ninja ZX-14 / ZX-14R", name="Kawasaki Ninja ZX-14 / ZX-14R", years=[2006, 2020],
  match=["zx-14", "zx14", "zx-14r", "zx14r", "zx1400", "ninja zx-14", "zzr1400"], style="sport", drive="chain",
  engine="1352 or 1441 cc liquid-cooled inline four, fuel injected",
  intro="Kawasaki's hyperbike. Early 2006-2007 bikes had frame and fuel pump recalls.",
  focus=[["Big inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Frame recall", "2006-2007"], ["Cooling", "Hoses and fan"], ["Chain drive", "Heavy wear"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2006-2007 bikes are in recall 08V222 (frame can crack). Some 2006 bikes are in recall 06V184 (fuel pump).", reason="A cracked frame is a crash risk. Both fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="08V222", years="2006-2007", what="Frame may fracture.", fix="Free dealer inspection and repair.", src="https://vehiclesafetyrecalls.com/recall/08V222000"),
           dict(id="06V184", years="2006 (some)", what="Fuel pump problem.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/kawasaki/zx1400a6f/2006/06v184000")],
  known=[], forums=[dict(name="ZX-14 Owners Association", url="https://www.zx14oa.com/", what="Owner forum for the ZX-14 and ZX-14R.")]))

B23.append(dict(id="kawasaki-versys-1000-2012", make="Kawasaki", model="Versys 1000", name="Kawasaki Versys 1000", years=[2012, 2026],
  match=["versys 1000", "versys1000", "kle1000", "versys 1000 lt", "versys 1000 se"], style="adventure", drive="chain",
  engine="1043 cc liquid-cooled inline four, fuel injected",
  intro="A tall, road-biased adventure four. Mostly normal sport-touring upkeep.",
  focus=[["1043 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"], ["Luggage mounts", "Check bolts"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[dict(name="Kawasaki Versys Forum", url="https://www.kawasakiversys.com/", what="Owner forum for Versys models.")]))

B23.append(dict(id="kawasaki-klx250-2009", make="Kawasaki", model="KLX250", name="Kawasaki KLX250 / KLX250S", years=[2009, 2020],
  match=["klx250", "klx 250", "klx250s", "klx250sf", "klx250t"], style="dualsport", drive="chain",
  engine="249 cc liquid-cooled single, carb (to 2017) or fuel injected (2018-on)",
  intro="A light dual-sport. Early bikes had throttle and fuel tank recalls.",
  focus=[["249 cc single", "Liquid-cooled"], ["Carb or EFI", "Depends on year"], ["Fuel tank recall", "2009-2010"], ["Chain drive", "Slack and lube"], ["Valves", "Shim type"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2009 bikes are in recall 08V228 (throttle and handlebar grip). 2009-2010 bikes are in recall 11V316 (fuel tank mount tabs can crack and leak).", reason="A stuck throttle or a fuel leak is a real hazard. Both fixes are free.")},
  add=[], lessons={"G": ["Bikes up to 2017 have a carb. 2018-on bikes are fuel injected. Skip the steps that don't match."]},
  recalls=[dict(id="08V228", years="2009 (some)", what="Throttle and handlebar grip problem.", fix="Free dealer repair.", src="https://www.vehiclesafetyrecalls.com/recall/08V228000"),
           dict(id="11V316", years="2009-2010", what="The fuel tank may crack at the side mount tabs and leak.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/11V316000")],
  known=[], forums=[dict(name="ThumperTalk", url="https://www.thumpertalk.com/", what="Owner forum for four-stroke dirt and dual-sport bikes.")]))

B23.append(dict(id="kawasaki-vulcan-750-1985", make="Kawasaki", model="Vulcan 750", name="Kawasaki Vulcan 750 (VN750)", years=[1985, 2006],
  match=["vulcan 750", "vn750", "vn 750", "vulcan750"], style="cruiser", drive="shaft",
  engine="749 cc liquid-cooled DOHC V-twin, two carbs, shaft drive",
  intro="A long-running shaft-drive Vulcan. Two carbs and an engine that mostly needs basic care.",
  focus=[["749 cc V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Shaft drive", "Change the oil"], ["Cooling", "Hoses and fan"], ["Charging", "Check R/R"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[VULC]))

B23.append(dict(id="kawasaki-vulcan-500-ltd-1990", make="Kawasaki", model="Vulcan 500 LTD", name="Kawasaki Vulcan 500 LTD (EN500)", years=[1990, 2009],
  match=["vulcan 500", "en500", "vulcan 500 ltd", "en 500", "vulcan500"], style="cruiser", drive="chain",
  engine="498 cc liquid-cooled parallel twin (EX500 engine), two carbs",
  intro="A small cruiser built around the EX500 engine. Chain drive and two carbs.",
  focus=[["498 cc twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"], ["Charging", "Check R/R"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[VULC]))

HERO_NAME_B23 = {"kawasaki-ex500-ninja-500-1987": "NINJA 500", "kawasaki-zx-6r-1995": "ZX-6R", "kawasaki-zx-7r-1996": "ZX-7R", "kawasaki-zx-9r-1994": "ZX-9R",
  "kawasaki-zx-11-zzr1100-1990": "ZX-11", "kawasaki-zx-14-2006": "ZX-14", "kawasaki-versys-1000-2012": "VERSYS 1000", "kawasaki-klx250-2009": "KLX250",
  "kawasaki-vulcan-750-1985": "VULCAN 750", "kawasaki-vulcan-500-ltd-1990": "VULCAN 500"}
