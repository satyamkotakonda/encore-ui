/*jshint node:true */
exports.config = {
    baseUrl: 'http://localhost:9001',

    specs: [
        './src/**/*.midway.js'
    ],

    framework: 'mocha',

    allScriptsTimeout: 30000,

    params: {
        environments: {
            'http://localhost:9001': 'localhost',
            'http://rackerlabs.github.io/encore-ui': 'staging'
        }
    },

    // Options to be passed to mocha
    mochaOpts: {
        enableTimeouts: false,
        reporter: 'spec',
        slow: 4000,
        ui: 'bdd'
    },

    onPrepare: function () {
        expect = require('chai').use(require('chai-as-promised')).expect;
        demoPage = require('./utils/demo.page.js');
    },

    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    capabilities: {
        browserName: 'firefox'
    }
};
