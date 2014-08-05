describe('rxGenericUtil', function () {
    var scope;
    var acctNumberUtil, loadingValue;
    var transform, emptyTransform;

    var getResourceResultMock, getResourceMock, testRes;
    var paymentMethods, testData, testError, accountNumber, testOutput, loadingMsg, notFoundMsg;

    beforeEach(function () {
        module('constants'); // Required by LoadingValueFilter
        module('rxGenericUtil');

        inject(function ($rootScope, $q,
            AccountNumberUtil, Transform, LoadingValueFilter) {

            getResourceResultMock = function (data) {
                var deferred = $q.defer();
                data.$promise = deferred.promise;
                data.$deferred = deferred;
                data.$resolved = false;
                return data;
            };
            getResourceMock = function (returnData) {
                returnData = getResourceResultMock(returnData);
                return function (callData, success, error) {
                    returnData.$promise
                        .then(success, error)
                        .finally(function () {
                            returnData.$resolved = true;
                        });
                    return returnData;
                };
            };

            scope = $rootScope.$new();
            accountNumber = '12345';
            loadingMsg = '...Loading Data...';
            notFoundMsg = 'No Value';
            testOutput = 'FINAL OUTPUT';

            transform = Transform('test.path', 'test.error');
            emptyTransform = Transform();
            testData = '{"test":{"path":true}}';
            testError = '{"test":{"path":true,"error":"Error"}}';
            paymentMethods = [{ isDefault: true, id: 'payment-id-1' },
                              { id: 'payment-id-2' },
                              { id: 'payment-id-3' },
                              { id: 'payment-id-4' }];

            acctNumberUtil = AccountNumberUtil;
            loadingValue = function () {
                return LoadingValueFilter(testRes.data, testRes.$resolved, notFoundMsg, loadingMsg);
            };
        });
    });

    describe('Transform', function () {
        it('should return a function to transform data', function () {
            expect(transform).to.be.a('function');
        });

        it('should correctly return the values from the parsed object', function () {
            expect(transform(testData)).to.be.eq(true);
            expect(transform(testError)).to.be.eq('Error');
        });

        it('should return the parsed object if no path is given', function () {
            expect(JSON.stringify(emptyTransform(testData))).to.eq(testData);
        });
    });

    describe('AccountNumberUtil', function () {
        it('should return proper values for an account number', function () {
            expect(acctNumberUtil.getRCN(accountNumber)).to.be.eq('12345');
            expect(acctNumberUtil.getRAN(accountNumber)).to.be.eq('020-12345');
            expect(acctNumberUtil.getAccountType(accountNumber)).to.be.eq('CLOUD');
        });

        it('should return undefined for falsy values', function () {
            expect(acctNumberUtil.getRCN(false)).to.be.undefined;
            expect(acctNumberUtil.getRAN(false)).to.be.undefined;
            expect(acctNumberUtil.getAccountType(false)).to.be.undefined;
        });
    });

    describe('LoadingValue', function () {
        it('should display a loading message until the resolved flag is true', function () {
            testRes = getResourceMock({ data: testOutput })();
            expect(loadingValue()).to.be.eq(loadingMsg);
            scope.$apply(function () {
                testRes.$deferred.resolve();
            });
            expect(loadingValue()).to.be.eq(testOutput);
        });

        it('should display a falsy message when the resolved flag is false', function () {
            testRes = getResourceMock({ data: null })();
            expect(loadingValue()).to.be.eq(loadingMsg);
            scope.$apply(function () {
                testRes.$deferred.resolve(false);
            });
            expect(loadingValue()).to.be.eq(notFoundMsg);
        });
    });
});

