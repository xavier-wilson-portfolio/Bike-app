"""Batch 17 bike tunes (top 500, rows 161-170)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B17 = []
SVR = dict(name="SVRider forum", url="https://www.svrider.com/", what="Owner forum for the Suzuki SV650 and SV1000.")
GSXR_RECALL = dict(id="13V449", years="2004-2013 (GSX-R750); 2005-2013 (GSX-R1000)", what="With old brake fluid, the front brake master cylinder piston can corrode and give a soft brake.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/13V449000")
CHAIN_RECALL = dict(id="14V629", years="2011-2014 (GSX-R750); 2009-2014 (GSX-R1000)", what="After a missed upshift, the chain strain can move the rear axle and the chain may come off.", fix="Dealer fits an improved left chain adjuster free.", src="https://vehiclesafetyrecalls.com/recall/14V629000")

B17.append(dict(id="suzuki-sv650-1999", make="Suzuki", model="SV650 (first gen)", name="Suzuki SV650 (1999-2002)", years=[1999, 2002],
  match=["sv650", "sv 650", "sv650s", "sv650n"], style="standard", drive="chain",
  engine="645 cc liquid-cooled DOHC 90-degree V-twin, two carbs",
  intro="A great all-round twin. The regulator/rectifier is the known weak spot on the early ones.",
  focus=[["645 cc V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Charging", "R/R and stator"], ["Front forks", "Soft stock"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={},
  add=[step("X-SV1-01", "F", "F-002", "Test the regulator/rectifier", "Check battery voltage at idle and at 5,000 rpm. If it is low or above about 15 volts, test the stator and replace the regulator/rectifier.", "Early SV650s are known for regulator/rectifier failures that can kill the battery or the stator.", "Motoryk SV650 notes", hours=1.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Charging", what="1999-2002 models are prone to regulator/rectifier failure, which can kill the battery or damage the stator.", src="https://motoryk.com/bikes/suzuki/sv650")],
  forums=[SVR]))

B17.append(dict(id="suzuki-bandit-1200-1996", make="Suzuki", model="Bandit 1200", name="Suzuki Bandit 1200", years=[1996, 2006],
  match=["bandit 1200", "gsf1200", "gsf 1200", "bandit 1200s"], style="standard", drive="chain",
  engine="1157 cc oil-cooled DOHC inline four, four carbs",
  intro="A tough, cheap muscle bike. The engine lasts. Carbs, the regulator/rectifier and a worn second gear are things to check.",
  focus=[["1157 cc four", "Oil-cooled"], ["Four carbs", "Pilot jets clog"], ["Charging", "R/R failures"], ["Second gear", "Test under load"], ["Frame", "Check for rust"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"H": ["The tappets use screw and locknut adjusters, which makes valve checks easy."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Easy valves", what="The engines are tough and easy to service with screw and locknut tappets.", src="https://bennetts.co.uk/bikesocial/reviews/bikes/suzuki/suzuki-gsf1200sn-bandit-used-guide-value-spec")],
  forums=[]))

B17.append(dict(id="suzuki-bandit-600-1995", make="Suzuki", model="Bandit 600", name="Suzuki Bandit 600", years=[1995, 2004],
  match=["bandit 600", "gsf600", "gsf 600", "bandit 600s"], style="standard", drive="chain",
  engine="599 cc oil-cooled DOHC inline four, four carbs",
  intro="A simple, popular four. Frame rust and seized rear suspension linkages are the big things to check.",
  focus=[["599 cc four", "Oil-cooled"], ["Four carbs", "Sync and idle"], ["Rear linkage", "Often seized"], ["Frame", "Check for rust"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={},
  add=[step("X-BN6-01", "E", "E-002", "Free up the rear suspension linkage", "Strip the rear linkage, clean and grease the bearings, and replace any that are seized.", "Seized linkages are a known weak spot on the Bandit and costly if left.", "Bennetts Bandit 600 guide", hours=2.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Rust and linkages", what="Frame rust is common, and seized suspension linkages are a known weak area.", src="https://www.bennetts.co.uk/bikesocial/reviews/bikes/suzuki/suzuki-gsf600ns-1995-2004-buying-guide")],
  forums=[]))

B17.append(dict(id="suzuki-katana-600-750-1988", make="Suzuki", model="Katana 600/750", name="Suzuki Katana 600 / 750 (GSX600F / GSX750F)", years=[1988, 2006],
  match=["katana 600", "katana 750", "gsx600f", "gsx750f", "gsx 600f", "gsx 750f"], style="sport", drive="chain",
  engine="600 or 748 cc oil-cooled DOHC inline four, four carbs",
  intro="A comfy sport tourer. Gummed carbs are the usual reason one won't run right.",
  focus=[["600 or 750 four", "Oil-cooled"], ["Four carbs", "Gum up when stored"], ["Fork seals", "Check for leaks"], ["Charging", "Check voltage"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"G": ["If it sat, clean the carbs fully. Gummed jets are the most common problem."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Carbs", what="Carburetor gumming and clogged jets cause rough idle and hesitation.", src="https://www.motoryk.com/bikes/suzuki/gsx600f-katana/problems")],
  forums=[]))

B17.append(dict(id="suzuki-gsx-r750-1996", make="Suzuki", model="GSX-R750", name="Suzuki GSX-R750", years=[1996, 2026],
  match=["gsx-r750", "gsxr750", "gsxr 750", "gixxer 750"], style="sport", drive="chain",
  engine="749 cc liquid-cooled DOHC inline four (carbs on early bikes, fuel injected later)",
  intro="Suzuki's long-running 750. Check the brake master cylinder and chain adjuster recalls.",
  focus=[["749 cc four", "Liquid-cooled"], ["Carb or EFI", "Depends on year"], ["Brake recall", "2004-2013"], ["Chain adjuster recall", "2011-2014"], ["Brake fluid", "Change it"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2004-2013 GSX-R750s are in recall 13V449 (front brake master cylinder). 2011-2014 bikes are in recall 14V629 (chain adjuster).", reason="Both are safety recalls and the fixes are free.")},
  add=[], lessons={"G": ["Early bikes have carbs and later ones are fuel injected. Skip the steps that don't match your bike."], "K": ["Old brake fluid is what makes the master cylinder piston corrode. Change it on schedule."]},
  recalls=[GSXR_RECALL, CHAIN_RECALL], known=[], forums=[]))

B17.append(dict(id="suzuki-gsx-r1000-2001", make="Suzuki", model="GSX-R1000", name="Suzuki GSX-R1000", years=[2001, 2016],
  match=["gsx-r1000", "gsxr1000", "gsxr 1000", "gixxer 1000"], style="sport", drive="chain",
  engine="988 or 999 cc liquid-cooled DOHC inline four, fuel injected",
  intro="Suzuki's literbike. Check the brake master cylinder and chain adjuster recalls.",
  focus=[["999 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Brake recall", "2005-2013"], ["Chain adjuster recall", "2009-2014"], ["Brake fluid", "Change it"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2005-2013 GSX-R1000s are in recall 13V449 (front brake master cylinder). 2009-2014 bikes are in recall 14V629 (chain adjuster).", reason="Both are safety recalls and the fixes are free.")},
  add=[], lessons={"K": ["Old brake fluid is what makes the master cylinder piston corrode. Change it on schedule."]},
  recalls=[GSXR_RECALL, CHAIN_RECALL], known=[], forums=[]))

B17.append(dict(id="suzuki-dr-z400-2000", make="Suzuki", model="DR-Z400", name="Suzuki DR-Z400", years=[2000, 2026],
  match=["dr-z400", "drz400", "drz 400", "dr-z400s", "dr-z400sm", "drz400s", "drz400sm", "dr-z4s"], style="dualsport", drive="chain",
  engine="398 cc liquid-cooled DOHC single, carb (the new 2025 DR-Z4S is fuel injected)",
  intro="A tough dual-sport. The stator, the front sprocket nut and the bearings are the things to watch.",
  focus=[["398 cc single", "Liquid-cooled"], ["Carb", "Jetting and cleaning"], ["Stator", "Hard starting"], ["Sprocket nut", "Can back off"], ["Bearings", "Swingarm and steering"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2025-2026 models are in recall 25V873 for the rear brake.", reason="A brake problem can cost you stopping power. The fix is free.")},
  add=[step("X-DRZ-01", "E", "E-002", "Check the front sprocket nut", "Pull the sprocket cover and check the front sprocket nut is tight and locked.", "Owners say the front sprocket nut coming loose is a common problem.", "ThumperTalk via Engine Patrol", hours=0.5)],
  lessons={"G": ["Older bikes have a carb. The 2025 DR-Z4S is fuel injected. Skip the steps that don't match your bike."]},
  recalls=[dict(id="25V873", years="2025-2026 (some)", what="Rear brake fastener issue that could cause a loss of braking power.", fix="Free dealer repair.", src="https://www.advpulse.com/?p=123903")],
  known=[dict(title="Stator", what="Hard starting on older bikes is often a stator that failed early.", src="https://enginepatrol.com/?p=14768")],
  forums=[]))

B17.append(dict(id="suzuki-dr200-1996", make="Suzuki", model="DR200", name="Suzuki DR200", years=[1996, 2026],
  match=["dr200", "dr 200", "dr200s", "dr200se"], style="dualsport", drive="chain",
  engine="199 cc air-cooled SOHC single, one carb",
  intro="A simple, light trail bike. Mostly routine carb, chain and valve care.",
  focus=[["199 cc single", "Air-cooled"], ["One carb", "Clean if stored"], ["Valves", "Check clearances"], ["Chain drive", "Slack and lube"], ["Tires", "Check age"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B17.append(dict(id="suzuki-tu250x-2009", make="Suzuki", model="TU250X", name="Suzuki TU250X", years=[2009, 2020],
  match=["tu250x", "tu250", "tu 250"], style="standard", drive="chain",
  engine="249 cc air-cooled SOHC single, fuel injected",
  intro="A simple retro single. Fuel injected and easy to keep running.",
  focus=[["249 cc single", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check clearances"], ["Chain drive", "Slack and lube"], ["Battery", "Keep it charged"]],
  remove=EFI + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B17.append(dict(id="suzuki-boulevard-m50-2005", make="Suzuki", model="Boulevard M50", name="Suzuki Boulevard M50", years=[2005, 2009],
  match=["boulevard m50", "m50", "vz800", "marauder 800"], style="cruiser", drive="shaft",
  engine="805 cc liquid-cooled SOHC V-twin, fuel injected, shaft drive",
  intro="A simple mid-size cruiser. Some 2008-2009 bikes were in a 2011 recall, so check the VIN.",
  focus=[["805 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["2011 recall", "Some 2008-09"], ["Shaft drive", "Final drive oil"], ["Cooling", "Check coolant"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2008-2010 C50 and M50 Boulevards were in recall 11V108.", reason="Recall repairs are free.")},
  add=[], lessons={},
  recalls=[dict(id="11V108", years="2008-2010 (some)", what="Recall covering certain Suzuki models including the C50/M50 Boulevard.", fix="Free dealer repair.", src="https://issues.cycleworld.com/article/2011/5/1/recall-roster")],
  known=[], forums=[]))

HERO_NAME_B17 = {"suzuki-sv650-1999": "SV650", "suzuki-bandit-1200-1996": "BANDIT", "suzuki-bandit-600-1995": "BANDIT 600", "suzuki-katana-600-750-1988": "KATANA",
  "suzuki-gsx-r750-1996": "GSX-R750", "suzuki-gsx-r1000-2001": "GSX-R1000", "suzuki-dr-z400-2000": "DR-Z400", "suzuki-dr200-1996": "DR200",
  "suzuki-tu250x-2009": "TU250X", "suzuki-boulevard-m50-2005": "M50"}
