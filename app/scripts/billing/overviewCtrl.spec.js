/* jshint node: true */
describe('Billing: OverviewCtrl', function () {
    var scope, ctrl, PageTrackingObject;

    var testAccountNumber = '1020121';

    beforeEach(function () {
        module('billingApp');
        inject(function ($controller, $rootScope, PageTracking) {
            scope = $rootScope.$new();
            PageTrackingObject = PageTracking.createInstance().constructor;
            
            ctrl = $controller('OverviewCtrl',{
                $scope: scope,
                $routeParams: {
                    accountNumber: testAccountNumber
                }
            });
        });
    });

    it('OverviewCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('OverviewCtrl should have a sort object defined', function () {
        expect(scope.sort).to.be.a('object');
        expect(scope.sort).to.have.property('field');
        expect(scope.sort.field).to.eq('date');
    });

    it('OverviewCtrl should have a pager defined by PageTracking', function () {
        expect(scope.pager).to.be.an.instanceof(PageTrackingObject);
    });

    it('OverviewCtrl should have transaction data types defined', function () {
        expect(scope.transactionData.types).to.be.an('array');
        expect(scope.transactionData.types).to.have.length.above(0);

        expect(scope.transactionData.status).to.be.an('array');
        expect(scope.transactionData.status).to.have.length.above(0);
    });
});