var Page = require('astrolabe').Page;

module.exports = Page.create({
    name: {
        get: function () {
            return element(by.binding('contactName')).getText().then(function (name) {
                return name.split('\n')[0].trim();
            });
        }
    },

    address: {
        get: function () {
            return $('address').getText().then(function (address) {
                return address.split('\n').join(' ').trim();
            });
        }
    }
});
