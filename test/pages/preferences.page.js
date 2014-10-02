var Page = require('astrolabe').Page;

var switchIsOn = function (switchElement) {
    return switchElement.$('.rx-switch').getAttribute('class').then(function (classes) {
        return classes.split(' ').indexOf('on') > -1;
    });
};

var flipSwitch = function (switchElement, switchTo) {
    return switchIsOn(switchElement).then(function (isOn) {
        if (isOn !== switchTo) {
            switchElement.$('.rx-switch').click();
        }
    });
};

module.exports = Page.create({
    url: { value: '/billing/preferences' },

    search: {
        value: function (transactionOrAuthID) {
            this.go(transactionOrAuthID);
        }
    },

    submit: {
        value: function () {
            $('rx-button .rx-button').click();
        }
    },

    paperlessBilling: {
        get: function () {
            return Page.create({
                eleInvoicesSwitch: {
                    get: function () {
                        return element(by.cssContainingText('.label-definition', 'Invoices:')).$('rx-switch');
                    }
                },

                invoices: {
                    get: function () {
                        return switchIsOn(this.eleInvoicesSwitch);
                    },
                    set: function (enabled) {
                        return flipSwitch(this.eleInvoicesSwitch, enabled);
                    }
                }
            });
        }
    },

    notifications: {
        get: function () {
            return Page.create({
                eleSuccessfulPaymentsSwtich: {
                    get: function () {
                        return element(by.cssContainingText('.label-definition', 'Successful Payment:')).$('rx-switch');
                    }
                },

                successfulPayments: {
                    get: function () {
                        return switchIsOn(this.eleSuccessfulPaymentsSwtich);
                    },
                    set: function (enabled) {
                        return flipSwitch(this.eleSuccessfulPaymentsSwtich, enabled);
                    }
                }
            });
        }
    },

});
