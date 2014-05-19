angular.module('billingApp')
    /**
    * @ngdoc object
    * @name encore:controller.PreferencesCtrl
    * @description
    * The Controller which displays an overview of a users' billing info.
    *
    * @requires $scope - The $scope variable for interacting with the UI.
    * @requires $routeParams - AngularJS service which provides access to route paramters
    * @requires encore.rxSortableColumn:rxSortUtil - Service which provides column sort related functions
    * @requires billingSvcs.DATE_FORMAT - Constant that defines the default format for dates
    *
    * @example
    * <pre>
    * .controller('PreferencesCtrl', function ($scope, $routeParams, EstimatedCharges)
    * </pre>
    */
    .controller('PurchaseOrdersCtrl', function ($scope, $routeParams, PurchaseOrder, CurrentPurchaseOrderFilter,
        rxSortUtil, AccountNumberUtil, PageTracking, DATE_FORMAT) {

        var RAN = AccountNumberUtil.getRAN($routeParams.accountNumber),
            defaultParam = { id: RAN };

        var getCurrentPurchaseOrder = function (orders) {
                $scope.currentPurchaseOrder = CurrentPurchaseOrderFilter(orders);
            },
            sortCol = function (predicate) {
                return rxSortUtil.sortCol($scope, predicate);
            };

        // Create an instance of the PageTracking component
        $scope.pager = PageTracking.createInstance();

        // Default Date Format
        $scope.defaultDateFormat = DATE_FORMAT;
        $scope.sortCol = sortCol;

        // Set the default sort of the usage
        $scope.sort = rxSortUtil.getDefault('startDate', true);
        $scope.purchaseOrders = PurchaseOrder.list(defaultParam, getCurrentPurchaseOrder);
    });
