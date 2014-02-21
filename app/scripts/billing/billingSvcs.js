angular.module('billingSvcs', ['ngResource'])
   /**
    * @ngdoc service
    * @name billingSvcs.Transaction
    * @description
    * Transaction Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Transaction', function ($resource) {
        return $resource('/api/accounts/:id/transactions',
            {
                id: '@id'
            },
            {
                list: { method: 'GET', isArray: true }
            }
        );
    })
   /**
    * @ngdoc service
    * @name billingSvcs.Account
    * @description
    * Account Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Account', function ($resource) {
        return $resource('/api/accounts/:id');
    })
   /**
    * @ngdoc service
    * @name billingSvcs.Period
    * @description
    * Period Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Period', function ($resource) {
        var transform = function (data) {
            var json = angular.fromJson(data);
            return json.msg ? json.msg : json.billingPeriods.billingPeriod;
        };
        return $resource('/api/accounts/:id/billing-periods',
            {
                id: '@id',
                marker: 0,
                limit: 10
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform }
            }
        );
    })
    /**
     * @ngdoc service
     * @name billingSvcs.Payment
     * @description
     * Payment Service for interaction with Billing API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('Payment', function ($resource) {
        var transform = function (data) {
            var json = angular.fromJson(data);
            return json.msg ? json.msg : json.payments.payment;
        };
        return $resource('/api/accounts/:id/payment',
            {
                id: '@id',
                marker: 0,
                limit: 10
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform },
                // I realize this seems redundant, but verbally Payment.post makes more sense than Payment.save
                post: { method: 'POST' }
            }
        );
    })
    /**
     * @ngdoc service
     * @name billingSvcs.Payment
     * @description
     * Payment Service for interaction with Billing API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('PaymentMethod', function ($resource) {
        var transform = function (data) {
            var json = angular.fromJson(data);
            return json.msg ? json.msg : json.methods.method;
        };
        return $resource('/api/accounts/:id/methods',
            {
                id: '@id',
                marker: 0,
                limit: 10
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform }
            }
        );
    })
    .constant('DATE_FORMAT', 'MM / dd / yyyy')
    .constant('TRANSACTION_TYPES', ['Payment', 'Invoice', 'Reversal', 'Adjustment'])
    .constant('TRANSACTION_STATUSES', ['Paid', 'Settled', 'Unpaid']);