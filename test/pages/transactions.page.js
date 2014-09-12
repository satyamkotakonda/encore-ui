var Page = require('astrolabe').Page;

module.exports = Page.create({
    url: { value: '/billing/transactions' },

    search: {
        value: function (transactionOrAuthID) {
            this.go(transactionOrAuthID);
        }
    }

});
