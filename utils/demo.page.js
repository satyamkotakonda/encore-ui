var Page = require('astrolabe').Page;

module.exports = Page.create({
    url: { value: '' },

    storeTokenButton: {
        get: function () {
            return $('button.storeToken');
        }
    },

    clearTokenButton: {
        get: function () {
            return $('button.clearToken');
        }
    }
});
