"""Batch 41 bike tunes (top 500, rows 401-410)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch27 import HDNOTE, HDF, XLF
from batch38 import SCOOT
B41 = []

B41.append(dict(id="suzuki-an125-uh200-burgman-2006", make="Suzuki", model="Burgman 125 / 200", name="Suzuki Burgman 125 / 200", years=[2006, 2026],
  match=["burgman 200", "uh200", "burgman 125", "an125", "uh125", "burgman street"], style="scooter", drive="belt",
  engine="124 or 199 cc liquid-cooled single, fuel injected, CVT",
  intro="The small Burgmans. 2018-2020 Burgman 200s had a CVT drive plate recall and a fuel hose recall.",
  focus=[["Single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["CVT", "Drive plate recall"], ["Fuel hose", "2019-20 recall"], ["Cooling", "Coolant and hoses"]],
  remove=EFI,
  patch={"A-002": dict(title="Check for open recalls", instructions="Run your VIN at nhtsa.gov/recalls. Some 2018-2019 Burgman 200s are in recall 19V377 (CVT drive plate), and some 2019-2020 bikes in 21V558 (fuel hose).", reason="A leaking fuel hose is a fire risk. Both fixes are free.")},
  add=[], lessons={},
  recalls=[dict(id="19V377", years="2018-2019 Burgman 200 (some)", what="Rivets in the CVT driven face can fail and the drive plate can break.", fix="Free dealer repair.", src="https://vehiclesafetyrecalls.com/recall/19V377000"),
           dict(id="21V558", years="2019-2020 Burgman 200 (some)", what="Fuel hose assembly may leak fuel.", fix="Dealer replaces the fuel hose assembly free.", src="https://vehiclesafetyrecalls.com/recall/21V558000")],
  known=[], forums=[SCOOT]))

B41.append(dict(id="harley-davidson-sportster-883-solid-mount-evo-1986", make="Harley-Davidson", model="Sportster 883 (solid mount Evo)", name="Harley-Davidson Sportster 883 (1986-2003)", years=[1986, 2003],
  match=["xlh883", "xlh 883", "sportster 883", "883 hugger", "xlh883 hugger", "xl883 evo", "883 sportster"], style="cruiser", drive="belt",
  engine="883 cc air-cooled Evolution V-twin, one carb, rigid-mounted engine",
  intro="The solid-mount Evo Sportster. One carb, lots of vibration and a simple bike to learn on.",
  focus=[["883 cc Evo", "Air-cooled"], ["Carb", "CV or Bendix"], ["Rigid mount", "Check fasteners"], ["Primary", "Chain and oil"], ["Belt drive", "Check wear"]],
  remove=CARB + AIR, patch={}, add=[], lessons={"B": ["A rigid-mounted engine shakes things loose. Check every fastener, mount and light bracket."]},
  recalls=[], recallNote=HDNOTE, known=[], forums=[XLF]))

B41.append(dict(id="harley-davidson-softail-slim-fls-2012", make="Harley-Davidson", model="Softail Slim (FLS)", name="Harley-Davidson Softail Slim (FLS)", years=[2012, 2017],
  match=["softail slim", "fls", "flss", "slim s", "softail slim s"], style="cruiser", drive="belt",
  engine="1690 or 1801 cc air-cooled Twin Cam 103/110B V-twin, fuel injected",
  intro="The stripped-down Twin Cam Softail. Hidden rear shocks, belt drive and fuel injection.",
  focus=[["Twin Cam B", "Air-cooled"], ["Fuel injected", "No carbs"], ["Cam tensioners", "Check pads"], ["Primary", "Chain and oil"], ["Belt drive", "Check wear"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=HDNOTE, known=[], forums=[HDF]))

B41.append(dict(id="harley-davidson-tri-glide-freewheeler-2009", make="Harley-Davidson", model="Tri Glide / Freewheeler", name="Harley-Davidson Tri Glide / Freewheeler", years=[2009, 2026],
  match=["tri glide", "triglide", "flhtcutg", "freewheeler", "flrt", "tri glide ultra"], style="touring", drive="belt",
  engine="Twin Cam or Milwaukee-Eight V-twin, fuel injected, belt drive, two rear wheels",
  intro="Harley's factory trikes. Two rear wheels, a reverse gear and the touring bike underneath.",
  focus=[["V-twin", "Twin Cam or M8"], ["Fuel injected", "No carbs"], ["Rear axle", "Trike parts"], ["Reverse", "Check it"], ["Belt drive", "Check wear"]],
  remove=EFI, patch={}, add=[], lessons={"K": ["The trike has its own rear brake setup and parking brake. Use the trike service manual, not the two-wheeler one."]},
  recalls=[], recallNote=HDNOTE, known=[], forums=[HDF]))

B41.append(dict(id="harley-davidson-electra-glide-m8-2017", make="Harley-Davidson", model="Electra Glide / Ultra Limited (M8)", name="Harley-Davidson Electra Glide (Milwaukee-Eight)", years=[2017, 2026],
  match=["electra glide", "ultra limited", "flhtk", "flhtcu", "electra glide ultra", "ultra classic", "flht"], style="touring", drive="belt",
  engine="1746 to 1923 cc Milwaukee-Eight V-twin, fuel injected, belt drive",
  intro="The Milwaukee-Eight Electra Glides. Fork fairing, lots of electronics and belt drive.",
  focus=[["Milwaukee-Eight", "Oil/liquid cooled heads"], ["Fuel injected", "No carbs"], ["Infotainment", "Lots of wiring"], ["Primary", "Chain and oil"], ["Belt drive", "Check wear"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=HDNOTE, known=[], forums=[HDF]))

B41.append(dict(id="harley-davidson-shovelhead-fxr-fxb-sturgis-1980", make="Harley-Davidson", model="FXB Sturgis / FXEF (Shovelhead)", name="Harley-Davidson FXB Sturgis (Shovelhead)", years=[1980, 1984],
  match=["fxb", "sturgis", "fxb sturgis", "fxdg", "disc glide"], style="cruiser", drive="belt",
  engine="1340 cc air-cooled Shovelhead V-twin, one carb, belt primary and final drive",
  intro="The belt-drive Shovelhead Sturgis. One carb, points or early electronic ignition, and a lot of character.",
  focus=[["Shovelhead", "Air-cooled"], ["Carb", "Clean it out"], ["Belt primary", "Check wear"], ["Charging", "Check R/R"], ["Oil leaks", "Normal-ish"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[HDF]))

B41.append(dict(id="harley-davidson-sprint-aermacchi-1961", make="Harley-Davidson", model="Sprint (Aermacchi)", name="Harley-Davidson Sprint (Aermacchi)", years=[1961, 1974],
  match=["sprint", "aermacchi", "sprint 250", "sprint 350", "ss350", "sx350", "h sprint"], style="standard", drive="chain",
  engine="246 or 344 cc air-cooled horizontal single, one carb, points",
  intro="The Italian-built Harley single. Horizontal cylinder, points ignition and parts that take some hunting.",
  focus=[["Single", "Horizontal"], ["Carb", "Dell'Orto"], ["Points", "Gap and time"], ["Parts", "Hunt for them"], ["Chain drive", "Slack and lube"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=OLD, known=[], forums=[HDF]))

B41.append(dict(id="harley-davidson-evolution-electra-glide-tour-glide-1984", make="Harley-Davidson", model="Evo Electra Glide / Tour Glide", name="Harley-Davidson Electra Glide / Tour Glide (Evo)", years=[1985, 1998],
  match=["tour glide", "fltc", "fltcu", "evo electra glide", "flhtc evo", "flhtcu evo", "electra glide classic"], style="touring", drive="belt",
  engine="1340 cc air-cooled Evolution V-twin, carb (EFI on some late bikes), belt drive",
  intro="The Evo-era baggers. One carb on most, belt drive and a lot of old wiring behind the fairing.",
  focus=[["Evo V-twin", "Air-cooled"], ["Carb", "Clean it out"], ["Fairing", "Lots of wiring"], ["Primary", "Chain and oil"], ["Belt drive", "Check wear"]],
  remove=CARB + AIR, patch={}, add=[], lessons={},
  recalls=[], recallNote=HDNOTE, known=[], forums=[HDF]))

B41.append(dict(id="harley-davidson-low-rider-st-2022", make="Harley-Davidson", model="Low Rider ST", name="Harley-Davidson Low Rider ST", years=[2022, 2026],
  match=["low rider st", "fxlrst", "lowrider st", "low rider st 117"], style="touring", drive="belt",
  engine="1923 cc Milwaukee-Eight 117 V-twin, fuel injected, belt drive",
  intro="The frame-mounted fairing Softail. Big 117 engine, bags and belt drive.",
  focus=[["M8 117", "Fuel injected"], ["Fairing", "Frame mounted"], ["Primary", "Chain and oil"], ["Belt drive", "Check wear"], ["Cooling", "Oil cooler"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=HDNOTE, known=[], forums=[HDF]))

B41.append(dict(id="harley-davidson-xr1200-sportster-2008", make="Harley-Davidson", model="XR1200", name="Harley-Davidson XR1200", years=[2008, 2013],
  match=["xr1200", "xr 1200", "xr1200x", "xr1200 sportster"], style="standard", drive="belt",
  engine="1202 cc air/oil-cooled Evolution V-twin, fuel injected",
  intro="The flat-track styled Sportster. Fuel injected, with an oil cooler and better brakes than most Sportsters.",
  focus=[["1202 cc Evo", "Air/oil cooled"], ["Fuel injected", "No carbs"], ["Oil cooler", "Check lines"], ["Primary", "Chain and oil"], ["Belt drive", "Check wear"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=HDNOTE, known=[], forums=[XLF]))

HERO_NAME_B41 = {"suzuki-an125-uh200-burgman-2006": "BURGMAN 200", "harley-davidson-sportster-883-solid-mount-evo-1986": "883", "harley-davidson-softail-slim-fls-2012": "SLIM",
  "harley-davidson-tri-glide-freewheeler-2009": "TRI GLIDE", "harley-davidson-electra-glide-m8-2017": "ELECTRA", "harley-davidson-shovelhead-fxr-fxb-sturgis-1980": "STURGIS",
  "harley-davidson-sprint-aermacchi-1961": "SPRINT", "harley-davidson-evolution-electra-glide-tour-glide-1984": "TOUR GLIDE", "harley-davidson-low-rider-st-2022": "LOW RIDER ST", "harley-davidson-xr1200-sportster-2008": "XR1200"}
