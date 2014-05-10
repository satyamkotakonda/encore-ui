angular.module('billingApp')
    /**
    * @ngdoc filter
    * @name encore.filter:ContactType
    * @description
    * Filter a list of account contacts by a specific type.
    *
    * @param {Array} contacts - collection of Contacts to be filtered.
    * @param {String} filterType - Key to filter by
    */
    .filter('ContactType', function () {
        return function (contacts, filterType) {
            return _.filter(contacts, function (contact) {
                return _.contains(contact.roles.role, filterType);
            });
        };
    })
    /**
    * @ngdoc filter
    * @name encore.filter:PrimaryAddress
    * @description
    * Filter a list of contacts addresses by primary.
    *
    * @param {Array} contacts - collection of addresses to be filtered.
    */
    .filter('PrimaryAddress', function () {
        return function (addresses) {
            return _.find(addresses, { primary: true });
        };
    });