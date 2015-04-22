var rxCollapsePage = require('../rxCollapse.page').rxCollapse;
var exercise = require('../rxCollapse.exercise');

describe('rxCollapse', function () {
    var rxCollapse;

    before(function () {
        demoPage.go('#/component/rxCollapse');
        rxCollapse = rxCollapsePage.initialize($('#rxCollapse'));
    });

    it('should show element', function () {
        expect(rxCollapse.isDisplayed()).to.eventually.be.true;
    });

    describe('exercises', exercise.rxCollapse());

});
