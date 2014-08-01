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
// Given a methodID perform a call to make it default. Refreshing the payment
// methods upon success (refreshPaymentMethods is a post hook). 
    .controller('PaymentActionCtrl', function (
        $scope, $routeParams, Payment, rxNotify, BillingErrorResponse, STATUS_MESSAGES) {
        var defaultStackName = 'makePayment';

        var clearNotifications = function () {
                rxNotify.clear(defaultStackName);
                rxNotify.clear('page');
            };

        var paymentFail = function (response) {// Show a notification error within the modal
                var msg = STATUS_MESSAGES.payment.error,
                    responseMsg = BillingErrorResponse(response);

                if (!_.isEmpty(responseMsg.msgDetails)) {
                    msg += ': (' + responseMsg.msgDetails[0].message + ')';
                } else if (!_.isEmpty(responseMsg.msg)) {
                    msg += ': (' + responseMsg.msg + ')';
                }

                rxNotify.add(msg, {
                    stack: defaultStackName,
                    type: 'error'
                });
            },
            paymentSuccess = function (data) {
                var stack = $scope.notificationStack;
                rxNotify.add(STATUS_MESSAGES.payment.success, {
                    stack: stack,
                    type: 'success'
                });
                $scope.$close(data);
            },

            makePayment = function () {
                clearNotifications();
                // Capture the instance of the loading notification in order to dismiss it once done processing
                var loading = rxNotify.add(STATUS_MESSAGES.payment.load, {
                    stack: defaultStackName,
                    loading: true
                });

                $scope.paymentResult = Payment.makePayment($routeParams.accountNumber, $scope.payment.amount,
                                                           $scope.payment.methodId, paymentSuccess, paymentFail);

                $scope.paymentResult.$promise.finally(function () {
                    rxNotify.dismiss(loading);
                });

                // Call the postHook (if) defined on successful result of makePayment
                if ($scope.postHook) {
                    $scope.paymentResult.$promise.then($scope.postHook);
                }

            };

        var submitForm = function () {
            clearNotifications();
            makePayment();
        };

        // Make Payment  modal is using this controller, so we are overriding submit and cancel
        // to prevent the modal from closing before the promise resolves
        $scope.submit = submitForm;
        $scope.cancel = $scope.$dismiss;
    });
