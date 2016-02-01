var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var csso = require('gulp-csso');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var clean = require('gulp-clean');


// Default Task

gulp.task('default', ['css', 'js', 'fonts', 'images', 'data']);

// Stylesheets

gulp.task('css', ['sass'], function(){
    var stream = gulp.src([
            "bower_components/leaflet/dist/leaflet.css",
            "bower_components/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css",
            "ui/build/main.css"
        ]).pipe(
            concat('main.css')
        ).pipe(
            csso()
        ).pipe(
            gulp.dest('ui/dist')
        );

    return stream;
});

gulp.task('sass', function(){
    var stream =  sass("ui/scss/main.scss")
            .on("error", sass.logError)
            .pipe(
                gulp.dest('ui/build')
            );

    return stream;
});

// Javascripts

gulp.task('js', ['js-src', 'js-lib'], function(){
    var stream = gulp.src(['ui/build/lib.js', 'ui/build/src.js'])
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
    var stream = gulp.src([
            'ui/js/main.js',
            'ui/js/**/*.js'
        ]).pipe(
            babel({
                presets: ['es2015']
            })
        ).pipe(
            concat('src.js')
        ).pipe(
            gulp.dest('ui/build')
        );

    return stream;
});

gulp.task('js-lib', function(){
    var stream = gulp.src([
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            'bower_components/leaflet/dist/leaflet-src.js',
            'bower_components/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js'
        ]) .pipe(
            concat('lib.js')
        ).pipe(
            gulp.dest('ui/build')
        );

    return stream;
});

// Images

gulp.task('images', function(){
    var stream = gulp.src([
            "bower_components/leaflet/dist/images/**/*",
            "bower_components/Leaflet.awesome-markers/dist/images/**/*"
        ]) .pipe(
            gulp.dest('ui/dist/images')
        );

    return stream;
});


// Fonts

gulp.task('fonts', function(){
    var stream = gulp.src([
            "bower_components/Ionicons/fonts/**/*",
            "bower_components/bootstrap-sass/assets/fonts/**/*",
            "bower_components/font-awesome/fonts/**/*"
        ]) .pipe(
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
