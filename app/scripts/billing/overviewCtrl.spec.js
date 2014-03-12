describe('Billing: OverviewCtrl', function () {
    var scope, ctrl, account, transaction, period, payment, paymentMethod, PageTrackingObject,
        accountData, paymentMethods;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $httpBackend, Account, Transaction, Period,
                Payment, PaymentMethod, PageTracking, $filter, $q) {
            var getResourceMock = function (data) {
                var deferred = $q.defer();
                data.$promise = deferred.promise;
                data.$deferred = deferred;
                return data;
            };
            scope = $rootScope.$new();
            transaction = Transaction;
            account = Account;
            period = Period;
            paymentMethod = PaymentMethod;
            payment = Payment;
            accountData = {
                currentDue: '2124.00'
            };
            paymentMethods = [{
                isDefault: 'true',
                id: 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479'
            }];

            period.list = sinon.stub(period, 'list').returns(getResourceMock([]));
            account.get = sinon.stub(account, 'get').returns(getResourceMock(accountData));
            payment.post = sinon.stub(payment, 'post').returns(getResourceMock({}));
            transaction.list = sinon.stub(transaction, 'list').returns(getResourceMock([]));
            paymentMethod.list = sinon.stub(paymentMethod, 'list').returns(getResourceMock(paymentMethods));

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
        scope.postPayment({ amount: 12314, method: { id: 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479' }});
        sinon.assert.calledOnce(payment.post);
    });

    it('OverviewCtrl should set default values once account and payment methods have been succesful', function () {
        scope.$apply(function () {
            scope.account.$deferred.resolve(accountData);
            scope.paymentMethods.$deferred.resolve(paymentMethods);
        });

        expect(scope.paymentAmount).to.be.eq('2124.00');
        expect(scope.paymentMethodId).to.be.eq('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

    it('OverviewCtrl should clear transaction filters', function () {
        scope.clearFilter();
        expect(scope.transactionFilter).to.be.a('object');
        expect(scope.transactionFilter).to.be.empty;
    });

    it('OverviewCtrl should return a sorting predicate when calling sortCol', function () {
        scope.sortCol('date');
        expect(scope.sort.predicate).to.be.eq('date');
    });
});
