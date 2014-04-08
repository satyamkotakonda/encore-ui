angular.module('billingApp')
    /**
    * @ngdoc filter
    * @param {Object} PAYMENT_TYPE_FILTERS - constant for payment types
    * @name encore.filter:PaymentMethodType
    * @description
    * Filter a list of payment methods by a specific type.
    * Current supported types: isDefault, paymentCard, electronicCheck, invoice.
    *
    * @param {Array} methods - collection of Methods to be filtered.
    * @param {String} filterType - Key to filter by
    */
    .filter('PaymentMethodType', function (PAYMENT_TYPE_FILTERS) {
        return function (methods, filterType) {
            return _.filter(methods, PAYMENT_TYPE_FILTERS[filterType]);
        };
    })
    /**
    * @ngdoc filter
    * @param {String} CARD_TYPE_FORMAT - object with a map of cardtype to it's format
    * @name encore.filter:CardNumberFormat
    * @description
    * Filter for formatting a Credit Card number based on the type of Credit Card.
    * if no type is present, return just the masked conversion of the Credit Card Number
    *
    * @example:
    * {{ card.paymentCard.cardNumber | CardNumberFormat:'VISA' }}
    * XXXXXXXXXXXX1234 -> **** **** **** 1234
    * {{ card.paymentCard.cardNumber | CardNumberFormat:'AMEX':'#' }}
    * XXXXXXXXXXX1234 -> #### ###### #1234
    *
    * @param {String} value - number to be formatted
    * @param {Boolean} type - the type of credit card to format
    * @param {String} maskCharacter - character to use for masking
    */
    .filter('CardNumberFormat', function (CARD_TYPE_FORMAT) {
        var nonNumeric = /[^0-9]/g, whiteSpace = / /g;
        return function (value, type, maskCharacter) {
            var cardFormat = CARD_TYPE_FORMAT[type],
                // Character to use for presentation of masked numbers
                maskChar = maskCharacter || '*',
                formatted;

            formatted = value.replace(nonNumeric, maskChar);

            // If no card type pattern is found, return the current formatted version
            if (!cardFormat) {
                return formatted;
            }
            // Walk through the card Format and form a string with a set of numbers per set count
            formatted = _.reduce(cardFormat, function (out, count) {
                // Get the length of the format string being formed without any added whitespace
                var currentSize = out.replace(whiteSpace, '').length;
                return out + formatted.substr(currentSize, count) + ' ';
            }, '');

            return formatted.trim();
        };
    })
    /**
    * @ngdoc filter
    * @name encore.filter:AccountNumberFormat
    * @description
    * Filter for formatting an ACH Account Number.  Mainly replaces all masked characters
    * with the chosen ones.
    *
    * @example:
    * {{ ach.electronicCheck.accountNumber | AccountNumberFormat }}
    * XXXXXXX1234 -> *******1234
    * {{ ach.electronicCheck.accountNumber | AccountNumberFormat:'#' }}
    * XXXXXXX1234 -> #######1234
    *
    * @param {String} value - number to be formatted
    * @param {String} maskCharacter - character to use for masking
    */
    .filter('AccountNumberFormat', function () {
        var nonNumeric = /[^0-9]/g;
        return function (value, maskCharacter) {
            // Character to use for presentation of masked numbers
            var maskChar = maskCharacter || '*';

            return value.replace(nonNumeric, maskChar);
        };
    })
    /**
    * @ngdoc filter
    * @name encore.filter:PaymentMethodNumber
    * @description
    * Return only the numeric portion of the Payment Method number (erasing anything that's masked)
    *
    * @example:
    * {{ ach.electronicCheck.accountNumber | PaymentMethodNumber }}
    * XXXXXXX1234 -> 1234
    *
    * @param {String} value - number to be formatted
    */
    .filter('PaymentMethodNumber', function () {
        return function (value) {
            var nonNumeric = /[^0-9]/g;
            return value.replace(nonNumeric, '');
        };
    })
    /**
     * @ngdoc service
     * @name billingSvcs.DefaultPaymentMethod
     * @param {Object} PAYMENT_TYPE_FILTERS - Filters for payment methods by method type
     * @description
     * Retrieve the default payment method from a list of payment methods.
     *
     * From a list of payment methods return the one marked as isDefault: 'true'
     * @param {Array} methods - collection of methods to search from
     */
    .filter('DefaultPaymentMethod', function (PAYMENT_TYPE_FILTERS) {
        return function (methods) {
            return _.find(methods, PAYMENT_TYPE_FILTERS.isDefault);
        };
    })
    /**
    * @ngdoc filter
    * @name encore.filter:AccountTypeFormat
    * @description
    * Convert an account type from uppercase separated by underscores only, to first letter
    * of every word capitalized, separated by space.
    * {{ ach.electronicCheck.accountType | AccountTypeFormat }}
    * CONSUMER_CHECKING -> Consumer Checking
    *
    * @param {Array} methods - collection of Methods to be filtered.
    * @param {String} filterType - Key to filter by
    */
    .filter('AccountTypeFormat', function () {
        return function (accountType) {
            return accountType.split('_').map(function (word) {
                return word.toUpperCase().substr(0, 1) + word.toLowerCase().substr(1);
            }).join(' ');
        };
    })
    /**
    * @ngdoc filter
    * @name encore.filter:Payment
    * @param {ngFilter} $filter - Angular Filter injector
    * @param {Object} PAYMENT_TYPE_COLUMNS - Object containing list of column descriptors
    * @description
    * Utility functions for payment and payment method forms
    *
    * @param {Object} $scope - $scope to set values in
    * @param {Boolean} numberOnly - whether to skip formatting and return only the numbers
    */
    .factory('PaymentFormUtil', function ($filter, PAYMENT_TYPE_COLUMNS) {
        var paymentUtil = {},
            paymentMethodTypeFilter = $filter('PaymentMethodType'),
            flattenObj = function (method) {
                var details = _.pairs(method[_.findKey(method, _.isObject)]);
                return _(method).pairs().concat(details).zipObject().value();
            };

        // Find the type of method a payment option is. If no key is found, return the second/default parameter
        paymentUtil.getMethodType = function (method, methodType) {
            return _.findKey(method, _.isObject) || methodType;
        };

        paymentUtil.formFilter = function ($scope) {
            return function (methodType) {
                // Set the method type we are filtering for for display purposes.
                $scope.methodType = methodType;

                // Filter the list of payment methods by it's method type (electronicCard/paymentCard/default)
                // Map it to flatten the object due to rxFormOptionTable not able to display values in nested obj
                $scope.methodList = paymentMethodTypeFilter($scope.methods, methodType).map(flattenObj);

                // If we are filtering for the default paymentMethod, we must find out (if any present)
                // what type of payment method it is (card/ach).
                // Payment methods don't give us a type, but we can check against the key that is an object
                // which currently determines the payment method details.
                var methodColumnsType = paymentUtil.getMethodType(_($scope.methodList).first(), methodType);

                // Get the columns that are needed for the payment method we are viewing.
                $scope.methodListCols = PAYMENT_TYPE_COLUMNS[methodColumnsType];
            };
        };

        paymentUtil.filterDefault = function ($scope) {
            paymentUtil.formFilter($scope)('isDefault');
        };

        return paymentUtil;

    })
    .constant('PAYMENT_TYPE_FILTERS', {
        'isDefault': { 'isDefault': true },
        'paymentCard': 'paymentCard',
        'electronicCheck': 'electronicCheck',
        'invoice': 'invoice'
    })
    .constant('PAYMENT_TYPE_COLUMNS', {
        'isDefault': [],
        'paymentCard': [{
            'label': 'Card Type',
            'key': 'cardType'
        },{
            'label': 'Ending In',
            'key': 'cardNumber'
        },{
            'label': 'Cardholder Name',
            'key': 'cardHolderName'
        },{
            'label': 'Exp. Date',
            'key': 'cardExpirationDate'
        }],
        'electronicCheck': [{
            'label': 'Account Type',
            'key': 'accountType'
        },{
            'label': 'Account #',
            'key': 'accountNumber'
        },{
            'label': 'Routing #',
            'key': 'routingNumber'
        },{
            'label': 'Name on Account',
            'key': 'accountHolderName'
        }],
        'invoice': []
    })
    // Format patterns for credit card types
    .constant('CARD_TYPE_FORMAT', {
        AMEX: [4, 6, 6],
        VISA: [4, 4, 4, 4],
        MASTERCARD: [4, 4, 4, 4],
        DISCOVER: [4, 4, 4, 4],
        DINERS: [4, 6, 6]
    });