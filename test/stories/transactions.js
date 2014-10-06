var _ = require('lodash');

var loginPage = require('../pages/login.page');
var transactionsPage = require('../pages/transactions.page');

var notifications = encore.rxNotify;

describe('transactions page', function () {

    before(function () {
        loginPage.login();
    });

    it('should search for transactions', function () {
        transactionsPage.search(browser.params.accountId);
        expect(encore.rxPage.main.title).to.eventually.equal('Billing - Transactions');
    });

    it('should not show any notifications', function () {
        expect(notifications.all.count()).to.eventually.equal(0);
    });

    it('should list the account name in the subtitle @dev', function () {
        expect(encore.rxPage.main.subtitle).to.eventually.equal('On account Digitas London');
    });

    describe('overview statement amounts @dev', function () {

        it('should show the current amount due', function () {
            expect(transactionsPage.amountDue).to.eventually.equal(12.34);
        });

        it('should show the currency type', function () {
            expect(transactionsPage.currencyType).to.eventually.equal('USD');
        });

        it('should show the account balance', function () {
            expect(transactionsPage.accountBalance).to.eventually.equal(162.38);
        });

        it('should show the past due amount', function () {
            expect(transactionsPage.pastDue).to.eventually.equal(162.38);
        });

        it('should show the terms', function () {
            expect(transactionsPage.terms).to.eventually.equal('NET_0');
        });

        it('should show the billing cycle', function () {
            expect(transactionsPage.billingCycle).to.eventually.equal('Monthly');
        });

    });

    describe('N/A overview statement amounts @dev', function () {

        before(function () {
            transactionsPage.search('404-transactions-overview');
        });

        it('should not show a value for current amount due', function () {
            expect(transactionsPage.amountDue).to.eventually.be.null;
        });

        it('should not show a value for currency type', function () {
            expect(transactionsPage.currencyType).to.eventually.be.null;
        });

        it('should not show the account balance', function () {
            expect(transactionsPage.accountBalance).to.eventually.be.null;
        });

        it('should not show the past due amount', function () {
            expect(transactionsPage.pastDue).to.eventually.be.null;
        });

        it('should not show the terms', function () {
            expect(transactionsPage.terms).to.eventually.be.null;
        });

        it('should not show the billing cycle', function () {
            expect(transactionsPage.billingCycle).to.eventually.be.null;
        });

        after(function () {
            transactionsPage.search(browser.params.accountId);
        });

    });

    describe('make a payment modal', function () {
        var modal;

        before(function () {
            modal = transactionsPage.makePaymentModal;
        });

        it('should have the right title', function () {
            expect(modal.title).to.eventually.equal('Make a Payment');
        });

        it('should have the full amount due prefilled by default', function () {
            transactionsPage.amountDue.then(function (due) {
                expect(modal.paymentAmount).to.eventually.equal(due);
            });
        });

        it('should make a payment with primary payment method');
        it('should make a payment with non-primary credit card');
        it('should not allow a payment more than the balance amount');
        it('should not allow a payment less than a dollar');
        it('should not allow a payment greater than 5000 dollars');
        it('should not allow a payment less than zero dollars');
        it('should cancel out of the payment modal');
        it('should not have charged the account after canceling');

    });

    describe('billed items', function () {

        it('should download transactions of the billed items table #manual #regression @staging');

        describe('filtering', function () {

            it('should filter the billed items table by reference #');
            it('should clear existing filters of the billed items table');

            describe('statuses', function () {
                var statuses = ['any', 'open', 'closed', 'pending', null];

                _.forEach(statuses, function (status) {
                    it('should filter the billed items table by status of ' + status);
                });

            });

            describe('types', function () {
                var types = ['any', 'payment', 'invoice', 'reversal', 'adjustment', 'write off', 'refund'];

                _.forEach(types, function (type) {
                    it('should filter the billed items table by type of ' + type);
                });

            });

            describe('ranges', function () {
                var ranges = ['any', '1 month', '3 months', '6 months'];

                _.forEach(ranges, function (range) {
                    it('should filter the billed items table by range of ' + range);
                });

                it('should filter the billed items table by range of last billing cycle');
                it('should filter the billed items table by range of second to last billing cycle');

            });
        });

        describe('transaction details', function () {
            var details = ['credit', 'debit', 'invoice', 'payment', 'refund', 'reversal', 'write off'];

            _.forEach(details, function (detail) {
                it('should view the transaction details for a ' + detail);
            });

            it('should link to the invoice details page from the payment transaction details page');

        });

    });

    after(function () {
        loginPage.logout();
    });

});
