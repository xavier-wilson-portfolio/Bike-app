/* ============ Plans: Free, Rider, Restorer, Shop ============
   Shared by the public page (?plans=1) and the app. Prices are drafts until payments are switched on;
   while RV_CONFIG.plansLive is off, every account keeps everything free and nothing is locked. */
(function () {
  const e = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PLANS = [
    { id: "free", name: "Free", m: 0, y: 0, tag: "For one bike", color: "free", feats: ["1 bike", "Maintenance log and service schedule", "Reminders in the app and your calendar", "Mods, papers, fuel and cost tracking", "Checklists and tire and chain wear", "Recall alerts", "Print the history report"] },
    { id: "rider", name: "Rider", m: 4.99, y: 49, tag: "For people who ride a lot", color: "rider", feats: ["Up to 3 bikes", "Everything in Free", "Snap a receipt: AI reads it for you", "Email reminders before services and renewals", "Share your history report as a link", "Ask the mechanic, more questions a day"] },
    { id: "restorer", name: "Restorer", m: 9.99, y: 99, tag: "For restoration projects", color: "restorer", best: true, feats: ["Up to 10 bikes", "Everything in Rider", "Full restoration courses for any bike", "Share projects with a team", "Parts scan from a photo", "3D diagrams where a bike has them"] },
    { id: "shop", name: "Shop", m: 29, y: 290, tag: "For shops and builders", color: "shop", feats: ["Unlimited bikes", "Everything in Restorer", "Customer bikes with history reports to hand over", "Up to 10 team members", "Priority help"] },
  ];
  window.RV_PLANS = PLANS;
  window.rvPlansHtml = function (opts = {}) {
    const yearly = !!opts.yearly, cur = opts.current || "", live = !!(window.RV_CONFIG && RV_CONFIG.plansLive);
    const price = p => p.m === 0 ? `<b>$0</b><span>forever</span>` : yearly ? `<b>$${p.y}</b><span>a year · $${(p.y / 12).toFixed(2)} a month</span>` : `<b>$${p.m.toFixed(2)}</b><span>a month</span>`;
    return `<div class="pl">
      ${live ? "" : `<div class="pl-early"><b>Everything is free during early access.</b><span>Paid plans aren't switched on yet. When they are, you'll get a heads-up first, and anything you've logged stays yours.</span></div>`}
      <div class="pl-tog seg" role="group" aria-label="Billing"><button class="${yearly ? "" : "on"}" data-pl-bill="m">Monthly</button><button class="${yearly ? "on" : ""}" data-pl-bill="y">Yearly <small>2 months free</small></button></div>
      <div class="pl-grid">${PLANS.map(p => `<article class="pl-card ${p.color}${p.best ? " best" : ""}${cur === p.id ? " cur" : ""}">
        ${p.best ? `<span class="pl-best">Most popular</span>` : ""}<div class="pl-top"><h3>${e(p.name)}</h3><span class="pl-tag">${e(p.tag)}</span></div>
        <div class="pl-price">${price(p)}</div>
        <ul>${p.feats.map(f => `<li>${e(f)}</li>`).join("")}</ul>
        ${cur === p.id ? `<span class="pl-cur">Your plan</span>` : !live ? `<button class="btn" disabled>${p.m ? "Coming soon" : "Included"}</button>` : `<button class="btn ${p.best ? "tan" : "pri"}" data-pl-pick="${p.id}">Choose ${e(p.name)}</button>`}
      </article>`).join("")}</div>
      <div class="pl-faq">
        <div><b>What happens to my records if I change plans?</b><span>Nothing is ever deleted. On a smaller plan, extra bikes become read-only until you upgrade again or archive one.</span></div>
        <div><b>Can I cancel any time?</b><span>Yes. You keep the paid features until the end of the month or year you paid for.</span></div>
        <div><b>Is the restoration course really for any bike?</b><span>Yes. It's built for the kind of bike you pick, from cafe racers to scooters, with every number left for your factory manual.</span></div>
      </div></div>`;
  };
})();
