describe('rxGenericUtil', function () {
    var scope;
    var acctNumberUtil, loadingValue;
    var transform, emptyTransform;

    var getResourceResultMock, getResourceMock, testRes;
    var paymentMethods, testData, testError, accountNumber, testOutput, loadingMsg, notFoundMsg;

    beforeEach(function () {
        module('rxGenericUtil');

        inject(function ($rootScope, $q,
            AccountNumberUtil, Transform, LoadingValueFilter) {

            getResourceResultMock = function (data) {
                var deferred = $q.defer();
                data.$promise = deferred.promise;
                data.$deferred = deferred;
                data.$resolved = false;
                return data;
            };
            getResourceMock = function (returnData) {
                returnData = getResourceResultMock(returnData);
                return function (callData, success, error) {
                    returnData.$promise
                        .then(success, error)
                        .finally(function () {
                            returnData.$resolved = true;
                        });
                    return returnData;
                };
            };

            scope = $rootScope.$new();
            accountNumber = '12345';
            loadingMsg = '...Loading Data...';
            notFoundMsg = 'No Value';
            testOutput = 'FINAL OUTPUT';

            transform = Transform('test.path', 'test.error');
            emptyTransform = Transform();
            testData = '{"test":{"path":true}}';
            testError = '{"test":{"path":true,"error":"Error"}}';
            paymentMethods = [{ isDefault: true, id: 'payment-id-1' },
                              { id: 'payment-id-2' },
                              { id: 'payment-id-3' },
                              { id: 'payment-id-4' }];

            acctNumberUtil = AccountNumberUtil;
            loadingValue = function () {
                return LoadingValueFilter(testRes.data, testRes.$resolved, notFoundMsg, loadingMsg);
            };
        });
    });

    it('rxGenericUtil Transform should return a function to transform data', function () {
        expect(transform).to.be.a('function');
    });

    it('rxGenericUtil Transform should correctly return the values from the parsed object', function () {
        expect(transform(testData)).to.be.eq(true);
        expect(transform(testError)).to.be.eq('Error');
    });

    it('rxGenericUtil Transform should return the parsed object if no path is given', function () {
        expect(JSON.stringify(emptyTransform(testData))).to.eq(testData);
    });

    it('rxGenericUtil AccountNumberUtil should return proper values for an account number', function () {
        expect(acctNumberUtil.getRCN(accountNumber)).to.be.eq('12345');
        expect(acctNumberUtil.getRAN(accountNumber)).to.be.eq('020-12345');
        expect(acctNumberUtil.getAccountType(accountNumber)).to.be.eq('CLOUD');
    });

    it('rxGenericUtil AccountNumberUtil should return undefined for falsy values', function () {
        expect(acctNumberUtil.getRCN(false)).to.be.undefined;
        expect(acctNumberUtil.getRAN(false)).to.be.undefined;
        expect(acctNumberUtil.getAccountType(false)).to.be.undefined;
    });

    it('rxGenericUtil LoadingValue should display a loading message until the resolved flag is true', function () {
        testRes = getResourceMock({ data: testOutput })();
        expect(loadingValue()).to.be.eq(loadingMsg);
        scope.$apply(function () {
            testRes.$deferred.resolve();
        });
        expect(loadingValue()).to.be.eq(testOutput);
    });

    it('rxGenericUtil LoadingValue should display a falsy message when the resolved flag is false', function () {
        testRes = getResourceMock({ data: null })();
        expect(loadingValue()).to.be.eq(loadingMsg);
        scope.$apply(function () {
            testRes.$deferred.resolve(false);
        });
        expect(loadingValue()).to.be.eq(notFoundMsg);
    });
});
