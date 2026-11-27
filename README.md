# padlewski-site
Padlewski Family Website

The CV PDFs are generated from the pages by `build-pdfs.sh`. Edit the page, not the PDF, then run `./build-pdfs.sh <page>` (e.g. `./build-pdfs.sh yasmine`) and commit the rebuilt PDFs together with the page.

## Recipes (`manger/`)

The recipes at `/manger/` each have their own folder (`manger/ragu-alla-bolognese/index.html`). The recipes page lists them by type (Entrées, Plats, Desserts), each tile showing its cuisine's flag, and you can filter the list by type, cuisine and source. To add a recipe, give the page, its type (Entrée, Plat or Dessert), its cuisine and its sources:

    ./build-recipes.py add ~/Downloads/Pad_Thai.html Plat Thaïe Yasmine

The script copies the page into `manger/`, tags it and rebuilds `manger/index.html`. Commit both together.
A recipe's type, cuisine and sources are in its `<head>` (`<meta name="recipe:course" content="Plat">`, `<meta name="recipe:cuisine" content="Libanaise">`, `<meta name="recipe:source" content="Sylvie, Yasmine">`). After editing them or the `<title>`, or after deleting a recipe, run `./build-recipes.py build`.
A handwritten recipe can show its scan: put the pages next to the recipe (`original-1.jpg`, `original-2.jpg`, about 1600 px wide) and list them in its `<head>`: `<meta name="recipe:original" content="original-1.jpg, original-2.jpg">`. A "Voir la recette originale" link then appears under the table.
A recipe cooked in water can offer the "Mode expert" (cooking time against the water's temperature, by the Arrhenius law): add before `</body>` a `<script type="application/json" class="rx-thermo">{"ref": 95, "items": [{"name": "Viande", "min": 105, "ea": 78}]}</script>`, with the recipe's water temperature (°C), and for each ingredient its total cooking time (minutes) and activation energy (kJ/mol; about 78 for meat and eggs, 100 for vegetables).
The look of the recipes page and of every recipe is in `manger/style.css`; the back link, print button and tag chips on each recipe come from `manger/recipe.js`.
Pages open instantly because `manger/fast.js` loads a recipe while the pointer rests on its link, and `manger/sw.js` keeps a copy of every page on the visitor's device for offline use (online, pages always come from the site, so changes show up at once).
Each cuisine shows its country's military aircraft roundel (concentric rings) from `manger/flags/<cuisine>.svg` (e.g. `flags/italienne.svg`); when a recipe brings a new cuisine, `./build-recipes.py` says which flag file to add.
The recipes section has a version (bottom of each page), set in `manger/fast.js`; see `manger/CHANGELOG.md` for what to bump and the history.
