/* Revora service reminders (Cloudflare Worker). Runs once a day on a cron trigger.
   Gets the reminders due today from Supabase, sends each person one email with everything that's due, marks them sent.
   Only people on a paid plan, a trial or a gift code get them (Supabase checks that), and only at their own account email.
   Secrets to add in Cloudflare (Settings > Variables and Secrets, type "Secret"):
     RESEND_API_KEY   the API key from resend.com (starts with re_)
     WORKER_SECRET    the same value as BILLING_SECRET on the revora-billing worker
   Visiting /run sends anything due right now (it's the same job the schedule runs, so nothing is sent twice).
   It also sends the new sign-up emails (thanks, then a trial offer and a plans note to people still on Free) once
   welcome_settings.enabled is on in Supabase. /welcome-test sends all three to the admin, /welcome-preview counts who'd get one.
   POST /notify { rows: [feedback] } emails feedback sent from the app to info@revoragarage.com, with Reply-To set to the sender. */
const SUPABASE_URL = "https://fhuksccqsyaomnouxxtb.supabase.co", SUPABASE_KEY = "sb_publishable_0wYtVeKcFJUzy3AfIaFhiw_NrT1wNkz";
const FROM = "Revora <info@revoragarage.com>", REPLY_TO = "info@revoragarage.com", INBOX = "info@revoragarage.com", APP = "https://revoragarage.com";
const SITES = ["https://revoragarage.com", "https://www.revoragarage.com", "https://revora-9pq.pages.dev", "https://xavier-wilson-portfolio.github.io"];
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const json = (o, status = 200) => new Response(JSON.stringify(o, null, 1), { status, headers: { "content-type": "application/json" } });

async function rpc(name, args) {
  const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/" + name, { method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, "content-type": "application/json" }, body: JSON.stringify(args) });
  if (!r.ok) throw new Error(name + " " + r.status + " " + (await r.text()).slice(0, 200));
  return r.json();
}
const fmt = d => d ? new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "";

function emailHtml(rows) {
  const byBike = {}; rows.forEach(r => (byBike[r.bike || "Your bike"] = byBike[r.bike || "Your bike"] || []).push(r));
  const blocks = Object.entries(byBike).map(([bike, rs]) => `<h2 style="font:700 17px Arial,sans-serif;color:#17232C;margin:22px 0 8px">${esc(bike)}</h2>` +
    rs.map(r => `<div style="border-left:4px solid ${r.kind === "odometer" ? "#2C5F7C" : "#D9BF8E"};background:#E6F1F8;padding:10px 14px;margin:0 0 8px;border-radius:6px">
      <div style="font:700 15px Arial,sans-serif;color:#17232C">${esc(r.title)}</div>
      <div style="font:14px/1.45 Arial,sans-serif;color:#3D4850;margin-top:3px">${esc(r.body)}</div></div>`).join("")).join("");
  return `<!doctype html><html><body style="margin:0;background:#F6EEDD"><div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Arial,sans-serif;color:#17232C">
    <div style="background:#17232C;color:#fff;padding:18px 20px;border-radius:12px 12px 0 0"><a href="${APP}/" style="text-decoration:none"><img src="${APP}/img/email-logo.png" width="127" height="32" alt="Revora" style="display:block;border:0;width:127px;height:32px;color:#D9BF8E;font:800 18px Arial,sans-serif"></a>
    <div style="font:700 22px Arial,sans-serif;margin-top:12px">${rows.length === 1 ? "Coming up on your bike" : "Coming up on your bikes"}</div></div>
    <div style="background:#fff;padding:4px 20px 20px;border-radius:0 0 12px 12px">${blocks}
    <p style="margin:22px 0 4px"><a href="${APP}/" style="background:#D9BF8E;color:#17232C;padding:11px 18px;border-radius:999px;text-decoration:none;font:700 14px Arial,sans-serif">Open Revora</a></p></div>
    <p style="font:12px/1.5 Arial,sans-serif;color:#5B6770;margin:16px 4px">You're getting this because email reminders are on for this bike. To stop them, open the bike in Revora, go to Reminders and switch email off. Questions? Just reply to this email.</p>
  </div></body></html>`;
}
function emailText(rows) {
  return rows.map(r => `${r.bike ? r.bike + ": " : ""}${r.title}\n${r.body || ""}`).join("\n\n") + `\n\nOpen Revora: ${APP}/\nTo stop these, open the bike in Revora, go to Reminders and switch email off. Questions? Reply to this email.`;
}

