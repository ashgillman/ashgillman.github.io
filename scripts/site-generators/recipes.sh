#!/usr/bin/env bash
set -euo pipefail
node "$1/scripts/recipe-flow.mjs" "$1" "$2"
