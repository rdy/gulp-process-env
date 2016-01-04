const gulp = require('gulp');
const {jasmine, plumber} = require('gulp-load-plugins')();

function spec() {
  return gulp.src(['spec/**/*_spec.js'], {base: '.'})
    .pipe(plumber())
    .pipe(jasmine({includeStackTrace: true}));
}

gulp.task('spec', spec);

module.exports = {
  spec
};