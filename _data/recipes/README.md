# Recipe authoring

Add one `<slug>.json` file here.
Recipes use [Schema.org Recipe](https://schema.org/Recipe) with a small local
extension for the cooking process.
The build generates the diagram automatically; do not write rows, columns or spans.
There is no `_data/trn` sidecar.

## Minimal example

```json
{
  "@context": [
    "https://schema.org",
    { "flow": "https://ashgillman.github.io/ns/recipe-flow#" }
  ],
  "@type": "Recipe",
  "name": "Simple batter",
  "recipeIngredient": [
    { "@type": "PropertyValue", "@id": "#flour", "name": "240 g plain flour" },
    { "@type": "PropertyValue", "@id": "#milk", "name": "490 g soy milk" }
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "@id": "#mix",
      "name": "Mix",
      "text": ["Combine until no dry flour remains."],
      "flow:inputs": [{ "@id": "#flour" }, { "@id": "#milk" }],
      "flow:output": { "@id": "#batter" }
    },
    {
      "@type": "HowToStep",
      "@id": "#rest",
      "name": "Rest",
      "text": [],
      "flow:timing": "20 minutes",
      "flow:inputs": [{ "@id": "#batter" }],
      "flow:output": { "@id": "#rested-batter" }
    }
  ]
}
```

## Rules

- Use unique local IDs, such as `#soy-milk`, `#soak` and `#soaked-oats`.
  IDs start with a lowercase letter and contain lowercase letters, digits or hyphens.
- Ingredient `name` is the full displayed quantity and label.
  Standard recipe metadata such as `recipeYield` and `description` remains available.
- Each step names its ingredient or earlier-result inputs and one result output.
  A rest, chill or cooking step also produces a new result, even when it adds no ingredients.
- Input order determines the order of ingredient groups in the diagram.
  Usually list the existing mixture first, then the newly added ingredients.
  Step dependencies determine progression; list instructions in reading order too.
- `text` may be a string or a list of detail lines.
  Optional `flow:timing` is displayed beside the operation title.
- Each ingredient entry represents a quantity used once.
  If sugar is used twice, create separate entries for the two quantities.
- Independent preparations can merge into one later step.
  A shared preparation can also split into final steps, as in kombucha.
  The current table generator supports one such split, with at most one branch
  adding new ingredients; that branch appears last so the shared mixture remains contiguous.
  Branches that continue through further steps, multiple shared preparations,
  and other more complex graphs fail with an explicit unsupported-layout error.
  The flow model can describe them, but the table renderer needs extending first.

`flow` is our extension namespace, not a standard Schema.org property set.
This document defines `flow:inputs` (references to consumed ingredients or results),
`flow:output` (the result produced by a step), and `flow:timing` (a readable timing note).
Reusing a result in final branches denotes splitting that preparation;
put the portion quantities in the instruction text, as in the kombucha recipe.
It does not calculate a quantity balance.

The build writes `_data/recipe_views.json` only inside its temporary staging directory.
The published page includes ordinary Schema.org Recipe JSON-LD with ingredient
strings and ordered steps; custom flow data is omitted and timing is included in step text.
Other recipe tools can read that standard representation, but it cannot preserve the flow graph.
Invalid references, duplicate IDs, unused ingredients, cycles and unsupported layouts stop the build.

Check the generator with `node --test scripts/recipe-flow.test.mjs`.
Build with `nix develop -c bin/build-site`, or preview with
`nix develop -c bin/serve-site` at `http://localhost:4000/recipes/`.
