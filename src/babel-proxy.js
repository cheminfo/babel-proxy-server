'use strict';

const babel = require('babel-core');
const fetch = require('node-fetch');
const url = require('url');
const config = require('./config');

module.exports = function () {
    return function (req, res, next) {
        if (isJs(req)) {
            fetch(url.resolve(config.proxyTarget, req.path))
                .then(res => res.text())
                .then(txt => {
                    const transformed = babel.transform(txt, {
                        presets: ['es2017']
                    });
                    console.log('transformed', config.proxyTarget, req.path);
                    res.set('Content-Type', 'text/plain');
                    res.send(transformed);
                }).catch(() => {
                console.log('failed to transform', config.proxyTarget, req.path);
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