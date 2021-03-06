with import <nixpkgs> { };

let jekyll_env = bundlerEnv rec {
    name = "ashGillmanGithubIoEnv";
    gemdir = ./.;
  };

  watch = writeScriptBin "watch" ''
    #!${stdenv.shell}
    exec bundle exec ${jekyll_env}/bin/jekyll serve --config _config.yml,_config-dev.yml --watch --livereload
  '';

  update = writeScriptBin "update" ''
    #!${stdenv.shell}
    rm Gemfile.lock
    bundix --magic
  '';

in stdenv.mkDerivation rec {
  name = "jekyll_env";
  buildInputs = [ jekyll_env nodejs bundix zlib watch update ];
  shellHook = ''
    export LC_ALL="C.UTF-8"
    export LANG="en_US.UTF-8"
    export LANGUAGE="en_US.UTF-8"
  '';
}
