/* Revora billing (Cloudflare Worker). Stripe sends events here when someone subscribes, renews or cancels,
   and this sets their plan in Supabase through billing_set().
   Secrets to add in Cloudflare (Settings > Variables and Secrets, type "Secret"):
     STRIPE_WEBHOOK_SECRET  the signing secret of the Stripe webhook (starts with whsec_)
     STRIPE_SECRET_KEY      a Stripe restricted key that can read subscriptions (starts with rk_)
     BILLING_SECRET         the value Supabase showed when you ran billing.sql
   Plans are worked out from the price: $4.99 or $49 is Rider, $9.99 or $99 is Restorer, $29 or $290 is Shop.
   A price can also carry metadata plan = rider / restorer / shop, which wins. */
const SUPABASE_URL = "https://fhuksccqsyaomnouxxtb.supabase.co", SUPABASE_KEY = "sb_publishable_0wYtVeKcFJUzy3AfIaFhiw_NrT1wNkz";
const BY_AMOUNT = { 499: "rider", 4900: "rider", 999: "restorer", 9900: "restorer", 2900: "shop", 29000: "shop" };
const GRACE = 3 * 864e5;   // keep the plan a few days past the renewal date while Stripe retries a card
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });

async function verify(body, header, secret) {
  const parts = Object.fromEntries(String(header || "").split(",").map(x => x.split("=")).filter(x => x.length === 2));
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - +parts.t) > 600) return false;   // older than 10 minutes: refuse replays
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(parts.t + "." + body));
  const hex = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
  const sigs = String(header).split(",").filter(x => x.startsWith("v1=")).map(x => x.slice(3));
  return sigs.some(s => s.length === hex.length && [...s].every((c, i) => c === hex[i]));
}
const planOfSub = sub => {
  const it = sub && sub.items && sub.items.data && sub.items.data[0], pr = it && it.price;
  return (pr && pr.metadata && pr.metadata.plan) || (pr && BY_AMOUNT[pr.unit_amount]) || null;
};
const endOfSub = sub => {
  const it = sub && sub.items && sub.items.data && sub.items.data[0], t = (sub && sub.current_period_end) || (it && it.current_period_end);
  return t ? new Date(t * 1000 + GRACE).toISOString() : new Date(Date.now() + 35 * 864e5).toISOString();
};
async function setPlan(env, uid, cust, plan, until) {
  const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/billing_set", { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, "content-type": "application/json" },
    body: JSON.stringify({ sec: env.BILLING_SECRET, uid: uid || null, cust: cust || "", pl: plan, until }) });
  const out = r.ok ? await r.json() : "http " + r.status + " " + (await r.text()).slice(0, 200);
  console.log("billing_set", uid || cust, plan, until, out);
  return out;
}

export default {
  async fetch(req, env) {
    if (req.method !== "POST") return new Response("Revora billing is running.", { status: 200 });
    if (!env.STRIPE_WEBHOOK_SECRET || !env.BILLING_SECRET) return json({ error: "not configured" }, 503);
    const body = await req.text();
    if (!(await verify(body, req.headers.get("Stripe-Signature"), env.STRIPE_WEBHOOK_SECRET))) return json({ error: "bad signature" }, 400);
    const ev = JSON.parse(body), o = ev.data && ev.data.object;
    try {
      if (ev.type === "checkout.session.completed" && o.mode === "subscription") {
        const uid = /^[0-9a-f-]{36}$/i.test(o.client_reference_id || "") ? o.client_reference_id : null;
        let sub = null;
        if (o.subscription && env.STRIPE_SECRET_KEY) {
          const r = await fetch("https://api.stripe.com/v1/subscriptions/" + encodeURIComponent(o.subscription), { headers: { Authorization: "Bearer " + env.STRIPE_SECRET_KEY } });
          if (r.ok) sub = await r.json(); else console.log("stripe read failed", r.status, (await r.text()).slice(0, 200));
        }
        const plan = planOfSub(sub);
        if (!plan) { console.log("no plan for checkout", o.id); return json({ ok: true, note: "unknown price" }); }
        if (!uid) console.log("checkout without client_reference_id; matching by customer", o.customer);
        return json({ ok: true, result: await setPlan(env, uid, o.customer, plan, endOfSub(sub)) });
      }
      if (ev.type === "customer.subscription.updated" || ev.type === "customer.subscription.created" || ev.type === "customer.subscription.deleted") {
        const live = ["active", "trialing", "past_due"].includes(o.status) && ev.type !== "customer.subscription.deleted";
        const plan = live ? planOfSub(o) : "free";
        if (!plan) return json({ ok: true, note: "unknown price" });
        const r = await setPlan(env, null, o.customer, plan, live ? endOfSub(o) : null);
        return json({ ok: true, result: r });   // "nouser" here is normal when this arrives before checkout.session.completed
      }
      return json({ ok: true, ignored: ev.type });
    } catch (e) { console.log("billing error", String(e)); return json({ error: "failed" }, 500); }
  },
};
