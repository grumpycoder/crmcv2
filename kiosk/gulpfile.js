/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
$ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});

var config = {
    //Include all js files but exclude any min.js files
    //js: ['app/**/*.js', '!app/**/*.min.js', '!app/**/staff-select.component.js'],
    js: ['app/**/*.js', '!app/**/*.min.js'],
    css: ['css/**/*.css', '!**/*.min.css']
}

gulp.task('default', ['vendor:js', 'vendor:css', 'vendor:fonts', 'app:js', 'app:css']);

gulp.task('build-vendor', ['vendor:js', 'vendor:css', 'vendor:fonts']);

gulp.task('build-app', ['app:js', 'app:css']);

gulp.task('watch', function () {
    gulp.watch('app/**/*.js', ['app:js']);
    gulp.watch('css/*.css', ['app:css']);

    gulp.watch('lib/**/*.js', ['vendor:js']);
    gulp.watch('lib/**/*.css', ['vendor:css']);
});

gulp.task('vendor:fonts', function () {
    console.log('building vendor fonts');
    return gulp.src($.mainBowerFiles({
        // Only return the font files
        filter: /.*\.(eot|svg|ttf|woff|woff2)$/i
    }))
        .pipe($.print())
        .pipe(gulp.dest('fonts'));
});

gulp.task('app:js', function () {
    console.log('building app scripts');
    return gulp.src(config.js)
        .pipe($.print())
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.concat('app.min.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('js/'));
});

gulp.task('app:css', function () {
    console.log('building app styles');
    return gulp.src(config.css)
        .pipe($.print())
        .pipe($.sourcemaps.init())
        .pipe($.cssmin())
        .pipe($.concat('site.min.css'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('css/'));
});

gulp.task('vendor:js', function () {
    console.log('building vendor scripts');
    return gulp.src($.mainBowerFiles(['**/*.js']))
        .pipe($.print())
        .pipe($.sourcemaps.init())
        .pipe($.uglify())
        .pipe($.concat('vendor.min.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('js/'));
});

gulp.task('vendor:css', function () {
    console.log('building vendor styles');
    return gulp.src($.mainBowerFiles('**/*.css'))
        .pipe($.print())
        .pipe($.sourcemaps.init())
        .pipe($.concat('vendor.min.css'))
        .pipe($.cssmin())
        .pipe($.sourcemaps.init())
        .pipe(gulp.dest('css/'));
});
