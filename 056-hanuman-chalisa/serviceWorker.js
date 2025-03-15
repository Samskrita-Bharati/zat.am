const staticDev = "hanuman_chalisa"
const service_worker_version = "v1.0"
const assets = [
  "/056-hanuman-chalisa/",
  "/056-hanuman-chalisa/index.html",
  "/056-hanuman-chalisa/style.css",
  "/056-hanuman-chalisa/hanuman_chalisa.txt",
  "/056-hanuman-chalisa/script.js"
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
