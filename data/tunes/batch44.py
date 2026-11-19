"""Batch 44 bike tunes (top 500, rows 431-440)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch20 import TRF
from batch29 import DMS
from batch43 import TRNOTE
B44 = []
DUCNOTE = "Ducati has issued recalls on some bikes in these years. Run your VIN at nhtsa.gov/recalls before you start."
DESMOV = "Desmo valve service needs both opening and closing shims checked. Follow the interval in the manual; it is not a job to skip."
CLASSIC = dict(name="Britbike forum", url="https://www.britbike.com/forums/", what="Forum for classic British motorcycles.")

B44.append(dict(id="triumph-speed-400-scrambler-400-x-2024", make="Triumph", model="Speed 400 / Scrambler 400 X", name="Triumph Speed 400 / Scrambler 400 X", years=[2024, 2026],
  match=["speed 400", "scrambler 400 x", "scrambler 400x", "speed 400 triumph", "scrambler 400"], style="standard", drive="chain",
  engine="398 cc liquid-cooled single, fuel injected",
  intro="Triumph's small singles, built with Bajaj. Simple, light and new to the US.",
  focus=[["398 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check interval"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=TRNOTE, known=[], forums=[TRF]))

B44.append(dict(id="triumph-thunderbird-1600-1700-2010", make="Triumph", model="Thunderbird 1600 / 1700", name="Triumph Thunderbird 1600 / 1700", years=[2010, 2018],
  match=["thunderbird 1600", "thunderbird 1700", "thunderbird storm", "thunderbird lt", "thunderbird commander", "thunderbird nightstorm"], style="cruiser", drive="belt",
  engine="1597 or 1699 cc liquid-cooled parallel twin, fuel injected, belt drive",
  intro="Triumph's big parallel-twin cruisers. Fuel injected and belt drive.",
  focus=[["Parallel twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Belt drive", "Check wear"], ["Cooling", "Coolant and fan"], ["Charging", "Check R/R"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=TRNOTE, known=[], forums=[TRF]))

B44.append(dict(id="triumph-america-speedmaster-865-2002", make="Triumph", model="America / Speedmaster (865)", name="Triumph America / Speedmaster", years=[2002, 2017],
  match=["triumph america", "america 865", "speedmaster", "speedmaster 865", "america lt"], style="cruiser", drive="chain",
  engine="790 or 865 cc air-cooled parallel twin, carbs then fuel injection",
  intro="The cruiser versions of the modern Bonneville. Carbs on early bikes, fuel injection from about 2008.",
  focus=[["Parallel twin", "Air-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Shim type"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=[], patch={}, add=[], lessons={"G": ["Check which you have. Carbureted bikes get the carb steps; fuel-injected bikes skip them."]},
  recalls=[], recallNote=TRNOTE, known=[], forums=[TRF]))

B44.append(dict(id="triumph-sprint-st-gt-1999", make="Triumph", model="Sprint ST / GT", name="Triumph Sprint ST / Sprint GT", years=[1999, 2016],
  match=["sprint st", "sprint gt", "sprint st 955", "sprint st 1050", "sprint 1050", "sprint rs"], style="touring", drive="chain",
  engine="955 or 1050 cc liquid-cooled inline triple, fuel injected",
  intro="Triumph's triple sport tourers. Fuel injected, with a regulator/rectifier and connectors worth checking.",
  focus=[["Inline triple", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Charging", "R/R and plug"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=TRNOTE, known=[], forums=[TRF]))

B44.append(dict(id="triumph-tr6-trophy-1956", make="Triumph", model="TR6 Trophy", name="Triumph TR6 Trophy (650)", years=[1956, 1973],
  match=["tr6", "tr6r", "tr6c", "trophy 650", "tr6 trophy", "tiger 650"], style="standard", drive="chain",
  engine="649 cc air-cooled parallel twin, one carb, points",
  intro="The single-carb 650 Triumph. Simpler than a Bonneville, with the same old-British wiring and oil leaks.",
  focus=[["649 cc twin", "Air-cooled"], ["Carb", "Amal"], ["Points", "Gap and time"], ["Lucas wiring", "Check grounds"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[CLASSIC]))

B44.append(dict(id="triumph-tiger-cub-t20-1954", make="Triumph", model="Tiger Cub (T20)", name="Triumph Tiger Cub (T20)", years=[1954, 1968],
  match=["tiger cub", "t20", "t20 tiger cub"], style="standard", drive="chain",
  engine="199 cc air-cooled single, one carb, points, six-volt",
  intro="Triumph's little 200 single. Points, six-volt electrics and a bottom end that needs care.",
  focus=[["199 cc single", "Air-cooled"], ["Carb", "Amal"], ["Points", "Gap and time"], ["Six-volt", "Weak lights"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"F": ["Six-volt bike. Use six-volt bulbs, battery and charger."]},
  recalls=[], recallNote=OLD, known=[], forums=[CLASSIC]))

B44.append(dict(id="triumph-thruxton-900-2004", make="Triumph", model="Thruxton 900", name="Triumph Thruxton 900", years=[2004, 2015],
  match=["thruxton", "thruxton 900", "thruxton 865", "thruxton ace"], style="cafe", drive="chain",
  engine="865 cc air-cooled parallel twin, carbs then fuel injection",
  intro="The cafe racer version of the air-cooled Bonneville. Carbs on early bikes, fuel injection later.",
  focus=[["865 cc twin", "Air-cooled"], ["Fuel", "Carbs or EFI"], ["Valves", "Shim type"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=[], patch={}, add=[], lessons={"G": ["Check which you have. Carbureted bikes get the carb steps; fuel-injected bikes skip them."]},
  recalls=[], recallNote=TRNOTE, known=[], forums=[TRF]))

B44.append(dict(id="triumph-bonneville-bobber-2017", make="Triumph", model="Bonneville Bobber", name="Triumph Bonneville Bobber", years=[2017, 2026],
  match=["bobber", "bonneville bobber", "bobber black", "bobber tfc", "speedmaster 1200"], style="cruiser", drive="chain",
  engine="1200 cc liquid-cooled parallel twin, fuel injected",
  intro="The hardtail-look Bonneville. Hidden shock, floating seat and the 1200 twin.",
  focus=[["1200 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Hidden shock", "Check it"], ["Cooling", "Coolant"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=TRNOTE, known=[], forums=[TRF]))

B44.append(dict(id="ducati-hypermotard-821-939-950-2013", make="Ducati", model="Hypermotard 821 / 939 / 950", name="Ducati Hypermotard 821 / 939 / 950", years=[2013, 2026],
  match=["hypermotard", "hypermotard 821", "hypermotard 939", "hypermotard 950", "hyperstrada", "hypermotard sp"], style="standard", drive="chain",
  engine="821 to 937 cc liquid-cooled Testastretta L-twin, fuel injected",
  intro="Ducati's tall supermoto-style twins. Fuel injected, desmo valves and a lot of fun.",
  focus=[["L-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "On schedule"], ["Timing belts", "Change on time"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={"H": [DESMOV]},
  recalls=[], recallNote=DUCNOTE, known=[], forums=[DMS]))

B44.append(dict(id="ducati-monster-821-1200-2014", make="Ducati", model="Monster 821 / 1200", name="Ducati Monster 821 / 1200", years=[2014, 2021],
  match=["monster 821", "monster 1200", "monster 1200 s", "monster 1200 r", "monster 797", "monster 821 stealth"], style="standard", drive="chain",
  engine="803 to 1198 cc Testastretta L-twin, liquid-cooled (air-cooled 797), fuel injected",
  intro="The liquid-cooled Monsters before the 937. Fuel injected, desmo valves and timing belts.",
  focus=[["L-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Desmo valves", "On schedule"], ["Timing belts", "Change on time"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={"H": [DESMOV]},
  recalls=[], recallNote=DUCNOTE, known=[], forums=[DMS]))

HERO_NAME_B44 = {"triumph-speed-400-scrambler-400-x-2024": "SPEED 400", "triumph-thunderbird-1600-1700-2010": "THUNDERBIRD", "triumph-america-speedmaster-865-2002": "SPEEDMASTER",
  "triumph-sprint-st-gt-1999": "SPRINT ST", "triumph-tr6-trophy-1956": "TR6", "triumph-tiger-cub-t20-1954": "TIGER CUB", "triumph-thruxton-900-2004": "THRUXTON",
  "triumph-bonneville-bobber-2017": "BOBBER", "ducati-hypermotard-821-939-950-2013": "HYPERMOTARD", "ducati-monster-821-1200-2014": "MONSTER"}
