"""Batch 26 bike tunes (top 500, rows 251-260)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B26 = []
SRR = dict(id="16V018", years="2008-2012 (model list varies)", what="Regulator/rectifier circuit board can lift off its case, so the battery stops charging and the engine can stall.", fix="Dealer replaces the regulator/rectifier free.", src="https://static.nhtsa.gov/odi/rcl/2016/RCMN-16V018-3272.pdf")
SRR2 = dict(id="11V108", years="2008-2009 (some)", what="Weak bond between the regulator/rectifier power board and its case lets heat deform the board.", fix="Dealer replaces the regulator/rectifier free.", src="https://au7o.io/motorcycle-issues/suzuki-gsx-r600?year=2006")
VINTAGE_SUZ = dict(name="Suzuki Owners Club", url="https://www.suzukiownersclub.co.uk/", what="Club for owners of Suzuki bikes, old and new.")

B26.append(dict(id="suzuki-tl1000s-1997", make="Suzuki", model="TL1000S", name="Suzuki TL1000S", years=[1997, 2001],
  match=["tl1000s", "tl 1000s", "tl1000", "tls"], style="sport", drive="chain",
  engine="996 cc liquid-cooled 90-degree V-twin, fuel injected, rotary rear damper",
  intro="Suzuki's big V-twin sport bike. 1997 bikes had a steering recall. The rotary rear damper is the part to look at.",
  focus=[["996 cc V-twin", "Liquid-cooled"], ["Fuel injected", "Early EFI"], ["Rotary damper", "Rear suspension"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 1997 TL1000S bikes are in recall 97V093 for a steering and handlebar part.", reason="The fix is free if it was never done.")},
  add=[step("X-TLS-01", "L", "L-001", "Check the rear rotary damper", "With the bike on a stand, look for oil at the rotary damper beside the shock spring and feel for damping when you push down on the rear. A leaking or dead damper needs rebuilding or replacing.", "The TL1000S uses a separate rotary damper instead of a normal shock, and old ones leak.", "TL1000S layout", hours=0.5)],
  lessons={},
  recalls=[dict(id="97V093", years="1997", what="Steering and handlebar component problem.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/suzuki/tl1000sv/1997/97v093000")],
  known=[], forums=[dict(name="TLZone", url="https://www.tlzone.net/", what="Owner forum for the TL1000S and TL1000R.")]))

B26.append(dict(id="suzuki-v-strom-1000-1050-2002", make="Suzuki", model="V-Strom 1000 / 1050 (DL1000 / DL1050)", name="Suzuki V-Strom 1000 / 1050", years=[2002, 2026],
  match=["v-strom 1000", "vstrom 1000", "dl1000", "v-strom 1050", "vstrom 1050", "dl1050", "wee strom 1000", "strom 1000"], style="adventure", drive="chain",
  engine="996 or 1037 cc liquid-cooled V-twin, fuel injected",
  intro="Suzuki's big V-twin adventure bike. Many years have electrical recalls, mostly the regulator/rectifier and wiring.",
  focus=[["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electrical recalls", "Several years"], ["Chain drive", "Slack and lube"], ["Charging", "Check R/R"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2008-2009 bikes are in recall 11V108 and 2008-2012 bikes in recall 16V018 (regulator/rectifier). 2014-2016 bikes have several electrical recalls: the wiring harness can rub through on the fuel tank, the battery ground can corrode, and the ignition switch can corrode. 2020-2025 DL1050s are in recall 25V505 (headlight high beam too bright).", reason="A failed regulator or shorted harness can strand you or stall the bike. Every fix is free.")},
  add=[], lessons={},
  recalls=[SRR2, SRR,
           dict(id="25V505", years="2020-2025 DL1050", what="Headlight upper beam is too bright to meet the lighting standard.", fix="Dealer replaces the headlight assembly free.", src="https://carcomplaintdata.com/recalls/25v505000")],
  known=[dict(title="2014-2016 electrical recalls", what="2014-2016 DL1000s have recalls for harness chafing on the fuel tank, the battery ground connection and ignition switch corrosion.", src="https://arfc.org/motorcycles/suzuki/dl1000/recalls.aspx")],
  forums=[dict(name="StromTrooper", url="https://stromtrooper.com/", what="Owner forum for the V-Strom.")]))

B26.append(dict(id="suzuki-burgman-400-650-1999", make="Suzuki", model="Burgman 400 / 650", name="Suzuki Burgman 400 / 650", years=[1999, 2026],
  match=["burgman", "burgman 400", "burgman 650", "an400", "an650", "burgman executive", "skywave"], style="scooter", drive="belt",
  engine="385-400 cc single (AN400) or 638 cc twin (AN650), liquid-cooled, fuel injected or carb, automatic",
  intro="Suzuki's big touring scooters. The 650 has an electronically controlled automatic. Several years have recalls.",
  focus=[["Single or twin", "Liquid-cooled"], ["Automatic", "CVT or SECVT"], ["Recalls", "Several years"], ["Coolant", "Change it"], ["Brake light switch", "2012 recall"]],
  remove=[],
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2005 AN650s are in recall 05V497 (fuel pump retainer ring). 2008-2012 AN400s are in recall 16V018 (regulator/rectifier). 2012 AN400 and AN650 scooters are in recall 12V038 (brake light switches). 2013-2014 AN650s are in recall 15V852 (tappet and cam wear).", reason="Every fix is free.")},
  add=[], lessons={"G": ["Early AN400s have a carb. Later Burgmans are fuel injected. Skip the steps that don't match."]},
  recalls=[dict(id="05V497", years="2005 AN650", what="Fuel pump retainer ring may let fuel leak. Suzuki advised not to ride until fixed.", fix="Dealer replaces the retainer ring free.", src="https://auto-recalls.justia.com/suzuki/an650/2005/05v497000"),
           dict(id="12V038", years="2012 AN400 and AN650", what="Brake light switches may fail, so the brake light may not work and the scooter may not start.", fix="Dealer replaces the brake light switches free.", src="https://vehiclesafetyrecalls.com/recall/12V038000"),
           dict(id="15V852", years="2013-2014 AN650", what="Excessive tappet and camshaft wear.", fix="Free dealer repair.", src="https://auto-recalls.justia.com/suzuki/an650/2014/15v852000"),
           SRR],
  known=[], forums=[dict(name="Burgman USA", url="https://www.burgmanusa.com/", what="Owner forum for Suzuki Burgman scooters.")]))

B26.append(dict(id="suzuki-gsx1100s-katana-1981", make="Suzuki", model="GSX1100S Katana", name="Suzuki GSX1100S Katana", years=[1981, 1984],
  match=["katana 1100", "gsx1100s", "gsx1100sz", "gsx 1100 katana", "katana 1000", "gs1000s katana", "gsx1100 katana"], style="sport", drive="chain",
  engine="1075 cc air-cooled DOHC 16-valve inline four, four carbs",
  intro="The original Katana. A big air-cooled GSX four in a striking body. Four carbs to rebuild and sync.",
  focus=[["1075 cc four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Charging", "Check R/R"], ["Bodywork", "Rare parts"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": ["Rebuild one carb at a time and keep each one's parts apart."], "A": ["Katana body parts are rare. Store every panel safely before you start."]},
  recalls=[], recallNote=OLD, known=[], forums=[VINTAGE_SUZ]))

B26.append(dict(id="kawasaki-eliminator-500-2024", make="Kawasaki", model="Eliminator 500", name="Kawasaki Eliminator (2024-on)", years=[2024, 2026],
  match=["eliminator 500", "eliminator", "eliminator se", "el500", "eliminator 451"], style="cruiser", drive="chain",
  engine="451 cc liquid-cooled parallel twin, fuel injected",
  intro="Kawasaki's modern small cruiser, built on the Ninja 500 engine.",
  focus=[["451 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"], ["Clutch lever", "Check it"]],
  remove=EFI, patch={}, add=[],
  lessons={"A": ["In the US the 2024 Ninja 500 and Z500 had a clutch release shaft recall (25V146). The Eliminator was included in Canada. Run your VIN to be sure."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="Clutch release shaft", what="In Canada, 2024 Eliminator 500 bikes were recalled because the clutch lever could break. The US recall listed the Ninja 500 and Z500.", src="https://recalls-rappels.canada.ca/en/alert-recall/transport-canada-recall-2025121-kawasaki")],
  forums=[]))

B26.append(dict(id="suzuki-gt550-indy-1972", make="Suzuki", model="GT550 Indy", name="Suzuki GT550 Indy", years=[1972, 1977],
  match=["gt550", "gt 550", "indy", "gt550 indy", "ram air 550"], style="standard", drive="chain",
  engine="544 cc air-cooled two-stroke triple, three carbs, Ram Air head",
  intro="Suzuki's two-stroke triple. Three carbs, oil injection and crank seals that need checking on any survivor.",
  focus=[["Two-stroke triple", "Air-cooled"], ["Three carbs", "Sync them"], ["Oil injection", "Check the pump"], ["Crank seals", "Air leaks"], ["Points ignition", "Three sets"]],
  remove=CARB + AIR + ["H-003"], patch={},
  add=[step("X-GT5-01", "G", "G-004", "Check the oil injection pump", "Make sure the oil tank feeds the pump, bleed the lines, and check the pump cable adjustment so it opens with the throttle.", "A two-stroke with no oil supply seizes quickly.", "Two-stroke basics", hours=1.0)],
  lessons={"B": ["A two-stroke with leaking crank seals runs lean and can seize. Get the seals checked before riding hard."]},
  recalls=[], recallNote=OLD, known=[], forums=[VINTAGE_SUZ]))

B26.append(dict(id="suzuki-dr350-1990", make="Suzuki", model="DR350", name="Suzuki DR350", years=[1990, 1999],
  match=["dr350", "dr 350", "dr350s", "dr350se"], style="dualsport", drive="chain",
  engine="349 cc air/oil-cooled single, carb",
  intro="A tough air-cooled dual-sport single. Simple to keep going, with one carb.",
  focus=[["349 cc single", "Air/oil-cooled"], ["Single carb", "Clean it out"], ["Chain drive", "Slack and lube"], ["Valves", "Screw adjusters"], ["Kick or electric", "Depends on model"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[dict(name="ThumperTalk", url="https://www.thumpertalk.com/", what="Owner forum for four-stroke dirt and dual-sport bikes.")]))

B26.append(dict(id="suzuki-bandit-1250-2007", make="Suzuki", model="Bandit 1250 (GSF1250)", name="Suzuki Bandit 1250", years=[2007, 2016],
  match=["bandit 1250", "gsf1250", "gsf1250s", "bandit 1250s", "bandit"], style="standard", drive="chain",
  engine="1255 cc liquid-cooled inline four, fuel injected",
  intro="The liquid-cooled Bandit. Some 2008-2009 bikes are in a regulator/rectifier recall.",
  focus=[["1255 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["R/R recall", "2008-2009"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2008-2009 GSF1250S bikes are in recall 16V018 for the regulator/rectifier.", reason="A dead regulator can leave you stranded. The fix is free.")},
  add=[], lessons={}, recalls=[SRR], known=[], forums=[]))

B26.append(dict(id="suzuki-gsx-s750-1000-2015", make="Suzuki", model="GSX-S750 / GSX-S1000", name="Suzuki GSX-S750 / GSX-S1000", years=[2015, 2026],
  match=["gsx-s750", "gsx-s1000", "gsxs750", "gsxs1000", "gsx-s1000f", "gsx-s1000gt", "katana 2020"], style="standard", drive="chain",
  engine="749 or 999 cc liquid-cooled inline four, fuel injected",
  intro="Suzuki's naked GSX-R based fours. A few small recalls on early and late bikes.",
  focus=[["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Recalls", "Some years"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2016 GSX-S1000s are in recall 15V788 (front brake calipers). 2018 GSX-S750s are in recall 18V694 (fuel pump o-ring). 2020 and 2024 GSX-S1000S Katanas are in recall 25V505 (headlight).", reason="Each fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="15V788", years="2016 GSX-S1000 (Jul-Aug 2015 build)", what="Front brake calipers may leak brake fluid.", fix="Dealer replaces the front calipers free.", src="https://vehiclesafetyrecalls.com/recall/15V788000"),
           dict(id="18V694", years="2018 GSX-S750", what="Fuel pump o-ring may be twisted and leak fuel.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/18V694000"),
           dict(id="25V505", years="2020 and 2024 GSX-S1000S", what="Headlight upper beam is too bright to meet the lighting standard.", fix="Dealer replaces the headlight assembly free.", src="https://carcomplaintdata.com/recalls/25v505000")],
  known=[], forums=[]))

B26.append(dict(id="suzuki-gz250-1999", make="Suzuki", model="GZ250 Marauder", name="Suzuki GZ250", years=[1999, 2011],
  match=["gz250", "gz 250", "marauder 250", "gz250 marauder"], style="cruiser", drive="chain",
  engine="249 cc air-cooled single, carb",
  intro="A small, light single-cylinder cruiser. One carb and chain drive. Old fuel is the usual problem.",
  focus=[["249 cc single", "Air-cooled"], ["Single carb", "Clean it out"], ["Chain drive", "Slack and lube"], ["Valves", "Screw adjusters"], ["Drum rear brake", "Shoes and cable"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[]))

HERO_NAME_B26 = {"suzuki-tl1000s-1997": "TL1000S", "suzuki-v-strom-1000-1050-2002": "V-STROM", "suzuki-burgman-400-650-1999": "BURGMAN",
  "suzuki-gsx1100s-katana-1981": "KATANA", "kawasaki-eliminator-500-2024": "ELIMINATOR", "suzuki-gt550-indy-1972": "GT550",
  "suzuki-dr350-1990": "DR350", "suzuki-bandit-1250-2007": "BANDIT 1250", "suzuki-gsx-s750-1000-2015": "GSX-S", "suzuki-gz250-1999": "GZ250"}
