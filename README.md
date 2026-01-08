# babel-proxy-server
A proxy server which converts js files in commonjs or esm modules to amd modules.

The purpose of this service is to load code from https://github.com/cheminfo-js/visualizer-helper into
visualizer views with the proper module format.

# Running the proxy locally

First `cp .env.example .env` and edit it (following instructions in the file).

```
npm run server
```

# How to test your changes in the visualizer?

Run the proxy locally as described above, then set the `vh` alias to be
`http://localhost:9898/cheminfo-js/visualizer-helper` in the general configuration of your view.

# Options

`--proxyTarget`

The URL the proxy should serve. The url can be a file URL and it will serve files from the local file system.
Within that location, any files which match the `visualizer-helper` pattern are transpiled with babel and
transformed into AMD modules. Any other files are served as is.

default: parent `git` directory relative to where you cloned this repository.

```bash
# Server local files
node src/server.js --proxyTarget=file:///Users/xyz/git/

# Serve remote http endpoint
node src/server.js --proxyTarget=https://raw.githubusercontent.com
``` 

`--noBabel`

Use it only as a proxy, don't transpile

default: `false`


# Additional proxies

You can configure additional simple proxies using the a json configuration file.

Set the `PROXY_CONFIG_FILE` environment variable to point the configuration file.
See [this file](./dev/proxy.json) as example.
