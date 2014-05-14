/* jshint node: true */

describe('rxSwitch', function () {
    var scope, compile, rootScope, el, directiveScope, disabledEl, switchContainer,
        validTemplate = '<rx-switch model="model"></rx-switch>',
        disabledTemplate = '<rx-switch model="model" disabled="true"></rx-switch>';

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
        el = helpers.getChildDiv(el, 'rx-switch-container', 'class');

        disabledEl = helpers.createDirective(disabledTemplate, compile, scope);
        disabledEl = helpers.getChildDiv(disabledEl, 'rx-switch-container', 'class');
    });

    afterEach(function () {
        el = null;
        disabledEl = null;
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

    it('should switch the model value when update is called', function () {
        switchContainer = helpers.getChildDiv(el, 'rx-switch', 'class');
        directiveScope = switchContainer.scope();
        expect(scope.model).to.be.true;
        directiveScope.update(scope.model);
        scope.$apply();
        expect(scope.model).to.be.false;
        expect(switchContainer.hasClass('on')).to.be.false;
    });

    it('should render disabled template correctly', function () {
        switchContainer = helpers.getChildDiv(disabledEl, 'rx-switch', 'class');
        expect(el).to.not.be.empty;
        console.log(switchContainer.prototype);
        expect(switchContainer).to.not.be.empty;
        expect(switchContainer.hasClass('rx-switch')).to.be.true;
        //expect(switchContainer.hasAttr('disabled')).to.be.true;
        expect(switchContainer.hasClass('on')).to.be.true;
        expect(helpers.getChildDiv(switchContainer, 'knob', 'class')).not.be.empty;
    });

    it('should NOT switch the model value when switch is called (disabled)', function () {
        switchContainer = helpers.getChildDiv(disabledEl, 'rx-switch', 'class');
        directiveScope = switchContainer.scope();
        directiveScope.update(scope.model);
        scope.$apply();
        expect(scope.model).to.be.true;
        expect(switchContainer.hasClass('on')).to.be.true;
    });

});