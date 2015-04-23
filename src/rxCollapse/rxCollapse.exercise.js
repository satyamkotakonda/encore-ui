var _ = require('lodash');
var rxCollapse = require('./rxCollapse.page').rxCollapse;

/**
   rxCollapse exercises.
   @exports encore.exercise.rxCollapse
   @param {Object} [options=] - Test options. Used to build valid tests.
   @param {string} [options.cssSelector=] - Fallback selector string to initialize widget with.
   @example
   ```js
   describe('default exercises', encore.exercise.rxCollapse({
       cssSelector: '.secondary-info rx-paginate', // select one of many widgets on page
   }));
   ```
 */
exports.rxCollapse = function (options) {
    if (options === undefined) {
        options = {};
    }

    options = _.defaults(options, { /* defaults go here */ });

    return function () {
        var component;

        before(function () {
            if (options.cssSelector === undefined) {
                component = rxCollapse.main;
            } else {
                component = rxCollapse.initialize($(options.cssSelector));
            }
        });

        it('should show the element', function () {
            expect(component.isDisplayed()).to.eventually.be.true;
        });

        it('should show a custom title', function () {
            expect(component.title.getText()).to.eventually.equal('Filter results');
        });

        it('should expand and collapse with toggle', function () {
            expect(component.isExpanded).to.eventually.be.true;

            // Collapse
            component.btnToggle.click();
            expect(component.isExpanded).to.eventually.be.false;

            // Expand
            component.btnToggle.click();
            expect(component.isExpanded).to.eventually.be.true;
        });

    };
};
