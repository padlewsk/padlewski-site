// Makes moving between recipe pages instant, like mcmaster.com. Loaded by index.html and recipe.js.
//  - Chrome and Edge prerender a recipe page when the pointer rests on its link (Speculation Rules).
//  - Other browsers fetch the page as soon as the pointer or a finger is on the link, so it is ready on click.
//  - sw.js keeps every page on the device (see that file).
//  - The visit counter waits until a prerendered page is actually opened, so hovering is not a visit.
(function () {
  var here = document.currentScript.src.replace(/fast\.js.*$/, ""); // .../manger/

  if (location.protocol !== "file:") {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register(here + "sw.js").catch(function () {});

    if (HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")) {
      var rules = document.createElement("script");
      rules.type = "speculationrules";
      rules.textContent = JSON.stringify({ prerender: [{
        where: { href_matches: new URL(here).pathname + "*" }, eagerness: "moderate" }] });
      document.head.appendChild(rules);
    } else {
      var done = {};
      var warm = function (e) {
        var a = e.target.closest && e.target.closest("a[href]");
        if (!a || a.origin !== location.origin || a.href.indexOf(here) !== 0) return;
        var url = a.href.split("#")[0].split("?")[0];
        if (done[url] || url === location.href.split("#")[0].split("?")[0]) return;
        done[url] = true;
        fetch(url, { credentials: "same-origin" }).catch(function () { delete done[url]; });
      };
      document.addEventListener("mouseover", warm, { passive: true });
      document.addEventListener("touchstart", warm, { passive: true });
      document.addEventListener("focusin", warm);
    }
  }

  function count() {
    var gc = document.createElement("script");
    gc.async = true;
    gc.src = "//gc.zgo.at/count.js";
    gc.dataset.goatcounter = "https://padlewski.goatcounter.com/count";
    document.body.appendChild(gc);
  }
  if (document.prerendering) document.addEventListener("prerenderingchange", count, { once: true });
  else if (document.body) count();
  else document.addEventListener("DOMContentLoaded", count);
})();
