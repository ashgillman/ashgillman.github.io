# Development and publishing

The checked-in post sources are authoritative. Write new posts in Org or
Markdown under `_posts/`; the build never edits those files. An Org post is
exported to Jekyll-compatible HTML during the build. When an Org and Markdown
file have the same basename, the Markdown file is retained as the canonical
source for that post.

Use the pinned Nix environment for every local build:

```sh
nix develop
bin/build-site
bin/serve-site
```

Each build writes to a new ignored `.site-build.*` directory and never deletes
or reuses an existing directory. `bin/serve-site` starts a local preview at
`http://localhost:4000`. It watches the generated staging tree; after changing
an Org file, stop it and run the command again so the post is exported before
Jekyll reloads it.

GitHub Actions runs the same `bin/build-site` command on each pull request and
deploys the generated `_site` directory only after a push to `master`.

## Recipe pages

Add one Schema.org `Recipe` JSON file under `_data/recipes/` for each recipe.
Keep ingredient text in `recipeIngredient` and operation names and text in
`recipeInstructions`; this same content supplies the visible table and JSON-LD.
Add a matching `_data/trn/<slug>.json` file for diagram geometry only. Its
`cells` list diagram cells by zero-based `row` and `column`, with an
`ingredient` or `instruction` index. Optional `rowSpan` and `columnSpan` values
join ingredient rows beneath one operation and let parallel operations branch
across columns. Keep each ingredient and instruction in one cell; leave gaps
for unused diagram positions.

The page automatically lists every file under `_data/recipes/` with a matching
file under `_data/trn/`; no page edit is needed when adding a recipe. Recipe
styles live in `css/recipes.css`, loaded only on that page. To preview changes,
stop the current `bin/serve-site` process, rebuild with `bin/build-site`, then
restart `bin/serve-site`; the staging tree is served at
`http://localhost:4000/recipes/`. Pass Jekyll options after the script name to
use another port when needed, for example `bin/serve-site --port 4001`.

## Future generated material

The build copies sources to a unique staging directory, exports Org files there, then runs
each executable `scripts/site-generators/*.sh` before Jekyll builds the site.
Future generators can safely turn checked-in data, such as recipe JSON, into
pages, figures, or interactive assets by writing to the staging directory that
is supplied as their second argument. They must not modify source files.
