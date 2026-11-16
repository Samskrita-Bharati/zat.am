const cacheName = "shiva_sutra_scoring_v2";
const base = new URL("./", self.location.href);
const local = ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname);
const assets = ["./", "./index.html", "./style.css?direct&v=score2", "./script.js?v=cleanup-2", "./Maheshwarani_Sutras.jpg", "../shared/game-theme.css"].map(path => new URL(path, base).href);
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    if (!local) await (await caches.open(cacheName)).addAll(assets);
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    await Promise.all(["shiva_sutra_game", "shiva_sutra_scoring_v1"].map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
if (!local) {
  self.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET" || !assets.includes(request.url)) return;
    event.respondWith((async () => {
      const cache = await caches.open(cacheName);
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch (error) {
        const cached = await cache.match(request);
        if (cached) return cached;
        throw error;
      }
    })());
  });
}
