"""Batch 49 bike tunes (top 500, rows 481-490)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch44 import CLASSIC
from batch29 import ADVR
from batch47 import mk
from batch38 import SCOOT
B49 = []
TWO = CARB + AIR + ["H-003"]
HUSKF = dict(name="Husqvarna forum", url="https://www.huskyforum.com/", what="Owner forum for Husqvarna street and dirt bikes.")
URALF = dict(name="Soviet Steeds", url="https://www.sovietsteeds.com/", what="Owner forum for Ural and other sidecar rigs.")
HUSKNOTE = "Husqvarna (KTM group) has issued recalls on some bikes in these years. Run your VIN at nhtsa.gov/recalls before you start."
VESNOTE = "Piaggio has issued recalls on some Vespas in these years. Run your VIN at nhtsa.gov/recalls before you start."
VESSMALL = "Vintage Vespas mix oil into the fuel. Check the ratio for your model before you fill up."

B49.append(mk("bsa-b50-b44-victor-1965", "BSA", "B44 / B50 Victor", "BSA B44 / B50 Victor", [1965, 1973],
  ["b44", "b50", "victor", "b44 victor", "b50 victor", "victor special", "b50ss gold star", "shooting star"], "dualsport", "chain",
  "441 or 499 cc air-cooled unit single, Amal carb, points",
  "BSA's big unit singles. Kick start only, Amal carb and points, and known for being hard to start if anything is off.",
  [["Unit single", "Air-cooled"], ["Amal carb", "Clean it out"], ["Points", "Gap and time"], ["Kick start", "Set timing right"], ["Chain drive", "Slack and lube"]],
  CARB + AIR, OLD, [CLASSIC]))

B49.append(mk("triumph-t100-tiger-500-daytona-500-1959", "Triumph", "T100 Tiger / Daytona 500", "Triumph T100 Tiger / Daytona 500", [1959, 1974],
  ["t100", "t100r", "t100c", "tiger 100", "daytona 500", "t100 daytona", "tiger 500"], "standard", "chain",
  "490 cc air-cooled unit parallel twin, one or two Amal carbs, points",
  "Triumph's unit 500 twins. Smaller and lighter than the 650s, with the same Lucas wiring to sort out.",
  [["490 cc twin", "Air-cooled"], ["Amal carbs", "Clean and sync"], ["Points", "Gap and time"], ["Lucas wiring", "Check grounds"], ["Chain drive", "Slack and lube"]],
  CARB + AIR, OLD, [CLASSIC]))

B49.append(mk("husqvarna-svartpilen-vitpilen-401-2018", "Husqvarna", "Svartpilen / Vitpilen 401", "Husqvarna Svartpilen / Vitpilen 401", [2018, 2026],
  ["svartpilen", "vitpilen", "svartpilen 401", "vitpilen 401", "svartpilen 701", "vitpilen 701", "svartpilen 250"], "standard", "chain",
  "373 or 399 cc liquid-cooled single (692 cc on the 701), fuel injected",
  "Husqvarna's styled street singles, built on KTM Duke engines.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check interval"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, HUSKNOTE, [HUSKF]))

B49.append(mk("husqvarna-701-enduro-supermoto-2016", "Husqvarna", "701 Enduro / 701 Supermoto", "Husqvarna 701 Enduro / Supermoto", [2016, 2026],
  ["701 enduro", "701 supermoto", "husqvarna 701", "701 lr", "701"], "dualsport", "chain",
  "692 cc liquid-cooled LC4 single, fuel injected",
  "Husqvarna's big single, shared with the KTM 690. Fuel in the subframe and a valve check that matters.",
  [["692 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Fuel tank", "In subframe"], ["Valves", "Check interval"], ["Chain drive", "Slack and lube"]],
  EFI, HUSKNOTE, [HUSKF]))

B49.append(mk("husqvarna-norden-901-2022", "Husqvarna", "Norden 901", "Husqvarna Norden 901", [2022, 2026],
  ["norden", "norden 901", "norden 901 expedition"], "adventure", "chain",
  "889 cc liquid-cooled parallel twin, fuel injected",
  "Husqvarna's adventure twin, shared with the KTM 890 Adventure.",
  [["889 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Ride modes"], ["Spoked wheels", "Tubeless"], ["Chain drive", "Slack and lube"]],
  EFI, HUSKNOTE, [ADVR]))

B49.append(mk("ural-gear-up-ct-sidecar-2001", "Ural", "Gear Up / CT / Patrol (sidecar)", "Ural sidecar rigs (Gear Up, CT, Patrol)", [2001, 2026],
  ["ural", "gear up", "gear-up", "ural ct", "ural patrol", "ural tourist", "ural retro", "ural sidecar"], "standard", "shaft",
  "749 cc air-cooled boxer twin, carbs then fuel injection, shaft drive, sidecar",
  "Ural's sidecar rigs. Old-school boxer, shaft drive and two-wheel drive on many. Lots of hands-on service.",
  [["Boxer twin", "Air-cooled"], ["Fuel", "Carbs or EFI"], ["Sidecar", "Toe-in and lean"], ["2WD", "On many"], ["Shaft drive", "Check oil"]],
  [], VIN, [URALF], lessons={"K": ["A sidecar rig has three brakes and needs toe-in and lean-out set. Use the Ural manual for alignment."]}))

B49.append(mk("vespa-gts-250-300-2005", "Vespa", "GTS 250 / 300", "Vespa GTS 250 / 300", [2005, 2026],
  ["gts", "gts 300", "gts 250", "gts super", "gtv", "gts 300 super", "gts 310"], "scooter", "belt",
  "244 to 310 cc liquid-cooled single, fuel injected, CVT",
  "The big modern Vespa. Steel body, fuel injected, CVT belt to change on time.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Change on time"], ["Steel body", "Check rust"], ["Cooling", "Coolant"]],
  EFI, VESNOTE, [SCOOT]))

B49.append(mk("vespa-primavera-sprint-50-150-2014", "Vespa", "Primavera / Sprint (50-150)", "Vespa Primavera / Sprint", [2014, 2026],
  ["primavera", "primavera 150", "primavera 50", "sprint 150", "sprint 50", "vespa sprint", "vespa primavera"], "scooter", "belt",
  "50 or 155 cc air-cooled single, fuel injected or carb, CVT",
  "Vespa's modern small-frame scooters. Simple, with a CVT and a steel body.",
  [["Small single", "Air-cooled"], ["Fuel", "EFI or carb"], ["CVT belt", "Change on time"], ["Steel body", "Check rust"], ["Gear oil", "Change it"]],
  [], VESNOTE, [SCOOT]))

B49.append(mk("vespa-et4-et2-lx150-1996", "Vespa", "ET4 / ET2 / LX150", "Vespa ET4 / ET2 / LX150", [1996, 2013],
  ["et4", "et2", "lx150", "lx 150", "lx50", "s150", "vespa lx", "vespa et4"], "scooter", "belt",
  "49 to 150 cc air-cooled single, carb, CVT",
  "The Vespas between the classics and today's Primavera. Carbs, CVT and a steel body.",
  [["Small single", "Air-cooled"], ["Carb", "Clean it out"], ["CVT belt", "Inspect"], ["Steel body", "Check rust"], ["Gear oil", "Change it"]],
  CARB + AIR, VIN, [SCOOT]))

B49.append(mk("vespa-vbb-sprint-super-smallframe-and-largeframe-1960", "Vespa", "VBB / Sprint / Super (classic)", "Vespa classic largeframe and smallframe (VBB, Sprint, Super)", [1960, 1979],
  ["vbb", "vba", "vespa sprint 150", "vespa super", "vespa rally", "vespa 50", "vespa 90", "smallframe", "largeframe", "vespa gl"], "scooter", "chain",
  "50 to 200 cc air-cooled two-stroke single, carb, four-speed hand shift",
  "Classic Vespas with hand shift, premix and a lot of steel. Rust and wiring are the usual jobs.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Hand shift", "Cables"], ["Steel body", "Check rust"], ["Six-volt", "On many"]],
  TWO, OLD, [SCOOT], lessons={"B": [VESSMALL]}))

HERO_NAME_B49 = {"bsa-b50-b44-victor-1965": "VICTOR", "triumph-t100-tiger-500-daytona-500-1959": "T100", "husqvarna-svartpilen-vitpilen-401-2018": "SVARTPILEN",
  "husqvarna-701-enduro-supermoto-2016": "701", "husqvarna-norden-901-2022": "NORDEN", "ural-gear-up-ct-sidecar-2001": "URAL", "vespa-gts-250-300-2005": "GTS",
  "vespa-primavera-sprint-50-150-2014": "PRIMAVERA", "vespa-et4-et2-lx150-1996": "ET4", "vespa-vbb-sprint-super-smallframe-and-largeframe-1960": "VESPA"}
