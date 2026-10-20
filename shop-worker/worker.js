/* Revora shop (Cloudflare Worker): searches eBay for parts and returns listings with prices for the Shopping list.
   Uses eBay's Browse API with an app token, so nobody signs in to eBay here.
   Secrets to add in Cloudflare (Settings > Variables and Secrets, type "Secret"):
     EBAY_CLIENT_ID      eBay developer "App ID (Client ID)", Production keyset
     EBAY_CLIENT_SECRET  eBay developer "Cert ID (Client Secret)", Production keyset
   Optional:
     EBAY_CAMPAIGN_ID    your eBay Partner Network campaign ID, so purchases through Revora earn a commission
     EBAY_VERIFY_TOKEN   only if you use eBay's account-deletion notifications (see /ebay-deletion below)
   GET /search?q=front+brake+pads&limit=24  ->  { items: [{ title, price, ship, image, url, condition }] } */
const SITES = ["https://revoragarage.com", "https://www.revoragarage.com", "https://revora-9pq.pages.dev", "https://xavier-wilson-portfolio.github.io"];
let tok = null, tokUntil = 0;

const cors = o => SITES.includes(o) ? { "Access-Control-Allow-Origin": o, "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Vary": "Origin" } : {};
const json = (o, status, h) => new Response(JSON.stringify(o), { status: status || 200, headers: Object.assign({ "content-type": "application/json" }, h || {}) });

async function token(env) {
  if (tok && Date.now() < tokUntil) return tok;
  const r = await fetch("https://api.ebay.com/identity/v1/oauth2/token", { method: "POST",
    headers: { Authorization: "Basic " + btoa(env.EBAY_CLIENT_ID.trim() + ":" + env.EBAY_CLIENT_SECRET.trim()), "content-type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials&scope=" + encodeURIComponent("https://api.ebay.com/oauth/api_scope") });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error("token " + r.status + " " + (j.error_description || j.error || ""));
  tok = j.access_token; tokUntil = Date.now() + Math.max(60, (j.expires_in || 7200) - 300) * 1000;
  return tok;
}
function slim(it) {
  const sh = (it.shippingOptions || [])[0], cost = sh && sh.shippingCost ? +sh.shippingCost.value : null;
  return { title: String(it.title || "").slice(0, 160), price: it.price ? +it.price.value : 0, ship: cost == null || isNaN(cost) ? null : cost,
    image: (it.image && it.image.imageUrl) || (it.thumbnailImages && it.thumbnailImages[0] && it.thumbnailImages[0].imageUrl) || "",
    url: it.itemAffiliateWebUrl || it.itemWebUrl || "", condition: it.condition || "" };
}
async function search(req, env, h) {
  const u = new URL(req.url), q = (u.searchParams.get("q") || "").trim().slice(0, 120), limit = Math.min(48, Math.max(1, +u.searchParams.get("limit") || 24));
  if (q.length < 2) return json({ items: [] }, 200, h);
  const cache = caches.default, key = new Request("https://cache.revora/ebay?q=" + encodeURIComponent(q.toLowerCase()) + "&l=" + limit);
  const hit = await cache.match(key); if (hit) { const j = await hit.json(); return json(j, 200, h); }
  const api = "https://api.ebay.com/buy/browse/v1/item_summary/search?q=" + encodeURIComponent(q) + "&category_ids=6028&limit=" + limit + "&filter=" + encodeURIComponent("buyingOptions:{FIXED_PRICE},itemLocationCountry:US");
  const hdr = { Authorization: "Bearer " + await token(env), "X-EBAY-C-MARKETPLACE-ID": "EBAY_US", "X-EBAY-C-ENDUSERCTX": (env.EBAY_CAMPAIGN_ID ? "affiliateCampaignId=" + env.EBAY_CAMPAIGN_ID + "," : "") + "contextualLocation=country%3DUS" };
  let r = await fetch(api, { headers: hdr });
  if (r.status === 401) { tok = null; hdr.Authorization = "Bearer " + await token(env); r = await fetch(api, { headers: hdr }); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const why = "search " + r.status + " " + (((j.errors || [])[0] || {}).message || ""); console.log("ebay", why); return json({ error: "eBay search didn't work right now. Try again in a minute.", why, items: [] }, 502, h); }
  const out = { items: (j.itemSummaries || []).map(slim).filter(x => x.url && x.price > 0) };
  await cache.put(key, new Response(JSON.stringify(out), { headers: { "content-type": "application/json", "Cache-Control": "max-age=600" } }));
  return json(out, 200, h);
}
// eBay's account-deletion notice: answers the challenge, and accepts notices (Revora stores no eBay user data)
async function deletion(req, env) {
  const u = new URL(req.url), code = u.searchParams.get("challenge_code");
  if (req.method === "GET" && code) {
    const endpoint = u.origin + u.pathname, data = new TextEncoder().encode(code + (env.EBAY_VERIFY_TOKEN || "") + endpoint);
    const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", data))].map(b => b.toString(16).padStart(2, "0")).join("");
    return json({ challengeResponse: hash });
  }
  return new Response(null, { status: 204 });
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url), o = req.headers.get("Origin") || "", h = cors(o);
    if (u.pathname === "/ebay-deletion") return deletion(req, env);
    if (u.pathname === "/check") { // shape of the saved keys only, never the keys
      const id = String(env.EBAY_CLIENT_ID || ""), sec = String(env.EBAY_CLIENT_SECRET || ""), t = id.trim(), c = sec.trim();
      let tokenTest = ""; try { tok = null; await token(env); tokenTest = "ok"; } catch (e) { tokenTest = String(e.message || e); }
      return json({ clientId: { saved: !!id, length: t.length, extraSpaces: id !== t, hasPRD: /-PRD-/.test(t), hasSBX: /-SBX-/.test(t), startsWithPRD: /^PRD-/.test(t) },
        clientSecret: { saved: !!sec, length: c.length, extraSpaces: sec !== c, startsWithPRD: /^PRD-/.test(c), startsWithSBX: /^SBX-/.test(c) }, tokenTest });
    }
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    if (u.pathname !== "/search") return new Response("Revora shop is running.", { status: 200 });
    if (o && !SITES.includes(o)) return json({ error: "origin" }, 403);
    if (!env.EBAY_CLIENT_ID || !env.EBAY_CLIENT_SECRET) return json({ error: "eBay search isn't set up yet.", items: [] }, 503, h);
    try { return await search(req, env, h); } catch (e) { console.log("shop error", String(e)); return json({ error: "eBay search didn't work right now. Try again in a minute.", why: String(e.message || e).slice(0, 200), items: [] }, 502, h); }
  },
};
