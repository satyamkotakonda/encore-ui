angular.module('billingApp')
    /**
    * @ngdoc object
    * @name encore:controller.UsageCtrl
    * @description
    * The Controller which displays an overview of a users' billing info.
    *
    * @requires $scope - The $scope variable for interacting with the UI.
    * @requires $routeParams - AngularJS service which provides access to route paramters
    * @requires billingSvcs.EstimatedCharges - Service for CRUD operations for the Estimated Charges resource.
    * @requires billingSvcs.STATUS_MESSAGES - Constant object defining messaging to be used throughout the app
    *
    * @example
    * <pre>
    * .controller('UsageCtrl', function ($scope, $routeParams, EstimatedCharges)
    * </pre>
    */
    .controller('UsageCtrl', function ($scope, $routeParams, $q, EstimatedCharges,
            Period, rxSortUtil, rxPromiseNotifications,
            STATUS_MESSAGES) {

        // Set the default sort of the usage
        $scope.sort = rxSortUtil.getDefault('product', true);

        // Get Charges Info
        var getCharges = function (periods) {
            $scope.currentPeriod = _.find(periods, { 'current': true });
            $scope.charges = EstimatedCharges.list({
                id: $routeParams.accountNumber,
                periodId: $scope.currentPeriod.id
            });
        };

        $scope.periods = Period.list({ id: $routeParams.accountNumber }, getCharges);

        // Group the promises in $q.all for a global error message if any errors occur
        rxPromiseNotifications.add($q.all([
            $scope.periods.$promise
        ]), {
            loading: '',
            error: STATUS_MESSAGES.overview.error
        }, 'usagePage');
    });
