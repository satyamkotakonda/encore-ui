/* jshint node: true */

describe('rxPaymentDisable', function () {
    var el, scope, directiveScope, compile, rootScope, mainEl,
        userName = 'test',
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
                        '    user-name="userName"' +
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

            $templateCache.put('/billing/views/payment/paymentDisable.html', template);
            paymentMethods.$promise = true;
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.userName = userName;
            scope.method = paymentMethods[0];
            scope.disablePayment = disablePayment;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
        mainEl = helpers.getChildDiv(el, 'rx-payment-disable', 'class');
        directiveScope = mainEl.scope();
    });

    afterEach(function () {
        el = null;
        directiveScope = null;
    });

    // Make sure that the template being rendered has the modal-action trigger
    it('should render the trigger action template correctly', function () {
        var linkContainer, linkAction;
        expect(el).not.be.empty;
        expect(mainEl).not.be.empty;
        expect(mainEl.hasClass('rx-payment-disable')).to.be.true;
        expect(mainEl.children().length).to.be.gt(0);

        linkContainer = mainEl.find('span');
        expect(linkContainer).not.be.empty;
        expect(linkContainer.hasClass('rx-modal-action')).to.be.true;
        expect(linkContainer.children().length).to.be.gt(0);

        linkAction = linkContainer.find('a');
        expect(linkAction).not.be.empty;
        expect(linkAction.hasClass('payment-action')).to.be.true;
    });

    it('should have the default method-id set', function () {
        expect(scope.method.id).to.be.eq('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

});