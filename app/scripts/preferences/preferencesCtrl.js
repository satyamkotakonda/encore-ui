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

        var isResourceLoading = function (res1, res2) {
                return res1.$resolved === false || (res2 && res2.$resolved === false);
            },
            updatePreferences = function () {
                $scope.billInfoUpdate = BillInfo.updateInvoiceDeliveryMethod(defaultParam,
                                                                            $scope.billInfo.invoiceDeliveryMethod);
                $scope.paymentInfoUpdate = PaymentInfo.updateNotificationOption(defaultParam,
                                                                            $scope.paymentInfo.notificationOption);

                rxPromiseNotifications.add($scope.billInfoUpdate.$promise, {
                    loading: '',
                    error: 'Error Updating Billing Preferences'
                }, 'preferencePage');

                rxPromiseNotifications.add($scope.paymentInfoUpdate.$promise, {
                    loading: '',
                    error: 'Error Updating Payment Preferences'
                }, 'preferencePage');
            };

        $scope.updatePreferences = updatePreferences;
        $scope.isResourceLoading = isResourceLoading;

        $scope.billInfo = BillInfo.get(defaultParam);
        $scope.paymentInfo = PaymentInfo.get(defaultParam);

        rxPromiseNotifications.add($scope.billInfo.$promise, {
            loading: '',
            error: 'Error Loading Billing Preferences'
        }, 'preferencePage');

        rxPromiseNotifications.add($scope.paymentInfo.$promise, {
            loading: '',
            error: 'Error Loading Payment Preferences'
        }, 'preferencePage');

    });
