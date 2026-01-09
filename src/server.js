import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

import cacheControl from './cacheControl.js';
import babelProxy from './babel-proxy.js';
import config from './config.js';
import addProxies from './addProxies.js';

const HOUR = 3600;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

const app = express();
app.use(cors());
app.use(
  cacheControl({
    browser: MONTH,
    server: MONTH,
  }),
);
addProxies(app);
if (!config.noBabel) app.use(babelProxy());

if (config.noBabel) console.log('Not using babel proxy');
const parsedProxyTarget = new URL(config.proxyTarget);
if (parsedProxyTarget.protocol === 'file:') {
  app.use(express.static(parsedProxyTarget.pathname));
} else {
  app.use(
    createProxyMiddleware({
      target: config.proxyTarget,
      secure: true,
      changeOrigin: true,
      onProxyRes: function (proxyRes, req) {
        if (req.path.endsWith('.js')) {
          proxyRes.headers['Content-Type'] = 'application/javascript';
        }
      },
    }),
  );
}

const server = app.listen(config.port, function () {
  console.log('Local proxy URL: http://localhost:' + config.port + '/');
  console.log(`listening on port ${config.port}`);
});

function exitHandler() {
  server.close();
}

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
