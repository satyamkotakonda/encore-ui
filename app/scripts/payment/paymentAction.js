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
    /**
     * @ngdoc service
     * @name encore.service:rxPaymentPost
     * @description
     * @param {object} Payment - Payment Resource
     * Wrapper around Payment.post for easy injection and re-usability throughout controllers
     *
     * @param {string} accountNumber - Account Number for which to post the payment to.
     * @param {number} amount - Amount of the payment to be made
     * @param {string} methodId - urn:uuid of the payment method ID
     */
    .factory('rxPaymentPost', function (Payment) {
        return function (accountNumber, amount, methodId) {
            return Payment.post({
                id: accountNumber // URL Arguments
            }, {
                payment: { // Post Data
                    amount: amount,
                    methodId: methodId
                }
            });
        };
    });