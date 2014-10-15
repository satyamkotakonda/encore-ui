var loginPage = require('../pages/login.page');
var currentUsagePage = require('../pages/currentUsage.page');

var notifications = encore.rxNotify;

var chargesMock = {
    'Cloud Backup'          :40.00,
    'Cloud Big Data'        :4.01,
    'Cloud Block Storage'   :1.10,
    'Cloud Databases'       :1003.09,
    'Cloud Files'           :1.97,
    'Cloud Load Balancers'  :12.56,
    'Cloud Monitoring'      :3.09,
    'Cloud Queues'          :3.16,
    'Cloud Sites'           :189.42,
    'First Gen Cloud Servers'   :204.01,
    'Next Gen Cloud Servers'    :7.15
};

describe('current usage page', function () {

    before(function () {
        loginPage.login();
    });

    it('should search for current usage', function () {
        currentUsagePage.search(browser.params.accountId);
        expect(encore.rxPage.main.title).to.eventually.equal('Billing - Usages & Charges');
    });

    it('should not show any notifications', function () {
        expect(notifications.all.count()).to.eventually.equal(0);
    });

    it('should list the account name in the subtitle @dev', function () {
        expect(encore.rxPage.main.subtitle).to.eventually.equal('On account Digitas London');
    });

    for (var key in chargesMock) {
        it('should list all current charges by product "' + key + '"',function () {
            var value = chargesMock[key];
            expect(currentUsagePage.charges.byProduct(key)).to.eventually.equal(value);
        });
    }

    // EOD-223
    it('should at least show the table on a 404');

    after(function () {
        loginPage.logout();
    });

});
