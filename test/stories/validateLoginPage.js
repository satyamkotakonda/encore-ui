var loginPage = require('../pages/LoginPage'),
    expect = require('../setupExpect').expect;

describe('LoginPage: Validate page content', function () {
    before(function () {
        loginPage.go();
    });

    it('Should display heading with correct content', function () {
        expect(loginPage.heading).to.eventually.exist;
        expect(loginPage.heading.getText()).to.eventually.eq('Hello, I am a login page');
    });

    it('Should be display scope variable', function () {
        expect(loginPage.hello.getText()).to.eventually.eq('Hello, I am a login page');
    });
});