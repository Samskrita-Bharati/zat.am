const staticDev = "shiva_sutra_game"
const service_worker_version = "v1.0"
const assets = [
  "/054-shiva-sutra/",
  "/054-shiva-sutra/index.html",
  "/054-shiva-sutra/style.css",
  "/054-shiva-sutra/script.js"
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
