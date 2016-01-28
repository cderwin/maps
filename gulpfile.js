var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');


// Default Task

gulp.task('default', ['sass', 'js', 'fonts', 'images', 'data']);

// Stylesheets

gulp.task('sass', function(){
    var stream =  gulp.src("ui/scss/src/main.scss")
        .pipe(
            sass({
                includePaths: ["ui/scss/src", "ui/scss/lib"]
            })
        ).pipe(
            csso()
        ).pipe(
            gulp.dest('ui/dist')
        );

    return stream;
});

// Javascripts

gulp.task('js', ['js-src', 'js-lib'], function(){
    var stream = gulp.src(['ui/js/build/lib.js', 'ui/js/build/src.js'])
        .pipe(
            uglify()
        ).pipe(
            concat('main.js')
        ).pipe(
            gulp.dest('ui/dist')    
        );

    return stream;
});

gulp.task('js-src', function(){
    var stream = gulp.src('ui/js/src/**/*.js')
        .pipe(
            babel({
                presets: ['es2015']
            })
        ).pipe(
            concat('src.js')
        ).pipe(
            gulp.dest('ui/js/build')
        );

    return stream;
});

gulp.task('js-lib', function(){
    var stream = gulp.src(['ui/js/lib/jquery.js', 'ui/js/lib/**/*.js'])
        .pipe(
            concat('lib.js')
        ).pipe(
            gulp.dest('ui/js/build')
        );

    return stream;
});

// Images

gulp.task('images', function(){
    var stream = gulp.src("ui/images/**/*")
        .pipe(
            gulp.dest('ui/dist/images')
        );

    return stream;
});


// Fonts

gulp.task('fonts', function(){
    var stream = gulp.src('ui/fonts/**/*')
        .pipe(
            gulp.dest('ui/dist/fonts')
        );

    return stream;
});


// Data

gulp.task('data', function(){
    var stream = gulp.src('ui/data/**/*')
        .pipe(
            gulp.dest('ui/dist/data')
        );

    return stream;
});


// Helpers

gulp.task('clean', function(){
    var stream = gulp.src("ui/dist/**/*")
        .pipe(clean());

    return stream;
});
