"""Batch 16 bike tunes (top 500, rows 151-160)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
B16 = []
XJB = dict(name="XJBikes forum", url="https://www.xjbikes.com/forums/", what="Owner forum for Yamaha XJ, Seca, Maxim and Radian fours.")
FJO = dict(name="FJ Owners forum", url="https://fjowners.com/", what="Owner forum for the Yamaha FJ1100 and FJ1200.")
VTF = dict(name="Virago Tech forum", url="http://viragotechforum.com/", what="Owner forum for Yamaha Viragos.")

B16.append(dict(id="yamaha-fj1200-1986", make="Yamaha", model="FJ1200", name="Yamaha FJ1200", years=[1986, 1993],
  match=["fj1200", "fj 1200", "fj1100", "fj1200a"], style="sport", drive="chain",
  engine="1188 cc air/oil-cooled DOHC inline four, four carbs",
  intro="A tough air-cooled sport tourer. The rear suspension linkage and old brake calipers need the most attention.",
  focus=[["1188 cc four", "Air/oil-cooled"], ["Four carbs", "Clean and sync"], ["Rear linkage", "Grease the bearings"], ["Brakes", "Calipers stick"], ["Wiring", "Corroded connectors"]],
  remove=CARB + AIR, patch={},
  add=[step("X-FJ12-01", "E", "E-002", "Grease the rear suspension linkage", "Strip the rear linkage, clean the bearings and bushings and grease them. Replace any that are seized or notchy.", "Owners call the linkage bearings the FJ's weak spot. They can seize if left dry.", "Devitt FJ1200 owner notes", hours=2.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Suspension linkage", what="The rear suspension linkage bearings can seize. Owners re-grease them regularly.", src="https://www.devittinsurance.com/?p=110034")],
  forums=[FJO]))

B16.append(dict(id="yamaha-xv1100-virago-1986", make="Yamaha", model="XV1100 Virago", name="Yamaha Virago 1100", years=[1986, 1999],
  match=["virago 1100", "xv1100", "xv 1100", "virago xv1100"], style="cruiser", drive="shaft",
  engine="1063 cc air-cooled SOHC V-twin, two carbs, shaft drive",
  intro="The big Virago. The starter clutch is the known weak spot. Carbs and the regulator need the usual care.",
  focus=[["1063 cc V-twin", "Air-cooled"], ["Starter clutch", "Known weak spot"], ["Two carbs", "Clean and sync"], ["Shaft drive", "Final drive oil"], ["Charging", "R/R heat"]],
  remove=CARB + AIR, patch={},
  add=[step("X-V11-01", "F", "F-002", "Check the starter clutch", "Listen for grinding or a starter that spins without turning the engine. If it slips, rebuild or replace the starter clutch.", "The later Viragos use a starter clutch under the side cover that often fails.", "XS11 forum Virago notes", skill="Advanced", hours=3.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Starter clutch", what="The 750 and 1100 Viragos use a starter clutch under the side cover that often fails.", src="https://xs11.club/forum/idle-talk-forum/other-bike-discussion/18682-750-virago?p=272343")],
  forums=[VTF]))

B16.append(dict(id="yamaha-xv535-virago-1987", make="Yamaha", model="XV535 Virago", name="Yamaha Virago 535", years=[1987, 2003],
  match=["virago 535", "xv535", "xv 535", "virago 500"], style="cruiser", drive="shaft",
  engine="535 cc air-cooled SOHC V-twin, two carbs, shaft drive",
  intro="A light, easy cruiser. Starting problems usually trace to the battery, the starter or the starter clutch.",
  focus=[["535 cc V-twin", "Air-cooled"], ["Two carbs", "Clean if stored"], ["Starting", "Battery and starter clutch"], ["Shaft drive", "Final drive oil"], ["Electrics", "Connectors"]],
  remove=CARB + AIR, patch={},
  add=[step("X-V53-01", "F", "F-002", "Check the starter system", "Test the battery first. Then check that the starter engages cleanly. A starter that spins freely points at the starter clutch.", "A worn starter clutch is a common cause of no-start on these bikes.", "Cafe Racer Webshop XV535 kit notes", hours=1.0)],
  lessons={}, recalls=[], recallNote=OLD, known=[], forums=[VTF]))

B16.append(dict(id="yamaha-v-star-1100-1999", make="Yamaha", model="V Star 1100", name="Yamaha V Star 1100", years=[1999, 2009],
  match=["v star 1100", "vstar 1100", "xvs1100", "drag star 1100", "dragstar 1100", "v-star 1100"], style="cruiser", drive="shaft",
  engine="1063 cc air-cooled SOHC V-twin, two carbs, shaft drive",
  intro="A popular big cruiser. Owners report many starter clutch failures. Yamaha sells a repair kit for it.",
  focus=[["1063 cc V-twin", "Air-cooled"], ["Starter clutch", "Common failure"], ["Two carbs", "Clean and sync"], ["Shaft drive", "Listen for whine"], ["Charging", "R/R placement"]],
  remove=CARB + AIR, patch={},
  add=[step("X-VS11-01", "F", "F-002", "Check the starter clutch", "Listen for kickback or grinding on start. If the starter spins without turning the engine, fit Yamaha's starter clutch repair kit.", "Owners report widespread starter clutch failures on these bikes.", "V Star 1100 knowledge base", skill="Advanced", hours=4.0)],
  lessons={"F": ["Learning the right starting routine helps prevent most starter clutch trouble."]},
  recalls=[], recallNote=OLD,
  known=[dict(title="Starter clutch kit", what="Yamaha sells a starter clutch repair kit, part 99999-03908.", src="https://sites.google.com/site/vstar1100kb/home/repairs/starter-clutch")],
  forums=[]))

B16.append(dict(id="yamaha-xj750-seca-1981", make="Yamaha", model="XJ750 Seca", name="Yamaha XJ750 Seca", years=[1981, 1983],
  match=["xj750", "seca 750", "xj 750", "xj750 seca", "xj750rh"], style="standard", drive="shaft",
  engine="748 cc air-cooled DOHC inline four, four carbs, shaft drive",
  intro="A capable early-80s four. The starter clutch, carbs and anti-dive brake system need the most care.",
  focus=[["748 cc four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Starter clutch", "Can slip"], ["Brakes", "Anti-dive bleeding"], ["Electrics", "Old connectors"]],
  remove=CARB + AIR, patch={},
  add=[step("X-XJ75-01", "K", "K-001", "Bleed the brakes through the anti-dive", "Flush fluid through each caliper and out through the anti-dive units. Expect it to take patience to get all the air out.", "Air trapped in the anti-dive parts gives a soft lever.", "XJBikes forum", hours=2.0)],
  lessons={}, recalls=[], recallNote=OLD,
  known=[dict(title="Starter clutch", what="Owners say starter clutch issues are real on the Seca 750.", src="https://www.xjbikes.com/forums/threads/just-picked-up-82-seca-750-have-s.133071")],
  forums=[XJB]))

B16.append(dict(id="yamaha-radian-yx600-1986", make="Yamaha", model="Radian YX600", name="Yamaha Radian YX600", years=[1986, 1990],
  match=["radian", "yx600", "yx 600", "radian 600"], style="standard", drive="chain",
  engine="598 cc air-cooled DOHC inline four, four carbs",
  intro="A simple, quick little four. Carbs, charging and old shocks are the usual jobs.",
  focus=[["598 cc four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Charging", "Check voltage"], ["Rear shock", "Seals leak"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD,
  known=[dict(title="Shocks", what="Leaking shock seals are a top UK MOT failure on the Radian.", src="https://carverify.co.uk/car-check/yamaha/radian")],
  forums=[XJB]))

B16.append(dict(id="yamaha-sr400-2014", make="Yamaha", model="SR400", name="Yamaha SR400", years=[2014, 2021],
  match=["sr400", "sr 400", "sr500"], style="standard", drive="chain",
  engine="399 cc air-cooled SOHC single, fuel injected, kick start only",
  intro="A simple kick-start single. 2015-2018 bikes had a recall for an oil hose that can leak onto the rear tire.",
  focus=[["399 cc single", "Kick start only"], ["Fuel injected", "No carbs"], ["2015-18 recall", "Oil hose"], ["Chain drive", "Slack and lube"], ["Valves", "Check clearances"]],
  remove=EFI + AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2015-2018 SR400s are in recall 18V730 because the oil hose flare nut may be loose and leak oil onto the rear tire.", reason="Oil on the rear tire can cause a crash. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="18V730", years="2015-2018", what="Engine oil line flare nut may be loose and leak oil onto the rear tire.", fix="Dealer tightens the nut, or replaces the oil line if it leaks, free.", src="https://auto-recalls.justia.com/yamaha/sr400/2018/18v730000")],
  known=[], forums=[]))

B16.append(dict(id="yamaha-tracer-900-fj-09-2015", make="Yamaha", model="Tracer 900 / FJ-09", name="Yamaha FJ-09 / Tracer 900", years=[2015, 2020],
  match=["fj-09", "fj09", "tracer 900", "tracer 900 gt", "mt-09 tracer"], style="sport", drive="chain",
  engine="847 cc liquid-cooled inline triple, fuel injected",
  intro="A triple-engined sport tourer. 2015-2017 FJ-09s had a handlebar holder recall.",
  focus=[["847 cc triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["2015-17 recall", "Handlebar holder"], ["Chain drive", "Slack and lube"], ["Valves", "Check on time"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2015-2017 FJ-09s are in recall 17V221 because the lower handlebar holder may loosen.", reason="Loose bars can cost you control. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="17V221", years="2015-2017", what="Lower handlebar holder may loosen.", fix="Dealer replaces the holder free.", src="https://www.motorverso.com/recalls/yamaha/17V221000/")],
  known=[], forums=[]))

B16.append(dict(id="yamaha-yzf600r-1995", make="Yamaha", model="YZF600R", name="Yamaha YZF600R Thundercat", years=[1995, 2007],
  match=["yzf600r", "yzf 600r", "thundercat", "yzf600"], style="sport", drive="chain",
  engine="599 cc liquid-cooled DOHC 16-valve inline four, four carbs",
  intro="A comfortable, reliable 600. Carbs that sat, fork seals and the charging system are the usual jobs.",
  focus=[["599 cc four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Fork seals", "Check for leaks"], ["Charging", "R/R and connectors"], ["Rear shock", "Often tired"]],
  remove=CARB, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD,
  known=[dict(title="Wear items", what="Check for a tired rear shock, leaking fork seals and a weak regulator/rectifier.", src="https://motoryk.com/bikes/yamaha/yzf600r")],
  forums=[]))

B16.append(dict(id="yamaha-zuma-50-1989", make="Yamaha", model="Zuma 50", name="Yamaha Zuma 50", years=[1989, 2026],
  match=["zuma", "zuma 50", "zuma 50f", "yw50", "bws 50"], style="scooter", drive="belt",
  engine="49 cc single (two-stroke on early models, four-stroke on later Zuma 50F), CVT belt drive",
  intro="A tough little scooter. Early ones are two-strokes and later ones are four-strokes, so check which you have.",
  focus=[["49 cc single", "2T or 4T"], ["CVT belt", "Check wear"], ["Carb", "Clean if stored"], ["Brakes", "Shoes and pads"], ["Tires", "Check age"]],
  remove=[], patch={}, add=[],
  lessons={"G": ["Check whether your Zuma is a two-stroke or a four-stroke and skip the steps that don't match."]},
  recalls=[], recallNote=VIN,
  known=[dict(title="2005 brake recall", what="Some 2005 Zumas were recalled because the rear brake shoe lining could separate.", src="https://arfc.org/motorcycles/yamaha/zuma/recalls.aspx")],
  forums=[]))

HERO_NAME_B16 = {"yamaha-fj1200-1986": "FJ1200", "yamaha-xv1100-virago-1986": "VIRAGO", "yamaha-xv535-virago-1987": "VIRAGO 535", "yamaha-v-star-1100-1999": "V STAR",
  "yamaha-xj750-seca-1981": "SECA", "yamaha-radian-yx600-1986": "RADIAN", "yamaha-sr400-2014": "SR400", "yamaha-tracer-900-fj-09-2015": "FJ-09",
  "yamaha-yzf600r-1995": "YZF600R", "yamaha-zuma-50-1989": "ZUMA"}
