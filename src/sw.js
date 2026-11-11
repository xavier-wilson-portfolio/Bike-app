/* Revora service worker: keeps the app shell so the installed app opens fast and starts offline.
   Your project data always comes live from your account; nothing private is cached here. */
const V = "revora-__BUILD__";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./img/revora-icon.svg", "./img/revora-word.svg", "./img/app-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("revora-") && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;            // accounts, AI and NHTSA always go to the network
  if (r.mode === "navigate") {                                              // pages: network first, the saved shell when offline
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put("./index.html", c)); return res; }).catch(() => caches.match("./index.html")));
    return;
  }
  if (/\/(app\.js|img\/|packs\/[^/]+\/pack\.json|packs\/index\.json)/.test(u.pathname)) {   // versioned files: cache, refresh in the background
    e.respondWith(caches.open(V).then(c => c.match(r).then(hit => { const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit); return hit || net; })));
  }
});

// notifications: a shop telling a customer their bike is checked in or ready
self.addEventListener("push", e => {
  let m = {}; try { m = e.data ? e.data.json() : {}; } catch (x) { m = { title: "Revora", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(m.title || "Revora", { body: m.body || "", icon: "./img/app-192.png", tag: m.tag || undefined, renotify: !!m.tag, data: { url: m.url || "./" } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(ws => {
    const w = ws.find(x => x.url.startsWith(self.location.origin));
    if (w) return w.navigate(url).then(x => (x || w).focus()).catch(() => w.focus());
    return self.clients.openWindow(url);
  }));
});
