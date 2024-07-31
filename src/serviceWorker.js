/* eslint-disable no-restricted-globals */

// export const register = () => {
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker
//       .register("/serviceworker.js")
//       .then(/* ... */)
//       .catch(/* ... */);
//   }
// };

// self.addEventListener("install", (event) => {
//   console.log({ event });
//   event.waitUntil(
//     caches.open("my-cache").then((cache) => {
//       console.log({ cache });
//       return cache.addAll([
//         // Add URLs of assets you want to cache, like CSS, JS, images, etc.
//         // "/static/css/main.css",
//         // "/static/js/bundle.js",
//         // "/static/media/logo.png",
//       ]);
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   console.log({ event });
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });
