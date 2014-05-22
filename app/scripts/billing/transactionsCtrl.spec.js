describe('Billing: TransactionsCtrl', function () {
    var scope, ctrl, account, balance, transaction, period, paymentMethod, PageTrackingObject,
        balanceData, paymentMethods, paymentInfo, billInfo, payment;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $httpBackend, Account, Balance, Transaction, Period,
                Payment, PaymentMethod, BillInfo, PaymentInfo, PageTracking, DefaultPaymentMethodFilter, $q) {
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
            scope = $rootScope.$new();
            transaction = Transaction;
            account = Account;
            balance = Balance;
            period = Period;
            paymentMethod = PaymentMethod;
            paymentInfo = PaymentInfo;
            billInfo = BillInfo;
            balanceData = {
                amountDue: '2124.00'
            };
            paymentMethods = [{
                isDefault: true,
                id: 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479'
            }];

            payment = Payment;
            payment.makePayment = sinon.stub(payment, 'makePayment', getResourceMock({}));

            billInfo.get =  sinon.stub(billInfo, 'get', getResourceMock({}));
            paymentInfo.get =  sinon.stub(paymentInfo, 'get', getResourceMock({}));
            period.list = sinon.stub(period, 'list', getResourceMock([]));
            account.get = sinon.stub(account, 'get', getResourceMock({}));
            balance.get = sinon.stub(balance, 'get', getResourceMock(balanceData));
            transaction.list = sinon.stub(transaction, 'list', getResourceMock([]));
            paymentMethod.list = sinon.stub(paymentMethod, 'list', getResourceMock(paymentMethods));

            PageTrackingObject = PageTracking.createInstance().constructor;

            ctrl = $controller('TransactionsCtrl',{
                $scope: scope,
                Transaction: transaction,
                Account: account,
                Balance: balance,
                Period: period,
                Payment: payment,
                PaymentMethod: paymentMethod,
                $routeParams: { accountNumber: testAccountNumber },
                PageTracking: PageTracking,
                DefaultPaymentMethodFilter: DefaultPaymentMethodFilter,
                TRANSACTION_TYPES: [],
                TRANSACTION_STATUSES: []
            });
        });
    });

    it('TransactionsCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('TransactionsCtrl should have a sort object defined', function () {
        expect(scope.sort).to.be.a('object');
        expect(scope.sort).to.have.property('predicate');
        expect(scope.sort.predicate).to.eq('date');
    });

    it('TransactionsCtrl should have a default date format', function () {
        expect(scope.defaultDateFormat).to.be.eq('MM / dd / yyyy');
    });

    it('TransactionsCtrl should have a pager defined by PageTracking', function () {
        expect(scope.pager).to.be.an.instanceof(PageTrackingObject);
    });

    it('TransactionsCtrl should have default values', function () {
        expect(scope.filterData.types).to.be.an('array');
        expect(scope.filterData.statuses).to.be.an('array');
        expect(scope.sort).to.deep.eq({ predicate: 'date', reverse: true });
    });

    it('TransactionsCtrl should get list of transactions', function () {
        sinon.assert.calledOnce(transaction.list);
    });

    it('TransactionsCtrl should get list of payment methods', function () {
        sinon.assert.calledOnce(paymentMethod.list);
    });

    it('TransactionsCtrl should get list of billing periods', function () {
        sinon.assert.calledOnce(period.list);
    });

    it('TransactionsCtrl should get account info', function () {
        sinon.assert.calledOnce(account.get);
    });

    it('TransactionsCtrl should post a payment', function () {
        scope.postPayment({ amount: 12314, method: { id: 'urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479' }});
        sinon.assert.calledOnce(payment.makePayment);
    });

    it('TransactionsCtrl should set default values once account and payment methods have been succesful', function () {
        scope.$apply(function () {
            scope.balance.$deferred.resolve(balanceData);
            scope.paymentMethods.$deferred.resolve(paymentMethods);
        });

        expect(scope.paymentAmount).to.be.eq('2124.00');
        expect(scope.paymentMethod.id).to.be.eq('urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

    it('TransactionsCtrl should clear transaction filters', function () {
        scope.clearFilter();
        expect(scope.transactionFilter).to.be.a('object');
        expect(scope.transactionFilter).to.be.empty;
    });

    it('TransactionsCtrl should return a sorting predicate when calling sortCol', function () {
        scope.sortCol('date');
        expect(scope.sort.predicate).to.be.eq('date');
    });
});
