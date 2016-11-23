'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const babelProxy = require('./babel-proxy');
const proxy = require('http-proxy-middleware');
const config = require('./config');

app.use(cors());
app.use(babelProxy());
app.use(proxy({
    target: config.proxyTarget,
    secure: true,
    logLevel: 'debug',
    changeOrigin: true
}));

app.listen(config.port, function () {
    console.log(`listening on port ${config.port}`);
});