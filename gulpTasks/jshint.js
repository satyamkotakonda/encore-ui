var gulp    = require('gulp'),
    jshint  = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    log     = require('./log');
    
module.exports = function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint('.jshintrc').on('error', log))
        .pipe(jshint.reporter(stylish).on('error', log));
};