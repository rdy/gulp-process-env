const spy = require('through2-spy');

const noop = () => {};

const privates = new WeakMap();

module.exports = function(environment, fn) {
  const stream = spy.obj(() => {
    if (!privates.get(environment)) {
      const env = Object.keys(environment).reduce(function(memo, k) {
        memo[k] = process.env[k];
        process.env[k] = environment[k];
        return memo;
      }, {});
      privates.set(environment, {env, fn});
    }
  });
  return Object.assign(stream, {
    restore() {
      return spy.obj(noop).once('finish', () => {
        const {env, fn} = privates.get(environment);
        if (env) {
          Object.keys(env).forEach(k => {
            if (env[k] === undefined) {
              delete process.env[k];
            } else {
              process.env[k] = env[k]
            }
          });
          privates.delete(environment);
          if (fn) fn();
        }
      });
    }
  });
};