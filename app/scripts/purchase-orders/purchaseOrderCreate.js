angular.module('billingApp')
    /**
     * @ngdoc directive
     * @name billingApp:rxPurchaseOrderCreate
     * @restrict E
     *
     * @description
     * Sets the trigger for the make payment modal to be popped up.
     * @param {String} userName - User performing the action, for display purposes only
     * @param {String} classes - CSS Classes to be added to the trigger
     * @param {String} currentPurchaseOrder - The current purchase order for display purposes
     *
     * @example
     * <pre>
     *    <rx-purchase-order-create
     *        userName="{{userName}}"
     *        classes="button button-green"
     *        method-id="{{currentPurchaseOrder.poNumber}}"
     *        <strong>+</strong> Create Purchase Order
     *    </rx-purchase-order-create>
     * </pre>
     */
    .directive('rxPurchaseOrderCreate', function () {
        return {
            requires: 'encore.ui.rxModalAction',
            restrict: 'E',
            templateUrl: '/billing/views/purchase-orders/purchaseOrderCreate.html',
            transclude: true,
            scope: {
                userName: '=',
                classes: '@',
                currentPurchaseOrder: '@',
                postHook: '&'
            }
        };
    }).controller('PurchaseOrderCreateCtrl', function ($scope, $routeParams, PurchaseOrder, rxPromiseNotifications,
        AccountNumberUtil) {
        var RAN = AccountNumberUtil.getRAN($routeParams.accountNumber);

        var handleNoAccess = function (response) {
                if (response.status === 401 && response.data.unauthorized.message === 'Unauthorized use of resource.') {
                    return false;
                }
            },
            closeModal = function (data) {
                $scope.$close(data);
            },
            createPurchaseOrder = function () {
                var newPO = PurchaseOrder.createPO(RAN, $scope.fields.purchaseOrderNumber, closeModal, handleNoAccess);
                rxPromiseNotifications.add(newPO.$promise, {
                    loading: 'Creating new Purchase Order',
                    error: 'Error Activating new Purchase Order. {{ data[_.first(_.keys(data))].message }}',
                    success: 'The new Purchase Order has been Activated'
                }, 'purchaseOrderCreate');
            };

        $scope.submit = createPurchaseOrder;
        $scope.cancel = $scope.$dismiss;
    });