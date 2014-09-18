var Page = require('astrolabe').Page;

module.exports = Page.create({
    type: {
        get: function () {
            return $('.heading').getText().then(function (text) {
                return text.split(' Card')[0].trim();
            });
        }
    },

    number: {
        get: function () {
            var binding = 'defaultMethod.paymentCard.cardNumber';
            return element(by.binding(binding)).getText();
        }
    },

    holder: {
        get: function () {
            var binding = 'defaultMethod.paymentCard.cardHolderName';
            return element(by.binding(binding)).getText().then(function (text) {
                return text.split('Name on Card:')[1].trim();
            });
        }
    },

    expiration: {
        get: function () {
            var binding = 'defaultMethod.paymentCard.expirationDate';
            return element(by.binding(binding)).getText().then(function (text) {
                var monthYearString = text.split('Expiration:')[1].trim();
                var monthYear = monthYearString.split('/');
                return new Date(monthYear[1], monthYear[0]);
            });
        }
    }
});
