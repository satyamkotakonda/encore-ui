angular.module('billingSvcs', ['ngResource'])
   /**
    * @ngdoc service
    * @name billingSvcs.Transform
    * @description
    *
    * Transform a Json message into an object and fetch a specific path from it. (Or all of it)
    */
   .factory('Transform', function () {
        var fromPath = function (obj, path) {
            obj = _.reduce(path, function (val, key) {
                return _.has(val, key) ? val[key] : false;
            }, obj);
            return obj;
        };
        return function (path, msgPath) {
            // Pre parse the path into an array
            // Set path to empty string if not given
            var splitPath = _.isEmpty(path) ? [] : path.split('.'),
                msgSplitPath = _.isEmpty(msgPath) ? [] : msgPath.split('.');
            return function (data) {
                var json = angular.fromJson(data),
                    errorMsg = fromPath(json, msgSplitPath);
                return errorMsg ? errorMsg : fromPath(json, splitPath);
            };
        };
    })
   /**
    * @ngdoc service
    * @name billingSvcs.Transaction
    * @description
    * Transaction Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Transaction', function ($resource) {
        return $resource('/api/accounts/billing/:id/transactions',
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
        return $resource('/api/accounts/billing/:id');
    })
   /**
    * @ngdoc service
    * @name billingSvcs.Period
    * @description
    * Period Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Period', function ($resource, Transform) {
        var transform = Transform('billingPeriods.billingPeriod', 'details');
        return $resource('/api/accounts/billing/:id/billing-periods',
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
    * @name billingSvcs.EstimatedCharges
    * @description
    * Estimated Charges Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('EstimatedCharges', function ($resource, Transform) {
        var transform = Transform('estimatedCharges.estimatedCharge', 'details');
        return $resource('/api/accounts/:id/billing-periods/:periodId/estimatedCharges',
            {
                id: '@id',
                periodId: '@periodId'
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
    .factory('Payment', function ($resource, Transform) {
        var transform = Transform('payments.payment', 'papi:badRequest.details');
        return $resource('/api/accounts/payments/:id',
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
     * @name billingSvcs.PaymentMethod
     * @description
     * Payment Service for interaction with Billing API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('PaymentMethod', function ($resource, Transform) {
        var transform = Transform('methods.method', 'papi:badRequest.details');
        return $resource('/api/accounts/payments/:id/methods',
            {
                id: '@id',
                marker: 0,
                showDisabled: true
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform }
            }
        );
    })
    .constant('DATE_FORMAT', 'MM / dd / yyyy')
    .constant('TRANSACTION_TYPES', ['Payment', 'Invoice', 'Reversal', 'Adjustment'])
    .constant('TRANSACTION_STATUSES', ['Paid', 'Settled', 'Unpaid']);
