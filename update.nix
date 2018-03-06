with import <nixpkgs> { };

let
  update = writeScriptBin "update" ''
    #!${stdenv.shell}
    rm Gemfile.lock
    bundix --magic
    rm -rf .bundle vendor
  '';

in stdenv.mkDerivation rec {
  name = "jekyll_env";
  buildInputs = [ nodejs bundix zlib update ];
  # shellHook = "exec update";
}
