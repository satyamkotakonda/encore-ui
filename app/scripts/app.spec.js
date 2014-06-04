describe('Billing: app', function () {
    var scope, auth, env;

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $location, Auth, Environment) {
            scope = $rootScope.$new();
            env = Environment;
            auth = Auth;
        });
    });
});