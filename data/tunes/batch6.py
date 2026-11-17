"""Batch 6 bike tunes (top 100, rows 53-62)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B6 = []
KZR = dict(name="KZRider forum", url="https://www.kzrider.com/", what="Owner forum for classic Kawasakis.")
XJ = dict(name="XJBikes forum", url="https://www.xjbikes.com/", what="Owner forum for Yamaha XJ models.")
XS4 = dict(name="XS400.com forum", url="https://www.xs400.com/", what="Owner forum for the Yamaha XS400.")
TWO = lambda n,m,ids,yrs,eng,intro,style="standard": None

B6.append(dict(id="kawasaki-gpz550-1981", make="Kawasaki", model="GPz550", name="Kawasaki GPz550", years=[1981, 1985],
  match=["gpz550", "gpz 550", "kz550h", "zx550"], style="sport", drive="chain",
  engine="553 cc air-cooled DOHC inline four, four carbs",
  intro="Kawasaki's early-80s sport 550. Shares a lot with the KZ550, but some trim parts are rare.",
  focus=[["553 cc DOHC four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Tank and fuel", "Rust clogs the carbs"], ["Rare parts", "Trim and gauges"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={}, add=[],
  lessons={"G": ["Clean the tank, lines and petcock before the rebuilt carbs go on. Rust and gunk from storage are common."], "A": ["Some GPz550 parts were made for one model year only. Check part numbers before you buy."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Rust in the fuel system", what="Long storage fills the tank, lines and carbs with rust and gunk.", src="https://cdnbkr.ca/vintage-motorcycles/great-chemistry-a-gpz550-revival")],
  forums=[KZR]))

B6.append(dict(id="yamaha-v-star-650-1998", make="Yamaha", model="V Star 650", name="Yamaha V Star 650", years=[1998, 2016],
  match=["v star 650", "vstar 650", "v-star 650", "xvs650", "dragstar 650", "drag star 650"], style="cruiser", drive="shaft",
  engine="649 cc air-cooled V-twin, carbs, shaft drive",
  intro="A simple, common cruiser. Most trouble comes from gummed carbs and the fuel pump.",
  focus=[["649 cc V-twin", "Air-cooled"], ["Carbs", "Gum up when stored"], ["Fuel pump", "Check flow"], ["Shaft drive", "Final drive oil"], ["Charging", "Test the stator"]],
  remove=["G-005"] + AIR, patch={}, add=[],
  lessons={"G": ["Bogging and backfiring usually trace to the carbs or a weak fuel pump. Check fuel flow before you blame the jets."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Carbs and fuel pump", what="Bogging, backfiring and fuel pump faults are common owner complaints.", src="https://cararac.com/blog/ommon-problems-with-yamaha-v-star-650.html")],
  forums=[]))

RDK = dict(title="Crank seals", what="Old two-stroke crank seals leak and need a full engine split.", src="https://hobby-machinist.com/threads/a-bicentenial-restoration-rescue-76-rd400.86132/page-2")
RD_ADD = [step("X-RD-01", "H", "H-001", "Leak-down test the crankcase", "Seal the intake and exhaust ports and pressure test the crankcase. A failed test means new crank seals, which needs the cases split.", "Leaking crank seals let a two-stroke run lean and seize.", "RD400 restoration thread", skill="Advanced", hours=2.0),
          step("X-RD-02", "H", "H-001", "Service the Autolube oil pump", "Check the oil pump cable adjustment and bleed the lines so both cylinders get oil. Look for sludge or stuck parts if it won't pump.", "The engine is lubricated only by the injected oil.", "Yamaha Autolube notes", hours=1.0)]
for i,n,y,cc in [("yamaha-rd350-1973","RD350",[1973,1975],"347"),("yamaha-rd400-1976","RD400",[1976,1979],"398")]:
    B6.append(dict(id=i, make="Yamaha", model=n, name="Yamaha "+n, years=y,
      match=[n.lower(), n.lower().replace("rd","rd "), "rd"+cc[:3]], style="standard", drive="chain",
      engine=cc+" cc air-cooled two-stroke twin, two carbs, Autolube oil injection",
      intro="Yamaha's street two-stroke twin. Crank seals and the oil pump decide whether it lives or seizes.",
      focus=[["Two-stroke twin", "Air-cooled"], ["Crank seals", "Leak with age"], ["Autolube pump", "Check and bleed"], ["Two carbs", "Clean and sync"], ["Expansion chambers", "Rust inside"]],
      remove=CARB + AIR + ["H-003"], patch={}, add=RD_ADD, lessons={},
      recalls=[], recallNote=OLD, known=[RDK], forums=[]))

B6.append(dict(id="yamaha-bolt-2014", make="Yamaha", model="Bolt", name="Yamaha Bolt", years=[2014, 2026],
  match=["bolt", "xvs950", "xv950", "bolt r-spec", "star bolt"], style="cruiser", drive="belt",
  engine="942 cc air-cooled V-twin, fuel injected, belt drive",
  intro="Yamaha's small bobber. Simple to service, with two recalls to clear on some years.",
  focus=[["942 cc V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Belt drive", "Check for cracks and tension"], ["Recalls", "2014 wiring, 2020-21 oil leak"], ["Low seat", "Easy to work around"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2014 Bolts were in recall 13V298 for a wiring harness that can melt, and some 2020-2021 Bolt R-Specs were in recall 21V806 for an engine case that can leak oil onto the rear tire.", reason="Both can cause a crash. Repairs are free.")},
  add=[], lessons={},
  recalls=[dict(id="13V298", years="2014", what="Wiring harness may melt and stall the engine.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/13V298000"),
           dict(id="21V806", years="2020-2021 R-Spec (some)", what="Engine case may leak oil onto the rear tire. Do not ride until fixed.", fix="Free dealer repair.", src="https://motorsportsnewswire.com/?p=166149")],
  known=[], forums=[]))

B6.append(dict(id="yamaha-tenere-700-2021", make="Yamaha", model="Tenere 700", name="Yamaha Tenere 700", years=[2021, 2026],
  match=["tenere 700", "ténéré 700", "t7", "xtz700", "xtz7"], style="adventure", drive="chain",
  engine="689 cc liquid-cooled parallel twin, fuel injected",
  intro="Yamaha's off-road-ready adventure twin, built on the MT-07 engine. Check two do-not-ride recalls.",
  focus=[["689 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "2022 brakes, 2025 signals"], ["Off-road wear", "Bearings and chain"], ["Crash damage", "Bars, guards, subframe"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. Some 2022 Tenere 700s are in recall 23V472 for front brake caliper bolts, and 2025 bikes are in recall 26V367 for the turn signals. Both carry a do-not-ride advisory until repaired.", reason="The 2022 caliper can detach and cost you the front brake.")},
  add=[], lessons={"E": ["Check the subframe and crash bar mounts for cracks after any off-road drop."]},
  recalls=[dict(id="23V472", years="2022 (some)", what="Front brake caliper bolts may be the wrong length and the caliper can detach.", fix="Dealer inspects and replaces the bolts free.", src="https://vehiclesafetyrecalls.com/recall/23V472000"),
           dict(id="26V367", years="2025", what="Turn signals may fail. Do not ride until repaired.", fix="Free dealer repair (Yamaha 990190).", src="https://www.carwhere.com/recalls/campaign/26V367000")],
  known=[], forums=[]))

B6.append(dict(id="yamaha-xs400-1977", make="Yamaha", model="XS400", name="Yamaha XS400", years=[1977, 1982],
  match=["xs400", "xs 400", "xs400 special", "xs400 maxim", "xs400 seca"], style="standard", drive="chain",
  engine="391 cc air-cooled SOHC parallel twin, two carbs",
  intro="A cheap, common Yamaha twin. The usual weak spots are the charging parts and starter clutch.",
  focus=[["391 cc twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Regulator/rectifier", "Common failure"], ["Starter clutch", "Slips with weak springs"], ["Wiring", "Check under the seat"]],
  remove=CARB + AIR, patch={},
  add=[step("X-XS4-01", "F", "F-004", "Check the starter clutch", "If the starter spins but the engine only turns now and then, the starter clutch is slipping. Check its springs and rollers.", "Worn or broken starter clutch springs are a known XS400 fault.", "XS400.com forum", hours=1.5)],
  lessons={"F": ["The voltage regulator/rectifier is a common failure on these. Test it before blaming the stator."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Regulator/rectifier", what="A common failure on XS400s.", src="https://www.xs400.com/threads/the-xs400-flaws.11473/")],
  forums=[XS4]))

B6.append(dict(id="yamaha-xsr900-2022", make="Yamaha", model="XSR900", name="Yamaha XSR900", years=[2022, 2026],
  match=["xsr900", "xsr 900"], style="standard", drive="chain",
  engine="890 cc liquid-cooled inline triple, fuel injected",
  intro="Yamaha's retro-styled triple, on the MT-09 platform. Check the throttle sensor recall.",
  focus=[["890 cc triple", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Recall", "Throttle position sensor"], ["Chain drive", "Slack and lube"], ["Shared platform", "Same as MT-09"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2022-2024 XSR900s are in recall 25V248 for the throttle position sensor.", reason="A failing sensor can cause unstable idle or a stall. The repair is free.")},
  add=[], lessons={},
  recalls=[dict(id="25V248", years="2022-2024 (some)", what="Throttle position sensor can fail, causing rough idle or a stall.", fix="Free dealer repair.", src="https://www.vehiclesafetyrecalls.com/recall/25V248000")],
  known=[], forums=[]))

B6.append(dict(id="yamaha-xj550-maxim-1981", make="Yamaha", model="XJ550", name="Yamaha XJ550 Maxim / Seca", years=[1981, 1983],
  match=["xj550", "xj 550", "xj550 maxim", "xj550 seca", "maxim 550", "seca 550"], style="standard", drive="chain",
  engine="528 cc air-cooled DOHC inline four, four Mikuni carbs, YICS",
  intro="A light, quick Yamaha four. Carb setup is fussy, and the YICS passage plugs matter.",
  focus=[["528 cc DOHC four", "Air-cooled"], ["Four carbs", "Fussy float setup"], ["YICS", "Check the end plugs"], ["Charging", "Test the stator"], ["Chain drive", "Sprockets and chain"]],
  remove=CARB + AIR, patch={},
  add=[step("X-XJ5-01", "G", "G-006", "Check the YICS passage plugs", "Look at both ends of the YICS passage in the cylinder head. The plugs must be there and sealed.", "A missing YICS plug causes starting and idle problems.", "XJBikes forum", hours=0.3)],
  lessons={"G": ["The XJ550 carb rack is fussy. Set the float heights, then check the fuel level with the bike running."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="YICS plugs", what="Missing plugs at the ends of the YICS passage upset idle and starting.", src="https://xjbikes.com/forums/posts/73805")],
  forums=[XJ]))

B6.append(dict(id="yamaha-wr250r-2008", make="Yamaha", model="WR250R", name="Yamaha WR250R", years=[2008, 2020],
  match=["wr250r", "wr 250 r", "wr250x", "wr250"], style="dualsport", drive="chain",
  engine="250 cc liquid-cooled single, fuel injected",
  intro="A high-revving dual-sport single. Most 2008-2015 bikes needed the stator recall.",
  focus=[["250 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Stator recall", "2008-2015"], ["Valve clearances", "Check on schedule"], ["Off-road wear", "Bearings and chain"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2008-2015 WR250Rs were in recall 15V410 for the stator. The new stator has a white core. Some 2014-2016 bikes also had a clutch recall (16V800).", reason="The old stator can short out and kill the charging system. Repairs are free.")},
  add=[], lessons={},
  recalls=[dict(id="15V410", years="2008-2015", what="Stator coil insulation can fail and short out.", fix="Dealer fits a new stator free (white core).", src="https://static.nhtsa.gov/odi/rcl/2015/RCLRPT-15V410-1220.PDF")],
  known=[], forums=[]))

HERO_NAME_B6 = {"kawasaki-gpz550-1981": "GPZ550", "yamaha-v-star-650-1998": "V STAR", "yamaha-rd350-1973": "RD350", "yamaha-bolt-2014": "BOLT",
  "yamaha-rd400-1976": "RD400", "yamaha-tenere-700-2021": "TENERE", "yamaha-xs400-1977": "XS400", "yamaha-xsr900-2022": "XSR900",
  "yamaha-xj550-maxim-1981": "XJ550", "yamaha-wr250r-2008": "WR250R"}
