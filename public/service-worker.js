// public/service-worker.js

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.open("my-cache").then((cache) => {
//       const cacheKey = event.request.url + "-" + event.request.method;

//       return cache.match(cacheKey).then((response) => {
//         if (response) {
//           // If response is found in cache, return it
//           return response;
//         } else {
//           // If response is not found in cache, fetch and cache it
//           return fetch(event.request).then((response) => {
//             // Clone the response before caching, as a response can only be consumed once
//             cache.put(cacheKey, response.clone());
//             return response;
//           });
//         }
//       });
//     })
//   );
// });

// api-service-worker.js
// self.addEventListener("fetch", (event) => {
//   // Customize this logic to match the APIs you want to cache
//   if (
//     event.request.url.startsWith(
//       "https://dynamicbackend.thecbt.live/api/v1/project"
//     )
//   ) {
//     event.respondWith(
//       caches.open("api-cache").then((cache) => {
//         return cache.match(event.request).then((response) => {
//           if (response) {
//             return response;
//           } else {
//             return fetch(event.request).then((response) => {
//               cache.put(event.request, response.clone());
//               return response;
//             });
//           }
//         });
//       })
//     );
//   }
// });

// const CACHE_NAME = "my-app-cache-v1";
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll([
//         "/",
//         "/index.html",
//         "/static/css/main.css",
//         "/static/js/main.js",
//         // Add other assets you want to cache
//       ]);
//     })
//   );
// });
// self.addEventListener("fetch", (event) => {
//   const { request } = event;
//   // Handle API requests
//   if (
//     request.url.startsWith("https://dynamicbackend.thecbt.live/api/v1/project")
//   ) {
//     event.respondWith(handleApiRequest(request));
//     return;
//   }
//   // Handle other requests from cache
//   event.respondWith(
//     caches.match(request).then((response) => {
//       return response || fetch(request);
//     })
//   );
// });
// async function handleApiRequest(request) {
//   const { method } = request;
//   // Handle GET requests
//   if (method === "GET") {
//     // Try to fetch from cache first
//     const cachedResponse = await caches.match(request);
//     if (cachedResponse) {
//       return cachedResponse;
//     }
//     // Fetch from network and cache the response
//     try {
//       const response = await fetch(request);
//       const clonedResponse = response.clone();
//       caches.open(CACHE_NAME).then((cache) => {
//         cache.put(request, clonedResponse);
//       });
//       return response;
//     } catch (error) {
//       console.error("API fetch error:", error);
//       return new Response(JSON.stringify({ error: "Network error" }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   }
//   // Handle PUT and DELETE requests
//   if (method === "PUT" || method === "DELETE") {
//     try {
//       const response = await fetch(request);
//       // Invalidate the cache for the modified resource
//       const cache = await caches.open(CACHE_NAME);
//       await cache.delete(request);
//       return response;
//     } catch (error) {
//       console.error("API fetch error:", error);
//       return new Response(JSON.stringify({ error: "Network error" }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   }
//   // Handle POST requests
//   if (method === "POST") {
//     try {
//       const response = await fetch(request);
//       // Invalidate the entire cache for POST requests
//       const cacheNames = await caches.keys();
//       await Promise.all(
//         cacheNames.map((cacheName) => caches.delete(cacheName))
//       );
//       return response;
//     } catch (error) {
//       console.error("API fetch error:", error);
//       return new Response(JSON.stringify({ error: "Network error" }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }
//   }
// }

const CACHE_NAME = "my-app-cache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/static/css/main.css",
        "/static/js/main.js",
        // Add other assets you want to cache
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Handle API requests
  if (
    request.url.startsWith("https://dynamicbackend.thecbt.live/api/v1/project")
  ) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle other requests from cache
  event.respondWith(handleCacheFirst(request));
});

async function handleCacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    const clonedResponse = response.clone();
    caches.open(CACHE_NAME).then((cache) => {
      cache.put(request, clonedResponse);
    });
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    return new Response(JSON.stringify({ error: "Network error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleApiRequest(request) {
  const { method } = request;

  if (method === "GET") {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      // Fetch from network and update cache
      try {
        const networkResponse = await fetch(request);
        const clonedNetworkResponse = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clonedNetworkResponse);
        });
        return networkResponse;
      } catch (error) {
        // Handle network error
        console.error("API fetch error:", error);
        return cachedResponse;
      }
    } else {
      // Fetch from network and cache the response
      try {
        const response = await fetch(request);
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clonedResponse);
        });
        return response;
      } catch (error) {
        // Handle network error
        console.error("API fetch error:", error);
        return new Response(JSON.stringify({ error: "Network error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  }

  if (method === "PUT" || method === "DELETE") {
    try {
      const response = await fetch(request);
      // Invalidate the cache for the modified resource
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(request);
      return response;
    } catch (error) {
      console.error("API fetch error:", error);
      return new Response(JSON.stringify({ error: "Network error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (method === "POST") {
    try {
      const response = await fetch(request);
      // Invalidate the entire cache for POST requests
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      return response;
    } catch (error) {
      console.error("API fetch error:", error);
      return new Response(JSON.stringify({ error: "Network error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
