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

## Future generated material

The build copies sources to a unique staging directory, exports Org files there, then runs
each executable `scripts/site-generators/*.sh` before Jekyll builds the site.
Future generators can safely turn checked-in data, such as recipe JSON, into
pages, figures, or interactive assets by writing to the staging directory that
is supplied as their second argument. They must not modify source files.
