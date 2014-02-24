describe('Billing: OverviewCtrl', function () {
    var scope, ctrl, account, transaction, period, payment, paymentMethod, PageTrackingObject;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, Account, Transaction, Period,
                Payment, PaymentMethod, PageTracking, $filter) {
            scope = $rootScope.$new();
            transaction = Transaction;
            account = Account;
            period = Period;
            paymentMethod = PaymentMethod;
            payment = Payment;
            transaction.list = sinon.stub();
            period.list = sinon.stub();
            account.get = sinon.stub();
            paymentMethod.list = sinon.stub().returns([{}]);
            payment.post = sinon.stub();

            PageTrackingObject = PageTracking.createInstance().constructor;
            
            ctrl = $controller('OverviewCtrl',{
                $scope: scope,
                $filter: $filter,
                Transaction: transaction,
                Account: account,
                Period: period,
                Payment: payment,
                PaymentMethod: paymentMethod,
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
        expect(scope.sort).to.have.property('predicate');
        expect(scope.sort.predicate).to.eq('date');
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
        expect(scope.sort).to.deep.eq({ predicate: 'date', reverse: true });
    });

    it('OverviewCtrl should get list of transactions', function () {
        sinon.assert.calledOnce(transaction.list);
    });

    it('OverviewCtrl should get list of payment methods', function () {
        sinon.assert.calledOnce(paymentMethod.list);
    });

    it('OverviewCtrl should get list of billing periods', function () {
        sinon.assert.calledOnce(period.list);
    });

    it('OverviewCtrl should get account info', function () {
        sinon.assert.calledOnce(account.get);
    });

    it('OverviewCtrl should post a payment', function () {
        scope.postPayment({ amount: 12314, method: 0 });
        sinon.assert.calledOnce(payment.post);
    });
});
