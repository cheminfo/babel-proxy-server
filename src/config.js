'use strict';

const config = require('minimist')(process.argv.slice(2));
const url = require('url');

if (!config.proxyTarget) throw new Error('Invalid configuration');
config.port = config.port || 9898;

const parsed = url.parse(config.proxyTarget);
if(parsed.protocol === 'file:') {
    config.isLocal = true;
    config.path = parsed.path;
}

module.exports = config;
