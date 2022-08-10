# Demo cookie clicker
Note that this guide is for internal use (as a developer perspective).

## Deku-P

First you need to start the `Deku-cluster` and be sure that all the nodes and the VM are running.

Clone the branch `cookie-game` from Deku.

Run:

```
direnv allow
./dapp.sh build_dune
./dapp.sh build_sdks
./dapp.sh build_cookie
./dapp.sh deku_cluster
```

First build the deku project, then build the VM (sometime we have to remove the folder `node_modules` inside `sdks/deku_js_interop`), then build the cookie game and finally run the Deku cluster.

## Decookie

When the `Deku-cluster` is running, then go inside the `decookie` branch and run:

```
./dapp.sh build_decookie
./dapp.sh build_start
```

First build the decookie project and then start it.
