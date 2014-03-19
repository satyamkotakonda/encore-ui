/* jshint node: true */

describe('rxPaymentSetDefault', function () {
    var el, scope, directiveScope, compile, rootScope,
        user = 'test', methodId = 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
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
        validTemplate = '<rx-payment-set-default' +
                        '    post-hook="postPayment"' +
                        '    user="{{user}}"' +
                        '    method-id="{{methodId}}"' +
                        '    methods="methods">' +
                        '    <strong>+</strong> Make a Payment' +
                        '</rx-payment-set-default>';
    var postPayment = function (methodId) {
        return methodId;
    };

    beforeEach(function () {
        module('billingApp');
        module('views/payment/paymentSetDefault.html');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('views/payment/paymentSetDefault.html');

            $templateCache.put('/views/payment/paymentSetDefault.html', template);
            paymentMethods.$promise = true;
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.user = user;
            scope.methodId = methodId;
            scope.methods = paymentMethods;
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

    it('should filter/change columns based on the default method type', function () {
        directiveScope.changeMethodType('isDefault');
        expect(directiveScope.methodType).to.be.eq('isDefault');
        expect(directiveScope.methodList.length).to.be.eq(1);
        expect(directiveScope.methodListCols.length).to.be.eq(4);
    });

    it('should filter/change columns based on the card method type', function () {
        directiveScope.changeMethodType('paymentCard');
        expect(directiveScope.methodType).to.be.eq('paymentCard');
        expect(directiveScope.methodList.length).to.be.eq(2);
        expect(directiveScope.methodListCols.length).to.be.eq(4);
    });

    it('should filter/change columns based on the ach method type', function () {
        directiveScope.changeMethodType('electronicCheck');
        expect(directiveScope.methodType).to.be.eq('electronicCheck');
        expect(directiveScope.methodList.length).to.be.eq(1);
        expect(directiveScope.methodListCols.length).to.be.eq(4);
    });

});