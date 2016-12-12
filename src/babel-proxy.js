'use strict';

const babel = require('babel-core');
const fetch = require('node-fetch');
const url = require('url');
const config = require('./config');

module.exports = function () {
    return function (req, res, next) {
        if (isJs(req)) {
            fetch(url.resolve(config.proxyTarget, req.path))
                .then(response => {
                    if(response.status >= 400) {
                        invalidateCache(res);
                        return null;
                    }
                    return response.text()
                })
                .then(txt => {
                    if(txt === null) return next();
                    const transformed = babel.transform(txt, {
                        presets: ['es2017'],
                        plugins: ['transform-es2015-modules-amd-if-required'],
                        minified: false,
                        ast: false
                    });
                    console.log('transformed', config.proxyTarget, req.path);
                    res.set('Content-Type', 'text/plain');
                    res.send(transformed.code);
                }).catch(() => {
                invalidateCache(res);
                console.log('failed to transform', config.proxyTarget, req.path);
                next(); // fallback to proxy
            });
        } else {
            next();
        }
    }
};

function invalidateCache(res) {
    res.set('Cache-Control', 'max-age=0, s-maxage=0');
}

function isJs(req) {
    return req.path.endsWith('.js') && req.method === 'GET';
}
