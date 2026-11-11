/* Revora library worker: builds a bike's library entry the first time a paying member adds it.
   Haiku finds the owner's manual and pulls the numbers (with page numbers). Sonnet then opens the same
   source and keeps only the numbers it can confirm. The result goes into bike_library for everyone after.

   Settings (Cloudflare > Worker > Settings > Variables):
     ANTHROPIC_API_KEY  (secret)  Xavier's Anthropic API key
     WORKER_SECRET      (secret)  from Supabase: select secret from public.library_keys;
     MAX_PER_DAY        (text)    optional, default 40 new bikes a day
   Trigger: cron "* * * * *" (every minute) as a backup to the instant build. */
const SUPABASE_URL = "https://fhuksccqsyaomnouxxtb.supabase.co", SUPABASE_KEY = "sb_publishable_0wYtVeKcFJUzy3AfIaFhiw_NrT1wNkz";
const ORIGINS = ["https://revoragarage.com", "https://www.revoragarage.com"];
const MODEL_FIND = "claude-haiku-5-5", MODEL_CHECK = "claude-sonnet-5-5";
const TOOLS = [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }, { type: "web_fetch_20250910", name: "web_fetch", max_uses: 6, max_content_tokens: 60000 }];
const KEYS = { oil: "Engine oil", oilCap: "Oil with filter change", oilCapNo: "Oil without filter", oilFilter: "Oil filter", plug: "Spark plug", plugGap: "Plug gap", valveIn: "Valve clearance, intake", valveEx: "Valve clearance, exhaust",
  coolant: "Coolant", airFilter: "Air filter", idle: "Idle speed", chain: "Chain", slack: "Chain slack", sprockets: "Sprockets", finalOil: "Final drive or gear oil", brakeFluid: "Brake fluid", padsF: "Front pads", padsR: "Rear pads",
  forkOil: "Fork oil", tireF: "Front tire size", tireR: "Rear tire size", psiF: "Front pressure", psiR: "Rear pressure", battery: "Battery", headlight: "Headlight bulb", fuses: "Fuses" };
const GUIDES = { chain: "chain", oil: "oil", brakes: "brakes", coolant: "coolant", tires: "tires", battery: "battery", plugs: "plugs" };

const rpc = async (name, args, token) => {
  const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/" + name, { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + (token || SUPABASE_KEY), "content-type": "application/json" }, body: JSON.stringify(args) });
  const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {}
  if (!r.ok) throw new Error((j && j.message) || t || r.status);
  return j;
};
const cors = req => { const o = req.headers.get("origin") || ""; return { "access-control-allow-origin": ORIGINS.includes(o) ? o : ORIGINS[0], "access-control-allow-headers": "authorization, content-type", "access-control-allow-methods": "POST, OPTIONS", vary: "origin" }; };
const json = (req, o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: Object.assign({ "content-type": "application/json" }, cors(req)) });

async function claude(env, model, system, user, maxTokens = 4000) {
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST",
    headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-beta": "web-fetch-2025-09-10", "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, tools: TOOLS, messages: [{ role: "user", content: user }] }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error("claude " + r.status + " " + ((j.error && j.error.message) || ""));
  const text = (j.content || []).filter(c => c.type === "text").map(c => c.text).join("\n");
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a < 0 || b < a) throw new Error("no json");
  return JSON.parse(text.slice(a, b + 1));
}

const FIND_SYS = `You research motorcycle maintenance specs for Revora, a garage app. Accuracy matters more than completeness: a wrong torque value can hurt someone.
Rules: only use the manufacturer's owner's manual or service manual (official PDF from the maker, or an exact copy of it). Never use forums, spec aggregator sites, blogs or your own memory for numbers.
Every number must have the manual page it appears on. If you can't find a number in a manual, leave it out. Never estimate or round. Copy values as printed, keeping both unit systems if the manual gives both.
Answer with JSON only.`;
const findPrompt = q => `Bike: ${q.year || ""} ${q.make} ${q.model}
1. Find the owner's manual for this bike (the closest model year of the same generation if that exact year isn't online). US edition first, then any English edition.
2. Read its specifications and maintenance sections.
3. Search RevZilla's OEM parts pages (revzilla.com/oem/...) for this bike's exact diagram pages: the swingarm or drive chain section, the oil filter section, and the front brake caliper section. Only include URLs you actually found.
Return JSON exactly in this shape:
{"make":"","model":"","code":"model code if printed","manualYears":[first,last],"generationYears":[first,last],"match":["other names people type for this bike"],
 "style":"standard|cruiser|sport|touring|adventure|dualsport|cafe|scooter","drive":"chain|belt|shaft","cooling":"liquid|air|oil",
 "source":{"name":"exact manual title and edition","url":"PDF url"},
 "specs":[{"k":"one of: ${Object.keys(KEYS).join(", ")}","v":"value as printed","p":"page"}],
 "torque":[{"what":"fastener name","v":"value as printed","p":"page"}],
 "diagrams":{"chain":"url","oil":"url","brakes":"url"},
 "note":"one sentence if the manual is from another market or year, else empty",
 "found":true}
If no manual can be found at all, return {"found":false,"note":"why"}.`;
const CHECK_SYS = `You check motorcycle specs against the source manual before they are shown to owners. Open the source URL and confirm each value appears on the stated page with the same number and unit.
Remove any item you cannot confirm. Fix a page number if the value is right but the page is off. Never add new values. Answer with the same JSON shape only.`;

