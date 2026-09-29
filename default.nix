# Compatibility entry point for existing `nix-shell` users.
# New development should use `nix develop` so the flake lock controls nixpkgs.
(builtins.getFlake (toString ./.)).devShells.${builtins.currentSystem}.default
