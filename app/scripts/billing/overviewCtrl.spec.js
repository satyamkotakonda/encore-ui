describe('Billing: OverviewCtrl', function () {
    var scope, ctrl, account, transaction, period, PageTrackingObject;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, Account, Transaction, Period, PageTracking, $filter) {
            scope = $rootScope.$new();
            transaction = Transaction;
            account = Account;
            period = Period;
            transaction.list = sinon.stub();
            period.list = sinon.stub();
            account.get = sinon.stub();

            PageTrackingObject = PageTracking.createInstance().constructor;
            
            ctrl = $controller('OverviewCtrl',{
                $scope: scope,
                $filter: $filter,
                Transaction: transaction,
                Account: account,
                Period: period,
                $routeParams: { accountNumber: testAccountNumber },
                PageTracking: PageTracking,
                TRANSACTION_TYPES: [],
                TRANSACTION_STATUSES: []
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

    it('OverviewCtrl should have a default date format', function () {
        expect(scope.defaultDateFormat).to.be.eq('MM / dd / yyyy');
    });

    it('OverviewCtrl should have a pager defined by PageTracking', function () {
        expect(scope.pager).to.be.an.instanceof(PageTrackingObject);
    });

    it('OverviewCtrl should have default values', function () {
        expect(scope.filterData.types).to.be.an('array');
        expect(scope.filterData.statuses).to.be.an('array');
        expect(scope.sort).to.deep.eq({ field: 'date', reverse: true });
    });

    it('OverviewCtrl should get list of transactions', function () {
        sinon.assert.calledOnce(transaction.list);
    });

    it('OverviewCtrl should get list of billing periods', function () {
        sinon.assert.calledOnce(period.list);
    });

    it('OverviewCtrl should get account info', function () {
        sinon.assert.calledOnce(account.get);
    });
});
