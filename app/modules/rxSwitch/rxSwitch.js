angular.module('rxSwitch', [])
/**
 *
 * @ngdoc directive
 * @name encore.ui.rxSwitch
 * @restrict E
 * @description
 * Displays an on/off switch toggle
 */
.directive('rxSwitch', function () {
    return {
        restrict: 'E',
        templateUrl: '/billing/modules/rxSwitch/templates/rxSwitch.html',
        scope: {
            model: '=',
            loading: '=?',
            disabled: '=?',
            postHook: '=?',
            trueValue: '@?',
            falseValue: '@?',
            trueText: '@?',
            falseText: '@?'
        },
        controller: function ($scope) {
            var getTrueValue = function () {
                    return $scope.trueValue !== undefined ? $scope.trueValue : true;
                },
                getFalseValue = function () {
                    return $scope.falseValue !== undefined ? $scope.falseValue : false;
                };

            $scope.isTrueValue = function (value) {
                return value === getTrueValue();
            };
            $scope.switchValue = function (value) {
                return !$scope.isTrueValue(value) ? getTrueValue() : getFalseValue();
            };
            $scope.update = function (value) {
                if ($scope.disabled) {
                    return;
                }
                var newValue = $scope.switchValue(value);
                if (_.isFunction($scope.postHook)) {
                    $scope.postHook(newValue, value);
                    return;
                }
                $scope.model = newValue;
            };
        }
    };
});
