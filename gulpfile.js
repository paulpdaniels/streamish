/**
 * Created by paulp on 7/4/2017.
 */
var gulp = require('gulp');
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");

gulp.task('default', ['build']);

gulp.task('dev', function() {
  return gulp.watch('src/**/*.js', ['build']);
});

gulp.task('build', function() {
  return gulp.src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("lib"));
});