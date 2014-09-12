var Page = require('astrolabe').Page;

module.exports = Page.create({
    url: { value: '/billing/purchase-orders' },

    search: {
        value: function (transactionOrAuthID) {
            this.go(transactionOrAuthID);
        }
    }

});
