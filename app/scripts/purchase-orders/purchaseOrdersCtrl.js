angular.module('billingApp')
    /**
    * @ngdoc object
    * @name encore:controller.PreferencesCtrl
    * @description
    * The Controller which displays an overview of a users' billing info.
    *
    * @requires $scope - The $scope variable for interacting with the UI.
    * @requires $routeParams - AngularJS service which provides access to route paramters
    * @requires billingSvcs.PurchaseOrder - Service for CRUD operations for the PurchaseOrder resource.
    * @requires billingApp.CurrentPurchaseOrderFilter - Filter which facilitates retrieval of current purchase order.
    * @requires encore.rxSortableColumn:rxSortUtil - Service which provides column sort related functions
    * @requires constants.DATE_FORMAT - Constant that defines the default format for dates
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

        var sortCol = function (predicate) {
                return rxSortUtil.sortCol($scope, predicate);
            },
            getCurrentPurchaseOrder = function (orders) {
                $scope.currentPurchaseOrder = CurrentPurchaseOrderFilter(orders);
            },
            refreshPurchaseOrders = function () {
                $scope.purchaseOrders = PurchaseOrder.list(defaultParam, getCurrentPurchaseOrder);
            };

        // Default Date Format
        $scope.defaultDateFormat = DATE_FORMAT;

        // pass column sorter
        $scope.sortCol = sortCol;

        // Create an instance of the PageTracking component
        $scope.pager = PageTracking.createInstance();

        // Pass refresh list function
        $scope.refreshPurchaseOrders = refreshPurchaseOrders;

        // Set the default sort of the usage
        $scope.sort = rxSortUtil.getDefault('startDate', true);

        refreshPurchaseOrders();
    });
