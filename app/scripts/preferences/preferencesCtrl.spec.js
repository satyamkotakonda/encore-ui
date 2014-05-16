describe('Preferences: PreferencesCtrl', function () {
    var scope, ctrl, billInfo, paymentInfo;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $q, BillInfo, PaymentInfo, AccountNumberUtil) {
            var getResourceResultMock = function (data) {
                    var deferred = $q.defer();
                    data.$promise = deferred.promise;
                    data.$resolved = false;
                    data.$deferred = deferred;
                    return data;
                },
                getResourceMock = function (returnData) {
                    returnData = getResourceResultMock(returnData);
                    return function (callData, success, error) {
                        returnData.$promise.then(success, error).finally(function () {
                            returnData.$resolved = true;
                        });
                        return returnData;
                    };
                };

            billInfo = BillInfo;
            paymentInfo = PaymentInfo;

            billInfo.get = sinon.stub(billInfo, 'get', getResourceMock({}));
            paymentInfo.get = sinon.stub(paymentInfo, 'get', getResourceMock({}));
            billInfo.updateInvoiceDeliveryMethod = sinon.stub(billInfo, 'updateInvoiceDeliveryMethod',
                                                                getResourceMock({}));
            paymentInfo.updateNotificationOption = sinon.stub(paymentInfo, 'updateNotificationOption',
                                                                getResourceMock({}));

            scope = $rootScope.$new();

            ctrl = $controller('PreferencesCtrl',{
                $scope: scope,
                BillInfo: billInfo,
                PaymentInfo: paymentInfo,
                AccountNumberUtil: AccountNumberUtil,
                $routeParams: { accountNumber: testAccountNumber }
            });
        });
    });

    it('PreferencesCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('PreferencesCtrl should check if billInfo resource is loading', function () {
        expect(scope.isResourceLoading(scope.billInfo)).to.be.true;
        scope.billInfo.$deferred.resolve({});
        scope.$apply();
        expect(scope.isResourceLoading(scope.billInfo)).to.be.false;
        expect(scope.billInfo).to.be.an.object;
    });

    it('PreferencesCtrl should check if paymentInfo resource is loading', function () {
        expect(scope.isResourceLoading(scope.paymentInfo)).to.be.true;
        scope.paymentInfo.$deferred.resolve({});
        scope.$apply();
        expect(scope.isResourceLoading(scope.paymentInfo)).to.be.false;
        expect(scope.paymentInfo).to.be.an.object;
    });

    it('PreferencesCtrl should update the payment/billing preferences', function () {
        scope.billInfo.$deferred.resolve({});
        scope.paymentInfo.$deferred.resolve({});
        scope.$apply();

        expect(scope.isResourceLoading(scope.billInfo, scope.billInfoUpdate)).to.be.false;
        expect(scope.isResourceLoading(scope.paymentInfo, scope.paymentInfoUpdate)).to.be.false;

        scope.updatePreferences();
        expect(scope.isResourceLoading(scope.billInfo, scope.billInfoUpdate)).to.be.true;
        expect(scope.isResourceLoading(scope.paymentInfo, scope.paymentInfoUpdate)).to.be.true;

        scope.billInfoUpdate.$deferred.resolve({});
        scope.paymentInfoUpdate.$deferred.resolve({});
        scope.$apply();

        expect(scope.isResourceLoading(scope.billInfo, scope.billInfoUpdate)).to.be.false;
        expect(scope.isResourceLoading(scope.paymentInfo, scope.paymentInfoUpdate)).to.be.false;
    });

});