var config = require('../util/config.js'),
    appLocalRewrite = {};

appLocalRewrite['/'+config.appName] = '';

module.exports = {
    options: {
        port: 9000,
        hostname: 'localhost'
    },
    proxies: [{
        context: '/' + config.appName,
        host: 'localhost',
        port: 9000,
        rewrite: appLocalRewrite
    },
    {
        context: '/api/billing',
        host: 'staging.billingv2.pipeline2.api.rackspacecloud.com',
        port: 443,
        https: true,
        changeOrigin: true,
        rewrite: {
            '/api/billing': '/v2/accounts'
        }
    },
    {
        context: '/api/payment',
        host: 'staging.system.payment.pipeline2.api.rackspacecloud.com',
        port: 443,
        https: true,
        changeOrigin: true,
        rewrite: {
            '/api/payment': '/v1/accounts'
        }
    },
    {
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
                    config.modRewrite(['!\\.[0-9a-zA-Z_-]+$ /index.html']),
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
                    config.modRewrite(['!\\.[0-9a-zA-Z_-]+$ /index.html']),
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
                    config.proxyRequest,
                    config.modRewrite(['!\\.[0-9a-zA-Z_-]+$ /index.html']),
                    config.liveReloadPage,
                    config.mountFolder(cnct, '.tmp'),
                    config.mountFolder(cnct, config.appDest)
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
