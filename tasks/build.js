const {babel, plumber} = require('gulp-load-plugins')();
const del = require('del');
const gulp = require('gulp');
const mergeStream = require('merge-stream');
const runSequence = require('run-sequence');

gulp.task('clean', done => {
  del(['dist', '!dist/.gitkeep']).then(() => done(), done);
});

gulp.task('build', done => runSequence('clean', 'babel', done));

gulp.task('babel', () => {
  return mergeStream(
    gulp.src(['index.js'], {base: '.'}).pipe(plumber()).pipe(babel()),
    gulp.src(['LICENSE', 'README.md', 'package.json'], {base: '.'}).pipe(plumber())
  ).pipe(gulp.dest('dist'));
});

gulp.task('build', done => runSequence('clean', 'babel', done));

gulp.task('watch', ['build'], () => {
  gulp.watch(['index.js', 'src/**/*.js'], ['babel']);
});