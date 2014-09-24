var loginPage = require('../pages/login.page');
var preferencesPage = require('../pages/preferences.page');

var notifications = encore.rxNotify;

describe('preferences page', function () {

    before(function () {
        loginPage.login();
    });

    it('should search for preferences', function () {
        preferencesPage.search(browser.params.accountId);
        expect(encore.rxPage.main.title).to.eventually.equal('Billing - Preferences');
    });

    it('should not show any notifications', function () {
        expect(notifications.all.count()).to.eventually.equal(0);
    });

    it('should list the account name in the subtitle @dev', function () {
        expect(encore.rxPage.main.subtitle).to.eventually.equal('On account Digitas London');
    });

    it('should update the paperless billing preference');
    it('should update the notifications preference');
    it('should update both the paperless billing and notifications preferences');
    it('should show an error if changing the paperless billing preference fails @dev');
    it('should show an error if changing the notifications preference fails @dev');
    it('should not save unless the update button is selected on');

    after(function () {
        loginPage.logout();
    });

});
