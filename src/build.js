/* ============ Build page: a public page for the bike, with photos, story, mods and a timeline ============ */
GUIDE.build = { eyebrow: "Share", title: "Build page", sub: "A public page for your bike that you can post on forums, Instagram or Facebook.",
  how: ["Pick your best photos. The first one is the cover.", "Write a few lines about the bike and choose what to show.", "Publish it and share the link. Update it any time and the link stays the same."] };
const BP_OPTS = () => Object.assign({ title: "", story: "", photos: [], caps: {}, mods: true, timeline: true, restoration: true, money: false, odo: true, name: true, ba: true }, meta().buildPage || {});
const bpImgs = () => sorted("docs").filter(d => d.file && /^data:image\//.test(d.file) && d.kind !== "Receipt").sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
const bpCap = (d, o) => { const c = (o.caps || {})[d.id]; if (c != null) return c; const t = d.caption || d.title || ""; return /^(img|dsc|pxl|image|photo|screenshot|whatsapp|\d{6,})[\W_]?/i.test(t) ? "" : t; };
const bpUrl = id => location.origin + location.pathname + "?build=" + id;

function shrinkImg(src, maxBytes = 130000, max = 1400) {
  return new Promise(res => {
    if ((src.length * .75) < maxBytes) return res(src);
    const im = new Image(); im.onload = () => {
      const cv = document.createElement("canvas"); let q = .78, out = src, m = max;
      for (let i = 0; i < 8; i++) { const s = Math.min(1, m / Math.max(im.width, im.height)); cv.width = Math.round(im.width * s); cv.height = Math.round(im.height * s);
        cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height); out = cv.toDataURL("image/jpeg", q); if (out.length * .75 < maxBytes) break; if (q > .5) q -= .1; else m = Math.round(m * .8); }
      res(out);
    }; im.onerror = () => res(""); im.src = src;
  });
}

