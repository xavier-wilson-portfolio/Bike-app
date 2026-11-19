"""Batch 53 bike tunes (top 1000, rows 521-530)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch31 import CBRF, SHADOWF
from batch22 import VJMC
B53 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B53.append(mk("honda-cbr1000rr-r-fireblade-sp-2020", "Honda", "CBR1000RR-R Fireblade SP", "Honda CBR1000RR-R Fireblade", [2020, 2026],
  ["cbr1000rr-r", "cbr1000rr r", "cbr1000rrr", "fireblade sp", "cbr1000rr-r sp", "fireblade", "cbr1000rr"], "sport", "chain",
  "999 cc liquid-cooled inline four, fuel injected, ride-by-wire",
  "Honda's current superbike. Lots of electronics, and on the SP, electronic suspension to check.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [CBRF]))

B53.append(mk("honda-cb650f-cbr650f-2014", "Honda", "CB650F / CBR650F", "Honda CB650F / CBR650F", [2014, 2018],
  ["cb650f", "cbr650f", "cb 650f", "cbr 650f", "cb650fa", "cbr650fa"], "standard", "chain",
  "649 cc liquid-cooled inline four, fuel injected",
  "Honda's middleweight four before the R models. Smooth and simple, with a long service life.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check them"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [CBRF]))

B53.append(mk("honda-vtr250-1988", "Honda", "VTR250", "Honda VTR250 Interceptor", [1988, 1990],
  ["vtr250", "vtr 250", "interceptor 250", "vtr250 interceptor"], "standard", "chain",
  "249 cc liquid-cooled 90-degree V-twin, two carbs, six-speed",
  "Honda's little V-twin from the late 80s. Two small carbs, a liquid-cooled twin and a half fairing.",
  [["V-twin", "Liquid-cooled"], ["Two carbs", "Sync them"], ["Cooling", "Coolant and hoses"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B53.append(mk("honda-ascot-ft500-vt500ft-1982", "Honda", "Ascot FT500 / VT500FT", "Honda Ascot FT500 / VT500FT", [1982, 1984],
  ["ascot", "ft500", "ft 500", "vt500ft", "ascot 500", "ft500 ascot", "vt500 ascot"], "standard", "chain",
  "498 cc air-cooled single (FT500) or 491 cc liquid-cooled V-twin with shaft drive (VT500FT)",
  "Honda's flat-track styled street bikes. The FT500 is a big single; the 1983 VT500FT is a V-twin with shaft drive.",
  [["Engine", "Single or twin"], ["Carb", "Clean it out"], ["Starting", "Check starter"], ["Valves", "Check them"], ["Final drive", "Chain or shaft"]],
  CARB, OLD, [VJMC], lessons={"K": ["The FT500 uses a chain. The VT500FT uses a shaft, so check the final drive oil and splines instead."]}))

B53.append(mk("honda-shadow-vt500c-vt700c-1983", "Honda", "Shadow VT500C / VT700C", "Honda Shadow VT500C / VT700C", [1983, 1987],
  ["vt500c", "vt700c", "shadow 500", "shadow 700", "vt 700c", "vt 500c", "shadow vt700", "shadow vt500"], "cruiser", "shaft",
  "491 or 694 cc liquid-cooled V-twin, two carbs, shaft drive",
  "The first Honda Shadows. Liquid-cooled V-twins with shaft drive and a lot of chrome.",
  [["V-twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Cooling", "Coolant and hoses"], ["Charging", "Check R/R"], ["Shaft", "Change oil"]],
  CARB, OLD, [SHADOWF]))

B53.append(mk("honda-nighthawk-250-cb250-1991", "Honda", "Nighthawk 250 (CB250)", "Honda Nighthawk 250", [1991, 2008],
  ["nighthawk 250", "cb250", "cb 250", "cb250 nighthawk", "nighthawk250"], "standard", "chain",
  "234 cc air-cooled parallel twin, one carb, five-speed",
  "Honda's long-running beginner twin. Shares its engine with the Rebel 250 and is easy to work on.",
  [["234 cc twin", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Cam chain", "Check it"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [VJMC]))

B53.append(mk("honda-cb450sc-nighthawk-1982", "Honda", "CB450SC Nighthawk", "Honda CB450SC Nighthawk", [1982, 1986],
  ["cb450sc", "nighthawk 450", "cb 450sc", "cb450 nighthawk", "cb450t"], "standard", "chain",
  "447 cc air-cooled parallel twin, two carbs, six-speed",
  "The 450 Nighthawk. A simple twin with two carbs, a six-speed box and electronic ignition.",
  [["447 cc twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Check them"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B53.append(mk("honda-cm400-cm450-1979", "Honda", "CM400 / CM450", "Honda CM400 / CM450", [1979, 1985],
  ["cm400", "cm450", "cm400a", "cm400e", "cm450e", "cm450a", "cm450c", "cm400c", "cm 400", "cm 450"], "cruiser", "chain",
  "395 or 447 cc air-cooled parallel twin, two carbs",
  "Honda's custom twins of the early 80s. Simple engines, two carbs, and a Hondamatic on the A models.",
  [["Twin", "Air-cooled"], ["Two carbs", "Sync them"], ["Valves", "Check them"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [SHADOWF], lessons={"K": ["The A models use a two-speed Hondamatic with its own fluid. Check the level and condition before you ride it."]}))

B53.append(mk("honda-cm185-cm200-cm250-twinstar-1978", "Honda", "CM185 / CM200 / CM250 Twinstar", "Honda Twinstar", [1978, 1983],
  ["twinstar", "cm185", "cm200", "cm200t", "cm185t", "cm250", "cm250c", "cm 200"], "cruiser", "chain",
  "181 to 234 cc air-cooled parallel twin, one carb",
  "Honda's small twin of the late 70s. A simple engine with one carb and electric start.",
  [["Small twin", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Cam chain", "Adjust it"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [VJMC]))

B53.append(mk("honda-valkyrie-rune-2004", "Honda", "Valkyrie Rune", "Honda Valkyrie Rune", [2004, 2005],
  ["rune", "valkyrie rune", "nrx1800", "nrx 1800", "honda rune"], "cruiser", "shaft",
  "1832 cc liquid-cooled flat six, fuel injected, shaft drive",
  "Honda's limited-run custom with the Gold Wing six. Rare, with many one-off parts.",
  [["Flat six", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Cooling", "Coolant and hoses"], ["Parts", "Source early"], ["Shaft", "Change oil"]],
  EFI, GENNOTE, [SHADOWF]))

HERO_NAME_B53 = {"honda-cbr1000rr-r-fireblade-sp-2020": "FIREBLADE", "honda-cb650f-cbr650f-2014": "CB650F", "honda-vtr250-1988": "VTR250",
  "honda-ascot-ft500-vt500ft-1982": "ASCOT", "honda-shadow-vt500c-vt700c-1983": "SHADOW", "honda-nighthawk-250-cb250-1991": "NIGHTHAWK",
  "honda-cb450sc-nighthawk-1982": "CB450SC", "honda-cm400-cm450-1979": "CM400", "honda-cm185-cm200-cm250-twinstar-1978": "TWINSTAR",
  "honda-valkyrie-rune-2004": "RUNE"}
