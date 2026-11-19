"""Batch 76 bike tunes (top 1000, rows 751-760)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch29 import DMS
from batch44 import DUCNOTE, DESMOV
B76 = []
BEVEL = "The bevel-drive cams are set with shims and need patience. Check the bevel gear backlash and the valve shims before you run it hard."
DRYCL = "Many of these have a dry clutch. The rattle is normal, but check the plates and the basket for notches."

B76.append(mk("ducati-darmah-900sd-1977", "Ducati", "Darmah 900SD", "Ducati Darmah 900SD", [1977, 1982],
  ["darmah", "900sd", "sd900", "darmah sd", "900 sd", "darmah ss", "darmah 900"], "standard", "chain",
  "864 cc air-cooled bevel-drive desmo V-twin, two carbs, electric start",
  "Ducati's bevel-drive sport tourer. Electric start, desmo heads and Bosch electronic ignition.",
  [["Bevel twin", "Air-cooled"], ["Two carbs", "Clean and sync"], ["Bevel drive", "Check backlash"], ["Desmo valves", "Shim check"], ["Charging", "Check R/R"]],
  CARB, OLD, [DMS], lessons={"H": [BEVEL]}))

B76.append(mk("ducati-250-350-450-singles-1964", "Ducati", "250 / 350 / 450 singles", "Ducati 250 / 350 / 450 singles", [1964, 1974],
  ["mark 3", "mk3", "desmo 450", "scrambler 450", "scrambler 350", "ducati 450", "ducati 350", "ducati 250", "monza", "mach 1", "narrow case", "wide case"], "standard", "chain",
  "248 to 436 cc air-cooled bevel-drive single, one carb, valve springs or desmo",
  "Ducati's bevel singles. Narrow-case and wide-case engines, a single carb and parts you will source from specialists.",
  [["Bevel single", "Air-cooled"], ["Carb", "Clean it out"], ["Bevel drive", "Check backlash"], ["Valves", "Shim check"], ["Parts", "Source early"]],
  CARB, OLD, [DMS], lessons={"H": [BEVEL]}))

B76.append(mk("ducati-sport-classic-gt1000-paul-smart-2006", "Ducati", "Sport Classic / GT1000 / Paul Smart", "Ducati Sport Classic / GT1000 / Paul Smart", [2006, 2010],
  ["sport classic", "sportclassic", "gt1000", "paul smart", "sport 1000", "paul smart 1000", "sport 1000s", "gt 1000"], "cafe", "chain",
  "992 cc air-cooled two-valve desmo V-twin, fuel injected",
  "Ducati's retro range on the DS1000 engine. Fuel injected, air cooled and belt-driven cams.",
  [["Desmo twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Chain drive", "Slack and lube"]],
  EFI, DUCNOTE, [DMS], lessons={"H": [DESMOV]}))

B76.append(mk("ducati-multistrada-1000-1100-air-cooled-2003", "Ducati", "Multistrada 1000 / 1100 (air-cooled)", "Ducati Multistrada 1000 / 1100", [2003, 2009],
  ["multistrada 1000", "multistrada 1100", "multistrada 620", "mts1000", "mts1100", "multistrada", "mts 1100", "multistrada 1000ds"], "adventure", "chain",
  "992 or 1078 cc air-cooled two-valve desmo V-twin, fuel injected",
  "The first Multistradas. Air-cooled DS engines with a dry clutch and a split fairing.",
  [["Desmo twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Dry clutch", "Check plates"]],
  EFI, DUCNOTE, [DMS], lessons={"H": [DESMOV], "K": [DRYCL]}))

B76.append(mk("ducati-multistrada-v4-2021", "Ducati", "Multistrada V4", "Ducati Multistrada V4", [2021, 2026],
  ["multistrada v4", "mts v4", "multistrada v4s", "multistrada v4 rally", "multistrada v4 pikes peak", "multistrada v4 s"], "adventure", "chain",
  "1158 cc liquid-cooled V4 with valve springs, fuel injected",
  "Ducati's V4 adventure bike. Spring valves instead of desmo, long service intervals and lots of electronics.",
  [["V4", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, DUCNOTE, [DMS]))

B76.append(mk("ducati-multistrada-950-v2-2017", "Ducati", "Multistrada 950 / V2", "Ducati Multistrada 950 / V2", [2017, 2026],
  ["multistrada 950", "multistrada v2", "mts950", "multistrada 950s", "multistrada v2s", "mts 950"], "adventure", "chain",
  "937 cc liquid-cooled Testastretta V-twin, fuel injected",
  "The smaller liquid-cooled Multistrada. A Testastretta twin, belt cams and a wet clutch.",
  [["Desmo twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Chain drive", "Slack and lube"]],
  EFI, DUCNOTE, [DMS], lessons={"H": [DESMOV]}))

B76.append(mk("ducati-streetfighter-848-1098-2009", "Ducati", "Streetfighter 848 / 1098", "Ducati Streetfighter 848 / 1098", [2009, 2015],
  ["streetfighter 848", "streetfighter 1098", "streetfighter s", "sf848", "sf1098", "streetfighter"], "standard", "chain",
  "849 or 1099 cc liquid-cooled Testastretta V-twin, fuel injected",
  "The naked superbike Ducatis. Superbike engines, belt cams and a dry clutch on the 1098.",
  [["Desmo twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Chain drive", "Slack and lube"]],
  EFI, DUCNOTE, [DMS], lessons={"H": [DESMOV]}))

B76.append(mk("ducati-supersport-939-950-2017", "Ducati", "SuperSport 939 / 950", "Ducati SuperSport 939 / 950", [2017, 2026],
  ["supersport 939", "supersport 950", "ss939", "ss950", "supersport s", "supersport 950s", "supersport 2017"], "sport", "chain",
  "937 cc liquid-cooled Testastretta V-twin, fuel injected",
  "Ducati's road-focused sport bike. The Hypermotard engine in a comfortable faired chassis.",
  [["Desmo twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Chain drive", "Slack and lube"]],
  EFI, DUCNOTE, [DMS], lessons={"H": [DESMOV]}))

B76.append(mk("ducati-hypermotard-1100-796-2007", "Ducati", "Hypermotard 1100 / 796", "Ducati Hypermotard 1100 / 796", [2007, 2012],
  ["hypermotard 1100", "hypermotard 796", "hypermotard 1100 evo", "hypermotard", "hyper 1100", "hypermotard 1100s"], "standard", "chain",
  "803 or 1078 cc air-cooled two-valve desmo V-twin, fuel injected",
  "The first Hypermotards. Air-cooled DS engines, a tall supermoto stance and a dry clutch on the 1100.",
  [["Desmo twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Chain drive", "Slack and lube"]],
  EFI, DUCNOTE, [DMS], lessons={"H": [DESMOV], "K": [DRYCL]}))

B76.append(mk("ducati-panigale-899-1199-1299-2012", "Ducati", "Panigale 899 / 1199 / 1299", "Ducati Panigale 899 / 1199 / 1299", [2012, 2018],
  ["panigale 1199", "panigale 1299", "1199", "1299", "panigale 899", "899", "1199 panigale", "1299 panigale", "panigale r"], "sport", "chain",
  "898 to 1285 cc liquid-cooled Superquadro V-twin, fuel injected",
  "The Superquadro Panigales. A frameless design, chain-driven cams and a lot of electronics.",
  [["Superquadro twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "Shim check"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"]],
  EFI, DUCNOTE, [DMS], lessons={"H": [DESMOV]}))

HERO_NAME_B76 = {"ducati-darmah-900sd-1977": "DARMAH", "ducati-250-350-450-singles-1964": "DUCATI 450", "ducati-sport-classic-gt1000-paul-smart-2006": "SPORT CLASSIC",
  "ducati-multistrada-1000-1100-air-cooled-2003": "MULTISTRADA", "ducati-multistrada-v4-2021": "MULTISTRADA V4", "ducati-multistrada-950-v2-2017": "MULTISTRADA 950",
  "ducati-streetfighter-848-1098-2009": "STREETFIGHTER", "ducati-supersport-939-950-2017": "SUPERSPORT", "ducati-hypermotard-1100-796-2007": "HYPERMOTARD",
  "ducati-panigale-899-1199-1299-2012": "PANIGALE"}
