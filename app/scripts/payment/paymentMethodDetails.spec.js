describe('rxPaymentMethodDetails', function () {
    var scope, compile, rootScope, el,
        validTemplate = '<rx-payment-method-details></rx-payment-method-details>';

    beforeEach(function () {
        module('billingApp');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('views/payment/paymentMethodDetails.html');
            $templateCache.put('/billing/views/payment/paymentMethodDetails.html', template);

            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
        });
    });

    it('should render template correctly', function () {
        scope.transaction = {
            method: {
                paymentCard: {
                    cardHolderName:  'Test User',
                    cardType:        'VISA',
                    cardNumber:      'XXXX-XXXX-XXXX-9999',
                    expirationDate:  '10/15'
                }
            }
        };
        el = helpers.createDirective(validTemplate, compile, scope);
        el = helpers.getChildDiv(el, 'rx-payment-method-details', 'class');
        expect(el).to.not.be.empty;
        expect(el.find('dl').eq(0).hasClass('ng-hide')).to.be.false;
    });

    it('should not render if there is no payment method', function () {
        el = helpers.createDirective(validTemplate, compile, scope);
        el = helpers.getChildDiv(el, 'rx-payment-method-details', 'class');
        expect(el.find('dl').eq(0).hasClass('ng-hide')).to.be.true;
    });
});
