module.exports = {
    app: 'app',
    dist : 'dist',
    ngdocs: 'ngdocs',
    appName: 'billing',
    appDest: 'dist/billing',
    open: {
        hostname: 'localhost',
        port: 9000
    },
    liveReloadPage: require('connect-livereload')({ port: 35729 }),
    proxyRequest: require('grunt-connect-proxy/lib/utils').proxyRequest,
    modRewrite: require('connect-modrewrite'),
    mountFolder : function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    }
};
