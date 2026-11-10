/* ============ A shop's client bike opened in the full bike page ============
   A bar back to Revora Shop, and the client's reminder emails kept in step with anything changed here. */
try { const s = sessionStorage.getItem("rv.secOpen"); if (s && SEC[s]) { sessionStorage.removeItem("rv.secOpen"); R.sec = s; } } catch (e) {}
(function () {
  const C = window.RV_CLOUD; if (!C || !C.shopId) return;
  const bar = () => {
    if (document.querySelector(".shopbike-bar")) return;
    const cu = (meta() && meta().customer) || {}, d = document.createElement("div"); d.className = "demo-bar guest-bar shopbike-bar";
    d.innerHTML = `<span><b>Client bike</b>${cu.name ? " · " + esc(cu.name) : ""}</span><a class="btn sm tan" href="?crm${C.shopClient ? "&t=client&id=" + encodeURIComponent(C.shopClient) : ""}">Back to the shop</a>`;
    document.body.appendChild(d);
  };
  // work orders print the shop's details: fill them in from Revora Shop the first time
  if (typeof SHOP === "function" && !SHOP().name) C.sb.rpc("my_shop").then(({ data }) => { if (data && !SHOP().name) setShop({ name: data.name || "", address: data.address || "", phone: data.phone || "", email: data.email || "" }); if (R.sec === "workorders") render(false); }, () => {});
  let t = null, last = "";
  async function sync() {
    if (!store.ready || !window.rvDue || !C.shopClient) return;
    const arr = c => Object.values(S[c] || {});
    const due = rvDue.compute({ schedule: arr("schedule"), maintenance: arr("maintenance"), mileage: arr("mileage"), fuel: arr("fuel") });
    const name = (meta() && meta().bike) || BIKE.name || C.projectName || "Bike", rows = rvDue.reminderRows(due, name);
    const sig = JSON.stringify(rows); if (sig === last) return;
    const del = await C.sb.from("shop_reminders").delete().eq("project_id", C.projectId).is("sent_at", null); if (del.error) return;
    if (rows.length) {
      const { data: sent } = await C.sb.from("shop_reminders").select("item_key,due_on").eq("project_id", C.projectId).not("sent_at", "is", null);
      const done = new Set((sent || []).map(r => r.item_key + "|" + r.due_on));
      const fresh = rows.filter(r => !done.has(r.item_key + "|" + r.due_on)).map(r => Object.assign(r, { shop_id: C.shopId, client_id: C.shopClient, project_id: C.projectId }));
      if (fresh.length) { const ins = await C.sb.from("shop_reminders").insert(fresh); if (ins.error) return; }
    }
    last = sig;
  }
  const base = render;
  render = function (full) { base(full); bar(); if (ME.canWrite) { clearTimeout(t); t = setTimeout(() => sync().catch(() => {}), 3000); } };
})();
