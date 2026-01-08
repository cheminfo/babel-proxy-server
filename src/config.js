import minimist from 'minimist';

const config = minimist(process.argv.slice(2));

if (! config.proxyTarget && import.meta.dirname.match('/git')) {
  config.proxyTarget='file://'+import.meta.dirname.replace(/(\/git\/).*/,'$1');
  console.log('Using as home directory: '+config.proxyTarget);
}

if (!config.proxyTarget) throw new Error('Invalid configuration');
config.port = config.port || 9898;

const parsed = new URL(config.proxyTarget);
if (parsed.protocol === 'file:') {
  config.isLocal = true;
  config.path = parsed.pathname;
}

export default config;

