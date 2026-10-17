/* ============ Plans page in the app ============ */
VIEWS.plans = {
  render() {
    const P = planNow();
    return `<div class="ph" data-own="1"><div class="eyebrow">Your account</div><h1>Plans</h1><p>${P.admin ? "You're the admin, so every feature is on for you." : P.trial ? "You're on the Restorer free trial." : P.paid ? "Thanks for being a paying member." : "Start free with one bike. Upgrade for reminders, recalls, AI receipts, restoration courses and more."}</p></div>
      ${rvPlansHtml({ yearly: !!R.f.plYear, current: P.id, until: P.until, trialUsed: P.trialUsed || !window.RV_CLOUD, paid: P.paid })}`;
  },
  bind(root) {
    rvBindManage(root, async () => window.RV_CLOUD && (await RV_CLOUD.sb.auth.getSession()).data.session?.access_token);
    $$("[data-pl-bill]", root).forEach(b => b.onclick = () => { R.f.plYear = b.dataset.plBill === "y"; render(false); });
    $$("[data-pl-pick]", root).forEach(b => b.onclick = () => { if (b.dataset.plPick === "trial") startTrial(); else { const u = window.RV_CLOUD && rvCheckoutUrl(b.dataset.plPick, !!R.f.plYear, RV_CLOUD.user); if (u) location.href = u; else toast(window.RV_CLOUD ? "Checkout opens soon." : "Create a free account first.", "err"); } });
  }
};
