/* Revora service reminders (Cloudflare Worker). Runs once a day on a cron trigger.
   Gets the reminders due today from Supabase, sends each person one email with everything that's due, marks them sent.
   Only people on a paid plan, a trial or a gift code get them (Supabase checks that), and only at their own account email.
   Secrets to add in Cloudflare (Settings > Variables and Secrets, type "Secret"):
     RESEND_API_KEY   the API key from resend.com (starts with re_)
     WORKER_SECRET    the same value as BILLING_SECRET on the revora-billing worker
   Visiting /run sends anything due right now (it's the same job the schedule runs, so nothing is sent twice). */
const SUPABASE_URL = "https://fhuksccqsyaomnouxxtb.supabase.co", SUPABASE_KEY = "sb_publishable_0wYtVeKcFJUzy3AfIaFhiw_NrT1wNkz";
const FROM = "Revora <reminders@revoragarage.com>", REPLY_TO = "xavier.j.wilson101@gmail.com", APP = "https://revoragarage.com";
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
    <div style="background:#17232C;color:#fff;padding:18px 20px;border-radius:12px"><div style="font:800 12px Arial,sans-serif;letter-spacing:2px;color:#D9BF8E">REVORA</div>
    <div style="font:700 22px Arial,sans-serif;margin-top:4px">${rows.length === 1 ? "Coming up on your bike" : "Coming up on your bikes"}</div></div>
    <div style="background:#fff;padding:4px 20px 20px;border-radius:0 0 12px 12px">${blocks}
    <p style="margin:22px 0 4px"><a href="${APP}/" style="background:#D9BF8E;color:#17232C;padding:11px 18px;border-radius:999px;text-decoration:none;font:700 14px Arial,sans-serif">Open Revora</a></p></div>
    <p style="font:12px/1.5 Arial,sans-serif;color:#5B6770;margin:16px 4px">You're getting this because email reminders are on for this bike. To stop them, open the bike in Revora, go to Reminders and switch email off.</p>
  </div></body></html>`;
}
function emailText(rows) {
  return rows.map(r => `${r.bike ? r.bike + ": " : ""}${r.title}\n${r.body || ""}`).join("\n\n") + `\n\nOpen Revora: ${APP}/\nTo stop these, open the bike in Revora, go to Reminders and switch email off.`;
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

export default {
  async scheduled(evt, env, ctx) { ctx.waitUntil(run(env)); },
  async fetch(req, env) {
    if (new URL(req.url).pathname === "/run") { try { return json(await run(env)); } catch (e) { return json({ error: String(e.message || e) }, 500); } }
    return new Response("Revora reminders is running. It sends once a day.", { status: 200 });
  },
};
