'use strict';

const gulp         = require('gulp');
const browserSync  = require('browser-sync');
var env            = require('minimist')(process.argv.slice(2));
const nodemon      = require('gulp-nodemon');
const plumber      = require('gulp-plumber');
const gulpif       = require('gulp-if');
const cache        = require('gulp-cache');
//-- pug
const pug          = require('gulp-pug');
//-- post css && stylus
const postcss      = require('gulp-postcss');
const sourcemaps   = require('gulp-sourcemaps'); 
const stylus       = require('gulp-stylus');
const poststylus   = require('poststylus');
const autoprefixer = require('autoprefixer');
const rupture      = require('rupture');
const yeticss      = require('yeticss');
//-- js
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');
//-- images
const imagemin     = require('gulp-imagemin');


// call pug to compile views
gulp.task('pug', () => {
  return gulp.src('views/**/!(_)*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: !env.p
    }))
    .pipe(gulp.dest('public/'));
});


// postcss && stylus
gulp.task('stylus', () => {
  gulp.src('src/css/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      use: [
        poststylus(['autoprefixer',]), yeticss(), rupture()
      ]
    }))
    .pipe(gulp.dest('public/css'));
});


// lossless optimizers for images
gulp.task('imagemin', () => {
  return gulp.src('src/img/**/*')
    .pipe(plumber())
    .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
    .pipe(gulp.dest('public/img'));
});


// call uglify and concat js
gulp.task('js', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulpif(env.p, uglify()))
    .pipe(gulp.dest('public/js'));
});


// browserify
gulp.task('browserify', () => {
  return gulp.src('src/js/main.js')
    .pipe(plumber())
    .pipe(browserify({debug: !env.p}))
    .pipe(gulpif(env.p, uglify()))
    .pipe(gulp.dest('public/js'));
});


// nodemon - start and keep from restarting server
gulp.task('nodemon', () => {
  return nodemon({
    script: 'app.js'
  });
});


//- watch for file changes
gulp.task('watch', () => {
  gulp.watch('views/**/*.pug', ['pug']);
  gulp.watch('src/css/**/*.styl', ['stylus']);
  gulp.watch('src/js/**/*.js', [(env.fy) ? 'browserify' : 'js']);
  gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
});


// enable browserSync
gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 4000
  });
});


gulp.task('default', ['nodemon', 'browser-sync', 'stylus', 'js', 'imagemin', 'watch'], () => {
  console.log('default task has run');
});

