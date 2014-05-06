angular.module('billingApp')
    /**
    * @ngdoc filter
    * @name encore.filter:ProductName
    * @require {Object} PRODUCT_CONSTANTS - Mapping of our product names to the values we receive.
    *
    * @description
    * Filter that formats the given product value to display its full name.
    *
    * Documentation showing each returned value and the product name that value correlates to:
    * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/estimatedchargesenumerations.html
    *
    * @example
    * <pre>
    * {{ value | ProductName }}
    * </pre>
    */
    .filter('ProductName', function (PRODUCT_CONSTANTS) {
        return function (name) {
            return PRODUCT_CONSTANTS[name];
        };
    })
    /**
    * @ngdoc filter
    * @name encore.filter:UsageProductTotal
    * @description
    * Filter that formats the list of products to consolidate multiple type entries, and return a
    * value representing the total amount due per product type.
    *
    * @param {Array} products - A list of products with their estimated charges and usage.
    */
    .filter('UsageProductTotal', function () {
        return function (products) {
            if (!products) { return []; }
            var groupings = _.groupBy(products, function (product) {
                return product.offeringCode;
            });
            var result = [];
            _.forOwn(groupings, function (values, key) {
                var total = _.reduce(values, function (total, value) {
                    return total + parseFloat(value.amount);
                }, 0);
                values[0].name = key;
                values[0].total = total;
                result.push(values[0]);
            });
            return result;
        };
    })
    /**
    * @ngdoc filter
    * @name encore.filter:UsageTotal
    * @description
    * Return the sum of the amounts of products for a given period products
    *
    * @param {Array} products - A list of products with their estimated charges and usage.
    */
    .filter('UsageTotal', function () {
        return function (products) {
            if (!products) { return 0.00; }
            var total = _.reduce(products, function (total, product) {
                return total + parseFloat(product.amount);
            }, 0);
            return total;
        };
    });
