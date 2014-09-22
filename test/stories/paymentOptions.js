var loginPage = require('../pages/login.page');
var paymentOptionsPage = require('../pages/paymentOptions.page');

var notifications = encore.rxNotify;

describe('payment options page', function () {

    before(function () {
        loginPage.login();
    });

    it('should search for current usage', function () {
        paymentOptionsPage.search(browser.params.accountId);
        expect(encore.rxPage.main.title).to.eventually.equal('Billing - Payment Options');
    });

    it('should not show any notifications', function () {
        expect(notifications.all.count()).to.eventually.equal(0);
    });

    it('should list the account name in the subtitle @dev', function () {
        expect(encore.rxPage.main.subtitle).to.eventually.equal('On account Digitas London');
    });

    after(function () {
        loginPage.logout();
    });

});
