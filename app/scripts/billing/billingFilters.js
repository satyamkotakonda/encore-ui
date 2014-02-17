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
        return function (transactions, filter) {
            filter = filter ? filter : {};
            var getFilterDate = function getStartDate (start) {
                    var filterDate, now;
                    if (!isNaN(start)) {
                        now = new Date();
                        filterDate = new Date().setMonth(now.getMonth() + parseInt(start));
                    } else {
                        filterDate = new Date(start);
                    }
                    return filterDate;
                };
            getFilterDate.cache = {};

            var tFilter = {
                isRefMatch: function (transaction) {
                    return filter.reference ? _.contains(transaction.reference, filter.reference) : true;
                },
                isType: function (transaction) {
                    return filter.type ? filter.type === transaction.type : true;
                },
                isStatus: function (transaction) {
                    return filter.status ? filter.status === transaction.status : true;
                },
                isInRange: function (transaction) {
                    if (!filter.period) {
                        return true;
                    }
                    var tdate = new Date(transaction.date),
                        filterDate = getFilterDate(filter.period);

                    return filterDate < tdate;
                }
            };

            return _.filter(transactions, function (transaction) {
                return tFilter.isRefMatch(transaction) &&
                    tFilter.isType(transaction) &&
                    tFilter.isStatus(transaction) &&
                    tFilter.isInRange(transaction);
            });
        };
    });