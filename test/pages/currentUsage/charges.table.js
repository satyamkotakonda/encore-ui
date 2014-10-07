var Page = require('astrolabe').Page;

var util = require('../util');

module.exports = Page.create({

    byProduct: {
        value: function (productName) {
            return util.currencyToFloat(element(by.cssContainingText('.usage-list td', productName)).$('+ td'));
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
