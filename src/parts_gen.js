/* ============ General parts list: the main parts every bike of a type has ============
   For bikes with no factory parts catalogue (and as a quick option on bikes that have one). Main components only, no bolts,
   washers or small hardware. Nothing here has an OEM number; owners add their own. Filtered by bike type, final drive,
   fuel system and cooling when those are known. */
const PV_STYLES = { standard: "Standard", cafe: "Cafe racer", cruiser: "Cruiser", sport: "Sport bike", touring: "Touring", adventure: "Adventure", dualsport: "Dual sport", scooter: "Scooter" };
const PV_STYLE_NOUN = { standard: "standard bike", cafe: "cafe racer", cruiser: "cruiser", sport: "sport bike", touring: "touring bike", adventure: "adventure bike", dualsport: "dual sport", scooter: "scooter" };
const PV_GEN_SYS = ["Engine", "Cooling", "Fuel & air", "Exhaust", "Electrical", "Lights", "Brakes", "Wheels & tires", "Suspension & frame", "Final drive", "Controls", "Body & seat"];
// [id, name, system, art, typical count, what it covers, rules]
// rules: { only: [styles], not: [styles], drive: [..], fuel: "carb"|"efi", cool: "liquid"|"air", n: { style: count } }
const PV_GEN_LIST = [
  ["engine", "Engine", "Engine", "engine", 1, "Crankcase, cylinders, head and covers as one unit"],
  ["clutch", "Clutch", "Engine", "clutch", 1, "Basket, plates and springs", { not: ["scooter"] }],
  ["cvtclutch", "CVT clutch and variator", "Engine", "cvt", 1, "Variator, rollers, clutch and belt", { only: ["scooter"] }],
  ["oilfilter", "Oil filter", "Engine", "oilfilter", 1, "Cartridge or spin-on filter"],
  ["plugs", "Spark plugs", "Engine", "plug", 1, "One per cylinder, two on some heads"],
  ["coils", "Ignition coils", "Engine", "coil", 1, "Coils and plug leads or stick coils"],
  ["starter", "Starter motor", "Engine", "starter", 1, "Electric starter and its drive"],
  ["radiator", "Radiator", "Cooling", "radiator", 1, "Core, cap and overflow tank", { cool: "liquid" }],
  ["fan", "Cooling fan", "Cooling", "fan", 1, "Radiator fan and its switch", { cool: "liquid" }],
  ["coolhoses", "Coolant hoses", "Cooling", "hose", 1, "Radiator and water pump hoses", { cool: "liquid" }],
  ["tank", "Fuel tank", "Fuel & air", "tank", 1, "Tank with its mounts"],
  ["cap", "Fuel cap", "Fuel & air", "cap", 1, "Locking filler cap and key"],
  ["petcock", "Petcock or fuel pump", "Fuel & air", "petcock", 1, "Fuel tap, or the pump on fuel-injected bikes"],
  ["carbs", "Carburetors", "Fuel & air", "carb", 1, "The full carb set", { fuel: "carb" }],
  ["tbodies", "Throttle bodies and injectors", "Fuel & air", "carb", 1, "Throttle bodies, injectors and sensors", { fuel: "efi" }],
  ["fuelsys", "Carburetors or throttle bodies", "Fuel & air", "carb", 1, "Whichever your bike uses", { fuel: "" }],
  ["airfilter", "Air filter and airbox", "Fuel & air", "airfilter", 1, "Filter element and its housing"],
  ["boots", "Intake boots", "Fuel & air", "boot", 1, "Rubber boots between the carbs or throttle bodies and the head"],
  ["fuellines", "Fuel lines", "Fuel & air", "hose", 1, "Hoses from the tank to the carbs or rail"],
  ["headers", "Exhaust headers", "Exhaust", "header", 1, "Head pipes from the engine"],
  ["muffler", "Muffler", "Exhaust", "muffler", 1, "Silencer or silencers", { n: { cruiser: 2, touring: 2 } }],
  ["battery", "Battery", "Electrical", "battery", 1, "Battery and its strap or box"],
  ["harness", "Wiring harness", "Electrical", "harness", 1, "Main loom and its connectors"],
  ["regrec", "Regulator rectifier", "Electrical", "regulator", 1, "Charging voltage regulator"],
  ["stator", "Stator or alternator", "Electrical", "stator", 1, "Charging coils and rotor"],
  ["ignition", "Ignition switch and keys", "Electrical", "key", 1, "Key switch, lock and keys"],
  ["switches", "Handlebar switches", "Electrical", "switch", 2, "Left and right switch housings"],
  ["gauges", "Gauges", "Electrical", "gauge", 1, "Speedo, tach and warning lights"],
  ["horn", "Horn", "Electrical", "horn", 1, ""],
  ["fuses", "Fuse box and relays", "Electrical", "fuse", 1, "Fuses, starter relay and other relays"],
  ["headlight", "Headlight", "Lights", "headlight", 1, "Lamp, bucket or housing, and bulb", { n: { touring: 1, sport: 2 } }],
  ["taillight", "Taillight and brake light", "Lights", "taillight", 1, ""],
  ["signals", "Turn signals", "Lights", "blinker", 4, "Front and rear indicators"],
  ["discf", "Front brake disc", "Brakes", "disc", 1, "Rotor or rotors", { n: { sport: 2, touring: 2, standard: 1, cafe: 1, adventure: 2, cruiser: 1, dualsport: 1, scooter: 1 } }],
  ["calf", "Front brake caliper", "Brakes", "caliper", 1, "Caliper with pads", { n: { sport: 2, touring: 2, adventure: 2 } }],
  ["mcylf", "Front master cylinder", "Brakes", "mcyl", 1, "Master cylinder, reservoir and lever"],
  ["brakelines", "Brake lines", "Brakes", "hose", 1, "Hoses or braided lines, front and rear"],
  ["rearbrake", "Rear brake", "Brakes", "disc", 1, "Disc and caliper, or drum and shoes"],
  ["mcylr", "Rear master cylinder", "Brakes", "mcyl", 1, "If the rear brake is hydraulic"],
  ["wheelf", "Front wheel", "Wheels & tires", "wheel", 1, "Rim, spokes or cast wheel, and hub"],
  ["wheelr", "Rear wheel", "Wheels & tires", "wheel", 1, "Rim, spokes or cast wheel, and hub"],
  ["tiref", "Front tire", "Wheels & tires", "tire", 1, ""],
  ["tirer", "Rear tire", "Wheels & tires", "tire", 1, ""],
  ["wbearings", "Wheel bearings", "Wheels & tires", "bearing", 1, "Front and rear bearings and seals"],
  ["frame", "Frame", "Suspension & frame", "frame", 1, "Main frame and subframe"],
  ["fork", "Front forks", "Suspension & frame", "fork", 1, "Fork legs and triple clamps"],
  ["shock", "Rear shock", "Suspension & frame", "shock", 1, "Shock or shocks and linkage", { n: { cruiser: 2, standard: 2, cafe: 2, touring: 1 } }],
  ["swingarm", "Swingarm", "Suspension & frame", "swingarm", 1, "Swingarm and pivot bearings"],
  ["steerbrg", "Steering head bearings", "Suspension & frame", "bearing", 1, "Top and bottom bearings"],
  ["chain", "Drive chain", "Final drive", "chain", 1, "", { drive: ["chain"] }],
  ["sprockets", "Sprockets", "Final drive", "sprocket", 2, "Front and rear", { drive: ["chain"] }],
  ["shaft", "Drive shaft and final drive", "Final drive", "shaft", 1, "Shaft, U-joint and rear drive unit", { drive: ["shaft"] }],
  ["belt", "Drive belt and pulleys", "Final drive", "belt", 1, "Belt and front and rear pulleys", { drive: ["belt"] }],
  ["cvtbelt", "CVT drive belt", "Final drive", "belt", 1, "", { drive: ["cvt"] }],
  ["bars", "Handlebars", "Controls", "bar", 1, "Bars, clip-ons or risers", { n: { sport: 2, cafe: 2 } }],
  ["levers", "Brake and clutch levers", "Controls", "lever", 2, "With their perches"],
  ["throttle", "Throttle and grips", "Controls", "grip", 1, "Throttle tube, housing and grips"],
  ["cables", "Control cables", "Controls", "cable", 1, "Throttle, clutch and choke cables"],
  ["shifter", "Shift lever", "Controls", "shifter", 1, "", { not: ["scooter"] }],
  ["brakepedal", "Brake pedal", "Controls", "pedal", 1, "", { not: ["scooter"] }],
  ["pegs", "Footpegs", "Controls", "peg", 4, "Rider and passenger pegs or floorboards", { not: ["scooter"] }],
  ["mirrors", "Mirrors", "Controls", "mirror", 2, ""],
  ["sidestand", "Side stand", "Suspension & frame", "stand", 1, "Kickstand and spring"],
  ["centerstand", "Center stand", "Suspension & frame", "stand", 1, "", { only: ["touring", "standard", "scooter", "adventure"] }],
  ["seat", "Seat", "Body & seat", "seat", 1, "Seat or seats and the latch"],
  ["fenderf", "Front fender", "Body & seat", "fender", 1, ""],
  ["fenderr", "Rear fender", "Body & seat", "fender", 1, "Rear fender or hugger"],
  ["sidecovers", "Side covers", "Body & seat", "panel", 2, "", { not: ["scooter"] }],
  ["panels", "Body panels", "Body & seat", "panel", 1, "Front shield, floor and side panels", { only: ["scooter"] }],
  ["fairing", "Fairing", "Body & seat", "fairing", 1, "Upper and side fairing panels", { only: ["sport", "touring", "adventure"] }],
  ["screen", "Windscreen", "Body & seat", "windscreen", 1, "", { only: ["sport", "touring", "adventure"] }],
  ["bags", "Saddlebags", "Body & seat", "bag", 2, "Side cases and mounts", { only: ["touring"] }],
  ["topcase", "Top case", "Body & seat", "bag", 1, "", { only: ["touring"] }],
  ["skid", "Skid plate", "Body & seat", "skid", 1, "Engine guard under the bike", { only: ["adventure", "dualsport"] }],
  ["crashbars", "Crash bars", "Body & seat", "crashbar", 1, "Engine or tank guards", { only: ["adventure", "touring"] }],
  ["handguards", "Hand guards", "Controls", "handguard", 2, "", { only: ["adventure", "dualsport"] }],
];
function pvGenProfile() {
  const m = meta() || {}, dk = (S.meta.invdeck || {}).style;
  const style = dk || BIKE.style || m.style || "standard";
  const drive = typeof bikeDrive === "function" ? bikeDrive() : (BIKE.drive || m.drive || "chain");
  const eng = String(BIKE.engine || m.engine || "");
  const fuel = BIKE.fuel || m.fuel || (/inject|efi|throttle bod/i.test(eng) ? "efi" : /carb/i.test(eng) ? "carb" : (+BIKE.year || +m.year) && (+BIKE.year || +m.year) < 1985 ? "carb" : "");
  const cool = BIKE.cooling || m.cooling || (/liquid|water/i.test(eng) ? "liquid" : /air[- ]cooled|oil[- ]cooled/i.test(eng) ? "air" : style === "cafe" ? "air" : "");
  return { style: PV_STYLES[style] ? style : "standard", drive, fuel, cool, styleSet: !!dk || !!BIKE.style || !!m.style };
}
let PV_GEN_CACHE = null;
function pvGen() {
  const pr = pvGenProfile(), sig = JSON.stringify(pr);
  if (PV_GEN_CACHE && PV_GEN_CACHE.sig === sig) return PV_GEN_CACHE;
  const out = [];
  PV_GEN_LIST.forEach(([id, name, sys, art, cnt, what, r]) => {
    r = r || {};
    if (r.only && !r.only.includes(pr.style)) return; if (r.not && r.not.includes(pr.style)) return;
    if (r.drive && !r.drive.includes(pr.drive)) return;
    if ("fuel" in r && (r.fuel ? pr.fuel !== r.fuel : !!pr.fuel)) return;
    if (r.cool && pr.cool && pr.cool !== r.cool) return; // unknown cooling: keep it, you can mark it "not on my bike"
    if (id === "mcylr" && pr.style === "scooter") return;
    out.push({ key: "gen|" + id, gid: id, gen: true, did: "gen-" + sys, pid: id, ref: "", name, pn: "", cat: "", count: (r.n && r.n[pr.style]) || cnt, what, art, sys, area: sys, cool: !!r.cool && !pr.cool });
  });
  out.sort((a, b) => PV_GEN_SYS.indexOf(a.sys) - PV_GEN_SYS.indexOf(b.sys));
  out.byKey = {}; out.forEach(x => out.byKey[x.key] = x); out.byPn = {}; out.sig = sig; out.profile = pr;
  PV_GEN_CACHE = out; return out;
}
