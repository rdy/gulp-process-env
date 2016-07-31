const {obj: through} = require('through2');

const privates = new WeakMap();

module.exports = function(environment, fn) {
  const stream = through((chunk, enc, next) => {
    if (!privates.get(environment)) {
      const env = Object.keys(environment).reduce(function(memo, k) {
        memo[k] = process.env[k];
        process.env[k] = environment[k];
        return memo;
      }, {});
      privates.set(environment, {env, fn});
    }
    next(null, chunk);
  });
  return Object.assign(stream, {
    restore() {
      return through((chunk, env, next) => next(null, chunk), flush => {
        const {env, fn} = privates.get(environment);
        if (env) {
          Object.keys(env).forEach(k => {
            if (env[k] === undefined) {
              delete process.env[k];
            } else {
              process.env[k] = env[k];
            }
          });
          privates.delete(environment);
          if (fn) fn();
        }
        flush();
      });
    }
  });
};