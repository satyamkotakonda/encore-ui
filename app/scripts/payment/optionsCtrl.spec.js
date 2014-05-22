describe('OptionsCtrl', function () {
    var scope, ctrl, account, balance, paymentMethod, defaultPaymentMethod, payment;

    var testAccountNumber = '12345',
        paymentMethods = [{
            'id': 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
            'isDefault': true,
            'paymentCard': {
                'cardNumber': 'XXXXXXXXXXXX3456',
                'cardType': 'VISA'
            }
        }],
        balanceData = {
            amountDue: '2124.00'
        };

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $q, Account, Balance, PaymentMethod,
            Payment, DefaultPaymentMethodFilter) {
            var getResourceResultMock = function (data) {
                    var deferred = $q.defer();
                    data.$promise = deferred.promise;
                    data.$deferred = deferred;
                    return data;
                },
                getResourceMock = function (returnData) {
                    returnData = getResourceResultMock(returnData);
                    return function (callData, success, error) {
                        returnData.$promise.then(success, error);
                        return returnData;
                    };
                };

            scope = $rootScope.$new();
            account = Account;
            balance = Balance;
            payment = Payment;
            paymentMethod = PaymentMethod;
            defaultPaymentMethod = DefaultPaymentMethodFilter;

            payment.makePayment = sinon.stub(payment, 'makePayment', getResourceMock({}));
            account.get = getResourceMock({});
            balance.get = getResourceMock(balanceData);
            paymentMethod.list = getResourceMock(paymentMethods);
            paymentMethod.disable = sinon.stub(paymentMethod, 'disable', getResourceMock({}));
            paymentMethod.changeDefault = sinon.stub(paymentMethod, 'changeDefault', getResourceMock({}));

            ctrl = $controller('OptionsCtrl', {
                $scope: scope,
                $routeParams: { accountNumber: testAccountNumber },
                Account: account,
                Balance: balance,
                Payment: payment,
                PaymentMethod: paymentMethod,
                DefaultPaymentMethodFilter: defaultPaymentMethod
            });
        });
    });

    it('OptionsCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('OptionsCtrl should have a sort object for payment Cards defined', function () {
        expect(scope.cardSort).to.be.a('object');
        expect(scope.cardSort).to.have.property('predicate');
        expect(scope.cardSort.predicate).to.eq('isDefault');
    });

    it('OptionsCtrl cardSortCol should change predicate when called with paymentCard.cardNumber', function () {
        scope.cardSortCol('paymentCard.cardNumber');
        expect(scope.cardSort.predicate).to.be.eq('paymentCard.cardNumber');
    });

    it('OptionsCtrl cardSortCol should change reverse sort when called twice with the same col', function () {
        scope.cardSortCol('paymentCard.cardNumber');
        expect(scope.cardSort.predicate).to.be.eq('paymentCard.cardNumber');
        expect(scope.cardSort.reverse).to.be.eq(false);
        scope.cardSortCol('paymentCard.cardNumber');
        expect(scope.cardSort.predicate).to.be.eq('paymentCard.cardNumber');
        expect(scope.cardSort.reverse).to.be.eq(true);
    });

    it('OptionsCtrl should have a sort object for ACH Accounts defined', function () {
        expect(scope.achSort).to.be.a('object');
        expect(scope.achSort).to.have.property('predicate');
        expect(scope.achSort.predicate).to.eq('isDefault');
    });

    it('OptionsCtrl achSortCol should change predicate when called with electronicCheck.accountType', function () {
        scope.achSortCol('electronicCheck.accountType');
        expect(scope.achSort.predicate).to.be.eq('electronicCheck.accountType');
    });

    it('OptionsCtrl achSortCol should change reverse sort when called twice with the same col', function () {
        scope.achSortCol('electronicCheck.accountType');
        expect(scope.achSort.predicate).to.be.eq('electronicCheck.accountType');
        expect(scope.achSort.reverse).to.be.eq(false);
        scope.achSortCol('electronicCheck.accountType');
        expect(scope.achSort.predicate).to.be.eq('electronicCheck.accountType');
        expect(scope.achSort.reverse).to.be.eq(true);
    });

    it('OptionsCtrl should set the paymentAmount upon success of getting balance info', function () {
        scope.balance.$deferred.resolve(balanceData);
        scope.$apply();
        expect(scope.paymentAmount).to.not.be.empty;
    });

    it('OptionsCtrl should set the defaultMethod upon success of getting payment methods', function () {
        scope.paymentMethods.$deferred.resolve(paymentMethods);
        scope.$apply();
        expect(scope.defaultMethod).to.not.be.empty;
    });

    it('OptionsCtrl should post a payment', function () {
        scope.postPayment(12314, 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
        sinon.assert.calledOnce(payment.makePayment);
    });

    it('OptionsCtrl should disable a payment method', function () {
        scope.disableMethod('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
        //sinon.assert.calledOnce(payment.disable);
    });

    it('OptionsCtrl should change default payment method', function () {
        scope.changeDefaultMethod('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
        //sinon.assert.calledOnce(payment.changeDefault);
    });

});