async function run(env) {
  if (!env.RESEND_API_KEY || !env.WORKER_SECRET) return { error: "not configured" };
  const rows = await rpc("reminders_due", { sec: env.WORKER_SECRET });
  const byEmail = {}; (rows || []).forEach(r => (byEmail[r.email.toLowerCase()] = byEmail[r.email.toLowerCase()] || []).push(r));
  const out = { due: (rows || []).length, people: 0, sent: 0, failed: 0 };
  for (const [to, rs] of Object.entries(byEmail)) {
    out.people++;
    const subject = rs.length === 1 ? rs[0].title : `${rs.length} things coming up on your bike${new Set(rs.map(r => r.bike)).size > 1 ? "s" : ""}`;
    const res = await fetch("https://api.resend.com/emails", { method: "POST",
      headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject, html: emailHtml(rs), text: emailText(rs) }) });
    if (!res.ok) { out.failed++; console.log("send failed", res.status, (await res.text()).slice(0, 300)); continue; }
    await rpc("reminders_mark", { sec: env.WORKER_SECRET, ids: rs.map(r => r.id) });
    out.sent += rs.length;
  }
  console.log("reminders", JSON.stringify(out));
  return out;
}


/* ---- emails to new sign-ups (step 1 thanks, step 2 day 3 trial offer, step 3 day 8 plans) ---- */
const WFROM = "Xavier at Revora <info@revoragarage.com>", ADMIN_TO = "xavier.j.wilson101@gmail.com";
async function sig(uid, env) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.WORKER_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const b = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode("unsub:" + uid)));
  return Array.from(b.slice(0, 16), x => x.toString(16).padStart(2, "0")).join("");
}
const first = n => String(n || "").trim().split(/\s+/)[0].replace(/^./, c => c.toUpperCase()) || "there";
function welcomeCopy(step, p) {
  const hi = `Hi ${first(p.name)},`;
  if (step === 1) return { subject: "Thanks for joining Revora", paras: [hi,
    "Thanks for signing up. I'm Xavier, and I built Revora after taking apart a 1977 Suzuki GS750 and losing track of half the parts.",
    p.bikes ? "You've already got your bike in. A good next step is logging the last service you remember, like an oil change or new chain, so the schedule knows where to start." : "First thing to do is add your bike. It takes about a minute, and the service schedule fills itself in for that model.",
    "If anything is confusing or broken, just reply to this email. It comes straight to me."], button: ["Open Revora", APP + "/"] };
  if (step === 2) return { subject: "30 days of Restorer, free", paras: [hi,
    "Quick one. You're on the Free plan, which covers one bike and the basics.",
    "If you're working on a project, Restorer adds the parts scan from a photo, a shopping list with a running total, AI that reads your receipts, and a step-by-step restoration course for your bike.",
    "You can try all of it free for 30 days. No card needed, and you drop back to Free on your own if you don't pick a plan."], button: ["Start the free trial", APP + "/?plans"] };
  return { subject: "Never miss a service on your bike", paras: [hi,
    "One last note from me about plans, then I'll leave you to it.",
    "Rider is $4.99 a month. It emails you before a service is due, sends recall alerts for your bike, and tracks fuel and cost of ownership. Restorer is $9.99 and adds everything for a project bike.",
    "Free stays free for one bike for as long as you want it. If you're riding more than one, or you want the reminders, Rider pays for itself the first time it catches an overdue chain."], button: ["See the plans", APP + "/?plans"] };
}
function welcomeHtml(c, unsub) {
  return `<!doctype html><html><body style="margin:0;background:#F6EEDD"><div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Arial,sans-serif;color:#17232C">
    <div style="background:#17232C;padding:18px 20px;border-radius:12px 12px 0 0"><a href="${APP}/" style="text-decoration:none"><img src="${APP}/img/email-logo.png" width="127" height="32" alt="Revora" style="display:block;border:0;width:127px;height:32px;color:#D9BF8E;font:800 18px Arial,sans-serif"></a></div>
    <div style="background:#fff;padding:20px;border-radius:0 0 12px 12px">${c.paras.map(t => `<p style="font:15px/1.55 Arial,sans-serif;margin:0 0 14px">${esc(t)}</p>`).join("")}
    <p style="margin:18px 0 14px"><a href="${c.button[1]}" style="background:#D9BF8E;color:#17232C;padding:11px 18px;border-radius:999px;text-decoration:none;font:700 14px Arial,sans-serif">${esc(c.button[0])}</a></p>
    <p style="font:15px/1.55 Arial,sans-serif;margin:0">Xavier<br><span style="color:#5B6770">Revora Garage</span></p></div>
    <p style="font:12px/1.5 Arial,sans-serif;color:#5B6770;margin:16px 4px">You're getting this because you signed up at revoragarage.com. <a href="${unsub}" style="color:#5B6770">Don't send me these</a>.</p>
  </div></body></html>`;
}
const welcomeText = (c, unsub) => c.paras.join("\n\n") + `\n\n${c.button[0]}: ${c.button[1]}\n\nXavier\nRevora Garage\n\nDon't want these? ${unsub}`;
async function sendWelcome(env, to, step, p, uid) {
  const c = welcomeCopy(step, p), unsub = `${env.SELF_URL || "https://revora-reminders.xavier-j-wilson101.workers.dev"}/unsub?u=${uid}&t=${await sig(uid, env)}`;
  const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ from: WFROM, to: [to], reply_to: REPLY_TO, subject: c.subject, html: welcomeHtml(c, unsub), text: welcomeText(c, unsub),
      headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } }) });
  if (!res.ok) console.log("welcome failed", res.status, (await res.text()).slice(0, 300));
  return res.ok;
}
async function runWelcome(env) {
  if (!env.RESEND_API_KEY || !env.WORKER_SECRET) return { error: "not configured" };
  const rows = await rpc("welcome_due", { sec: env.WORKER_SECRET, preview: false });
  const out = { due: (rows || []).length, sent: 0, failed: 0 };
  for (const r of rows || []) {
    if (await sendWelcome(env, r.email, r.step, r, r.user_id)) { await rpc("welcome_mark", { sec: env.WORKER_SECRET, uid: r.user_id, st: r.step }); out.sent++; } else out.failed++;
  }
  console.log("welcome", JSON.stringify(out));
  return out;
}
async function unsub(req, env) {
  const u = new URL(req.url), uid = u.searchParams.get("u") || "", t = u.searchParams.get("t") || "";
  const page = m => new Response(`<!doctype html><meta name=viewport content="width=device-width"><body style="font:16px/1.5 Arial,sans-serif;color:#17232C;background:#F6EEDD;padding:40px 20px;text-align:center"><h2>${m}</h2><p><a href="${APP}/" style="color:#2C5F7C">Back to Revora</a></p></body>`, { headers: { "content-type": "text/html" } });
  if (!/^[0-9a-f-]{36}$/.test(uid) || t !== await sig(uid, env)) return page("That link didn't work.");
  await rpc("welcome_unsub", { sec: env.WORKER_SECRET, uid });
  return page("Done. You won't get these emails anymore.");
}

