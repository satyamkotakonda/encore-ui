angular.module('billingApp')
    /**
    * @ngdoc filter
    * @name encore.filter:TransactionTable
    * @description
    * Filter which refines the collection of transactions based on the criteria provided. If no criteria are selected,
    * the filter will return the entire collection of transactions.  The filter leverages an 'AND' search so as more
    * criteria are selected more results will be filtered out.
    *
    * @param {Array} transactions - collection of transactions to be filtered.
    * @param {Object} filter - Object which includes the criteria for filtering the list of transactions.
    *     - **reference** {String} - Reference id for the transaction.
    *     - **type** {String} - Type of the transaction.
    *     - **status** {String} - Current state of the transaction.
    *     - **date** {Date} - The date the transaction occurred.
    */
    .filter('TransactionTable', function () {
        var getFilterDate = function getStartDate (start) {
                var filterDate, now;
                if (!isNaN(start)) {
                    now = new Date();
                    filterDate = new Date().setMonth(now.getMonth() + parseInt(start));
                } else {
                    filterDate = new Date(start);
                }
                return filterDate;
            },
            tFilter = {
                isRefMatch: function (transaction, filter) {
                    return filter.reference ? _.contains(transaction.reference, filter.reference) : true;
                },
                isType: function (transaction, filter) {
                    return filter.type ? filter.type === transaction.type : true;
                },
                isStatus: function (transaction, filter) {
                    return filter.status ? filter.status === transaction.status : true;
                },
                isInRange: function (transaction, filter) {
                    if (!filter.period) {
                        return true;
                    }
                    var tdate = new Date(transaction.date),
                        filterDate = getFilterDate(filter.period);

                    return filterDate < tdate;
                }
            };
        
        return function (transactions, filter) {
            filter = filter ? filter : {};
            return _.filter(transactions, function (transaction) {
                return tFilter.isRefMatch(transaction, filter) &&
                    tFilter.isType(transaction, filter) &&
                    tFilter.isStatus(transaction, filter) &&
                    tFilter.isInRange(transaction, filter);
            });
        };
    })
    /**
    * @ngdoc filter
    * @name encore.filter:CurrencyMetricSuffix
    * @param {$filter} $filter - Angular filterProvider for getting the currency filter
    * @description
    * Filter that formats a currency value shortened by a metric prefix (thousand/million/billion), if the value is less
    * than 10000 don't attempt to shorten it, this is meant for numbeers too big to display on UI.
    *
    * Ranges based on the shortscale of the metric prefixes
    * Idea from: 
    * http://stackoverflow.com/questions/17633462/format-a-javascript-number-with-a-metric-prefix-like-1-5k-1m-1g-etc
    * Information from:
    * http://en.wikipedia.org/wiki/SI_prefix
    * 
    * @param {Number} value - number to be formatted
    * @param {Boolean} shortcode - Whether to use the shortcode version or the metric version 
    */
    .filter('CurrencyMetricSuffix', function ($filter) {
        var currencyFilter = $filter('currency'),
            ranges = [{
                divider: 1e12,
                suffix: 't'
            }, {
                divider: 1e9,
                suffix: 'b'
            }, {
                divider: 1e6,
                suffix: 'm'
            }, {
                divider: 1e3,
                suffix: 'k'
            }];

        return function (value) {
            var i, v, suffix = '', modulus = (value < 0) ? -1 : 1;
            for (i = 0; value > 9999 && i < ranges.length; i++) {
                if (value >= ranges[i].divider) {
                    v = (value / ranges[i].divider);
                    suffix = (v.toString().length >= 2) ? ranges[i].suffix : '';
                    value = (v.toString().length >= 2) ? v : value;
                    break;
                }
            }
            return currencyFilter(modulus * value) + suffix;
        };

    });