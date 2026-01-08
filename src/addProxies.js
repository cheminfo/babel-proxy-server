import {createProxyMiddleware} from "http-proxy-middleware";
import config from "./config.js";

export default function addProxies(app) {
  let additionalProxies = config.additionalProxies;
  if (additionalProxies) {
    for (let proxy of additionalProxies) {
        console.log('Adding proxy', proxy.path, proxy.server);
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
