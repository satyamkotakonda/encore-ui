describe('Usage: UsageCtrl', function () {
    var scope, ctrl, estimatedCharges, period, periodData, chargeData, account;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $httpBackend, EstimatedCharges,
                         Period, Account, $q) {
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
            estimatedCharges = EstimatedCharges;
            period = Period;
            account = Account;

            periodData = [{
                current: true,
                id: 12345
            }];

            chargeData = [{
                offeringCode: 'DBAAS',
                amount: '1000.00'
            }];

            period.list = sinon.stub(period, 'list', getResourceMock(periodData));
            estimatedCharges.list = sinon.stub(estimatedCharges, 'list', getResourceMock(chargeData));
            account.get = sinon.stub(account, 'get', getResourceMock({}));
            
            ctrl = $controller('UsageCtrl',{
                $scope: scope,
                $routeParams: { accountNumber: testAccountNumber },
                EstimatedCharges: estimatedCharges,
                Period: period
            });
        });
    });

    it('UsageCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('UsageCtrl should have a sort object defined', function () {
        expect(scope.sort).to.be.a('object');
        expect(scope.sort).to.have.property('predicate');
        expect(scope.sort.predicate).to.eq('name | ProductName');
    });

    it('UsageCtrl should have default values', function () {
        expect(scope.sort).to.deep.eq({ predicate: 'name | ProductName', reverse: false });
        expect(scope.periods).to.be.an('array');
    });

    it('UsageCtrl should get a list of estimated charges', function () {
        scope.periods.$deferred.resolve(periodData);
        scope.$apply();
        sinon.assert.calledOnce(estimatedCharges.list);
    });

    it('OverviewCtrl should return a sorting predicate when calling sortCol', function () {
        scope.sortCol('amount');
        expect(scope.sort.predicate).to.be.eq('amount');
    });

    it('UsageCtrl should get the current billing period', function () {
        scope.periods.$deferred.resolve(periodData);
        scope.$apply();
        expect(scope.currentPeriod).to.not.be.empty;
    });

    it('UsageCtrl should get leave current period undefined if no current period found', function () {
        scope.periods.$deferred.resolve([]);
        scope.$apply();
        expect(scope.currentPeriod).to.be.undefined;
    });

});
