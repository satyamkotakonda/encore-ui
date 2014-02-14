describe('Billing: OverviewCtrl', function () {
    var scope, ctrl, account, transaction, PageTrackingObject;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');
        inject(function ($controller, $rootScope, PageTracking) {
            scope = $rootScope.$new();
            PageTrackingObject = PageTracking.createInstance().constructor;
            
            transaction = { list: sinon.stub() };
            account = { get: sinon.stub() };

            ctrl = $controller('OverviewCtrl',{
                $scope: scope,
                Transaction: transaction,
                Account: account,
                $routeParams: {
                    accountNumber: testAccountNumber
                }
            });
        });
    });

    it('OverviewCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('OverviewCtrl should have a sort object defined', function () {
        expect(scope.sort).to.be.a('object');
        expect(scope.sort).to.have.property('field');
        expect(scope.sort.field).to.eq('date');
    });

    it('OverviewCtrl should have a pager defined by PageTracking', function () {
        expect(scope.pager).to.be.an.instanceof(PageTrackingObject);
    });

    it('OverviewCtrl should have default values', function () {
        expect(scope.transactionData.types).to.be.an('array');
        expect(scope.transactionData.types.length).to.be.eq(5);

        expect(scope.transactionData.status).to.be.an('array');
        expect(scope.transactionData.status.length).to.be.eq(4);
        expect(scope.sort).to.deep.eq({ field: 'date', reverse: true });
    });

    it('OverviewCtrl should get list of transactions', function () {
        sinon.assert.calledOnce(transaction.list);
    });

    it('OverviewCtrl should get account info', function () {
        sinon.assert.calledOnce(account.get);
    });
});
