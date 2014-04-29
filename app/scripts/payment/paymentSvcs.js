angular.module('paymentSvcs', ['ngResource'])
    /**
     * @ngdoc service
     * @name billingSvcs.Payment
     * @description
     * Payment Method Service for interaction with Billing API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('PaymentMethod', function ($resource, Transform) {
        var transform = Transform('methods.method', 'badRequest.details');
        return $resource('/api/payment/:id/methods/:methodId',
            {
                id: '@id'
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform },
                disable: { method: 'DELETE' },
                changeDefault: { method: 'PUT', params: { methodId: 'default' }}
            }
        );
    });