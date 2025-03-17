const staticDev = "namavali_game"
const service_worker_version = "v1.01"
const assets = [
  "/055-namavali/",
  "/055-namavali/index.html",
  "/055-namavali/style.css",
  "/055-namavali/script.js"
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
