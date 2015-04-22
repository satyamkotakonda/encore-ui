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

        it('should start exercising defaults now');

    };
};
