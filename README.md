CruddyTables
-------------------------
Tables for CRUD! So simple!  

However, this is actually a sorta website that uses them crud tables. Still a work in progress.

Prereqs
----------------------
First, decide you want to build a webapp. Once you're done with that, decide if you are going to use linux and make. If you're still here then I guess this is for you. You need:

* 'nix box (or VM I guess)
* make
* [nodejs 6+](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) or greater
* [yarn](https://yarnpkg.com/en/docs/install)

To install build dependencies `yarn install`, and you're all set!

Usage
-----------------------
* `make build` (or simply `make`) will build all the js, css, html and copy it to the `build` directory.
* `make serve` to serve up the `build` directory (on all interfaces, port 8080 by default).
* `make watch` to build js, css, html on the fly as files change, serve them up, and create a livereload server.
* `make clean` does the usual.
