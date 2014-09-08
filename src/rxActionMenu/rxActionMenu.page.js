var _ = require('lodash');
var Page = require('astrolabe').Page;

var action = function (actionElement) {

    return Page.create({

        rootElement: {
            get: function () {
                return actionElement;
            }
        },

        openModal: {
            // Returns a modal object to manipulate later, with given `customFunctionality`.
            //
            // This is the default behavior, since many instances of the action menu serve to launch
            // modals. If you're not using rxActionMenu to launch modals, over-ride this entire `action`
            // function within the `initialize` function, where it accepts a custom `actionConstructorFn`.
            value: function (customFunctionality) {
                actionElement.$('.modal-link').click();
                var rxModal = exports.rxModalAction || require('../rxModalAction/rxModalAction.page').rxModalAction;
                return rxModal.initialize(customFunctionality);
            }
        },

        text: {
            get: function () {
                return actionElement.getText().then(function (text) {
                    return text.trim();
                });
            }
        }

    });
};

var rxActionMenu = {

    icoCog: {
        get: function () {
            return this.rootElement.$('.fa-cog');
        }
    },

    cssFirstAny: {
        // This selector will grab any top-level child elements under `.actions-area`, one level deep.
        //
        // Since action menus allow for free-form html entry, there is no guarantee that any
        // particular structure will appear inside the action menu. However, we can be sure
        // that they'll use the `.actions-area` class to style it, and inside of it will be some
        // sort of element list. This exposes a hook into the html for matching text or counting nodes.
        get: function () {
            return '.actions-area > *';
        }
    },

    isExpanded: {
        value: function () {
            return this.rootElement.$('.action-list').getAttribute('class').then(function (className) {
                return className.indexOf('ng-hide') === -1;
            });
        }
    },

    isCollapsed: {
        value: function () {
            return this.isExpanded().then(function (isExpanded) {
                return !isExpanded;
            });
        }
    },

    expand: {
        value: function () {
            var page = this;
            return this.isCollapsed().then(function (collapsed) {
                if (collapsed) {
                    page.icoCog.click();
                }
            });
        }
    },

    collapse: {
        value: function () {
            var page = this;
            return this.isExpanded().then(function (expanded) {
                if (expanded) {
                    page.icoCog.click();
                }
            });
        }
    },

    action: {
        value: function (actionName) {
            this.expand();
            var actionElement = this.rootElement.element(by.cssContainingText(this.cssFirstAny, actionName));
            return this.actionConstructorFn(actionElement);
        }
    },

    actionCount: {
        value: function () {
            return this.rootElement.$$(this.cssFirstAny).count();
        }
    }

};

exports.rxActionMenu = {

    // Passing in an `actionConstructorFn` will default to calling that for any
    // calls made to `rxActionMenu.action('Action Name')`.
    //
    // If this is left undefined, a simple default will be returned. For more information,
    // see the underlying definition for the `action` function.
    initialize: function (rxActionMenuElement, actionConstructorFn) {
        rxActionMenu.rootElement = {
            get: function () {
                return rxActionMenuElement;
            }
        };

        rxActionMenu.actionConstructorFn = {
            get: function () {
                if (_.isFunction(actionConstructorFn)) {
                    return actionConstructorFn;
                }
                return action;
            }
        };

        return Page.create(rxActionMenu);
    }

};
