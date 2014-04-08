/* jshint node: true */

describe('rxPaymentDisable', function () {
    var el, scope, directiveScope, compile, rootScope,
        user = 'test', methodId = 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
        paymentMethods = [{
            id: 'id1',
            isDefault: true,
            disabled: false,
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
        validTemplate = '<rx-payment-disable' +
                        '    post-hook="postPayment"' +
                        '    user="{{user}}"' +
                        '    method-id="{{methodId}}"' +
                        '    method="method">' +
                        '    <strong>+</strong> Make a Payment' +
                        '</rx-payment-disable>';
    var postPayment = function (methodId) {
        return methodId;
    };

    beforeEach(function () {
        module('billingApp');
        module('views/payment/paymentDisable.html');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('views/payment/paymentDisable.html');

            $templateCache.put('/views/payment/paymentDisable.html', template);
            paymentMethods.$promise = true;
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.user = user;
            scope.methodId = methodId;
            scope.method = paymentMethods[0];
            scope.postPayment = postPayment;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
        directiveScope = el.find('div').scope();
    });

    afterEach(function () {
        el = null;
        directiveScope = null;
    });

    it('should render template correctly', function () {
        expect(el).not.be.empty;
        expect(el.find('div')).not.be.empty;
        expect(el.find('div').attr('class').split(' ').indexOf('rx-payment-set-default')).to.be.gt(-1);
    });

    it('should have the default method-id set', function () {
        expect(el.attr('method-id')).to.be.eq('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

    it('should set the initial payment final amount/method-id values', function () {
        directiveScope.setDefaultValues('urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
        expect(directiveScope.payment.methodId).to.be.eq('urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
    });

    it('should call post-hook with the final amount/method-id values', function () {
        directiveScope.changeMethodType('isDefault');
        var hookResponse = directiveScope.postHook('urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
        expect(hookResponse).to.be.eq('urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
    });

});