// the page's data: plain values only, so it can go on a public link
function buildData(o, forPublish) {
  const m = meta(), all = bpImgs(), byId = Object.fromEntries(all.map(d => [d.id, d]));
  const picked = (o.photos || []).map(id => byId[id]).filter(Boolean).slice(0, 12);
  const photos = picked.map(d => ({ id: d.id, src: d.file, cap: bpCap(d, o), date: d.date || "", kind: d.kind || "" }));
  const before = all.find(d => d.kind === "Before photo"), after = all.find(d => d.kind === "After photo");
  const mods = o.mods && typeof modsInstalled === "function" ? modsInstalled().sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 40).map(x => ({ name: x.name, brand: x.brand || "", replaced: x.replaced || "", cost: o.money ? modCost(x) : 0, date: x.date || "" })) : [];
  const done = svcDone();
  let restoration = null, pct = null;
  if (!GENERIC && o.restoration && sorted("phases").length && sorted("tasks").length) {
    pct = Math.round(overallProgress() * 100);
    restoration = { pct, parts: sorted("phases").map(p => { const st = phaseStats(p); return { title: (LESSONS[p.id] && LESSONS[p.id].title) || p.name, done: st.done, total: st.total }; }) };
  }
  const tl = [];
  if (o.timeline) {
    done.forEach(r => tl.push({ date: r.date, kind: "service", t: r.service || "Service" }));
    modsInstalled().filter(x => x.date).forEach(x => tl.push({ date: x.date, kind: "mod", t: "Fitted " + (x.brand ? x.brand + " " : "") + x.name }));
    photos.filter(p => p.date && p.cap).forEach(p => tl.push({ date: p.date, kind: "photo", t: p.cap }));
    if (!GENERIC && m.roadReady && m.roadReadyDate) tl.push({ date: m.roadReadyDate, kind: "mile", t: "Back on the road" });
  }
  tl.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const dates = tl.map(t => t.date).concat(photos.map(p => p.date), done.map(r => r.date)).filter(Boolean).sort();
  const od = odoNow(), SN = { standard: "Standard", cruiser: "Cruiser", sport: "Sport", adventure: "Adventure", dualsport: "Dual-sport", touring: "Touring", cafe: "Cafe racer", scooter: "Scooter" };
  const invested = (o.money ? modsInstalled().reduce((s, x) => s + modCost(x), 0) + done.reduce((s, r) => s + svcCost(r), 0) : 0);
  return { v: 1, made: today(), title: String(o.title || "").trim().slice(0, 120) || m.bike || BIKE.name, story: String(o.story || "").slice(0, 4000),
    status: GENERIC ? "" : m.roadReady ? "Finished restoration" : "Restoration in progress",
    ownerName: o.name && window.RV_CLOUD ? String((RV_CLOUD.profile && RV_CLOUD.profile.display_name) || "").split(/\s+/)[0] : "",
    bike: { name: m.bike || BIKE.name, styleName: SN[BIKE.style] || BIKE.styleName || "", sil: silImg(BIKE.silhouette || "bike-" + (BIKE.style || "standard")) || "" },
    photos, beforeAfter: o.ba && before && after ? { before: before.file, after: after.file } : null,
    stats: { started: dates[0] || "", pct, odo: o.odo && od ? od.miles : 0, mods: modsInstalled().length, services: done.length, photos: all.length, invested },
    mods, restoration, timeline: tl.slice(0, 40), opts: { money: !!o.money }, likes: 0, views: 0 };
}
async function buildDataForPublish(o) {
  const d = buildData(o);
  for (const p of d.photos) p.src = await shrinkImg(p.src, p === d.photos[0] ? 220000 : 130000);
  d.photos = d.photos.filter(p => p.src).map(({ id, ...p }) => p);
  if (d.beforeAfter) { d.beforeAfter.before = await shrinkImg(d.beforeAfter.before, 150000, 1200); d.beforeAfter.after = await shrinkImg(d.beforeAfter.after, 150000, 1200); }
  delete d.likes; delete d.views;
  return d;
}

let BP_ROW = null, BP_ERR = "";
async function loadBuildRow() {
  if (!window.RV_CLOUD) return;
  const { data, error } = await RV_CLOUD.sb.from("shared_builds").select("id,owner,views,likes,created_at,updated_at").eq("project_id", RV_CLOUD.projectId).maybeSingle();
  BP_ROW = error ? false : data || false; BP_ERR = error ? (/does not exist|schema cache/i.test(error.message || "") ? "setup" : "load") : "";
  if (R.sec === "build") render(false);
}

