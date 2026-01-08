import url from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import babel from '@babel/core';
import config from './config.js';


export default function () {
  return function (req, res, next) {
    if (shouldTransform(req)) {
      if (config.isLocal) {
        try {
          // Is this required for security reasons??
          const p = req.path.replace(/\.\./g, '.');
          doBabel(req, res, fs.readFileSync(path.join(config.path, p)));
        } catch (e) {
          console.log(e);
          console.log('failed to transform', config.proxyTarget, req.path);
          return next(); // fallback to static asset
        }
        // no static asset fallback
      } else {
        fetch(url.resolve(config.proxyTarget, req.path.replace(/^\//, '')))
          .then((response) => {
            if (response.status >= 400) {
              invalidateCache(res);
              return null;
            }
            return response.text();
          })
          .then((txt) => {
            if (txt === null) return next(); // fallback to proxy
            doBabel(req, res, txt);
          })
          .catch((e) => {
            invalidateCache(res);
            console.log(
              'failed to transform',
              config.proxyTarget,
              req.path,
              e.message,
            );
            next(); // fallback to proxy
          });
      }
    } else {
      // use fallback
      next();
    }
  };
};


function doBabel(req, res, txt) {
    const transformed = babel.transform(txt, {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        browsers: [
                            'last 2 chrome versions',
                            'last 2 firefox versions',
                            'last 1 safari version',
                        ],
                    },
                },
            ],
        ],
        plugins: ['@zakodium/babel-plugin-transform-modules-amd'],
        minified: false,
        ast: false,
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
