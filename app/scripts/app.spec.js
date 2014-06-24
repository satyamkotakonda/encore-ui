describe('Billing: app', function () {
    var scope, auth, env, root, location, win;

    // Hijack $window service to not allow page changes we only need this here
    beforeEach(module(function ($provide) {
        win = {
            location: '',
            document: [{}]
        };
        $provide.constant('$window', win);
    }));

    beforeEach(module('billingApp'));

    beforeEach(function () {
        inject(function ($controller, $rootScope, $location, $window, Auth, Environment) {
            root = $rootScope;
            scope = $rootScope.$new();

            env = Environment;
            auth = Auth;
            auth.isAuthenticated = sinon.stub();
            auth.isAuthenticated.onCall(0).returns(false);
            auth.isAuthenticated.returns(true);

            win = $window;
            win.location = '/billing';

            // console.log(window);
            env.get = sinon.stub();
            env.get.returns({ name: 'staging' });

            location = $location;
            location.url = sinon.stub().returns('');
        });
    });

    it('should do default auth functions', function () {
        sinon.assert.notCalled(auth.isAuthenticated);
        expect(win.location).to.be.equal('/billing');

        root.$broadcast('$routeChangeStart');
        sinon.assert.calledOnce(auth.isAuthenticated);
        expect(win.location.indexOf('/login')).to.be.eq(0);
    });

    it('should skip default auth functions', function () {
        env.get.returns({ name: 'local' });
        sinon.assert.notCalled(auth.isAuthenticated);
        expect(win.location).to.be.equal('/billing');

        root.$broadcast('$routeChangeStart');
        sinon.assert.notCalled(auth.isAuthenticated);
        expect(win.location).to.be.equal('/billing');
    });

});