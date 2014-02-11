
describe('Billing: LoginCtrl', function () {
    var scope, ctrl;
    beforeEach( function () {
        module('billingApp');
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            ctrl = $controller('LoginCtrl',{
                $scope: scope
            });
        });
    });

    it('LoginCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('LoginCtrl should automatically set default value for "hello"', function () {
        expect(scope.hello).to.not.be.empty;
        expect(scope.hello).to.eq('Hello');
    });
});