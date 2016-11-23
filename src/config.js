'use strict';

const config = require('minimist')(process.argv.slice(2));

if(!config.proxyTarget) throw new Error('Invalid configuration');
config.port = config.port || 9898;

module.exports = config;
