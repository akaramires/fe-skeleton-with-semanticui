'use strict';

// $ echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

var gulp = require('gulp');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var rigger = require('gulp-rigger');
var browserSync = require('browser-sync').create();

var path = {
    dist: {
        js: 'dist/js',
        css: 'dist/css',
        html: 'dist'
    },
    src: {
        js: 'src/js',
        scss: 'src/scss',
        html: 'src/html',
        semantic: 'src/semanticui/dist'
    }
};

// JS

gulp.task('js:vendor', function () {
    return gulp.src([
            './node_modules/jquery/dist/jquery.min.js',
            path.src.semantic + '/semantic.min.js'
        ])
        .pipe(plumber())
        .pipe(concat('vendor.min.js'))
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.dist.js));
});

gulp.task('js:app', function () {
    gulp.src(path.src.js + '/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.dist.js));
});

// CSS

gulp.task('css:vendor', [], function () {
    return gulp.src([
            path.src.semantic + '/semantic.min.css',
            './node_modules/font-awesome/css/font-awesome.min.css'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.min.css'))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.dist.css));
});

gulp.task('scss:app', function () {
    gulp.src(path.src.scss + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('app.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css));
});

// HTML

gulp.task('html', function () {
    gulp.src(path.src.html + '/*.html')
        .pipe(plumber())
        .pipe(rigger())
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.dist.html));
});

gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });


    watch([path.src.scss + '/**/*.scss'], function (event, cb) {
        gulp.start('scss:app');
        browserSync.reload();
    });

    watch([path.src.js + '/**/*.js'], function (event, cb) {
        gulp.start('js:app');
        browserSync.reload();
    });

    watch([path.src.html + '/**/*.html'], function (event, cb) {
        gulp.start('html');
        browserSync.reload();
    });
});

gulp.task('vendor', ['js:vendor', 'css:vendor']);
gulp.task('app', ['js:app', 'scss:app', 'html']);

gulp.task('default', ['watch']);