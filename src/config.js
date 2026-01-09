import minimist from 'minimist';
import url from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const config = minimist(process.argv.slice(2));

if (!config.proxyTarget) {
  if (process.env.GITHUB_DIR) {
    const baseDir = path.join(import.meta.url, '..');
    const dir = path.resolve(baseDir, process.env.GITHUB_DIR);
    config.proxyTarget = url.pathToFileURL(dir).toString();
  } else if (import.meta.dirname.match('/git')) {
    config.proxyTarget = import.meta.url.replace(/(\/git\/).*/, '$1');
  }
}

if (process.env.PROXY_CONFIG_FILE) {
  const target = path.resolve(
    import.meta.dirname,
    '..',
    process.env.PROXY_CONFIG_FILE,
  );
  const exists = fs.existsSync(target);
  if (!exists) {
    throw new Error(
      `Invalid configuration, proxy config file not found: ${target}`,
    );
  }
  config.additionalProxies = JSON.parse(fs.readFileSync(target, 'utf-8'));
}

if (!config.proxyTarget)
  throw new Error('Invalid configuration, missing proxyTarget');

console.log('Proxy target: ', config.proxyTarget);
config.port = config.port || 9898;

const parsed = new URL(config.proxyTarget);
if (parsed.protocol === 'file:') {
  config.isLocal = true;
  config.path = parsed.pathname;
}

export default config;
