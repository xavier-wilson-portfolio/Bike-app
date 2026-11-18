"""Batch 35 bike tunes (top 500, rows 341-350)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch31 import CARB4
from batch34 import KAWF
B35 = []
TWO = CARB + AIR + ["H-003"]
KZR = dict(name="KZRider", url="https://www.kzrider.com/", what="Forum for vintage Kawasaki KZ and Z bikes.")
ZXF = dict(name="ZX Forums", url="https://www.zxforums.com/", what="Owner forum for Kawasaki Ninja ZX models.")

B35.append(dict(id="kawasaki-kx250-two-stroke-1974", make="Kawasaki", model="KX250 (two-stroke)", name="Kawasaki KX250 (two-stroke)", years=[1974, 2007],
  match=["kx250", "kx 250", "kx250 two stroke", "kx250 2 stroke"], style="dualsport", drive="chain",
  engine="249 cc two-stroke single, carb, premix",
  intro="Kawasaki's 250 two-stroke motocross bike. Premix, a top end that wears and no lights.",
  focus=[["Two-stroke", "Premix"], ["Top end", "Check compression"], ["Carb", "Clean and jet"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=TWO, patch={},
  add=[step("X-KX25-01", "G", "G-004", "Check compression and the top end", "Do a compression test. Low or uneven numbers mean the piston and rings are due. Look at the piston through the exhaust port for scoring.", "A tired top end is the most common problem on a used two-stroke motocross bike.", "Two-stroke basics", hours=1.0)],
  lessons={"B": ["It runs on premix. Mix the oil into the fuel at the ratio in the manual. There is no oil tank."]},
  recalls=[], recallNote=OLD, known=[], forums=[]))

B35.append(dict(id="kawasaki-kz200-kz250-1977", make="Kawasaki", model="KZ200 / KZ250", name="Kawasaki KZ200 / KZ250", years=[1977, 1983],
  match=["kz200", "kz250", "kz 200", "kz 250", "kz250 ltd", "kz250 csr"], style="standard", drive="chain",
  engine="198 or 249 cc air-cooled single, one carb",
  intro="Kawasaki's small four-stroke singles. Simple, cheap to fix and often the first bike for a new rider.",
  focus=[["Single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "On many bikes"], ["Valves", "Screw adjusters"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[KZR]))

B35.append(dict(id="kawasaki-gpz750-gpz1100-1982", make="Kawasaki", model="GPz750 / GPz1100", name="Kawasaki GPz750 / GPz1100", years=[1982, 1985],
  match=["gpz750", "gpz1100", "gpz 750", "gpz 1100", "zx750a", "zx1100a", "kz1100 gpz"], style="sport", drive="chain",
  engine="738 or 1089 cc air-cooled inline four, carbs or early fuel injection",
  intro="Kawasaki's early 80s sport fours. Some GPz1100s have an early fuel injection system that takes patience to sort out.",
  focus=[["Inline four", "Air-cooled"], ["Fuel", "Carbs or early EFI"], ["Charging", "Check R/R"], ["Cam chain", "Check tensioner"], ["Chain drive", "Slack and lube"]],
  remove=[], patch={}, add=[], lessons={"G": ["Check which fuel system you have. Early injected GPz1100s need the sensors and wiring checked, not a carb rebuild."]},
  recalls=[], recallNote=OLD, known=[], forums=[KZR]))

B35.append(dict(id="kawasaki-kz900-1976", make="Kawasaki", model="KZ900", name="Kawasaki KZ900 / Z900", years=[1976, 1977],
  match=["kz900", "kz 900", "z900 1976", "z900 1977", "kz900 ltd", "kz900a"], style="standard", drive="chain",
  engine="903 cc air-cooled DOHC inline four, four carbs, points",
  intro="The Z1's direct follow-up. Four carbs, points ignition and a crank that rewards a careful rebuild.",
  focus=[["903 cc four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Points", "Gap and time"], ["Cam chain", "Check tensioner"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[KZR]))

B35.append(dict(id="kawasaki-zr-7-zr550-zephyr-1990", make="Kawasaki", model="ZR-7 / ZR550 Zephyr", name="Kawasaki ZR-7 / Zephyr 550 / 750", years=[1990, 2003],
  match=["zr7", "zr-7", "zr-7s", "zephyr", "zephyr 550", "zr550", "zephyr 750", "zr750"], style="standard", drive="chain",
  engine="553 to 738 cc air-cooled inline four, four carbs",
  intro="Kawasaki's retro air-cooled fours. Four carbs and old-school maintenance.",
  focus=[["Inline four", "Air-cooled"], ["Four carbs", "Rebuild as a set"], ["Valves", "Shim under bucket"], ["Charging", "Check R/R"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[KAWF]))

B35.append(dict(id="kawasaki-ninja-600r-zx-600-1985", make="Kawasaki", model="Ninja 600R / ZX-600", name="Kawasaki Ninja 600R (ZX600)", years=[1985, 1997],
  match=["ninja 600r", "zx600", "zx-600", "ninja 600", "gpz600r", "zx600a", "zx600c"], style="sport", drive="chain",
  engine="592 cc liquid-cooled inline four, four carbs",
  intro="The early Ninja 600. Four carbs, full fairing and a lot of 80s and 90s wiring.",
  focus=[["592 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Charging", "Check R/R"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=OLD, known=[], forums=[ZXF]))

B35.append(dict(id="kawasaki-zx-6-zzr600-1990", make="Kawasaki", model="ZX-6 / ZZR600", name="Kawasaki ZX-6 / ZZR600", years=[1990, 2008],
  match=["zzr600", "zzr 600", "zx-6", "zx6", "zx600d", "zx600e", "ninja zx-6"], style="sport", drive="chain",
  engine="599 cc liquid-cooled inline four, four carbs",
  intro="Kawasaki's 600 sport tourer. Four carbs, ram air on later bikes and a long run in the US.",
  focus=[["599 cc four", "Liquid-cooled"], ["Four carbs", "Rebuild as a set"], ["Charging", "Check R/R"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=CARB, patch={}, add=[], lessons={"G": [CARB4]},
  recalls=[], recallNote=VIN, known=[], forums=[ZXF]))

B35.append(dict(id="kawasaki-ninja-zx-12r-2000", make="Kawasaki", model="Ninja ZX-12R", name="Kawasaki Ninja ZX-12R", years=[2000, 2005],
  match=["zx-12r", "zx12r", "zx12", "ninja zx-12r", "zx1200"], style="sport", drive="chain",
  engine="1199 cc liquid-cooled inline four, fuel injected, monocoque frame",
  intro="Kawasaki's top-speed bike of the early 2000s. Fuel injected, with an aluminum monocoque frame that doubles as the airbox.",
  focus=[["1199 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Charging", "Check R/R"], ["Cooling", "Hoses and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=VIN, known=[], forums=[ZXF]))

B35.append(dict(id="kawasaki-ninja-zx-4rr-2023", make="Kawasaki", model="Ninja ZX-4R / ZX-4RR", name="Kawasaki Ninja ZX-4R / ZX-4RR", years=[2023, 2026],
  match=["zx-4rr", "zx4rr", "zx-4r", "zx4r", "ninja zx-4rr", "ninja zx-4r", "zx400"], style="sport", drive="chain",
  engine="399 cc liquid-cooled inline four, fuel injected",
  intro="A small four that revs past 15,000 rpm. Some early bikes have spark plug and alternator recalls.",
  focus=[["399 cc four", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Spark plugs", "Recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2023-2024 bikes are in recall 24V221 (spark plugs), and some 2023 ZX-4RR KRT Editions in 23V515 (alternator rotor bolt).", reason="Both can stall the engine. The fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="24V221", years="2023-2024 (some)", what="Spark plugs may have been damaged in assembly, causing rough idle, hesitation or stalling.", fix="Dealer replaces the spark plugs free.", src="https://vehiclesafetyrecalls.com/recall/24V221000"),
           dict(id="23V515", years="2023 ZX-4RR KRT Edition", what="Alternator rotor bolt may not be tight, which can cause an engine stall.", fix="Dealer checks the bolt and tightens it free.", src="https://static.nhtsa.gov/odi/rcl/2023/RCRIT-23V515-9817.pdf")],
  known=[], forums=[ZXF]))

B35.append(dict(id="kawasaki-versys-x-300-2017", make="Kawasaki", model="Versys-X 300", name="Kawasaki Versys-X 300", years=[2017, 2026],
  match=["versys-x 300", "versys x 300", "versys x300", "versys 300", "kle300"], style="adventure", drive="chain",
  engine="296 cc liquid-cooled parallel twin, fuel injected",
  intro="Kawasaki's small adventure bike, built on the Ninja 300 engine. Some 2017 bikes had a tail light recall.",
  focus=[["296 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Tail light", "2017 recall"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2017 Versys-X 300s are in recall 17V465 for a loose tail/brake light socket.", reason="Without a brake light you are hard to see. The fix is free.")},
  add=[], lessons={},
  recalls=[dict(id="17V465", years="2017 (some)", what="Tail/brake light socket can come loose and let the bulb fall out.", fix="Dealer replaces the socket free.", src="https://vehiclesafetyrecalls.com/recall/17V465000")],
  known=[], forums=[KAWF]))

HERO_NAME_B35 = {"kawasaki-kx250-two-stroke-1974": "KX250", "kawasaki-kz200-kz250-1977": "KZ250", "kawasaki-gpz750-gpz1100-1982": "GPZ",
  "kawasaki-kz900-1976": "KZ900", "kawasaki-zr-7-zr550-zephyr-1990": "ZR-7", "kawasaki-ninja-600r-zx-600-1985": "NINJA 600R",
  "kawasaki-zx-6-zzr600-1990": "ZZR600", "kawasaki-ninja-zx-12r-2000": "ZX-12R", "kawasaki-ninja-zx-4rr-2023": "ZX-4RR", "kawasaki-versys-x-300-2017": "VERSYS-X"}
