angular.module('demoApp')
.controller('ApplySimpleCtrl', function ($scope, SelectFilter) {
    $scope.filter = SelectFilter.create({
        properties: ['account', 'status'],
        selected: {
            account: ['A']
        }
    });

    $scope.tickets = [
        { account: 'A', status: 'NEW', description: 'Open a new service ticket.' },
        { account: 'A', status: 'IN_PROGRESS', description: 'Updating server status.' },
        { account: 'B', status: 'TRANSFERRED', description: 'Transferred account to ORD region.' },
        { account: 'B', status: 'VENDOR', description: 'Added new third-party vendor service.' },
        { account: 'A', status: 'TRANSFERRED', description: 'Transferred account to IAD region.' }
    ];
});
