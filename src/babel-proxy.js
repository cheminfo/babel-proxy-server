'use strict';

const babel = require('babel-core');
const fetch = require('node-fetch');
const url = require('url');
const config = require('./config');
const fs = require('fs');
const path = require('path');

module.exports = function () {
    return function (req, res, next) {
        if (shouldTransform(req)) {
            if (config.isLocal) {
                try {
                    // Is this required for security reasons??
                    const p = req.path.replace(/\.\./g, '.');
                    doBabel(req, res, fs.readFileSync(path.join(config.path, p)));
                } catch (e) {
                    console.log('failed to transform', config.proxyTarget, req.path);
                    return next(); // fallback to static asset
                }
                // no static asset fallback
            } else {
                fetch(url.resolve(config.proxyTarget, req.path.replace(/^\//, '')))
                    .then(response => {
                        if (response.status >= 400) {
                            invalidateCache(res);
                            return null;
                        }
                        return response.text();
                    })
                    .then(txt => {
                        if (txt === null) return next(); // fallback to proxy
                        doBabel(req, res, txt);
                    }).catch(e => {
                    invalidateCache(res);
                    console.log('failed to transform', config.proxyTarget, req.path, e.message);
                    next(); // fallback to proxy
                });
            }
        } else {
            // use fallback
            next();
        }
    }
};

function doBabel(req, res, txt) {
    const transformed = babel.transform(txt, {
        presets: [['env', {targets: {browsers: ['last 2 chrome versions', 'last 2 firefox versions', 'last 1 safari version', 'last 2 edge versions']}}]],
        plugins: ['transform-es2015-modules-amd-if-required'],
        minified: false,
        ast: false
    });
    res.set('Content-Type', 'application/javascript');
    res.send(transformed.code);
    console.log('transformed', config.proxyTarget, req.path);

}

function invalidateCache(res) {
    res.set('Cache-Control', 'max-age=0, s-maxage=0');
}

function shouldTransform(req) {
    if (req.query.noBabel) return false;
    if (!req.path.endsWith('.js')) return false;
    console.log('ends with js', req.path);
    if (config.isLocal) return true;
    return req.method === 'GET' && req.path.match('visualizer-helper');
}
