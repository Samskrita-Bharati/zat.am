const staticDev = "numerale"
const service_worker_version = "v1.01"
const assets = [
  "/051-numerale/",
  "/051-numerale/index.html",
  "/051-numerale/style.css",
  "/051-numerale/script.js"
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
