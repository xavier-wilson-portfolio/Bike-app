"""Batch 47 bike tunes (top 500, rows 461-470)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch30 import GUZ
from batch46 import APRF, APRNOTE
B47 = []
TWO = CARB + AIR + ["H-003"]
MVF = dict(name="MV Agusta forum", url="https://www.mvagusta.net/", what="Owner forum for MV Agusta motorcycles.")
MVNOTE = "MV Agusta has issued recalls on some bikes in these years. Run your VIN at nhtsa.gov/recalls before you start."
GUZNOTE = "Moto Guzzi has issued recalls on some bikes in these years. Run your VIN at nhtsa.gov/recalls before you start."
GUZV = "Guzzi V-twins need the valves set and the throttle bodies or carbs balanced together. Do both at the same service."

def mk(id, make, model, name, years, match, style, drive, engine, intro, focus, remove, note, forums, lessons=None):
    return dict(id=id, make=make, model=model, name=name, years=years, match=match, style=style, drive=drive, engine=engine, intro=intro, focus=focus,
                remove=remove, patch={}, add=[], lessons=lessons or {}, recalls=[], recallNote=note, known=[], forums=forums)

B47.append(mk("aprilia-rsv-mille-tuono-1000-1998", "Aprilia", "RSV Mille / Tuono 1000", "Aprilia RSV Mille / Tuono 1000", [1998, 2010],
  ["rsv mille", "mille", "rsv 1000", "tuono 1000", "rsv1000r", "tuono r", "rsv mille r"], "sport", "chain",
  "998 cc liquid-cooled Rotax 60-degree V-twin, fuel injected",
  "Aprilia's Rotax V-twin superbike and its naked twin. Fuel injected, with a clutch slave and starter sprag worth checking.",
  [["998 cc V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Starter sprag", "Known issue"], ["Cooling", "Coolant and fans"], ["Chain drive", "Slack and lube"]],
  EFI, APRNOTE, [APRF]))

B47.append(mk("aprilia-shiver-750-dorsoduro-750-2008", "Aprilia", "Shiver 750 / Dorsoduro 750", "Aprilia Shiver 750 / Dorsoduro 750", [2008, 2017],
  ["shiver", "shiver 750", "dorsoduro", "dorsoduro 750", "dorsoduro 1200", "shiver 900", "dorsoduro 900"], "standard", "chain",
  "750 or 896 cc liquid-cooled V-twin, ride-by-wire fuel injection",
  "Aprilia's middleweight V-twins. Early ride-by-wire and a trellis frame.",
  [["V-twin", "Liquid-cooled"], ["Fuel injected", "Ride-by-wire"], ["Electronics", "Ride modes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, APRNOTE, [APRF]))

B47.append(mk("aprilia-tuareg-660-2022", "Aprilia", "Tuareg 660", "Aprilia Tuareg 660", [2022, 2026],
  ["tuareg", "tuareg 660", "tuareg660"], "adventure", "chain",
  "659 cc liquid-cooled parallel twin, fuel injected",
  "Aprilia's off-road adventure twin. 21-inch front, long-travel suspension.",
  [["659 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Spoked wheels", "Check spokes"], ["Electronics", "Ride modes"], ["Chain drive", "Slack and lube"]],
  EFI, APRNOTE, [APRF]))

B47.append(mk("aprilia-rs-250-rs-50-1995", "Aprilia", "RS 250 / RS 50", "Aprilia RS 250 / RS 50", [1995, 2005],
  ["rs 250", "rs250", "rs 50", "rs50", "rs 125", "rs125"], "sport", "chain",
  "49 to 249 cc liquid-cooled two-stroke, carbs, oil injection",
  "Aprilia's small two-stroke sportbikes. Mostly imports in the US. Top ends and crank seals need care.",
  [["Two-stroke", "Liquid-cooled"], ["Carbs", "Clean and jet"], ["Oil injection", "Bleed the pump"], ["Crank seals", "Check them"], ["Import papers", "Check title"]],
  TWO, OLD, [APRF], lessons={"A": ["Many of these are imports. Make sure the title and VIN paperwork match before you put money in."]}))

B47.append(mk("mv-agusta-f3-brutale-675-800-2012", "MV Agusta", "F3 / Brutale 675 / 800", "MV Agusta F3 / Brutale 675 / 800", [2012, 2026],
  ["f3", "f3 675", "f3 800", "brutale 675", "brutale 800", "dragster 800", "turismo veloce", "rivale 800"], "sport", "chain",
  "675 or 798 cc liquid-cooled inline triple with counter-rotating crank, fuel injected",
  "MV's triples. Fast, pretty, and known for electronics and dealer-only service quirks.",
  [["Inline triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Check updates"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, MVNOTE, [MVF]))

B47.append(mk("mv-agusta-f4-brutale-1000-1999", "MV Agusta", "F4 / Brutale 750-1090", "MV Agusta F4 / Brutale (four)", [1999, 2019],
  ["f4", "f4 750", "f4 1000", "brutale 1090", "brutale 910", "brutale 989", "brutale 750", "f4 rr"], "sport", "chain",
  "749 to 1078 cc liquid-cooled inline four with radial valves, fuel injected",
  "MV's four-cylinder bikes. Beautiful, expensive parts and a lot of fasteners under the bodywork.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Radial valves", "Shim type"], ["Cooling", "Coolant and fans"], ["Chain drive", "Slack and lube"]],
  EFI, MVNOTE, [MVF]))

B47.append(mk("moto-guzzi-california-1100-1400-1994", "Moto Guzzi", "California 1100 / 1400", "Moto Guzzi California 1100 / 1400", [1994, 2020],
  ["california", "california 1100", "california 1400", "california ev", "california vintage", "eldorado 1400", "audace", "california touring"], "cruiser", "shaft",
  "1064 or 1380 cc air-cooled transverse V-twin, fuel injected, shaft drive",
  "Guzzi's big cruiser. Fuel injected transverse V-twin and shaft drive, with linked brakes on many.",
  [["V-twin", "Air-cooled"], ["Fuel injected", "Balance bodies"], ["Shaft drive", "Check oil"], ["Linked brakes", "On many"], ["Charging", "Check R/R"]],
  EFI, GUZNOTE, [GUZ], lessons={"H": [GUZV]}))

B47.append(mk("moto-guzzi-v85-tt-2019", "Moto Guzzi", "V85 TT", "Moto Guzzi V85 TT", [2019, 2026],
  ["v85", "v85 tt", "v85tt", "v85 tt travel"], "adventure", "shaft",
  "853 cc air-cooled transverse V-twin, fuel injected, shaft drive",
  "Guzzi's retro adventure bike. Air-cooled V-twin, shaft drive and spoked wheels.",
  [["853 cc V-twin", "Air-cooled"], ["Fuel injected", "No carbs"], ["Shaft drive", "Check oil"], ["Spoked wheels", "Tubeless"], ["Electronics", "Ride modes"]],
  EFI, GUZNOTE, [GUZ], lessons={"H": [GUZV]}))

B47.append(mk("moto-guzzi-eldorado-ambassador-v7-special-loop-frame-1967", "Moto Guzzi", "Eldorado / Ambassador / V7 Special (loop frame)", "Moto Guzzi loop-frame (V7, Ambassador, Eldorado)", [1967, 1974],
  ["eldorado", "ambassador", "v7 special", "v750", "v850 eldorado", "loop frame", "guzzi police"], "cruiser", "shaft",
  "703 to 844 cc air-cooled transverse V-twin, two carbs, points, shaft drive",
  "The first Guzzi V-twins. Many were police bikes. Big, heavy and simple, with points and a generator.",
  [["V-twin", "Air-cooled"], ["Two carbs", "Dell'Orto"], ["Points", "Gap and time"], ["Generator", "Check output"], ["Shaft drive", "Check oil"]],
  CARB + AIR, OLD, [GUZ], lessons={"H": [GUZV]}))

B47.append(mk("moto-guzzi-griso-breva-stelvio-2004", "Moto Guzzi", "Griso / Breva / Stelvio / Norge", "Moto Guzzi Griso, Breva, Stelvio, Norge", [2004, 2017],
  ["griso", "breva", "stelvio", "norge", "breva 1100", "griso 1200", "stelvio ntx", "norge gt"], "standard", "shaft",
  "744 to 1151 cc air-cooled transverse V-twin, fuel injected, shaft drive",
  "Guzzi's 2000s range. Fuel injected V-twins, shaft drive and CARC final drive on the big ones.",
  [["V-twin", "Air-cooled"], ["Fuel injected", "Balance bodies"], ["Shaft drive", "Check oil"], ["Charging", "Check R/R"], ["Electronics", "Some CANbus"]],
  EFI, GUZNOTE, [GUZ], lessons={"H": [GUZV]}))

HERO_NAME_B47 = {"aprilia-rsv-mille-tuono-1000-1998": "MILLE", "aprilia-shiver-750-dorsoduro-750-2008": "SHIVER", "aprilia-tuareg-660-2022": "TUAREG",
  "aprilia-rs-250-rs-50-1995": "RS 250", "mv-agusta-f3-brutale-675-800-2012": "F3", "mv-agusta-f4-brutale-1000-1999": "F4",
  "moto-guzzi-california-1100-1400-1994": "CALIFORNIA", "moto-guzzi-v85-tt-2019": "V85 TT", "moto-guzzi-eldorado-ambassador-v7-special-loop-frame-1967": "ELDORADO",
  "moto-guzzi-griso-breva-stelvio-2004": "GRISO"}
