/* Revora service reminders: runs once a day on a Cloudflare cron trigger.
   Reads reminders that are due from Supabase, sends one email per person with everything due, marks them sent.
   Secrets (set in the Cloudflare dashboard, never in this file): SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY
   Plain settings: FROM_EMAIL (e.g. "Revora <reminders@yourdomain.com>"), APP_URL (the site address). */
const today = () => new Date().toISOString().slice(0, 10);
const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function sb(env, path, init = {}) {
  const r = await fetch(env.SUPABASE_URL + "/rest/v1/" + path, { ...init, headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + env.SUPABASE_SERVICE_KEY, "Content-Type": "application/json", Prefer: "return=minimal", ...(init.headers || {}) } });
  if (!r.ok) throw new Error(path + " " + r.status + " " + (await r.text()));
  return r.status === 204 ? null : r.json();
}
function emailHtml(rows, env) {
  const byBike = {}; rows.forEach(r => (byBike[r.bike || "Your bike"] = byBike[r.bike || "Your bike"] || []).push(r));
  const block = Object.entries(byBike).map(([bike, rs]) => `<h2 style="font:700 18px Arial;color:#17232C;margin:22px 0 8px">${esc(bike)}</h2>` +
    rs.map(r => `<div style="border-left:4px solid ${r.kind === "odometer" ? "#2C5F7C" : "#D9BF8E"};background:#F6F9FB;padding:10px 14px;margin:0 0 8px;border-radius:6px"><b style="font:700 15px Arial;color:#17232C">${esc(r.title)}</b><div style="font:14px Arial;color:#4A545C;margin-top:3px">${esc(r.body)}</div></div>`).join("")).join("");
  return `<div style="max-width:560px;margin:0 auto;padding:24px;font-family:Arial,sans-serif;color:#0E1114"><div style="background:#17232C;color:#fff;padding:18px 20px;border-radius:12px"><div style="font:800 12px Arial;letter-spacing:2px;color:#D9BF8E">REVORA</div><div style="font:700 22px Arial;margin-top:4px">Service coming up</div></div>${block}
    <p style="font:14px Arial;margin:22px 0"><a href="${esc(env.APP_URL || "")}" style="background:#D9BF8E;color:#17232C;padding:11px 18px;border-radius:999px;text-decoration:none;font-weight:700">Open Revora and log it</a></p>
    <p style="font:12px Arial;color:#7D878E">You get these because email reminders are on for this bike. Turn them off on the bike's Reminders page.</p></div>`;
}
export default {
  async scheduled(evt, env, ctx) { ctx.waitUntil(run(env)); },
  async fetch(req, env) { return new Response("Revora reminders worker. It runs on a schedule.", { status: 200 }); }
};
async function run(env) {
  const rows = await sb(env, `reminder_queue?select=*&sent_at=is.null&send_on=lte.${today()}&order=send_on.asc&limit=500`, { headers: { Prefer: "" } });
  const byEmail = {}; (rows || []).forEach(r => (byEmail[r.email.toLowerCase()] = byEmail[r.email.toLowerCase()] || []).push(r));
  for (const [to, rs] of Object.entries(byEmail)) {
    const subject = rs.length === 1 ? rs[0].title : `${rs.length} things coming up on your bike`;
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ from: env.FROM_EMAIL, to: [to], subject, html: emailHtml(rs, env) }) });
    if (!res.ok) { console.log("send failed", to, res.status, await res.text()); continue; }
    await sb(env, `reminder_queue?id=in.(${rs.map(r => r.id).join(",")})`, { method: "PATCH", body: JSON.stringify({ sent_at: new Date().toISOString() }) });
  }
}
