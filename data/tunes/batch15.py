"""Batch 15 bike tunes (top 500, rows 141-150)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B15 = []
VR = dict(name="Venture Rider forum", url="https://www.venturerider.org/forum/", what="Owner forum for Yamaha Venture and Royal Star V4s.")
XT = dict(name="Odin XT500 forum", url="https://www.tapatalk.com/groups/odinxt500/", what="Owner forum for XT500, TT500 and SR500 singles.")
YE = dict(name="Yamaha Enduros forum", url="https://www.yamaha-enduros.com/", what="Owner forum for vintage Yamaha two-stroke enduros.")

B15.append(dict(id="yamaha-v-max-1985", make="Yamaha", model="V-Max", name="Yamaha V-Max 1200", years=[1985, 2007],
  match=["v-max", "vmax", "v max", "vmx12", "vmx1200"], style="cruiser", drive="shaft",
  engine="1198 cc liquid-cooled V4, four carbs with V-Boost, shaft drive",
  intro="Yamaha's original muscle V4. Carb diaphragms and the V-Boost servo are the usual jobs.",
  focus=[["1198 cc V4", "Liquid-cooled"], ["Four carbs", "Diaphragms and sync"], ["V-Boost", "Servo and butterflies"], ["Shaft drive", "Final drive oil"], ["Frame", "Check for rust"]],
  remove=CARB, patch={},
  add=[step("X-VMX-01", "G", "G-005", "Check the V-Boost system", "With the key on, check that the V-Boost servo cycles and the butterflies between the carb pairs open and close freely. Clean and lube the linkage.", "A stuck V-Boost takes away the top-end rush or makes the bike run badly.", "Clymer V-Max manual", hours=1.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Carb diaphragms", what="Cracked carb diaphragms cause rough idle and hesitation.", src="https://www.motoryk.com/bikes/yamaha/v-max-1200/problems")],
  forums=[]))

B15.append(dict(id="yamaha-road-star-1600-1700-1999", make="Yamaha", model="Road Star 1600/1700", name="Yamaha Road Star 1600 / 1700", years=[1999, 2014],
  match=["road star", "roadstar", "xv1600", "xv1700", "road star silverado", "midnight star"], style="cruiser", drive="belt",
  engine="1602 or 1670 cc air-cooled pushrod V-twin, carb (later fuel injected), belt drive",
  intro="Yamaha's big air-cooled cruiser. Early 1600s had a transmission recall. Carbs and fuel delivery are common complaints.",
  focus=[["Big V-twin", "Air-cooled pushrod"], ["Carb or EFI", "Depends on year"], ["Transmission", "1999-2001 recall"], ["Belt drive", "Tension and wear"], ["Fuel system", "Common complaints"]],
  remove=AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 1999-2001 XV1600s were in recall 06V397 for the transmission.", reason="Transmission recalls are free to fix.")},
  add=[], lessons={"G": ["Early bikes have a carb and later 1700s are fuel injected. Skip the steps that don't match your bike."]},
  recalls=[dict(id="06V397", years="1999-2001 (some XV1600)", what="Transmission recall on certain Road Star models.", fix="Free dealer repair.", src="https://static.nhtsa.gov/odi/rcl/2006/RCDNN-06V397-6285.pdf")],
  known=[], forums=[]))

B15.append(dict(id="yamaha-royal-star-1996", make="Yamaha", model="Royal Star", name="Yamaha Royal Star", years=[1996, 2013],
  match=["royal star", "xvz1300", "royal star tour deluxe", "rstd"], style="cruiser", drive="shaft",
  engine="1294 cc liquid-cooled V4, four carbs, shaft drive",
  intro="A smooth V4 cruiser. Four carbs that need clean floats, intact vacuum caps and a good sync.",
  focus=[["1294 cc V4", "Liquid-cooled"], ["Four carbs", "Floats and sync"], ["Vacuum caps", "Split with age"], ["Shaft drive", "Final drive oil"], ["Parts", "Some carb bits are rare"]],
  remove=CARB, patch={},
  add=[step("X-RST-01", "G", "G-005", "Check the carb vacuum caps", "Check the rubber caps on the carb sync ports. They often split where the clamps go. Replace any that are cracked.", "A split cap is an air leak that makes one cylinder run lean.", "Venture Rider forum", hours=0.5)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Float levels", what="Owners report float levels out of adjustment causing fuel overflow and poor running.", src="https://www.venturerider.org/forum/forums/topic/67654-need-a-little-input-from-my-tech-guys-and-gals")],
  forums=[VR]))

B15.append(dict(id="yamaha-fz1-2001", make="Yamaha", model="FZ1", name="Yamaha FZ1", years=[2001, 2015],
  match=["fz1", "fz-1", "fzs1000", "fz1 fazer", "fazer 1000"], style="standard", drive="chain",
  engine="998 cc liquid-cooled inline four, carbs (2001-2005) or fuel injected (2006 on)",
  intro="An R1-based naked bike. Early ones have carbs, later ones are fuel injected.",
  focus=[["998 cc four", "R1-based"], ["Carb or EFI", "Depends on year"], ["Chain drive", "Slack and lube"], ["Charging", "Check voltage"], ["Brakes", "Pads and fluid"]],
  remove=[], patch={}, add=[],
  lessons={"G": ["2001-2005 bikes have carbs and 2006 on are fuel injected. Skip the steps that don't match your bike."]},
  recalls=[], recallNote=VIN, known=[], forums=[]))

B15.append(dict(id="yamaha-fz6-2004", make="Yamaha", model="FZ6", name="Yamaha FZ6", years=[2004, 2009],
  match=["fz6", "fz-6", "fzs600", "fazer 600", "fz6 fazer"], style="standard", drive="chain",
  engine="600 cc liquid-cooled inline four, fuel injected",
  intro="An R6-based all-rounder. Some 2005s had a factory fix for an unstable idle.",
  focus=[["600 cc four", "R6-based"], ["Fuel injected", "No carbs"], ["2005 campaign", "Idle fix"], ["Chain drive", "Slack and lube"], ["Valve clearances", "Check on time"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2005 FZ6s were in campaign 09V360 for unstable engine idling.", reason="An engine that stalls at idle is a safety risk. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="09V360", years="2005 (some)", what="Unstable engine idling.", fix="Free dealer repair.", src="https://static.nhtsa.gov/odi/rcl/2009/RCRIT-09V360-2873.pdf")],
  known=[], forums=[]))

B15.append(dict(id="yamaha-tw200-1987", make="Yamaha", model="TW200", name="Yamaha TW200", years=[1987, 2026],
  match=["tw200", "tw 200", "t-dub", "tdub"], style="dualsport", drive="chain",
  engine="196 cc air-cooled SOHC single, one carb, fat tires",
  intro="A simple, tough trail bike. Routine care for most years. The 2026 model has a speedometer recall.",
  focus=[["196 cc single", "Air-cooled"], ["One carb", "Clean if stored"], ["2026 recall", "Speedometer"], ["Fat tires", "Check age and pressure"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2026 TW200s are in recall 26V197 because the speedometer gear may fail. Yamaha says not to ride until it's fixed.", reason="A dead speedometer makes it hard to judge speed. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="26V197", years="2026 (some)", what="Speedometer gear may deform and stop the speedometer. Do not ride until repaired.", fix="Free dealer repair.", src="https://www.vehiclesafetyrecalls.com/recall/26V197000")],
  known=[], forums=[]))

B15.append(dict(id="yamaha-xt250-2008", make="Yamaha", model="XT250", name="Yamaha XT250", years=[2008, 2026],
  match=["xt250", "xt 250", "xt250x"], style="dualsport", drive="chain",
  engine="249 cc air-cooled SOHC single; carb or fuel injection depending on year",
  intro="A light dual-sport. 2013-2015 bikes had an air induction hose recall.",
  focus=[["249 cc single", "Air-cooled"], ["Carb or EFI", "Depends on year"], ["2013-15 recall", "Air induction hose"], ["Chain drive", "Slack and lube"], ["Off-road wear", "Bearings"]],
  remove=AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2013-2015 XT250s are in recall 14V754. Dealers replace the air induction pipe and hose.", reason="The repair is free.")},
  add=[], lessons={"G": ["Check whether your bike has a carb or fuel injection and skip the steps that don't match."]},
  recalls=[dict(id="14V754", years="2013-2015 (some)", what="Air induction pipe and hose defect.", fix="Dealer replaces the pipe and hose free.", src="https://auto-recalls.justia.com/yamaha/xt250/2013/14v754000")],
  known=[], forums=[]))

B15.append(dict(id="yamaha-xt500-1976", make="Yamaha", model="XT500", name="Yamaha XT500", years=[1976, 1981],
  match=["xt500", "xt 500", "tt500"], style="dualsport", drive="chain",
  engine="499 cc air-cooled SOHC single, one carb, kick start, dry sump (oil in the frame)",
  intro="The classic big thumper. Kick start technique, the carb and the oil-in-frame system matter most.",
  focus=[["499 cc single", "Kick start"], ["One carb", "Rebuild kit is cheap"], ["Oil in frame", "Flush the frame"], ["Kick start", "Ratchet wear"], ["Tank", "Check for rust"]],
  remove=CARB + AIR, patch={},
  add=[step("X-XT5-01", "H", "H-001", "Flush the oil frame", "The frame holds the engine oil. Drain it fully and flush out sludge and rust before refilling.", "Old sludge in the frame goes straight into the engine.", "Odin XT500 forum", hours=1.5)],
  lessons={"G": ["Starting problems are often the carb. A rebuild kit is cheap."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Kick start ratchet", what="Owners report cracked kick start ratchets, often from kicking too hard. Yamaha revised the part.", src="https://www.tapatalk.com/groups/odinxt500/viewtopic.php?p=97228")],
  forums=[XT]))

B15.append(dict(id="yamaha-dt250-dt1-1968", make="Yamaha", model="DT250 / DT1", name="Yamaha DT1 / DT250", years=[1968, 1979],
  match=["dt1", "dt250", "dt 250", "dt-1", "dt2", "dt3"], style="dualsport", drive="chain",
  engine="246 cc air-cooled two-stroke single, Autolube oil injection",
  intro="The bike that started the Japanese enduro boom. The Autolube pump is the part to get right.",
  focus=[["246 cc two-stroke", "Air-cooled"], ["Autolube pump", "Seals and flow"], ["One carb", "Clean and set"], ["Crank seals", "Check if it sat"], ["Parts", "Pumps differ by model"]],
  remove=CARB + AIR + ["H-003"], patch={},
  add=[step("X-DT1-01", "H", "H-001", "Check the Autolube pump", "Rebuild the pump with fresh seals, bleed it and check its output against the manual. Use the right pump for your model.", "A pump that underfeeds oil will seize the engine. Pumps from other models deliver different amounts.", "Yamaha Enduros forum", hours=1.5)],
  lessons={"H": ["Some owners run a lean premix as well as the pump, as a safety net."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Pump swaps", what="Oil pumps that look the same deliver different amounts. A 125 pump won't work for a 250.", src="https://yamaha-enduros.com/index.php/forums/1968-71-badge-bikes/16228-dt1-oil-pump")],
  forums=[YE]))

B15.append(dict(id="yamaha-rz350-1984", make="Yamaha", model="RZ350", name="Yamaha RZ350", years=[1984, 1985],
  match=["rz350", "rz 350", "rd350 ypvs", "rd350lc", "kenny roberts rz"], style="sport", drive="chain",
  engine="347 cc liquid-cooled two-stroke twin, YPVS power valves, two carbs",
  intro="The power-valve two-stroke. Stuck valves, crank seals and the oil pump decide how well it runs.",
  focus=[["347 cc two-stroke", "Liquid-cooled"], ["YPVS", "Valves and cables"], ["Crank seals", "Leak test"], ["Oil pump", "Rebuild kit"], ["Two carbs", "Clean and sync"]],
  remove=CARB + ["H-003"], patch={},
  add=[step("X-RZ3-01", "H", "H-001", "Free up the power valves", "Remove the valve covers, clean the valves and check they turn by hand. Lube the cables and check the servo cycles at key on.", "Road muck makes the valves stick and wear into the head.", "Classic Mechanics RD350 YPVS guide", hours=2.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Power valves", what="Road dirt can make the power valves wear into the cylinder head. Fresh seals and lubed cables help.", src="https://www.classicmechanics.com/?p=6288")],
  forums=[]))

HERO_NAME_B15 = {"yamaha-v-max-1985": "V-MAX", "yamaha-road-star-1600-1700-1999": "ROAD STAR", "yamaha-royal-star-1996": "ROYAL STAR", "yamaha-fz1-2001": "FZ1",
  "yamaha-fz6-2004": "FZ6", "yamaha-tw200-1987": "TW200", "yamaha-xt250-2008": "XT250", "yamaha-xt500-1976": "XT500", "yamaha-dt250-dt1-1968": "DT1", "yamaha-rz350-1984": "RZ350"}
