var express = require('express'),
    consolidate = require('consolidate'),
    request = require('request'),
    log = require('./log');

module.exports = function (cb) {
    var port = 9000,
        app = express(),
        appDirectory = __dirname.replace('gulpTasks', 'app');

    log(__dirname, appDirectory);

    app.all('/api/*', function (req, res) {
        log('Mocked: ', req.url);
        var url = 'http://localhost:3000/api/' + req.url;
        req.pipe(request(url)).pipe(res);
    });
    
    app.use(express.static(appDirectory));
    app.engine('.html', consolidate.hogan);
    app.use(function (req, res) {
        res.render(appDirectory + '/index.html');
        return;
    });

    app.listen(port);
    log('Listening on port: ' +  port);
    cb();
};