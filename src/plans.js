/* ============ Plans page in the app ============ */
VIEWS.plans = {
  render() {
    const cur = (window.RV_CLOUD && RV_CLOUD.profile && RV_CLOUD.profile.plan) || "free";
    return `<div class="ph" data-own="1"><div class="eyebrow">Your account</div><h1>Plans</h1><p>Start free with one bike. Upgrade when you want AI receipts, email reminders, share links, restoration courses or a team.</p></div>${rvPlansHtml({ yearly: !!R.f.plYear, current: cur === "pro" ? "rider" : cur })}`;
  },
  bind(root) {
    $$("[data-pl-bill]", root).forEach(b => b.onclick = () => { R.f.plYear = b.dataset.plBill === "y"; render(false); });
    $$("[data-pl-pick]", root).forEach(b => b.onclick = () => toast("Payments aren't switched on yet.", "err"));
  }
};
