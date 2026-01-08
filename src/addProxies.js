import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {createProxyMiddleware} from "http-proxy-middleware";

export default function addProxies(app) {
  let proxies = [];

  let proxyConfigFile = join(import.meta.dirname, "proxy.json");
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
