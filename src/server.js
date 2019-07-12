'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const cacheControl = require('./cacheControl');
const babelProxy = require('./babel-proxy');
const proxy = require('http-proxy-middleware');
const config = require('./config');
const url = require('url');

const HOUR = 3600;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

app.use(cors());
app.use(
  cacheControl({
    browser: MONTH,
    server: MONTH
  })
);

if (!config.noBabel) app.use(babelProxy());

if (config.noBabel) console.log('Not using babel proxy');
console.log(__dirname.replace());
const parsedProxyTarget = url.parse(config.proxyTarget);
if (parsedProxyTarget.protocol === 'file:') {
  app.use(express.static(parsedProxyTarget.pathname));
} else {
  app.use(
    proxy({
      target: config.proxyTarget,
      secure: true,
      changeOrigin: true,
      onProxyRes: function(proxyRes, req) {
        if (req.path.endsWith('.js')) {
          proxyRes.headers['Content-Type'] = 'application/javascript';
        }
      }
    })
  );
}

app.listen(config.port, function() {
  console.log(`listening on port ${config.port}`);
  console.log('Local proxy URL: http://localhost:' + config.port + '/');
});
