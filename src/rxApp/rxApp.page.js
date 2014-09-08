/*jshint node:true*/
var Page = require('astrolabe').Page;

var rxApp = {

    cssCollapseButtonSelector: {
        // Keep just the css string available for both the button element
        // and the check made in `isCollapsible()`, which uses findAllBy.
        get: function () { return '.collapsible-toggle'; }
    },

    lblNavTitle: {
        get: function () { return this.rootElement.$('.site-title'); }
    },

    lblNavSectionTitle: {
        get: function () { return this.rootElement.$('.nav-section-title'); }
    },

    eleSiteNav: {
        get: function () { return this.rootElement.$('.rx-app-nav'); }
    },

    btnCollapseToggle: {
        get: function () { return this.rootElement.$(this.cssCollapseButtonSelector); }
    },

    lnkLogout: {
        get: function () { return this.rootElement.$('.site-logout'); }
    },

    title: {
        get: function () { return this.lblNavTitle.getText(); }
    },

    sectionTitle: {
        get: function () { return this.lblNavSectionTitle.getText(); }
    },

    expand: {
        value: function () {
            var page = this;
            return this.isCollapsed().then(function (collapsed) {
                if (collapsed) {
                    page.btnCollapseToggle.click();
                }
            });
        }
    },

    collapse: {
        value: function () {
            var page = this;
            return this.isExpanded().then(function (expanded) {
                if (expanded) {
                    page.btnCollapseToggle.click();
                }
            });
        }
    },

    isCollapsed: {
        value: function () {
            var page = this;
            return this.isCollapsible().then(function (isCollapsible) {
                if (!isCollapsible) {
                    return page.title.then(function (siteTitle) {
                        page.NotCollapsibleException.thro(siteTitle);
                    });
                }

                return page.rootElement.$('.rx-app').getAttribute('class').then(function (classNames) {
                    return (classNames.indexOf('collapsed') >= 0);
                });
            });
        }
    },

    isExpanded: {
        value: function () {
            return this.isCollapsed().then(function (result) {
                return !result;
            });
        }
    },

    isCollapsible: {
        value: function () {
            return this.btnCollapseToggle.isPresent();
        }
    },

    logout: {
        value: function () {
            this.lnkLogout.click();
        }
    },

    NotCollapsibleException: {
        get: function () {
            return this.exception('Navigation menu not collapsible');
        }
    }

};

exports.rxApp = {
    initialize: function (rxAppElement) {
        rxApp.rootElement = {
            get: function () { return rxAppElement; }
        };
        return Page.create(rxApp);
    }
};

var rxPage = {

    lblTitle: {
        get: function () { return this.rootElement.$('.page-title'); }
    },

    lblSubtitle: {
        get: function () { return this.rootElement.$('.page-subtitle'); }
    },

    title: {
        get: function () {
            var page = this;
            return this.lblTitle.isPresent().then(function (present) {
                if (present) {
                    return page.lblTitle.getText();
                } else {
                    var deferred = protractor.promise.defer();
                    deferred.fulfill('');
                    return deferred.promise;
                }
            });
        }
    },

    subtitle: {
        get: function () {
            var page = this;
            return this.lblSubtitle.isPresent().then(function (present) {
                if (present) {
                    return page.lblSubtitle.getText();
                } else {
                    var deferred = protractor.promise.defer();
                    deferred.fulfill('');
                    return deferred.promise;
                }
            });
        }
    }
};

exports.rxPage = {
    initialize: function (rxPageElement) {
        if (rxPageElement === undefined) {
            rxPageElement = element;
        }
        rxPage.rootElement = {
            get: function () { return rxPageElement; }
        };
        return Page.create(rxPage);
    },

    title: {
        get: function () {
            return this.initialize().title;
        }
    },

    subtitle: {
        get: function () {
            return this.initialize().subtitle;
        }
    }
};
