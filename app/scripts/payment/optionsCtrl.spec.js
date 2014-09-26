describe('OptionsCtrl', function () {
    var scope, $window, ctrl, account, balance, paymentMethod, defaultPaymentMethod,
        payment, paymentSession, paymentFormURI;

    var testURL = 'test.com';
    var formURL = 'forms.payment.api.com';
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
        },
        sessionData = {
            session: {
                id: 'urn:uuid:55e52551-a95b-11e0-8e30-001ec200d9e0',
                ran: '020-12345'
            }
        };

    beforeEach(function () {
        module('billingApp');

        $window = {
            location: {
                href: testURL
            }
        };

        inject(function ($controller, $rootScope, $q, Account, Balance, PaymentMethod,
            Payment, PaymentSession, DefaultPaymentMethodFilter) {
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
            paymentSession = PaymentSession;

            payment.makePayment = sinon.stub(payment, 'makePayment', getResourceMock({}));
            account.get = getResourceMock({});
            balance.get = getResourceMock(balanceData);
            paymentMethod.list = getResourceMock(paymentMethods);
            paymentMethod.disable = sinon.stub(paymentMethod, 'disable', getResourceMock({}));
            paymentMethod.changeDefault = sinon.stub(paymentMethod, 'changeDefault', getResourceMock({}));

            paymentFormURI = function () { return formURL; };
            paymentSession.create = sinon.stub(paymentSession, 'create', getResourceMock(sessionData));

            ctrl = $controller('OptionsCtrl', {
                $scope: scope,
                $window: $window,
                $routeParams: { accountNumber: testAccountNumber },
                Account: account,
                Balance: balance,
                Payment: payment,
                PaymentMethod: paymentMethod,
                PaymentFormURI: paymentFormURI,
                DefaultPaymentMethodFilter: defaultPaymentMethod
            });
        });
    });

    it('should exist', function () {
        expect(ctrl).to.exist;
    });

    it('should have a sort object for payment Cards defined', function () {
        expect(scope.cardSort).to.be.a('object');
        expect(scope.cardSort).to.have.property('predicate');
        expect(scope.cardSort.predicate).to.eq('isDefault');
    });

    it('cardSortCol should change predicate when called with paymentCard.cardNumber', function () {
        scope.cardSortCol('paymentCard.cardNumber');
        expect(scope.cardSort.predicate).to.be.eq('paymentCard.cardNumber');
    });

    it('cardSortCol should change reverse sort when called twice with the same col', function () {
        scope.cardSortCol('paymentCard.cardNumber');
        expect(scope.cardSort.predicate).to.be.eq('paymentCard.cardNumber');
        expect(scope.cardSort.reverse).to.be.eq(false);
        scope.cardSortCol('paymentCard.cardNumber');
        expect(scope.cardSort.predicate).to.be.eq('paymentCard.cardNumber');
        expect(scope.cardSort.reverse).to.be.eq(true);
    });

    it('should have a sort object for ACH Accounts defined', function () {
        expect(scope.achSort).to.be.a('object');
        expect(scope.achSort).to.have.property('predicate');
        expect(scope.achSort.predicate).to.eq('isDefault');
    });

    it('achSortCol should change predicate when called with electronicCheck.accountType', function () {
        scope.achSortCol('electronicCheck.accountType');
        expect(scope.achSort.predicate).to.be.eq('electronicCheck.accountType');
    });

    it('achSortCol should change reverse sort when called twice with the same col', function () {
        scope.achSortCol('electronicCheck.accountType');
        expect(scope.achSort.predicate).to.be.eq('electronicCheck.accountType');
        expect(scope.achSort.reverse).to.be.eq(false);
        scope.achSortCol('electronicCheck.accountType');
        expect(scope.achSort.predicate).to.be.eq('electronicCheck.accountType');
        expect(scope.achSort.reverse).to.be.eq(true);
    });

    it('should set the paymentAmount upon success of getting balance info', function () {
        scope.balance.$deferred.resolve(balanceData);
        scope.$apply();
        expect(scope.paymentAmount).to.not.be.empty;
    });

    it('should set the defaultMethod upon success of getting payment methods', function () {
        scope.paymentMethods.$deferred.resolve(paymentMethods);
        scope.$apply();
        expect(scope.defaultMethod).to.not.be.empty;
    });

    it('should post a payment', function () {
        scope.postPayment(12314, 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
        sinon.assert.calledOnce(payment.makePayment);
    });

    it('should disable a payment method', function () {
        scope.disableMethod('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
        //sinon.assert.calledOnce(payment.disable);
    });

    it('should create a new payment form session and redirect to the form', function () {
        scope.addPayment();
        scope.createSession.$deferred.resolve(sessionData);
        expect($window.location.href).to.eq(testURL);
        scope.$apply();
        expect($window.location.href).to.eq(formURL + sessionData.session.id);
    });
});
