describe('OptionsCtrl', function () {
    var scope, ctrl, account, payment, paymentMethod, defaultPaymentMethod;

    var testAccountNumber = '12345',
        paymentMethods = [{
            'id': 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
            'isDefault': true,
            'paymentCard': {
                'cardNumber': 'XXXXXXXXXXXX3456',
                'cardType': 'VISA'
            }
        }],
        accountInfo = {
            currentDue: 2124.00
        };

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $q, Account, Payment, PaymentMethod,
            DefaultPaymentMethodFilter) {
            var getResourceMock = function (data) {
                    var deferred = $q.defer();
                    data.$promise = deferred.promise;
                    data.$deferred = deferred;
                    return data;
                },
                getResourceCallBackMock = function (data) {
                    return function (param, success) {
                        success(data);
                        return getResourceMock(data);
                    };
                };

            scope = $rootScope.$new();
            account = Account;
            payment = Payment;
            paymentMethod = PaymentMethod;
            defaultPaymentMethod = DefaultPaymentMethodFilter;

            account.get = getResourceCallBackMock(accountInfo);
            payment.post = sinon.stub(payment, 'post').returns(getResourceMock({}));
            paymentMethod.list = getResourceCallBackMock(paymentMethods);
            paymentMethod.disable = function (param, data, success) {
                if (success) {
                    success({});
                }
                return getResourceMock({});
            };
            paymentMethod.changeDefault = function (param, data, success) {
                if (success) {
                    success({});
                }
                return getResourceMock({});
            };

            ctrl = $controller('OptionsCtrl', {
                $scope: scope,
                $routeParams: { accountNumber: testAccountNumber },
                Account: account,
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

    it('OptionsCtrl should set the paymentAmount upon success of getting account info', function () {
        expect(scope.paymentAmount).to.not.be.empty;
    });

    it('OptionsCtrl should set the defaultMethod upon success of getting payment methods', function () {
        expect(scope.defaultMethod).to.not.be.empty;
    });

    it('OptionsCtrl should post a payment', function () {
        scope.postPayment(12314, 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
        sinon.assert.calledOnce(payment.post);
    });

    it('OptionsCtrl should disable a payment method', function () {
        scope.disableMethod('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
        //sinon.assert.calledOnce(payment.disable);
    });

    it('OptionsCtrl should post a payment', function () {
        scope.changeDefaultMethod('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
        //sinon.assert.calledOnce(payment.changeDefault);
    });

});