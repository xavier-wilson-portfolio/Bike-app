/* ============ QR sticker for the bike: scan it and see the build page or the service history ============ */
let QR_LIB = null;
const qrLib = () => QR_LIB || (QR_LIB = new Promise((res, rej) => { if (window.qrcode) return res(window.qrcode); const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"; s.onload = () => window.qrcode ? res(window.qrcode) : rej(new Error("no qr")); s.onerror = () => { QR_LIB = null; rej(new Error("offline")); }; document.head.appendChild(s); }));
async function qrSvg(text) { const q = (await qrLib())(0, "M"); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }
function stickerLinks() {
  const out = [];
  if (typeof BP_ROW !== "undefined" && BP_ROW && BP_ROW.id) out.push({ k: "build", t: "Build page", d: "Photos, story, mods and progress", url: bpUrl(BP_ROW.id) });
  if (typeof REP_LINKS !== "undefined" && Array.isArray(REP_LINKS) && REP_LINKS[0]) out.push({ k: "report", t: "Service history", d: "Every service with dates and miles, for a buyer or a shop", url: repUrl(REP_LINKS[0].id) });
  return out;
}
async function stickerBox() {
  if (!window.RV_CLOUD) { toast("Create a free account to make a sticker.", "err"); return; }
  if (typeof loadBuildRow === "function" && (typeof BP_ROW === "undefined" || BP_ROW === null || BP_ROW === false)) await loadBuildRow();
  if (typeof loadRepLinks === "function" && (typeof REP_LINKS === "undefined" || !REP_LINKS || !REP_LINKS.length)) await loadRepLinks();
  const L = stickerLinks(), name = (meta().bike || BIKE.name);
  if (!L.length) { modal(`<div class="stk"><h2 style="margin:0">A QR sticker for your bike</h2><p>Stick it under the seat or in the garage. Anyone who scans it sees your bike's page, so a buyer can check the history in seconds.</p>
      <p class="muted">First publish a build page (free) or share the history report as a link. Then come back here.</p>
      <div class="row" style="justify-content:flex-end;gap:8px"><button class="btn" data-x>Close</button><button class="btn pri" data-goto="build">Make a build page</button></div></div>`, m => { m.querySelector("[data-x]").onclick = closeModal; m.querySelector("[data-goto]").addEventListener("click", closeModal); }); return; }
  let pick = L[0];
  const draw = async m => { const box = m.querySelector("#stkPrev"); try { box.innerHTML = stickerHtml(await qrSvg(pick.url), name, pick); } catch (e) { box.innerHTML = `<p class="muted">Couldn't make the QR code. Check your internet and try again.</p>`; } };
  modal(`<div class="stk"><h2 style="margin:0">A QR sticker for your bike</h2><p class="muted" style="margin:4px 0 12px">Print it on sticker paper (or plain paper and clear tape). Put one under the seat, on the toolbox, or in the garage. Scanning it opens the page below, and it always shows the latest version.</p>
    ${L.length > 1 ? `<div class="imp-ways">${L.map((x, i) => `<button type="button" class="imp-way${i ? "" : " on"}" data-stk="${x.k}">${ic(x.k === "build" ? "image" : "book")}<b>${x.t}</b><small>${x.d}</small></button>`).join("")}</div>` : ""}
    <div id="stkPrev" class="stk-prev"></div>
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:10px"><button class="btn" data-x>Close</button><button class="btn" data-stk-copy>${ic("copy")} Copy link</button><button class="btn pri" data-stk-print>Print a sheet of 6</button></div></div>`, m => {
    m.querySelector("[data-x]").onclick = closeModal;
    m.querySelectorAll("[data-stk]").forEach(b => b.onclick = () => { pick = L.find(x => x.k === b.dataset.stk); m.querySelectorAll("[data-stk]").forEach(x => x.classList.toggle("on", x === b)); draw(m); });
    m.querySelector("[data-stk-copy]").onclick = async () => { try { await navigator.clipboard.writeText(pick.url); toast("Link copied."); } catch (e) { prompt("Copy this link:", pick.url); } };
    m.querySelector("[data-stk-print]").onclick = async () => { let svg; try { svg = await qrSvg(pick.url); } catch (e) { return toast("Couldn't make the QR code.", "err"); }
      const one = stickerHtml(svg, name, pick), f = document.createElement("iframe"); f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0"; document.body.appendChild(f);
      f.contentDocument.write(`<!doctype html><html><head><meta charset="utf-8"><title>Revora sticker</title><style>${STICKER_CSS}@page{margin:0.5in}body{margin:0;font-family:Arial,Helvetica,sans-serif}.sheet{display:grid;grid-template-columns:repeat(2,3in);gap:.35in;justify-content:center}</style></head><body><div class="sheet">${Array(6).fill(one).join("")}</div></body></html>`);
      f.contentDocument.close(); setTimeout(() => { f.contentWindow.focus(); f.contentWindow.print(); setTimeout(() => f.remove(), 2000); }, 400); };
    draw(m);
  });
}
const STICKER_CSS = `.stk-card{width:3in;height:3in;box-sizing:border-box;border:2px solid #17232C;border-radius:.18in;padding:.16in;display:flex;flex-direction:column;align-items:center;justify-content:space-between;background:#fff;color:#17232C;font-family:Arial,Helvetica,sans-serif}
.stk-card .stk-k{font-size:9pt;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#8a6f3f}.stk-card .stk-qr{width:1.75in;height:1.75in}.stk-card .stk-qr svg{width:100%;height:100%;display:block}
.stk-card b{font-size:11pt;text-align:center;line-height:1.15;max-width:2.6in;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.stk-card small{font-size:7.5pt;color:#555}`;
function stickerHtml(svg, name, pick) { return `<div class="stk-card"><span class="stk-k">${pick.k === "report" ? "Scan for service history" : "Scan to see this build"}</span><div class="stk-qr">${svg}</div><b>${esc(name)}</b><small>Kept on Revora · revoragarage.com</small></div>`; }
document.addEventListener("click", e => { const b = e.target.closest("[data-sticker]"); if (!b) return; e.preventDefault(); stickerBox(); });
(function () {
  const add = (v, sel) => { if (!v) return; const b0 = v.bind; v.bind = function (root) { b0.call(this, root); const a = root.querySelector(sel); if (a && !a.querySelector("[data-sticker]") && window.RV_CLOUD) a.insertAdjacentHTML("afterbegin", `<button class="btn" data-sticker>${ic("qr")} QR sticker</button>`); }; };
  add(VIEWS.build, ".act"); add(VIEWS.report, ".act");
})();
