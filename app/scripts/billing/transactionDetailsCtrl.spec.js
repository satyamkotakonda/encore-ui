describe('Billing: TransactionDetailsCtrl', function () {
    var scope, ctrl, account, transaction, saveAs, httpBackend, transactionMock, notify;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $httpBackend, Account, Transaction, PageTracking, $q) {
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
            httpBackend = $httpBackend;
            notify = { add: sinon.stub() };

            account.get = sinon.stub(account, 'get', getResourceMock({}));
            transactionMock = {
                invoice: {
                    tranRefNum: 'B1-44'
                }
            };
            transaction.getDetails = sinon.stub(transaction, 'getDetails', getResourceMock(transactionMock));

            saveAs = sinon.stub(window, 'saveAs');

            ctrl = $controller('TransactionDetailsCtrl',{
                $scope: scope,
                Transaction: transaction,
                Account: account,
                rxNotify: notify,
                $routeParams: {
                    accountNumber: testAccountNumber,
                    transactionType: 'invoice',
                    transactionNumber: 'B1-44'
                }
            });
        });
    });

    afterEach(function () {
        window.saveAs.restore();
    });

    it('should exist', function () {
        expect(ctrl).to.exist;
    });

    it('should have a sort object defined', function () {
        expect(scope.sort).to.be.a('object');
        expect(scope.sort).to.have.property('predicate');
        expect(scope.sort.predicate).to.eq('tranDate');
    });

    it('should have a default date format', function () {
        expect(scope.defaultDateFormat).to.be.eq('MM / dd / yyyy');
    });

    it('should get account info', function () {
        sinon.assert.calledOnce(transaction.getDetails);
    });

    it('should return a sorting predicate when calling sortCol', function () {
        scope.sortCol('date');
        expect(scope.sort.predicate).to.be.eq('date');
    });

    it('should download a PDF when downloadPdf is called', function () {
        scope.downloadPdf();
        httpBackend.expectGET('/api/billing/020-12345/balance').respond(200, {});
        httpBackend.expectGET('/api/billing/020-12345/invoice/B1-44').respond(200, '');
        httpBackend.flush();
        sinon.assert.calledOnce(saveAs);
    });

    it('should display an error if there is no PDF to download', function () {
        scope.downloadPdf();
        httpBackend.expectGET('/api/billing/020-12345/balance').respond(200, {});
        httpBackend.expectGET('/api/billing/020-12345/invoice/B1-44').respond(404, '');
        httpBackend.flush();
        expect(notify.add.args[0][0]).to.equal('Invoice PDF Not Found');
    });

    it('should download a CSV when downloadCsv is called', function () {
        scope.downloadCsv();
        httpBackend.expectGET('/api/billing/020-12345/balance').respond(200, {});
        httpBackend.expectGET('/api/billing/020-12345/invoice/B1-44/detail').respond(200, '');
        httpBackend.flush();
        sinon.assert.calledOnce(saveAs);
    });

    it('should display an error if there is no CSV to download', function () {
        scope.downloadCsv();
        httpBackend.expectGET('/api/billing/020-12345/balance').respond(200, {});
        httpBackend.expectGET('/api/billing/020-12345/invoice/B1-44/detail').respond(404, '');
        httpBackend.flush();
        expect(notify.add.args[0][0]).to.equal('Invoice CSV Not Found');
    });
});
