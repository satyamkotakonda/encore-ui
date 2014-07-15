angular.module('paymentSvcs', ['ngResource', 'rxGenericUtil'])
    /**
     * @ngdoc service
     * @name paymentSvcs.PaymentMethod
     * @description
     * Payment Method Service for interaction with Billing API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('PaymentMethod', function ($resource, Transform) {
        var transform = Transform('methods.method', 'badRequest.details');
        var transformMethod = Transform('method');
        return $resource('/api/payment/accounts/:prefix-:accountNumber/methods/:methodId',
            {
                accountNumber: '@accountNumber',
                prefix: '020'
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform },
                get: { method: 'GET', url: '/api/payment/methods/:methodId', transformResponse: transformMethod },
                disable: { method: 'DELETE' },
                changeDefault: { method: 'PUT', params: { methodId: 'default' }}
            }
        );
    });
