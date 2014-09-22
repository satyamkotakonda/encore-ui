var Page = require('astrolabe').Page;

module.exports = Page.create({
    url: { value: '/billing' },

    search: {
        value: function (transactionOrAuthID) {
            this.go('/search/' + transactionOrAuthID);
        }
    }

});
