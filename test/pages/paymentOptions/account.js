var Page = require('astrolabe').Page;

module.exports = Page.create({
    type: {
        get: function () {
            return $('.heading').getText().then(function (text) {
                return text.split(' Account')[0].trim();
            });
        }
    },

    number: {
        get: function () {
            var binding = 'defaultMethod.electronicCheck.routingNumber';
            return element(by.binding(binding)).getText();
        }
    },

    holder: {
        get: function () {
            var binding = 'defaultMethod.electronicCheck.accountHolderName';
            return element(by.binding(binding)).getText().then(function (text) {
                return text.split('Name on Card:')[1].trim();
            });
        }
    }
});
