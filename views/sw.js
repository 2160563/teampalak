
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(console.log)
    .catch(console.error);
}
const CACHE_NAME = "cache-v1";
const assetToCache = [
  "/",
    "/home",
    "/assets/css/bootstrap.css",
    "/assets/css/bootstrap-responsive.css",
    "/assets/css/docs.css",
    "/assets/css/prettyPhoto.css",
    "/assets/js/google-code-prettify/prettify.css",
    "/assets/css/nivo-slider.css",
    "/assets/css/style.css",
    "/assets/css/overwrite.css",
    "/assets/css/boxtile.css",
    "/assets/color/success.css",
    "/assets/img/slides/nivo/3.png",
    "/assets/img/slides/nivo/4.png",
    "/assets/img/slides/nivo/5.png",
    "/assets/img/slides/nivo/6.png",
    "/assets/img/slides/nivo/7.png",
    "/assets/img/slides/nivo/1.png",
    "/assets/img/slides/nivo/2.png"
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
self.addEventListener('fetch', function(event) {
 console.log(event.request.url);
});
self.addEventListener('push', event => {
  const data = event.data.json();

  self.registration.showNotification(data.title, {
    body: data.message,
  });

});

