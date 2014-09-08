/*jshint node:true*/
var Page = require('astrolabe').Page;
var _ = require('lodash');

var rxModalAction = {

    rootElement: {
        get: function () {
            return $('.modal');
        }
    },

    btnSubmit: {
        get: function () {
            return this.rootElement.$('.submit');
        }
    },

    isDisplayed: {
        value: function () {
            return this.rootElement.isPresent();
        }
    },

    title: {
        get: function () {
            return this.rootElement.$('.modal-title').getText();
        }
    },

    subtitle: {
        get: function () {
            return this.rootElement.$('.modal-subtitle').getText();
        }
    },

    close: {
        value: function () {
            this.rootElement.$('.modal-close').click();
        }
    },

    canSubmit: {
        value: function () {
            return this.btnSubmit.getAttribute('disabled').then(function (isDisabled) {
                return isDisabled === null;
            });
        }
    },

    submit: {
        value: function () {
            this.btnSubmit.click();
        }
    },

    cancel: {
        value: function () {
            this.rootElement.$('.cancel').click();
        }
    }

};

exports.rxModalAction = {

    initialize: function (customFunctionality) {
        if (!_.isObject(customFunctionality)) {
            customFunctionality = {};
        }
        return Page.create(_.merge(customFunctionality, rxModalAction));
    }

};
