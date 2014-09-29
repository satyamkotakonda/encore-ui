describe('PaymentFilters', function () {
    var paymentMethods, methodTypeFilter, cardNumberFormatFilter, accountNumberFormatFilter,
        methodNumberOnlyFilter, defaultPaymentMethod, accountTypeFormatFilter, paymentFormUtil,
        scope, formFilterMethods;

    paymentMethods = [{
        'id': 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
        'isDefault': true,
        'disabled': false,
        'paymentCard': {
            'cardNumber': 'XXXXXXXXXXXX3456',
            'cardType': 'VISA'
        }
    }, {
        'id': 'urn:uuid:4620b3d4-62ad-4d84-87cc-22a5ef13062f',
        'disabled': false,
        'electronicCheck': {
            'accountNumber': 'XXXXXX7845',
            'accountType': 'CONSUMER_CHECKING'
        }
    }, {
        'id': 'urn:uuid:4438ef26-a369-47ed-8682-f82df74f0be0',
        'disabled': false,
        'electronicCheck': {
            'accountNumber': 'XXXXXX1234',
            'accountType': 'CONSUMER_CHECKING'
        }
    }];

    beforeEach(function () {
        module('billingApp');

        inject(function ($rootScope, $filter, PaymentFormUtil, DefaultPaymentMethodFilter) {
            scope = $rootScope.$new();
            scope.methods = paymentMethods;
            methodTypeFilter = $filter('PaymentMethodType');
            cardNumberFormatFilter = $filter('CardNumberFormat');
            accountNumberFormatFilter = $filter('AccountNumberFormat');
            accountTypeFormatFilter = $filter('AccountTypeFormat');
            methodNumberOnlyFilter = $filter('PaymentMethodNumber');
            paymentFormUtil = PaymentFormUtil;
            defaultPaymentMethod = DefaultPaymentMethodFilter;
            formFilterMethods = paymentFormUtil.formFilter(scope);
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

    it('AccountNumberFormat Filter Should format an accountNumber and replace X with *', function () {
        var number = accountNumberFormatFilter(paymentMethods[2].electronicCheck.accountNumber);
        expect(number).to.not.be.empty;
        expect(number.split(' ').length).to.be.eq(1);
        expect(number).to.be.eq('******1234');
    });

    it('AccountNumberFormat Filter Should use # instead of *', function () {
        var number = accountNumberFormatFilter(paymentMethods[2].electronicCheck.accountNumber, '#');
        expect(number).to.not.be.empty;
        expect(number.split(' ').length).to.be.eq(1);
        expect(number).to.be.eq('######1234');
    });

    it('AccountTypeFormat Filter Should format an Account Type', function () {
        var accountType = accountTypeFormatFilter('CONSUMER_CHECKING');
        expect(accountType).to.not.be.empty;
        expect(accountType.split(' ').length).to.be.eq(2);
        expect(accountType).to.be.eq('CONSUMER CHECKING');
    });

    it('PaymentMethodNumber Filter Should return the unmasked numbers', function () {
        var number = methodNumberOnlyFilter(paymentMethods[0].paymentCard.cardNumber);
        expect(number).to.not.be.empty;
        expect(number).to.be.eq('3456');
    });

    it('DefaultPaymentMethodFilter should return 1 paymentMethod', function () {
        expect(defaultPaymentMethod(paymentMethods)).to.be.a('object');
    });

    it('PaymentFormUtil getMethodType should analyze a payment method and return its type', function () {
        var methodType = paymentFormUtil.getMethodType(paymentMethods[0], 'noType');
        expect(methodType).to.not.be.empty;
        expect(methodType).to.not.be.eq('noType');
        expect(methodType).to.be.eq('paymentCard');
    });

    it('PaymentFormUtil getMethodType should return the passed default type when no type is found', function () {
        var methodType = paymentFormUtil.getMethodType({ 'paymentCard': true }, 'noType');
        expect(methodType).to.not.be.empty;
        expect(methodType).to.not.be.eq('paymentCard');
        expect(methodType).to.be.eq('noType');
    });

    it('PaymentFormUtil formFilter should filter/change columns based on the default method type', function () {
        formFilterMethods('isDefault');
        expect(scope.methodType).to.be.eq('isDefault');
        expect(scope.methodList.length).to.be.eq(1);
        expect(scope.methodListCols.length).to.be.eq(4);
    });

    it('PaymentFormUtil formFilter should filter/change columns based on the card method type', function () {
        formFilterMethods('paymentCard');
        expect(scope.methodType).to.be.eq('paymentCard');
        expect(scope.methodList.length).to.be.eq(1);
        expect(scope.methodListCols.length).to.be.eq(4);
    });

    it('PaymentFormUtil formFilter should filter/change columns based on the ach method type', function () {
        formFilterMethods('electronicCheck');
        expect(scope.methodType).to.be.eq('electronicCheck');
        expect(scope.methodList.length).to.be.eq(2);
        expect(scope.methodListCols.length).to.be.eq(4);
    });
});
