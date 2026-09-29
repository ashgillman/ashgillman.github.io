#!/usr/bin/env bash
set -euo pipefail

exec nix develop .#default -c bin/serve-site
