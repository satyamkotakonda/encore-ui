var _ = require('lodash');

exports.rxEnvironment = {

    current: (function () {
        var environments = [
            'localhost',
            'staging',
            'preprod'
        ];

        return browser.getCurrentUrl().then(function (url) {
            return _.find(environments, function findEnvironment (env) {
                if (_.contains(url, env)) {
                    return env;
                }
            }) || 'production';
        });
    })(),

    isLocalhost: function () {
        return _.isEqual(exports.rxEnvironment.current(), 'localhost');
    },

    isStaging: function () {
        return _.isEqual(exports.rxEnvironment.current(), 'staging');
    },

    isPreprod: function () {
        return _.isEqual(exports.rxEnvironment.current(), 'preprod');
    },

    isProd: function () {
        return _.isEqual(exports.rxEnvironment.current(), 'production');
    }

};
