/**
 * Created by paulp on 7/4/2017.
 */
const gulp = require('gulp');
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");

gulp.task('default', ['build-es']);

gulp.task('dev', function() {
  return gulp.watch('src/**/*.js', ['build']);
});

gulp.task('build-es', function() {
  return gulp.src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("es"));
});

gulp.task('build-min', function() {
  return gulp.src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
      plugins: ['transform-es2015-modules-amd']
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("bundles"));
});