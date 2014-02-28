var gulp        = require('gulp'),
    livereload  = require('gulp-livereload'),
    open        = require('gulp-open'),
    less        = require('./gulpTasks/less'),
    jshint      = require('./gulpTasks/jshint'),
    jscs        = require('./gulpTasks/jscs'),
    karma       = require('./gulpTasks/karma'),
    stubby      = require('./gulpTasks/stubby'),
    server      = require('./gulpTasks/server');

gulp.task('less', less);
gulp.task('jshint', jshint);
gulp.task('jscs', jscs);
gulp.task('test', karma);
gulp.task('stubApi', stubby);
gulp.task('server', ['stubApi'], server);

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('open', ['server'], function (cb) {
    gulp.src('app/index.html')
        .pipe(open('', { url: 'http://localhost:9000', app: 'google chrome' }));
    cb();
});

gulp.task('default', ['lint', 'test', 'less', 'open'], function () {
    var server = livereload(),
        fileChange = function (file) {
            server.changed(file.path);
        };

    gulp.watch('app/**/*.js', ['lint','test'])
        .on('change', fileChange);

    gulp.watch('app/**/*.html')
        .on('change', fileChange);

    gulp.watch('app/styles/*.less', ['less'])
        .on('change', fileChange);
});