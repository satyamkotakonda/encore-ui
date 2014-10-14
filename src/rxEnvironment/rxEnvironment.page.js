var _ = require('lodash');

exports.rxEnvironment = {

    // Return the current environment the user sees.
    // The default is set to something simple and reasonable,
    // but should you find a need to supply your own environments, be
    // sure to have `environments` defined in your protractor conf's params section.
    current: function () {
        var component = this;
        return browser.getCurrentUrl().then(function (url) {
            return component.compare(url);
        });
    },

    // Return the original environment, as defined in the current protractor conf file.
    // Returns a promise to keep the usage consistent with `rxEnvironment.current`.
    original: function () {
        return protractor.promise.fulfilled(this.compare(browser.baseUrl));
    },

    compare: function (url) {
        return _.find(this.environments, function findEnvironment (envName, env) {
            if (_.contains(url, env)) {
                return envName;
            }
        }) || 'production';
    },

    // Clones the environments param before filling in any missing entries with the defaults below.
    environments: _.defaults(_.clone(browser.params.environments) || {}, {
        'localhost': 'localhost',
        'staging': 'staging',
        'preprod': 'preprod'
    }),

    isLocalhost: function (useBaseUrl) {
        return this.confirmEnvironment(useBaseUrl, 'localhost');
    },

    isStaging: function (useBaseUrl) {
        return this.confirmEnvironment(useBaseUrl, 'staging');
    },

    isPreprod: function (useBaseUrl) {
        return this.confirmEnvironment(useBaseUrl, 'preprod');
    },

    isProd: function (useBaseUrl) {
        return this.confirmEnvironment(useBaseUrl, 'production');
    },

    confirmEnvironment: function (useBaseUrl, environment) {
        var component = this;
        return browser.getCurrentUrl().then(function (url) {
            return _.isEqual(component.compare(useBaseUrl ? protractor.baseUrl : url), environment);
        });
    }

};
