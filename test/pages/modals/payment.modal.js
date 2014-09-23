module.exports = {

    txtPaymentAmount: {
        get: function () {
            return this.rootElement.element(by.model('payment.amount'));
        }
    },

    paymentAmount: {
        get: function () {
            return this.txtPaymentAmount.getAttribute('value').then(function (value) {
                return parseFloat(value);
            });
        },
        set: function (amount) {
            this.txtPaymentAmount.clear();
            this.txtPaymentAmount.sendKeys(amount);
        }
    }

};
