const CACHE_NAME = "joyful-genius-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json", "/favicon.ico"];

// Install and cache files
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((res) => {
          if (!event.request.url.includes("chrome-extension")) {
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(event.request, res.clone())
            );
          }
          return res;
        })
      );
    })
  );
});

// Auto-update service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});