VIEWS.build = {
  render() {
    const o = BP_OPTS(), W = ME.canWrite, cloud = !!window.RV_CLOUD, imgs = bpImgs(), d = buildData(o);
    if (cloud && BP_ROW === null) { BP_ROW = false; loadBuildRow(); }
    const live = cloud && BP_ROW, mine = live && RV_CLOUD.user && BP_ROW.owner === RV_CLOUD.user.id;
    if (live) { d.likes = BP_ROW.likes; d.views = BP_ROW.views; }
    const tog = (k, label, sub) => `<label class="rp-opt"><input type="checkbox" data-bo="${k}" ${o[k] ? "checked" : ""} ${W ? "" : "disabled"}><span><b>${label}</b>${sub ? `<small>${sub}</small>` : ""}</span></label>`;
    const sel = o.photos || [], hasBA = imgs.some(x => x.kind === "Before photo") && imgs.some(x => x.kind === "After photo");
    return `<div class="ph" data-own="1"><div class="eyebrow">Share</div><h1>Build page</h1><p>A public page for your bike that you can post on forums, Instagram or Facebook.</p>
        <div class="act">${live ? `<button class="btn" id="bpCopy">${ic("copy")} Copy link</button><a class="btn" href="${esc(bpUrl(BP_ROW.id))}" target="_blank" rel="noopener">Open page</a>${mine && W ? `<button class="btn pri" id="bpPub">${ic("send")} Update page</button>` : ""}` : cloud && W ? `<button class="btn pri" id="bpPub">${ic("send")} Publish page</button>` : ""}</div></div>
      ${live ? `<div class="bp-status"><span class="bp-dot"></span><b>Live</b><span class="faint">${n(BP_ROW.views)} view${n(BP_ROW.views) === 1 ? "" : "s"} · ${n(BP_ROW.likes)} like${n(BP_ROW.likes) === 1 ? "" : "s"} · updated ${esc(fmtDate(String(BP_ROW.updated_at || BP_ROW.created_at).slice(0, 10)))}</span>${mine && W ? `<button class="linkbtn" id="bpStop">Stop sharing</button>` : ""}<span class="grow"></span><span class="faint">Changes here show on the page after you press Update page.</span></div>` : ""}
      ${BP_ERR === "setup" ? `<div class="callout">Build pages need a one-time setup in the database before they can be published. You can still set up the page and preview it.</div>` : ""}
      <div class="rp-grid bp-grid">
        <aside class="rp-side stack">
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("edit")}</span>Title and story</h2></div>
            <label class="bp-f"><b>Title</b><input id="bpTitle" maxlength="120" value="${esc(o.title)}" placeholder="${esc(meta().bike || BIKE.name)}" ${W ? "" : "disabled"}></label>
            <label class="bp-f"><b>The story</b><textarea id="bpStory" rows="6" maxlength="4000" placeholder="How you found it, what it needed, what you changed, what's next." ${W ? "" : "disabled"}>${esc(o.story)}</textarea><small class="faint">Leave a blank line between paragraphs.</small></label>
          </section>
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("image")}</span>Photos</h2>${W ? `<button class="btn sm" id="bpAdd">${ic("plus")} Add photos</button>` : ""}</div>
            ${imgs.length ? `<p class="faint" style="margin:0 0 8px;font-size:13px">Tap photos to put them on the page, up to 12. The first is the cover.</p>
              <div class="bp-pick">${imgs.map(x => { const i = sel.indexOf(x.id); return `<button class="${i >= 0 ? "on" : ""}" data-bp-pick="${esc(x.id)}" ${W ? "" : "disabled"} aria-pressed="${i >= 0}" title="${esc(bpCap(x, o) || x.kind || "")}"><img src="${x.file}" alt="" loading="lazy">${i >= 0 ? `<span>${i === 0 ? "Cover" : i + 1}</span>` : ""}</button>`; }).join("")}</div>
              ${sel.length ? `<div class="bp-caps">${sel.map(id => imgs.find(x => x.id === id)).filter(Boolean).map(x => `<label><img src="${x.file}" alt=""><input data-bp-cap="${esc(x.id)}" maxlength="140" value="${esc(bpCap(x, o))}" placeholder="Caption (optional)" ${W ? "" : "disabled"}></label>`).join("")}</div>` : ""}`
              : `<p class="muted" style="margin:0">No photos yet. Add a few of the bike, before and after if you have them.</p>`}
          </section>
          <section class="mh-panel"><div class="mh-ph"><h2><span class="mh-hi">${ic("gear")}</span>What to show</h2></div>
            ${tog("mods", "Mods and upgrades", "Parts you've fitted")}${tog("timeline", "Build timeline", "Services, mods and photos by date")}${!GENERIC ? tog("restoration", "Restoration progress", "How far through the course you are") : ""}
            ${hasBA ? tog("ba", "Before and after slider", "Uses your first Before photo and After photo") : ""}${tog("odo", "Odometer", "Current miles")}${tog("money", "Money spent", "Off by default. Shows what the mods and services cost")}${cloud ? tog("name", "Your first name", "Shown as who built it") : ""}
          </section>
          ${!cloud ? `<section class="mh-panel"><p class="muted" style="margin:0">Create a free account to publish this page and share the link.</p></section>` : ""}
        </aside>
        <div class="bp-prev"><div class="bp-prev-k">Preview</div>${rvBuildHtml(d, { preview: true })}</div>
      </div>`;
  },
  bind(root) {
    const save = async patch => { const mm = clone(meta()); mm.buildPage = Object.assign(BP_OPTS(), patch); await store.put("meta", mm, { noLog: true }); };
    $$("[data-bo]", root).forEach(c => c.onchange = () => save({ [c.dataset.bo]: c.checked }));
    const t = $("#bpTitle", root), s = $("#bpStory", root);
    if (t) t.onchange = () => save({ title: t.value.trim() });
    if (s) s.onchange = () => save({ story: s.value });
    $$("[data-bp-pick]", root).forEach(b => b.onclick = () => {
      const p = (BP_OPTS().photos || []).slice(), id = b.dataset.bpPick, i = p.indexOf(id);
      if (i >= 0) p.splice(i, 1); else { if (p.length >= 12) return toast("You can put up to 12 photos on the page.", "err"); p.push(id); }
      save({ photos: p });
    });
    $$("[data-bp-cap]", root).forEach(c => c.onchange = () => save({ caps: Object.assign({}, BP_OPTS().caps, { [c.dataset.bpCap]: c.value.trim() }) }));
    const add = $("#bpAdd", root); if (add) add.onclick = () => uploadPhotos({ kind: "After photo" });
    const sb = window.RV_CLOUD && RV_CLOUD.sb, fail = er => toast(/does not exist|schema cache/i.test(er && er.message || "") ? "Build pages aren't set up in the database yet." : /too large|size|check constraint/i.test(er && er.message || "") ? "The page is too big. Try fewer photos." : "Couldn't save the page. Check your internet and try again.", "err");
    const copy = async () => { const u = bpUrl(BP_ROW.id); try { await navigator.clipboard.writeText(u); toast("Link copied."); } catch (e) { prompt("Copy this link:", u); } };
    const cp = $("#bpCopy", root); if (cp) cp.onclick = copy;
    const pub = $("#bpPub", root);
    const publish = async () => {
      const o = BP_OPTS(), wasLive = !!BP_ROW; pub.disabled = true; pub.textContent = "Publishing…";
      const data = await buildDataForPublish(o), title = data.title;
      let error;
      if (BP_ROW) ({ error } = await sb.from("shared_builds").update({ data, title, updated_at: new Date().toISOString() }).eq("id", BP_ROW.id));
      else {
        const id = repToken(); ({ error } = await sb.from("shared_builds").insert({ id, project_id: RV_CLOUD.projectId, title, data }));
        if (error && /duplicate|unique/i.test(error.message || "")) { toast("Someone on this project already published a build page for it.", "err"); loadBuildRow(); return; }
        if (!error) { BP_ROW = { id }; try { await navigator.clipboard.writeText(bpUrl(id)); } catch (e) {} }
      }
      if (error) { render(false); return fail(error); }
      toast(wasLive ? "Page updated." : "Your build page is live. The link is copied, ready to share.");
      loadBuildRow();
    };
    if (pub) pub.onclick = () => (BP_OPTS().photos || []).length ? publish()
      : confirmBox("Publish without photos?", "<p style='margin:0'>Pages with photos get a lot more views. You can add some first, or publish now and add them later.</p>", "Publish anyway", publish, false);
    const stop = $("#bpStop", root);
    if (stop) stop.onclick = () => confirmBox("Stop sharing this page?", "<p style='margin:0'>The link will stop working. Your photos and settings stay here, and you can publish again later with a new link.</p>", "Stop sharing", async () => {
      const { error } = await sb.from("shared_builds").delete().eq("id", BP_ROW.id); if (error) return fail(error); BP_ROW = false; toast("Page stopped."); render(false);
    });
  }
};
