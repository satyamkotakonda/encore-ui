describe('CustomerAdminFilters', function () {
    var roleName;
    var roles;

    beforeEach(function () {
        module('billingApp');

        inject(function (RoleNameFilter) {
            roleName = RoleNameFilter;
        });

        roles = [{
            'role': 'Account Manager',
            'user': {
                'sso': 'joe.racker',
                'email': 'joe.racker@rackspace.com',
                'name': 'Joe Racker'
            }
        }];
    });

    it('ContactType filter should exist', function () {
        expect(roleName).to.exist;
        expect(roleName).to.not.be.empty;
    });

    it('ContacType filter should filter results', function () {
        expect(roleName(roles, 'Account Manager').length).to.be.eq(1);
        expect(roleName(roles, 'Account Manager').user).to.be.an.object;
    });

});