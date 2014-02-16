angular.module('billingApp')
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