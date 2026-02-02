{
  description = "Vue + Node + Postgres dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        nodejs = pkgs.nodejs_20; # Change if you need another version
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            # Node / Frontend
            nodejs
            nodePackages.pnpm
            nodePackages.yarn

            # Vue tooling helpers
            nodePackages.typescript
            nodePackages.typescript-language-server
            nodePackages.eslint
            nodePackages.prettier

            # Database
            postgresql_16
            pgcli        # nice CLI for Postgres
            libpq        # headers/libs for node pg bindings

            # General dev stuff
            git
            gnumake
            openssl
            pkg-config
            jq
          ];

          shellHook = ''
            echo "🚀 Vue + Node + Postgres dev shell ready"

            # Node
            export NODE_ENV=development

            # Local Postgres setup
            export PGDATA=$PWD/.pgdata
            export PGHOST=$PWD/.pgsocket
            export PGHOST=localhost
            export PGPORT=5432
            export PGUSER=postgres

            mkdir -p "$PGHOST"

            if [ ! -d "$PGDATA" ]; then
              echo "📦 Initializing local Postgres cluster in .pgdata"
              initdb -D "$PGDATA" >/dev/null
            fi

            # Aliases
            alias pgstart='pg_ctl -D .pgdata -l logfile -o "-k $PGHOST" start'
            alias pgstop='pg_ctl -D .pgdata stop'
            alias pgstatus='pg_ctl -D .pgdata status'
            alias pglog='tail -f logfile'

            echo ""
            echo "🗄  Postgres commands:"
            echo "   pgstart   → start database"
            echo "   pgstop    → stop database"
            echo "   pgstatus  → check status"
            echo "   pglog     → live logs"
            echo ""
            '';
        };
      });
}
