angular.module('billingApp')
    /**
     * @ngdoc directive
     * @name billingApp:rxPurchaseOrderDisable
     * @restrict E
     *
     * @description
     * Sets the trigger for the make payment modal to be popped up.
     * @param {model} userName - User performing the action, for display purposes only
     * @param {String} classes - CSS Classes to be added to the trigger
     * @param {String} currentPurchaseOrder - The current purchase order for display purposes
     * @param {String} notificationStack - Stack to notify after modal has been closed
     * @param {expression} postHook - PostHook function to call upon succesful closing of the modal
     *
     * @example
     * <pre>
     *    <rx-purchase-order-disable
     *        userName="{{userName}}"
     *        classes="button button-green"
     *        current-purchase-order="{{currentPurchaseOrder.poNumber}}"
     *        post-hook="refreshPurchaseOrders()"
     *        <strong>+</strong> Disable Purchase Order
     *    </rx-purchase-order-disable>
     * </pre>
     */
    .directive('rxPurchaseOrderDisable', function () {
        return {
            requires: 'encore.ui.rxModalAction',
            restrict: 'E',
            templateUrl: 'views/purchase-orders/purchaseOrderDisable.html',
            transclude: true,
            scope: {
                userName: '=',
                classes: '@',
                currentPurchaseOrder: '@',
                notificationStack: '@',
                postHook: '&'
            }
        };
    }).controller('PurchaseOrderDisableCtrl', function ($scope, $routeParams, PurchaseOrder,
        rxNotify, BillingErrorResponse, AccountNumberUtil, STATUS_MESSAGES) {
        var RAN = AccountNumberUtil.getRAN($routeParams.accountNumber),
            notifyInstances = {},
            defaultStackName = 'purchaseOrderDisable';

        // Clears the notifications stacks that are being used by this controller
        var clearNotifications = function () {
                if (!_.isEmpty(rxNotify.stacks[defaultStackName])) {
                    rxNotify.clear(defaultStackName);
                }

                // Only attempt to clear the notificationStack if it has been passed in
                if ($scope.notificationStack && !_.isEmpty(rxNotify.stacks[$scope.notificationStack])) {
                    rxNotify.clear($scope.notificationStack);
                }
            },
            // Show a notification error within the modal
            disableError = function (response) {
                var msg = STATUS_MESSAGES.purchaseOrders.disableError,
                    error = BillingErrorResponse(response);

                // #NOTE: This may change once Billing API has Repose in front of it
                if (error.msg !== '') {
                    msg += ' "' + error.msg + '".';
                }
                rxNotify.add(msg, {
                    stack: defaultStackName,
                    type: 'error'
                });
            },
            disableSuccess = function (data) {
                var stack = $scope.notificationStack || defaultStackName;
                rxNotify.add(STATUS_MESSAGES.purchaseOrders.disableSuccess, {
                    stack: stack,
                    type: 'success'
                });
                $scope.$close(data);
            },
            disablePurchaseOrder = function () {
                // We clear the notification stacks used by us so that we don't let them stack up
                clearNotifications();

                // Capture the instance of the loading notification in order to dismiss it once done processing
                notifyInstances.loading = rxNotify.add(STATUS_MESSAGES.purchaseOrders.disable, {
                    stack: defaultStackName,
                    loading: true
                });

                $scope.newPO = PurchaseOrder.disablePO(RAN,
                                                   $scope.currentPurchaseOrder,
                                                   disableSuccess,
                                                   disableError);

                $scope.newPO.$promise.finally(function () {
                    rxNotify.dismiss(notifyInstances.loading);
                });
                // Call the postHook (if) defined on succesful result of disablePO
                if ($scope.postHook) {
                    $scope.newPO.$promise.then($scope.postHook);
                }
            };

        clearNotifications();

        $scope.submit = disablePurchaseOrder;
        $scope.cancel = $scope.$dismiss;
    });