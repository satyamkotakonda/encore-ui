describe('OptionsCtrl', function () {
    var scope, ctrl, account, paymentMethod, defaultPaymentMethod;

    var testAccountNumber = '12345',
        paymentMethods = [{
            'id': 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
            'isDefault': true,
            'paymentCard': {
                'cardNumber': 'XXXXXXXXXXXX3456',
                'cardType': 'VISA'
            }
        }];

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $q, Account, PaymentMethod,
            DefaultPaymentMethod) {
            var getResourceMock = function (data) {
                var deferred = $q.defer();
                data.$promise = deferred.promise;
                data.$deferred = deferred;
                return data;
            };

            scope = $rootScope.$new();
            account = Account;
            paymentMethod = PaymentMethod;
            defaultPaymentMethod = DefaultPaymentMethod;

            account.get = sinon.stub(account, 'get').returns(getResourceMock({}));
            paymentMethod.list = function (param, success) {
                success(paymentMethods);
                return getResourceMock(paymentMethods);
            };

            ctrl = $controller('OptionsCtrl', {
                $scope: scope,
                $routeParams: { accountNumber: testAccountNumber },
                Account: account,
                PaymentMethod: paymentMethod,
                DefaultPaymentMethod: defaultPaymentMethod
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

    it('OptionsCtrl should get account info', function () {
        sinon.assert.calledOnce(account.get);
    });

    it('OptionsCtrl should set the defaultMethod upon success of getting payment methods', function () {
        expect(scope.defaultMethod).to.not.be.empty;
    });
});