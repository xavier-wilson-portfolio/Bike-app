/* ============ Plans: Free, Rider, Restorer, Shop ============
   Shared by the landing page, the plan chooser after sign-up, the public plans page and the app.
   window.rvPlanOf(profile, email) turns an account into its plan; the app gates features with it. */
(function () {
  const e = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PLANS = [
    { id: "free", name: "Free", m: 0, y: 0, tag: "For one bike", color: "free", bikes: 1, feats: ["1 bike", "Maintenance log and service schedule", "Papers and renewals", "Checklists for every season", "Tire and chain wear tracking", "Parts 1 and 2 of the restoration course", "Ask the mechanic: 3 questions to try it", "5 photos", "The bike history report to view", "A public build page to share", "Parts finder across every big store"] },
    { id: "rider", name: "Rider", m: 6.99, deal: 4.99, y: 49, tag: "For people who ride", color: "rider", bikes: 3, feats: ["Up to 3 bikes", "Everything in Free", "Service reminders by email and calendar", "Recall alerts", "Mods and upgrades log", "Fuel, MPG and cost of ownership", "What your bike is worth, and a selling kit", "Print the history report or save it as a PDF", "Share the history report as a link", "Unlimited photos", "Ask the mechanic, 10 questions a day"] },
    { id: "restorer", name: "Restorer", m: 9.99, deal: 6.99, y: 99, tag: "For restoration projects", color: "restorer", best: true, trial: 30, bikes: 10, feats: ["Up to 10 bikes", "Everything in Rider", "The full restoration course for any bike", "Snap a receipt: AI reads it for you", "Parts scan from a photo", "Ask the mechanic as much as you like", "Money, budget and shopping list", "Share projects with a team"] },
    { id: "shop", name: "Shop", m: 29, deal: 19.99, y: 290, tag: "For shops and builders", color: "shop", bikes: Infinity, feats: ["Unlimited bikes", "Everything in Restorer", "Work orders: check-in photos, estimates, approval by text, invoices", "Customer bikes with history reports to hand over", "Up to 10 team members", "Priority help"] },
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
    return { id, admin: false, until: id !== "free" ? until : null, trial: !!(p.trial_used && !p.paid && id === "restorer" && until), trialUsed: !!p.trial_used, paid: !!p.paid && id !== "free", comp: !!p.comp && id !== "free" };
  };
  // Manage billing: ask the billing worker for a signed-in Stripe billing page; if that fails, use the email login page
  window.rvManageBilling = async function (a, getToken) {
    const fallback = a.getAttribute("href"), w = window.open("", "_blank");
    try {
      const tok = getToken && await getToken(), api = (RV_CONFIG.billingApi || "https://revora-billing.xavier-j-wilson101.workers.dev") + "/portal";
      if (!tok) throw 0;
      const r = await fetch(api, { method: "POST", headers: { Authorization: "Bearer " + tok } }), j = await r.json();
      if (!r.ok || !j.url || !/^https:\/\/billing\.stripe\.com\//.test(j.url)) throw 0;
      if (w) w.location = j.url; else location.href = j.url;
    } catch (er) { if (w) w.location = fallback; else location.href = fallback; }
  };
  window.rvBindManage = (root, getToken) => root.querySelectorAll("[data-manage]").forEach(a => a.onclick = ev => { ev.preventDefault(); rvManageBilling(a, getToken); });
  // gift codes: someone enters a code the admin made and gets that plan for good
  window.rvGiftHtml = () => `<details class="pl-gift"><summary>Have a gift code?</summary><form data-gift><input name="code" maxlength="32" autocomplete="off" placeholder="Enter your code" aria-label="Gift code"><button class="btn sm pri" type="submit">Apply</button></form><p class="pl-gift-msg" aria-live="polite"></p></details>`;
  window.rvBindGift = function (root, getSb, done) {
    root.querySelectorAll("[data-gift]").forEach(f => f.onsubmit = async ev => {
      ev.preventDefault(); const msg = f.parentNode.querySelector(".pl-gift-msg"), b = f.querySelector("button"), code = f.code.value.trim().toUpperCase();
      const say = (t, bad) => { msg.textContent = t; msg.className = "pl-gift-msg" + (bad ? " bad" : " ok"); };
      if (!code) return say("Type the code first.", true);
      const sb = getSb && getSb(); if (!sb) return say("Create a free account or sign in first, then enter the code.", true);
      b.disabled = true; const { data, error } = await sb.rpc("redeem_code", { c: code }); b.disabled = false;
      if (error) return say(/function|schema cache/i.test(error.message || "") ? "Gift codes aren't switched on yet." : "That didn't go through. Check your internet and try again.", true);
      const r = String(data || "");
      if (r.startsWith("ok:")) { const P = (window.RV_PLANS || []).find(x => x.id === r.slice(3)); say("Done! Your account now has " + (P ? P.name : "the full plan") + " for good."); setTimeout(() => done && done(), 1200); }
      else say({ invalid: "That code doesn't exist or has been switched off.", full: "That code has already been used up.", used: "You've already used this code.", signin: "Sign in first, then enter the code." }[r] || "That code didn't work.", true);
    });
  };
  // ---- the 48-hour welcome deal ----
  // New members get 48 hours from the moment they join (or from when the deal started, for older accounts) to lock in
  // a lower price for their first 3 months: Rider $4.99, Restorer $6.99, Shop $19.99. After 3 months it's the regular price.
  // Checkout uses the plan's regular Stripe link with a promotion code filled in (config: dealCodes, dealFrom, dealHours).
  const DEAL_MONTHS = 3, $ = n => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
  window.RV_DEAL_MONTHS = DEAL_MONTHS; window.rvMoney = $;
  window.rvDeal = function () {
    const c = window.RV_CONFIG || {}; if (!c.dealCodes) return null;
    const hours = c.dealHours || 48, from = Date.parse(c.dealFrom || "") || 0;
    if (!window.RV_JOINED) return { visitor: true, hours };            // not signed in: the clock starts when they join
    const start = Math.max(Date.parse(window.RV_JOINED) || 0, from), end = start + hours * 36e5, left = end - Date.now();
    return left > 0 ? { end, left, hours } : null;
  };
  // "1 day 3 hours", "5 hours 12 min", "14 min"
  window.rvLeftTxt = function (ms) {
    const m = Math.max(0, Math.floor(ms / 6e4)), d = Math.floor(m / 1440), h = Math.floor(m % 1440 / 60), mm = m % 60, pl = (n, w) => n + " " + w + (n === 1 ? "" : "s");
    return d ? pl(d, "day") + (h ? " " + pl(h, "hour") : "") : h ? pl(h, "hour") + (mm ? " " + mm + " min" : "") : Math.max(1, mm) + " min";
  };
  // the price line for upgrade boxes: "Included in Rider · $4.99 a month for 3 months (welcome deal)" or "· $6.99 a month"
  window.rvPriceLine = function (P) {
    if (!P || !P.m) return "";
    const d = rvDeal();
    return d && !d.visitor && P.deal ? ` · <s>${$(P.m)}</s> ${$(P.deal)} a month for ${DEAL_MONTHS} months` : ` · ${$(P.m)} a month`;
  };
  const yrSave = p => Math.round((1 - p.y / (p.m * 12)) * 100);
  // Stripe payment links, one per plan and billing period, set in data/config.json (payLinks: { rider_m, rider_y, ... })
  // plansLive: true for everyone, or "admin" while testing (checkout only for the admin account)
  window.rvPlansLive = () => { const c = window.RV_CONFIG || {}; if (!c.plansLive || !c.payLinks) return false;
    return c.plansLive === "admin" ? String(window.RV_EMAIL || "").toLowerCase() === ADMIN : true; };
  window.rvCheckoutUrl = function (plan, yearly, user) {
    const L = (window.RV_CONFIG && RV_CONFIG.payLinks) || {}, base = L[plan + (yearly ? "_y" : "_m")];
    if (!base || !/^https:\/\/(buy|checkout)\.stripe\.com\//.test(base)) return "";
    const u = new URL(base); if (user && user.id) u.searchParams.set("client_reference_id", user.id); if (user && user.email) u.searchParams.set("prefilled_email", user.email);
    const d = rvDeal(), code = !yearly && d && !d.visitor && (RV_CONFIG.dealCodes || {})[plan];
    if (code) u.searchParams.set("prefilled_promo_code", code);
    return u.toString();
  };
  // the Restorer free trial: a Stripe link with a 30-day trial on the $9.99 plan. A card goes in at the start and is charged on day 31 unless they cancel
  window.rvTrialUrl = function (user) {
    const base = (window.RV_CONFIG && RV_CONFIG.trialLink) || "";
    if (!/^https:\/\/(buy|checkout)\.stripe\.com\//.test(base)) return "";
    const u = new URL(base); if (user && user.id) u.searchParams.set("client_reference_id", user.id); if (user && user.email) u.searchParams.set("prefilled_email", user.email);
    return u.toString();
  };
  // keep any "ends in" countdown on the page ticking; when it runs out, reload so regular prices show
  setInterval(() => document.querySelectorAll("[data-deal-end]").forEach(el => {
    const left = +el.dataset.dealEnd - Date.now(), b = el.querySelector("[data-deal-left]");
    if (left <= 0) { el.removeAttribute("data-deal-end"); el.textContent = "The welcome deal has ended"; return; }
    if (b) b.textContent = rvLeftTxt(left);
  }), 30000);
  window.rvPlansHtml = function (opts = {}) {
    const yearly = !!opts.yearly, cur = opts.current || "", live = rvPlansLive(), mode = opts.mode || "view";   // view | choose
    const deal = rvDeal();
    const price = p => p.m === 0 ? `<b>$0</b><span>forever</span>` : yearly
      ? `<b>${$(p.y)}</b><span>a year · ${$(+(p.y / 12).toFixed(2))} a month</span><em class="pl-off yr">Save ${yrSave(p)}% vs monthly</em>`
      : deal && p.deal
        ? `<s>${$(p.m)}</s><b>${$(p.deal)}</b><span>a month for your first ${DEAL_MONTHS} months, then ${$(p.m)}</span>`
        : `<b>${$(p.m)}</b><span>a month</span>`;
    const act = p => {
      if (cur === p.id) return `<span class="pl-cur">Your plan${opts.comp ? " · gifted" : opts.paid ? "" : opts.until && p.id !== "free" ? " until " + e(new Date(opts.until).toLocaleDateString("en-US", { month: "short", day: "numeric" })) : ""}</span>${opts.paid && RV_CONFIG.billingPortal ? `<a class="pl-manage" data-manage href="${e(RV_CONFIG.billingPortal)}" target="_blank" rel="noopener">Manage billing or cancel</a>` : ""}`;
      // gifted: everything up to their plan is included, nothing to buy
      if (opts.comp) return RANK[p.id] <= RANK[cur] ? `<button class="btn" disabled>Included</button>` : `<span class="faint" style="font-size:13px">Not in your gift</span>`;
      // already paying: changes go through Stripe's billing page so nobody ends up with two subscriptions
      if (opts.paid && RV_CONFIG.billingPortal) return p.id === "free" ? `<button class="btn" disabled>Included</button>` : `<a class="btn" data-manage href="${e(RV_CONFIG.billingPortal)}" target="_blank" rel="noopener">Switch to ${e(p.name)}</a>`;
      if (p.id === "free") return mode === "choose" ? `<button class="btn" data-pl-pick="free">Start free</button>` : `<button class="btn" disabled>Included</button>`;
      if (p.trial && !opts.trialUsed && !opts.paid) return `<button class="btn tan" data-pl-pick="trial">Start ${p.trial}-day free trial</button><small class="pl-then">Then ${$(p.m)} a month. Cancel any time.</small>${live && deal && !deal.visitor && !yearly && p.deal ? `<button class="btn" data-pl-pick="${p.id}">Or pay ${$(p.deal)} a month for ${DEAL_MONTHS} months</button>` : ""}`;
      return live ? `<button class="btn ${p.best ? "tan" : "pri"}" data-pl-pick="${p.id}">Choose ${e(p.name)}</button>` : `<button class="btn" disabled title="Checkout opens soon">Checkout opens soon</button>`;
    };
    return `<div class="pl">
      ${opts.paid || opts.comp ? "" : deal && deal.visitor ? `<div class="pl-deal">Welcome deal: join and you have ${deal.hours} hours to lock in a lower price for your first ${DEAL_MONTHS} months</div>`
        : deal ? `<div class="pl-deal" data-deal-end="${deal.end}">Welcome deal ends in <b data-deal-left>${rvLeftTxt(deal.left)}</b></div>` : ""}
      <div class="pl-tog seg" role="group" aria-label="Billing"><button class="${yearly ? "" : "on"}" data-pl-bill="m">Monthly</button><button class="${yearly ? "on" : ""}" data-pl-bill="y">Yearly <small>save more</small></button></div>
      <div class="pl-grid">${PLANS.map(p => `<article class="pl-card ${p.color}${p.best ? " best" : ""}${cur === p.id ? " cur" : ""}">
        ${p.best ? `<span class="pl-best">Most popular${p.trial ? " · " + p.trial + " days free" : ""}</span>` : ""}<div class="pl-top"><h3>${e(p.name)}</h3><span class="pl-tag">${e(p.tag)}</span></div>
        <div class="pl-price">${price(p)}</div>
        <ul>${p.feats.map(f => `<li>${e(f)}</li>`).join("")}</ul>
        <div class="pl-act">${act(p)}</div>
      </article>`).join("")}</div>
      ${live || mode !== "choose" ? "" : `<p class="pl-note">Paid checkout opens soon. Start free, or take the Restorer trial and get everything for a month.</p>`}
      ${opts.comp ? "" : rvGiftHtml()}
      <div class="pl-faq">
        <div><b>What happens to my records if I change plans?</b><span>Nothing is ever deleted. On a smaller plan, features you don't have stay visible and your records stay safe until you upgrade again.</span></div>
        <div><b>Can I cancel any time?</b><span>Yes. You keep the paid features until the end of the month or year you paid for. Payments are handled by Stripe, and Revora never sees your card.</span></div>
        <div><b>How does the welcome deal work?</b><span>For ${(window.RV_CONFIG || {}).dealHours || 48} hours after you join, Rider is $4.99, Restorer $6.99 and Shop $19.99 a month for your first ${DEAL_MONTHS} months. After that it's the regular price: $6.99, $9.99 or $29 a month. Yearly plans aren't part of the deal, but they save 17 to 42% over paying monthly at the regular price.</span></div>
        <div><b>How does the Restorer trial work?</b><span>You get every Restorer feature free for 30 days. You add a card when you start, and it's charged $9.99 on day 31 unless you cancel before then. Cancel in one click from Manage billing.</span></div>
      </div></div>`;
  };
})();
