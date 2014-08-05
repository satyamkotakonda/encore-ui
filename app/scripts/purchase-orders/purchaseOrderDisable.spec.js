/* jshint node: true */
describe('rxPurchaseOrderDisable', function () {
    var el, scope, directiveScope, compile, rootScope, mainEl,
        userName = 'test',
        validTemplate = '<rx-purchase-order-disable' +
                        '    user-name="userName"' +
                        '    controller="PurchaseOrderDisableModalCtrl"' +
                        '    current-purchase-order="{{ poNumber }}"' +
                        '    classes="button">' +
                        '    <img src="/billing/images/icon-add_white.png" /> Add New Purchase Order' +
                        '</rx-purchase-order-disable>';
    beforeEach(function () {
        module('billingApp');
        module('views/purchase-orders/purchaseOrderDisable.html');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('views/purchase-orders/purchaseOrderDisable.html');

            $templateCache.put('/billing/views/purchase-orders/purchaseOrderDisable.html', template);
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.userName = userName;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
        mainEl = helpers.getChildDiv(el, 'rx-purchase-order-disable', 'class');
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
        expect(mainEl.hasClass('rx-purchase-order-disable')).to.be.true;
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

describe('rxPurchaseOrderDisable: PurchaseOrderDisableCtrl', function () {
    var scope, ctrl, notify, msgs, postHook;

    var purchaseOrder, account;

    var testAccountNumber = '020-12345',
        stack = 'purchaseOrderDisable',
        routeParams = { accountNumber: testAccountNumber };

    beforeEach(function () {
        module('constants');
        module('billingApp');

        inject(function ($controller, $rootScope, $q, rxNotify, PurchaseOrder, Account, STATUS_MESSAGES) {
            var getResourceResultMock = function (data) {
                    var deferred = $q.defer();
                    data.$promise = deferred.promise;
                    data.$deferred = deferred;
                    return data;
                },
                getResourceMock = function (returnData) {
                    return function (callData, success, error) {
                        returnData = getResourceResultMock(returnData);
                        if (arguments.length === 4) {
                            success = arguments[2];
                            error = arguments[3];
                        }
                        returnData.$promise.then(success, error);
                        return returnData;
                    };
                };
            msgs = STATUS_MESSAGES;
            notify = rxNotify;
            purchaseOrder = PurchaseOrder;
            purchaseOrder.disablePO = sinon.stub(purchaseOrder, 'disablePO', getResourceMock({}));

            account = Account;
            account.get = sinon.stub(account, 'get', getResourceMock({}));

            scope = $rootScope.$new();
            // Mock the modal instance for scope
            scope.$close = sinon.stub();
            scope.$dismiss = sinon.stub();
            scope.fields = {
                purchaseOrderNumber: '12345'
            };
            postHook = sinon.stub();

            ctrl = $controller('PurchaseOrderDisableCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                PurchaseOrder: purchaseOrder,
                Account: account
            });
        });
    });

    it('PurchaseOrderDisableCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('PurchaseOrderDisableCtrl should call postHook upon successful creation', function () {
        scope.postHook = postHook;
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.disablePO);

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[stack]).to.be.empty;
        sinon.assert.calledOnce(scope.postHook);
        sinon.assert.calledOnce(scope.$close);
    });

    it('PurchaseOrderDisableCtrl should disable a purchase order upon submit action', function () {
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.disablePO);

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks['page']).not.to.be.empty;
        sinon.assert.calledOnce(scope.$close);
    });

    it('PurchaseOrderDisableCtrl should reset the notificationStack upon multiple creation attempts', function () {
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[stack]).to.be.empty;
        expect(notify.stacks['page']).not.to.be.empty;
        expect(notify.stacks['page'][0].type).to.be.eq('success');

        // Begins to clear notificationStack defined in scope
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        scope.newPO.$deferred.reject({
            status: 400
        });
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        expect(notify.stacks['page']).to.be.empty;

        // Begins to clear default stack
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[stack]).to.be.empty;
        expect(notify.stacks['page']).not.to.be.empty;
        expect(notify.stacks['page'][0].type).to.be.eq('success');
    });

    it('PurchaseOrderDisableCtrl should display a success message upon creation in the notificationStack', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.disablePO);

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks['page']).not.to.be.empty;
        expect(notify.stacks['page'][0].type).to.be.eq('success');
        sinon.assert.calledOnce(scope.$close);
    });

    it('PurchaseOrderDisableCtrl should display permission denied message upon permission failure', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.disablePO);

        scope.newPO.$deferred.reject({
            status: 404
        });
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        expect(notify.stacks[stack][0].type).to.be.eq('error');
        var errorMsg = msgs.purchaseOrderDisable.error + ': (' + msgs.permissionDenied + ')';
        expect(notify.stacks[stack][0].text).to.be.eq(errorMsg);
    });

    it('PurchaseOrderDisableCtrl should display error message from api when PO disable fails', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.disablePO);

        scope.newPO.$deferred.reject({
            status: 400,
            data: {
                badRequest: {
                    message: 'Test Error Message'
                }
            }
        });
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        expect(notify.stacks[stack][0].type).to.be.eq('error');
        var errorMsg = msgs.purchaseOrderDisable.error + ': (Test Error Message)';
        expect(notify.stacks[stack][0].text).to.be.eq(errorMsg);
    });

    it('PurchaseOrderDisableCtrl should display generic error message when PO disable fails', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.disablePO);

        scope.newPO.$deferred.reject({
            status: 400
        });
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        expect(notify.stacks[stack][0].type).to.be.eq('error');
        expect(notify.stacks[stack][0].text).to.be.eq(msgs.purchaseOrderDisable.error + ': ()');
    });
});
