# Recettes (/manger/): changes

Versions are MAJOR.MINOR.PATCH. MAJOR: a redesign or a new structure; MINOR: a new feature or a new
recipe; PATCH: fixes and small edits (wording, quantities, a quote). The version is set in `fast.js`
(`VERSION`), shown at the bottom of every page, and names the offline cache, so bumping it also makes
every visitor fetch the new files.

## 3.4.1, 23.11.2026
- The US and Chinese insignia are drawn in full, with their side bars (they were cropped to a circle).

## 3.4.0, 23.11.2026
- Gratin de pommes de terre de Sylvie, with her tip in a "Conseil de la cheffe" card.

## 3.3.1, 23.11.2026
- No visit counter on the recipes any more (GoatCounter is only on mathieu/).

## 3.3.0, 22.11.2026
- Muffins aux pommes et à la cannelle (Yasmine), adapted from Add a Pinch; the stepper counts muffins.

## 3.2.0, 22.11.2026
- Handwritten recipes (or recipes annotated by hand) have a "Voir la recette originale" link under the
  table, which shows the scan full screen: Gâteau au chocolat de Mercedes, Banana cake and Carrot cake de
  Sylvie, Carrot cake de Sébastien, Couscous, Soupe chinoise and Dolmas de Vincente. The scans are
  original-1.jpg, original-2.jpg… in each recipe's folder, listed in <meta name="recipe:original">.

## 3.1.0, 22.11.2026
- Phones: the cuisine and source filters fold behind a "Filtres" button (with the number of filters on),
  and each row of chips scrolls sideways instead of taking several lines. Section counts follow the filters.
- Étapes view: a tap ticks off an ingredient or a step; "Tout décocher" clears them. Kept until the tab
  is closed.
- Phones and tablets: an "Écran allumé" switch keeps the screen from going dark while cooking.

## 3.0.0, 22.11.2026
- The home page lists recipes by type: Entrées, Plats, Desserts. Each tile shows its cuisine's flag;
  cuisine and source remain as filters, with a new Type filter.
- Recipe pages show their type next to the cuisine and source.
- Every recipe has a <meta name="recipe:course"> tag; `build-recipes.py add` now takes the type
  (Entrée, Plat or Dessert) before the cuisine.

## 2.6.1, 22.11.2026
- More compact recipe tiles on the home page.

## 2.6.0, 22.11.2026
- Carrot cake de Sébastien, with his remark.

## 2.5.0, 22.11.2026
- Ten family recipes: Gâteau au chocolat de Mercedes; Banana cake, Carrot cake, Meatloaf, Guacamole and
  Moussakhachi de Sylvie; Cake au rhum et raisins secs, Couscous, Soupe chinoise and Dolmas de Vincente.
- New cuisines, with their air force insignia: Algérienne, Chinoise, Mexicaine, Turque.

## 2.4.2, 22.11.2026
- Changes show up on the next visit: with a connection, pages come from the site; the copy kept on
  the device is only used offline. (Before, the saved copy came first, so updates appeared late.)
- Version number at the bottom of every page.

## 2.4.1, 22.11.2026
- Phones open recipes in the Étapes view; larger screens in the Tableau.

## 2.4.0, 22.11.2026
- Tableau / Étapes switch on every recipe, remembered on each device.

## 2.3.1, 22.11.2026
- Sébastien's « Remarque du chef » on the lemon cheesecake.

## 2.3.0, 22.11.2026
- Lemon cheesecake de Sébastien; new cuisine, Américaine.

## 2.2.0, 22.11.2026
- New dahl recipe (Cuisine Addict).

## 2.1.0, 22.11.2026
- Ingredient list and numbered steps on phones, built from each recipe's table.
- Simpler printing: landscape when the browser allows it, turned on portrait pages in Safari; the
  chef's tips on page 2.

## 2.0.0, 22.11.2026
- Redesign in the Apple style of yasmine/: grey bands, white pills, recipe tiles, Apple blue.
- « Conseils du chef » card with the chef's photo.
- French roundel as the tab icon on every page.

## 1.3.0, 22.11.2026
- Dahl de lentilles corail and Poulet rôti au four de Clément.
- Cuisines marked with their country's military aircraft roundel.

## 1.2.0, 22.11.2026
- Pages open instantly (loaded when the pointer rests on a link) and work offline.

## 1.1.0, 22.11.2026
- Recipes print on one landscape page.

## 1.0.0, 22.11.2026
- Recipes page: list by cuisine, cuisine and source filters, servings that scale the quantities.
