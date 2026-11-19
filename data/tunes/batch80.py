"""Batch 80 bike tunes (top 1000, rows 791-800)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch30 import GUZ
from batch46 import APRF, APRNOTE
from batch38 import SCOOT
from batch55 import TT
from batch79 import GUZNOTE
from batch51 import INJ
B80 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
MVF = dict(name="MV Agusta forum (mvagusta.net)", url="https://www.mvagusta.net/", what="Owner forum for MV Agusta models, old and new.")

B80.append(mk("moto-guzzi-v9-roamer-bobber-2016", "Moto Guzzi", "V9 Roamer / Bobber", "Moto Guzzi V9 Roamer / Bobber", [2016, 2026],
  ["v9", "v9 roamer", "v9 bobber", "v9 bobber sport", "roamer", "v9 special"], "standard", "shaft",
  "853 cc air-cooled 90-degree V-twin, fuel injected, shaft drive",
  "Guzzi's mid-size cruisers. The 850 small-block twin with fuel injection and shaft drive.",
  [["V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Set them"], ["Clutch", "Check it"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [GUZ]))

B80.append(mk("moto-guzzi-v100-mandello-stelvio-2023", "Moto Guzzi", "V100 Mandello / Stelvio", "Moto Guzzi V100 Mandello / Stelvio", [2023, 2026],
  ["v100", "v100 mandello", "mandello", "v100 stelvio", "stelvio 2024", "mandello s", "v100 s"], "touring", "shaft",
  "1042 cc liquid-cooled 90-degree V-twin, fuel injected, shaft drive",
  "Guzzi's first liquid-cooled twin. Shaft drive, ride-by-wire and, on the Mandello, active aero flaps.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [GUZ]))

B80.append(mk("moto-guzzi-falcone-1950", "Moto Guzzi", "Falcone", "Moto Guzzi Falcone", [1950, 1976],
  ["falcone", "falcone sport", "falcone turismo", "nuovo falcone", "falcone 500", "astore"], "standard", "chain",
  "499 cc air-cooled horizontal single, exposed flywheel, one carb",
  "Guzzi's classic horizontal single with the outside flywheel. Simple, slow-revving and full of character.",
  [["Flat single", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Valves", "Set them"], ["Parts", "Source early"]],
  CARB, OLD, [GUZ]))

B80.append(mk("aprilia-mana-850-gp850-2008", "Aprilia", "Mana 850 / GP850", "Aprilia Mana 850 / GP850", [2008, 2016],
  ["mana 850", "mana", "gp850", "mana gt", "gp 850", "mana 850 gt"], "standard", "chain",
  "839 cc liquid-cooled V-twin, fuel injected, automatic CVT with a manual mode",
  "Aprilia's automatic motorcycle. A V-twin with a CVT and a storage space where the tank would be.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT belt", "Inspect"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, APRNOTE, [APRF]))

B80.append(mk("aprilia-caponord-1200-etv1000-2001", "Aprilia", "Caponord 1200 / ETV1000", "Aprilia Caponord 1200 / ETV1000", [2001, 2016],
  ["caponord", "etv1000", "caponord 1200", "etv 1000", "caponord rally", "etv1000 caponord"], "adventure", "chain",
  "998 or 1197 cc liquid-cooled V-twin, fuel injected",
  "Aprilia's adventure tourers. The Rotax V60 twin in the ETV, the Dorsoduro-based twin in the 1200.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, APRNOTE, [APRF]))

B80.append(mk("aprilia-sr50-rally-50-1996", "Aprilia", "SR50 / Rally 50", "Aprilia SR50 / Rally 50", [1996, 2015],
  ["sr50", "sr 50", "rally 50", "sr50 ditech", "sr50r", "sr50 street", "rally 50 lc"], "scooter", "belt",
  "49 cc two-stroke single, air- or liquid-cooled, oil injection, CVT",
  "Aprilia's sporty 50 scooters. Two-strokes with oil injection, a CVT and lots of tuning parts.",
  [["Two-stroke", "Oil injection"], ["Carb or Ditech", "Check fuel"], ["CVT belt", "Inspect"], ["Cooling", "Check type"], ["Brakes", "Check them"]],
  TWO, APRNOTE, [SCOOT], lessons={"B": [INJ]}))

B80.append(mk("aprilia-rs-457-2025", "Aprilia", "RS 457", "Aprilia RS 457", [2025, 2026],
  ["rs 457", "rs457", "aprilia rs 457", "tuono 457"], "sport", "chain",
  "457 cc liquid-cooled parallel twin, fuel injected, ride-by-wire",
  "Aprilia's small sport twin. Light, with an aluminum frame and real rider modes for its class.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, APRNOTE, [APRF]))

B80.append(mk("aprilia-sxv-rxv-450-550-2006", "Aprilia", "SXV / RXV 450-550", "Aprilia SXV / RXV 450-550", [2006, 2011],
  ["sxv", "rxv", "sxv 450", "rxv 450", "sxv 550", "rxv 550", "sxv450", "rxv550"], "dualsport", "chain",
  "449 or 549 cc liquid-cooled V-twin, fuel injected",
  "Aprilia's twin-cylinder dirt bikes. Very fast, very light and very high-maintenance, with short service intervals.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check often"], ["Hours", "Log them"], ["Parts", "Source early"]],
  EFI, APRNOTE, [TT]))

B80.append(mk("aprilia-falco-sl1000-futura-rst1000-1999", "Aprilia", "Falco SL1000 / Futura RST1000", "Aprilia Falco SL1000 / Futura RST1000", [1999, 2004],
  ["falco", "sl1000", "futura", "rst1000", "sl1000 falco", "rst1000 futura", "sl 1000", "rst 1000"], "sport", "chain",
  "998 cc liquid-cooled Rotax V60 V-twin, fuel injected",
  "Aprilia's road sport bikes on the Mille engine. The Falco is the half-faired one, the Futura the sport tourer.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  EFI, APRNOTE, [APRF]))

B80.append(mk("mv-agusta-750s-750-america-1971", "MV Agusta", "750S / 750 America", "MV Agusta 750S / 750 America", [1971, 1977],
  ["750s", "750 america", "750s america", "mv 750s", "mv agusta 750", "800 america", "750 sport"], "sport", "shaft",
  "743 or 789 cc air-cooled DOHC inline four, four carbs, shaft drive",
  "MV's road-going fours. Gear-driven cams, shaft drive and values that make every job worth doing slowly.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Points", "Gap and time"], ["Shaft", "Change oil"]],
  CARB, OLD, [MVF]))

HERO_NAME_B80 = {"moto-guzzi-v9-roamer-bobber-2016": "V9", "moto-guzzi-v100-mandello-stelvio-2023": "V100", "moto-guzzi-falcone-1950": "FALCONE",
  "aprilia-mana-850-gp850-2008": "MANA", "aprilia-caponord-1200-etv1000-2001": "CAPONORD", "aprilia-sr50-rally-50-1996": "SR50", "aprilia-rs-457-2025": "RS 457",
  "aprilia-sxv-rxv-450-550-2006": "SXV", "aprilia-falco-sl1000-futura-rst1000-1999": "FALCO", "mv-agusta-750s-750-america-1971": "750 AMERICA"}
