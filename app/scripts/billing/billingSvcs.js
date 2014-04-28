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
    .factory('Transaction', function ($resource, Transform) {
        var transform = Transform('billingSummary.item', 'details');
        return $resource('/api/billing/:id/billingSummary',
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
    * @name billingSvcs.Account
    * @description
    * Account Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Account', function ($resource) {
        return $resource('/api/billing/:id');
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
        return $resource('/api/billing/:id/billing-periods',
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
        return $resource('/api/billing/:id/billing-periods/:periodId/estimated_charges',
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
        var transform = Transform('payments.payment', 'badRequest.details');
        return $resource('/api/billing/:id/payments',
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
    .constant('DATE_FORMAT', 'MM / dd / yyyy')
    .constant('TRANSACTION_TYPES', ['Payment', 'Invoice', 'Reversal', 'Adjustment'])
    .constant('TRANSACTION_STATUSES', ['Paid', 'Settled', 'Unpaid']);
