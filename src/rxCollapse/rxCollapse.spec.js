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

    it('should render template', function () {
        expect(el).to.not.be.empty;
        expect(el.find('rx-collapse')).to.not.be.empty;
    });

    it('should expand and collapse', function () {
        expect(el.find('.double-chevron-cell').hasClass('expanded')).to.be.true;

        el.find('.double-chevron').click();
        expect(el.find('.double-chevron-cell').hasClass('expanded')).to.be.false;
    });

    it('should show custom title', function () {
        expect(el.find('.title').text()).to.equal('Filter results');
    });

});
