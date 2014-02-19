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
        return $resource('/api/billing/transactions/:id',
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
        return $resource('/api/billing/account/:id');
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
        return $resource('/api/:account/billing_periods',
            {
                account: '@account',
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
    .factory('PaymentMethod', function ($resource) {
        return $resource('/api/payment/:id/methods');
    })
    .constant('DATE_FORMAT', 'MM / dd / yyyy')
    .constant('TRANSACTION_TYPES', ['Payment', 'Invoice', 'Reversal', 'Adjustment'])
    .constant('TRANSACTION_STATUSES', ['Paid', 'Settled', 'Unpaid']);