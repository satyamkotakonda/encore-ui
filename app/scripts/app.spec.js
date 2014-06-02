describe('Billing: LoginModalCtrl', function () {
    var scope, auth, env;

    beforeEach(function () {
        module('clusterBuildApp');

        inject(function ($controller, $rootScope, $location, Auth, Environment) {
            scope = $rootScope.$new();
            env = Environment;
            auth = Auth;
        });
    });
});