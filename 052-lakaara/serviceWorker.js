const staticDev = "lakaara"
const assets = [
  "/052-lakaara/",
  "/052-lakaara/index.html",
  "/052-lakaara/style.css?direct&v=3",
  "/052-lakaara/conjugations.txt",
  "/052-lakaara/script.js"
]

const isLocal = ["localhost", "127.0.0.1", "[::1]"].includes(self.location.hostname)

if (isLocal) {
  // Replace previously installed local workers without intercepting any requests.
  self.addEventListener("install", event => event.waitUntil(self.skipWaiting()))
  self.addEventListener("activate", event => event.waitUntil(self.clients.claim()))
} else {
  self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
      caches.open(staticDev).then(cache => {
        return cache.addAll(assets)
      })
    )
  })

  self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })
}
