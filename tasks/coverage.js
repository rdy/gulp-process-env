const {babelIstanbul: istanbul} = require('gulp-load-plugins')();
const del = require('del');
const gulp = require('gulp');
const {spec} = require('./spec');

gulp.task('clean-coverage', done => {
  del(['coverage']).then(() => done(), done);
});

gulp.task('coverage-hook-require', () => {
  return gulp.src(['index.js'], {base: '.'})
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

function checkCoverage() {
  return spec().pipe(istanbul.enforceThresholds({thresholds: {global: 87}}));
}

gulp.task('check-coverage', ['coverage-hook-require'], checkCoverage);

gulp.task('coverage', ['clean-coverage', 'coverage-hook-require'], () => {
  return checkCoverage().pipe(istanbul.writeReports({dir: 'coverage'}));
});
