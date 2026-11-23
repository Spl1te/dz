// Робота без інтернету: спершу мережа, а якщо її немає — остання збережена копія.
// Кешуються сторінка, код, стилі, іконки й дані (data/*.json). Адмінка, ГДЗ і PDF — ні.
const CACHE = "dz-v3";
const SHELL = ["./", "app.js", "style.css", "manifest.json", "icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function cacheable(url) {
  if (url.origin !== location.origin) return false;
  const p = url.pathname;
  if (p.startsWith("/api/") || p.startsWith("/books/") || p.startsWith("/gdz/")) return false;
  return p === "/" || p.endsWith(".html") || p.endsWith(".js") || p.endsWith(".css") || p.endsWith(".json")
    || p.startsWith("/icons/") || p.startsWith("/vendor/");
}

const isStatic = (url) => /\.(js|css|png|svg|woff2|json)$/.test(url.pathname) && !url.pathname.startsWith("/data/")
  || url.pathname === "/" || url.pathname.endsWith(".html");

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!cacheable(url)) return;
  const key = url.origin + url.pathname; // без ?t=… — щоб знаходити збережену копію
  const fresh = fetch(req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(key, copy)).catch(() => {});
    }
    return res;
  });
  if (isStatic(url) || req.mode === "navigate") {
    // код, стилі й сторінка: одразу з памʼяті, а свіжу версію тягнемо у фоні (наступне відкриття — вже з нею)
    e.respondWith(caches.match(key).then((hit) => hit || fresh).catch(() => fresh));
    e.waitUntil(fresh.catch(() => {}));
    return;
  }
  // дані: спершу мережа, без мережі — збережена копія з позначкою
  e.respondWith(fresh.catch(async () => {
    const hit = await caches.match(key);
    if (!hit) return Response.error();
    const h = new Headers(hit.headers);
    h.set("X-Offline", "1");
    return new Response(await hit.blob(), { status: 200, headers: h });
  }));
});

// натиск на нагадування — відкрити сайт на потрібному предметі
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    for (const c of cs) if ("focus" in c) { c.navigate(url).catch(() => {}); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
