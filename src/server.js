import process from 'node:process';

import cors from 'cors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import addProxies from './addProxies.js';
import { createBabelProxy } from './babel-proxy.js';
import { createCacheControlMiddleware } from './cacheControl.js';
import config from './config.js';

const HOUR = 3600;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

const app = express();
app.use(cors());
app.use(
  createCacheControlMiddleware({
    browser: MONTH,
    server: MONTH,
  }),
);
addProxies(app);
if (!config.noBabel) app.use(createBabelProxy());

const parsedProxyTarget = new URL(config.proxyTarget);
if (parsedProxyTarget.protocol === 'file:') {
  app.use(express.static(parsedProxyTarget.pathname));
} else {
  app.use(
    createProxyMiddleware({
      target: config.proxyTarget,
      secure: true,
      changeOrigin: true,
      on: {
        proxyRes: (proxyRes, req) => {
          if (
            req.path.endsWith('.js') ||
            req.path.endsWith('.mjs') ||
            req.path.endsWith('.cjs')
          ) {
            proxyRes.headers['Content-Type'] = 'application/javascript';
          }
        },
      },
    }),
  );
}

const server = app.listen(config.port, function listenCallback() {
  // eslint-disable-next-line no-console
  console.log(`Local proxy URL: http://localhost:${config.port}/`);
  // eslint-disable-next-line no-console
  console.log(`listening on port ${config.port}`);
});

function exitHandler() {
  server.close();
}

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
