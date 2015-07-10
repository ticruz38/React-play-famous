'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var _ = require('lodash');

var paths = {
  scripts: ['./components/**/*.jsx', './stores/**/*.js']
};

// add custom browserify options here
var customOpts = {
  entries: ['./client.js'],
  debug: true
};
var opts = _.assign({}, watchify.args, customOpts);
var b = browserify(customOpts);
var w = watchify(browserify(opts));
//b.on('log', gutil.log); // output build logs to terminal
// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', ['watch'], bundle); // so you can run `gulp js` to build the file
gulp.task('default', ['js'], nodemon);

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['js']);
});

function nodemon() {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  });
}

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}
