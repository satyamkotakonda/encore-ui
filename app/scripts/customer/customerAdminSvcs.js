angular.module('customerAdminSvcs', ['ngResource', 'rxGenericUtil'])
   /**
    * @ngdoc service
    * @name customerAdminSvcs.Account
    * @description
    * Account Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Account', function ($resource) {
        return $resource('/api/customer-admin/customer_accounts/:type/:accountNumber',
            {
                accountNumber: '@accountNumber',
                type: '@type'
            },
            {
                get: {
                    cache: true,
                    params: {
                        type: 'CLOUD'
                    }
                }
            });
    })
    /**
    * @ngdoc service
    * @name customerAdminSvcs.Contact
    * @description
    * Contact Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Contact', function ($resource, Transform) {
        var transformList = Transform('contact', 'details');
        return $resource('/api/customer-admin/customer_accounts/:type/:accountNumber/contacts',
            {
                accountNumber: '@accountNumber',
                marker: 1,
                limit: 10
            },
            {
                list: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: transformList,
                    params: {
                        type: 'CLOUD'
                    }
                }
            }
        );
    });