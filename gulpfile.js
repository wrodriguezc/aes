// Gulp Dependencies
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var preprocess = require('gulp-preprocess');
var _ = require('lodash');

//File system functions
var del = require('del');
var mkdirSync = require('graceful-fs').mkdirSync;

//Compilation variables
var scriptsDirectory = 'scripts';
var cssDirectory = 'css';
var rootDirectory = 'site';
var destinationDirectory = 'dist';
var productname = 'aes';

gulp.task('clean', function () {
  del.sync([destinationDirectory], {
    force: true
  });
  mkdirSync(destinationDirectory);
});

gulp.task('copy-dependencies', function () {
  var assets = {
    js: [
      './node_modules/dropzone/dist/min/dropzone.min.js',
      './node_modules/bootstrap/dist/js/bootstrap.min.js'
    ],
    css: [
      './node_modules/dropzone/dist/min/dropzone.min.css',
      './node_modules/bootstrap/dist/css/bootstrap.min.css'
    ]
  };
  _(assets).forEach(function (assets, type) {
    gulp.src(assets).pipe(gulp.dest('./' + destinationDirectory + '/assets/' + type));
  });
});

gulp.task('copy-html', function () {
  return gulp.src('html/**')
    .pipe(gulp.dest(destinationDirectory));
});

gulp.task('copy-assets', function () {
  return gulp.src('assets/**')
    .pipe(gulp.dest(destinationDirectory + '/assets'));
});

gulp.task('compile-css-release', function () {
  return gulp.src(cssDirectory + '/main.css')
    .pipe(cssnano({
      reduceIdents: {
        keyframes: false
      }
    }))
    .pipe(rename(productname + '.css'))
    .pipe(gulp.dest(destinationDirectory + '/assets/css'));
});

gulp.task('compile-css', function () {
  return gulp.src(cssDirectory + '/main.css')
    .pipe(rename(productname + '.css'))
    .pipe(gulp.dest(destinationDirectory + '/assets/css'));
});

gulp.task('compile-js', function () {
  return gulp.src(scriptsDirectory + '/main.js')
    .pipe(browserify({}))
    .pipe(rename(productname + '.js'))
    .pipe(gulp.dest(destinationDirectory + '/assets/js'));
});

gulp.task('compile-js-release', function () {
  return gulp.src(scriptsDirectory + '/main.js')
    .pipe(browserify({}))
    .pipe(uglify({}))
    .pipe(rename(productname + '.js'))
    .pipe(gulp.dest(destinationDirectory + '/assets/js'));
});

gulp.task('lint-js', function () {
  return gulp.src(scriptsDirectory + '/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//Default task
gulp.task('release', ['clean', 'lint-js', 'compile-js-release', 'compile-css-release', 'copy-assets', 'copy-dependencies', 'copy-html']);
gulp.task('default', ['clean', 'lint-js', 'compile-js', 'compile-css', 'copy-assets', 'copy-dependencies', 'copy-html']);