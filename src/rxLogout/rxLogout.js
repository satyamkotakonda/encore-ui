angular.module('encore.ui.rxLogout', [])
.service('Auth', function () {
    // temp hack to get rid of error
    return {
        logout: function (success) {
            return success;
        }
    };
})
.directive('rxLogout', function ($rootScope, Auth) {
    return {
        restrict: 'A',
        controller: function ($scope) {
            var success = function () {
                // fire event to notify auth service about logout
                $rootScope.$broadcast('event:auth-loginRequired');
            };

            // TODO: Handle failure
            $scope.logout = function () {
                // temp hack to get rid of error
                Auth.logout(success);
            };
        },
        link: function (scope, element) {
            var handleClick = function (ev) {
                if (ev && ev.preventDefault) {
                    ev.preventDefault();
                }

                scope.logout();
            };

            element.bind('click', handleClick);
        }
    };
});