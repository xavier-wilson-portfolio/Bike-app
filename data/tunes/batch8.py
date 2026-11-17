"""Batch 8 bike tunes (top 100, rows 73-82)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B8 = []
GSR = dict(name="The GS Resources forum", url="https://www.thegsresources.com/", what="Owner forum and tech library for Suzuki GS bikes.")
STATOR = dict(title="Charging system", what="Overcharging and burned connectors are the most common GS electrical fault. Clean every connector and run the Stator Papers checks.", src="https://thegsresources.com/statorpapers.php")
GS_ADD = lambda p: [step(p+"-01", "F", "F-002", "Run the Stator Papers checks", "Test stator output and regulator voltage as the GS Resources Stator Papers describe. Clean and check every connector in the charging circuit, including the ignition switch.", "Burned connectors and a failing regulator take out stators on these bikes.", "The GS Resources Stator Papers", hours=1.5),
                     step(p+"-02", "G", "G-006", "Replace the intake O-rings", "Fit new OEM or Viton O-rings where the intake boots meet the head. Plain nitrile rings break down from the heat.", "Old O-rings leak air and make the bike run lean and hang its idle.", "The GS Resources forum", hours=1.0)]

def gs(id, model, name, years, match, drive, eng, intro, focus):
    B8.append(dict(id=id, make="Suzuki", model=model, name=name, years=years, match=match, style="standard", drive=drive,
      engine=eng, intro=intro, focus=focus, remove=CARB + AIR, patch={}, add=GS_ADD("X-"+model.replace(" ","").upper()[:6]),
      lessons={"G": ["Clean carbs, set valves, no air leaks, a clean tank and a working petcock all have to be right before a GS runs right."]},
      recalls=[], recallNote=OLD, known=[STATOR], forums=[GSR]))

gs("suzuki-gs850g-1979", "GS850G", "Suzuki GS850G", [1979, 1983], ["gs850", "gs 850", "gs850g", "gs850gl"], "shaft",
   "843 cc air-cooled DOHC inline four, four carbs, shaft drive",
   "Suzuki's shaft-drive four. Nearly unbreakable, but an old one usually has several small faults stacked up.",
   [["843 cc DOHC four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Charging", "Stator Papers checks"], ["Intake O-rings", "Replace with Viton"], ["Shaft drive", "Final drive oil"]])
gs("suzuki-gs1000-1978", "GS1000", "Suzuki GS1000", [1978, 1980], ["gs1000", "gs 1000", "gs1000e", "gs1000s", "gs1000g"], "chain",
   "997 cc air-cooled DOHC inline four, four carbs",
   "Suzuki's first liter four. Tough engine; the electrics and carbs need the usual GS work.",
   [["997 cc DOHC four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Charging", "Stator Papers checks"], ["Connectors", "Clean every one"], ["Shaft (G) or chain", "Check which you have"]])
gs("suzuki-gs1100e-1980", "GS1100E", "Suzuki GS1100E", [1980, 1983], ["gs1100", "gs 1100", "gs1100e", "gs1100g", "gs1100l"], "chain",
   "1074 cc air-cooled DOHC 16-valve inline four, four carbs",
   "Suzuki's big early-80s four. Fast and tough, with the usual GS charging and connector issues.",
   [["1074 cc DOHC four", "16 valves, air-cooled"], ["Four carbs", "Clean and sync"], ["Charging", "Melted R/R connector"], ["Connectors", "Clean every one"], ["Chain drive", "Sprockets and chain"]])
gs("suzuki-gs400-1977", "GS400", "Suzuki GS400 / GS425", [1977, 1979], ["gs400", "gs 400", "gs425", "gs 425", "gs400e", "gs425e", "gs425l"], "chain",
   "398 cc (425 cc on the GS425) air-cooled DOHC parallel twin, two carbs",
   "A small GS twin that shares a lot with the bigger fours. Rusty tanks and tired petcocks are common.",
   [["398/425 cc DOHC twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Tank", "Check for rust"], ["Petcock", "Leaks and clogs"], ["Charging", "Test the regulator"]])

B8.append(dict(id="suzuki-boulevard-m109r-2006", make="Suzuki", model="Boulevard M109R", name="Suzuki Boulevard M109R", years=[2006, 2026],
  match=["m109r", "m109", "boulevard m109r", "vzr1800", "intruder m1800r"], style="cruiser", drive="shaft",
  engine="1783 cc liquid-cooled V-twin, fuel injected, shaft drive",
  intro="Suzuki's big power cruiser. Mostly routine work, plus one accessory recall to check.",
  focus=[["1783 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Shaft drive", "Final drive oil"], ["Backrest recall", "Accessory bolts only"], ["Wide rear tire", "Check wear and age"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. If the bike has a Suzuki accessory backrest, check that recall 15E053 was done. Some backrest kits came with bolts of the wrong length.", reason="Wrong-length bolts can let the backrest come loose.")},
  add=[], lessons={},
  recalls=[dict(id="15E053", years="2006-2015 with accessory backrest", what="Backrest mounting kit may have the wrong-length bolts.", fix="Dealer replaces the bolts free.", src="https://auto-recalls.justia.com/suzuki/vzr1800/2010/15e053000")],
  known=[], forums=[]))

B8.append(dict(id="suzuki-boulevard-c50-2005", make="Suzuki", model="Boulevard C50", name="Suzuki Boulevard C50", years=[2005, 2026],
  match=["c50", "boulevard c50", "c50t", "vl800", "volusia"], style="cruiser", drive="shaft",
  engine="805 cc liquid-cooled V-twin, fuel injected, shaft drive",
  intro="A common mid-size Suzuki cruiser. Check the 2005-2006 ignition switch recall and the charging system.",
  focus=[["805 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Ignition switch recall", "2005-2006"], ["Charging", "Stator and regulator"], ["Shaft drive", "Final drive oil"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2005 and 2006 C50s were recalled for the ignition switch, and Suzuki said not to ride them until it was replaced.", reason="A failing ignition switch can shut the engine off while riding.")},
  add=[], lessons={"F": ["A battery that keeps dying often points to a failing regulator/rectifier or loose battery leads. Test charging voltage at idle and 5,000 rpm."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Charging", what="Stator and regulator/rectifier failures cause dim lights and dead batteries.", src="https://enginepatrol.com/suzuki-boulevard-c50-c50t-common-problems/")],
  forums=[]))

M8 = dict(title="Oil sumping (2017-2019)", what="Early Milwaukee-Eight engines can build up oil in the crankcase and push it out the air cleaner. The fix is the 2020-style oil pump.", src="https://www.lawabidingbiker.com/250/")
M8_ADD = [step("X-M8-01", "H", "H-001", "Check for oil sumping", "On 2017-2019 bikes, look for oil in the air cleaner and on the right side of the engine after a long ride. Ask whether the oil pump was updated to the 2020 part.", "Sumping wastes oil and can coat the air filter.", "Harley-Davidson 2020 service bulletin on M8 sumping", hours=0.5)]
for i, m, n, mt in [("harley-davidson-road-glide-2017", "Road Glide", "ROAD GLIDE", ["road glide", "fltrx", "fltrxs", "fltru", "fltrk"]),
                    ("harley-davidson-road-king-2017", "Road King", "ROAD KING", ["road king", "flhr", "flhrc", "flhrxs"])]:
    B8.append(dict(id=i, make="Harley-Davidson", model=m, name="Harley-Davidson "+m, years=[2017, 2023], match=mt, style="touring", drive="belt",
      engine="Milwaukee-Eight 107 or 114 V-twin, oil-cooled heads, fuel injected, belt drive",
      intro="A Milwaukee-Eight touring Harley. Check for oil sumping on early bikes and the clutch actuator recall.",
      focus=[["Milwaukee-Eight", "107 or 114 cu in"], ["Fuel injected", "No carbs"], ["Oil sumping", "2017-2019"], ["Hydraulic clutch", "Recall 18V734"], ["Belt drive", "Check for cracks and tension"]],
      remove=EFI + AIR,
      patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2017-2018 touring bikes are in recall 18V734 because the hydraulic clutch actuator can leak inside and stop the clutch from releasing.", reason="A clutch that won't release can cause a crash. The repair is free.")},
      add=M8_ADD, lessons={},
      recalls=[dict(id="18V734", years="2017-2018 (some)", what="Clutch actuator can leak inside, and the clutch may not disengage.", fix="Free dealer repair (Harley recall 0173).", src="https://au7o.io/motorcycle-issues/harley-davidson-road-king?year=2017")],
      known=[M8], forums=[]))

B8.append(dict(id="suzuki-gt750-1972", make="Suzuki", model="GT750", name="Suzuki GT750", years=[1972, 1977],
  match=["gt750", "gt 750", "water buffalo", "kettle", "le mans"], style="standard", drive="chain",
  engine="738 cc liquid-cooled two-stroke triple, three carbs, oil injection",
  intro="The Water Buffalo. A liquid-cooled two-stroke triple whose crank seals and water pump decide everything.",
  focus=[["738 cc two-stroke triple", "Liquid-cooled"], ["Crank seals", "Leak-down test"], ["Water pump", "Nylon gear and seals"], ["Three carbs", "Clean and sync"], ["Exhaust studs", "Threads strip"]],
  remove=CARB + ["H-003"], patch={},
  add=[step("X-GT7-01", "H", "H-001", "Leak-down test the crankcase", "Seal the ports and pressure test the crankcase. Leaking seals mean the bottom end has to come apart.", "Old crank seals are the classic GT750 fault and let it run lean.", "The GS Resources GT750 thread", skill="Advanced", hours=2.0),
       step("X-GT7-02", "H", "H-004", "Check the water pump gear and seals", "Inspect the nylon water pump drive gear for worn or broken teeth, and the pump seals for leaks.", "A failed water pump cooks the engine.", "Motoryk GT750 notes", hours=1.5)],
  lessons={"H": ["Check the exhaust flange threads in the head. Stripped threads are common on early-70s Suzukis."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Crank seals", what="Hardened crank seals are common and need a full bottom-end rebuild.", src="https://motoryk.com/bikes/suzuki/gt-750")],
  forums=[]))

B8.append(dict(id="harley-davidson-sportster-883-2004", make="Harley-Davidson", model="Sportster 883 / 1200", name="Harley-Davidson Sportster 883 / 1200", years=[2004, 2021],
  match=["sportster", "xl883", "xl1200", "iron 883", "iron 1200", "forty-eight", "48", "883", "1200 custom", "nightster", "superlow"], style="cruiser", drive="belt",
  engine="883 or 1202 cc air-cooled Evolution V-twin, rubber mounted, carb (2004-2006) or fuel injection (2007 on)",
  intro="The rubber-mount Sportster. Simple and well supported. Know whether yours has a carb or fuel injection.",
  focus=[["Evolution V-twin", "883 or 1200"], ["Carb or EFI", "EFI from 2007"], ["Belt drive", "Check for cracks"], ["Primary", "Separate oil"], ["Headlight recall", "2019-2021"]],
  remove=AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Many 2019-2021 Sportsters were in recall 21V225 because the headlight bulb can fail and kill both beams.", reason="Losing the headlight at night is a crash risk. The repair is free.")},
  add=[], lessons={"G": ["2004-2006 Sportsters have a carb. 2007 and later are fuel injected. Skip the steps that don't match your bike."]},
  recalls=[dict(id="21V225", years="2019-2021 (some)", what="Headlight bulb may fail, losing high and low beam.", fix="Dealer fits a bulb shield free.", src="https://ultimatemotorcycling.com/2021/04/12/harley-recalls-31346-sportsters-due-to-possible-headlight-failure")],
  known=[], forums=[]))

HERO_NAME_B8 = {"suzuki-gs850g-1979": "GS850", "suzuki-gs1000-1978": "GS1000", "suzuki-gs1100e-1980": "GS1100E", "suzuki-gs400-1977": "GS400",
  "suzuki-boulevard-m109r-2006": "M109R", "suzuki-boulevard-c50-2005": "C50", "harley-davidson-road-glide-2017": "ROAD GLIDE",
  "harley-davidson-road-king-2017": "ROAD KING", "suzuki-gt750-1972": "GT750", "harley-davidson-sportster-883-2004": "SPORTSTER"}
