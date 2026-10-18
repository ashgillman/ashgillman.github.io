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

## Brewing posts

Write beer posts under `_posts/` and include `beer` in their front-matter tags, for example `tags: [beer, brewday, saison]`.
The Brews page at `/brews/` automatically lists these posts in reverse chronological order.
The main landing page excludes posts tagged `beer`.
Individual post URLs and the site-wide RSS feed continue to include brewing posts.

## Recipe pages

Add one Schema.org `Recipe` JSON file with the documented `flow` extension under
`_data/recipes/` for each recipe; see `_data/recipes/README.md` for an example.
Record ingredients, instructions and their input/output relationships, without
rows, columns or cell spans.
The build runs `scripts/site-generators/recipes.sh` and `scripts/recipe-flow.mjs`
to validate the recipe graphs and generate `_data/recipe_views.json` in the
staging directory only.
That generated data supplies both the table geometry and standard Schema.org
JSON-LD, without the custom flow properties.
`_data/trn/` sidecars are no longer used.
Run `node --test scripts/recipe-flow.test.mjs` for generator checks.

The page automatically lists every recipe JSON file; no page edit is needed
when adding a recipe.
Recipe styles live in `css/recipes.css`, loaded only on that page. To preview changes,
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
