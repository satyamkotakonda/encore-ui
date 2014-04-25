/* jshint node: true */

describe('rxSwitch', function () {
    var scope, compile, rootScope, el, directiveScope, readonlyEl, switchContainer,
        validTemplate = '<rx-switch model="model"></rx-switch>',
        readOnlyTemplate = '<rx-switch model="model" readonly="true"></rx-switch>';

    beforeEach(function () {
        module('rxSwitch');
        module('modules/rxSwitch/templates/rxSwitch.html');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('modules/rxSwitch/templates/rxSwitch.html');
            $templateCache.put('/billing/modules/rxSwitch/templates/rxSwitch.html', template);

            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.model = true;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
        readonlyEl = helpers.createDirective(readOnlyTemplate, compile, scope);
    });

    afterEach(function () {
        el = null;
        readonlyEl = null;
        directiveScope = null;
    });

    it('should render template correctly', function () {
        switchContainer = helpers.getChildDiv(el, 'rx-switch', 'class');
        expect(el).to.not.be.empty;
        expect(switchContainer).to.not.be.empty;
        expect(switchContainer.hasClass('rx-switch')).to.be.true;
        expect(switchContainer.hasClass('on')).to.be.true;
        expect(helpers.getChildDiv(switchContainer, 'knob', 'class')).not.be.empty;
    });

    it('should invert the model value when invert is called', function () {
        switchContainer = helpers.getChildDiv(el, 'rx-switch', 'class');
        directiveScope = switchContainer.scope();
        scope.$apply(function () {
            directiveScope.invert(scope.model);
        });
        expect(scope.model).to.be.false;
        expect(switchContainer.hasClass('on')).to.be.false;
    });

    it('should render readonly template correctly', function () {
        switchContainer = helpers.getChildDiv(readonlyEl, 'rx-switch', 'class');
        expect(el).to.not.be.empty;
        expect(switchContainer).to.not.be.empty;
        expect(switchContainer.hasClass('rx-switch')).to.be.true;
        expect(switchContainer.hasClass('readonly')).to.be.true;
        expect(switchContainer.hasClass('on')).to.be.true;
        expect(helpers.getChildDiv(switchContainer, 'knob', 'class')).not.be.empty;
    });

    it('should NOT invert the model value when invert is called (readonly)', function () {
        switchContainer = helpers.getChildDiv(readonlyEl, 'rx-switch', 'class');
        directiveScope = switchContainer.scope();
        scope.$apply(function () {
            directiveScope.invert(scope.model);
        });
        expect(scope.model).to.be.true;
        expect(switchContainer.hasClass('on')).to.be.true;
    });

});