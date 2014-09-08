var modal = require('../rxModalAction.page.js').rxModalAction;

describe('rxModalAction', function () {
    var changePasswordModal, triggerModal;

    before(function () {
        demoPage.go('#/component/rxModalAction');
        triggerModal = function () {
            $('.component-demo .modal-link').click();
        };

        var customFunctionalty = {
            txtNewPassword: {
                get: function () {
                    return this.rootElement.element(by.model('fields.password'));
                }
            },

            newPassword: {
                get: function () {
                    return this.txtNewPassword.getAttribute('value');
                },
                set: function (password) {
                    this.txtNewPassword.clear();
                    this.txtNewPassword.sendKeys(password);
                }
            }
        };

        changePasswordModal = modal.initialize(customFunctionalty);
    });

    it('should not display the modal unless triggered', function () {
        expect(changePasswordModal.isDisplayed()).to.eventually.be.false;
    });

    it('should display the modal when triggered', function () {
        triggerModal();
        expect(changePasswordModal.isDisplayed()).to.eventually.be.true;
    });

    it('should close the modal using the little X in the corner', function () {
        changePasswordModal.close();
        expect(changePasswordModal.isDisplayed()).to.eventually.be.false;
    });

    it('should close the modal when clicking the "cancel" button', function () {
        triggerModal();
        changePasswordModal.cancel();
        expect(changePasswordModal.isDisplayed()).to.eventually.be.false;
    });

    it('should have a title', function () {
        triggerModal();
        expect(changePasswordModal.title).to.eventually.equal('Change hey_dude Admin Password');
    });

    it('should have a subtitle', function () {
        expect(changePasswordModal.subtitle).to.eventually.equal('Please read instructions below');
    });

    it('should not let me submit the modal by default', function () {
        expect(changePasswordModal.canSubmit()).to.eventually.be.false;
    });

    it('should let me submit the modal when a new password is entered', function () {
        changePasswordModal.newPassword = 'hunter2';
        expect(changePasswordModal.canSubmit()).to.eventually.be.true;
    });

    it('should submit', function () {
        changePasswordModal.submit();
        expect(changePasswordModal.isDisplayed()).to.eventually.be.false;
    });

    describe('default modal behavior', function () {
        var defaultModal;

        before(function () {
            defaultModal = modal.initialize();
        });

        it('should support basic functionality without supplying any arguments', function () {
            triggerModal();
            expect(defaultModal.title).to.eventually.equal('Change hey_dude Admin Password');
            defaultModal.cancel();
        });

    });

});
