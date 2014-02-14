angular.module('billingApp')
    .filter('TransactionTable', function () {
        return function (transactions, filter) {
            filter = filter ? filter : {};
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
                    if (!filter.date) {
                        return true;
                    }

                    var tdate = new Date(transaction.date),
                        now = new Date(),
                        filterDate = new Date().setMonth(now.getMonth() + parseInt(filter.date));

                    return filterDate > tdate;
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