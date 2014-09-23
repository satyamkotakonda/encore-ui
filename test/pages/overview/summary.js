var Page = require('astrolabe').Page;

module.exports = Page.create({
    contractEntity: {
        get: function () {
            return element(by.binding('contractEntity.description')).getText().then(function (text) {
                return text.split('Contract Entity:')[1].trim();
            });
        }
    },

    accountManager: {
        get: function () {
            return element(by.binding('accountManager.name')).getText().then(function (text) {
                return text.split('Account Manager:')[1].trim();
            });
        }
    },

    businessUnit: {
        get: function () {
            return element(by.binding('supportInfo.businessUnit')).getText().then(function (text) {
                return text.split('Business Unit:')[1].trim();
            });
        }
    },

    consolidatedAccount: {
        get: function () {
            var binding = 'supportAccount.linked_account_number';
            return element(by.binding(binding)).getText().then(function (text) {
                return text.split('Consolidated Account:')[1].trim();
            });
        }
    }
});
