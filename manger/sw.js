// Keeps the recipes on the device so that pages open instantly, and offline (in the kitchen).
// GitHub Pages only lets browsers cache for 10 minutes; this cache has no such limit.
// Every page is served from the cache right away and refreshed from the network in the background,
// so after the site changes, the first visit shows the previous version and the next one the new.
// Registered by fast.js; its scope is /manger/.
var CACHE = "manger-v3"; // change the name to throw away every visitor's cache
var CORE = ["./", "style.css", "recipe.js", "fast.js", "favicon.svg"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // The filters (?cuisine=…, ?source=…) are applied in the page, so they all share one cached page.
  var key = req.mode === "navigate" ? req.url.split("?")[0] : req;
  var fresh = fetch(req).then(function (res) {
    if (res.ok && res.type === "basic") {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(key, copy); });
    }
    return res;
  });
  e.waitUntil(fresh.catch(function () {}));
  e.respondWith(caches.match(key).then(function (hit) { return hit || fresh; }));
});
