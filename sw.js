// Bayān Kids – service worker: prima la rete (così si vede sempre l'ultima versione), la copia salvata solo senza internet.
const CACHE = "bayan-kids-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    e.respondWith(fetch(new Request(u.href.split("#")[0], {cache: "no-store", credentials: "same-origin"}))
      .then(res => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(u.pathname, cp)); } return res; })
      .catch(() => caches.match(u.pathname).then(m => m || caches.match(location.pathname.replace(/sw\.js$/, "")))));
    return;
  }
  // caratteri e testi del Corano: copia salvata, aggiornata in rete
  if (/fonts\.(googleapis|gstatic)\.com$|^cdn\.jsdelivr\.net$/.test(u.host)) {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })));
  }
});