// keep only what the app understands, short strings, https links
function clean(raw, q) {
  const s = v => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, 120);
  const url = u => { try { const x = new URL(String(u)); return x.protocol === "https:" ? x.href : ""; } catch (e) { return ""; } };
  const yr = (a, d) => Array.isArray(a) && +a[0] > 1900 && +a[1] >= +a[0] && +a[1] < 2100 ? [+a[0], +a[1]] : d;
  const y = +q.year || null, my = yr(raw.manualYears, y ? [y, y] : null), gy = yr(raw.generationYears, my);
  const src = url(raw.source && raw.source.url);
  const specs = (raw.specs || []).filter(x => KEYS[x.k] && s(x.v) && s(x.p)).map(x => ({ k: x.k, v: s(x.v), src: "om", p: s(x.p).slice(0, 20) }));
  const seen = new Set(), uniq = specs.filter(x => !seen.has(x.k) && seen.add(x.k));
  const torque = (raw.torque || []).filter(t => s(t.what) && s(t.v) && s(t.p)).slice(0, 20).map(t => ({ what: s(t.what).slice(0, 60), v: s(t.v), src: "om", p: s(t.p).slice(0, 20) }));
  const dg = {}; Object.entries(raw.diagrams || {}).forEach(([k, u]) => { const h = url(u); if (h && /^https:\/\/www\.revzilla\.com\/oem\//.test(h) && ["chain", "oil", "brakes"].includes(k)) dg[k] = { site: "RevZilla", url: h }; });
  const drive = ["chain", "belt", "shaft"].includes(raw.drive) ? raw.drive : "chain", cooling = ["liquid", "air", "oil"].includes(raw.cooling) ? raw.cooling : "";
  const guides = [drive === "chain" ? "chain" : null, "oil", "brakes", cooling === "liquid" ? "coolant" : null, "tires", "battery", "plugs"].filter(Boolean);
  // never let a different bike in the answer replace the one that was asked for
  const nz = x => String(x || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (nz(raw.make) !== nz(q.make)) raw.make = q.make;
  if (!(nz(raw.model).includes(nz(q.model)) || nz(q.model).includes(nz(raw.model))) || !nz(raw.model)) raw.model = q.model;
  const slug = [raw.make || q.make, raw.model || q.model, (my || [y || ""])[0]].map(x => String(x).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")).filter(Boolean).join("-");
  return { id: slug, make: s(raw.make || q.make), model: s(raw.model || q.model), code: s(raw.code), years: my || [y, y], near: gy || my || [y, y],
    match: [...new Set([q.model, raw.model, ...(raw.match || [])].map(x => s(x).toLowerCase()).filter(Boolean))].slice(0, 12),
    style: s(raw.style), drive, cooling, sources: { om: { name: s(raw.source && raw.source.name) || "Owner's manual", url: src } },
    specs: uniq, torque, diagrams: dg, guides, note: s(raw.note).slice(0, 300), status: uniq.length >= 8 ? "ready" : "partial", builtBy: "library-worker", builtAt: new Date().toISOString() };
}

async function buildOne(env) {
  const q = await rpc("lib_queue_next", { s: env.WORKER_SECRET });
  if (!q) return "empty";
  if (+q.built_today >= (+env.MAX_PER_DAY || 40)) { await rpc("lib_save", { s: env.WORKER_SECRET, qid: q.id, e: { note: "Daily limit reached" }, outcome: "queued" }); return "limit"; }
  try {
    const found = await claude(env, MODEL_FIND, FIND_SYS, findPrompt(q), 6000);
    if (!found || found.found === false || !found.source || !(found.specs || []).length) {
      await rpc("lib_save", { s: env.WORKER_SECRET, qid: q.id, e: { note: (found && found.note) || "No owner's manual found online" }, outcome: "none" }); return "none";
    }
    const checked = await claude(env, MODEL_CHECK, CHECK_SYS, "Source: " + JSON.stringify(found.source) + "\nCheck this JSON:\n" + JSON.stringify(found), 6000);
    const e = clean(Object.assign({}, found, { specs: checked.specs || [], torque: checked.torque || [] }), q);
    if (!e.sources.om.url || !e.specs.length) { await rpc("lib_save", { s: env.WORKER_SECRET, qid: q.id, e: { note: "Couldn't confirm the numbers against the manual" }, outcome: "none" }); return "none"; }
    await rpc("lib_save", { s: env.WORKER_SECRET, qid: q.id, e, outcome: "done" });
    return "done";
  } catch (err) {
    await rpc("lib_save", { s: env.WORKER_SECRET, qid: q.id, e: { note: String(err.message || err).slice(0, 200) }, outcome: "failed" }).catch(() => {});
    return "failed";
  }
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
    const url = new URL(req.url);
    if (url.pathname === "/health") return json(req, { ok: true, key: !!env.ANTHROPIC_API_KEY });
    if (url.pathname !== "/build" || req.method !== "POST") return json(req, { error: "not found" }, 404);
    const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    const b = await req.json().catch(() => ({}));
    if (!token) return json(req, { status: "signin" }, 401);
    let st; try { st = await rpc("lib_request", { mk: String(b.make || ""), mdl: String(b.model || ""), yr: +b.year || null }, token); } catch (e) { return json(req, { status: "error" }, 400); }
    if (st !== "queued" || !env.ANTHROPIC_API_KEY) return json(req, { status: st, live: !!env.ANTHROPIC_API_KEY });
    const r = await buildOne(env);   // the person waits on this one; the cron picks up anything left over
    return json(req, { status: r });
  },
  async scheduled(ev, env, ctx) {
    if (!env.ANTHROPIC_API_KEY || !env.WORKER_SECRET) return;
    for (let i = 0; i < 2; i++) { const r = await buildOne(env); if (r === "empty" || r === "limit") break; }
  }
};
