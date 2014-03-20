describe('PaymentFilters', function () {
    var paymentMethods, methodTypeFilter, cardNumberFormatFilter, methodNumberOnlyFilter, defaultPaymentMethod;

    paymentMethods = [{
        'id': 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
        'isDefault': true,
        'paymentCard': {
            'cardNumber': 'XXXXXXXXXXXX3456',
            'cardType': 'VISA'
        }
    }, {
        'id': 'urn:uuid:4620b3d4-62ad-4d84-87cc-22a5ef13062f',
        'electronicCheck': {
            'accountNumber': 'XXXXXX7845',
            'accountType': 'CONSUMER_CHECKING'
        }
    }, {
        'id': 'urn:uuid:4438ef26-a369-47ed-8682-f82df74f0be0',
        'electronicCheck': {
            'accountNumber': 'XXXXXX1234',
            'accountType': 'CONSUMER_CHECKING'
        }
    }];

    beforeEach(function () {
        module('billingApp');

        inject(function ($filter, DefaultPaymentMethod) {
            methodTypeFilter = $filter('PaymentMethodType');
            cardNumberFormatFilter = $filter('CardNumberFormat');
            methodNumberOnlyFilter = $filter('PaymentMethodNumber');
            defaultPaymentMethod = DefaultPaymentMethod;
        });
    });

    it('PaymentFilters PaymentMethodType should exist', function () {
        expect(methodTypeFilter).to.exist;
        expect(methodTypeFilter).to.not.be.empty;
    });

    it('PaymentFilters PaymentMethodNumber should exist', function () {
        expect(cardNumberFormatFilter).to.exist;
        expect(cardNumberFormatFilter).to.not.be.empty;
    });

    it('PamentMethodType Filter Should return an array of 1 paymentCard', function () {
        var methods = methodTypeFilter(paymentMethods, 'paymentCard');
        expect(methods).to.not.be.empty;
        expect(methods).to.be.a('array');
        expect(methods.length).to.be.eq(1);
    });

    it('PamentMethodType Filter Should return an array of 2 electronicCheck', function () {
        var methods = methodTypeFilter(paymentMethods, 'electronicCheck');
        expect(methods).to.not.be.empty;
        expect(methods).to.be.a('array');
        expect(methods.length).to.be.eq(2);
    });

    it('PamentMethodType Filter Should return an array of 0 invoice', function () {
        var methods = methodTypeFilter(paymentMethods, 'invoice');
        expect(methods).to.be.empty;
        expect(methods).to.be.a('array');
        expect(methods.length).to.be.eq(0);
    });

    it('CardNumberFormat Filter Should format a credit card number in 4 sections of 4 (VISA)', function () {
        var number = cardNumberFormatFilter(paymentMethods[0].paymentCard.cardNumber,
                                            paymentMethods[0].paymentCard.cardType);
        expect(number).to.not.be.empty;
        expect(number.split(' ').length).to.be.eq(4);
        expect(number).to.be.eq('**** **** **** 3456');
    });

    it('CardNumberFormat Filter Should use # instead of *', function () {
        var number = cardNumberFormatFilter(paymentMethods[0].paymentCard.cardNumber,
                                            paymentMethods[0].paymentCard.cardType,
                                            '#');
        expect(number).to.not.be.empty;
        expect(number.split(' ').length).to.be.eq(4);
        expect(number).to.be.eq('#### #### #### 3456');
    });

    it('CardNumberFormat Filter Should format number with * but no spaces, for no cardType', function () {
        var number = cardNumberFormatFilter(paymentMethods[0].paymentCard.cardNumber);
        expect(number).to.not.be.empty;
        expect(number.split(' ').length).to.be.eq(1);
        expect(number).to.be.eq('************3456');
    });

    it('PaymentMethodNumber Filter Should return the unmasked numbers', function () {
        var number = methodNumberOnlyFilter(paymentMethods[0].paymentCard.cardNumber);
        expect(number).to.not.be.empty;
        expect(number).to.be.eq('3456');
    });

    it('DefaultPaymentMethod should return 1 paymentMethod', function () {
        expect(defaultPaymentMethod(paymentMethods)).to.be.a('object');
    });
});