# gulp-process-env

A utility to allow setting and restoring of environment variables for streams, specifically with gulp.

```
  var jasmine = require('gulp-jasmine');
  var processEnv = require('gulp-process-env')
  
  var env = processEnv({NODE_ENV: 'test', other: 'property});
  
  gulp.src('**/*.js')
    .pipe(env)           // Sets the environment
    .pipe(jasmine())     // Jasmine gulp task runs with NODE_ENV test
    .pipe(env.restore()) // NODE_ENV is restored back to the original state
```