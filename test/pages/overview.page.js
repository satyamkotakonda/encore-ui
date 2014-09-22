var Page = require('astrolabe').Page;

module.exports = Page.create({

    lblAmountDue: {
        get: function () {
            return element(by.binding('balance.amountDue'));
        }
    },

    title: {
        get: function () {
            return $('.page-title').getText();
        }
    },

    subtitle: {
        get: function () {
            return $('.page-subtitle').getText();
        }
    },

    account: {
        get: function () {
            return this.subtitle.then(function (subtitle) {
                return subtitle.split('On account ')[1];
            });
        }
    },

    contact: {
        get: function () {
            return Page.create({
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
                },

            });
        }
    },

    summary: {
        get: function () {
            return Page.create({
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
        }
    },

    status: {
        get: function () {
            return element(by.binding('account.status')).getText().then(function (text) {
                return text.split('Status:')[1].trim();
            });
        }
    },

    amountDue: {
        get: function () {
            return this.lblAmountDue.getText().then(function (text) {
                return parseFloat(text.split(' ')[0]);
            });
        }
    },

    currencyType: {
        get: function () {
            return this.lblAmountDue.getText().then(function (text) {
                return text.split(' ')[1].toUpperCase();
            });
        }
    }

});
