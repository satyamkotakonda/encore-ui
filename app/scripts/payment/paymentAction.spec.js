/* jshint node: true */

describe('rxPaymentAction', function () {
    var el, scope, instScope, compile, rootScope,
        user = 'test', amount = '2000.00', methodId = 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
        paymentMethods = [{
            id: 'id1',
            isDefault: 'true',
            paymentCard: { number: '1234' }
        }, {
            id: 'id2',
            electronicCheck: { number: '1234' }
        }, {
            id: 'id3',
            paymentCard: { number: '1234' }
        }, {
            id: 'id4',
            invoice: { number: '1234' }
        }],
        validTemplate = '<rx-payment-action' +
                        '    post-hook="postPayment"' +
                        '    user="{{user}}"' +
                        '    payment-amount="{{paymentAmount}}"' +
                        '    payment-method-id="{{paymentMethodId}}"' +
                        '    payment-methods="paymentMethods">' +
                        '    <strong>+</strong> Make a Payment' +
                        '</rx-payment-action>';
    var postPayment = function (amount, methodId) {
        return [amount, methodId];
    };

    beforeEach(function () {
        module('billingApp');
        module('views/payment/paymentAction.html');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('views/payment/paymentAction.html');
            $templateCache.put('/views/payment/paymentAction.html', template);

            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.user = user;
            scope.paymentAmount = amount;
            scope.paymentMethodId = methodId;
            scope.paymentMethods = paymentMethods;
            scope.postPayment = postPayment;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
    });

    afterEach(function () {
        el = null;
    });

    it('should render template correctly', function () {
        expect(el).not.be.empty;
        expect(el.find('div')).not.be.empty;
        expect(el.find('div').attr('class').split(' ').indexOf('rx-payment-action')).to.be.gt(-1);
    });

    it('should have the default payment-amount set', function () {
        expect(el).not.be.empty;
        expect(el.attr('payment-amount')).to.be.eq('2000.00');
    });

    it('should have the default payment-method-id set', function () {
        expect(el).not.be.empty;
        expect(el.attr('payment-method-id')).to.be.eq('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

    it('should call post-hook with the final amount/method-id values', function () {
        expect(el).not.be.empty;
        expect(el.find('div')).not.be.empty;
        var hookResponse = el.find('div').scope().postHook('3000.45', 'urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
        expect(hookResponse[0]).to.be.eq('3000.45');
        expect(hookResponse[1]).to.be.eq('urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
    });

    it('should filter/change columns based on the default method type', function () {
        instScope = el.find('div').scope();
        instScope.changeMethodType('default');
        expect(instScope.methodType).to.be.eq('default');
        expect(instScope.methodList.length).to.be.eq(1);
        expect(instScope.methodListCols.length).to.be.eq(4);
    });

    it('should filter/change columns based on the card method type', function () {
        instScope = el.find('div').scope();
        instScope.changeMethodType('card');
        expect(instScope.methodType).to.be.eq('card');
        expect(instScope.methodList.length).to.be.eq(2);
        expect(instScope.methodListCols.length).to.be.eq(4);
    });

    it('should filter/change columns based on the ach method type', function () {
        instScope = el.find('div').scope();
        instScope.changeMethodType('ach');
        expect(instScope.methodType).to.be.eq('ach');
        expect(instScope.methodList.length).to.be.eq(1);
        expect(instScope.methodListCols.length).to.be.eq(4);
    });

});