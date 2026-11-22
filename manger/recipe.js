// Shared by every recipe page (each one loads it with <script src="../recipe.js" defer>; its look is in ../style.css).
// Adds a bar with a link back to the home page and a print button, the page's cuisine and source chips,
// read from its <meta name="recipe:cuisine"> and <meta name="recipe:source"> tags, and the visit counter.
(function () {
  function tags(name) {
    var m = document.querySelector('meta[name="recipe:' + name + '"]');
    return m ? m.content.split(",").map(function (s) { return s.trim(); }).filter(Boolean) : [];
  }

  if (!document.querySelector('link[rel~="icon"]')) {
    var icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/svg+xml";
    icon.href = "../favicon.svg";
    document.head.appendChild(icon);
  }

  var h1 = document.querySelector("h1");
  // Opened from disk (file://), a folder link does not open its index.html by itself.
  var home = location.protocol === "file:" ? "../index.html" : "../";

  var bar = document.createElement("div");
  bar.className = "rx-bar";
  var back = document.createElement("a");
  back.className = "rx-back";
  back.href = home;
  back.textContent = "← Toutes les recettes";
  var print = document.createElement("button");
  print.type = "button";
  print.className = "rx-print";
  print.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 ' +
    '2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>Imprimer';
  print.addEventListener("click", function () { window.print(); });
  bar.appendChild(back);
  bar.appendChild(print);
  document.body.insertBefore(bar, h1 || document.body.firstChild);

  var row = document.createElement("div");
  row.className = "rx-tags";
  function chip(kind, value) {
    var a = document.createElement("a");
    a.className = "rx-tag rx-" + kind;
    a.href = home + "?" + kind + "=" + encodeURIComponent(value);
    a.textContent = value;
    row.appendChild(a);
  }
  tags("cuisine").forEach(function (v) { chip("cuisine", v); });
  tags("source").forEach(function (v) { chip("source", v); });
  var after = document.querySelector(".meta") || h1;
  if (row.firstChild && after) after.parentNode.insertBefore(row, after.nextSibling);

  var gc = document.createElement("script");
  gc.async = true;
  gc.src = "//gc.zgo.at/count.js";
  gc.dataset.goatcounter = "https://padlewski.goatcounter.com/count";
  document.body.appendChild(gc);
})();
