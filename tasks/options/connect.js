var config = require('../util/config.js');

module.exports = {
    options: {
        port: 9000,
        hostname: 'localhost'
    },
    proxies: [{
        context: '/api/accounts/payments',
        host: 'staging.system.payment.pipeline2.api.rackspacecloud.com',
        port: 443,
        https: true,
        changeOrigin: true,
        rewrite: {
            '/api/accounts/payments': '/v1/accounts'
        }
    }, {
        context: '/api',
        host: 'localhost',
        port: 3000,
        https: false,
        changeOrigin: false,
        rewrite: {
            '/api': '/api'
        }
    }],
    livereload: {
        options: {
            middleware: function (cnct) {
                return [
                    config.proxyRequest,
                    config.modRewrite(['!\\.\\w+$ /']),
                    config.liveReloadPage,
                    config.mountFolder(cnct, '.tmp'),
                    config.mountFolder(cnct, config.app)
                ];
            }
        }
    },
    test: {
        options: {
            middleware: function (cnct) {
                return [
                    config.proxyRequest,
                    config.modRewrite(['!\\.\\w+$ /']),
                    config.liveReloadPage,
                    config.mountFolder(cnct, '.tmp'),
                    config.mountFolder(cnct, config.app)
                ];
            }
        }
    },
    dist: {
        options: {
            middleware: function (cnct) {
                return [
                    config.mountFolder(cnct, config.dist)
                ];
            }
        }
    },
    docs: {
        options: {
            middleware: function (cnct) {
                return [
                    config.mountFolder(cnct, config.ngdocs)
                ];
            }
        }
    }
};
