var gulp   = require('gulp'),
	concat = require('gulp-concat'),
    less   = require('gulp-less'),
    log    = require('./log');
    

module.exports = function () {
    return gulp.src('app/styles/*.less')
        .pipe(concat('app.css'))
        .pipe(less({}).on('error', log))
        .pipe(gulp.dest('app/styles/'));
};