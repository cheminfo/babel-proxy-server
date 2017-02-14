'use strict';

const babel = require('babel-core');
const fetch = require('node-fetch');
const url = require('url');
const config = require('./config');

module.exports = function () {
    return function (req, res, next) {
        if (shouldTransform(req)) {
            fetch(url.resolve(config.proxyTarget, req.path.replace(/^\//, '')))
                .then(response => {
                    if(response.status >= 400) {
                        invalidateCache(res);
                        return null;
                    }
                    return response.text();
                })
                .then(txt => {
                    if(txt === null) return next(); // fallback to proxy
                    const transformed = babel.transform(txt, {
                        presets: [['env', {targets: {browsers: ['last 2 chrome versions', 'last 2 firefox versions', 'last 1 safari version', 'last 2 edge versions']}}]],
                        plugins: ['transform-es2015-modules-amd-if-required'],
                        minified: false,
                        ast: false
                    });
                    console.log('transformed', config.proxyTarget, req.path);
                    res.set('Content-Type', 'application/javascript');
                    res.send(transformed.code);
                }).catch(() => {
                invalidateCache(res);
                console.log('failed to transform', config.proxyTarget, req.path);
                next(); // fallback to proxy
            });
        } else {
            next(); // proxy
        }
    }
};

function invalidateCache(res) {
    res.set('Cache-Control', 'max-age=0, s-maxage=0');
}

function shouldTransform(req) {
    return req.path.endsWith('.js') && req.method === 'GET' && req.path.match('visualizer-helper');
}
