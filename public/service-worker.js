
// const CACHE_NAME = "joyful-genius-v1"; // bump version when deploying
// const STATIC_ASSETS = [
//   "/",
//   "/index.html",
//   "/manifest.json",
//   "/favicon.ico",
//   "/icons/icon-192.png",
//   "/icons/icon-512.png"
// ];

// // Install: Cache static assets
// self.addEventListener("install", (event) => {
//   self.skipWaiting(); // Activate immediately
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
//   );
// });

// // Fetch: Different strategies for API and static assets
// self.addEventListener("fetch", (event) => {
//   const request = event.request;

//   // Skip caching for non-GET requests
//   if (request.method !== "GET") return;

//   // Network-first for API calls (to avoid stale user data)
//   if (request.url.includes("/api/")) {
//     event.respondWith(networkFirst(request));
//     return;
//   }

//   // Cache-first for static files
//   event.respondWith(cacheFirst(request));
// });

// // Cache-first strategy
// async function cacheFirst(request) {
//   const cached = await caches.match(request);
//   if (cached) return cached;

//   try {
//     const fresh = await fetch(request);
//     const cache = await caches.open(CACHE_NAME);
//     cache.put(request, fresh.clone());
//     return fresh;
//   } catch (err) {
//     if (request.headers.get("accept")?.includes("text/html")) {
//       return caches.match("/index.html");
//     }
//   }
// }

// // Network-first strategy
// async function networkFirst(request) {
//   try {
//     const fresh = await fetch(request);
//     return fresh;
//   } catch (err) {
//     const cached = await caches.match(request);
//     return cached || new Response(JSON.stringify({ error: "Offline" }), {
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// }

// // Activate: Clear old caches & claim clients
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((names) =>
//       Promise.all(
//         names.map((name) => {
//           if (name !== CACHE_NAME) {
//             return caches.delete(name);
//           }
//         })
//       )
//     ).then(() => self.clients.claim())
//   );
// });

// // Auto-refresh when new SW is activated
// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     self.clients.matchAll({ type: "window" }).then((clients) => {
//       clients.forEach((client) => client.navigate(client.url)); // reload open pages
//     })
//   );
// });


// const CACHE_NAME = "joyful-genius-v2"; // bump when deploying
// const STATIC_ASSETS = [
//   "/",
//   "/index.html",
//   "/manifest.json",
//   "/favicon.ico",
//   "/icons/icon-192.png",
//   "/icons/icon-512.png"
// ];

// // Install: Cache static assets
// self.addEventListener("install", (event) => {
//   self.skipWaiting(); // Activate immediately
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
//   );
// });

// // Fetch: Network-first for API calls, cache-first for static assets
// self.addEventListener("fetch", (event) => {
//   const request = event.request;

//   if (request.method !== "GET") return;

//   if (request.url.includes("/api/")) {
//     event.respondWith(networkFirst(request));
//     return;
//   }

//   event.respondWith(cacheFirst(request));
// });

// // Cache-first strategy
// async function cacheFirst(request) {
//   const cached = await caches.match(request);
//   if (cached) return cached;

//   try {
//     const fresh = await fetch(request);
//     const cache = await caches.open(CACHE_NAME);
//     cache.put(request, fresh.clone());
//     return fresh;
//   } catch (err) {
//     if (request.headers.get("accept")?.includes("text/html")) {
//       return caches.match("/index.html");
//     }
//   }
// }

// // Network-first strategy
// async function networkFirst(request) {
//   try {
//     const fresh = await fetch(request.url, { cache: "no-store" });
//     return fresh;
//   } catch (err) {
//     const cached = await caches.match(request);
//     return cached || new Response(JSON.stringify({ error: "Offline" }), {
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// }

// // Activate: clear old caches & notify clients of new version
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     (async () => {
//       const cacheNames = await caches.keys();
//       await Promise.all(
//         cacheNames.map((name) => {
//           if (name !== CACHE_NAME) {
//             return caches.delete(name);
//           }
//         })
//       );

//       await self.clients.claim();

//       const allClients = await self.clients.matchAll({ type: "window" });
//       allClients.forEach((client) => {
//         client.postMessage({ type: "NEW_VERSION_AVAILABLE" });
//       });
//     })()
//   );
// });


const CACHE_NAME = "joyful-genius-v3"; // bump version when deploying
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: cache static assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  if (request.url.includes("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    if (request.headers.get("accept")?.includes("text/html")) {
      return caches.match("/index.html");
    }
  }
}

async function networkFirst(request) {
  try {
    const fresh = await fetch(request.url, { cache: "no-store" });
    return fresh;
  } catch (err) {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: "Offline" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Activate: clear old caches & force refresh
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );

      await self.clients.claim();

      // Force reload for all tabs
      const allClients = await self.clients.matchAll({ type: "window" });
      allClients.forEach((client) => client.navigate(client.url));
    })()
  );
});
