'use strict';

const babel = require('babel-core');
const fetch = require('node-fetch');
const url = require('url');
const config = require('./config');

module.exports = function () {
    return function(req, res, next) {
        console.log('babel proxy middleware');
        if(isJs(req)) {
            fetch(url.resolve(config.proxyTarget, req.path))
                .then(res => res.text())
                .then(txt => {
                console.log(txt);
                res.send(babel.transform(txt));
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