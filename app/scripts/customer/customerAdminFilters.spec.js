describe('CustomerAdminFilters', function () {
    var contactType, primaryAddress;

    var addresses, contacts;

    beforeEach(function () {
        module('billingApp');

        inject(function (ContactTypeFilter, PrimaryAddressFilter) {
            contactType = ContactTypeFilter;
            primaryAddress = PrimaryAddressFilter;
        });

        contacts = [{
            'lastName': 'Jones',
            'roles': {
                'role': [
                    'TECHNICAL'
                ]
            }
        }, {
            'lastName': 'Thatcher',
            'roles': {
                'role': [
                    'ADMINISTRATIVE'
                ]
            }
        }, {
            'lastName': 'Malu',
            'roles': {
                'role': [
                    'TECHNICAL'
                ]
            }
        }];

        addresses = [{
            'zipcode': '78218',
            'primary': true
        }, {
            'zipcode': '78218',
            'primary': false
        }];
    });

    it('ContactType filter should exist', function () {
        expect(contactType).to.exist;
        expect(contactType).to.not.be.empty;
    });

    it('ContacType filter should filter results', function () {
        expect(contactType(contacts, 'TECHNICAL').length).to.be.eq(2);
    });

    it('DefaultPaymentMethodFilter should return 1 address object', function () {
        expect(primaryAddress(addresses)).to.be.a('object');
    });

});