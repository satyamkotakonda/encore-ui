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
    .controller('OptionsCtrl', function ($scope, $routeParams, Account, PaymentMethod,
            DefaultPaymentMethod, rxSortUtil) {

        var getDefaultMethod = function (paymentMethods) {
                $scope.defaultMethod = DefaultPaymentMethod(paymentMethods);
            },
            sortCol = function (predicate) {
                return rxSortUtil.sortCol($scope, predicate);
            };

        $scope.sortCol = sortCol;
        $scope.sort = rxSortUtil.getDefault('isDefault');
        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.paymentMethods = PaymentMethod.list({ id: $routeParams.accountNumber }, getDefaultMethod);
    });