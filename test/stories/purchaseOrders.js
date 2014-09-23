var loginPage = require('../pages/login.page');
var purchaseOrdersPage = require('../pages/purchaseOrders.page');

var notifications = encore.rxNotify;

describe('purchase orders page', function () {

    before(function () {
        loginPage.login();
    });

    it('should search for purchase orders', function () {
        purchaseOrdersPage.search(browser.params.accountId);
        expect(encore.rxPage.main.title).to.eventually.equal('Billing - Purchase Orders');
    });

    it('should not show any notifications', function () {
        expect(notifications.all.count()).to.eventually.equal(0);
    });

    it('should list the account name in the subtitle @dev', function () {
        expect(encore.rxPage.main.subtitle).to.eventually.equal('On account Digitas London');
    });

    describe('adding new purchase orders', function () {

        it('should add a new purchase order');
        it('should display an error when an invalid purchase order is added');
        it('should cancel out of the add new purchase order modal');
        it('should not have added a new purchase #regression');

    });

    describe('disabling existing purchase orders', function () {

        it('should disable purchase order');
        it('should cancel out of the disable purchase order modal');
        it('should not have disabled the purchase #regression');

    });

    after(function () {
        loginPage.logout();
    });

});
