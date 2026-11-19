"""Batch 65 bike tunes (top 1000, rows 641-650)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch34 import KAWF, VULF
from batch14 import KZR
B65 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."

B65.append(mk("kawasaki-eliminator-125-1998", "Kawasaki", "Eliminator 125", "Kawasaki Eliminator 125", [1998, 2009],
  ["eliminator 125", "bn125", "bn 125", "eliminator125"], "cruiser", "chain",
  "124 cc air-cooled single, carb, five-speed",
  "Kawasaki's small cruiser for new riders. One cylinder, one carb and very little to go wrong.",
  [["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Check them"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [VULF]))

B65.append(mk("kawasaki-ninja-300-2013", "Kawasaki", "Ninja 300", "Kawasaki Ninja 300", [2013, 2017],
  ["ninja 300", "ninja300", "ex300", "ex300a", "ex300b", "ninja 300 abs", "z300"], "sport", "chain",
  "296 cc liquid-cooled parallel twin, fuel injected, slipper clutch",
  "Kawasaki's small sport twin. Fuel injected, with a slipper clutch and many crash-damaged examples out there.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Crash damage", "Check frame"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [KAWF]))

B65.append(mk("kawasaki-ninja-250-1986-2007-1986", "Kawasaki", "Ninja 250 (1986-2007)", "Kawasaki Ninja 250 (EX250)", [1986, 2007],
  ["ninja 250", "ninja 250r", "ex250", "gpx250", "ex250f", "ex250e", "gpx 250", "ex 250"], "sport", "chain",
  "248 cc liquid-cooled DOHC parallel twin, two carbs",
  "The long-running little Ninja. Two small carbs, a high-revving twin and a lot of owner know-how online.",
  [["Twin", "Liquid-cooled"], ["Two carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [KAWF]))

B65.append(mk("kawasaki-zx-10-tomcat-1988", "Kawasaki", "ZX-10 Tomcat", "Kawasaki ZX-10 Tomcat", [1988, 1990],
  ["zx-10", "zx10", "tomcat", "zx1000b", "zx 10", "ninja zx-10"], "sport", "chain",
  "997 cc liquid-cooled DOHC inline four, four carbs",
  "Kawasaki's late-80s flagship. An aluminum frame, four carbs and a lot of fairing to remove.",
  [["Inline four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Charging", "Check R/R"]],
  CARB, OLD, [KZR]))

B65.append(mk("kawasaki-ninja-750r-zx-7-zx750-1989", "Kawasaki", "Ninja 750R / ZX-7 (ZX750)", "Kawasaki Ninja 750R / ZX-7", [1989, 1995],
  ["zx-7", "zx7", "ninja 750r", "zx750h", "zx750f", "zxr750", "zxr 750", "ninja 750"], "sport", "chain",
  "748 cc liquid-cooled DOHC inline four, four carbs",
  "Kawasaki's early-90s 750 sport bikes, sold as the Ninja 750R and ZX-7. Four carbs and a race-bred frame.",
  [["Inline four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [KZR]))

B65.append(mk("kawasaki-gpz1000rx-1986", "Kawasaki", "GPz1000RX", "Kawasaki GPz1000RX", [1986, 1987],
  ["gpz1000rx", "gpz 1000rx", "zx1000a", "gpz1000", "ninja 1000r", "ninja 1000 1986"], "sport", "chain",
  "997 cc liquid-cooled DOHC inline four, four carbs",
  "The big Ninja of the mid 80s. A liquid-cooled four with four carbs and a full fairing.",
  [["Inline four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Charging", "Check R/R"]],
  CARB, OLD, [KZR]))

B65.append(mk("kawasaki-zzr1200-2002", "Kawasaki", "ZZR1200", "Kawasaki ZZR1200", [2002, 2005],
  ["zzr1200", "zzr 1200", "zx1200c", "zzr-1200"], "sport", "chain",
  "1164 cc liquid-cooled DOHC inline four, four carbs",
  "Kawasaki's big sport tourer between the ZX-11 and ZX-14. Four carbs and a comfortable riding position.",
  [["Inline four", "Liquid-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  CARB, GENNOTE, [KAWF]))

B65.append(mk("kawasaki-z750-z750s-2005", "Kawasaki", "Z750 / Z750S", "Kawasaki Z750 / Z750S", [2005, 2012],
  ["z750", "z750s", "z 750", "z750r", "zr750j", "z750 2005"], "standard", "chain",
  "748 cc liquid-cooled inline four, fuel injected",
  "Kawasaki's middle Z. Fuel injected, a steel frame and a strong midrange.",
  [["Inline four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [KAWF]))

B65.append(mk("kawasaki-ninja-650r-er-6n-2006", "Kawasaki", "Ninja 650R / ER-6n", "Kawasaki Ninja 650R / ER-6n", [2006, 2016],
  ["ninja 650r", "er-6n", "er6n", "ex650a", "er-6f", "650r", "ninja 650 2012", "ex650c"], "sport", "chain",
  "649 cc liquid-cooled parallel twin, fuel injected",
  "Kawasaki's middleweight twin before the 2017 redesign. Fuel injected, simple and very common.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim check"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, GENNOTE, [KAWF]))

B65.append(mk("kawasaki-z1-r-1978", "Kawasaki", "Z1-R", "Kawasaki Z1-R", [1978, 1980],
  ["z1-r", "z1r", "kz1000d", "z1r-tc", "z1-r tc", "kz1000 z1r"], "standard", "chain",
  "1015 cc air-cooled DOHC inline four, four carbs",
  "Kawasaki's cafe-styled late-70s four. A bikini fairing, four carbs and parts that are getting scarce.",
  [["Inline four", "Air-cooled"], ["Four carbs", "Clean and sync"], ["Valves", "Shim check"], ["Charging", "Check R/R"], ["Parts", "Source early"]],
  CARB, OLD, [KZR]))

HERO_NAME_B65 = {"kawasaki-eliminator-125-1998": "ELIMINATOR", "kawasaki-ninja-300-2013": "NINJA 300", "kawasaki-ninja-250-1986-2007-1986": "NINJA 250",
  "kawasaki-zx-10-tomcat-1988": "ZX-10", "kawasaki-ninja-750r-zx-7-zx750-1989": "ZX-7", "kawasaki-gpz1000rx-1986": "GPZ1000RX",
  "kawasaki-zzr1200-2002": "ZZR1200", "kawasaki-z750-z750s-2005": "Z750", "kawasaki-ninja-650r-er-6n-2006": "NINJA 650R", "kawasaki-z1-r-1978": "Z1-R"}
