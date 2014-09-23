var Page = require('astrolabe').Page;

module.exports = Page.create({
    url: { value: '/billing/payment' },

    search: {
        value: function (transactionOrAuthID) {
            this.go(transactionOrAuthID + '/options');
        }
    },

    changePrimaryPaymentModal: {
        get: function () {
            $('.actions rx-payment-set-default a').click();
            return encore.rxModalAction.initialize(require('./modals/changePrimary.modal'));
        }
    },

    makePaymentModal: {
        get: function () {
            $('.actions .rx-payment-action a').click();
            return encore.rxModalAction.initialize(require('./modals/payment.modal'));
        }
    },

    primary: {
        get: function () {
            return Page.create({
                card: {
                    get: function () {
                        return require('./paymentOptions/card');
                    }
                },

                account: {
                    get: function () {
                        return require('./paymentOptions/account');
                    }
                }
            });
        }
    }

});
