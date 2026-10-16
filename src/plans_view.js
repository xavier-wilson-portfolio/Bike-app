/* ============ Plans: Free, Rider, Restorer, Shop ============
   Shared by the landing page, the plan chooser after sign-up, the public plans page and the app.
   window.rvPlanOf(profile, email) turns an account into its plan; the app gates features with it. */
(function () {
  const e = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PLANS = [
    { id: "free", name: "Free", m: 0, was: 0, y: 0, tag: "For one bike", color: "free", bikes: 1, feats: ["1 bike", "Maintenance log and service schedule", "Papers and renewals", "Checklists for every season", "Tire and chain wear tracking", "Print the bike history report", "A public build page to share"] },
    { id: "rider", name: "Rider", m: 4.99, was: 6.99, y: 49, tag: "For people who ride", color: "rider", bikes: 3, feats: ["Up to 3 bikes", "Everything in Free", "Service reminders by email and calendar", "Recall alerts", "Mods and upgrades log", "Fuel, MPG and cost of ownership", "Share the history report as a link", "Ask the mechanic, 10 questions a day"] },
    { id: "restorer", name: "Restorer", m: 9.99, was: 19.99, y: 99, tag: "For restoration projects", color: "restorer", best: true, trial: 30, bikes: 10, feats: ["Up to 10 bikes", "Everything in Rider", "Restoration courses for any bike", "Snap a receipt: AI reads it for you", "Parts scan from a photo", "Ask the mechanic as much as you like", "Money, budget and shopping list", "Share projects with a team"] },
    { id: "shop", name: "Shop", m: 29, was: 49.99, y: 290, tag: "For shops and builders", color: "shop", bikes: Infinity, feats: ["Unlimited bikes", "Everything in Restorer", "Customer bikes with history reports to hand over", "Up to 10 team members", "Priority help"] },
  ];
  const RANK = { free: 0, rider: 1, restorer: 2, shop: 3 };
  window.RV_PLANS = PLANS; window.RV_PLAN_RANK = RANK;
  const ADMIN = "xavier.j.wilson101@gmail.com";
  // the plan an account has right now: an expired paid plan or trial falls back to Free
  window.rvPlanOf = function (profile, email) {
    if (email && String(email).toLowerCase() === ADMIN) return { id: "shop", admin: true, until: null, trial: false };
    const p = profile || {}; let id = p.plan === "pro" ? "rider" : RANK[p.plan] != null ? p.plan : "free";
    const until = p.plan_until ? new Date(p.plan_until) : null;
    if (id !== "free" && until && until < new Date()) id = "free";
    return { id, admin: false, until: id !== "free" ? until : null, trial: !!(p.trial_used && id === "restorer" && until), trialUsed: !!p.trial_used };
  };
  const off = p => Math.round((1 - p.m / p.was) * 100);
  window.rvPlansHtml = function (opts = {}) {
    const yearly = !!opts.yearly, cur = opts.current || "", live = !!(window.RV_CONFIG && RV_CONFIG.plansLive), mode = opts.mode || "view";   // view | choose
    const price = p => p.m === 0 ? `<b>$0</b><span>forever</span>` : yearly
      ? `<s>$${(p.was * 12).toFixed(2)}</s><b>$${p.y}</b><span>a year · $${(p.y / 12).toFixed(2)} a month</span>`
      : `<s>$${p.was.toFixed(2)}</s><b>$${p.m.toFixed(2)}</b><span>a month</span>`;
    const act = p => {
      if (cur === p.id) return `<span class="pl-cur">Your plan${opts.until && p.id !== "free" ? " until " + e(new Date(opts.until).toLocaleDateString("en-US", { month: "short", day: "numeric" })) : ""}</span>`;
      if (p.id === "free") return mode === "choose" ? `<button class="btn" data-pl-pick="free">Start free</button>` : `<button class="btn" disabled>Included</button>`;
      if (p.trial && !opts.trialUsed) return `<button class="btn tan" data-pl-pick="trial">Start ${p.trial}-day free trial</button><small class="pl-then">Then $${p.m.toFixed(2)} a month. Cancel any time.</small>`;
      return live ? `<button class="btn ${p.best ? "tan" : "pri"}" data-pl-pick="${p.id}">Choose ${e(p.name)}</button>` : `<button class="btn" disabled title="Checkout opens soon">Checkout opens soon</button>`;
    };
    return `<div class="pl">
      <div class="pl-deal">${"Limited-time discount on every paid plan."}</div>
      <div class="pl-tog seg" role="group" aria-label="Billing"><button class="${yearly ? "" : "on"}" data-pl-bill="m">Monthly</button><button class="${yearly ? "on" : ""}" data-pl-bill="y">Yearly <small>2 months free</small></button></div>
      <div class="pl-grid">${PLANS.map(p => `<article class="pl-card ${p.color}${p.best ? " best" : ""}${cur === p.id ? " cur" : ""}">
        ${p.best ? `<span class="pl-best">Most popular${p.trial ? " · " + p.trial + " days free" : ""}</span>` : ""}<div class="pl-top"><h3>${e(p.name)}</h3><span class="pl-tag">${e(p.tag)}</span></div>
        <div class="pl-price">${price(p)}${p.was ? `<em class="pl-off">${off(p)}% off · limited time</em>` : ""}</div>
        <ul>${p.feats.map(f => `<li>${e(f)}</li>`).join("")}</ul>
        <div class="pl-act">${act(p)}</div>
      </article>`).join("")}</div>
      ${live || mode !== "choose" ? "" : `<p class="pl-note">Paid checkout opens soon. Start free, or take the Restorer trial and get everything for a month.</p>`}
      <div class="pl-faq">
        <div><b>What happens to my records if I change plans?</b><span>Nothing is ever deleted. On a smaller plan, features you don't have stay visible and your records stay safe until you upgrade again.</span></div>
        <div><b>Can I cancel any time?</b><span>Yes. You keep the paid features until the end of the month or year you paid for.</span></div>
        <div><b>How does the Restorer trial work?</b><span>You get every Restorer feature for 30 days, no card needed. When it ends you're back on Free unless you choose a plan.</span></div>
      </div></div>`;
  };
})();
