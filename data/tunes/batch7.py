"""Batch 7 bike tunes (top 100, rows 63-72)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B7 = []
XJ = dict(name="XJBikes forum", url="https://www.xjbikes.com/", what="Owner forum for Yamaha XJ models.")
XS11 = dict(name="XS11 Club forum", url="https://xs11.club/forum/", what="Owner forum for the XS1100 and XJ1100.")
DRW = dict(name="DR650 Wiki", url="https://dr650.fandom.com/wiki/Potential_problems_to_be_aware_of", what="Owner-written list of known DR650 issues by year.")

B7.append(dict(id="yamaha-xj650-maxim-1980", make="Yamaha", model="XJ650 Maxim", name="Yamaha XJ650 Maxim", years=[1980, 1983],
  match=["xj650", "xj 650", "maxim 650", "xj650 maxim", "xj650 seca", "seca 650"], style="standard", drive="shaft",
  engine="653 cc air-cooled DOHC inline four, four Hitachi carbs, shaft drive",
  intro="Yamaha's shaft-drive four. Smooth and tough, but the carbs and the YICS plugs need attention.",
  focus=[["653 cc DOHC four", "Air-cooled"], ["Hitachi carbs", "Clean as a set"], ["YICS", "Check the end plugs"], ["Shaft drive", "Final drive oil"], ["Charging", "Test the stator"]],
  remove=CARB + AIR, patch={},
  add=[step("X-XJ6-01", "G", "G-006", "Check the YICS passage plugs", "Look at both ends of the YICS passage in the cylinder head. The plugs must be there and sealed.", "A missing YICS plug causes starting and idle problems.", "XJBikes forum", hours=0.3)],
  lessons={"G": ["The Hitachi carbs on the XJ650 have small passages that clog in storage. Clean them all, not just the jets."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="YICS plugs", what="Missing plugs at the ends of the YICS passage upset idle and starting.", src="https://xjbikes.com/forums/posts/73805")],
  forums=[XJ]))

B7.append(dict(id="suzuki-sv650-2017", make="Suzuki", model="SV650", name="Suzuki SV650", years=[2017, 2026],
  match=["sv650", "sv 650", "sv650x", "sv650a"], style="standard", drive="chain",
  engine="645 cc liquid-cooled 90-degree V-twin, fuel injected",
  intro="A simple, tough V-twin standard. Mostly routine service, plus a careful look at crash damage.",
  focus=[["645 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Chain drive", "Slack and lube"], ["Crash damage", "Bars, levers, radiator"], ["Cooling", "Coolant age"]],
  remove=EFI, patch={}, add=[], lessons={"E": ["Many SVs are first bikes and get dropped. Check the bar ends, levers, footpegs and radiator for damage."]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B7.append(dict(id="yamaha-xs750-triple-1976", make="Yamaha", model="XS750", name="Yamaha XS750 Triple", years=[1976, 1979],
  match=["xs750", "xs 750", "xs750 triple", "xs750se", "xs750e", "xs750f", "xs850"], style="standard", drive="shaft",
  engine="747 cc air-cooled DOHC inline triple, three Mikuni carbs, shaft drive",
  intro="Yamaha's shaft-drive triple. Known for second gear trouble and fussy vacuum petcocks.",
  focus=[["747 cc DOHC triple", "Air-cooled"], ["Three carbs", "Clean and sync"], ["Second gear", "Can pop out"], ["Vacuum petcocks", "Leak into carbs"], ["Shaft drive", "Final drive oil"]],
  remove=CARB + AIR, patch={},
  add=[step("X-XS7-01", "H", "H-005", "Test second gear under load", "On a test ride, load the bike hard in second gear. If it pops out, the shift forks or gear dogs are worn and the cases need to come apart.", "Second gear failure is the best-known XS750 fault.", "XS650.com forum", hours=0.5)],
  lessons={"G": ["Check the vacuum petcocks. A leaking diaphragm can flood the carbs or pull fuel into the engine."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Second gear", what="Second gear can pop out, often fixed by shimming or new parts.", src="https://www.xs650.com/threads/is-an-xs750-worth-messing-with.14285/")],
  forums=[]))

B7.append(dict(id="suzuki-v-strom-650-2012", make="Suzuki", model="V-Strom 650", name="Suzuki V-Strom 650", years=[2012, 2016],
  match=["v-strom 650", "vstrom 650", "v strom 650", "dl650", "wee-strom", "weestrom"], style="adventure", drive="chain",
  engine="645 cc liquid-cooled V-twin, fuel injected",
  intro="The second-generation Wee-Strom. Reliable, but three recalls hit these years.",
  focus=[["645 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "Stator, cams, brake switch"], ["Chain drive", "Slack and lube"], ["Luggage mounts", "Check for cracks"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2012-2016 bikes were in recall 16V878 for the stator. 2012-2014 bikes were in recall 15V852 for tappet and cam wear. Some 2012 bikes had a front brake light switch recall (12V038).", reason="A failed stator can stall the bike. Repairs are free.")},
  add=[], lessons={},
  recalls=[dict(id="16V878", years="2012-2016", what="Stator can short out and stop charging, which can stall the engine.", fix="Dealer replaces the stator free.", src="https://www.hupy.com/news/suzuki-v-strom-and-kingsquad-recall.cfm"),
           dict(id="15V852", years="2012-2014", what="Tappets and camshafts can wear early.", fix="Free dealer inspection and repair.", src="https://motorcyclistonline.com/recall-suzuki-recalls-sfv650-v-strom-650-and-burgman-650-for-tappet-cam-wear-issues")],
  known=[], forums=[]))

B7.append(dict(id="yamaha-xs1100-1978", make="Yamaha", model="XS1100", name="Yamaha XS1100", years=[1978, 1981],
  match=["xs1100", "xs 1100", "xs11", "xs eleven", "xs1100 special", "venturer"], style="standard", drive="shaft",
  engine="1101 cc air-cooled DOHC inline four, four carbs, shaft drive",
  intro="Yamaha's big shaft-drive four. Tough engine, but the ignition wiring is a known weak spot.",
  focus=[["1101 cc DOHC four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Pulser wires", "Break near the advance"], ["Shaft drive", "Final drive oil"], ["Weight", "Use a good stand"]],
  remove=CARB + AIR, patch={},
  add=[step("X-XS11-01", "F", "F-003", "Check the pulser coil wires", "Take off the left lower cover and inspect the braided wires from the pulser coils to the harness. Look for breaks near the splice.", "Broken pulser wires are a common reason two cylinders stop firing.", "XS11 Club forum", hours=1.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Pulser coil wires", what="The braided wires to the pulser coils break and kill two cylinders.", src="https://xs11.club/forum/idle-talk-forum/xs11-xj11-discussion/876496-1981-xs1100-midnight-special-slow-restoration?p=878845")],
  forums=[XS11]))

B7.append(dict(id="suzuki-gsx-r600-2011", make="Suzuki", model="GSX-R600", name="Suzuki GSX-R600", years=[2011, 2024],
  match=["gsx-r600", "gsxr600", "gsxr 600", "gixxer 600"], style="sport", drive="chain",
  engine="599 cc liquid-cooled DOHC inline four, fuel injected",
  intro="Suzuki's 600 supersport. Check the front brake recall on 2011-2013 bikes and look hard for crash damage.",
  focus=[["599 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Front brake recall", "2011-2013"], ["Crash damage", "Frame, subframe, fairings"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2004-2013 GSX-R600s were in recall 13V449 for front brake master cylinder corrosion.", reason="A corroded piston gives a soft lever and longer stops. The repair is free.")},
  add=[], lessons={"E": ["Check the frame spars, subframe and fairing mounts for scrapes and cracks. Track and street crashes are common on these."]},
  recalls=[dict(id="13V449", years="2004-2013", what="Front brake master cylinder piston can corrode, giving a soft lever.", fix="Dealer replaces the master cylinder parts free.", src="https://vehiclesafetyrecalls.com/recall/13V449000")],
  known=[], forums=[]))

B7.append(dict(id="yamaha-sr500-1978", make="Yamaha", model="SR500", name="Yamaha SR500", years=[1978, 1981],
  match=["sr500", "sr 500", "sr400"], style="cafe", drive="chain",
  engine="499 cc air-cooled SOHC single, one carb, kick start only",
  intro="A kick-only big single. Simple, but it needs the right starting routine and correct valve clearances.",
  focus=[["499 cc single", "Air-cooled"], ["Kick start", "Learn the routine"], ["Decompressor", "Check the cable"], ["Valve clearances", "Tight valves = hard start"], ["One carb", "Easy to clean"]],
  remove=CARB + AIR, patch={},
  add=[step("X-SR5-01", "H", "H-003", "Check the decompressor", "Make sure the decompression lever cable has a little free play and the valve opens and closes cleanly.", "A worn or misadjusted decompressor makes the bike hard to kick and can cause kickback.", "Motoryk SR500 notes", hours=0.5)],
  lessons={"B": ["Starting routine: choke on, pull the decompressor, ease the kickstarter until the silver mark shows in the window, release the lever, then give one full kick."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Hard starting", what="Tight exhaust valves and a worn decompressor are common causes.", src="https://motoryk.com/bikes/yamaha/sr500")],
  forums=[]))

B7.append(dict(id="suzuki-hayabusa-1999", make="Suzuki", model="Hayabusa", name="Suzuki Hayabusa", years=[1999, 2007],
  match=["hayabusa", "gsx1300r", "gsx 1300 r", "busa"], style="sport", drive="chain",
  engine="1299 cc liquid-cooled DOHC inline four, fuel injected",
  intro="The first-generation Busa. Check the cam chain tensioner, second gear and any drag-bike mods.",
  focus=[["1299 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cam chain tensioner", "Rattle and wear"], ["Second gear", "Check for popping out"], ["Mods", "Stretch kits and nitrous"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 1999 Hayabusas were in recall 00V319 (which replaced 99V270) because the cam chain tensioner spring could break.", reason="A jumped cam chain can wreck the engine.")},
  add=[step("X-BUSA-01", "H", "H-003", "Check the cam chain tensioner", "Listen for a rattle at idle. Pull the tensioner and check that it holds the chain. Replace it if in doubt.", "A weak tensioner lets the cam chain slap or jump teeth.", "Au7o Hayabusa notes", hours=1.0)],
  lessons={"H": ["Second gear on first-generation bikes can pop out after hard shifting. Test it under load on the ride."]},
  recalls=[dict(id="00V319", years="1999", what="Cam chain tensioner spring can break and let the chain jump.", fix="Dealer replaced the tensioner.", src="https://au7o.io/motorcycle-issues/suzuki-hayabusa?year=1999")],
  known=[], forums=[]))

B7.append(dict(id="yamaha-xv750-virago-1981", make="Yamaha", model="XV750 Virago", name="Yamaha XV750 Virago", years=[1981, 1997],
  match=["virago 750", "xv750", "xv 750", "virago xv750"], style="cruiser", drive="shaft",
  engine="748 cc air-cooled V-twin, two carbs, shaft drive",
  intro="Yamaha's first V-twin cruiser. Dependable, with one famous weak spot: the starter gears.",
  focus=[["748 cc V-twin", "Air-cooled"], ["Starter gears", "Grind and slip"], ["Two carbs", "Clean and sync"], ["Shaft drive", "Final drive oil"], ["Charging", "Test the regulator"]],
  remove=CARB + AIR, patch={},
  add=[step("X-XV7-01", "F", "F-004", "Check the starter gears", "If the starter grinds or spins without turning the engine, check the starter idler gear and its tension clip. Yamaha's fix is a new clip, part 904-68291-06-00.", "Worn starter gears are the Virago's best-known fault.", "Canada Moto Guide Virago starter notes", hours=1.5)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Starter grinding", what="The starter drive gears wear and grind. The starter motor itself is usually fine.", src="https://canadamotoguide.com/images/stories/archives/sonic/ViragoStarters/home.html")],
  forums=[]))

B7.append(dict(id="suzuki-dr650-1996", make="Suzuki", model="DR650", name="Suzuki DR650", years=[1996, 2026],
  match=["dr650", "dr 650", "dr650se", "dr650s"], style="dualsport", drive="chain",
  engine="644 cc air/oil-cooled SOHC single, one carb",
  intro="A tough, simple dual-sport single. A few known weak spots, all cheap to fix.",
  focus=[["644 cc single", "Air/oil-cooled"], ["One carb", "Lean from the factory"], ["Countershaft seal", "Oil leaks"], ["Upper chain roller", "Can crack the frame"], ["Countershaft nut", "Check torque"]],
  remove=CARB + AIR, patch={},
  add=[step("X-DR6-01", "H", "H-005", "Check the countershaft nut and seal", "With the clutch cover off, check the countershaft nut torque (72.5 ft-lb, left-hand thread). Look for oil at the countershaft seal and fit the seal retainer, Suzuki part 24751-32E00.", "A loose nut damages the key, and a leaking seal sprays oil on the chain.", "DR650 Wiki", hours=1.5),
       step("X-DR6-02", "E", "E-002", "Check the upper chain roller mount", "Inspect the frame where the upper chain roller bolts on. Look for cracks around the hole.", "The roller mount can crack the frame.", "DR650 Wiki", hours=0.3)],
  lessons={"G": ["The stock carb runs lean. Popping on decel or a rough idle at altitude often goes away with a jet or needle change."]},
  recalls=[], recallNote=VIN, known=[], forums=[DRW]))

HERO_NAME_B7 = {"yamaha-xj650-maxim-1980": "XJ650", "suzuki-sv650-2017": "SV650", "yamaha-xs750-triple-1976": "XS750", "suzuki-v-strom-650-2012": "V-STROM",
  "yamaha-xs1100-1978": "XS1100", "suzuki-gsx-r600-2011": "GSX-R600", "yamaha-sr500-1978": "SR500", "suzuki-hayabusa-1999": "HAYABUSA",
  "yamaha-xv750-virago-1981": "VIRAGO", "suzuki-dr650-1996": "DR650"}
