// Shared by every recipe page (each one loads it with <script src="../recipe.js" defer>; its look is in ../style.css).
// Adds a bar with a link back to the home page and a print button, the page's cuisine and source chips,
// read from its <meta name="recipe:cuisine"> and <meta name="recipe:source"> tags, and loads fast.js.
(function () {
  function tags(name) {
    var m = document.querySelector('meta[name="recipe:' + name + '"]');
    return m ? m.content.split(",").map(function (s) { return s.trim(); }).filter(Boolean) : [];
  }

  // Recipes ask to print on landscape A4 (their tables are wide); browsers that ignore this print
  // portrait, which the print layout in style.css also fits. The home page keeps the printer's default.
  var page = document.createElement("style");
  page.textContent = "@page { size: A4 landscape; margin: 10mm; }";
  document.head.appendChild(page);

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
    if (kind === "cuisine") { // its round flag, ../flags/<cuisine>.svg, if there is one
      var slug = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      var img = document.createElement("img");
      img.className = "flag";
      img.alt = "";
      img.src = "../flags/" + slug + ".svg";
      img.onerror = function () { img.remove(); };
      a.appendChild(img);
    }
    a.appendChild(document.createTextNode(value));
    row.appendChild(a);
  }
  tags("cuisine").forEach(function (v) { chip("cuisine", v); });
  tags("source").forEach(function (v) { chip("source", v); });
  var after = document.querySelector(".meta") || h1;
  if (row.firstChild && after) after.parentNode.insertBefore(row, after.nextSibling);

  // The top of the page (bar, title, times, tags, servings) goes in a grey band, like the home page.
  var hero = document.createElement("header");
  hero.className = "rx-hero";
  document.body.insertBefore(hero, bar);
  [bar, h1, document.querySelector(".meta"), row.firstChild ? row : null, document.querySelector(".controls")]
    .forEach(function (el) { if (el) hero.appendChild(el); });


  // Instant page loads, offline cache and the visit counter, shared with the home page.
  var fast = document.createElement("script");
  fast.src = "../fast.js";
  document.body.appendChild(fast);
})();
