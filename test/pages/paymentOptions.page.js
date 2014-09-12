var Page = require('astrolabe').Page;

module.exports = Page.create({
    url: { value: '/billing/payment' },

    search: {
        value: function (transactionOrAuthID) {
            this.go(transactionOrAuthID + '/options');
        }
    }

});
