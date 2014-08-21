angular.module('billingApp')
    /**
     * @ngdoc directive
     * @name billingApp:rxPaymentSetDefault
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
     *    <rx-payment-set-default
     *        post-hook="changeDefaultMethod"
     *        userName="{{userName}}"
     *        classes="button button-blue"
     *        method-id="{{defaultMethod.id}}"
     *        methods="paymentMethods"
     *        action-type="change">
     *         Change Primary
     *    </rx-payment-set-default>
     * </pre>
     */
    .directive('rxPaymentSetDefault', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/payment/paymentSetDefault.html',
            transclude: true,
            scope: {
                userName: '=',
                classes: '@',
                methodId: '=',
                methods: '=',
                postHook: '='
            },
            controller: function ($scope, $q, PaymentFormUtil) {
                $scope.payment = {};
                $scope.setDefaultValues = function (methodId) {
                    $scope.payment.methodId = methodId;
                };
                $scope.changeMethodType = PaymentFormUtil.formFilter($scope);

                // Set default as the active view
                $q.when($scope.methods.$promise).then(function () {
                    PaymentFormUtil.formFilter($scope)('paymentCard');
                });
            }
        };
    })
// Given a methodID perform a call to make it default. Refreshing the payment
// methods upon success (refreshPaymentMethods is a post hook).
    .controller('PaymentSetDefaultCtrl', function (
        $scope, $routeParams, PaymentMethod, rxNotify, rxModalUtil, BillingErrorResponse, STATUS_MESSAGES) {
        var defaultStackName = 'primaryPaymentChange';
        var accountNumber = $routeParams.accountNumber;
        var modal = rxModalUtil.getModal($scope, defaultStackName, STATUS_MESSAGES.changeDefault, BillingErrorResponse);

        var changeDefault = function () {
            $scope.changeDefaultResult = PaymentMethod.changeDefault({
                accountNumber: accountNumber
            }, {
                defaultMethod: { methodId: $scope.payment.methodId }
            });

            // This passes a success notification to the main page (default stack 'page')
            $scope.changeDefaultResult.$promise.then(modal.successClose('page'), modal.fail());
            modal.processing($scope.changeDefaultResult.$promise);
        };

        modal.clear();
        $scope.submit = changeDefault;
        $scope.cancel = $scope.$dismiss;
    });
