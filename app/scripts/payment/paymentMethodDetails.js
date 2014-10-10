angular.module('billingApp')
    /**
     * @ngdoc directive
     * @name billingApp:rxPaymentMethodDetails
     * @restrict E
     *
     * @description
     * Shows details for the relevant payment method
     */
    .directive('rxPaymentMethodDetails', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/payment/paymentMethodDetails.html',
        };
    });
