"""Batch 78 bike tunes (top 1000, rows 771-780)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch29 import KTMF, ADVR
from batch45 import KTMNOTE
from batch77 import KDIRT2
from batch19 import AMCA
from batch30 import INDF
B78 = []
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
FLAT = "It is a flathead. The valves sit beside the cylinder, so set the tappets with the engine cold and check the valve guides for wear."
TOTALLOSS = "Check whether yours has a total-loss or a recirculating oil system before you fill it, and know which one you are running."

B78.append(mk("ktm-1390-super-duke-r-2024", "KTM", "1390 Super Duke R", "KTM 1390 Super Duke R", [2024, 2026],
  ["1390 super duke", "1390 super duke r", "super duke 1390", "1390 sdr", "1390 super duke r evo"], "standard", "chain",
  "1350 cc liquid-cooled 75-degree V-twin, fuel injected, variable cam timing",
  "KTM's biggest naked bike. A huge V-twin, variable cam timing and a full electronics suite.",
  [["LC8 twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, KTMNOTE, [KTMF]))

B78.append(mk("ktm-890-smt-2023", "KTM", "890 SMT", "KTM 890 SMT", [2023, 2026],
  ["890 smt", "smt 890", "ktm 890 smt"], "touring", "chain",
  "889 cc liquid-cooled parallel twin, fuel injected",
  "KTM's supermoto tourer. The 890 twin with long-travel suspension, a small fairing and road tires.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, KTMNOTE, [KTMF]))

B78.append(mk("ktm-freeride-250-350-2012", "KTM", "Freeride 250 / 350", "KTM Freeride 250 / 350", [2012, 2017],
  ["freeride 250", "freeride 350", "freeride 250 r", "freeride 250 f", "freeride", "ktm freeride"], "dualsport", "chain",
  "249 cc two-stroke or 349 cc four-stroke single, liquid-cooled",
  "KTM's light trail and trials-style bikes. Low seat, light weight, two-stroke or four-stroke depending on the model.",
  [["Single", "Check type"], ["Fuel", "Check system"], ["Valves or top end", "Check"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  [], KDIRT2, [KTMF], lessons={"B": ["The Freeride 250 R is a two-stroke that runs premix. The 250 F and 350 are four-strokes. Check which one you have."]}))

B78.append(mk("ktm-990-duke-2024-2024", "KTM", "990 Duke (2024)", "KTM 990 Duke", [2024, 2026],
  ["990 duke", "duke 990", "ktm 990 duke", "990 duke 2024"], "standard", "chain",
  "947 cc liquid-cooled parallel twin, fuel injected",
  "KTM's 2024 middleweight naked. A bigger version of the 890 twin with updated electronics.",
  [["Twin", "Liquid-cooled"], ["Fuel injected", "No carbs"], ["Electronics", "Scan for codes"], ["Cooling", "Coolant and fan"], ["Chain drive", "Slack and lube"]],
  EFI, KTMNOTE, [KTMF]))

B78.append(mk("ktm-400-520-525-exc-rfs-2000", "KTM", "400 / 520 / 525 EXC (RFS)", "KTM 400 / 520 / 525 EXC (RFS)", [2000, 2007],
  ["525 exc", "520 exc", "400 exc", "525 mxc", "520 sx", "525 sx", "rfs", "525 xc", "400 exc racing"], "dualsport", "chain",
  "398 to 510 cc liquid-cooled four-stroke single, carb, electric start",
  "KTM's first RFS four-strokes. Electric start on most, carbs and a lot of hours on many examples.",
  [["Single", "Liquid-cooled"], ["Carb", "Check jetting"], ["Valves", "Check often"], ["Starter", "Check clutch"], ["Chain drive", "Slack and lube"]],
  CARB, KDIRT2, [KTMF]))

B78.append(mk("indian-scout-1920-1931-101-1920", "Indian", "Scout (1920-1931 / 101)", "Indian Scout (1920-1931, 101)", [1920, 1931],
  ["scout", "indian scout", "101 scout", "scout 101", "scout 45", "scout 37", "indian 101"], "standard", "chain",
  "37 or 45 cubic inch air-cooled side-valve V-twin, gear primary, total-loss oiling",
  "Indian's early Scouts, including the famous 101. A geared primary drive, a flathead V-twin and total-loss oiling.",
  [["Flathead twin", "Air-cooled"], ["Oiling", "Total loss"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gear primary", "Check oil"]],
  CARB, OLD, [AMCA], lessons={"E": [FLAT], "H": [TOTALLOSS]}))

B78.append(mk("indian-four-ace-1927", "Indian", "Four (Ace)", "Indian Four (Ace)", [1927, 1942],
  ["indian four", "ace", "indian ace", "model 401", "model 402", "model 440", "four 1940", "ace four"], "touring", "chain",
  "1265 cc air-cooled inline four, F-head or reversed valves, one carb",
  "Indian's inline four, grown from the Ace. Rare, complex and best restored with club help.",
  [["Inline four", "Air-cooled"], ["Carb", "Clean it out"], ["Valves", "Set them"], ["Oiling", "Check pump"], ["Parts", "Source early"]],
  CARB, OLD, [AMCA]))

B78.append(mk("indian-sport-scout-1934", "Indian", "Sport Scout", "Indian Sport Scout", [1934, 1942],
  ["sport scout", "indian sport scout", "sport scout 45", "scout 1938"], "standard", "chain",
  "45 cubic inch air-cooled side-valve V-twin, girder fork, recirculating oil",
  "Indian's 30s sport twin, loved by racers. A flathead V-twin with a girder fork and a geared primary.",
  [["Flathead twin", "Air-cooled"], ["Carb", "Clean it out"], ["Oil pump", "Check it"], ["Valves", "Set tappets"], ["Girder fork", "Check pivots"]],
  CARB, OLD, [AMCA], lessons={"E": [FLAT]}))

B78.append(mk("indian-chief-1922-1939-1922", "Indian", "Chief (1922-1939)", "Indian Chief (1922-1939)", [1922, 1939],
  ["chief", "indian chief", "chief 74", "chief 1930s", "big chief", "chief 61"], "cruiser", "chain",
  "61 to 74 cubic inch air-cooled side-valve V-twin, total-loss then recirculating oil",
  "The early Chiefs. Flathead V-twins, hand shift and either total-loss or dry-sump oiling depending on year.",
  [["Flathead twin", "Air-cooled"], ["Oiling", "Check type"], ["Carb", "Clean it out"], ["Valves", "Set tappets"], ["Hand shift", "Check linkage"]],
  CARB, OLD, [AMCA], lessons={"E": [FLAT], "H": [TOTALLOSS]}))

B78.append(mk("indian-chief-gilroy-1999", "Indian", "Chief (Gilroy)", "Indian Chief (Gilroy era)", [1999, 2003],
  ["chief", "indian chief", "gilroy chief", "gilroy", "spirit", "gilroy scout", "chief gilroy", "powerplus 100"], "cruiser", "belt",
  "1442 or 1638 cc air-cooled V-twin, S&S-based then Powerplus, carb or fuel injection",
  "The Gilroy-built Indians. S&S-based engines, then the Powerplus 100, in a big valanced-fender cruiser.",
  [["V-twin", "Air-cooled"], ["Fuel", "Carb or EFI"], ["Charging", "Check R/R"], ["Belt", "Check tension"], ["Parts", "Source early"]],
  [], GENNOTE, [INDF]))

HERO_NAME_B78 = {"ktm-1390-super-duke-r-2024": "1390 SDR", "ktm-890-smt-2023": "890 SMT", "ktm-freeride-250-350-2012": "FREERIDE",
  "ktm-990-duke-2024-2024": "990 DUKE", "ktm-400-520-525-exc-rfs-2000": "525 EXC", "indian-scout-1920-1931-101-1920": "SCOUT",
  "indian-four-ace-1927": "INDIAN FOUR", "indian-sport-scout-1934": "SPORT SCOUT", "indian-chief-1922-1939-1922": "CHIEF", "indian-chief-gilroy-1999": "CHIEF"}
