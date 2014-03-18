angular.module('billingApp')
    /**
    * @ngdoc object
    * @name encore:controller.OptionsCtrl
    * @description
    * The Controller which displays an overview of a users' billing info.
    *
    * @example
    * <pre>
    * .controller('OverviewCtrl', function ($scope, $routeParams, Transaction,
    *       Account, Period, PageTracking)
    * </pre>
    */
    .controller('OptionsCtrl', function ($scope, $routeParams, $q, Account, PaymentMethod,
            DefaultPaymentMethod, rxSortUtil, rxPromiseNotifications, STATUS_MESSAGES) {

        var getDefaultMethod = function (paymentMethods) {
                $scope.defaultMethod = DefaultPaymentMethod(paymentMethods);
            },
            sortCol = function (sort) {
                return function (predicate) {
                    var reverse = ($scope[sort].predicate === predicate) ? !$scope[sort].reverse : false;
                    $scope[sort] = { reverse: reverse, predicate: predicate };
                };
            };

        $scope.cardSortCol = sortCol('cardSort');
        $scope.cardSort = rxSortUtil.getDefault('isDefault', true);

        $scope.achSortCol = sortCol('achSort');
        $scope.achSort = rxSortUtil.getDefault('isDefault', true);

        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.paymentMethods = PaymentMethod.list({ id: $routeParams.accountNumber }, getDefaultMethod);
        rxPromiseNotifications.add($q.all([
            $scope.account.$promise,
            $scope.paymentMethods.$promise
        ]), {
            loading: '',
            error: STATUS_MESSAGES.overview.error
        }, 'optionsPage');
    });