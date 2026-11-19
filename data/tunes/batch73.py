"""Batch 73 bike tunes (top 1000, rows 721-730)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch19 import UKGS, F650, AMCA
from batch27 import MOA, BMWNOTE
from batch20 import TRF
from batch38 import SCOOT
B73 = []
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."

B73.append(mk("bmw-g650-xchallenge-xcountry-xmoto-2007", "BMW", "G650 Xchallenge / Xcountry / Xmoto", "BMW G650X (Xchallenge, Xcountry, Xmoto)", [2007, 2009],
  ["g650x", "xchallenge", "xcountry", "xmoto", "g650 xchallenge", "g650 xcountry", "g650 xmoto", "g 650 x"], "dualsport", "chain",
  "652 cc liquid-cooled Rotax single, fuel injected",
  "BMW's light 650 singles of the late 2000s. Fuel injected, with an air shock on the Xchallenge.",
  [["Rotax single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Air shock", "Check it"], ["Chain drive", "Slack and lube"]],
  EFI, BMWNOTE, [F650]))

B73.append(mk("bmw-g450x-2008", "BMW", "G450X", "BMW G450X", [2008, 2010],
  ["g450x", "g 450 x", "g450", "bmw g450x"], "dualsport", "chain",
  "449 cc liquid-cooled single, fuel injected, coaxial swingarm pivot",
  "BMW's racing enduro. The swingarm pivots on the countershaft, and some parts are now hard to find.",
  [["Race single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check often"], ["Swingarm", "Check pivot"], ["Parts", "Source early"]],
  EFI, BMWNOTE, [UKGS]))

B73.append(mk("bmw-f900r-f900xr-2020", "BMW", "F900R / F900XR", "BMW F900R / F900XR", [2020, 2026],
  ["f900r", "f900xr", "f 900 r", "f 900 xr", "f900 r", "f900 xr"], "standard", "chain",
  "895 cc liquid-cooled parallel twin, fuel injected",
  "BMW's middleweight road twins. The F850GS engine bored out, with rider modes and a chain drive.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, BMWNOTE, [MOA]))

B73.append(mk("bmw-s1000r-2014", "BMW", "S1000R", "BMW S1000R", [2014, 2026],
  ["s1000r", "s 1000 r", "s1000 r", "m1000r"], "standard", "chain",
  "999 cc liquid-cooled inline four, fuel injected",
  "The naked S1000RR. A superbike engine, a full electronics package and semi-active suspension on many.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, BMWNOTE, [MOA]))

B73.append(mk("bmw-r1200rs-r1250rs-2015", "BMW", "R1200RS / R1250RS", "BMW R1200RS / R1250RS", [2015, 2026],
  ["r1200rs", "r1250rs", "r 1250 rs", "r 1200 rs", "r1200 rs", "r1250 rs"], "sport", "shaft",
  "1170 or 1254 cc liquid/air-cooled boxer twin, fuel injected, shaft drive",
  "BMW's sport-touring boxer with conventional forks. The water-cooled engine and a lot of electronics.",
  [["Boxer twin", "Liquid/air"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Final drive", "Check play"], ["Shaft", "Change oil"]],
  EFI, BMWNOTE, [MOA]))

B73.append(mk("bmw-c400x-c650-scooters-2016", "BMW", "C400X / C650 scooters", "BMW C400X / C650 scooters", [2016, 2026],
  ["c400x", "c400gt", "c650gt", "c650 sport", "c 400 x", "c 400 gt", "c650", "c600 sport"], "scooter", "belt",
  "350 cc single or 647 cc twin, liquid-cooled, fuel injected, CVT",
  "BMW's maxi-scooters. Fuel injected, a CVT and a lot of bodywork between you and the engine.",
  [["Engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and hoses"], ["Bodywork", "Many panels"]],
  EFI, BMWNOTE, [SCOOT]))

B73.append(mk("bmw-r1300gs-2024", "BMW", "R1300GS", "BMW R1300GS", [2024, 2026],
  ["r1300gs", "r 1300 gs", "r1300 gs", "r1300gsa", "1300gs", "r1300gs adventure"], "adventure", "shaft",
  "1300 cc liquid/air-cooled boxer twin, fuel injected, shaft drive",
  "The newest big GS. A new boxer with the gearbox under the engine, radar on some and a lot of electronics.",
  [["Boxer twin", "Liquid/air"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Final drive", "Check play"], ["Shaft", "Change oil"]],
  EFI, BMWNOTE, [UKGS]))

B73.append(mk("bmw-r12-r12-ninet-2024", "BMW", "R12 / R12 nineT", "BMW R12 / R12 nineT", [2024, 2026],
  ["r12", "r 12", "r12 ninet", "r12 nine t", "r12 s", "r 12 ninet"], "cruiser", "shaft",
  "1170 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  "BMW's 2024 heritage boxers. The air/oil-cooled boxer in a new frame, as a cruiser or a roadster.",
  [["Boxer twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Final drive", "Check play"], ["Shaft", "Change oil"]],
  EFI, BMWNOTE, [MOA]))

B73.append(mk("bmw-r1100rs-r1150rs-1993", "BMW", "R1100RS / R1150RS", "BMW R1100RS / R1150RS", [1993, 2005],
  ["r1100rs", "r1150rs", "r 1100 rs", "r 1150 rs", "r1100 rs", "r1150 rs"], "touring", "shaft",
  "1085 or 1130 cc air/oil-cooled boxer twin, fuel injected, shaft drive",
  "The first oilhead sport tourers. Telelever, fuel injection and a clutch spline to keep greased.",
  [["Boxer twin", "Air/oil-cooled"], ["Fuel injected", "No carbs"], ["Spline", "Check clutch"], ["Final drive", "Check play"], ["Shaft", "Change oil"]],
  EFI, BMWNOTE, [MOA], lessons={"K": ["Check and grease the clutch and transmission input splines. Dry splines are a known cause of wear on oilheads."]}))

B73.append(mk("triumph-tiger-110-t110-1954", "Triumph", "Tiger 110 (T110)", "Triumph Tiger 110 (T110)", [1954, 1961],
  ["t110", "tiger 110", "t 110", "tiger 110 650"], "standard", "chain",
  "649 cc air-cooled OHV pre-unit parallel twin, one carb, magneto",
  "Triumph's sporty 650 of the 50s. A pre-unit twin with a magneto, separate gearbox and swingarm frame.",
  [["Pre-unit twin", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [TRF]))

HERO_NAME_B73 = {"bmw-g650-xchallenge-xcountry-xmoto-2007": "G650X", "bmw-g450x-2008": "G450X", "bmw-f900r-f900xr-2020": "F900R",
  "bmw-s1000r-2014": "S1000R", "bmw-r1200rs-r1250rs-2015": "R1250RS", "bmw-c400x-c650-scooters-2016": "C400X", "bmw-r1300gs-2024": "R1300GS",
  "bmw-r12-r12-ninet-2024": "R12", "bmw-r1100rs-r1150rs-1993": "R1100RS", "triumph-tiger-110-t110-1954": "TIGER 110"}
