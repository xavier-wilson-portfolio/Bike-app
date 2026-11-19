"""Batch 81 bike tunes (top 1000, rows 801-810)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch80 import MVF
from batch22 import VJMC
B81 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
BENF = dict(name="Benelli forums (benelliforums.com)", url="https://www.benelliforums.com/", what="Owner forum for modern Benelli models.")
EURO = dict(name="ADVrider", url="https://www.advrider.com/f/", what="Large riding forum with threads on most European makes, old and new.")

B81.append(mk("mv-agusta-brutale-1000-superveloce-2020-on-2020", "MV Agusta", "Brutale 1000 / Superveloce (2020 on)", "MV Agusta Brutale 1000 / Superveloce", [2020, 2026],
  ["brutale 1000", "brutale 1000 rr", "superveloce", "superveloce 800", "superveloce 1000", "brutale rr", "rush 1000", "brutale 1000 rs"], "sport", "chain",
  "998 cc inline four or 798 cc triple, liquid-cooled, fuel injected",
  "MV's current big naked and retro sport bikes. Radial valves, a lot of electronics and expensive bodywork.",
  [["Engine", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [MVF]))

B81.append(mk("benelli-tnt-300-302s-leoncino-500-2017", "Benelli", "TNT 300 / 302S / Leoncino 500", "Benelli TNT 300 / 302S / Leoncino 500", [2017, 2026],
  ["tnt 300", "302s", "302 s", "leoncino", "leoncino 500", "tnt300", "leoncino trail", "tnt 135"], "standard", "chain",
  "300 or 500 cc liquid-cooled parallel twin, fuel injected",
  "Benelli's small twins, built by QJ. Fuel injected and cheap, with parts supply that depends on the dealer.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Parts", "Check supply"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [EURO]))

B81.append(mk("benelli-trk-502-2018", "Benelli", "TRK 502", "Benelli TRK 502", [2018, 2026],
  ["trk 502", "trk502", "trk 502x", "trk502x", "trk 251", "trk 702"], "adventure", "chain",
  "500 cc liquid-cooled parallel twin, fuel injected",
  "Benelli's budget adventure bike. Heavy for its size, simple and fuel injected.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [EURO]))

B81.append(mk("benelli-tornado-tre-900-2002", "Benelli", "Tornado Tre 900", "Benelli Tornado Tre 900", [2002, 2006],
  ["tornado", "tornado tre", "tornado 900", "tornado tre 900", "tornado 1130", "tornado novecento"], "sport", "chain",
  "898 cc liquid-cooled triple, fuel injected, under-seat radiator",
  "Benelli's 2000s triple superbike. The radiator sits under the tail with fans, and parts are scarce.",
  [["Triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Tail fans"], ["Electrics", "Check them"], ["Parts", "Source early"]],
  EFI, GENNOTE, [EURO]))

B81.append(mk("benelli-750-sei-900-sei-1974", "Benelli", "750 Sei / 900 Sei", "Benelli 750 Sei / 900 Sei", [1974, 1984],
  ["750 sei", "900 sei", "sei", "benelli sei", "benelli six", "sei 750"], "standard", "chain",
  "748 or 906 cc air-cooled SOHC inline six, three carbs",
  "The first production six-cylinder bike. Three carbs feeding six cylinders and a lot of shared Guzzi-era parts.",
  [["Inline six", "Air-cooled"], ["Three carbs", "Clean and sync"], ["Points", "Gap and time"], ["Charging", "Check it"], ["Parts", "Source early"]],
  CARB, OLD, [EURO]))

B81.append(mk("benelli-imperiale-400-2021", "Benelli", "Imperiale 400", "Benelli Imperiale 400", [2021, 2026],
  ["imperiale 400", "imperiale", "benelli imperiale"], "standard", "chain",
  "374 cc air-cooled single, fuel injected",
  "Benelli's retro single. Simple, heavy and easy to work on.",
  [["Single", "Air-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Wiring", "Check connectors"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [EURO]))

B81.append(mk("bimota-db-sb-tesi-1980", "Bimota", "DB / SB / Tesi", "Bimota DB / SB / Tesi", [1980, 2010],
  ["bimota", "db1", "db2", "db5", "sb6", "sb8", "tesi", "db4", "kb2", "yb11"], "sport", "chain",
  "Engines from Ducati, Suzuki, Kawasaki or Yamaha in a Bimota frame",
  "Bimota's hand-built sport bikes with engines from other makers. Parts for the engine are easy; frame and bodywork parts are not.",
  [["Engine", "Check donor"], ["Fuel", "Carbs or EFI"], ["Frame", "Check welds"], ["Bodywork", "Hard to replace"], ["Chain drive", "Slack and lube"]],
  [], OLD, [EURO]))

B81.append(mk("laverda-750-sf-sfc-1968", "Laverda", "750 SF / SFC", "Laverda 750 SF / SFC", [1968, 1976],
  ["750 sf", "750 sfc", "sf750", "sfc 750", "laverda 750", "750 gt", "sf2", "sf3"], "standard", "chain",
  "744 cc air-cooled SOHC parallel twin, two carbs",
  "Laverda's tough 750 twins. Heavy-duty bottom ends, two carbs and an SFC endurance-racer version.",
  [["SOHC twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Points", "Gap and time"], ["Cam chain", "Check it"], ["Parts", "Source early"]],
  CARB, OLD, [EURO]))

B81.append(mk("laverda-1000-jota-1200-1973", "Laverda", "1000 / Jota / 1200", "Laverda 1000 / Jota / 1200", [1973, 1989],
  ["jota", "laverda jota", "3c", "3ce", "laverda 1000", "laverda 1200", "rgs", "rgs 1000", "jota 1000"], "sport", "chain",
  "981 or 1116 cc air-cooled DOHC triple, three carbs",
  "Laverda's big triples, including the Jota. Three carbs, a loud exhaust and a big following.",
  [["DOHC triple", "Air-cooled"], ["Three carbs", "Clean and sync"], ["Ignition", "Check it"], ["Cam chain", "Check it"], ["Parts", "Source early"]],
  CARB, OLD, [EURO]))

B81.append(mk("moto-morini-3-1-2-500-1973", "Moto Morini", "3 1/2 / 500", "Moto Morini 3 1/2 / 500", [1973, 1987],
  ["3 1/2", "3½", "morini 350", "morini 500", "350 sport", "500 sport", "camel", "kanguro"], "standard", "chain",
  "344 or 479 cc air-cooled 72-degree V-twin, Heron heads, belt-driven cam",
  "Morini's small V-twins. Light, with Heron combustion chambers and a toothed-belt cam drive.",
  [["V-twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Cam belt", "Change it"], ["Ignition", "Check it"], ["Parts", "Source early"]],
  CARB, OLD, [EURO]))

HERO_NAME_B81 = {"mv-agusta-brutale-1000-superveloce-2020-on-2020": "BRUTALE", "benelli-tnt-300-302s-leoncino-500-2017": "LEONCINO", "benelli-trk-502-2018": "TRK 502",
  "benelli-tornado-tre-900-2002": "TORNADO", "benelli-750-sei-900-sei-1974": "SEI", "benelli-imperiale-400-2021": "IMPERIALE", "bimota-db-sb-tesi-1980": "BIMOTA",
  "laverda-750-sf-sfc-1968": "LAVERDA", "laverda-1000-jota-1200-1973": "JOTA", "moto-morini-3-1-2-500-1973": "MORINI"}
