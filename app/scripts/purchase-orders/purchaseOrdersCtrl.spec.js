describe('PurchaseOrders: PurchaseOrdersCtrl', function () {
    var scope, ctrl, purchaseOrders, testPOs;
    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $q, PurchaseOrder) {
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

            testPOs = [{
                'id': 'ed81bfc6-81bf-4c65-a9aa-3eb25581bfc6',
                'poNumber': '1235678',
                'startDate': '2014-05-16',
                'endDate': '2014-05-16'
            }, {
                'id': 'ed81bfc6-81bf-4c62-b9aa-3eb25581bfc6',
                'poNumber': '123456',
                'startDate': '2014-05-16'
            }, {
                'id': 'ed81bfc6-81bf-4c67-99aa-3eb25581bfc6',
                'poNumber': '12345',
                'startDate': '2014-05-13',
                'endDate': '2014-05-13'
            }];

            purchaseOrders = PurchaseOrder;
            purchaseOrders.get = sinon.stub(purchaseOrders, 'list', getResourceMock(testPOs));
            scope = $rootScope.$new();

            ctrl = $controller('PurchaseOrdersCtrl',{
                $scope: scope,
                PurchaseOrder: purchaseOrders,
                $routeParams: { accountNumber: testAccountNumber }
            });
        });
    });

    it('PurchaseOrdersCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('PurchaseOrdersCtrl should get the current PurchaseOrder', function () {
        expect(scope.currentPurchaseOrder).to.be.undefined;
        scope.purchaseOrders.$deferred.resolve(testPOs);
        scope.$apply();
        expect(scope.currentPurchaseOrder).to.not.be.empty;
        expect(scope.currentPurchaseOrder).to.be.an.object;
    });

    it('PurchaseOrdersCtrl should return a sorting predicate when calling sortCol', function () {
        scope.sortCol('date');
        expect(scope.sort.predicate).to.be.eq('date');
    });
});