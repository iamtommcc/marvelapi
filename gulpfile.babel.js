/*
 * Task Automation to make my life easier.
 * Author: Jean-Pierre Sierens, with modifications by Thomas McCarthy
 * ===========================================================================
 */


// Change your basic settings here
// ----------------------------------------------------------------------------
const settings = {

  css: {
    enabled: true,
    src: './css/*.scss',
    dest: './css',
    watch: './css/**/*.scss'
  },

  js: {
    enabled: true,
    src: './js/main.es6.js',
    dest: './js/main.js',
    watch: ['./js/**/*.js', '!./js/main.js', './js/**/*.hbs']
  }
}

// ----------------------------------------------------------------------------
//
// ----------------------------------------------------------------------------

// declarations, dependencies
// ----------------------------------------------------------------------------
import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import gutil from 'gulp-util';
import babelify from 'babelify';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import hbsfy from 'hbsfy';
import Handlebars from 'hbsfy/runtime';

import sourceMaps from 'gulp-sourcemaps';
import kebabCase from 'lodash/kebabCase';

// Handlebars helpers;



// Gulp tasks
// ----------------------------------------------------------------------------
if (settings.js.enabled) {
  gulp.task('scripts', function () {
    // Browserify will bundle all our js files together in to one and will let
    // us use modules in the front end.
    browserify(settings.js.src)
      .transform(hbsfy.configure({
        extensions: ['hbs']
      }))
    // transform ES6 and JSX to ES5 with babelify
      .transform("babelify", {presets: ["es2015", "stage-0"]})

      .bundle()
      .on('error',gutil.log)
      .pipe(source(settings.js.dest.split('/').slice(-1)[0]))
      .pipe(gulp.dest(settings.js.dest.split('/').slice(0,-1).join('/')));
  });
}

if (settings.css.enabled) {
  gulp.task('sass', function () {
    gulp.src(settings.css.src)
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([ autoprefixer({ browsers: ['last 3 versions'] }) ]))

      .pipe(sourceMaps.write())
      .pipe(gulp.dest(settings.css.dest))
  });
}

gulp.task('watch', function () {
  if (settings.css.enabled) gulp.watch(settings.css.watch, ['sass']);
  if (settings.js.enabled) gulp.watch(settings.js.watch, ['scripts']);

});

// When running 'gulp' on the terminal this task will fire.
// It will start watching for changes in every .js file.
// If there's a change, the task 'scripts' defined above will fire.
gulp.task('default', ['scripts','watch']);
