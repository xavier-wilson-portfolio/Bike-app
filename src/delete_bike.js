/* ============ Settings: delete this bike (or take a shared one out of your garage) ============ */
(function () {
  const r0 = VIEWS.settings.render, b0 = VIEWS.settings.bind;
  VIEWS.settings.render = function () {
    const html = r0.apply(this, arguments), C = window.RV_CLOUD, own = !C || C.role === "owner";
    const panel = `<div class="panel stack" style="border-color:var(--red)"><h2 class="sec" style="color:var(--red)">${own ? "Delete this bike" : "Remove from my garage"}</h2>
      <p style="margin:0;font-size:13px">${own ? `Deletes ${esc(BIKE.name)} and everything in it: services, parts, mods, receipts, photos and reminders.${C ? " Anyone you shared it with loses it too." : " It's only saved in this browser, so this clears it here."} It can't be undone, so download a full backup above first if you might want it back.` : "The owner keeps the bike and everything in it. You can be added back any time."}</p>
      <div><button class="btn danger" id="delBike">${own ? "Delete this bike…" : "Remove it…"}</button></div></div>`;
    const i = html.lastIndexOf("</div>\n    </div>");
    return i > 0 ? html.slice(0, i) + panel + html.slice(i) : html + panel;
  };
  VIEWS.settings.bind = function (root) {
    b0.apply(this, arguments);
    const btn = $("#delBike"); if (!btn) return;
    btn.onclick = () => {
      const C = window.RV_CLOUD;
      if (C && window.rvDeleteProject) return rvDeleteProject({ id: C.projectId, role: C.role, label: C.projectName || BIKE.name, members: 1 }, () => rvGoGarage());
      modal(`<h3>Delete ${esc(BIKE.name)}?</h3><p style="margin:0">Everything for this bike in this browser is erased. Type <b>DELETE</b> to confirm.</p><input id="dlLocal" autocomplete="off" aria-label="Type DELETE"><div class="row"><button class="btn" data-x>Cancel</button><button class="btn danger" data-ok>Delete for good</button></div>`, md => {
        md.querySelector("[data-x]").onclick = closeModal;
        md.querySelector("[data-ok]").onclick = () => {
          if ($("#dlLocal").value.trim().toUpperCase() !== "DELETE") { toast("Type DELETE to confirm.", "err"); return; }
          try { localStorage.removeItem(DATA_KEY); if (localStorage.getItem("rv.bike") === BIKE.id) localStorage.removeItem("rv.bike"); } catch (e) {}
          location.href = location.pathname + "?pick=1";
        };
      });
    };
  };
})();
