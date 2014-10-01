var Page = require('astrolabe').Page;

var util = require('./util');

module.exports = Page.create({
    url: { value: '/billing/transactions' },

    search: {
        value: function (transactionOrAuthID) {
            this.go(transactionOrAuthID);
        }
    },

    amountDue: {
        get: function () {
            return util.unless(element(by.binding('balance.amountDue')), function (text) {
                return util.currencyToFloat(text);
            });
        }
    },

    currencyType: {
        get: function () {
            return util.unless(element(by.binding('balance.currency')), function (text) {
                return text.split(' ')[1].trim();
            });
        }
    },

    accountBalance: {
        get: function () {
            return util.unless(element(by.binding('balance.currentBalance')), function (text) {
                return util.currencyToFloat(text);
            });
        }
    },

    pastDue: {
        get: function () {
            return util.unless(element(by.binding('balance.pastDue')), function (text) {
                return util.currencyToFloat(text);
            });
        }
    },

    terms: {
        get: function () {
            return util.unless(element(by.binding('paymentInfo.paymentTerms')));
        }
    },

    billingCycle: {
        get: function () {
            return util.unless(element(by.binding('billInfo.billingDayOfMonth')));
        }
    },

    makePaymentModal: {
        get: function () {
            $('.rx-payment-action a').click();
            return encore.rxModalAction.initialize(require('./modals/payment.modal'));
        }
    }

});
