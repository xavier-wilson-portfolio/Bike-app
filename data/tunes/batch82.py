"""Batch 82 bike tunes (top 1000, rows 811-820)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch81 import EURO
from batch55 import TT, PREMIX
from batch29 import KTMF
B82 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
HDIRT = "Off-road models are not always in the NHTSA recall search. Ask a Husqvarna dealer to run the VIN as well."

B82.append(mk("moto-morini-x-cape-650-2023", "Moto Morini", "X-Cape 650", "Moto Morini X-Cape 650", [2023, 2026],
  ["x-cape", "x cape 650", "xcape", "x-cape 650", "xcape 650"], "adventure", "chain",
  "649 cc liquid-cooled parallel twin, fuel injected",
  "Morini's middleweight adventure bike. A Chinese-built twin, a TFT dash and parts that depend on the importer.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Parts", "Check supply"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [EURO]))

B82.append(mk("cagiva-elefant-750-900-1985", "Cagiva", "Elefant 750 / 900", "Cagiva Elefant 750 / 900", [1985, 1997],
  ["elefant", "elefant 750", "elefant 900", "elefant 650", "cagiva elefant", "elefant 900 ie"], "adventure", "chain",
  "650 to 904 cc air-cooled Ducati desmo V-twin, two carbs or fuel injection",
  "Cagiva's Dakar-styled adventure bikes with Ducati engines. Belt cams, desmo valves and parts that need hunting.",
  [["Desmo twin", "Air-cooled"], ["Fuel", "Carbs or EFI"], ["Belts", "Change them"], ["Desmo valves", "Shim check"], ["Parts", "Source early"]],
  [], OLD, [EURO]))

B82.append(mk("cagiva-raptor-650-1000-v-raptor-1999", "Cagiva", "Raptor 650 / 1000 / V-Raptor", "Cagiva Raptor / V-Raptor", [1999, 2005],
  ["raptor", "v-raptor", "raptor 650", "raptor 1000", "x-raptor", "v raptor", "cagiva raptor"], "standard", "chain",
  "645 or 996 cc liquid-cooled Suzuki V-twin, fuel injected",
  "Cagiva's naked bikes with Suzuki SV650 and TL1000 engines. Engine parts are easy; chassis parts are not.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [EURO]))

B82.append(mk("husqvarna-fc-fe-tc-te-2014-on-2014", "Husqvarna", "FC / FE / TC / TE (2014 on)", "Husqvarna FC / FE / TC / TE (2014 on)", [2014, 2026],
  ["fc 450", "fc 250", "fc 350", "fe 350", "fe 501", "fe 250", "fe 450", "te 300", "te 250", "tc 250", "tx 300", "te 300i"], "dualsport", "chain",
  "125 to 510 cc liquid-cooled two- or four-stroke single",
  "The KTM-era Husqvarnas. Shared engines with KTM, a plastic subframe and service intervals measured in hours.",
  [["Single", "Check type"], ["Fuel", "Check system"], ["Valves or top end", "Check"], ["Cooling", "Coolant and hoses"], ["Hours", "Log them"]],
  [], HDIRT, [TT], lessons={"B": ["FC and FE models are four-strokes. TC, TE and TX models are two-strokes, and older ones run premix. Check which one you have."]}))

B82.append(mk("husqvarna-te-610-sm-610-1998", "Husqvarna", "TE 610 / SM 610", "Husqvarna TE 610 / SM 610", [1998, 2010],
  ["te 610", "sm 610", "te610", "sm610", "te 610e", "sm 610s", "te 570", "sm 570"], "dualsport", "chain",
  "576 cc liquid-cooled four-valve single, carb or fuel injection, electric start",
  "The Cagiva-era big Husky singles. Tough, with electric start and a lot of shared parts across years.",
  [["Big single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Shim check"], ["Starter", "Check it"], ["Chain drive", "Slack and lube"]],
  [], HDIRT, [TT]))

B82.append(mk("husqvarna-wr-cr-xc-swedish-two-stroke-1966", "Husqvarna", "WR / CR / XC (Swedish two-stroke)", "Husqvarna WR / CR / XC (Swedish)", [1966, 1987],
  ["wr 250", "cr 250", "xc 500", "cr 400", "wr 400", "husky 400", "cr 125", "wr 500", "husky cr", "automatic 430", "mag 250"], "dualsport", "chain",
  "125 to 500 cc air-cooled two-stroke single, premix",
  "The classic Swedish Huskies. Premix two-strokes, long-travel suspension and a strong vintage racing scene.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check spark"], ["Suspension", "Rebuild it"]],
  TWO, OLD, [TT], lessons={"B": [PREMIX]}))

B82.append(mk("husqvarna-te-250-310-450-510-italian-2002", "Husqvarna", "TE 250 / 310 / 450 / 510 (Italian)", "Husqvarna TE 250-510 (Italian era)", [2002, 2013],
  ["te 250", "te 310", "te 450", "te 510", "te510", "te450", "te310", "tc 450", "sm 450", "smr 510", "txc 310"], "dualsport", "chain",
  "249 to 501 cc liquid-cooled four-stroke single, carb then fuel injection",
  "The Italian-built Husqvarna four-strokes. Light and fast, with short service intervals and parts that are now harder to find.",
  [["Single", "Liquid-cooled"], ["Fuel", "Carb or EFI"], ["Valves", "Check often"], ["Cooling", "Coolant and hoses"], ["Parts", "Source early"]],
  [], HDIRT, [TT]))

B82.append(mk("husqvarna-nuda-900-2012", "Husqvarna", "Nuda 900", "Husqvarna Nuda 900", [2012, 2013],
  ["nuda", "nuda 900", "nuda 900r", "nuda r"], "standard", "chain",
  "898 cc liquid-cooled parallel twin, fuel injected",
  "Husqvarna's BMW-era supermoto twin. The F800 engine enlarged, in a tall, light chassis.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [EURO]))

B82.append(mk("husqvarna-svartpilen-801-vitpilen-801-2024", "Husqvarna", "Svartpilen 801 / Vitpilen 801", "Husqvarna Svartpilen 801 / Vitpilen 801", [2024, 2026],
  ["svartpilen 801", "vitpilen 801", "svartpilen801", "vitpilen801"], "standard", "chain",
  "799 cc liquid-cooled parallel twin, fuel injected",
  "Husqvarna's bigger Pilen models on the KTM 790 Duke platform. Fuel injected, with rider modes.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [KTMF]))

B82.append(mk("husqvarna-tr650-terra-strada-2013", "Husqvarna", "TR650 Terra / Strada", "Husqvarna TR650 Terra / Strada", [2013, 2014],
  ["tr650", "terra", "strada", "tr650 terra", "tr650 strada", "tr 650"], "dualsport", "chain",
  "652 cc liquid-cooled single, fuel injected",
  "Husqvarna's BMW-era 650 single. Based on the BMW G650 engine, with a short production run.",
  [["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [EURO]))

HERO_NAME_B82 = {"moto-morini-x-cape-650-2023": "X-CAPE", "cagiva-elefant-750-900-1985": "ELEFANT", "cagiva-raptor-650-1000-v-raptor-1999": "RAPTOR",
  "husqvarna-fc-fe-tc-te-2014-on-2014": "HUSQVARNA", "husqvarna-te-610-sm-610-1998": "TE 610", "husqvarna-wr-cr-xc-swedish-two-stroke-1966": "HUSKY",
  "husqvarna-te-250-310-450-510-italian-2002": "TE 450", "husqvarna-nuda-900-2012": "NUDA", "husqvarna-svartpilen-801-vitpilen-801-2024": "SVARTPILEN",
  "husqvarna-tr650-terra-strada-2013": "TR650"}
