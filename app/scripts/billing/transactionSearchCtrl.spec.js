describe('Billing: TransactionSearchCtrl', function () {
    var scope, location, ctrl, transaction, billingAccountAuthId, authID, httpBackend;

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $location, $httpBackend, $rootScope, $routeParams, Transaction) {
            scope = $rootScope.$new();
            authID = '539A88CBB6D6A754A6100F880FE88994C97A54BF';
            location = sinon.stub($location, 'path');
            httpBackend = $httpBackend;
            transaction = Transaction;
            billingAccountAuthId = {
                'billingAccounts': {
                    'billingAccount': [
                        {
                            'accountNumber': '020-123456',
                            'name': 'amazon'
                        }
                    ]
                }
            };

            ctrl = $controller('TransactionSearchCtrl',{
                $scope: scope,
                $routeParams: { term: authID }
            });
        });
    });

    afterEach(function () {
        location.restore();
    });

    it('TransactionSearchCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('TransactionSearchCtrl should route to correct account via authID', function () {
        httpBackend.whenGET('/api/billing?gatewayTxRefNum=' + authID).respond(billingAccountAuthId);
        httpBackend.flush();
        expect(location.calledWith('/overview/123456')).to.be.true;
    });
});

describe('Billing: TransactionSearchCtrl', function () {
    var scope, location, ctrl, transaction, billingAccountRefNum, tranRefNum, httpBackend;

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $location, $httpBackend, $rootScope, $routeParams, Transaction) {
            scope = $rootScope.$new();
            location = sinon.stub($location, 'path');
            httpBackend = $httpBackend;
            tranRefNum = 'P1-40';
            transaction = Transaction;
            billingAccountRefNum = {
                'billingAccounts': {
                    'billingAccount': [
                        {
                            'accountNumber': '020-654321',
                            'name': 'amazon'
                        }
                    ]
                }
            };

            ctrl = $controller('TransactionSearchCtrl',{
                $scope: scope,
                $routeParams: { term: tranRefNum }
            });
        });
    });

    afterEach(function () {
        location.restore();
    });

    it('TransactionSearchCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('TransactionSearchCtrl should route to correct account via tranRefNum', function () {
        httpBackend.whenGET('/api/billing?tranRefNum=' + tranRefNum + '&tranType=PAYMENT')
            .respond(billingAccountRefNum);
        httpBackend.flush();
        expect(location.calledWith('/overview/654321')).to.be.true;
    });
});
