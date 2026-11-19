"""Batch 97 bike tunes (top 1000, rows 961-970)."""
from batch2 import step, CARB, EFI, AIR, OLD, VIN
from batch47 import mk
from batch10 import NOC
from batch44 import CLASSIC
from batch85 import BSAOC
from batch38 import SCOOT
from batch55 import TT, PREMIX
from batch81 import EURO
B97 = []
TWO = CARB + AIR + ["H-003"]
GENNOTE = "Run your VIN at nhtsa.gov/recalls before you start. Recalls on these models change over time."
MAG = "It runs a magneto. Check the points, the condenser and the slip ring before you blame the carb."
POINTS = "It runs points ignition. Clean, gap and time the points before you chase a carb problem."
PREUNIT = "The gearbox is separate from the engine and has its own oil. Check and change both, and set the primary chain."

B97.append(mk("norton-jubilee-navigator-1958", "Norton", "Jubilee / Navigator", "Norton Jubilee / Navigator", [1958, 1965],
  ["jubilee", "navigator", "electra", "norton jubilee", "norton navigator", "es400"], "standard", "chain",
  "249 to 384 cc air-cooled OHV parallel twin, points",
  "Norton's lightweight twins. Unit-ish construction with a separate gearbox and a reputation for needing care.",
  [["OHV twin", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Bottom end", "Check it"], ["Parts", "Source early"]],
  CARB, OLD, [NOC], lessons={"B": [POINTS]}))

B97.append(mk("bsa-c15-b40-1959", "BSA", "C15 / B40", "BSA C15 / B40", [1959, 1967],
  ["c15", "b40", "c15t", "c15s", "b40 ss", "c15 star", "bsa c15", "bsa b40"], "standard", "chain",
  "247 or 343 cc air-cooled OHV unit single, points",
  "BSA's unit singles of the 60s. Light and simple, with points ignition and a reputation for needing fresh oil often.",
  [["OHV single", "Air-cooled"], ["Carb", "Clean it out"], ["Points", "Gap and time"], ["Oil", "Change often"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [BSAOC], lessons={"B": [POINTS]}))

B97.append(mk("bsa-m20-m21-1937", "BSA", "M20 / M21", "BSA M20 / M21", [1937, 1963],
  ["m20", "m21", "bsa m20", "bsa m21", "m33", "wd m20"], "standard", "chain",
  "496 or 591 cc air-cooled side-valve single, magneto",
  "BSA's side-valve workhorses, including the wartime M20. Slow, tough and well understood by the clubs.",
  [["Side-valve single", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Chain drive", "Slack and lube"]],
  CARB, OLD, [BSAOC], lessons={"B": [MAG], "K": [PREUNIT]}))

B97.append(mk("velocette-le-noddy-1948", "Velocette", "LE (Noddy)", "Velocette LE", [1948, 1970],
  ["le", "velocette le", "noddy", "noddy bike", "valiant", "vogue"], "standard", "shaft",
  "149 or 192 cc water-cooled side-valve flat twin, shaft drive",
  "Velocette's quiet little water-cooled twin, used by British police. Shaft drive, leg shields and hand starting on early ones.",
  [["Flat twin", "Water-cooled"], ["Carb", "Clean it out"], ["Cooling", "Check radiator"], ["Ignition", "Check it"], ["Shaft", "Change oil"]],
  CARB, OLD, [CLASSIC]))

B97.append(mk("ariel-red-hunter-nh-1932", "Ariel", "Red Hunter / NH", "Ariel Red Hunter", [1932, 1959],
  ["red hunter", "nh", "vh", "ariel red hunter", "nh350", "vh500", "vb", "kh"], "standard", "chain",
  "347 or 497 cc air-cooled OHV single or twin, magneto",
  "Ariel's sporting singles and twins. Magneto ignition, a separate gearbox and a big club following.",
  [["OHV engine", "Air-cooled"], ["Carb", "Clean it out"], ["Magneto", "Check spark"], ["Gearbox", "Separate oil"], ["Parts", "Source early"]],
  CARB, OLD, [CLASSIC], lessons={"B": [MAG], "K": [PREUNIT]}))

B97.append(mk("ajs-stormer-1968", "AJS", "Stormer", "AJS Stormer", [1968, 1974],
  ["stormer", "ajs stormer", "y4", "y5", "stormer 250", "stormer 410"], "dualsport", "chain",
  "247 to 410 cc air-cooled two-stroke single, premix",
  "The late AJS two-stroke scramblers. Premix, a flywheel magneto and a revived parts supply from specialists.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check flywheel"], ["Parts", "Source early"]],
  TWO, OLD, [CLASSIC], lessons={"B": [PREMIX]}))

B97.append(mk("francis-barnett-francis-barnett-james-two-strokes-1946", "Francis-Barnett", "Francis-Barnett / James two-strokes", "Francis-Barnett / James two-strokes", [1946, 1966],
  ["francis-barnett", "francis barnett", "falcon", "plover", "cruiser", "james", "james captain", "villiers"], "standard", "chain",
  "98 to 249 cc air-cooled Villiers or AMC two-stroke, premix",
  "British lightweights with Villiers or AMC engines. Premix, a flywheel magneto and cheap, simple parts.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Flywheel mag", "Check spark"], ["Crank seals", "Check them"], ["Parts", "Source early"]],
  TWO, OLD, [CLASSIC], lessons={"B": [PREMIX]}))

B97.append(mk("bultaco-metralla-mercurio-1962", "Bultaco", "Metralla / Mercurio", "Bultaco Metralla / Mercurio", [1962, 1975],
  ["metralla", "mercurio", "bultaco metralla", "metralla gt", "mercurio 175", "metralla mk2"], "standard", "chain",
  "155 to 244 cc air-cooled two-stroke single, premix",
  "Bultaco's road bikes. Premix two-strokes known for revving hard and handling well.",
  [["Two-stroke", "Premix"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Ignition", "Check flywheel"], ["Parts", "Source early"]],
  TWO, OLD, [EURO], lessons={"B": [PREMIX]}))

B97.append(mk("derbi-gpr-50-senda-2000", "Derbi", "GPR 50 / Senda", "Derbi GPR 50 / Senda", [2000, 2010],
  ["gpr 50", "senda", "gpr50", "senda 50", "senda drd", "gpr 125", "senda sm", "derbi senda"], "sport", "chain",
  "49 cc liquid-cooled two-stroke single, oil injection, six-speed",
  "Derbi's 50 cc sport and supermoto bikes. Liquid-cooled two-strokes with oil injection and six speeds.",
  [["Two-stroke", "Oil injection"], ["Carb", "Clean it out"], ["Top end", "Check piston"], ["Cooling", "Coolant and hoses"], ["Chain drive", "Slack and lube"]],
  TWO, GENNOTE, [EURO], lessons={"B": ["It has oil injection. Keep the oil tank filled with two-stroke oil and check the pump line for cracks."]}))

B97.append(mk("gilera-runner-fuoco-500-2007", "Gilera", "Runner / Fuoco 500", "Gilera Runner / Fuoco 500", [2007, 2012],
  ["runner", "fuoco", "fuoco 500", "runner 50", "runner 200", "runner vxr", "gilera runner"], "scooter", "belt",
  "49 to 493 cc single, CVT; the Fuoco has two leaning front wheels",
  "Gilera's sporty scooters. The Runner is a small sport scooter; the Fuoco is the three-wheel MP3 relative.",
  [["Single", "Check type"], ["Fuel", "Check system"], ["CVT belt", "Inspect"], ["Front end", "Check linkage"], ["Bodywork", "Many panels"]],
  [], GENNOTE, [SCOOT]))

HERO_NAME_B97 = {"norton-jubilee-navigator-1958": "NAVIGATOR", "bsa-c15-b40-1959": "C15", "bsa-m20-m21-1937": "M20", "velocette-le-noddy-1948": "LE",
  "ariel-red-hunter-nh-1932": "RED HUNTER", "ajs-stormer-1968": "STORMER", "francis-barnett-francis-barnett-james-two-strokes-1946": "FRANCIS-BARNETT",
  "bultaco-metralla-mercurio-1962": "METRALLA", "derbi-gpr-50-senda-2000": "SENDA", "gilera-runner-fuoco-500-2007": "FUOCO"}
