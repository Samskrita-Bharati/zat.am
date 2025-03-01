const staticDev = "lakaara"
const service_worker_version = "v1.01"
const assets = [
  "/052-lakaara/",
  "/052-lakaara/index.html",
  "/052-lakaara/style.css",
  "/052-lakaara/conjugations.txt",
  "/052-lakaara/script.js"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDev).then(cache => {
      cache.addAll(assets)
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
