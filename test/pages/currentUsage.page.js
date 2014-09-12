var Page = require('astrolabe').Page;

module.exports = Page.create({
    url: { value: '/billing/usage' },

    search: {
        value: function (transactionOrAuthID) {
            this.go(transactionOrAuthID);
        }
    }

});
