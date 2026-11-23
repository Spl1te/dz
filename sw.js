// Робота без інтернету: спершу мережа, а якщо її немає — остання збережена копія.
// Кешуються сторінка, код, стилі, іконки й дані (data/*.json). Адмінка, ГДЗ і PDF — ні.
const CACHE = "dz-v2";
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

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (!cacheable(url)) return;
  const key = url.origin + url.pathname; // без ?t=… — щоб знаходити збережену копію
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(key, copy)).catch(() => {});
      }
      return res;
    }).catch(async () => {
      const hit = await caches.match(key) || (req.mode === "navigate" ? await caches.match(url.origin + "/") : null);
      if (!hit) return Response.error();
      // позначка для сайту: це збережена копія, звʼязку немає
      const h = new Headers(hit.headers);
      h.set("X-Offline", "1");
      return new Response(await hit.blob(), { status: 200, headers: h });
    })
  );
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
