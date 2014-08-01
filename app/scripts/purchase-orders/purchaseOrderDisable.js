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
                currentPurchaseOrderId: '@',
                notificationStack: '@',
                postHook: '&'
            }
        };
    }).controller('PurchaseOrderDisableCtrl', function ($scope, $routeParams, PurchaseOrder, rxModalUtil,
        rxNotify, Account, BillingErrorResponse, AccountNumberUtil, STATUS_MESSAGES) {

        var accountNumber = $routeParams.accountNumber;
        var defaultParams = { accountNumber: accountNumber };
        var defaultStackName = 'purchaseOrderDisable';
        var modal = rxModalUtil.getModal($scope, defaultStackName,
            STATUS_MESSAGES.purchaseOrderDisable, BillingErrorResponse);

        var purchaseOrderCreate = function () {
            $scope.newPO = PurchaseOrder.disablePO(accountNumber, $scope.currentPurchaseOrderId);
            $scope.newPO.$promise.then(modal.successClose('page'), modal.fail());
            modal.processing($scope.newPO.$promise);
        };

        modal.clear();
        $scope.submit = purchaseOrderCreate;
        $scope.cancel = $scope.$dismiss;
        $scope.account = Account.get(defaultParams);
    });
