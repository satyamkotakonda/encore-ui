
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

});