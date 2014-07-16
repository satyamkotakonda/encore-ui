angular.module('billingApp')
    /**
    * @ngdoc filter
    * @name encore.filter:RoleName
    * @description
    * Filter a list of account roles by a specific name.
    *
    * @param {Array} roles - collection of Contacts to be filtered.
    * @param {String} name - Key to filter by
    */
    .filter('RoleName', function () {
        return function (roles, name) {
            return _.filter(roles, { role: { name: name }});
        };
    });