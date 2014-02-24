var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    karma       = require('gulp-karma'),
    less        = require('gulp-less'),
    jshint      = require('gulp-jshint'),
    jscs        = require('gulp-jscs'),
    livereload  = require('gulp-livereload'),
    open        = require('gulp-open'),
    stylish     = require('jshint-stylish'),
    express     = require('express'),
    request   = require('request'),
    consolidate = require('consolidate'),
    Stubby      = require('stubby').Stubby,
    service     = new Stubby(),
    mockApi     = require('./test/api-mocks/requests/billing.js');

var startServer = function () {
    var port = 9000,
        app = express();

    app.all('/api/*', function(req, res) {
        console.info('Mocked: ', req.url);
        var url = 'http://localhost:3000/api/' + req.url;
        req.pipe(request(url)).pipe(res);
    });

    app.use(express.static(__dirname + '/app'));
    app.engine('.html', consolidate.hogan);
    app.use(function (req, res) {
        res.render(__dirname + '/app/index.html');
        return;
    });

    app.listen(port);
    console.log('Listening on port: ' +  port);
};

gulp.task('less', function () {
    return gulp.src('app/styles/*.less')
        .pipe(concat('app.css'))
        .pipe(less({}))
        .pipe(gulp.dest('app/styles/'));
});

gulp.task('stubApi', function () {
    service.start({
        stubs: 3000,
        data: mockApi
    }, function (error) {
        if(error) {
            console.error(error);
        }
    });
});

gulp.task('jshint', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish));
});

gulp.task('jscs', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(jscs());
});

gulp.task('lint', function () {
    gulp.run('jshint');
    gulp.run('jscs');
});

gulp.task('test', function () {
    return gulp.src('app/app.js')
        .pipe(karma({
            configFile: './karma.conf.js',
            action: 'run',
            reporters: ['spec','coverage','threshold']
        }));
});

gulp.task('server', function () {
    gulp.run('stubApi');
    return startServer();
});

gulp.task('open', function () {
    return gulp.src('app/index.html')
        .pipe(open('', {url: 'http://localhost:9000', app: 'google chrome'}));
});

gulp.task('default', function () {
    startServer();
    gulp.run('stubApi');
    gulp.run('lint');
    gulp.run('test');
    gulp.run('open');
    var server = livereload();

    gulp.watch('app/**/*.js', ['lint','test'])
        .on('change', function (file) {
            server.changed(file.path);
        });

    gulp.watch('app/styles/*.less', ['less'])
        .on('change', function (file) {
            server.changed(file.path);
        });
});