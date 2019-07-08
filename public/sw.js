
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(console.log)
    .catch(console.error);
}
const CACHE_NAME = "cache-v1";
const assetToCache = [
  "/",
    "/home"
];
self.addEventListener("install", function(event) {
  console.log("installing");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(assetToCache);
      })
      .catch(console.error)
  );
});
self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)

      // TODO 4 - Add fetched files to the cache

    }).catch(error => {

      // TODO 6 - Respond with custom offline page

    })
  );
});
self.addEventListener('push', event => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.message,
  });

});

