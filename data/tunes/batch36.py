"""Batch 36 bike tunes (top 500, rows 351-360)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch31 import CARB4
from batch34 import KAWF, VULF, OILF04
B36 = []
TWO = CARB + AIR + ["H-003"]
KTRIPLE = dict(name="Kawasaki Triples Club", url="https://www.kawasakitriples.com/", what="Club and forum for Kawasaki two-stroke triples.")
YAMF = dict(name="Yamaha Forums", url="https://www.yamahaforums.com/", what="General owner forum for Yamaha motorcycles.")
MT07F = dict(name="FZ-07.org", url="https://www.fz07.org/", what="Owner forum for the Yamaha MT-07, FZ-07 and their relatives.")

B36.append(dict(id="kawasaki-s1-s2-s3-triple-1972", make="Kawasaki", model="S1 / S2 / S3 triple", name="Kawasaki S1 / S2 / S3 (KH250 / KH400)", years=[1972, 1975],
  match=["s1", "s2", "s3", "kh250", "kh400", "s1 250", "s2 350", "s3 400", "mach i", "mach ii"], style="standard", drive="chain",
  engine="249 to 400 cc air-cooled two-stroke triple, three carbs, oil injection",
  intro="The small Kawasaki two-stroke triples. Three carbs, oil injection and crank seals to check on every survivor.",
  focus=[["Two-stroke triple", "Air-cooled"], ["Three carbs", "Rebuild as a set"], ["Oil injection", "Bleed the pump"], ["Crank seals", "Check them"], ["Points", "Three sets"]],
  remove=TWO, patch={},
  add=[step("X-KS-01", "G", "G-004", "Check the oil injection pump", "Make sure the oil tank feeds the pump, bleed the lines, and check the pump cable so it opens with the throttle.", "A two-stroke with no oil supply seizes quickly.", "Two-stroke basics", hours=1.0)],
  lessons={"B": ["A two-stroke with leaking crank seals runs lean and can seize. Get the seals checked before riding hard."]},
  recalls=[], recallNote=OLD, known=[], forums=[KTRIPLE]))

B36.append(dict(id="kawasaki-kdx200-1983", make="Kawasaki", model="KDX200", name="Kawasaki KDX200", years=[1983, 2006],
  match=["kdx200", "kdx 200", "kdx220", "kdx220r", "kdx 220"], style="dualsport", drive="chain",
  engine="198 cc liquid-cooled two-stroke single, carb, oil injection or premix",
  intro="Kawasaki's two-stroke enduro bike. Light, simple and usually ridden hard in the woods.",
  focus=[["Two-stroke", "Liquid-cooled"], ["Top end", "Check compression"], ["Carb", "Clean and jet"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=TWO, patch={},
  add=[step("X-KDX-01", "G", "G-004", "Check compression and the top end", "Do a compression test. Low numbers mean the piston and rings are due. Look at the piston through the exhaust port for scoring.", "A tired top end is the most common problem on a used two-stroke.", "Two-stroke basics", hours=1.0)],
  lessons={}, recalls=[], recallNote=OLD, known=[], forums=[]))

B36.append(dict(id="kawasaki-vulcan-88-vn1500-1987", make="Kawasaki", model="Vulcan 88 (VN1500A)", name="Kawasaki Vulcan 88 (VN1500)", years=[1987, 1999],
  match=["vulcan 88", "vn1500a", "vulcan 88 1500", "vulcan 88 se", "vn1500 88"], style="cruiser", drive="shaft",
  engine="1470 cc liquid-cooled V-twin, one carb, shaft drive",
  intro="The first big Vulcan. One carb, shaft drive, and a simple bike under the chrome.",
  focus=[["1470 cc V-twin", "Liquid-cooled"], ["Carb", "Clean it out"], ["Shaft drive", "Change the oil"], ["Cooling", "Coolant and fan"], ["Charging", "Check R/R"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[VULF]))

B36.append(dict(id="kawasaki-mean-streak-1500-1600-2002", make="Kawasaki", model="Vulcan Mean Streak 1500 / 1600", name="Kawasaki Vulcan Mean Streak", years=[2002, 2008],
  match=["mean streak", "meanstreak", "vulcan mean streak", "vn1500p", "vn1600b", "mean streak 1600"], style="cruiser", drive="belt",
  engine="1470 or 1552 cc liquid-cooled V-twin, fuel injected, belt drive",
  intro="Kawasaki's performance cruiser. Fuel injected, with better brakes and suspension than the other Vulcans of its day.",
  focus=[["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Belt drive", "Check wear"], ["Oil filter", "2003-04 recall"], ["Cooling", "Coolant and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2003-2004 Mean Streaks are in recall 04V023 for an oil filter that can deform on a cold start.", reason="The fix is free.")},
  add=[], lessons={},
  recalls=[OILF04], known=[], forums=[VULF]))

B36.append(dict(id="yamaha-fzr600-fzr1000-1987", make="Yamaha", model="FZR600 / FZR1000", name="Yamaha FZR600 / FZR1000", years=[1987, 1999],
  match=["fzr600", "fzr1000", "fzr 600", "fzr 1000", "fzr", "fzr400", "fzr600r"], style="sport", drive="chain",
  engine="599 or 989 cc liquid-cooled inline four, four carbs, EXUP valve on the 1000",
  intro="Yamaha's late 80s and 90s sport fours. Four carbs, a Deltabox frame and on the 1000 an EXUP exhaust valve that seizes.",
  focus=[["Inline four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["EXUP valve", "1000 only"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={},
  add=[step("X-FZR-01", "H", "H-003", "Free the EXUP valve (FZR1000)", "Remove the EXUP cover on the collector, check the valve turns freely and the cables are adjusted. Clean and grease it if it is stuck.", "A seized EXUP valve kills midrange power and can strain the servo.", "Owner experience", hours=1.5)],
  lessons={"G": [CARB4]}, recalls=[], recallNote=OLD, known=[], forums=[YAMF]))

B36.append(dict(id="yamaha-yzf1000r-thunderace-1996", make="Yamaha", model="YZF1000R Thunderace", name="Yamaha YZF1000R Thunderace", years=[1996, 2003],
  match=["thunderace", "yzf1000r", "yzf1000", "yzf 1000r", "thunder ace"], style="sport", drive="chain",
  engine="1002 cc liquid-cooled inline four, four carbs, EXUP valve",
  intro="Yamaha's big sport tourer of the late 90s. Four carbs and an EXUP valve to keep free.",
  focus=[["1002 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["EXUP valve", "Keep it free"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[YAMF]))

B36.append(dict(id="yamaha-majesty-yp400-2004", make="Yamaha", model="Majesty YP400", name="Yamaha Majesty 400", years=[2004, 2013],
  match=["majesty", "majesty 400", "yp400", "yp 400", "yamaha majesty"], style="scooter", drive="belt",
  engine="395 cc liquid-cooled single, fuel injected, CVT",
  intro="Yamaha's 400 maxi-scooter. Lots of underseat storage and lots of panels between you and the engine.",
  focus=[["395 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Bodywork", "Many panels"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[YAMF]))

B36.append(dict(id="yamaha-fz-07-mt-07-tracer-7-2019", make="Yamaha", model="MT-07 / FZ-07 / Tracer 7", name="Yamaha MT-07 / Tracer 7 (2018 on)", years=[2018, 2026],
  match=["mt-07", "mt07", "fz-07", "fz07", "tracer 7", "tracer 700", "mt 07", "tracer 7 gt"], style="standard", drive="chain",
  engine="689 cc liquid-cooled CP2 parallel twin, fuel injected",
  intro="The updated MT-07 and its touring sibling. Some 2018 bikes had a chain guard bolt recall.",
  focus=[["689 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Chain guard", "2018 recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2018 MT-07s are in recall 18V483 for chain guard mounting bolts that can loosen.", reason="The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="18V483", years="2018 (some)", what="Chain guard mounting bolts can loosen from vibration.", fix="Dealer replaces both chain guard bolts free.", src="https://vehiclesafetyrecalls.com/recall/18V483000")],
  known=[], forums=[MT07F]))

B36.append(dict(id="yamaha-mt-03-2020", make="Yamaha", model="MT-03", name="Yamaha MT-03", years=[2020, 2026],
  match=["mt-03", "mt03", "mt 03", "yamaha mt-03"], style="standard", drive="chain",
  engine="321 cc liquid-cooled parallel twin, fuel injected",
  intro="The naked version of the R3. 2020 bikes had a reflector recall and a VIN label recall.",
  focus=[["321 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "2020 bikes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2020 MT-03s are in recall 20V611 (rear reflector) and some in 21V048 (VIN on the certification label may not match the frame).", reason="Both fixes are free. A wrong VIN label can cause title trouble.")},
  add=[], lessons={},
  recalls=[dict(id="20V611", years="2020", what="Condensation can collect on the rear reflector lens and make it less effective.", fix="Dealer replaces the rear reflector free.", src="https://vehicleflaws.com/recall/20V611000"),
           dict(id="21V048", years="2020 (some)", what="VIN on the federal certification label may not match the frame.", fix="Dealer checks and replaces the label free.", src="https://vehiclesafetyrecalls.com/recall/21V048000")],
  known=[], forums=[YAMF]))

B36.append(dict(id="yamaha-mt-10-fz-10-2017", make="Yamaha", model="MT-10 / FZ-10", name="Yamaha MT-10 / FZ-10", years=[2017, 2026],
  match=["mt-10", "mt10", "fz-10", "fz10", "mt 10", "mt-10 sp"], style="standard", drive="chain",
  engine="998 cc liquid-cooled crossplane inline four, fuel injected",
  intro="The naked R1. 2017-2020 bikes are in a front brake switch recall.",
  focus=[["998 cc four", "Crossplane"], ["Fuel injected", "No carbs"], ["Brake switch", "2017-20 recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2017-2020 MT-10 and FZ-10 bikes are in recall 20V814 for the front brake switch.", reason="A failed switch can leave you without a brake light. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="20V814", years="2017-2020", what="Front brake switch can fail from silicon oxide buildup, so the brake light may not work.", fix="Dealer replaces the front brake switch free.", src="https://auto-recalls.justia.com/yamaha/mt10/2020/20v814000")],
  known=[], forums=[YAMF]))

HERO_NAME_B36 = {"kawasaki-s1-s2-s3-triple-1972": "KH400", "kawasaki-kdx200-1983": "KDX200", "kawasaki-vulcan-88-vn1500-1987": "VULCAN 88",
  "kawasaki-mean-streak-1500-1600-2002": "MEAN STREAK", "yamaha-fzr600-fzr1000-1987": "FZR1000", "yamaha-yzf1000r-thunderace-1996": "THUNDERACE",
  "yamaha-majesty-yp400-2004": "MAJESTY", "yamaha-fz-07-mt-07-tracer-7-2019": "MT-07", "yamaha-mt-03-2020": "MT-03", "yamaha-mt-10-fz-10-2017": "MT-10"}
