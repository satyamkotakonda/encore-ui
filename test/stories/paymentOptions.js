var loginPage = require('../pages/login.page');
var paymentOptionsPage = require('../pages/paymentOptions.page');
var transactionsPage = require('../pages/transactions.page');

var notifications = encore.rxNotify;

describe('payment options page', function () {

    before(function () {
        loginPage.login();
        paymentOptionsPage.search(browser.params.accountId);
    });

    it('should search for payment options', function () {
        expect(encore.rxPage.main.title).to.eventually.equal('Billing - Payment Options');
    });

    it('should not show any notifications', function () {
        expect(notifications.all.count()).to.eventually.equal(0);
    });

    it('should list the account name in the subtitle @dev', function () {
        expect(encore.rxPage.main.subtitle).to.eventually.equal('On account Digitas London');
    });

    describe('change primary card modal', function () {
        var modal;

        before(function () {
            modal = paymentOptionsPage.changePrimaryPaymentModal;
        });

        it('should have a title', function () {
            expect(modal.title).to.eventually.equal('Change Primary Payment Option');
        });

        after(function () {
            modal.cancel();
        });

    });

    describe('make a payment modal', function () {
        var modal, amountDue;

        before(function () {
            transactionsPage.search(browser.params.accountId);
            transactionsPage.amountDue.then(function (due) {
                amountDue = due;
                paymentOptionsPage.search(browser.params.accountId);
                modal = paymentOptionsPage.makePaymentModal;
            });
        });

        it('should have a title', function () {
            expect(modal.title).to.eventually.equal('Make a Payment');
        });

        it('should have the full amount due prefilled by default', function () {
            expect(modal.paymentAmount).to.eventually.equal(amountDue);
        });

        after(function () {
            modal.cancel();
        });

    });

    describe('primary payment info @dev', function () {
        var primary;

        before(function () {
            primary = paymentOptionsPage.primary;
        });

        it('should have a card type', function () {
            expect(primary.card.type).to.eventually.equal('VISA');
        });

        it('should have the last four digits listed', function () {
            expect(primary.card.number).to.eventually.equal('3456');
        });

        it('should list the account holder name', function () {
            expect(primary.card.holder).to.eventually.equal('Card Rich');
        });

        it('should list the expiration date', function () {
            primary.card.expiration.then(function (expirationDate) {
                // .eventually will not work here, unwrap promise manually.
                expect(expirationDate).to.equalDate(new Date(2014, 11));
            });
        });

    });

    after(function () {
        loginPage.logout();
    });

});
