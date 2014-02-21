var gulp        = require('gulp'),
    karma       = require('gulp-karma'),
    livereload  = require('gulp-livereload'),
    express     = require('express'),
    request   = require('request'),
    consolidate = require('consolidate'),
    Stubby      = require('stubby').Stubby,
    service     = new Stubby(),
    mockApi     = require('./test/api-mocks/requests/billing.js');


var startServer = function () {
    var port = 8080,
        app = express();

    app.all('/api/*', function(req, res) {
        console.log(req.url);
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

gulp.task('test', function () {
    return gulp.src('app/app.js')
        .pipe(karma({
            configFile: './karma.conf.js',
            action: 'run',
            reporters: ['spec']
        }));
});

gulp.task('server', function () {
    gulp.run('stubApi');
    return startServer();
});

gulp.task('default', function () {
    gulp.run('test');
    gulp.run('stubApi');
    startServer();
    var server = livereload();

    gulp.watch('app/**/*.js', ['test'])
        .on('change', function (file) {
            console.log(file);
            server.changed(file.path);
        });
});