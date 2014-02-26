/* jshint node: true */

describe('rxSwitch', function () {
    var el, scope, compile, rootScope,
        validTemplate = '<rx-switch model="model"></rx-switch>';

    beforeEach(function () {
        module('rxSwitch');
        module('modules/rxSwitch/templates/rxSwitch.html');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('modules/rxSwitch/templates/rxSwitch.html');
            $templateCache.put('/modules/rxSwitch/templates/rxSwitch.html', template);

            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.model = true;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
    });

    afterEach(function () {
        el = null;
    });

    it('should render template correctly', function () {
        expect(el).not.be.empty;
        expect(el.find('div')).not.be.empty;
        expect(el.find('div').attr('class').split(' ').indexOf('rx-switch')).to.be.gt(-1);
        expect(el.find('div').attr('class').split(' ').indexOf('on')).to.be.gt(-1);
        expect(el.find('div').find('div')).not.be.empty;
        expect(el.find('div').find('div').attr('class')).to.be.eq('knob');
    });
});