
describe('Billing: OverviewCtrl', function () {
    var scope, ctrl;
    beforeEach( function () {
        module('billingApp');
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            ctrl = $controller('OverviewCtrl',{
                $scope: scope
            });
        });
    });

    it('OverviewCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('OverviewCtrl should have default values', function () {
        expect(scope.transactionStatus.length).to.be.eq(4);
        expect(scope.transactionTypes.length).to.be.eq(5);
        expect(scope.transactionDate.length).to.be.eq(4);
        expect(scope.sort).to.deep.eq({field: 'date', reverse:true});
    });
});