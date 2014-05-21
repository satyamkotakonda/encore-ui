/* jshint node: true */

describe('rxPurchaseOrderCreate', function () {
    var el, scope, directiveScope, compile, rootScope, mainEl,
        userName = 'test',
        validTemplate = '<rx-purchase-order-create' +
                        '    user-name="userName"' +
                        '    controller="PurchaseOrderCreateModalCtrl"' +
                        '    current-purchase-order="{{ poNumber }}"' +
                        '    classes="button">' +
                        '    <img src="/billing/images/icon-add_white.png" /> Add New Purchase Order' +
                        '</rx-purchase-order-create>';
    beforeEach(function () {
        module('billingApp');
        module('views/purchase-orders/purchaseOrderCreate.html');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('views/purchase-orders/purchaseOrderCreate.html');

            $templateCache.put('/billing/views/purchase-orders/purchaseOrderCreate.html', template);
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.userName = userName;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
        mainEl = helpers.getChildDiv(el, 'rx-purchase-order-create', 'class');
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
        expect(mainEl.hasClass('rx-purchase-order-create')).to.be.true;
        expect(mainEl.children().length).to.be.gt(0);

        linkContainer = mainEl.find('span');
        expect(linkContainer).not.be.empty;
        expect(linkContainer.hasClass('rx-modal-action')).to.be.true;
        expect(linkContainer.children().length).to.be.gt(0);

        linkAction = linkContainer.find('a');
        expect(linkAction).not.be.empty;
        expect(linkAction.hasClass('action')).to.be.true;
    });

});