describe('Usage: UsageCtrl', function () {
    var scope, ctrl;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope) {
            // var getResourceMock = function (data) {
            //     var deferred = $q.defer();
            //     data.$promise = deferred.promise;
            //     data.$deferred = deferred;
            //     return data;
            // };
            scope = $rootScope.$new();

            ctrl = $controller('UsageCtrl',{
                $scope: scope,
                $routeParams: { accountNumber: testAccountNumber }
            });
        });
    });

});
