var express = require('express'),
    consolidate = require('consolidate'),
    request = require('request');

module.exports = function () {
    var port = 9000,
        app = express(),
        appDirectory = __dirname.replace('gulpTasks', 'app');

    console.log(__dirname, appDirectory);

    app.all('/api/*', function (req, res) {
        console.info('Mocked: ', req.url);
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
    console.log('Listening on port: ' +  port);
};