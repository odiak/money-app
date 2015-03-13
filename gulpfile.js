var gulp = require('gulp')
var concat = require('gulp-concat');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var webpack = require('gulp-webpack');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var DIST_DIR = './public/dist';

var JS_FILE = './client/js/app.js';
var JS_FILES = './client/js/**/*.js';
var WEBPACK_OPTIONS = {
  output: {
    filename: 'app.js'
  }
};

var SASS_FILE = './client/scss/app.scss';
var SASS_FILES = './client/scss/**/*.scss';
var CSS_FILE = 'app.css';
var SASS_OPTIONS = {
  errLogToConsole: true
};

var NODE_ENV = process.env.NODE_ENV || 'development';
var isProduction = (NODE_ENV === 'production');

gulp.task('build', ['build:js', 'build:css']);

gulp.task('build:js', function () {
  gulp.src(JS_FILE)
    .pipe(webpack(WEBPACK_OPTIONS))
    .pipe(gulpIf(isProduction, uglify()))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('build:css', function() {
  gulp.src(SASS_FILE)
    .pipe(sass(SASS_OPTIONS))
    .pipe(concat(CSS_FILE))
    .pipe(gulpIf(isProduction, minifyCSS()))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('default', ['build']);

gulp.task('watch', function () {
  watch(JS_FILES, function () {
    gulp.start('build:js');
  });
  watch(SASS_FILES, function () {
    gulp.start('build:css');
  });
});
