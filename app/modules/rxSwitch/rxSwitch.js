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
        templateUrl: 'templates/rxSwitch.html',
        scope: {
            model: '=',
            readonly: '@'
        },
        controller: function ($scope) {
            $scope.switch = function (model) {
                if ($scope.readonly && $scope.readonly === 'true') {
                    return;
                }
                $scope.model = !!!model;
            };
        }
    };
});
