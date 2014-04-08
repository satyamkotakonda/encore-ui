/**
 * @ngdoc directive
 * @name billingApp:rxPaymentAction
 * @restrict E
 *
 * @description
 * Sets the trigger for the make payment modal to be popped up.
 */
angular.module('billingApp')
    .directive('rxPaymentAction', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/payment/paymentAction.html',
            transclude: true,
            scope: {
                user: '@',
                classes: '@',
                amount: '@',
                methodId: '@',
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
    });