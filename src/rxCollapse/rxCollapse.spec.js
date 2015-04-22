/* jshint node: true */

describe('rxCollapse', function () {
    var scope, compile, rootScope, el;
    var validTemplate = '<rx-collapse title="Filter results"></rx-collapse>';

    beforeEach(function () {
        // load module
        module('encore.ui.rxCollapse');

        // load templates
        module('templates/rxCollapse.html');

        // Inject in angular constructs
        inject(function ($location, $rootScope, $compile) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            compile = $compile;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
    });

    it('should expand', function () {

    });

    it('should collapse', function () {

    });

    it('should show custom title', function () {

    });

});