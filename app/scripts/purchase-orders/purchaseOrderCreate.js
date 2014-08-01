angular.module('billingApp')
    /**
     * @ngdoc directive
     * @name billingApp:rxPurchaseOrderCreate
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
     *    <rx-purchase-order-create
     *        userName="{{userName}}"
     *        classes="button button-green"
     *        current-purchase-order="{{currentPurchaseOrder.poNumber}}"
     *        post-hook="refreshPurchaseOrders()"
     *        <strong>+</strong> Create Purchase Order
     *    </rx-purchase-order-create>
     * </pre>
     */
    .directive('rxPurchaseOrderCreate', function () {
        return {
            requires: 'encore.ui.rxModalAction',
            restrict: 'E',
            templateUrl: 'views/purchase-orders/purchaseOrderCreate.html',
            transclude: true,
            scope: {
                userName: '=',
                classes: '@',
                currentPurchaseOrder: '@',
                notificationStack: '@',
                postHook: '&'
            }
        };
    }).controller('PurchaseOrderCreateCtrl', function ($scope, $routeParams, PurchaseOrder, rxModalUtil,
        rxNotify, BillingErrorResponse, Account, AccountNumberUtil, STATUS_MESSAGES) {

        var accountNumber = $routeParams.accountNumber;
        var defaultParams = { accountNumber: accountNumber };
        var defaultStackName = 'purchaseOrderCreate';
        var modal = rxModalUtil.getModal($scope, defaultStackName,
            STATUS_MESSAGES.purchaseOrderCreate, BillingErrorResponse);

        var purchaseOrderCreate = function () {
            $scope.newPO = PurchaseOrder.createPO(accountNumber, $scope.fields.purchaseOrderNumber);
            $scope.newPO.$promise.then(modal.successClose('page'), modal.fail());
            modal.processing($scope.newPO.$promise);
        };

        modal.clear();
        $scope.submit = purchaseOrderCreate;
        $scope.cancel = $scope.$dismiss;
        $scope.account = Account.get(defaultParams);
    });
