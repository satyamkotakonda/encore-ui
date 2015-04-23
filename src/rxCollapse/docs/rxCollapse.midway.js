var exercise = require('../rxCollapse.exercise');

describe('rxCollapse', function () {
    var rxCollapse;

    before(function () {
        demoPage.go('#/component/rxCollapse');
    });

    describe('exercises', exercise.rxCollapse());

});
