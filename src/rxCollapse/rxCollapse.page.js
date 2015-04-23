/*jshint node:true*/
var Page = require('astrolabe').Page;

/**
   @namespace
 */
var rxCollapse = {

    /**
       @function
       @returns {Boolean} Whether the root element is currently displayed.
     */
    isDisplayed: {
        value: function () {
            return this.rootElement.isDisplayed();
        }
    },

    isExpanded: {
        get: function () {
            return this.rootElement.$('.expanded').isPresent();
        }
    },

    title: {
        get: function () {
            return this.rootElement.$('.title');
        }
    },

    btnToggle: {
        get: function () {
            return this.rootElement.$('.double-chevron');
        }
    },

    elBody: {
        get: function () {
            return this.rootElement.$('.collapse-body');
        }
    }

};

/**
   @exports encore.rxCollapse
 */
exports.rxCollapse = {

    /**
       @function
       @param {WebElement} rxCollapseElement - WebElement to be transformed into an rxCollapseElement object.
       @returns {rxCollapse} Page object representing the rxCollapse object.
     */
    initialize: function (rxCollapseElement) {
        rxCollapse.rootElement = {
            get: function () { return rxCollapseElement; }
        };
        return Page.create(rxCollapse);
    },

    /**
       @returns {rxCollapse} Page object representing the _first_ rxCollapse object found on the page.
    */
    main: (function () {
        rxCollapse.rootElement = {
            get: function () { return $('rx-collapse'); }
        };
        return Page.create(rxCollapse);
    })()

};
