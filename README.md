# padlewski-site
Padlewski Family Website

The CV PDFs are generated from the pages by `build-pdfs.sh`. Edit the page, not the PDF, then run `./build-pdfs.sh <page>` (e.g. `./build-pdfs.sh yasmine`) and commit the rebuilt PDFs together with the page.

## Recipes (`manger/`)

The recipes at `/manger/` each have their own folder (`manger/ragu-alla-bolognese/index.html`). The recipes page lists them by cuisine, and you can filter the list by cuisine and by source. To add a recipe, give the page, its cuisine and its sources:

    ./build-recipes.py add ~/Downloads/Pad_Thai.html Thaïe Yasmine

The script copies the page into `manger/`, tags it and rebuilds `manger/index.html`. Commit both together.
A recipe's cuisine and sources are in its `<head>` (`<meta name="recipe:cuisine" content="Libanaise">`, `<meta name="recipe:source" content="Sylvie, Yasmine">`). After editing them or the `<title>`, or after deleting a recipe, run `./build-recipes.py build`.
The look of the recipes page and of every recipe is in `manger/style.css`; the back link, print button and tag chips on each recipe come from `manger/recipe.js`.
Pages open instantly because `manger/fast.js` loads a recipe while the pointer rests on its link, and `manger/sw.js` keeps every page on the visitor's device (also offline). After a change, a visitor sees the previous version once and the new one on the next visit; to force everyone onto the new version at once, rename `CACHE` in `manger/sw.js` (e.g. `manger-v2`).
