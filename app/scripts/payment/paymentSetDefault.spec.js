/* jshint node: true */

describe('rxPaymentSetDefault', function () {
    var el, scope, directiveScope, compile, rootScope, mainEl,
        userName = 'test', methodId = 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479',
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
                        '    post-hook="changeDefault"' +
                        '    user-name="userName"' +
                        '    method-id="methodId"' +
                        '    methods="methods">' +
                        '    Set as Primary' +
                        '</rx-payment-set-default>';
    var changeDefault = function (methodId) {
        return methodId;
    };

    beforeEach(function () {
        module('billingApp');
        module('views/payment/paymentSetDefault.html');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('views/payment/paymentSetDefault.html');

            $templateCache.put('/billing/views/payment/paymentSetDefault.html', template);
            paymentMethods.$promise = true;
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.userName = userName;
            scope.methodId = methodId;
            scope.methods = paymentMethods;
            scope.changeDefault = changeDefault;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
        mainEl = helpers.getChildDiv(el, 'rx-payment-set-default', 'class');
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
        expect(mainEl.hasClass('rx-payment-set-default')).to.be.true;
        expect(mainEl.children().length).to.be.gt(0);

        linkContainer = mainEl.find('span');
        expect(linkContainer).not.be.empty;
        expect(linkContainer.hasClass('rx-modal-action')).to.be.true;
        expect(linkContainer.children().length).to.be.gt(0);

        linkAction = linkContainer.find('a');
        expect(linkAction).not.be.empty;
        expect(linkAction.hasClass('action')).to.be.true;
    });

    it('should have the default method-id set', function () {
        expect(scope.methodId).to.be.eq('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
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

describe('rxPaymentSetDefault: PaymentSetDefaultCtrl', function () {
    var scope, ctrl, notify, msgs, postHook, paymentMethod;

    var testAccountNumber = '020-12345',
        stack = 'primaryPaymentChange',
        routeParams = { accountNumber: testAccountNumber };

    beforeEach(function () {
        module('constants');
        module('billingApp');

        inject(function ($controller, $rootScope, $q, PaymentMethod,
                         BillingErrorResponse, Account, STATUS_MESSAGES) {
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

            paymentMethod = PaymentMethod;
            paymentMethod.changeDefault = sinon.stub(paymentMethod, 'changeDefault', getResourceMock({}));

            scope = $rootScope.$new();
            // Mock the modal instance for scope
            scope.$close = sinon.stub();
            scope.$dismiss = sinon.stub();
            scope.payment = {
                methodId: '12345'
            };
            postHook = sinon.stub();

            ctrl = $controller('PaymentSetDefaultCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                PaymentMethod: paymentMethod,
                rxNotify: notify
            });
        });
    });

    it('PaymentSetDefaultCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('PaymentSetDefaultCtrl should call postHook upon successful method change', function () {
        scope.notificationStack = 'testPage';
        expect(notify.stacks).to.be.empty;
        scope.postHook = postHook;
        scope.submit();
        expect(notify.stacks[stack]).not.to.be.empty;

        sinon.assert.calledOnce(paymentMethod.changeDefault);

        scope.changeDefaultResult.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[scope.notificationStack]).not.to.be.empty;
        sinon.assert.calledOnce(scope.postHook);
        sinon.assert.calledOnce(scope.$close);
    });

    it('PaymentSetDefaultCtrl should display a success message upon creation in the notificationStack', function () {
        scope.notificationStack = 'testPage';
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(paymentMethod.changeDefault);

        scope.changeDefaultResult.$deferred.resolve({});
        scope.$apply();

        expect(notify.stacks[scope.notificationStack]).not.to.be.empty;
        expect(notify.stacks[scope.notificationStack][0].type).to.be.eq('success');
        sinon.assert.calledOnce(scope.$close);
    });

    it('PaymentSetDefaultCtrl should display error message from api when method change fails', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(paymentMethod.changeDefault);

        scope.changeDefaultResult.$deferred.reject({
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
        var errorMsg = msgs.changeDefault.error + ': (Test Error Message)';
        expect(notify.stacks[stack][0].msg).to.be.eq(errorMsg);
    });

    it('PaymentSetDefaultCtrl should display generic error message when method change fails', function () {
        scope.submit();
        expect(notify.stacks).not.to.be.empty;

        sinon.assert.calledOnce(paymentMethod.changeDefault);

        scope.changeDefaultResult.$deferred.reject({
            status: 400
        });
        scope.$apply();

        expect(notify.stacks[stack]).not.to.be.empty;
        expect(notify.stacks[stack][0].type).to.be.eq('error');
        expect(notify.stacks[stack][0].msg).to.be.eq(msgs.changeDefault.error + ': ()');

        expect(scope.$close).not.to.have.been.called;
    });
});
