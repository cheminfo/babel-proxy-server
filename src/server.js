'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const cacheControl = require('./cacheControl');
const babelProxy = require('./babel-proxy');
const proxy = require('http-proxy-middleware');
const config = require('./config');

const HOUR = 3600;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

app.use(cors());
app.use(cacheControl({
    browser: MONTH,
    server: MONTH
}));
app.use(babelProxy());
app.use(proxy({
    target: config.proxyTarget,
    secure: true,
    changeOrigin: true
}));

app.listen(config.port, function () {
    console.log(`listening on port ${config.port}`);
});