var gulp = require('gulp'),
    karma = require('gulp-karma');

gulp.task('test', function () {
    return gulp.src('app/app.js')
        .pipe(karma({
            configFile: './karma.conf.js',
            action: 'run',
            reporters: ['spec']
        }));
});

gulp.task('default', function () {
    gulp.watch('app/**/*.js', ['test']);
});