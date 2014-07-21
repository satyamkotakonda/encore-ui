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
            templateUrl: '/billing/views/payment/paymentSetDefault.html',
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
        $scope, $routeParams, PaymentMethod, rxNotify, BillingErrorResponse, STATUS_MESSAGES) {
        var defaultStackName = 'primaryPaymentChange';

        var clearNotifications = function () {
                rxNotify.clear(defaultStackName);
                rxNotify.clear('page');
            };

        var changeFail = function (response) {// Show a notification error within the modal
                var msg = STATUS_MESSAGES.changeDefault.error,
                    responseMsg = BillingErrorResponse(response);

                if (!_.isEmpty(responseMsg)) {
                    msg += ': (' + responseMsg.msg + ')';
                }

                rxNotify.add(msg, {
                    stack: defaultStackName,
                    type: 'error'
                });
            },
            changeSuccess = function (data) {
                var stack = $scope.notificationStack;
                rxNotify.add(STATUS_MESSAGES.changeDefault.success, {
                    stack: stack,
                    type: 'success'
                });
                $scope.$close(data);
            },

            changeDefaultMethod = function () {
                clearNotifications();
                // Capture the instance of the loading notification in order to dismiss it once done processing
                var loading = rxNotify.add(STATUS_MESSAGES.changeDefault.load, {
                    stack: defaultStackName,
                    loading: true
                });

                $scope.changeDefaultResult = PaymentMethod.changeDefault(
                    {
                        accountNumber: $routeParams.accountNumber
                    }, {
                        defaultMethod: {
                            // This changes based on the input of rx-form-option-table inside of modal
                            methodId: $scope.payment.methodId
                        }
                    },
                    changeSuccess,
                    changeFail);

                $scope.changeDefaultResult.$promise.finally(function () {
                    rxNotify.dismiss(loading);
                });

                // Call the postHook (if) defined on successful result of changeDefaultMethod
                if ($scope.postHook) {
                    $scope.changeDefaultResult.$promise.then($scope.postHook);
                }

            };

        var submitForm = function () {
            clearNotifications();
            changeDefaultMethod();
        };

        // Change Primary Method modal is using this controller, so we are overriding submit and cancel
        // to prevent the modal from closing before the promise resolves
        $scope.submit = submitForm;
        $scope.cancel = $scope.$dismiss;
    });
