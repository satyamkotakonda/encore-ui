describe('Usage: UsageCtrl', function () {
    var scope, ctrl, estimatedCharges, period, periodData, chargeData;

    var testAccountNumber = '12345';

    beforeEach(function () {
        module('billingApp');

        inject(function ($controller, $rootScope, $httpBackend, EstimatedCharges,
                Period, $q) {
            var getResourceMock = function (data) {
                var deferred = $q.defer();
                data.$promise = deferred.promise;
                data.$deferred = deferred;
                return data;
            };
            scope = $rootScope.$new();
            estimatedCharges = EstimatedCharges;
            period = Period;

            periodData = [{
                current: true,
                id: 12345
            }];

            chargeData = [{
                offeringCode: 'DBAAS',
                amount: '1000.00'
            }];

            period.list = function (param, success) {
                success(periodData);
                return getResourceMock(periodData);
            };
            estimatedCharges.list = sinon.stub(estimatedCharges, 'list').returns(getResourceMock(chargeData));

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
        expect(scope.sort.predicate).to.eq('product');
    });

    it('UsageCtrl should have default values', function() {
        expect(scope.sort).to.deep.eq({ predicate: 'product', reverse: true });
        expect(scope.periods).to.be.an('array');
    });

    it('UsageCtrl should get a list of estimated charges', function () {
        scope.$apply(function () {
            scope.periods.$deferred.resolve(periodData);
        });
        sinon.assert.calledOnce(estimatedCharges.list);
    });
});
