var gulp = require('gulp'),
	karma       = require('gulp-karma');

module.exports = function () {
    return gulp.src('app/app.js')
        .pipe(karma({
            configFile: './karma.conf.js',
            action: 'run',
            reporters: ['spec','coverage','threshold']
        }));
};