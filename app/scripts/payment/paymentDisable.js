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
            templateUrl: '/views/payment/paymentDisable.html',
            transclude: true,
            scope: {
                userName: '@',
                method: '=',
                postHook: '='
            }
        };
    });