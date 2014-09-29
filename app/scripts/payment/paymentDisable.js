angular.module('billingApp')
    /**
     * @ngdoc directive
     * @name billingApp:rxPaymentSetDefault
     * @restrict E
     *
     * @description
     * Sets the trigger for the make payment modal to be popped up.
     *
     * @scope
     * @param {String} userName - User performing the action, for display purposes only
     * @param {Object} method - Method model for displaying Payment Method information and use in postHook
     * @param {String} postHook - Function to be called when submitting form
     *
     * @example
     * <pre>
     *      <rx-payment-disable
     *          post-hook="disablePayment"
     *          userName="{{userName}}"
     *          method="method">
     *          Disable
     *      </rx-payment-disable>
     * </pre>
     */
    .directive('rxPaymentDisable', function () {
        return {
            restrict: 'E',
            templateUrl: '/billing/views/payment/paymentDisable.html',
            transclude: true,
            scope: {
                userName: '=',
                method: '=',
                postHook: '=',
                classes: '@'
            }
        };
    })
    .controller('PaymentDisableCtrl', function (
        $scope, $routeParams, Payment, PaymentMethod, rxNotify, rxModalUtil, STATUS_MESSAGES) {
        var defaultStackName = 'disablePaymentOption';
        var accountNumber = $routeParams.accountNumber;
        var modal = rxModalUtil.getModal($scope, defaultStackName, STATUS_MESSAGES.paymentDisable);

        // Given a methodID perform a call to disable it.  Refreshing the payment
        // methods upon success.
        var disableMethod = function (methodId) {
            $scope.disableMethodResult = PaymentMethod.disable({
                accountNumber: accountNumber,
                methodId: methodId
            });
            $scope.disableMethodResult.$promise.then(modal.successClose('page'), modal.fail());
            modal.processing($scope.disableMethodResult.$promise);
        };

        modal.clear();
        $scope.submit = disableMethod;
        $scope.cancel = $scope.$dismiss;
    });
