// Keeps a copy of the recipes on the device, so they still open offline (in the kitchen).
// With a connection, every page and file comes from the site, so changes show up straight away; the
// copy is refreshed each time and only used when the network fails. (Speed comes from fast.js, which
// loads a recipe as soon as the pointer rests on its link.)
// Registered by fast.js as sw.js?v=<version>; its scope is /manger/. The cache is named after that version,
// so bumping VERSION in fast.js throws away every visitor's old copy.
var CACHE = "manger-" + (new URL(location.href).searchParams.get("v") || "dev");
var CORE = ["./", "style.css", "recipe.js", "fast.js", "favicon.svg"];

self.addEventListener("install", function (e) {
  // "reload": straight from the site, not from the browser's own 10-minute cache
  var fresh = CORE.map(function (u) { return new Request(u, { cache: "reload" }); });
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(fresh); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // The filters (?cuisine=…, ?source=…) are applied in the page, so they all share one saved page.
  var key = req.mode === "navigate" ? req.url.split("?")[0] : req;
  e.respondWith(fetch(req).then(function (res) {
    if (res.ok && res.type === "basic") {
      var copy = res.clone();
      e.waitUntil(caches.open(CACHE).then(function (c) { return c.put(key, copy); }));
    }
    return res;
  }).catch(function () {
    return caches.match(key).then(function (hit) { return hit || Response.error(); });
  }));
});
