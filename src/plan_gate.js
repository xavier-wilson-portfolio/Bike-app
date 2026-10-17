/* ============ Plan gates: what each plan unlocks ============
   Everything stays visible. A page or button your plan doesn't include shows what it does and how to get it,
   with a link to the plans page (and the Restorer trial when it's still available). */
const PLAN_NAME = { free: "Free", rider: "Rider", restorer: "Restorer", shop: "Shop" };
const planNow = () => window.rvPlanOf ? rvPlanOf(window.RV_CLOUD && RV_CLOUD.profile, window.RV_CLOUD && RV_CLOUD.user && RV_CLOUD.user.email) : { id: "shop", admin: true };
const hasPlan = need => !need || ((window.RV_PLAN_RANK || {})[planNow().id] || 0) >= ((window.RV_PLAN_RANK || {})[need] || 0);
const SEC_PLAN = { reminders: "rider", recalls: "rider", mods: "rider", costs: "rider", value: "rider", budget: "restorer", purchasing: "restorer", receipts: "restorer", team: "restorer", viewer: "restorer" };
// on a restoration project, the course and its workshop pages are Restorer; the everyday pages follow their own plan
const RESTORE_OPEN = new Set(["maintenance", "reminders", "mods", "costs", "recalls", "papers", "checklists", "wear", "report", "build", "value", "finder", "docs", "settings", "help", "plans", "shops", "guides", "receipts", "problems"]);
function needFor(sec) { if (!GENERIC && !RESTORE_OPEN.has(sec) && sec !== "plans") return "restorer"; return SEC_PLAN[sec] || null; }
const planLockFor = sec => { const need = needFor(sec); return need && !hasPlan(need) ? need : null; };
const secLock = id => planLockFor(id) ? `<span class="lockb" title="Included in ${PLAN_NAME[planLockFor(id)]}">${ic("lock")}${PLAN_NAME[planLockFor(id)]}</span>` : "";
const trialOpen = () => !!window.RV_CLOUD && !planNow().trialUsed && planNow().id === "free";

async function startTrial() {
  if (!window.RV_CLOUD) { location.href = location.pathname + "?auth=signup"; return; }
  const { data, error } = await RV_CLOUD.sb.rpc("start_trial");
  if (error) { toast(/function|schema cache/i.test(error.message || "") ? "The trial isn't switched on yet." : "Couldn't start the trial. Check your internet and try again.", "err"); return; }
  if (data === "used") { toast("You've already had the free trial.", "err"); return; }
  toast("Your 30-day Restorer trial has started."); setTimeout(() => location.reload(), 900);
}
const LOCK_TXT = {
  reminders: "See when every service comes due, with email and calendar reminders before it does.", recalls: "Get NHTSA safety recalls for your bike and a heads-up when a new one comes out.",
  mods: "Keep every aftermarket part with its part number, price and the stock part it replaced.", costs: "Log fill-ups, see your miles per gallon and what the bike really costs per mile.",
  budget: "Track spending against your budget, with every expense and order in one place.", purchasing: "Plan, quote and track every part you order.", receipts: "Snap a receipt and the AI files it as a service, mod or expense.",
  team: "Share the project with friends or a shop and see who did what.", viewer: "Explore the bike in 3D.", home: "Follow a step-by-step restoration course for this bike.",
  course: "A step-by-step restoration course for this bike, with how-to for every step.", chat: "Ask the mechanic anything about your bike.", scan: "Point your camera at a tray of parts and see what's there.",
  share: "Share the history report as a link with a buyer or a shop.",
  value: "See what the bike is worth next to what you've put into it, and get a listing written from your records when you sell." };
function upsellBody(need, what) {
  const P = (window.RV_PLANS || []).find(p => p.id === need) || {};
  return `<div class="up"><span class="up-ico">${ic("lock")}</span><span class="up-k">Included in ${esc(P.name || need)}${P.m ? ` · <s>$${P.was.toFixed(2)}</s> $${P.m.toFixed(2)} a month` : ""}</span>
    <h2>${esc(what.title)}</h2><p>${esc(what.text || "")}</p>
    <ul>${(P.feats || []).slice(0, 6).map(f => `<li>${esc(f)}</li>`).join("")}</ul>${trialOpen() && need !== "restorer" ? `<p class="faint" style="font-size:13px">Restorer includes everything in Rider, and you can try it free for 30 days.</p>` : ""}
    <div class="row" style="gap:8px;flex-wrap:wrap;justify-content:center">${trialOpen() ? `<button class="btn tan" data-up-trial>${need === "restorer" ? "Start 30-day free trial" : "Try Restorer free for 30 days"}</button>` : ""}<button class="btn pri" data-up-plans>See plans</button>${!window.RV_CLOUD && window.rvHasAccounts && rvHasAccounts() ? `<button class="btn" data-up-signup>Create a free account</button>` : ""}</div></div>`;
}
function bindUpsell(root) {
  $$("[data-up-plans]", root).forEach(b => b.onclick = () => { closeModal(); go("plans"); });
  $$("[data-up-trial]", root).forEach(b => b.onclick = () => { closeModal(); startTrial(); });
  $$("[data-up-signup]", root).forEach(b => b.onclick = () => { location.href = location.pathname + "?auth=signup"; });
}
// for buttons: returns true if the plan includes it, otherwise shows the upgrade box
function gate(need, key, title) {
  if (hasPlan(need)) return true;
  modal(upsellBody(need, { title: "Upgrade to " + PLAN_NAME[need] + " to use " + title, text: LOCK_TXT[key] }), m => bindUpsell(m));
  return false;
}
VIEWS.locked = {
  render() { const sec = R.sec, need = planLockFor(sec) || "restorer", t = SEC[sec] ? SEC[sec].t : "this page";
    return `<div class="up-page">${upsellBody(need, { title: "Upgrade to " + PLAN_NAME[need] + " to use " + (sec === "home" ? "the restoration course" : t), text: LOCK_TXT[sec] || (SEC[sec] && SEC[sec].d) || "" })}
      ${!GENERIC ? `<p class="faint" style="text-align:center;margin-top:12px">Your maintenance log, papers and checklists for this bike are free. <button class="linkbtn" data-goto="maintenance">Open the maintenance log</button></p>` : ""}</div>`; },
  bind(root) { bindUpsell(root); }
};
// Ask the mechanic: Rider gets 10 questions a day, Restorer and up as many as they like
function chatAllowed() {
  if (!hasPlan("rider")) return gate("rider", "chat", "Ask the mechanic");
  if (hasPlan("restorer")) return true;
  const P = window.rvPrefs ? rvPrefs.get() : {}, d = today(), used = P.chatDay && P.chatDay.d === d ? P.chatDay.n : 0;
  if (used >= 10) { modal(upsellBody("restorer", { title: "That's your 10 questions for today", text: "Rider includes 10 questions a day. Restorer lets you ask as many as you like. Your questions reset tomorrow." }), m => bindUpsell(m)); return false; }
  if (window.rvPrefs) rvPrefs.set({ chatDay: { d, n: used + 1 } });
  return true;
}
