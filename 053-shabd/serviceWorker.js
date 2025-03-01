const staticDev = "shabd"
const service_worker_version = "v1.0"
const assets = [
  "/053-shabd/",
  "/053-shabd/index.html",
  "/053-shabd/style.css",
  "/053-shabd/declensions.txt",
  "/053-shabd/script.js"
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
