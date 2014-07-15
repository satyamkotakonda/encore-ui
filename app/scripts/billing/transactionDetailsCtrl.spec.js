describe('Billing: TransactionDetailsCtrl', function () {
    var scope, ctrl, account, transaction;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, Account, Transaction, PageTracking, $q) {
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

            account.get = sinon.stub(account, 'get', getResourceMock({}));
            transaction.getDetails = sinon.stub(transaction, 'getDetails', getResourceMock({}));

            ctrl = $controller('TransactionDetailsCtrl',{
                $scope: scope,
                Transaction: transaction,
                Account: account,
                $routeParams: { accountNumber: testAccountNumber }
            });
        });
    });

    it('TransactionDetailsCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('TransactionDetailsCtrl should have a sort object defined', function () {
        expect(scope.sort).to.be.a('object');
        expect(scope.sort).to.have.property('predicate');
        expect(scope.sort.predicate).to.eq('tranDate');
    });

    it('TransactionDetailsCtrl should have a default date format', function () {
        expect(scope.defaultDateFormat).to.be.eq('MM / dd / yyyy');
    });

    it('TransactionDetailsCtrl should get account info', function () {
        sinon.assert.calledOnce(transaction.getDetails);
    });

    it('TransactionDetailsCtrl should return a sorting predicate when calling sortCol', function () {
        scope.sortCol('date');
        expect(scope.sort.predicate).to.be.eq('date');
    });
});