describe('rxModalUtil', function () {
    var modalUtil, notifySvc, q, scope;
    var emptyStacksTest = function () {
        expect(notifySvc.stacks.page).to.be.empty;
        _.each(arguments, function (stack) {
            expect(notifySvc.stacks[stack]).to.be.empty;
        });
    };

    var notEmptyStacksTest = function (stack, msg, notification, type) {
        expect(notifySvc.stacks[stack]).not.to.be.empty;
        expect(notifySvc.stacks[stack][0]).to.be.eq(notification);

        expect(notifySvc.stacks[stack][0].type).to.be.eq(type);
        expect(notifySvc.stacks[stack][0].text).to.be.eq(msg);
    };

    var successMsg = 'Test Success Message';
    var errorMsg = 'Test Error Message';
    var loadingMsg = 'Test Loading Message';

    beforeEach(function () {
        module('encore.ui.rxNotify');
        module('rxGenericUtil');

        inject(function ($rootScope, $q, rxNotify, rxModalUtil) {
            modalUtil = rxModalUtil;
            notifySvc = rxNotify;
            q = $q;
            scope = $rootScope.$new();
            scope.$close = sinon.stub();
            scope.$dismiss = sinon.stub();
        });
    });

    describe('Notification Stacks', function () {
        it('should keep track of stacks to be cleared', function () {
            var stacks = modalUtil.registerStacks();
            // We start with the default stack of page
            expect(stacks.length).to.be.eq(1);

            stacks = modalUtil.registerStacks('test', 'test-stack');
            // Should have 3 stacks now
            expect(stacks.length).to.be.eq(3);
        });

        it('should dismiss all notifications in the registered stacks', function () {
            var stacks = modalUtil.registerStacks('test');
            expect(stacks.length).to.be.eq(2);
            expect(notifySvc.stacks['test']).to.be.empty;

            notifySvc.add('test message', {
                type: 'warning',
                stack: 'test'
            });

            expect(notifySvc.stacks['test']).to.not.be.empty;
            expect(notifySvc.stacks['test'].length).to.be.eq(1);

            modalUtil.clearNotifications();

            expect(notifySvc.stacks['page']).to.be.empty;
            expect(notifySvc.stacks['test']).to.be.empty;
        });
    });

    describe('Success Actions', function () {
        it('should add a success notification to the default stack', function () {
            modalUtil.registerStacks('test');

            var callback = modalUtil.success(successMsg);

            emptyStacksTest('test');

            var notification = callback();

            expect(notifySvc.stacks.test).to.be.empty;
            notEmptyStacksTest('page', successMsg, notification, 'success');

            modalUtil.clearNotifications();

            emptyStacksTest('test');
        });

        it('should add a success notification to the specified stack', function () {
            modalUtil.registerStacks('test');
            var callback = modalUtil.success(successMsg, 'test');

            emptyStacksTest('test');

            var notification = callback();

            expect(notifySvc.stacks.page).to.be.empty;
            notEmptyStacksTest('test', successMsg, notification, 'success');

            modalUtil.clearNotifications();
            emptyStacksTest('test');
        });

        it('should add success notification & call $close', function () {
            modalUtil.registerStacks('test');
            var callback = modalUtil.successClose(scope, successMsg, 'test');
            expect(notifySvc.stacks.test).to.be.empty;

            var notification = callback();

            notEmptyStacksTest('test', successMsg, notification, 'success');
            sinon.assert.calledOnce(scope.$close);
        });
    });

    describe('Failure Actions', function () {
        it('should add an error notification to the default stack', function () {
            modalUtil.registerStacks('test');
            emptyStacksTest('test');

            var callback = modalUtil.fail(null, errorMsg);
            var notification = callback();

            expect(notifySvc.stacks.test).to.be.empty;
            notEmptyStacksTest('page', errorMsg, notification, 'error');

            modalUtil.clearNotifications();
            emptyStacksTest('test');
        });

        it('should add an error notification to the specified stack', function () {
            modalUtil.registerStacks('test');
            emptyStacksTest('test');

            var callback = modalUtil.fail(null, errorMsg, 'test');
            var notification = callback();

            expect(notifySvc.stacks.page).to.be.empty;
            notEmptyStacksTest('test', errorMsg, notification, 'error');

            modalUtil.clearNotifications();
            emptyStacksTest('test');
        });

        it('should add an error notification with an ammended message from parser', function () {
            modalUtil.registerStacks('test');
            emptyStacksTest('test');

            var parser = function () {
                return {
                    msg: 'test'
                };
            };

            var callback = modalUtil.fail(parser, errorMsg);
            var notification = callback();

            expect(notifySvc.stacks.test).to.be.empty;
            notEmptyStacksTest('page', errorMsg + ': (test)', notification, 'error');

            modalUtil.clearNotifications();
            emptyStacksTest('test');
        });

        it('should add an error notification without an ammended message from falsy parser', function () {
            modalUtil.registerStacks('test');
            emptyStacksTest('test');

            var parser = function () {
                return null;
            };

            var callback = modalUtil.fail(parser, errorMsg);
            var notification = callback();

            expect(notifySvc.stacks.test).to.be.empty;
            notEmptyStacksTest('page', errorMsg, notification, 'error');

            modalUtil.clearNotifications();
            emptyStacksTest('test');
        });

        it('should add an error notification & call $dismiss', function () {
            modalUtil.registerStacks('test');
            var callback = modalUtil.failDismiss(scope, null, errorMsg, 'test');
            expect(notifySvc.stacks.test).to.be.empty;

            var notification = callback();

            notEmptyStacksTest('test', errorMsg, notification, 'error');
            sinon.assert.calledOnce(scope.$dismiss);
        });
    });

    describe('Processing Action', function () {
        var defer, promise;
        beforeEach(function () {
            defer = q.defer();
            promise = defer.promise;
        });

        it('should show a loading notification', function () {
            modalUtil.registerStacks('test');
            emptyStacksTest('test');

            var callback = modalUtil.processing(scope, loadingMsg);

            var notification = callback(promise);

            expect(notifySvc.stacks.test).to.be.empty;
            notEmptyStacksTest('page', loadingMsg, notification, 'info');

            modalUtil.clearNotifications();

            emptyStacksTest('test');
        });

        it('should show a dismiss notification when promise is done', function () {
            modalUtil.registerStacks('test');
            emptyStacksTest('test');

            var callback = modalUtil.processing(scope, loadingMsg, 'test');
            var notification = callback(promise);

            expect(notifySvc.stacks.page).to.be.empty;
            notEmptyStacksTest('test', loadingMsg, notification, 'info');

            defer.resolve();
            scope.$digest();

            emptyStacksTest('test');
        });

        it('should call postHook when promise is resolved', function () {
            scope.postHook = sinon.stub();

            modalUtil.registerStacks('test');
            emptyStacksTest('test');

            var callback = modalUtil.processing(scope, '');
            callback(promise);

            defer.resolve();
            scope.$digest();

            sinon.assert.calledOnce(scope.postHook);
        });
    });

    describe('Wrapper Instance', function () {
        var defer, promise, wrapper, expectedErrorMsg;
        beforeEach(function () {
            defer = q.defer();
            promise = defer.promise;

            // Create a fresh instance for each test
            wrapper = modalUtil.getModal(scope, 'test', {
                success: successMsg,
                error: errorMsg,
                loading: loadingMsg
            }, function () {
                return {
                    msg: 'test parser'
                };
            });

            expectedErrorMsg = errorMsg + ': (test parser)';
        });

        it('should set up an instance of the modal wrapper', function () {
            expect(wrapper).to.be.instanceOf(modalUtil.getModal);
        });

        it('should get either the configured stack, or the passed stack name', function () {
            expect(wrapper.getStack()).to.eq('test');
            expect(wrapper.getStack('test-stack')).to.eq('test-stack');
        });

        it('should clear notification stacks', function () {
            emptyStacksTest('test');

            var notification = wrapper.processing(promise);
            notEmptyStacksTest('test', loadingMsg, notification, 'info');

            wrapper.clear();
            emptyStacksTest();
        });

        describe('Loading', function () {
            it('should add loading notification', function () {
                emptyStacksTest('test');

                var notification = wrapper.processing(promise);
                notEmptyStacksTest('test', loadingMsg, notification, 'info');
            });
        });

        describe('Success', function () {
            it('should add a success notification without closing', function () {
                emptyStacksTest('test');

                var callback = wrapper.success('test');
                var notification = callback();
                notEmptyStacksTest('test', successMsg, notification, 'success');

                sinon.assert.notCalled(scope.$close);
            });

            it('should add a success notification & close', function () {
                emptyStacksTest('test');

                var callback = wrapper.successClose('test');
                var notification = callback();
                notEmptyStacksTest('test', successMsg, notification, 'success');

                sinon.assert.calledOnce(scope.$close);
            });
        });

        describe('Failure', function () {
            it('should add an error notification without dismissing', function () {
                emptyStacksTest('test');

                var callback = wrapper.fail('test');
                var notification = callback();
                notEmptyStacksTest('test', expectedErrorMsg, notification, 'error');

                sinon.assert.notCalled(scope.$close);
            });

            it('should add a success notification & close', function () {
                emptyStacksTest('test');

                var callback = wrapper.failDismiss('test');
                var notification = callback();
                notEmptyStacksTest('test', expectedErrorMsg, notification, 'error');

                sinon.assert.calledOnce(scope.$dismiss);
            });
        });
    });
});
