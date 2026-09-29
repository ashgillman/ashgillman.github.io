{
  description = "Ash Gillman's GitHub Pages site";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";

  outputs = { self, nixpkgs }:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "x86_64-linux" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
          jekyllGems = pkgs.bundlerEnv {
            name = "ashgillman-github-io-gems";
            gemdir = ./.;
            ruby = pkgs.ruby_3_3;
          };
        in {
          default = pkgs.mkShell {
            packages = [
              jekyllGems
              pkgs.emacs
              pkgs.bundix
              pkgs.nodejs
              pkgs.rsync
            ];

            shellHook = ''
              export LC_ALL="C.UTF-8"
              export LANG="en_US.UTF-8"
            '';
          };
        });
    };
}
