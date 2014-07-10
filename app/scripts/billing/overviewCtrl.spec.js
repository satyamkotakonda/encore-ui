describe('Billing: OverviewCtrl', function () {
    var scope, ctrl, balanceData, paymentMethods, supportRolesData, contactData;

    var balance, paymentMethod, contractEntity, supportInfo,
        contact, account, supportAccount, supportRoles, payment;

    var testAccountNumber = '020-12345',
        routeParams = { accountNumber: testAccountNumber };

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $httpBackend, $q,
            Balance, Payment, PaymentMethod, ContractEntity, SupportInfo,
            Contact, Account, SupportAccount, SupportRoles,
            DefaultPaymentMethodFilter) {
            var getResourceResultMock = function (data) {
                    var deferred = $q.defer();
                    data.$promise = deferred.promise;
                    data.$deferred = deferred;
                    return data;
                },
                getResourceMock = function (returnData) {
                    returnData = getResourceResultMock(returnData);
                    return function (callData, success, error) {
                        returnData.$promise.then(success, error);
                        return returnData;
                    };
                };

            balanceData = {
                amountDue: '2124.00'
            };
            paymentMethods = [{
                isDefault: true,
                id: 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479'
            }];
            supportRolesData = [{
                role: 'Account Manager',
                user: {
                    name: 'Joe Racker'
                }
            }];
            contactData = [{
                'firstName': 'Joe',
                'lastName': 'Racker',
                'roles': {
                    'role': [
                        'TECHNICAL'
                    ]
                },
                'addresses': {
                    'address': [{
                        'zipcode': '78218',
                        'street': '5000 Walzem Road',
                        'primary': true,
                        'state': 'Texas',
                        'country': 'US',
                        'city': 'San Antonio'
                    }]
                }
            }, {
                'firstName': 'Joe',
                'lastName': 'Racker',
                'roles': {
                    'role': [
                        'BILLING'
                    ]
                },
                'addresses': {
                    'address': [{
                        'zipcode': '78218',
                        'street': '5000 Walzem Road',
                        'primary': true,
                        'state': 'Texas',
                        'country': 'US',
                        'city': 'San Antonio'
                    }]
                }
            }];
            balance = Balance;
            paymentMethod = PaymentMethod;
            contractEntity = ContractEntity;
            supportInfo = SupportInfo;

            account = Account;
            contact = Contact;

            supportAccount = SupportAccount;
            supportRoles = SupportRoles;

            payment = Payment;
            payment.makePayment = sinon.stub(payment, 'makePayment', getResourceMock({}));

            balance.get = sinon.stub(balance, 'get', getResourceMock(balanceData));
            paymentMethod.list = sinon.stub(paymentMethod, 'list', getResourceMock(paymentMethods));
            contractEntity.get = sinon.stub(contractEntity, 'get', getResourceMock({}));
            supportInfo.get = sinon.stub(supportInfo, 'get', getResourceMock({}));

            account.get = sinon.stub(account, 'get', getResourceMock({}));
            contact.list = sinon.stub(contact, 'list', getResourceMock([]));

            supportAccount.get = sinon.stub(supportAccount, 'get', getResourceMock({}));
            supportRoles.list = sinon.stub(supportRoles, 'list', getResourceMock(supportRolesData));

            scope = $rootScope.$new();
            ctrl = $controller('OverviewCtrl',{
                $scope: scope,
                Balance: balance,
                Payment: payment,
                PaymentMethod: paymentMethod,
                ContractEntity: contractEntity,
                SupportInfo: supportInfo,
                SupportRoles: supportRoles,
                Account: account,
                Contact: contact,
                $routeParams: routeParams,
                DefaultPaymentMethodFilter: DefaultPaymentMethodFilter,
                TRANSACTION_TYPES: [],
                TRANSACTION_STATUSES: []
            });
        });
    });

    it('OverviewCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('OverviewCtrl should have a default date format', function () {
        expect(scope.defaultDateFormat).to.be.eq('MM / dd / yyyy');
    });

    it('OverviewCtrl should get list of payment methods', function () {
        sinon.assert.calledOnce(paymentMethod.list);
    });

    it('OverviewCtrl should post a payment', function () {
        scope.postPayment({ amount: 12314, method: { id: 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479' }});
        sinon.assert.calledOnce(payment.makePayment);
    });

    it('OverviewCtrl should set default values once account and payment methods have been succesful', function () {
        scope.$apply(function () {
            scope.balance.$deferred.resolve(balanceData);
            scope.paymentMethods.$deferred.resolve(paymentMethods);
        });

        expect(scope.paymentAmount).to.be.eq('2124.00');
        expect(scope.paymentMethod.id).to.be.eq('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

    it('OverviewCtrl should get the account manager for an account', function () {
        scope.$apply(function () {
            scope.supportRoles.$deferred.resolve(supportRolesData);
        });
        expect(scope.accountManager.name).to.be.eq('Joe Racker');
    });

    it('OverviewCtrl should leave account manager undefined when no account manager is found', function () {
        scope.$apply(function () {
            scope.supportRoles.$deferred.resolve([]);
        });
        expect(scope.accountManager).to.be.undefined;
    });

    it('OverviewCtrl should get the billing contact for an account', function () {
        scope.$apply(function () {
            scope.contacts.$deferred.resolve(contactData);
        });
        expect(scope.contactName).to.be.eq('Joe Racker');
        expect(scope.contactAddress).to.not.be.empty;
    });

    it('OverviewCtrl should leave contact information undefined when no billing contact is found', function () {
        scope.$apply(function () {
            scope.contacts.$deferred.resolve([]);
        });
        expect(scope.contactName).to.be.undefined;
        expect(scope.contactAddress).to.be.undefined;
    });
});
