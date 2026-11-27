// Makes moving between recipe pages instant, like mcmaster.com. Loaded by index.html and recipe.js.
//  - Chrome and Edge prerender a recipe page when the pointer rests on its link (Speculation Rules).
//  - Other browsers fetch the page as soon as the pointer or a finger is on the link, so it is ready on click.
//  - sw.js keeps a copy of every page on the device, for offline use (see that file).
// (No visit counter here: GoatCounter is only on mathieu/.)
(function () {
  // Version of the recipes section, shown at the bottom of every page and naming sw.js's cache, so a new
  // version also refreshes every visitor's copy. MAJOR: redesign or new structure; MINOR: new feature
  // or recipe; PATCH: fixes and small edits. Record each change in CHANGELOG.md.
  var VERSION = "3.7.0";
  var here = document.currentScript.src.replace(/fast\.js.*$/, ""); // .../manger/

  function stamp() {
    var spots = document.querySelectorAll(".version");
    if (!spots.length) { // recipe pages: a line at the very bottom
      var p = document.createElement("p");
      p.className = "version rx-version";
      document.body.appendChild(p);
      spots = [p];
    }
    [].forEach.call(spots, function (el) { el.textContent = "v" + VERSION; });
  }
  if (document.body) stamp(); else document.addEventListener("DOMContentLoaded", stamp);

  if (location.protocol !== "file:") {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register(here + "sw.js?v=" + VERSION).catch(function () {});

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
})();
