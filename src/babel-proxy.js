'use strict';

const babel = require('babel-core');
const fetch = require('node-fetch');
const url = require('url');
const config = require('./config');

module.exports = function () {
    return function(req, res, next) {
        if(isJs(req)) {
            fetch(url.resolve(config.proxyTarget, req.path))
                .then(res => res.text())
                .then(txt => {
                    const transformed = babel.transform(txt);
                    res.set('Content-Type', 'text/plain')
                    res.send(transformed);
                }).catch(() => {
                next(); // fallback to proxy
            });
        } else {
            next();
        }
    }
};

function isJs(req) {
    return req.path.endsWith('.js') && req.method === 'GET';
}