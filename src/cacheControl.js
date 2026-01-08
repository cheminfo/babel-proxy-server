export default function(options) {
  return function(req, res, next) {
    const cache = [];
    if (options.browser !== undefined) {
      cache.push('max-age=' + options.browser);
    }
    if (options.server !== undefined) {
      cache.push('s-maxage=' + options.server);
    }

    if (cache.length) {
      res.set('Cache-Control', cache.join(', '));
    }

    next();
  };
};
