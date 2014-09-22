var loginPage = require('../pages/login.page');
var homePage = require('../pages/home.page');
var overviewPage = require('../pages/overview.page');

var encore = require('rx-page-objects');
var notifications = encore.rxNotify;

describe('overview page', function () {

    before(function () {
        loginPage.login();
    });

    it('should search for an account', function () {
        homePage.search('473500');
        expect(overviewPage.title).to.eventually.equal('Billing - Overview');
    });

    it('should not show any notifications', function () {
        expect(notifications.all.count()).to.eventually.equal(0);
    });

    it('should list the account name in the subtitle @dev', function () {
        expect(overviewPage.subtitle).to.eventually.equal('On account Digitas London');
    });

    describe('contact information @dev', function () {
        var contact;

        before(function () {
            contact = overviewPage.contact;
        });

        it('should have a contact name', function () {
            expect(contact.name).to.eventually.equal('Louis Jackson');
        });

        it('should have an address', function () {
            expect(contact.address).to.eventually.equal('1211 Test Lane Testville, Iowa 98659 US');
        });

    });

    describe('account summary @dev', function () {
        var summary;

        before(function () {
            summary = overviewPage.summary;
        });

        it('should have a contract entity', function () {
            expect(summary.contractEntity).to.eventually.equal('Rackspace US contract entity');
        });

        it('should have an account manager', function () {
            expect(summary.accountManager).to.eventually.equal('Jane Racker');
        });

        it('should have a business unit', function () {
            expect(summary.businessUnit).to.eventually.equal('Managed Cloud');
        });

        it('should have a consolidated account', function () {
            expect(summary.consolidatedAccount).to.eventually.equal('12345678901');
        });

        it('should have a status', function () {
            expect(overviewPage.status).to.eventually.equal('Active');
        });

        it('should have a balance due', function () {
            expect(overviewPage.amountDue).to.eventually.equal(0.00);
        });

        it('should have a currency type', function () {
            expect(overviewPage.currencyType).to.eventually.equal('USD');
        });

    });

});
