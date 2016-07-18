angular.module('demoApp')
.controller('rxSelectFilterCtrl', function ($scope, SelectFilter) {
    $scope.filter = SelectFilter.create({
        properties: ['account', 'status'],
        selected: {
            account: ['A']
        }
    });

    $scope.tickets = [
        { account: 'A', status: 'NEW', description: 'A new ticket' },
        { account: 'A', status: 'IN_PROGRESS', description: 'Fix all the bugs' },
        { account: 'B', status: 'TRANSFERRED', description: 'Don\'t stop believing' },
        { account: 'B', status: 'VENDOR', description: 'Hold on to that feeling' },
        { account: 'A', status: 'TRANSFERRED', description: 'qwertyuiop' }
    ];
});
