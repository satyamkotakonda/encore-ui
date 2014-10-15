var Page = require('astrolabe').Page;

var util = require('../util');

module.exports = Page.create({

    byProduct: {
        value: function (productName) {
            return element(by.cssContainingText('.usage-list tr', productName)).$('td + td').getText().then(function (text) {
                 return util.currencyToFloat(text);
            });
        }
    },

    column: {
        value: function (columnName) {
            var css = '.usage-list rx-sortable-column';
            var columnElement = element(by.cssContainingText(css, columnName));
            return encore.rxSortableColumn.initiailize(columnElement, 'charge in charges');
        }
    }

});
