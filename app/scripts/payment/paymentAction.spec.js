/* jshint node: true */

describe('rxPaymentAction', function () {
    var el, scope, directiveScope, compile, rootScope, mainEl,
        userName = 'test', amount = '2000.00', methodId = 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
        paymentMethods = [{
            id: 'id1',
            isDefault: true,
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
                        '    user-name="userName"' +
                        '    amount="amount"' +
                        '    method-id="methodId"' +
                        '    methods="methods">' +
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

            $templateCache.put('/billing/views/payment/paymentAction.html', template);
            paymentMethods.$promise = true;
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.userName = userName;
            scope.amount = amount;
            scope.methodId = methodId;
            scope.methods = paymentMethods;
            scope.postPayment = postPayment;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
        mainEl = helpers.getChildDiv(el, 'rx-payment-action', 'class');
        directiveScope = mainEl.scope();
    });

    afterEach(function () {
        el = null;
        directiveScope = null;
    });

    // Make sure that the template being rendered has the modal-action trigger
    it('should render template correctly', function () {
        var linkContainer, linkAction;
        expect(el).not.be.empty;
        expect(mainEl).not.be.empty;
        expect(mainEl.hasClass('rx-payment-action')).to.be.true;
        expect(mainEl.children().length).to.be.gt(0);

        linkContainer = mainEl.find('span');
        expect(linkContainer).not.be.empty;
        expect(linkContainer.hasClass('rx-modal-action')).to.be.true;
        expect(linkContainer.children().length).to.be.gt(0);

        linkAction = linkContainer.find('a');
        expect(linkAction).not.be.empty;
        expect(linkAction.hasClass('payment-action')).to.be.true;
    });

    it('should have the default amount set', function () {
        expect(scope.amount).to.be.eq('2000.00');
    });

    it('should have the default method-id set', function () {
        expect(scope.methodId).to.be.eq('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

    it('should set the initial payment final amount/method-id values', function () {
        directiveScope.setDefaultValues('3000.45', 'urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
        expect(directiveScope.payment.amount).to.be.eq('3000.45');
        expect(directiveScope.payment.methodId).to.be.eq('urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
    });

    it('should call post-hook with the final amount/method-id values', function () {
        directiveScope.changeMethodType('isDefault');
        var hookResponse = directiveScope.postHook('3000.45', 'urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
        expect(hookResponse[0]).to.be.eq('3000.45');
        expect(hookResponse[1]).to.be.eq('urn:uuid:baa17695-a4b3-4c5a-bdbe-361d1bf205c7');
    });

});