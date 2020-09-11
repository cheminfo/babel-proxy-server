const { readFileSync, existsSync } = require("fs");
const { join } = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

function addProxies(app) {
  let proxies = [];

  let proxyConfigFile = join(__dirname, "proxy.json");
  if (existsSync(proxyConfigFile)) {
    proxies = JSON.parse(readFileSync(proxyConfigFile, "utf8"));
    for (let proxy of proxies) {
      app.use(
        proxy.path,
        createProxyMiddleware({
          target: proxy.server,
          changeOrigin: true,
        })
      );
    }
  }
}

module.exports = addProxies;
