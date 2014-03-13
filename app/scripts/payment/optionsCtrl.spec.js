describe('OptionsCtrl', function () {
    var scope, ctrl, account, paymentMethod, defaultPaymentMethod;

    var testAccountNumber = '12345',
        paymentMethods = [{
            'id': 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
            'isDefault': 'true',
            'paymentCard': {
                'cardNumber': 'XXXXXXXXXXXX3456',
                'cardType': 'VISA'
            }
        }];

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, Account, PaymentMethod,
            DefaultPaymentMethod) {

            scope = $rootScope.$new();
            account = Account;
            paymentMethod = PaymentMethod;
            defaultPaymentMethod = DefaultPaymentMethod;

            account.get = sinon.stub(account, 'get');
            paymentMethod.list = function (param, success) {
                success(paymentMethods);
                return paymentMethods;
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

    it('OptionsCtrl should have a sort object defined', function () {
        expect(scope.sort).to.be.a('object');
        expect(scope.sort).to.have.property('predicate');
        expect(scope.sort.predicate).to.eq('isDefault');
    });

    it('OptionsCtrl should return a sorting predicate when calling sortCol', function () {
        scope.sortCol('isDefault');
        expect(scope.sort.predicate).to.be.eq('isDefault');
    });

    it('OptionsCtrl should get account info', function () {
        sinon.assert.calledOnce(account.get);
    });

    it('OptionsCtrl should set the defaultMethod upon success of getting payment methods', function () {
        expect(scope.defaultMethod).to.not.be.empty;
    });
});