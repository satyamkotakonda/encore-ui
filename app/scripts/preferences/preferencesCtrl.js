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
    .controller('PreferencesCtrl', function ($scope, $routeParams, BillInfo, PaymentInfo,
        AccountNumberUtil, rxPromiseNotifications) {

        var RAN = AccountNumberUtil.getRAN($routeParams.accountNumber),
            defaultParam = { id: RAN };

        $scope.billInfo = BillInfo.get(defaultParam);
        $scope.paymentInfo = PaymentInfo.get(defaultParam);

        rxPromiseNotifications.add($scope.billInfo.$promise, {
            loading: '',
            //success: 'Successful Load',
            error: 'Error Loading Billing Preferences'
        }, 'preferencePage');

        rxPromiseNotifications.add($scope.paymentInfo.$promise, {
            loading: '',
            //success: 'Successful Load',
            error: 'Error Loading Payment Preferences'
        }, 'preferencePage');


        $scope.billInfoLoading = function () {
            return $scope.billInfo.$resolved === false ||
                    ($scope.billInfoUpdate && $scope.billInfoUpdate.$resolved === false);
        };

        $scope.paymentInfoLoading = function () {
            return $scope.paymentInfo.$resolved === false ||
                    ($scope.paymentInfoUpdate && $scope.paymentInfoUpdate.$resolved === false);
        };

        $scope.updatePreferences = function () {
            $scope.billInfoUpdate = BillInfo.update(defaultParam, {
                billInfo: {
                    invoiceDeliveryMethod: $scope.billInfo.invoiceDeliveryMethod
                }
            });
            $scope.paymentInfoUpdate = PaymentInfo.update(defaultParam, {
                paymentInfo: {
                    notificationOption: $scope.paymentInfo.notificationOption
                }
            });
            rxPromiseNotifications.add($scope.billInfoUpdate.$promise, {
                loading: '',
                //success: 'Successful Load',
                error: 'Error Updating Billing Preferences'
            }, 'preferencePage');

            rxPromiseNotifications.add($scope.paymentInfoUpdate.$promise, {
                loading: '',
                //success: 'Successful Load',
                error: 'Error Updating Payment Preferences'
            }, 'preferencePage');
        };
    });
