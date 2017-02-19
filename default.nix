with import <nixpkgs> { };

let jekyll_env = bundlerEnv rec {
    name = "ashGillmanGithubIoEnv";
    ruby = ruby_2_2;
    gemfile = ./Gemfile;
    lockfile = ./Gemfile.lock;
    gemset = ./gemset.nix;
  };
in stdenv.mkDerivation rec {
  name = "jekyll_env";
  buildInputs = [ jekyll_env nodejs ];

  shellHook = ''
    exec bundle exec ${jekyll_env}/bin/jekyll serve --config _config.yml,_config-dev.yml --watch
  '';
    # exec ${jekyll_env}/bin/jekyll serve --watch
}