const KIND = { idea: "Idea", problem: "Problem", question: "Question", praise: "Praise", contact: "Contact" };
async function notify(req, env) {
  const o = req.headers.get("Origin") || "", h = SITES.includes(o) ? { "Access-Control-Allow-Origin": o, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Vary": "Origin" } : {};
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST" || !SITES.includes(o)) return new Response("no", { status: 403, headers: h });
  if (!env.RESEND_API_KEY) return new Response(JSON.stringify({ error: "not configured" }), { status: 503, headers: h });
  const body = await req.json().catch(() => ({})), rows = (Array.isArray(body.rows) ? body.rows : []).slice(0, 5)
    .map(r => ({ kind: KIND[r.kind] ? r.kind : "idea", message: String(r.message || "").slice(0, 3000), rating: +r.rating || 0, email: /^\S+@\S+\.\S+$/.test(String(r.email || "")) ? String(r.email).slice(0, 120) : "",
      page: String(r.page || "").slice(0, 40), bike: String(r.bike || "").slice(0, 80), device: String(r.device || "").slice(0, 200), user: String(r.user || "").slice(0, 120) }))
    .filter(r => r.message.trim().length >= 3);
  let sent = 0;
  for (const r of rows) {
    const subject = `Revora ${KIND[r.kind].toLowerCase()}: ${r.message.replace(/\s+/g, " ").slice(0, 60)}${r.message.length > 60 ? "…" : ""}`;
    const meta = [["From", r.email || "No email given"], ["Signed in as", r.user], ["Rating", r.rating ? r.rating + " of 5" : ""], ["Page", r.page], ["Bike", r.bike], ["Device", r.device]].filter(x => x[1]);
    const html = `<div style="font:15px/1.5 Arial,sans-serif;color:#17232C;max-width:600px"><div style="font:700 12px Arial;letter-spacing:2px;color:#2C5F7C">REVORA ${esc(KIND[r.kind].toUpperCase())}</div>
      <p style="white-space:pre-wrap;font-size:16px;margin:10px 0 16px">${esc(r.message)}</p><table style="font-size:13px;color:#5B6770">${meta.map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0"><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>
      ${r.email ? `<p style="font-size:13px;color:#5B6770">Reply to this email to answer them.</p>` : ""}</div>`;
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
      body: JSON.stringify(Object.assign({ from: FROM, to: [INBOX], subject, html, text: r.message + "\n\n" + meta.map(([k, v]) => k + ": " + v).join("\n") }, r.email ? { reply_to: r.email } : {})) });
    if (res.ok) sent++; else console.log("notify failed", res.status, (await res.text()).slice(0, 200));
  }
  return new Response(JSON.stringify({ sent }), { status: 200, headers: Object.assign({ "content-type": "application/json" }, h) });
}

