#!/usr/bin/env bash
set -euo pipefail

exec nix develop .#default -c bundix --magic
