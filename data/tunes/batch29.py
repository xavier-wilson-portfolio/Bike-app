"""Batch 29 bike tunes (top 500, rows 281-290)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch20 import TRF
B29 = []
DMS = dict(name="Ducati.ms", url="https://www.ducati.ms/", what="Large owner forum for Ducati models.")
KTMF = dict(name="KTM Forums", url="https://www.ktmforums.com/", what="Owner forum for KTM street and adventure bikes.")
ADVR = dict(name="ADVrider", url="https://www.advrider.com/f/", what="Large adventure riding forum with model-specific threads.")
DESMO = step("X-DUC-01", "H", "H-003", "Check the timing belts and desmo valve clearances", "Replace the cam timing belts on schedule, by age as well as miles, and check the desmo opening and closing clearances. Old belts can snap and wreck the engine.", "Ducati belt-drive twins need belts changed on time even if the bike sat.", "Ducati service practice", skill="Advanced", hours=4.0)

B29.append(dict(id="triumph-trident-660-2021", make="Triumph", model="Trident 660", name="Triumph Trident 660", years=[2021, 2026],
  match=["trident 660", "trident660", "tiger sport 660", "triumph trident 2021"], style="standard", drive="chain",
  engine="660 cc liquid-cooled inline triple, fuel injected",
  intro="Triumph's middleweight triple. Every 2022-2024 bike is in a MAP sensor hose recall.",
  focus=[["660 cc triple", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["MAP hose recall", "2022-2024"], ["Chain drive", "Slack and lube"], ["Fork caps", "2023 recall"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2022-2024 bikes are in recall 23V583 (MAP sensor hose can block and stall the engine). Some 2022 bikes are in recall 22V062 (side stand) and some 2023 bikes in recall 24V109 (fork caps can strip).", reason="A stall or a fork cap coming off is a crash risk. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="23V583", years="2022-2024", what="MAP sensor hose may be blocked, giving bad readings that cause rough idle or a stall.", fix="Dealer replaces the hose free.", src="https://vehiclesafetyrecalls.com/recall/23V583000"),
           dict(id="22V062", years="2022 (some)", what="Side stand (kickstand) problem.", fix="Free dealer repair.", src="https://vehicleflaws.com/recall/23V583000"),
           dict(id="24V109", years="2023 (some)", what="Front fork caps with bad threads may strip and come off the fork tube.", fix="Free dealer repair.", src="https://www.clearvin.com/car-recalls/triumph/trident-660/2023/")],
  known=[], forums=[TRF]))

B29.append(dict(id="ducati-monster-1993", make="Ducati", model="Monster (air-cooled)", name="Ducati Monster (air-cooled, 1993-2014)", years=[1993, 2014],
  match=["monster", "monster 600", "monster 620", "monster 695", "monster 696", "monster 750", "monster 796", "monster 900", "monster 1000", "monster 1100", "monster 1100 evo", "m900", "m600"], style="standard", drive="chain",
  engine="583-1078 cc air-cooled 90-degree L-twin, carbs (early) or fuel injected, belt-driven desmo cams",
  intro="The original naked Ducati. Belt-driven desmo valves, a dry clutch on most, and carbs on early ones.",
  focus=[["Air-cooled L-twin", "Desmo valves"], ["Carb or EFI", "Depends on year"], ["Timing belts", "Change by age"], ["Dry clutch", "Rattle is normal"], ["Recalls", "Some years"]],
  remove=AIR,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. 2009 Monster 696s are in recall 09V142 (wiring harness can touch the head and exhaust). Some 2011-2012 Monster 1100 EVOs are in recall 12V073 (rear rims). Some 2012 Monster 1100 EVO and 796 bikes are in recall 12V188 (rear brake pads).", reason="Every fix is free.")},
  add=[DESMO],
  lessons={"G": ["Early Monsters have carbs. Later ones are fuel injected. Skip the steps that don't match."], "H": ["Monsters with Desmodue engines use belts. Change them by age even if the bike barely moved."]},
  recalls=[dict(id="09V142", years="2009 Monster 696", what="Main wiring harness may touch the vertical cylinder head and exhaust.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/09V142000"),
           dict(id="12V073", years="2011-2012 Monster 1100 EVO (some)", what="Rear rims marked DU6-RR may be faulty.", fix="Free dealer repair.", src="https://www.motorverso.com/recalls/ducati/12V073000/"),
           dict(id="12V188", years="2012 Monster 1100 EVO and 796 (some)", what="Rear brake pads problem.", fix="Dealer replaces the rear pads free.", src="https://vehiclesafetyrecalls.com/recall/12V188000")],
  known=[], forums=[DMS]))

B29.append(dict(id="ducati-916-996-998-1994", make="Ducati", model="916 / 996 / 998", name="Ducati 916 / 996 / 998", years=[1994, 2004],
  match=["916", "996", "998", "ducati 916", "ducati 996", "ducati 998", "916 sps", "996s"], style="sport", drive="chain",
  engine="748-998 cc liquid-cooled 90-degree L-twin, desmo 4-valve, fuel injected",
  intro="Tamburini's superbike. Belt-driven desmo four-valve heads, a single-sided swingarm and a dry clutch.",
  focus=[["Desmoquattro L-twin", "Liquid-cooled"], ["Fuel injected", "Weber-Marelli"], ["Timing belts", "Change by age"], ["Dry clutch", "Rattle is normal"], ["Single-sided swingarm", "Eccentric adjuster"]],
  remove=EFI, patch={}, add=[DESMO],
  lessons={"E": ["Chain slack is set with the eccentric hub in the single-sided swingarm."]},
  recalls=[], recallNote=OLD, known=[], forums=[DMS]))

B29.append(dict(id="ducati-multistrada-1200-2010", make="Ducati", model="Multistrada 1200", name="Ducati Multistrada 1200", years=[2010, 2017],
  match=["multistrada 1200", "multistrada", "mts1200", "mts 1200", "multistrada 1200 s", "multistrada 1200 pikes peak", "multistrada dvt"], style="adventure", drive="chain",
  engine="1198 cc liquid-cooled Testastretta L-twin (DVT from 2015), fuel injected",
  intro="Ducati's adventure sport tourer. Early bikes had several recalls, including a throttle cable recall on every 2010-2014 bike.",
  focus=[["1198 cc L-twin", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Throttle recall", "2010-2014"], ["Timing belts", "Change on time"], ["Keyless steering lock", "2010-2011"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2010 bikes are in recalls 10V356 (throttle cable cable tie) and 10V358 (steering head screw). 2010-2011 bikes are in recall 11V253 (electronic steering lock). 2010-2014 bikes are in recall 15V152 (throttle cable sleeve can stop the throttle closing).", reason="A throttle that won't close is a crash risk. Every fix is free.")},
  add=[DESMO], lessons={},
  recalls=[dict(id="10V356", years="2010 (some)", what="Throttle cables can rub on the radiator edge.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/10V356000"),
           dict(id="10V358", years="2010 (some)", what="Wrong screw may have been fitted in the steering head.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/10V358000"),
           dict(id="11V253", years="2010-2011", what="Electronic steering lock may not release at key-on.", fix="Dealer updates the hands-free unit software free.", src="https://vehiclesafetyrecalls.com/recall/11V253000"),
           dict(id="15V152", years="2010-2014", what="Throttle cable inner sleeve may move and stop the throttle from fully closing.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/15V152000")],
  known=[], forums=[DMS]))

B29.append(dict(id="ducati-900ss-750ss-1991", make="Ducati", model="900SS / 750SS (Supersport)", name="Ducati 900SS / 750SS", years=[1991, 2007],
  match=["900ss", "750ss", "900 ss", "750 ss", "ducati supersport", "800ss", "1000ss", "1000ds", "ss900", "ss750"], style="sport", drive="chain",
  engine="748-992 cc air-cooled 90-degree L-twin, two-valve desmo, carbs (to 1997) or fuel injected",
  intro="Ducati's air-cooled Supersport. A trellis frame, a two-valve desmo twin and carbs on the early ones.",
  focus=[["Air-cooled L-twin", "Desmodue"], ["Carb or EFI", "Depends on year"], ["Timing belts", "Change by age"], ["Dry clutch", "Rattle is normal"], ["Plastic tank", "Swells on some"]],
  remove=AIR, patch={}, add=[DESMO],
  lessons={"G": ["1991-1997 bikes have carbs. 1998-on bikes are fuel injected. Skip the steps that don't match."]},
  recalls=[], recallNote=VIN, known=[], forums=[DMS]))

B29.append(dict(id="ducati-panigale-v2-959-2016", make="Ducati", model="Panigale 959 / V2", name="Ducati Panigale 959 / V2", years=[2016, 2026],
  match=["panigale v2", "panigale 959", "959", "959 panigale", "panigale 899", "899", "v2 panigale"], style="sport", drive="chain",
  engine="955 cc liquid-cooled Superquadro L-twin, fuel injected",
  intro="Ducati's middleweight superbike. A few small recalls, mostly lighting and brakes.",
  focus=[["955 cc L-twin", "Superquadro"], ["Fuel injected", "Ride-by-wire"], ["Recalls", "Some years"], ["Valves", "Desmo service"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2018 959s are in recall 18V480 (rear brake pad friction material). 2020-2023 Panigale V2s are in recall 23V377 (headlight can switch to the DRL at night). Some 2025 V2s are in recall 25V838 (wiring fault that can lock a wheel).", reason="Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="18V480", years="2018 Panigale 959 (some)", what="Rear brake pad friction material may come off the backing plate.", fix="Free dealer repair.", src="https://www.motorverso.com/recalls/ducati/18V480000/"),
           dict(id="23V377", years="2020-2023 Panigale V2", what="Dashboard software can switch from low beam to the daytime running light at night.", fix="Dealer updates the dashboard software free.", src="https://vehiclesafetyrecalls.com/recall/23V377000"),
           dict(id="25V838", years="2025 Panigale V2 (some)", what="Fuse and wiring fault that can lock the front or rear wheel.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/25V838000")],
  known=[], forums=[DMS]))

B29.append(dict(id="ktm-390-adventure-2020", make="KTM", model="390 Adventure", name="KTM 390 Adventure", years=[2020, 2026],
  match=["390 adventure", "390 adv", "adventure 390", "390 adventure r", "390 adventure x"], style="adventure", drive="chain",
  engine="373 or 399 cc liquid-cooled single, fuel injected",
  intro="KTM's small adventure bike. Several recalls on 2022-on bikes, including an e-throttle recall.",
  focus=[["Single cylinder", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["E-throttle recall", "2022-2024"], ["Chain drive", "Slack and lube"], ["Side stand", "2025 recall"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2022-2024 bikes are in recall 25V598 (water in the e-throttle can cause loss of drive). 2025 Adventure R and X bikes are in recalls 25V825 (ECU software) and 25V907 (side stand spring can break).", reason="Losing drive power in traffic is dangerous. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="25V598", years="2022-2024", what="Water can get into the e-throttle unit and cause loss of drive power.", fix="Dealer replaces the throttle assembly free.", src="https://static.nhtsa.gov/odi/rcl/2025/RCAK-25V598-3272.pdf"),
           dict(id="25V825", years="2025 Adventure R and X", what="ECU software problem.", fix="Free dealer repair.", src="https://recallcheck.net/recall/25V825000"),
           dict(id="25V907", years="2025 Adventure R and X", what="Side stand spring may break from vibration and let the stand drop.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/25V907000")],
  known=[], forums=[ADVR]))

B29.append(dict(id="ktm-790-890-duke-2018", make="KTM", model="790 / 890 Duke", name="KTM 790 / 890 Duke", years=[2018, 2026],
  match=["790 duke", "890 duke", "duke 790", "duke 890", "890 duke r", "890 duke gp", "scalpel"], style="standard", drive="chain",
  engine="799 or 889 cc liquid-cooled LC8c parallel twin, fuel injected",
  intro="KTM's parallel-twin naked bike. Mostly normal upkeep.",
  focus=[["Parallel twin", "LC8c"], ["Fuel injected", "Ride-by-wire"], ["Chain drive", "Slack and lube"], ["Cooling", "Hoses and fan"], ["Valves", "Check on time"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[KTMF]))

B29.append(dict(id="ktm-790-890-adventure-2019", make="KTM", model="790 / 890 Adventure", name="KTM 790 / 890 Adventure", years=[2019, 2026],
  match=["790 adventure", "890 adventure", "790 adventure r", "890 adventure r", "790 adv", "890 adv", "890 adventure r rally"], style="adventure", drive="chain",
  engine="799 or 889 cc liquid-cooled LC8c parallel twin, fuel injected",
  intro="KTM's middleweight adventure twin. Early 790s had front and rear brake recalls.",
  focus=[["Parallel twin", "LC8c"], ["Fuel injected", "Ride-by-wire"], ["Brake recalls", "2019-2020"], ["Low fuel tank", "Check mounts"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2019-2020 790 Adventures are in recalls 20V198 (rear brake hose can overheat) and 21V304 (front brake master cylinder spring). Some 2019-2023 bikes are in recall 22V588 (tires).", reason="Brake failures are a crash risk. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="20V198", years="2019-2020 790 Adventure and R", what="Rear brake hose may overheat and the rear brake can fail.", fix="Dealer fits a new brake line free.", src="https://recallcheck.net/recall/20V198000"),
           dict(id="21V304", years="2019-2020 790 Adventure, R and R Rally", what="Front brake master cylinder return spring may be too weak, reducing braking.", fix="Dealer replaces the return spring free.", src="https://vehiclesafetyrecalls.com/recall/21V304000"),
           dict(id="22V588", years="2019-2023 (some)", what="Tire tread or belt problem.", fix="Free dealer repair.", src="https://vehicleflaws.com/recall/22V588000")],
  known=[], forums=[ADVR, KTMF]))

B29.append(dict(id="ktm-1290-super-duke-r-2014", make="KTM", model="1290 Super Duke R", name="KTM 1290 Super Duke R", years=[2014, 2026],
  match=["1290 super duke", "super duke r", "1290 super duke r", "super duke 1290", "sdr", "1290 super duke evo"], style="standard", drive="chain",
  engine="1301 cc liquid-cooled LC8 V-twin, fuel injected",
  intro="KTM's big V-twin naked bike. Several recalls, from a 2014 fuel tank to 2020-2022 wiring.",
  focus=[["1301 cc V-twin", "LC8"], ["Fuel injected", "Ride-by-wire"], ["Recalls", "Several years"], ["Chain drive", "Slack and lube"], ["Brakes", "Master cylinder recall"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls first", instructions="Run your VIN at nhtsa.gov/recalls. 2014 bikes are in recall 15V441 (fuel tank inserts can leak). 2015-2018 bikes are in recall 18V033 (front brake master cylinder piston can crack). 2020 bikes are in recall 21V122 and 2020-2022 bikes in recall 22V900 (wiring harness can short).", reason="Fuel leaks and brake failures are serious. Every fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="15V441", years="2014", what="Fuel may leak from the threaded inserts at the back of the tank.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/15V441000"),
           dict(id="18V033", years="2015-2018 (some)", what="Front brake master cylinder piston may crack.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/18V033000"),
           dict(id="21V122", years="2020 (some)", what="Rear wiring harness may be routed wrong and short-circuit.", fix="Dealer inspects and repairs the harness free.", src="https://vehiclesafetyrecalls.com/recall/21V122000"),
           dict(id="22V900", years="2020-2022", what="Main wiring harness may be misrouted or missing parts and short, stalling the engine.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/22V900000")],
  known=[], forums=[KTMF]))

HERO_NAME_B29 = {"triumph-trident-660-2021": "TRIDENT 660", "ducati-monster-1993": "MONSTER", "ducati-916-996-998-1994": "916",
  "ducati-multistrada-1200-2010": "MULTISTRADA", "ducati-900ss-750ss-1991": "900SS", "ducati-panigale-v2-959-2016": "PANIGALE",
  "ktm-390-adventure-2020": "390 ADVENTURE", "ktm-790-890-duke-2018": "890 DUKE", "ktm-790-890-adventure-2019": "890 ADVENTURE", "ktm-1290-super-duke-r-2014": "SUPER DUKE"}
