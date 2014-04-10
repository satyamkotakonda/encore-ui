/* jshint node: true */

describe('rxPaymentDisable', function () {
    var el, scope, directiveScope, compile, rootScope,
        user = 'test',
        paymentMethods = [{
            id: 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
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
                        '    post-hook="disablePayment"' +
                        '    user="{{user}}"' +
                        '    method="method">' +
                        '    Disable' +
                        '</rx-payment-disable>';
    var disablePayment = function (methodId) {
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
            scope.method = paymentMethods[0];
            scope.disablePayment = disablePayment;
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
        expect(scope.method.id).to.be.eq('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

});