"""Batch 46 bike tunes (top 500, rows 451-460)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch29 import KTMF, ADVR
from batch45 import KTMNOTE
from batch39 import DIRT4
B46 = []
TWO = CARB + AIR + ["H-003"]
APRF = dict(name="ApriliaForum", url="https://www.apriliaforum.com/", what="Owner forum for Aprilia motorcycles.")
APRNOTE = "Aprilia has issued recalls on some bikes in these years. Run your VIN at nhtsa.gov/recalls before you start."

def ktm(id, model, name, years, match, style, engine, intro, focus, remove=EFI, lessons=None, add=None, forums=None):
    return dict(id=id, make="KTM", model=model, name=name, years=years, match=match, style=style, drive="chain", engine=engine, intro=intro, focus=focus,
                remove=remove, patch={}, add=add or [], lessons=lessons or {}, recalls=[], recallNote=KTMNOTE, known=[], forums=forums or [KTMF])

B46.append(ktm("ktm-690-duke-690-smc-r-2008", "690 Duke / 690 SMC R", "KTM 690 Duke / 690 SMC R", [2008, 2024],
  ["690 duke", "duke 690", "690 smc", "690 smc r", "690 duke r", "smc r 690"], "standard",
  "690 cc liquid-cooled LC4 single, fuel injected",
  "KTM's big single street bikes. Strong engine, light chassis, and valve checks that matter.",
  [["690 cc single", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Check interval"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]]))

B46.append(ktm("ktm-1190-1290-super-adventure-2013", "1190 Adventure / 1290 Super Adventure", "KTM 1190 Adventure / 1290 Super Adventure", [2013, 2026],
  ["1190 adventure", "1290 super adventure", "1290 adventure", "super adventure", "1190 adventure r", "1290 super adventure s", "1290 super adventure r"], "adventure",
  "1195 or 1301 cc liquid-cooled LC8 V-twin, fuel injected",
  "KTM's big V-twin adventure bikes. Lots of electronics, lots of power and a heavy service at the valve interval.",
  [["LC8 V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Ride modes"], ["Cooling", "Coolant and fans"], ["Chain drive", "Slack and lube"]], forums=[ADVR]))

B46.append(ktm("ktm-500-exc-f-350-exc-f-2012", "500 / 350 EXC-F", "KTM 500 EXC-F / 350 EXC-F", [2012, 2026],
  ["500 exc-f", "350 exc-f", "500 exc", "350 exc", "500 excf", "350 excf", "exc-f"], "dualsport",
  "350 or 510 cc liquid-cooled four-stroke single, fuel injected",
  "KTM's plated enduro four-strokes. Light, fast, and on an hour-based service schedule.",
  [["Single", "Four-stroke"], ["Fuel injected", "No carbs"], ["Valves", "Check by hours"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]], lessons={"H": [DIRT4]}))

B46.append(ktm("ktm-300-xc-w-250-exc-two-stroke-1998", "300 XC-W / 250 EXC (two-stroke)", "KTM 250 / 300 two-stroke enduro", [1998, 2026],
  ["300 xc-w", "250 exc", "300 exc", "250 xc-w", "300 xcw", "300 tpi", "250 tpi", "300 xc"], "dualsport",
  "249 or 293 cc liquid-cooled two-stroke single, carb or TPI fuel injection",
  "KTM's two-stroke enduro bikes. Carb on older bikes, TPI fuel injection from 2018.",
  [["Two-stroke", "Liquid-cooled"], ["Fuel", "Carb or TPI"], ["Top end", "Check compression"], ["Power valve", "Clean it"], ["Chain drive", "Slack and lube"]],
  remove=AIR + ["H-003"],
  add=[step("X-KTM2-01", "G", "G-004", "Check compression and the top end", "Do a compression test. Low numbers mean the piston and rings are due. Clean the power valve while you are in there.", "A tired top end and a gummed power valve are the most common problems on a used two-stroke.", "Two-stroke basics", hours=1.5)],
  lessons={"B": ["Carbureted bikes run on premix. TPI bikes have an oil tank and injection. Check which you have before you fill up."]}))

B46.append(ktm("ktm-640-adventure-lc4-640-1998", "640 Adventure / LC4 640", "KTM 640 Adventure / LC4", [1998, 2007],
  ["640 adventure", "lc4 640", "640 lc4", "ktm 640", "620 adventure", "640 duke"], "adventure",
  "625 cc liquid-cooled LC4 single, carb, kick and electric start",
  "The rally-styled KTM single. One big carb, tall seat and twin tanks.",
  [["625 cc single", "Liquid-cooled"], ["Carb", "Clean it out"], ["Valves", "Check often"], ["Twin tanks", "Check petcocks"], ["Chain drive", "Slack and lube"]], remove=CARB, forums=[ADVR]))

B46.append(ktm("ktm-990-super-duke-2005", "990 Super Duke", "KTM 990 Super Duke", [2005, 2013],
  ["990 super duke", "super duke 990", "990 sd", "990 super duke r", "superduke 990"], "standard",
  "999 cc liquid-cooled LC8 V-twin, fuel injected",
  "The first LC8 Super Duke. Fuel injected V-twin in a trellis frame.",
  [["LC8 V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Valves", "Shim type"], ["Cooling", "Coolant and fans"], ["Chain drive", "Slack and lube"]]))

B46.append(ktm("ktm-1290-super-duke-gt-2016", "1290 Super Duke GT", "KTM 1290 Super Duke GT", [2016, 2026],
  ["super duke gt", "1290 super duke gt", "1290 gt", "sd gt", "superduke gt"], "touring",
  "1301 cc liquid-cooled LC8 V-twin, fuel injected",
  "The sport-touring Super Duke. Semi-active suspension on most, lots of electronics.",
  [["LC8 V-twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Semi-active", "Suspension"], ["Electronics", "Ride modes"], ["Chain drive", "Slack and lube"]]))

B46.append(ktm("ktm-50-sx-65-sx-2000", "50 SX / 65 SX", "KTM 50 SX / 65 SX", [2000, 2026],
  ["50 sx", "65 sx", "ktm 50", "ktm 65", "50sx", "65sx", "50 sx mini"], "dualsport",
  "49 or 65 cc liquid-cooled two-stroke single, carb, premix",
  "KTM's kids' motocross bikes. Premix two-strokes that get ridden hard.",
  [["Two-stroke", "Premix"], ["Top end", "Check compression"], ["Carb", "Clean and jet"], ["Air filter", "Foam, oiled"], ["Chain drive", "Slack and lube"]],
  remove=TWO, lessons={"B": ["It runs on premix. Mix the oil into the fuel at the ratio in the manual."]}))

B46.append(dict(id="aprilia-rs-660-tuono-660-2021", make="Aprilia", model="RS 660 / Tuono 660", name="Aprilia RS 660 / Tuono 660", years=[2021, 2026],
  match=["rs 660", "rs660", "tuono 660", "tuono660", "rs 660 extrema"], style="sport", drive="chain",
  engine="659 cc liquid-cooled parallel twin, fuel injected",
  intro="Aprilia's middleweight twins. Light, quick and full of electronics.",
  focus=[["659 cc twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Ride modes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=APRNOTE, known=[], forums=[APRF]))

B46.append(dict(id="aprilia-rsv4-tuono-v4-2009", make="Aprilia", model="RSV4 / Tuono V4", name="Aprilia RSV4 / Tuono V4", years=[2009, 2026],
  match=["rsv4", "tuono v4", "rsv4 rf", "rsv4 factory", "tuono v4 1100", "rsv4 1100", "tuono v4r"], style="sport", drive="chain",
  engine="999 or 1077/1099 cc liquid-cooled 65-degree V4, fuel injected",
  intro="Aprilia's V4 superbike and its naked version. Cam chains, lots of electronics and tight packaging.",
  focus=[["V4", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "APRC"], ["Cooling", "Coolant and fans"], ["Chain drive", "Slack and lube"]],
  remove=EFI, patch={}, add=[], lessons={},
  recalls=[], recallNote=APRNOTE, known=[], forums=[APRF]))

HERO_NAME_B46 = {"ktm-690-duke-690-smc-r-2008": "690 DUKE", "ktm-1190-1290-super-adventure-2013": "1290 ADVENTURE", "ktm-500-exc-f-350-exc-f-2012": "500 EXC-F",
  "ktm-300-xc-w-250-exc-two-stroke-1998": "300 XC-W", "ktm-640-adventure-lc4-640-1998": "640 ADVENTURE", "ktm-990-super-duke-2005": "990 SUPER DUKE",
  "ktm-1290-super-duke-gt-2016": "SUPER DUKE GT", "ktm-50-sx-65-sx-2000": "50 SX", "aprilia-rs-660-tuono-660-2021": "RS 660", "aprilia-rsv4-tuono-v4-2009": "RSV4"}
