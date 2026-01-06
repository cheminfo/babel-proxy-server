# babel-proxy-server
A proxy server which converts js files in commonjs or esm modules to amd modules.

The purpose of this service is to load code from https://github.com/cheminfo-js/visualizer-helper into
visualizer views with the proper module format.

# How to test your changes in the visualizer?

## Using docker compose (full compatibility)

This is the recommended way to test your changes.
visualizer-helper is not self-contained and also loads external dependencies from `www.lactame.com/lib/`, so running
the proxy is not enough to load all the dependencies correctly.

First `cp .env.example .env` and edit it (following instructions in the file)

Then, run `docker compose up -d --build`

Finally, in your view, open the general preferences and replace the `vh` alias by `http://localhost:9898/cheminfo-js/visualizer-helper`.

# Running the proxy locally (partially compatible)

> [!WARNING]  
> This legacy method might not fully work to test your changes in the visualizer.

This assumes the project is installed within a `git` folder which has `visualizer-helper` folder with a clone of https://github.com/cheminfo-js/visualizer-helper.

```
npm run server-dev
```

You can also pass the `--proxyTarget` option if you have a different setup.

```
npm run server-dev -- --proxyTarget=file:///Users/xyz/github/
```

# How to use it ?

You just need to specify where the original files are either on a http server or a local file system.

## Local files

Don't forget to add 3 forward slashes `/`

```
node src/server.js --proxyTarget=file:///Users/xyz/git/
``` 

## Over http

```
node src/server.js --proxyTarget=https://raw.githubusercontent.com
``` 

Options:
* --noBabel : use it only as a proxy, don't transpile


This instruction would then create a webserver using as base `proxyTarget` URL. Any files which match the
`visualizer-helper` pattern are transpiled with babel and transformed into AMD modules. Any other files are served as is.

If the transform fails, files are served as is.

