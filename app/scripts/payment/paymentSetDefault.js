/**
 * @ngdoc directive
 * @name billingApp:rxPaymentSetDefault
 * @restrict E
 *
 * @description
 * Sets the trigger for the make payment modal to be popped up.
 */
angular.module('billingApp')
    .directive('rxPaymentSetDefault', function () {
        return {
            restrict: 'E',
            templateUrl: '/views/payment/paymentSetDefault.html',
            transclude: true,
            scope: {
                user: '@',
                classes: '@',
                methodId: '@',
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
                    PaymentFormUtil.filterDefault($scope);
                });
            }
        };
    });