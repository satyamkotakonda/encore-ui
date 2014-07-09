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

describe('rxPurchaseOrderCreate: PurchaseOrderCreateCtrl', function () {
    var scope, ctrl, notify, msgs, postHook;

    var purchaseOrder, account;

    var testAccountNumber = '020-12345',
        stack = 'purchaseOrderCreate',
        routeParams = { accountNumber: testAccountNumber };

    beforeEach(function () {
        module('constants');
        module('billingApp');

        inject(function ($controller, $rootScope, $q, PurchaseOrder, Account, STATUS_MESSAGES) {
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
            notify = {
                stacks: {},
                add: function (msg, opt) {
                    if (!_.isArray(notify.stacks[opt.stack])) {
                        notify.stacks[opt.stack] = [];
                    }
                    if (opt.stack) {
                        opt.msg = msg;
                        opt.id = _.uniqueId();
                        notify.stacks[opt.stack].push(opt);
                        return opt;
                    }
                },
                clear: function (stack) {
                    if (notify.stacks.hasOwnProperty(stack)) {
                        notify.stacks[stack] = undefined;
                        delete notify.stacks[stack];
                    }
                },
                dismiss: function (msg) {
                    notify.stacks[msg.stack] = _.reject(notify.stacks[msg.stack], { 'id': msg.id });
                }
            };

            purchaseOrder = PurchaseOrder;
            purchaseOrder.createPO = sinon.stub(purchaseOrder, 'createPO', getResourceMock({}));

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

            ctrl = $controller('PurchaseOrderCreateCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                PurchaseOrder: purchaseOrder,
                rxNotify: notify
            });
        });
    });

    it('PurchaseOrderCreateCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('PurchaseOrderCreateCtrl should call postHook upon successful creation', function () {
        expect(notify.stacks).to.be.empty;
        scope.postHook = postHook;
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.createPO);

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        sinon.assert.calledOnce(scope.postHook);
        sinon.assert.calledOnce(scope.$close);
    });

    it('PurchaseOrderCreateCtrl should create a purchase order upon submit action', function () {
        expect(notify.stacks).to.be.empty;

        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.createPO);

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        sinon.assert.calledOnce(scope.$close);
    });

    it('PurchaseOrderCreateCtrl should reset the notificationStack upon multiple creation attempts', function () {
        scope.notificationStack = 'testStack';
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[stack]).to.be.empty;
        expect(notify.stacks[scope.notificationStack]).not.to.be.empty;
        expect(notify.stacks[scope.notificationStack][0].type).to.be.eq('success');

        // Begins to clear notificationStack defined in scope
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        scope.newPO.$deferred.reject({
            status: 400
        });
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        expect(notify.stacks[scope.notificationStack]).to.be.empty;

        // Begins to clear default stack
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[stack]).to.be.empty;
        expect(notify.stacks[scope.notificationStack]).not.to.be.empty;
        expect(notify.stacks[scope.notificationStack][0].type).to.be.eq('success');
    });

    it('PurchaseOrderCreateCtrl should display a success message upon creation in the notificationStack', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.createPO);

        scope.newPO.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        expect(notify.stacks[stack][0].type).to.be.eq('success');
        sinon.assert.calledOnce(scope.$close);
    });

    it('PurchaseOrderCreateCtrl should display permission denied message upon permission failure', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.createPO);

        scope.newPO.$deferred.reject({
            status: 404
        });
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        expect(notify.stacks[stack][0].type).to.be.eq('error');
        var errorMsg = msgs.purchaseOrders.createError + ' "' + msgs.permissionDenied + '".';
        expect(notify.stacks[stack][0].msg).to.be.eq(errorMsg);
    });

    it('PurchaseOrderCreateCtrl should display error message from api when PO create fails', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.createPO);

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
        var errorMsg = msgs.purchaseOrders.createError + ' "Test Error Message".';
        expect(notify.stacks[stack][0].msg).to.be.eq(errorMsg);
    });

    it('PurchaseOrderCreateCtrl should display generic error message when PO create fails', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(purchaseOrder.createPO);

        scope.newPO.$deferred.reject({
            status: 400
        });
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        expect(notify.stacks[stack][0].type).to.be.eq('error');
        expect(notify.stacks[stack][0].msg).to.be.eq(msgs.purchaseOrders.createError);
    });
});
