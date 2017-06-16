var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {
    return gulp.src('sass/main.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest('css'))
});

gulp.task('watch', function () {
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('script/*.js', ['js']);
});

gulp.task('js', function () {
    return gulp.src('script/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js'))
});