export default {
  async scheduled(evt, env, ctx) { ctx.waitUntil(run(env).catch(e => console.log(e)).then(() => runWelcome(env)).catch(e => console.log("welcome", e))); },
  async fetch(req, env) {
    const path = new URL(req.url).pathname;
    if (path === "/notify") return notify(req, env);
    if (path === "/unsub") return unsub(req, env);
    if (path === "/welcome-test") { // sends all three emails to the admin only, to check how they look
      if (!env.RESEND_API_KEY) return json({ error: "not configured" }, 503);
      let n = 0; for (const st of [1, 2, 3]) if (await sendWelcome(env, ADMIN_TO, st, { name: "Xavier", bikes: st === 1 ? 0 : 1 }, "00000000-0000-0000-0000-000000000000")) n++;
      return json({ sent: n, to: ADMIN_TO });
    }
    if (path === "/welcome-preview") { const rows = await rpc("welcome_due", { sec: env.WORKER_SECRET, preview: true }); const c = { 1: 0, 2: 0, 3: 0 }; (rows || []).forEach(r => c[r.step]++); return json({ wouldSend: { thanks: c[1], trialOffer: c[2], plans: c[3] } }); }
    if (path === "/welcome-run") { try { return json(await runWelcome(env)); } catch (e) { return json({ error: String(e.message || e) }, 500); } }
    if (new URL(req.url).pathname === "/run") { try { return json(await run(env)); } catch (e) { return json({ error: String(e.message || e) }, 500); } }
    return new Response("Revora reminders is running. It sends once a day.", { status: 200 });
  },
};
