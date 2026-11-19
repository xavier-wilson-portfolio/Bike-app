"""Batch 43 bike tunes (top 500, rows 421-430)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch27 import BMWNOTE, MOA
from batch20 import TRF
from batch42 import BOXER
B43 = []
TRNOTE = "Triumph has issued recalls on some bikes in these years. Run your VIN at nhtsa.gov/recalls before you start."
AIRHEAD = dict(name="Airheads Beemer Club", url="https://airheads.org/", what="Club and forum for air-cooled BMW twins.")
SLASH2 = dict(name="BMW Vintage Club", url="https://www.bmwvintageclub.org/", what="Club for pre-1970 BMW motorcycles.")

B43.append(dict(id="bmw-f650cs-g650gs-2002", make="BMW", model="F650CS / G650GS", name="BMW F650CS Scarver / G650GS", years=[2002, 2016],
  match=["f650cs", "f 650 cs", "scarver", "g650gs sertao", "sertao"], style="standard", drive="belt",
  engine="652 cc liquid-cooled single (Rotax), fuel injected",
  intro="BMW's 650 singles after the first F650. The CS has belt drive; the G650GS is chain driven.",
  focus=[["652 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Final drive", "Belt or chain"], ["Cooling", "Coolant and fan"], ["Fuel tank", "Under seat"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B43.append(dict(id="bmw-g310r-2017", make="BMW", model="G310R", name="BMW G310R", years=[2017, 2026],
  match=["g310r", "g 310 r", "g310 r", "g310rr"], style="standard", drive="chain",
  engine="313 cc liquid-cooled single with reversed cylinder head, fuel injected",
  intro="BMW's small naked single, built in India by TVS. Fuel injected and simple.",
  focus=[["313 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check interval"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B43.append(dict(id="bmw-r18-2020", make="BMW", model="R 18", name="BMW R 18", years=[2020, 2026],
  match=["r18", "r 18", "r18 classic", "r18 transcontinental", "r18 b", "r 18 b"], style="cruiser", drive="shaft",
  engine="1802 cc air/oil-cooled boxer twin, fuel injected, exposed shaft drive",
  intro="BMW's big-boxer cruiser. Huge cylinders, an exposed driveshaft and a lot of chrome.",
  focus=[["1802 cc boxer", "Air/oil cooled"], ["Fuel injected", "No carbs"], ["Shaft drive", "Check oil"], ["Valves", "Check interval"], ["Electronics", "Ride modes"]],
  remove=EFI, patch={}, add=[], lessons={"H": [BOXER]},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B43.append(dict(id="bmw-r1250rt-2019", make="BMW", model="R1250RT", name="BMW R1250RT", years=[2019, 2026],
  match=["r1250rt", "r 1250 rt", "r1250 rt", "r1300rt"], style="touring", drive="shaft",
  engine="1254 cc air/liquid-cooled ShiftCam boxer twin, fuel injected, shaft drive",
  intro="The ShiftCam RT. Lots of electronics, a big fairing and shaft drive.",
  focus=[["ShiftCam boxer", "Air/liquid cooled"], ["Fuel injected", "No carbs"], ["Final drive", "Check oil and play"], ["Electronics", "CANbus"], ["Fairing", "Many panels"]],
  remove=EFI, patch={}, add=[], lessons={"H": [BOXER]},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B43.append(dict(id="bmw-s1000xr-2015", make="BMW", model="S1000XR", name="BMW S1000XR", years=[2015, 2026],
  match=["s1000xr", "s 1000 xr", "s1000 xr", "m1000xr"], style="adventure", drive="chain",
  engine="999 cc liquid-cooled inline four, fuel injected",
  intro="The sport-touring version of the S1000RR engine. Tall, fast and full of electronics.",
  focus=[["999 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Ride modes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B43.append(dict(id="bmw-r1200r-r1250r-2006", make="BMW", model="R1200R / R1250R", name="BMW R1200R / R1250R", years=[2006, 2026],
  match=["r1200r", "r1250r", "r 1200 r", "r 1250 r", "r1200r classic", "r1300r"], style="standard", drive="shaft",
  engine="1170 or 1254 cc boxer twin, air/oil then air/liquid cooled, fuel injected, shaft drive",
  intro="BMW's naked boxer roadsters. Shaft drive and an engine you can reach easily.",
  focus=[["Boxer twin", "Air/oil or liquid"], ["Fuel injected", "Sync bodies"], ["Final drive", "Check oil and play"], ["Clutch", "Dry or wet"], ["Electronics", "CANbus"]],
  remove=EFI, patch={}, add=[], lessons={"H": [BOXER]},
  recalls=[], recallNote=BMWNOTE, known=[], forums=[MOA]))

B43.append(dict(id="bmw-r60-2-and-r69s-slash-2-1955", make="BMW", model="R50 / R60 / R69S (Earles fork)", name="BMW R50, R60/2 and R69S", years=[1955, 1969],
  match=["r60/2", "r69s", "r50/2", "r60", "r69", "r50s", "earles fork"], style="standard", drive="shaft",
  engine="494 to 594 cc air-cooled boxer twin, two carbs, magneto ignition, six-volt",
  intro="The Earles-fork BMW twins. Magneto ignition, six-volt electrics and a lot of careful parts hunting.",
  focus=[["Boxer twin", "Air-cooled"], ["Two carbs", "Bing, sync them"], ["Magneto", "Check it"], ["Six-volt", "Weak lights"], ["Shaft drive", "Check oil"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"F": ["These are six-volt bikes with a magneto. Use six-volt parts and don't add a 12-volt battery without converting the whole system."]},
  recalls=[], recallNote=OLD, known=[], forums=[SLASH2]))

B43.append(dict(id="bmw-r90s-1973", make="BMW", model="R90S", name="BMW R90S", years=[1973, 1976],
  match=["r90s", "r 90 s", "r90 s"], style="sport", drive="shaft",
  engine="898 cc air-cooled boxer twin, Dell'Orto carbs, points",
  intro="BMW's first superbike. Dell'Orto carbs, a bikini fairing and smoke paint that's hard to match.",
  focus=[["Boxer twin", "Air-cooled"], ["Dell'Orto carbs", "Accelerator pumps"], ["Points", "Gap and time"], ["Shaft drive", "Check oil"], ["Paint", "Smoke finish"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"H": [BOXER]},
  recalls=[], recallNote=OLD, known=[], forums=[AIRHEAD]))

B43.append(dict(id="triumph-speed-triple-1200-rs-2021", make="Triumph", model="Speed Triple 1200 RS / RR", name="Triumph Speed Triple 1200 RS / RR", years=[2021, 2026],
  match=["speed triple 1200", "speed triple 1200 rs", "speed triple 1200 rr", "speed triple rs 1200", "speed triple 1160"], style="standard", drive="chain",
  engine="1160 cc liquid-cooled inline triple, fuel injected",
  intro="The newest Speed Triple. Big triple, lots of electronics and top-shelf brakes.",
  focus=[["1160 cc triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Ride modes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=TRNOTE, known=[], forums=[TRF]))

B43.append(dict(id="triumph-tiger-900-2020", make="Triumph", model="Tiger 900", name="Triumph Tiger 900", years=[2020, 2026],
  match=["tiger 900", "tiger 900 gt", "tiger 900 rally", "tiger 900 rally pro", "tiger 900 gt pro"], style="adventure", drive="chain",
  engine="888 cc liquid-cooled triple with T-plane crank, fuel injected",
  intro="Triumph's middleweight adventure triple. Ride modes, a TFT dash and a T-plane crank.",
  focus=[["888 cc triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Ride modes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=TRNOTE, known=[], forums=[TRF]))

HERO_NAME_B43 = {"bmw-f650cs-g650gs-2002": "G650GS", "bmw-g310r-2017": "G310R", "bmw-r18-2020": "R 18", "bmw-r1250rt-2019": "R1250RT", "bmw-s1000xr-2015": "S1000XR",
  "bmw-r1200r-r1250r-2006": "R1250R", "bmw-r60-2-and-r69s-slash-2-1955": "R69S", "bmw-r90s-1973": "R90S", "triumph-speed-triple-1200-rs-2021": "SPEED TRIPLE", "triumph-tiger-900-2020": "TIGER 900"}
