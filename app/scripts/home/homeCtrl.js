angular.module('billingApp')
    .controller('HomeCtrl', function ($scope, Salutation) {
        $scope.hello = Salutation.get({ name: 'Developer' });
    });
