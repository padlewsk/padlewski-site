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

  // Second view of the recipe, "Étapes": an ingredient list and numbered steps, chosen with the
  // Tableau / Étapes switch below (Étapes by default on phones, the table on larger screens; the
  // table is always what prints). Read from
  // the table, so every recipe gets it:
  // its columns are in time order, each step cell covers the ingredient rows it uses, and a full-width
  // row in the middle ("Pendant ce temps…") starts a new group of steps.
  var table = document.querySelector(".card table");
  if (table) {
    var grid = [], cells = [], ncols = 0;
    [].forEach.call(table.rows, function (tr, r) {
      grid[r] = grid[r] || [];
      var c = 0;
      [].forEach.call(tr.cells, function (td) {
        while (grid[r][c]) c++;
        var cell = { td: td, r0: r, r1: r + td.rowSpan - 1, c0: c, c1: c + td.colSpan - 1 };
        for (var i = cell.r0; i <= cell.r1; i++) {
          grid[i] = grid[i] || [];
          for (var j = cell.c0; j <= cell.c1; j++) grid[i][j] = cell;
        }
        cells.push(cell);
        c = cell.c1 + 1;
        ncols = Math.max(ncols, c);
      });
    });

    var ings = {}, clones = [];
    cells.forEach(function (cell) {
      var ing = cell.c0 === 0 && cell.td.querySelector(".ing");
      if (ing) ings[cell.r0] = { q: ing.querySelector(".q"), label: ing.lastElementChild };
    });
    // a copy of an ingredient whose amount and name follow the servings stepper
    function copy(r) {
      var span = document.createElement("span");
      span.className = "rx-ing";
      var q = document.createElement("span");
      q.className = "q";
      var name = document.createElement("span");
      span.appendChild(q);
      span.appendChild(name);
      clones.push({ r: r, q: q, name: name });
      return span;
    }
    function sync() {
      clones.forEach(function (k) {
        k.q.textContent = ings[k.r].q ? ings[k.r].q.textContent : "";
        k.name.textContent = ings[k.r].label.textContent;
      });
    }

    // groups of rows, split by full-width rows; full-width rows before any ingredient are first steps
    var groups = [], intro = [], current = null;
    for (var r = 0; r < grid.length; r++) {
      var first = grid[r][0];
      if (first && first.td.classList.contains("full") && first.r0 === r) {
        if (!groups.length && !current) intro.push(first.td);
        else { current = { note: first.td, r0: r + 1, r1: r + 1, ops: [] }; groups.push(current); }
      } else if (ings[r]) {
        if (!current) { current = { note: null, r0: r, r1: r, ops: [] }; groups.push(current); }
        current.r1 = r;
      }
    }
    var spanning = [];
    cells.forEach(function (cell) {
      if (!cell.td.classList.contains("op") || cell.c0 === 0 || !cell.td.textContent.trim()) return;
      var g = groups.filter(function (g) { return cell.r0 >= g.r0 && cell.r1 <= g.r1; })[0];
      (g ? g.ops : spanning).push(cell);
    });
    function byColumn(a, b) { return a.c0 - b.c0 || a.r0 - b.r0; }

    var view = document.createElement("section");
    view.className = "rx-steps";
    var h = document.createElement("h2");
    h.textContent = "Ingrédients";
    var list = document.createElement("ul");
    list.className = "rx-ings";
    Object.keys(ings).forEach(function (r) {
      var li = document.createElement("li");
      li.appendChild(copy(+r));
      list.appendChild(li);
    });
    var h2 = document.createElement("h2");
    h2.textContent = "Étapes";
    var steps = document.createElement("ol");
    steps.className = "rx-step-list";
    var used = {};
    // the table breaks lines to fit narrow cells; here a single break is a space, a double one a new paragraph
    function prose(html) {
      return html.replace(/(<br\s*\/?>\s*){2,}/gi, "\u0000").replace(/<br\s*\/?>/gi, " ")
        .replace(/\u00ad|&shy;/g, "")
        .replace(/\u0000\s*(\S)/g, function (m, c) { return "<br><br>" + c.toUpperCase(); });
    }
    function step(html, cell) {
      var li = document.createElement("li");
      var text = document.createElement("div");
      text.className = "rx-text";
      text.innerHTML = prose(html);
      li.appendChild(text);
      if (cell) {
        var uses = document.createElement("div");
        uses.className = "rx-uses";
        // the first column is preparation (chop, rinse…): it shows its ingredients but they still count
        // as new when they go into the pan in a later column
        var prep = cell.c0 === 1;
        for (var r = cell.r0; r <= cell.r1; r++) {
          if (ings[r] && (prep || !used[r])) { if (!prep) used[r] = true; uses.appendChild(copy(r)); }
        }
        if (uses.firstChild) li.appendChild(uses);
      }
      steps.appendChild(li);
    }
    intro.forEach(function (td) { step(td.innerHTML); });
    groups.forEach(function (g) {
      if (g.note) {
        var li = document.createElement("li");
        li.className = "rx-note";
        li.innerHTML = prose(g.note.innerHTML);
        steps.appendChild(li);
      }
      g.ops.sort(byColumn).forEach(function (cell) { step(cell.td.innerHTML, cell); });
    });
    spanning.sort(byColumn).forEach(function (cell) { step(cell.td.innerHTML, cell); });

    view.appendChild(h);
    view.appendChild(list);
    view.appendChild(h2);
    view.appendChild(steps);
    var card = table.closest(".card");
    card.parentNode.insertBefore(view, card.nextSibling);
    sync();
    new MutationObserver(sync).observe(table, { subtree: true, childList: true, characterData: true });

    // The Tableau / Étapes switch, next to the servings; the choice is remembered on this device.
    var KEY = "manger-view", views = [["table", "Tableau"], ["steps", "Étapes"]];
    var root = document.documentElement, saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var toggle = document.createElement("div");
    toggle.className = "rx-mode";
    toggle.setAttribute("role", "group");
    toggle.setAttribute("aria-label", "Affichage de la recette");
    function show(view, remember) {
      root.setAttribute("data-view", view);
      [].forEach.call(toggle.children, function (b) { b.setAttribute("aria-pressed", String(b.value === view)); });
      if (remember) { try { localStorage.setItem(KEY, view); } catch (e) {} }
    }
    views.forEach(function (v) {
      var b = document.createElement("button");
      b.type = "button";
      b.value = v[0];
      b.textContent = v[1];
      b.addEventListener("click", function () { show(v[0], true); });
      toggle.appendChild(b);
    });
    // default: Étapes on phones, Tableau on larger screens; a choice made on this device wins
    var phone = window.matchMedia && matchMedia("(max-width: 700px)").matches;
    show(saved === "steps" || saved === "table" ? saved : phone ? "steps" : "table", false);
    var controls = document.querySelector(".controls");
    if (controls) {
      var tools = document.createElement("div");
      tools.className = "rx-tools";
      controls.parentNode.insertBefore(tools, controls);
      tools.appendChild(controls);
      tools.appendChild(toggle);
    } else {
      card.parentNode.insertBefore(toggle, card);
    }
  }

  // For printing on a portrait page in Safari, which ignores the landscape request above: everything
  // but the chef's tips goes in one block that style.css turns a quarter turn. Invisible on screen.
  // Only Safari: Chrome and Firefox print landscape as asked.
  if (/^((?!chrome|chromium|crios|fxios|android|edg).)*safari/i.test(navigator.userAgent)) {
    document.documentElement.classList.add("rx-rotate");
  }
  var sheet = document.createElement("div");
  sheet.className = "rx-sheet";
  var first = document.createElement("div");
  first.className = "rx-page";
  first.appendChild(sheet);
  var kids = [].slice.call(document.body.children).filter(function (el) {
    return el.tagName !== "SCRIPT" && !el.classList.contains("chef");
  });
  document.body.insertBefore(first, kids[0] || null);
  kids.forEach(function (el) { sheet.appendChild(el); });


  // Instant page loads, offline cache and the visit counter, shared with the home page.
  var fast = document.createElement("script");
  fast.src = "../fast.js";
  document.body.appendChild(fast);
})();
