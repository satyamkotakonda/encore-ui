angular.module('supportSvcs', ['ngResource', 'rxGenericUtil'])
   /**
    * @ngdoc service
    * @name supportSvcs.SupportAccount
    * @description
    * SupportAccount Service for interaction with Support Service Account Details API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('SupportAccount', function ($resource) {
        return $resource('/api/support/support-accounts/:accountNumber');
    })
    /**
    * @ngdoc service
    * @name supportSvcs.SupportRoles
    * @description
    * SupportRoles Service for interaction with Support Service Account Details API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('SupportRoles', function ($resource, Transform) {
        var transform = Transform('items', '');
        return $resource('/api/support/support-accounts/:accountNumber/roles',
            {
                number: '@number'
            },
            {
                list: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: transform
                }
            });
    });