var Page = require('astrolabe').Page;

module.exports = Page.create({
    url: { value: '/billing/transactions' },

    search: {
        value: function (transactionOrAuthID) {
            this.go(transactionOrAuthID);
        }
    },

    amountDue: {
        get: function () {
            return element(by.binding('balance.amountDue')).getText().then(function (text) {
                return parseFloat(text.split(' ')[0].replace(/^\$/, ''));
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
