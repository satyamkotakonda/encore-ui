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
        templateUrl: '/modules/rxSwitch/templates/rxSwitch.html',
        scope: {
            model: '=',
            readonly: '@'
        },
        controller: function ($scope) {
            $scope.invert = function (model) {
                if ($scope.readonly && $scope.readonly === 'true') {
                    return;
                }
                $scope.model = !model;
            };
        }
    };
});
