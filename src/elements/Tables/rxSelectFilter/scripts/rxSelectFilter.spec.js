describe('rxSelectFilter', function () {
    var scope, compile, template;

    beforeEach(function () {
        module('encore.ui.rxSelectFilter');
        module('encore.ui.rxForm');
        module('templates/rxSelectFilter.html');
        module('templates/rxFieldName.html');

        inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            compile = $compile;
        });
    });

    describe('directive:rxSelectFilter', function () {
        describe('rxForm hierarchy validation', function () {
            var createDirective;

            before(function () {
                createDirective = function () {
                    helpers.createDirective(template, compile, scope);
                };
            });

            describe('rx-select-filter', function () {
                describe('when nested within rx-form-section', function () {
                    before(function () {
                        template = '<form rx-form>' +
                            '<rx-form-section>' +
                                '<rx-select-filter></rx-select-filter>' +
                            '</rx-form-section>' +
                        '</form>';
                    });

                    it('should not error', function () {
                        expect(createDirective).to.not.throw(Error);
                    });
                });

                describe('when not nested within rx-form-section', function () {
                    before(function () {
                        template = '<rx-select-filter></rx-select-filter>';
                    });

                    it('should error', function () {
                        expect(createDirective).to.throw(Error);
                    });
                });
            });//rx-select-filter
        });
    });
});
