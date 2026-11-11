/* Revora service reminders (Cloudflare Worker). Runs every hour on a cron trigger (0 * * * *): welcome emails each hour, service reminders at 13:00 UTC.
   Gets the reminders due today from Supabase, sends each person one email with everything that's due, marks them sent.
   Only people on a paid plan, a trial or a gift code get them (Supabase checks that), and only at their own account email.
   Secrets to add in Cloudflare (Settings > Variables and Secrets, type "Secret"):
     RESEND_API_KEY   the API key from resend.com (starts with re_)
     WORKER_SECRET    the same value as BILLING_SECRET on the revora-billing worker
   Visiting /run sends anything due right now (it's the same job the schedule runs, so nothing is sent twice).
   It also sends the new sign-up emails (thanks, then the 48-hour welcome deal and two reminders to people still on Free) once
   welcome_settings.enabled is on in Supabase. /welcome-test sends one of each to the admin, /welcome-preview counts who'd get one.
   Revora Shop: at 13:00 UTC it also sends shop clients the reminders they agreed to (from "<Shop> via Revora", replies go to the shop),
   and every hour any report, value or budget a shop approved for a client. POST /shop-doc { id } sends one right away; /shop-run runs both now.
   Shop jobs: POST /shop-job { pid, wid } tells the customer their bike is checked in or ready (phone notification, or email), and the hourly run catches any missed.
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


/* ---- Revora Shop: reminders a shop's clients agreed to, and reports the shop sends them ---- */
const okMail = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(e || ""));
const fromShop = name => { const nm = String(name || "").replace(/["<>\r\n,;]/g, "").trim().slice(0, 60); return (nm ? nm + " via Revora" : "Revora") + " <info@revoragarage.com>"; };
const shopFrame = (title, inner, foot) => `<!doctype html><html><body style="margin:0;background:#EEF2F5"><div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Arial,sans-serif;color:#17232C">
  <div style="background:#17232C;color:#fff;padding:18px 20px;border-radius:12px 12px 0 0"><div style="font:700 12px Arial,sans-serif;letter-spacing:2px;color:#D9BF8E">${title.k}</div><div style="font:700 22px Arial,sans-serif;margin-top:6px">${title.t}</div></div>
  <div style="background:#fff;padding:6px 20px 20px;border-radius:0 0 12px 12px">${inner}</div>
  <p style="font:12px/1.5 Arial,sans-serif;color:#5B6770;margin:16px 4px">${foot}</p></div></body></html>`;
function shopRemHtml(first, rs) {
  const r0 = rs[0], byBike = {}; rs.forEach(r => (byBike[r.bike || "Your bike"] = byBike[r.bike || "Your bike"] || []).push(r));
  const blocks = Object.entries(byBike).map(([bike, L]) => `<h2 style="font:700 17px Arial,sans-serif;color:#17232C;margin:22px 0 8px">${esc(bike)}</h2>` +
    L.map(r => `<div style="border-left:4px solid #D9BF8E;background:#E6F1F8;padding:10px 14px;margin:0 0 8px;border-radius:6px"><div style="font:700 15px Arial,sans-serif;color:#17232C">${esc(String(r.title).replace(/^[^:]+:\s*/, ""))}</div><div style="font:14px/1.45 Arial,sans-serif;color:#3D4850;margin-top:3px">${esc(r.body)}</div></div>`).join("")).join("");
  const call = [r0.shop_phone ? `call <b>${esc(r0.shop_phone)}</b>` : "", okMail(r0.shop_email) ? "reply to this email" : ""].filter(Boolean).join(" or ");
  return shopFrame({ k: esc(String(r0.shop || "YOUR SHOP").toUpperCase()), t: rs.length === 1 ? "Your bike is coming due" : "Coming up on your bike" + (Object.keys(byBike).length > 1 ? "s" : "") },
    `<p style="font:15px/1.5 Arial,sans-serif;margin:16px 0 0">Hi ${esc(first)}, here's what's coming up.</p>${blocks}<p style="font:15px/1.5 Arial,sans-serif;margin:18px 0 0">To book it in${call ? ", " + call : ", get in touch with " + esc(r0.shop)}.</p>`,
    `${esc(r0.shop)} sends these reminders with Revora. <a href="${APP}/?unsub=${encodeURIComponent(r0.unsub)}" style="color:#2C5F7C">Stop these emails</a>.`);
}
async function runShop(env) {
  if (!env.RESEND_API_KEY || !env.WORKER_SECRET) return { error: "not configured" };
  let rows; try { rows = await rpc("shop_reminders_due", { sec: env.WORKER_SECRET }); } catch (e) { return { error: "shop tables missing" }; }
  const groups = {}; (rows || []).forEach(r => { const k = r.email.toLowerCase() + "|" + r.shop; (groups[k] = groups[k] || []).push(r); });
  const out = { due: (rows || []).length, sent: 0, failed: 0 };
  for (const rs of Object.values(groups)) {
    const r0 = rs[0], first = String(r0.client || "").split(/\s+/)[0] || "there";
    const subject = rs.length === 1 ? `${r0.bike ? r0.bike + ": " : ""}${String(r0.title).replace(/^[^:]+:\s*/, "")}` : `${rs.length} services coming up on your bike`;
    const text = `Hi ${first},\n\n` + rs.map(r => `${r.bike ? r.bike + ": " : ""}${String(r.title).replace(/^[^:]+:\s*/, "")}\n${r.body || ""}`).join("\n\n") + `\n\nTo book it in, ${r0.shop_phone ? "call " + r0.shop_phone + " or " : ""}reply to this email.\n\nStop these emails: ${APP}/?unsub=${encodeURIComponent(r0.unsub)}`;
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ from: fromShop(r0.shop), to: [r0.email], reply_to: okMail(r0.shop_email) ? r0.shop_email : REPLY_TO, subject: subject.slice(0, 150), html: shopRemHtml(first, rs), text,
        headers: { "List-Unsubscribe": `<${APP}/?unsub=${encodeURIComponent(r0.unsub)}>` } }) });
    if (!res.ok) { out.failed++; console.log("shop send failed", res.status, (await res.text()).slice(0, 300)); continue; }
    await rpc("shop_reminders_mark", { sec: env.WORKER_SECRET, ids: rs.map(r => r.id) });
    out.sent += rs.length;
  }
  console.log("shop reminders", JSON.stringify(out));
  return out;
}
const DOCK = { report: "service history report", value: "bike value", budget: "budget" };
async function runShopDocs(env, rid) {
  if (!env.RESEND_API_KEY || !env.WORKER_SECRET) return { error: "not configured" };
  let rows; try { rows = await rpc("shop_docs_outbox", { sec: env.WORKER_SECRET, rid: rid || null }); } catch (e) { return { error: "shop tables missing" }; }
  let sent = 0;
  for (const r of rows || []) {
    const first = String(r.client || "").split(/\s+/)[0] || "there", link = `${APP}/?shopdoc=${encodeURIComponent(r.token)}`, what = DOCK[r.kind] || "document";
    const html = shopFrame({ k: esc(String(r.shop || "YOUR SHOP").toUpperCase()), t: `Your ${what} is ready` },
      `<p style="font:15px/1.5 Arial,sans-serif;margin:16px 0">Hi ${esc(first)}, ${esc(r.shop)} sent you the ${esc(what)} for your ${esc(r.bike || "bike")}.</p>
       <p style="margin:18px 0 6px"><a href="${link}" style="background:#D9BF8E;color:#17232C;padding:12px 20px;border-radius:999px;text-decoration:none;font:700 15px Arial,sans-serif">Open it</a></p>
       <p style="font:13px/1.5 Arial,sans-serif;color:#5B6770;margin:14px 0 0">You can print it or save it as a PDF from there.</p>`,
      `Sent by ${esc(r.shop)} with Revora. Anyone with the link can open it, so only share it with people you trust.`);
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ from: fromShop(r.shop), to: [r.email], reply_to: okMail(r.shop_email) ? r.shop_email : REPLY_TO, subject: `Your ${what} from ${String(r.shop || "your shop").slice(0, 60)}`, html,
        text: `Hi ${first}, ${r.shop} sent you the ${what} for your ${r.bike || "bike"}.\n\nOpen it: ${link}` }) });
    if (!res.ok) { console.log("doc send failed", res.status, (await res.text()).slice(0, 200)); continue; }
    await rpc("shop_docs_mark", { sec: env.WORKER_SECRET, ids: [r.id] }); sent++;
  }
  return { sent };
}
// a new employee's login link and starting PIN
async function shopInvite(req, env) {
  const o = req.headers.get("Origin") || "", h = SITES.includes(o) ? { "Access-Control-Allow-Origin": o, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Vary": "Origin" } : {};
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST" || !SITES.includes(o) || !env.RESEND_API_KEY) return new Response("no", { status: 403, headers: h });
  const id = String((await req.json().catch(() => ({}))).id || ""); if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("bad", { status: 400, headers: h });
  let rows; try { rows = await rpc("shop_invite_outbox", { sec: env.WORKER_SECRET, eid: id }); } catch (e) { return new Response(JSON.stringify({ error: "setup" }), { status: 200, headers: h }); }
  let sent = 0;
  for (const r of rows || []) {   // only an employee whose starting PIN is still unused, at most once every 2 minutes
    const first = String(r.name || "").split(/\s+/)[0] || "there", link = `${APP}/?emp=${encodeURIComponent(r.invite)}`;
    const html = shopFrame({ k: esc(String(r.shop || "YOUR SHOP").toUpperCase()), t: "Your shop login" },
      `<p style="font:15px/1.5 Arial,sans-serif;margin:16px 0">Hi ${esc(first)}, ${esc(r.shop)} added you to their shop on Revora.</p>
       <p style="font:15px/1.5 Arial,sans-serif;margin:0 0 6px">Your starting PIN:</p><div style="font:700 30px 'Courier New',monospace;letter-spacing:8px;color:#17232C;margin:0 0 16px">${esc(r.pin)}</div>
       <p style="margin:6px 0"><a href="${link}" style="background:#D9BF8E;color:#17232C;padding:12px 20px;border-radius:999px;text-decoration:none;font:700 15px Arial,sans-serif">Open my login</a></p>
       <p style="font:13px/1.5 Arial,sans-serif;color:#5B6770;margin:14px 0 0">Type your name and this PIN, then pick your own 6-digit PIN. On the shop's computer, use the same name and PIN on the shop login.</p>`,
      `Sent for ${esc(r.shop)} by Revora. If you weren't expecting this, you can ignore it.`);
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ from: fromShop(r.shop), to: [r.email], reply_to: REPLY_TO, subject: `Your ${String(r.shop || "shop").slice(0, 60)} login on Revora`, html, text: `Hi ${first}, ${r.shop} added you on Revora.\n\nStarting PIN: ${r.pin}\nOpen: ${link}\n\nType your name and this PIN, then pick your own 6-digit PIN.` }) });
    if (res.ok) sent++; else console.log("invite failed", res.status, (await res.text()).slice(0, 200));
  }
  return new Response(JSON.stringify({ sent }), { status: 200, headers: Object.assign({ "content-type": "application/json" }, h) });
}
async function shopDoc(req, env) {
  const o = req.headers.get("Origin") || "", h = SITES.includes(o) ? { "Access-Control-Allow-Origin": o, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Vary": "Origin" } : {};
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST" || !SITES.includes(o)) return new Response("no", { status: 403, headers: h });
  const body = await req.json().catch(() => ({})), id = String(body.id || "");
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("bad", { status: 400, headers: h });
  const r = await runShopDocs(env, id).catch(e => ({ error: String(e.message || e) }));   // only ever sends an approved, unsent document to that client
  return new Response(JSON.stringify(r), { status: 200, headers: Object.assign({ "content-type": "application/json" }, h) });
}

/* ---- Revora Shop jobs: tell the customer when their bike is checked in and when it's ready ----
   A phone notification to every phone or computer where they turned notifications on in Revora; an email when there's none.
   Needs the secret VAPID_PRIVATE_JWK (the private half of the key pair whose public half is VAPID_PUBLIC below). */
const VAPID_PUBLIC = "BH0GjDxNXl4j886ENLQffBKyRwRbnQS3KMRPtFOC4Q7jJcz_6OWis12MJ54TRHLiqV5Pv2RQ8JPwzDxGkhMyqUw";
const enc = s => new TextEncoder().encode(s);
const b64u = b => { let s = ""; new Uint8Array(b).forEach(x => s += String.fromCharCode(x)); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const ub64 = s => Uint8Array.from(atob(String(s).replace(/-/g, "+").replace(/_/g, "/") + "===".slice((String(s).length + 3) % 4)), c => c.charCodeAt(0));
const cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; a.forEach(x => { o.set(x, i); i += x.length; }); return o; };
async function hkdf(salt, ikm, info, len) {
  const k = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, k, len * 8));
}
// the message body, encrypted for that one browser (RFC 8291, aes128gcm)
async function pushBody(sub, text) {
  const uaPub = ub64(sub.p256dh), auth = ub64(sub.auth);
  const mine = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPub = new Uint8Array(await crypto.subtle.exportKey("raw", mine.publicKey));
  const theirs = await crypto.subtle.importKey("raw", uaPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: theirs }, mine.privateKey, 256));
  const ikm = await hkdf(auth, shared, cat(enc("WebPush: info\0"), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc("Content-Encoding: aes128gcm\0"), 16), nonce = await hkdf(salt, ikm, enc("Content-Encoding: nonce\0"), 12);
  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, cat(enc(text), new Uint8Array([2]))));
  const head = new Uint8Array(86); head.set(salt, 0); new DataView(head.buffer).setUint32(16, 4096); head[20] = 65; head.set(asPub, 21);
  return cat(head, ct);
}
async function vapid(endpoint, env) {
  const key = await crypto.subtle.importKey("jwk", JSON.parse(env.VAPID_PRIVATE_JWK), { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const h = b64u(enc(JSON.stringify({ typ: "JWT", alg: "ES256" }))), p = b64u(enc(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: "mailto:info@revoragarage.com" })));
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc(h + "." + p));
  return `vapid t=${h}.${p}.${b64u(sig)}, k=${VAPID_PUBLIC}`;
}
// true when the phone's push service took it
async function sendPush(env, sub, msg) {
  try {
    const r = await fetch(sub.endpoint, { method: "POST", headers: { Authorization: await vapid(sub.endpoint, env), TTL: "172800", Urgency: "high", "Content-Encoding": "aes128gcm", "Content-Type": "application/octet-stream" },
      body: await pushBody(sub, JSON.stringify(msg)) });
    if (r.status === 404 || r.status === 410) { await rpc("push_gone", { sec: env.WORKER_SECRET, ep: sub.endpoint, ok: false }).catch(() => {}); return false; }
    if (!r.ok) { console.log("push failed", r.status, (await r.text()).slice(0, 200)); return false; }
    await rpc("push_gone", { sec: env.WORKER_SECRET, ep: sub.endpoint, ok: true }).catch(() => {});
    return true;
  } catch (e) { console.log("push error", String(e.message || e)); return false; }
}
const fmtDay = d => d ? new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }) : "";
async function runShopJobs(env, pid, wid) {
  if (!env.WORKER_SECRET) return { error: "not configured" };
  let rows; try { rows = await rpc("shop_jobs_outbox", { sec: env.WORKER_SECRET, pid: pid || null, wid: wid || null }); } catch (e) { return { error: "jobs tables missing" }; }
  const out = { due: (rows || []).length, pushed: 0, emailed: 0 };
  for (const r of rows || []) {
    const bike = r.bike || "bike", first = String(r.client || "").split(/\s+/)[0] || "there", ready = r.kind === "ready";
    const msg = ready ? { title: `Your ${bike} is ready`, body: `${r.shop} finished ${r.title ? r.title.toLowerCase().slice(0, 80) : "the work"}. Come pick it up${r.shop_phone ? " or call " + r.shop_phone : ""}.` }
      : { title: `${r.shop} has your ${bike}`, body: `${r.title ? r.title.slice(0, 80) + ". " : ""}${r.promised ? "Ready by " + fmtDay(r.promised) + "." : "We'll let you know when it's ready."} Tap to follow along.` };
    Object.assign(msg, { url: "/?mine", tag: "job-" + r.project_id + "-" + r.wo_id });
    let pushed = false;
    if (env.VAPID_PRIVATE_JWK) for (const s of r.subs || []) if (await sendPush(env, s, msg)) pushed = true;
    if (pushed) out.pushed++;
    else if (env.RESEND_API_KEY && okMail(r.email)) {
      const follow = r.joined ? `${APP}/?mine` : `${APP}/?join=${encodeURIComponent(r.code)}`;
      const html = shopFrame({ k: esc(String(r.shop || "YOUR SHOP").toUpperCase()), t: ready ? `Your ${esc(bike)} is ready` : `We have your ${esc(bike)}` },
        `<p style="font:15px/1.5 Arial,sans-serif;margin:16px 0">Hi ${esc(first)}, ${ready ? `${esc(r.shop)} finished the work on your ${esc(bike)}${r.title ? ": " + esc(r.title) : ""}. It's ready to pick up.` : `${esc(r.shop)} checked your ${esc(bike)} in${r.title ? " for " + esc(r.title.toLowerCase()) : ""}.${r.promised ? " It should be ready by <b>" + esc(fmtDay(r.promised)) + "</b>." : ""}`}</p>
         <p style="margin:18px 0 6px"><a href="${follow}" style="background:#D9BF8E;color:#17232C;padding:12px 20px;border-radius:999px;text-decoration:none;font:700 15px Arial,sans-serif">${r.joined ? "See it in Revora" : "Follow your bike in Revora"}</a></p>
         <p style="font:13px/1.5 Arial,sans-serif;color:#5B6770;margin:14px 0 0">${r.joined ? "Turn on notifications in the Revora app and you'll get these on your phone instead." : "See what's being worked on and when it'll be ready, any time. It's free."}${r.shop_phone ? ` Questions? Call ${esc(r.shop_phone)}.` : ""}</p>`,
        `Sent for ${esc(r.shop)} by Revora. Replies go to the shop.`);
      const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
        body: JSON.stringify({ from: fromShop(r.shop), to: [r.email], reply_to: okMail(r.shop_email) ? r.shop_email : REPLY_TO, subject: msg.title.slice(0, 150), html,
          text: `Hi ${first}, ${msg.body}\n\n${r.joined ? "See it in Revora" : "Follow your bike in Revora"}: ${follow}` }) });
      if (!res.ok) { console.log("job email failed", res.status, (await res.text()).slice(0, 200)); continue; }
      out.emailed++;
    } else if (!(r.subs || []).length && !okMail(r.email)) { /* no way to reach them: still mark it so it isn't retried forever */ }
    else continue;
    await rpc("shop_jobs_mark", { sec: env.WORKER_SECRET, pid: r.project_id, wid: r.wo_id, k: r.kind });
  }
  return out;
}
async function shopJob(req, env) {
  const o = req.headers.get("Origin") || "", h = SITES.includes(o) ? { "Access-Control-Allow-Origin": o, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Vary": "Origin" } : {};
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST" || !SITES.includes(o)) return new Response("no", { status: 403, headers: h });
  const b = await req.json().catch(() => ({})), pid = String(b.pid || ""), wid = String(b.wid || "");
  if (!/^[0-9a-f-]{36}$/.test(pid) || !/^WO-U?[0-9]{1,6}$/.test(wid)) return new Response("bad", { status: 400, headers: h });
  const r = await runShopJobs(env, pid, wid).catch(e => ({ error: String(e.message || e) }));   // only ever sends what that job hasn't sent yet
  return new Response(JSON.stringify(r), { status: 200, headers: Object.assign({ "content-type": "application/json" }, h) });
}

/* ---- emails to new sign-ups: thanks + deals right away, deals reminder day 3, features day 7, check-in day 14, then every 2 weeks ---- */
const WFROM = "Revora Garage <info@revoragarage.com>", ADMIN_TO = "xavier.j.wilson101@gmail.com";
async function sig(uid, env) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.WORKER_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const b = new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode("unsub:" + uid)));
  return Array.from(b.slice(0, 16), x => x.toString(16).padStart(2, "0")).join("");
}
const first = n => String(n || "").trim().split(/\s+/)[0].replace(/^./, c => c.toUpperCase()) || "there";
const SOCIAL = [["TikTok", "https://www.tiktok.com/@revora.garage"], ["Instagram", "https://www.instagram.com/revoragarageofficial/"], ["Facebook", "https://www.facebook.com/profile.php?id=61595784891437"]];
// the welcome price: 25% off if they pick a plan within 24 hours of joining (first 3 months monthly, or the first year on yearly)
const DEAL = [
  "Rider: $5.99 a month for your first 3 months, then $7.99, or $44 for your first year on yearly. Service reminders by email before things are due, recall alerts for your bike, fuel and cost tracking, and room for 3 bikes.",
  "Restorer: $10.99 a month for your first 3 months, then $14.99, or $89 for your first year on yearly. Everything in Rider, plus the parts scan from a photo, AI that reads your receipts, a shopping list with a budget, step-by-step restoration courses and up to 10 bikes. Or try it free for 30 days first.",
  "Shop: $44 a month for your first 3 months, then $59, or $374 for your first year on yearly. For shops and builders: work orders, customer bikes with history reports and a team of up to 10."];
const PRICES = [
  "Rider: $7.99 a month, or $59 a year. Service reminders by email before things are due, recall alerts for your bike, fuel and cost tracking, and room for 3 bikes.",
  "Restorer: $14.99 a month, or $119 a year. Everything in Rider, plus the parts scan from a photo, AI that reads your receipts, a shopping list with a budget, step-by-step restoration courses and up to 10 bikes.",
  "Shop: $59 a month, or $499 a year. For shops and builders: work orders, customer bikes with history reports and a team of up to 10."];
// step 1 thanks · 2 the welcome deal · 101 deal: 24 hours left · 102 deal: 3 hours left · 103 deal for members who joined before it started · 111 deal: 12 hours left · 112 deal: 3 hours left (24-hour members) · 4 features + socials · 5 check-in · 6+ every two weeks, rotating
function welcomeCopy(step, p) {
  const hi = `Hi ${first(p.name)},`, plans = ["See the plans", APP + "/?plans"], open = ["Open Revora", APP + "/"];
  if (step === 1) return { subject: "Welcome to Revora Garage", paras: [hi,
    "Thanks for joining Revora. We're really glad to have you.",
    "Here's what you can do with it:",
    { list: ["Keep a service log for every bike, with a maintenance schedule built for your model",
      "Get a heads-up before oil, chain, brakes or tires are due",
      "Go through every part of a project bike and mark what you have and what's missing",
      "Snap a photo of a pile of parts and let it pick out what's there",
      "Keep a shopping list with a running total, with eBay listings right in the app",
      "Follow a step-by-step restoration course for your bike",
      "Print or share a full history report when it's time to sell"] },
    p.bikes ? "Your bike is already in, so you're set. Logging the last service you remember is a good next step." : "The best first step is adding your bike. It takes about a minute.",
    "And if you ride with people who keep their maintenance in a notebook or in their head, send them our way. Revora is free to start."], button: open };
  const dh = p.deal_hours || 24;   // 24 hours for members who joined from Oct 23, 3:45 PM ET on, 48 before that
  if (step === 2) return { subject: `Your welcome price: 25% off for the next ${dh} hours`, paras: [hi,
    `You're on the Free plan, which covers one bike and the basics. For the next ${dh} hours, any paid plan is 25% off:`,
    { list: DEAL },
    "After that it goes to the regular price, and you can cancel any time.",
    "Your bikes and records stay right where they are when you upgrade. The countdown is on your garage page so you know how long is left."], button: ["See your price", APP + "/?plans"] };
  if (step === 101) return { subject: "About 24 hours left on your 25% off", paras: [hi,
    "A quick heads-up: your welcome price ends in about 24 hours.",
    { list: ["Rider: $5.99 a month for your first 3 months (then $7.99), or $44 for your first year", "Restorer: $10.99 a month for your first 3 months (then $14.99), or $89 for your first year", "Shop: $44 a month for your first 3 months (then $59), or $374 for your first year"] },
    "If you're working on a project bike, Restorer is the one to look at. You can take the $10.99 welcome price, or start a 30-day free trial instead and pay $14.99 a month after that."], button: ["See your price", APP + "/?plans"] };
  if (step === 103) return { subject: "Your Revora deal: lower prices until Sunday at noon", paras: [hi,
    "We just started a welcome deal for new members, and since you're already here, you get it too. Until Sunday, Oct 25 at noon Eastern, any paid plan is cheaper for your first 3 months:",
    { list: DEAL },
    "After 3 months it goes to the regular price, and you can cancel any time. Sign in and you'll see the deal prices on the plans page, with the countdown on your garage page.",
    "If Free is all you need, that's fine. One bike stays free for good."], button: ["See your price", APP + "/?plans"] };
  if (step === 111) return { subject: "About 12 hours left on your 25% off", paras: [hi,
    "A quick heads-up: your welcome price ends in about 12 hours.",
    { list: ["Rider: $5.99 a month for your first 3 months (then $7.99), or $44 for your first year", "Restorer: $10.99 a month for your first 3 months (then $14.99), or $89 for your first year", "Shop: $44 a month for your first 3 months (then $59), or $374 for your first year"] },
    "If you're working on a project bike, Restorer is the one to look at. You can take the $10.99 welcome price, or start a 30-day free trial instead and pay $14.99 a month after that."], button: ["See your price", APP + "/?plans"] };
  if (step === 102 || step === 112) return { subject: "Your 25% off ends in 3 hours", paras: [hi,
    "Last reminder: your 25% off ends in about 3 hours. After that, plans are the regular price of $7.99 for Rider, $14.99 for Restorer and $59 for Shop.",
    "If you want the welcome price, sign in and pick a plan before then. And if Free is all you need, that's fine too. One bike stays free for good."], button: ["See your price", APP + "/?plans"] };
  if (step === 4) return { subject: "A few things in Revora you might not have tried", paras: [hi,
    "You've had Revora for a week. Here are a few things people tend to miss:",
    { list: ["Ask the mechanic: type a question about your bike and get an answer that knows your model",
      "Checklists for every season, including a 10-step winter storage list",
      "Tire and chain wear tracking, so you know how much life is left",
      "Papers and renewals, so registration and insurance dates don't sneak up on you",
      "A public build page you can share with friends"] },
    "We post tips, build videos and new features on our pages. Follow along so you see what's coming."], button: open, social: true };
  if (step === 5) return { subject: "How's Revora working for you?", paras: [hi,
    "It's been two weeks since you joined, so we wanted to check in. Is Revora doing what you need?",
    "Reply to this email and tell us what works, what doesn't, and what you wish it did. Every reply gets read, and a lot of what's in the app came from riders asking for it.",
    "If you're restoring a bike, we'd love to see it. Send a few photos, tag @revoragarageofficial, or share your public build page from the app. Before and after shots are our favorite."], button: open, social: true };
  const k = (step - 6) % 4;
  if (k === 0) return { subject: "Things in Revora you might have missed", paras: [hi,
    "A quick reminder of a few things Revora can do that are easy to forget:",
    { list: ["The parts scan: take one photo of your parts and it marks what's there",
      "eBay listings in your shopping list, with prices and shipping, so you can compare without leaving the app",
      "The history report: every service and receipt in one document, ready to print or send to a buyer",
      "Ask the mechanic when you're stuck on a job"] }], button: open, social: true };
  if (k === 1 && p.free) return { subject: "What a Revora plan adds", paras: [hi,
    "You're on the Free plan, which covers one bike for good. If you want more, here's what each plan adds:",
    { list: PRICES },
    "Paying yearly saves 17 to 42% over monthly. Your bikes and records stay where they are whichever plan you pick."], button: plans };
  if (k === 1) return { subject: "Getting more out of Revora", paras: [hi,
    "A couple of quick tips to get more out of your plan:",
    { list: ["Update your odometer now and then so the reminders stay on time",
      "Snap your receipts as you go. The AI reads the parts and prices for you",
      "Share a bike with a friend or your mechanic so you're both working from the same records"] }], button: open, social: true };
  if (k === 2) return { subject: "A quick check on your bike", paras: [hi,
    "Good time for a quick look at your bike in Revora. Update the odometer, log anything you've done lately, and check what's coming up next.",
    "If the season's changing where you are, there's a checklist for it, whether you're getting ready to ride or putting the bike away for winter."], button: open, social: true };
  return { subject: "What's new at Revora", paras: [hi,
    "We're adding to Revora all the time, and the quickest way to see what's new is on our pages. We post build tips, feature updates and riders' projects.",
    "If Revora has helped you, the best thing you can do is tell a friend who rides. And if you're restoring, share your build page. We like seeing them."], button: open, social: true };
}
function welcomeHtml(c, unsub) {
  const para = t => typeof t === "string" ? `<p style="font:15px/1.55 Arial,sans-serif;margin:0 0 14px">${esc(t)}</p>`
    : `<ul style="font:15px/1.5 Arial,sans-serif;margin:0 0 14px;padding-left:20px">${t.list.map(i => `<li style="margin:0 0 6px">${esc(i)}</li>`).join("")}</ul>`;
  const soc = `<p style="font:14px/1.5 Arial,sans-serif;margin:0 0 14px">Follow Revora: ${SOCIAL.map(([n, u]) => `<a href="${u}" style="color:#2C5F7C;font-weight:700">${n}</a>`).join(" &middot; ")}</p>`;
  return `<!doctype html><html><body style="margin:0;background:#F6EEDD"><div style="max-width:560px;margin:0 auto;padding:24px 16px;font-family:Arial,sans-serif;color:#17232C">
    <div style="background:#17232C;padding:18px 20px;border-radius:12px 12px 0 0"><a href="${APP}/" style="text-decoration:none"><img src="${APP}/img/email-logo.png" width="127" height="32" alt="Revora" style="display:block;border:0;width:127px;height:32px;color:#D9BF8E;font:800 18px Arial,sans-serif"></a></div>
    <div style="background:#fff;padding:20px;border-radius:0 0 12px 12px">${c.paras.map(para).join("")}
    <p style="margin:18px 0 18px"><a href="${c.button[1]}" style="background:#D9BF8E;color:#17232C;padding:11px 18px;border-radius:999px;text-decoration:none;font:700 14px Arial,sans-serif">${esc(c.button[0])}</a></p>
    ${c.social ? soc : ""}<p style="font:15px/1.55 Arial,sans-serif;margin:0">The Revora Garage team</p></div>
    <p style="font:12px/1.5 Arial,sans-serif;color:#5B6770;margin:16px 4px">You're getting this because you signed up at revoragarage.com. ${c.social ? "" : SOCIAL.map(([n, u]) => `<a href="${u}" style="color:#5B6770">${n}</a>`).join(" &middot; ") + " &middot; "}<a href="${unsub}" style="color:#5B6770">Don't send me these</a></p>
  </div></body></html>`;
}
const welcomeText = (c, unsub) => c.paras.map(t => typeof t === "string" ? t : t.list.map(i => "- " + i).join("\n")).join("\n\n") + `\n\n${c.button[0]}: ${c.button[1]}\n\n` + (c.social ? "Follow Revora: " + SOCIAL.map(([n, u]) => n + " " + u).join(" | ") + "\n\n" : "") + `The Revora Garage team\n\nDon't want these? ${unsub}`;
async function welcomeMsg(env, to, step, p, uid) {
  const c = welcomeCopy(step, p), unsub = `${env.SELF_URL || "https://revora-reminders.xavier-j-wilson101.workers.dev"}/unsub?u=${uid}&t=${await sig(uid, env)}`;
  return { from: WFROM, to: [to], reply_to: REPLY_TO, subject: c.subject, html: welcomeHtml(c, unsub), text: welcomeText(c, unsub),
    headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } };
}
async function sendWelcome(env, to, step, p, uid) {
  const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" },
    body: JSON.stringify(await welcomeMsg(env, to, step, p, uid)) });
  if (!res.ok) console.log("welcome failed", res.status, (await res.text()).slice(0, 300));
  return res.ok;
}
// one batch call to Resend (up to 100 emails) and one call to log them, so any number of people fits in one run
async function runWelcome(env) {
  if (!env.RESEND_API_KEY || !env.WORKER_SECRET) return { error: "not configured" };
  let rows = await rpc("welcome_due", { sec: env.WORKER_SECRET, preview: false }); const jobs = [];
  const got103 = new Set((rows || []).filter(r => r.step === 103).map(r => r.user_id));   // one email per person per run: the deal note wins
  rows = (rows || []).filter(r => r.step === 103 || !got103.has(r.user_id));
  for (const r of rows) { jobs.push([r, r.step]); if (r.step === 1 && r.free) jobs.push([r, 2]); } // deals go out with the thank-you for people on Free
  const out = { due: (rows || []).length, sent: 0, failed: 0 };
  for (let i = 0; i < jobs.length; i += 100) {
    const part = jobs.slice(i, i + 100), msgs = [];
    for (const [r, st] of part) msgs.push(await welcomeMsg(env, r.email, st, r, r.user_id));
    const res = await fetch("https://api.resend.com/emails/batch", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "content-type": "application/json" }, body: JSON.stringify(msgs) });
    if (!res.ok) { out.failed += part.length; console.log("welcome batch failed", res.status, (await res.text()).slice(0, 300)); continue; }
    await rpc("welcome_mark_many", { sec: env.WORKER_SECRET, uids: part.map(j => j[0].user_id), steps: part.map(j => j[1]) });
    out.sent += part.length;
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
  // cron "0 * * * *": welcome and deal emails every hour (the deal reminders are timed to the hour); service reminders once a day at 13:00 UTC
  async scheduled(evt, env, ctx) {
    const daily = new Date(evt.scheduledTime || Date.now()).getUTCHours() === 13;
    ctx.waitUntil((daily ? run(env).catch(e => console.log(e)).then(() => runShop(env)).catch(e => console.log("shop", e)) : Promise.resolve()).then(() => runWelcome(env)).catch(e => console.log("welcome", e))
      .then(() => runShopDocs(env, null)).catch(e => console.log("shop docs", e)).then(() => runShopJobs(env, null, null)).catch(e => console.log("shop jobs", e)));
  },
  async fetch(req, env) {
    const path = new URL(req.url).pathname;
    if (path === "/notify") return notify(req, env);
    if (path === "/unsub") return unsub(req, env);
    if (path === "/shop-doc") return shopDoc(req, env);
    if (path === "/shop-invite") return shopInvite(req, env);
    if (path === "/shop-job") return shopJob(req, env);
    if (path === "/shop-run") { try { return json({ reminders: await runShop(env), docs: await runShopDocs(env, null) }); } catch (e) { return json({ error: String(e.message || e) }, 500); } }
    if (path === "/welcome-test") { // sends the welcome emails a new member gets now (24-hour deal) to the admin only, to check how they look
      if (!env.RESEND_API_KEY) return json({ error: "not configured" }, 503);
      let n = 0; for (const st of [1, 2, 111, 112, 4, 5]) if (await sendWelcome(env, ADMIN_TO, st, { name: "Xavier", bikes: 0, free: true, deal_hours: 24 }, "00000000-0000-0000-0000-000000000000")) n++;
      return json({ sent: n, to: ADMIN_TO });
    }
    if (path === "/welcome-preview") { const rows = await rpc("welcome_due", { sec: env.WORKER_SECRET, preview: true }); const c = {}; (rows || []).forEach(r => c["step" + r.step] = (c["step" + r.step] || 0) + 1); return json({ wouldSend: c }); }
    if (path === "/welcome-run") { try { return json(await runWelcome(env)); } catch (e) { return json({ error: String(e.message || e) }, 500); } }
    if (new URL(req.url).pathname === "/run") { try { return json(await run(env)); } catch (e) { return json({ error: String(e.message || e) }, 500); } }
    return new Response("Revora reminders is running. Welcome emails go out every hour, service reminders once a day.", { status: 200 });
  },
};
