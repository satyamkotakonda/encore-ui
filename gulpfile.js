var gulp        = require('gulp'),
    livereload  = require('gulp-livereload'),
    open        = require('gulp-open');

gulp.task('less', require('./gulpTasks/less'));
gulp.task('jshint', require('./gulpTasks/jshint'));
gulp.task('jscs', require('./gulpTasks/jscs'));
gulp.task('lint', ['jshint', 'jscs']);
gulp.task('test', require('./gulpTasks/karma'));
gulp.task('stubApi', require('./gulpTasks/stubby'));
gulp.task('server', ['stubApi'], require('./gulpTasks/server'));

gulp.task('open', function () {
    return gulp.src('app/index.html')
        .pipe(open('', { url: 'http://localhost:9000', app: 'google chrome' }));
});

gulp.task('default', ['lint', 'test', 'less', 'server'], function () {
    var server = livereload();

    gulp.watch('app/**/*.js', ['lint','test'])
        .on('change', function (file) {
            server.changed(file.path);
        });

    gulp.watch('app/styles/*.less', ['less'])
        .on('change', function (file) {
            server.changed(file.path);
        });
    
    gulp.run('open');

    //cb();
});