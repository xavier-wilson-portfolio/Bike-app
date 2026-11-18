"""Batch 24 bike tunes (top 500, rows 231-240)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B24 = []
KZR = dict(name="KZRider", url="https://www.kzrider.com/", what="Owner forum for vintage Kawasaki KZ and Z bikes.")
YBRAKE = dict(id="20V814", years="2013-2020 FJR1300, 2018-2020 Super Tenere and others (some)", what="Front brake light switch may fail, so the brake light may not come on.", fix="Dealer replaces the switch free.", src="https://vehicleflaws.com/recall/20V814000")

B24.append(dict(id="kawasaki-z1000-2003", make="Kawasaki", model="Z1000", name="Kawasaki Z1000", years=[2003, 2016],
  match=["z1000", "z 1000", "zr1000", "z1000 abs"], style="standard", drive="chain",
  engine="953 or 1043 cc liquid-cooled inline four, fuel injected",
  intro="Kawasaki's big naked four. Mostly normal upkeep on a fast road bike.",
  focus=[["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"], ["Brakes", "Fluid and pads"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B24.append(dict(id="kawasaki-z125-pro-2017", make="Kawasaki", model="Z125 Pro", name="Kawasaki Z125 Pro", years=[2017, 2022],
  match=["z125 pro", "z 125", "br125", "z125 pro krt"], style="standard", drive="chain",
  engine="125 cc air-cooled single, fuel injected",
  intro="Kawasaki's mini bike. 2017-2018 bikes have shock and ECU recalls.",
  focus=[["125 cc single", "Air-cooled"], ["Fuel injected", "No carb"], ["ECU recall", "2017-2018"], ["Shock recall", "2017"], ["Chain drive", "Slack and lube"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2017 bikes are in recall 16V535 (rear shock may leak). 2017-2018 bikes are in recall 17V774 (ECU setting can stall the engine).", reason="Both fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="16V535", years="2017 (Feb-Jun 2016 build)", what="Rear shock may leak oil and lose damping.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/16V535000"),
           dict(id="17V774", years="2017-2018", what="ECU fuel injection setting can stall the engine at small throttle openings.", fix="Dealer fits a new ECU free.", src="https://vehiclesafetyrecalls.com/recall/17V774000")],
  known=[], forums=[]))

B24.append(dict(id="kawasaki-kz440-1980", make="Kawasaki", model="KZ440", name="Kawasaki KZ440", years=[1980, 1983],
  match=["kz440", "kz 440", "kz440ltd", "kz440 ltd", "z440", "kz440d"], style="standard", drive="chain",
  engine="443 cc air-cooled SOHC parallel twin, two carbs",
  intro="A small, simple Kawasaki twin. Some came with belt drive. Two carbs and points or electronic ignition depending on year.",
  focus=[["443 cc twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Chain or belt", "Check which"], ["Charging", "Check R/R"], ["Drum or disc", "Depends on model"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[KZR]))

B24.append(dict(id="kawasaki-kz1000-ltd-1977", make="Kawasaki", model="KZ1000 LTD", name="Kawasaki KZ1000 LTD", years=[1977, 1980],
  match=["kz1000 ltd", "kz1000ltd", "kz 1000 ltd", "z1000 ltd", "kz1000b"], style="cruiser", drive="chain",
  engine="1015 cc air-cooled DOHC inline four, four carbs",
  intro="Kawasaki's early factory custom on the big Z1 engine. Four carbs, points ignition and a stout bottom end.",
  focus=[["1015 cc four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Points ignition", "Gap and timing"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": ["Rebuild one carb at a time and keep each one's parts apart."]},
  recalls=[], recallNote=OLD, known=[], forums=[KZR]))

B24.append(dict(id="yamaha-yzf-r1-1998", make="Yamaha", model="YZF-R1", name="Yamaha YZF-R1", years=[1998, 2026],
  match=["yzf-r1", "r1", "yzf r1", "yzfr1", "r1m", "yzf-r1m", "r1s"], style="sport", drive="chain",
  engine="998 cc liquid-cooled inline four, carbs (1998-2001) or fuel injected",
  intro="Yamaha's superbike. Early bikes have carbs. 2015 bikes had a gearbox recall.",
  focus=[["998 cc four", "Liquid-cooled"], ["Carb or EFI", "Depends on year"], ["2015 gearbox", "Recall"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2015 R1 and R1M bikes are in recall 15V802 (transmission gears). Some 2015 R1M bikes are in recall 15V221 (rear shock nut). Some 2012 R1s are in recall 14V044 (headlight socket).", reason="A gearbox lock-up can throw you off. The fixes are free.")},
  add=[], lessons={"G": ["1998-2001 bikes have carbs. Later bikes are fuel injected. Skip the steps that don't match."]},
  recalls=[dict(id="15V802", years="2015", what="Transmission gears may fail and lock up.", fix="Dealer fits a new transmission kit free.", src="https://auto-recalls.justia.com/yamaha/yzf-r1/2015/15v802000"),
           dict(id="15V221", years="2015 R1M (some)", what="Rear shock piston rod nut may loosen.", fix="Free dealer repair.", src="https://vehicleflaws.com/vehicle/yamaha/yzfr1m/2015"),
           dict(id="14V044", years="2012 (some)", what="Headlight socket problem.", fix="Dealer replaces the headlight socket free.", src="https://vehicleflaws.com/vehicle/yamaha/yzfr1/2012")],
  known=[], forums=[dict(name="R1-Forum", url="https://www.r1-forum.com/", what="Owner forum for the YZF-R1.")]))

B24.append(dict(id="yamaha-mt-09-fz-09-2014", make="Yamaha", model="MT-09 / FZ-09", name="Yamaha MT-09 / FZ-09", years=[2014, 2026],
  match=["mt-09", "mt09", "fz-09", "fz09", "mt 09", "fz 09", "mt-09 sp"], style="standard", drive="chain",
  engine="847 or 890 cc liquid-cooled inline triple, fuel injected",
  intro="Yamaha's crossplane triple. Several years have recalls, from headlight wiring to handlebar clamps to ECU software.",
  focus=[["Inline triple", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Recalls", "Several years"], ["Chain drive", "Slack and lube"], ["Valves", "Shim type"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2014 FZ-09s are in recall 14V550 (headlight harness). Some 2015 bikes are in recall 15V176 (shift cam stopper). 2015-2017 bikes are in recall 17V221 (handlebar holder may loosen). Some 2021-2022 MT-09s are in recall 22V130 (ECU can stall the engine).", reason="Loose bars or a stall can cause a crash. The fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="14V550", years="2014", what="Headlight harness may be too short and disconnect.", fix="Dealer fits an extension harness free.", src="https://vehiclesafetyrecalls.com/recall/14V550000"),
           dict(id="15V176", years="2015 (Sep-Nov 2014 build)", what="Shift cam segment stopper may crack and cause shifting failure.", fix="Free dealer repair.", src="https://au7o.io/motorcycle-issues/yamaha-mt-09"),
           dict(id="17V221", years="2015-2017", what="Lower handlebar holder may loosen.", fix="Free dealer repair.", src="https://static.nhtsa.gov/odi/rcl/2017/RCAK-17V221-6477.pdf"),
           dict(id="22V130", years="2021-2022 (some)", what="ECU programming may limit throttle response or stall the engine.", fix="Dealer reprograms the ECU free.", src="https://vehiclesafetyrecalls.com/recall/22V130000")],
  known=[], forums=[dict(name="FZ-09 Forum", url="https://www.fz09.org/", what="Owner forum for the FZ-09, MT-09 and related triples.")]))

B24.append(dict(id="yamaha-yzf-r7-2022", make="Yamaha", model="YZF-R7", name="Yamaha YZF-R7", years=[2022, 2026],
  match=["yzf-r7", "r7", "yzf r7", "yzfr7"], style="sport", drive="chain",
  engine="689 cc liquid-cooled parallel twin (CP2), fuel injected",
  intro="A sport bike built on the MT-07 twin. Mostly normal upkeep.",
  focus=[["689 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"], ["Valves", "Shim type"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B24.append(dict(id="yamaha-fjr1300-2003", make="Yamaha", model="FJR1300", name="Yamaha FJR1300", years=[2003, 2022],
  match=["fjr1300", "fjr", "fjr 1300", "fjr1300a", "fjr1300ae", "fjr1300es", "fjr13"], style="touring", drive="shaft",
  engine="1298 cc liquid-cooled inline four, fuel injected, shaft drive",
  intro="Yamaha's sport tourer. Several recalls over the years, including a second gear recall on 2016-2020 bikes.",
  focus=[["1298 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "Several years"], ["Shaft drive", "Change the oil"], ["Wiring", "Ground junction"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2006-2009 bikes are in recalls 09V002 (ignition switch) and 11V338 (ground wire junction). Some 2011 bikes are in recall 11V340 (brake light switch). 2013-2020 bikes are in recall 20V814 (brake light switch). 2016-2020 bikes are in recall 20V813 (second gear can break). Some 2016-2021 bikes are in recall 21V865 (ECU).", reason="Some of these carry a do-not-ride warning until fixed. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="09V002", years="2006-2009", what="Ignition switch wiring may disconnect.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/09V002000"),
           dict(id="11V338", years="2006-2009", what="Ground wire junction problem.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/11V338000"),
           dict(id="11V340", years="2011 (Jan-Apr build)", what="Front brake light switch problem.", fix="Dealer fits a new front brake switch free.", src="https://vehiclesafetyrecalls.com/recall/11V340000"),
           YBRAKE,
           dict(id="20V813", years="2016-2020", what="Second gear may crack and break under high-speed load.", fix="Dealer reprograms the ECU and replaces the main and drive axles free.", src="https://auto-recalls.justia.com/yamaha/fjr1300/2019/20v813000"),
           dict(id="21V865", years="2016-2021 (some)", what="ECU software problem. NHTSA lists a do-not-ride advisory.", fix="Free dealer repair.", src="https://www.carwhere.com/recalls/campaign/21V865000")],
  known=[], forums=[dict(name="FJR Forum", url="https://www.fjrforum.com/", what="Owner forum for the FJR1300.")]))

B24.append(dict(id="yamaha-super-tenere-xt1200z-2012", make="Yamaha", model="Super Tenere XT1200Z", name="Yamaha Super Tenere (XT1200Z)", years=[2012, 2021],
  match=["super tenere", "xt1200z", "xt1200ze", "super tenere es", "xtz12", "s10"], style="adventure", drive="shaft",
  engine="1199 cc liquid-cooled parallel twin, fuel injected, shaft drive",
  intro="Yamaha's big shaft-drive adventure twin. Some 2018-2020 bikes are in a brake light switch recall.",
  focus=[["1199 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Shaft drive", "Change the oil"], ["Brake switch", "Recall"], ["Linked brakes", "Bleed order"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2018-2020 Super Teneres are in recall 20V814 (front brake light switch).", reason="The fix is free.")},
  add=[], lessons={},
  recalls=[YBRAKE], known=[], forums=[dict(name="Super Tenere Forum", url="https://www.supertenere.com/", what="Owner forum for the Super Tenere.")]))

B24.append(dict(id="yamaha-v-star-250-virago-250-1988", make="Yamaha", model="V Star 250 / Virago 250", name="Yamaha V Star 250 / Virago 250", years=[1988, 2021],
  match=["v star 250", "vstar 250", "virago 250", "xv250", "route 66", "v-star 250"], style="cruiser", drive="chain",
  engine="249 cc air-cooled V-twin, single carb",
  intro="A small, simple V-twin cruiser. One carb and chain drive. Most problems come from sitting.",
  focus=[["249 cc V-twin", "Air-cooled"], ["Single carb", "Clean it out"], ["Chain drive", "Slack and lube"], ["Valves", "Screw adjusters"], ["Fuel petcock", "Vacuum type"]],
  remove=CARB + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. A small number of 2019 V Star 250s are in recall 20V212 because an oil passage in the engine side cover may not be drilled.", reason="Without that passage the engine can starve of oil and seize. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="20V212", years="2019 (17 bikes)", what="An oil passage in the right engine cover may not be machined, starving the engine of oil.", fix="Dealer inspects and replaces the engine side cover free.", src="https://www.clearvin.com/car-recalls/yamaha/xv250/2019/")],
  known=[], forums=[]))

HERO_NAME_B24 = {"kawasaki-z1000-2003": "Z1000", "kawasaki-z125-pro-2017": "Z125 PRO", "kawasaki-kz440-1980": "KZ440", "kawasaki-kz1000-ltd-1977": "KZ1000 LTD",
  "yamaha-yzf-r1-1998": "R1", "yamaha-mt-09-fz-09-2014": "MT-09", "yamaha-yzf-r7-2022": "R7", "yamaha-fjr1300-2003": "FJR1300",
  "yamaha-super-tenere-xt1200z-2012": "SUPER TENERE", "yamaha-v-star-250-virago-250-1988": "V STAR 250"}
