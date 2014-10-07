var _ = require('lodash');

exports.rxEnvironment = {

    // Return the current environment the user sees.
    // The default is set to something simple and reasonable,
    // but should you find a need to supply your own environments, be
    // sure to have `environments` defined in your protractor conf's params section.
    current: (function () {
        var environments = browser.params.environments || {
            'localhost': 'localhost',
            'staging': 'staging',
            'preprod': 'preprod'
        };

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
