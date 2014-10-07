var Page = require('astrolabe').Page;

var charges = require('./currentUsage/charges.table');

var util = require('./util');

var dateFromMonthDayYearString = function (monthDayYearString) {
    var dateParts = monthDayYearString.split(' / ');
    var month = dateParts[0];
    var year = dateParts[2];
    return new Date(year, month);
};

module.exports = Page.create({
    url: { value: '/billing/usage' },

    search: {
        value: function (transactionOrAuthID) {
            this.go(transactionOrAuthID);
        }
    },

    cyclePeriodStart: {
        get: function () {
            return element(by.binding('currentPeriod.startDate')).getText().then(function (text) {
                return dateFromMonthDayYearString(text);
            });
        }
    },

    cyclePeriodEnd: {
        get: function () {
            return util.unless(element(by.binding('currentPeriod.endDate')), function (text) {
                return dateFromMonthDayYearString(text);
            }).then(function (result) {
                if (result === null) {
                    // "Present" was returned in the UI
                    var now = new Date();
                    return new Date(now.getFullYear(), now.getMonth());
                }
            });
        }
    },

    estimate: {
        get: function () {
            return util.unless(element(by.binding('charges')), function (text) {
                return util.currencyToFloat(text);
            });
        }
    },

    byProduct: {
        value: function (productName) {
            return charges.byProduct(productName);
        }
    }

});
