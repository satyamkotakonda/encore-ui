angular.module('billingApp')
    /**
     * @ngdoc directive
     * @name billingApp:rxPaymentAction
     * @restrict E
     *
     * @description
     * Sets the trigger for the make payment modal to be popped up.
     * @param {String} userName - User performing the action, for display purposes only
     * @param {Array} methods - Methods model for displaying payment method options
     * @param {String} postHook - Function to be called when submitting form
     * @param {String} classes - CSS Classes to be added to the trigger
     * @param {String} methodId - Default payment method ID
     *
     * @example
     * <pre>
     *    <rx-payment-action
     *        post-hook="postPayment"
     *        userName="{{userName}}"
     *        classes="button button-green"
     *        amount="{{paymentAmount}}"
     *        method-id="{{defaultMethod.id}}"
     *        methods="paymentMethods">
     *        <strong>+</strong> Make a Payment
     *    </rx-payment-action>
     * </pre>
     */
    .directive('rxPaymentAction', function () {
        return {
            restrict: 'E',
            templateUrl: '/billing/views/payment/paymentAction.html',
            transclude: true,
            scope: {
                userName: '=',
                classes: '@',
                amount: '=',
                methodId: '=',
                methods: '=',
                postHook: '='
            },
            controller: function ($scope, $q, PaymentFormUtil) {
                $scope.payment = {};
                $scope.setDefaultValues = function (amount, methodId) {
                    $scope.payment.amount = amount;
                    $scope.payment.methodId = methodId;
                };

                $scope.changeMethodType = PaymentFormUtil.formFilter($scope);

                // Set default as the active view
                $q.when($scope.methods.$promise).then(function () {
                    PaymentFormUtil.filterDefault($scope);
                });
            }
        };
    })
    .controller('PaymentActionCtrl', function (
        $scope, $routeParams, Payment, rxNotify, rxModalUtil, BillingErrorResponse, STATUS_MESSAGES) {
        var defaultStackName = 'makePayment';
        var accountNumber = $routeParams.accountNumber;
        var modal = rxModalUtil.getModal($scope, defaultStackName, STATUS_MESSAGES.payment, BillingErrorResponse);

        var makePayment = function () {
            $scope.paymentResult = Payment.makePayment(accountNumber, $scope.payment.amount, $scope.payment.methodId);
            $scope.paymentResult.$promise.then(modal.successClose('page'), modal.fail());
            modal.processing($scope.paymentResult.$promise);
        };

        modal.clear();
        $scope.submit = makePayment;
        $scope.cancel = $scope.$dismiss;
    });
