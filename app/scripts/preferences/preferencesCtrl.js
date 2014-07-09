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
        AccountNumberUtil, rxPromiseNotifications, rxNotify) {

        var updateBillInfo = function () {
            $scope.billInfo = BillInfo.get({ accountNumber: $routeParams.accountNumber });
        };

        var updatePaymentInfo = function () {
            $scope.paymentInfo = PaymentInfo.get({ accountNumber: $routeParams.accountNumber });
        };

        var isResourceLoading = function (res1, res2) {
                return res1.$resolved === false || (res2 !== undefined && res2.$resolved === false);
            },
            updatePreferences = function () {
                rxNotify.clear('preferencePage');

                if ($scope.billInfo.dirty === true) {
                    $scope.billInfoUpdate = BillInfo.updateInvoiceDeliveryMethod(
                        $routeParams.accountNumber,
                        $scope.billInfo.invoiceDeliveryMethod,
                        updateBillInfo, updateBillInfo);

                    rxPromiseNotifications.add($scope.billInfoUpdate.$promise, {
                        loading: '',
                        error: 'Error Updating Billing Preferences'
                    }, 'preferencePage');
                }

                if ($scope.paymentInfo.dirty === true) {
                    $scope.paymentInfoUpdate = PaymentInfo.updateNotificationOption(
                        $routeParams.accountNumber,
                        $scope.paymentInfo.notificationOption,
                        updatePaymentInfo, updatePaymentInfo);

                    rxPromiseNotifications.add($scope.paymentInfoUpdate.$promise, {
                        loading: '',
                        error: 'Error Updating Payment Preferences'
                    }, 'preferencePage');
                }
            };

        $scope.updatePreferences = updatePreferences;
        $scope.isResourceLoading = isResourceLoading;

        updateBillInfo();
        updatePaymentInfo();

        $scope.setDirty = function (newValue, value, preferenceObj) {
            if (!preferenceObj.hasOwnProperty('dirty')) {
                preferenceObj.dirty = true;
            } else {
                preferenceObj.dirty = !preferenceObj.dirty;
            }
        };

        rxPromiseNotifications.add($scope.billInfo.$promise, {
            loading: '',
            error: 'Error Loading Billing Preferences'
        }, 'preferencePage');

        rxPromiseNotifications.add($scope.paymentInfo.$promise, {
            loading: '',
            error: 'Error Loading Payment Preferences'
        }, 'preferencePage');

    });
