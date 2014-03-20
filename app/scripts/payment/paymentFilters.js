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
    * Filter for formatting a card number
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
    * @name encore.filter:PaymentMethodNumber
    * @description
    * Return only the numeric portion of the PaymentMethod (erasing anything that's masked)
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
    .factory('DefaultPaymentMethod', function (PAYMENT_TYPE_FILTERS) {
        return function (methods) {
            return _.find(methods, PAYMENT_TYPE_FILTERS.isDefault);
        };
    })
    .constant('PAYMENT_TYPE_FILTERS', {
        'isDefault': { 'isDefault': true },
        'paymentCard': 'paymentCard',
        'electronicCheck': 'electronicCheck',
        'invoice': 'invoice'
    })
    // Format patterns for credit card types
    .constant('CARD_TYPE_FORMAT', {
        AMEX: [4, 6, 6],
        VISA: [4, 4, 4, 4],
        MASTERCARD: [4, 4, 4, 4],
        DISCOVER: [4, 4, 4, 4],
        DINERS: [4, 6, 6]
    });