var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');

function onError(error) {
    console.log(error);
    this.emit('end');
}

gulp.task('sass', function () {
    return gulp.src('sass/main.scss')
        .pipe(sass({errLogToConsole: true}))
        .on('error', onError)
        .pipe(gulp.dest('css'))
        .pipe(livereload())
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('script/*.js', ['js']);
});

gulp.task('js', function () {
    return gulp.src('script/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js'))
        .pipe(livereload())
});