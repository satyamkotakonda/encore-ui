/* jshint node: true */

describe('rxSwitch', function () {
    var scope, compile, rootScope, directiveScope, el, switchContainer, disabledEL, customEL, postHookEL,
        validTemplate = '<rx-switch model="model"></rx-switch>',
        disabledTemplate = '<rx-switch model="model" disabled="true"></rx-switch>',
        postHookTemplate = '<rx-switch model="model" post-hook="countMe(newVal, oldVal)"></rx-switch>',
        customTemplate = '<rx-switch model="customModel" true-value="TEST" false-value="TEST-FALSY"></rx-switch>';

    beforeEach(function () {
        module('rxSwitch');
        module('modules/rxSwitch/templates/rxSwitch.html');

        inject(function ($rootScope, $compile, $templateCache) {
            var template = $templateCache.get('modules/rxSwitch/templates/rxSwitch.html');
            $templateCache.put('/billing/modules/rxSwitch/templates/rxSwitch.html', template);

            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            scope.countMe = sinon.stub();

            scope.countMe.withArgs('TEST-FALSY', 'TEST').returns('custom');
            scope.model = true;
            scope.customModel = 'TEST';
        });

        el = helpers.createDirective(validTemplate, compile, scope);
        el = helpers.getChildDiv(el, 'rx-switch-container', 'class');

        disabledEL = helpers.createDirective(disabledTemplate, compile, scope);
        disabledEL = helpers.getChildDiv(disabledEL, 'rx-switch-container', 'class');

        customEL = helpers.createDirective(customTemplate, compile, scope);
        customEL = helpers.getChildDiv(customEL, 'rx-switch-container', 'class');

        postHookEL = helpers.createDirective(postHookTemplate, compile, scope);
        postHookEL = helpers.getChildDiv(postHookEL, 'rx-switch-container', 'class');
    });

    afterEach(function () {
        el = null;
        disabledEL = null;
        directiveScope = null;
        customEL = null;
        postHookEL = null;
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

        expect(switchContainer.hasClass('on')).to.be.true;

        expect(scope.model).to.be.true;
        directiveScope.update(scope.model);
        scope.$apply();
        expect(scope.model).to.be.false;

        expect(switchContainer.hasClass('on')).to.be.false;
        sinon.assert.notCalled(scope.countMe);

        expect(scope.model).to.be.false;
        directiveScope.update(scope.model);
        scope.$apply();
        expect(scope.model).to.be.true;

        expect(switchContainer.hasClass('on')).to.be.true;
    });

    it('should render disabled template correctly', function () {
        switchContainer = helpers.getChildDiv(disabledEL, 'rx-switch', 'class');
        expect(switchContainer.attr('disabled')).to.not.be.empty;
    });

    it('should NOT switch the model value when switch is called (disabled)', function () {
        switchContainer = helpers.getChildDiv(disabledEL, 'rx-switch', 'class');
        directiveScope = switchContainer.scope();

        expect(scope.model).to.be.true;
        directiveScope.update(scope.model);
        scope.$apply();
        expect(scope.model).to.be.true;

        expect(switchContainer.hasClass('on')).to.be.true;
    });

    it('should render custom values template correctly', function () {
        switchContainer = helpers.getChildDiv(customEL, 'rx-switch', 'class');
        directiveScope = switchContainer.scope();

        expect(scope.customModel).to.be.eq('TEST');
        directiveScope.update(scope.customModel);
        scope.$apply();
        expect(scope.customModel).to.be.eq('TEST-FALSY');
    });

    it('should call posthook when updating value', function () {
        switchContainer = helpers.getChildDiv(postHookEL, 'rx-switch', 'class');
        directiveScope = switchContainer.scope();

        expect(scope.model).to.be.true;
        directiveScope.update(scope.model);
        scope.$apply();
        expect(scope.model).to.be.false;
        sinon.assert.calledOnce(scope.countMe);
    });
});