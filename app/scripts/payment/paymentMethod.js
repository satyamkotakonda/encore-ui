angular.module('billingApp')
    /**
     * @ngdoc directive
     * @name billingApp:rxPaymentMethod
     * @restrict E
     *
     * @description
     * Shows details for the relevant payment method
     */
    .directive('rxPaymentMethod', function () {
        return {
            restrict: 'E',
            templateUrl: '/billing/views/payment/paymentMethod.html',
        };
    });
