# Local development instructions

Use `nix develop -c bin/build-site` to build the site.
Use `nix develop -c bin/serve-site` to build and serve a fresh local preview at `http://localhost:4000`.
Pass Jekyll options after the script to select another port when necessary, such as `nix develop -c bin/serve-site --port 4001`.
Local development builds and preview servers are authorized without further approval.
Do not stage, commit, or push changes unless explicitly requested.

Recipe authoring conventions and preview details are documented in `DEVELOPMENT.md`.
