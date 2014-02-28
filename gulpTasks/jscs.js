var gulp = require('gulp'),
    jscs = require('gulp-jscs'),
    log  = require('./log');

module.exports = function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jscs().on('error', log));
};