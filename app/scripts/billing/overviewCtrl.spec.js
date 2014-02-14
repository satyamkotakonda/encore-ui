describe('Billing: OverviewCtrl', function () {
    var scope, ctrl, account, transaction;

    beforeEach( function () {
        module('billingApp');
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            transaction = { list: sinon.stub() };
            account = { get: sinon.stub() };

            ctrl = $controller('OverviewCtrl',{
                $scope: scope,
                Transaction: transaction,
                Account: account
            });
        });
    });

    it('OverviewCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('OverviewCtrl should have default values', function () {
        expect(scope.transactionStatus.length).to.be.eq(4);
        expect(scope.transactionTypes.length).to.be.eq(5);
        expect(scope.transactionDate.length).to.be.eq(4);
        expect(scope.sort).to.deep.eq({field: 'date', reverse:true});
    });

    it('OverviewCtrl should get list of transactions', function () {
        sinon.assert.calledOnce(transaction.list);
    });

    it('OverviewCtrl should get account info', function () {
        sinon.assert.calledOnce(account.get);
    });
});
