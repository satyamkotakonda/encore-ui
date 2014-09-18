var Page = require('astrolabe').Page;

module.exports = Page.create({

    lblAmountDue: {
        get: function () {
            return element(by.binding('balance.amountDue'));
        }
    },

    contact: {
        get: function () {
            return require('./overview/contact');
        }
    },

    summary: {
        get: function () {
            return require('./overview/summary');
        }
    },

    status: {
        get: function () {
            return element(by.binding('account.status')).getText().then(function (text) {
                return text.split('Status:')[1].trim();
            });
        }
    },

    amountDue: {
        get: function () {
            return this.lblAmountDue.getText().then(function (text) {
                return parseFloat(text.split(' ')[0]);
            });
        }
    },

    currencyType: {
        get: function () {
            return this.lblAmountDue.getText().then(function (text) {
                return text.split(' ')[1].toUpperCase();
            });
        }
    },

    makePaymentModal: {
        get: function () {
            $('.rx-payment-action a').click();
            return encore.rxModalAction.initialize(require('./modals/payment.modal'));
        }
    }

});
