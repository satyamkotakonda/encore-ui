angular.module('encore.ui.rxPopover', [])
/**
 *
 * @ngdoc directive
 * @name encore.ui.rxPopover:rxPopover
 * @restrict E
 * @description
 * Container for both the trigger and content of the popover
 */
 .directive('rxPopover', function () {
    var positions = ['left','right','top','bottom'];
    return {
        restrict: 'E',
        template: '<div class="rx-popover rx-popover-{{position}}" ng-transclude></div>',
        transclude: true,
        scope: {
            position: '@'
        },
        controller: function ($scope) {
            if (!_.contains(positions, $scope.position)) {
                throw new TypeError('Cannot create popover with position of "' + $scope.position + '".  ' +
                                    'Expected: ' + positions.join(', '));
            }
            this.getPosition = function () {
                return $scope.position;
            };
        }
    };
})
/**
 *
 * @ngdoc directive
 * @name encore.ui.rxPopover:rxPopoverTrigger
 * @restrict E
 * @description
 * Container for the trigger of the popover to live in
 */
.directive('rxPopoverTrigger', function () {
    return {
        require: '^rxPopover',
        restrict: 'E',
        template: '<div class="rx-popover-trigger" ng-mouseover="show()" ng-mouseout="hide()" ng-transclude></div>',
        transclude: true,
        scope: false,
        link: function (scope) {
            scope.active = false;
            scope.show = function () {
                scope.active = true;
            };
            scope.hide = function () {
                scope.active = false;
            };
        }
    };
})
/**
 *
 * @ngdoc directive
 * @name encore.ui.rxPopover:rxPopoverContent
 * @restrict E
 * @description
 * Houses the content of the popover, must calculate
 * vertical positioning from the dimensions of the content
 * and the dimensions of the trigger.
 */
.directive('rxPopoverContent', function () {
    return {
        require: '^rxPopover',
        restrict: 'E',
        // Need to make path relative before moving it to encore
        templateUrl: '/modules/rxPopover/templates/rxPopover.html',
        transclude: true,
        scope: false,
        link: function (scope, el, attrs, popoverCtrl) {
            var position = popoverCtrl.getPosition(),
                content, trigger, height, triggerHeight,
                top;

            if (position === 'left' || position === 'right') {
                content = el.children('div:first');
                trigger = el.parent().find('rx-popover-trigger').children('div:first');

                triggerHeight = trigger.prop('offsetHeight');
                height = content.prop('offsetHeight');
                top = Math.floor((height - triggerHeight) / -2);

                content.css('top', top + 'px');
            }
        }
    };
});
