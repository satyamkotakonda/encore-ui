angular.module('billingApp')
    .controller('OverviewCtrl', function ($scope, $routeParams, Transaction,
        Account, PageTracking) {
        
        $scope.pager = PageTracking.createInstance();
        $scope.pager.itemsPerPage = 10;

        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.transactions = Transaction.list({ id: $routeParams.accountNumber });

        var anyValue = {
            value: undefined,
            label: 'Any'
        };
        // This is most likely done differently, from an API call maybe? similar concept though.
        $scope.transactionTypes = [anyValue, 'Payment', 'Invoice', 'Reversal', 'Adjustment'];
        $scope.transactionStatus = [anyValue, 'Paid', 'Settled', 'Unpaid'];
        $scope.transactionDate = [anyValue, [ -1, 'Current Period'],
            [ -2, 'Previous Statement'], [ -4, 'Last 3 Statements']];

        $scope.sort = {
            field: 'date',
            reverse: true
        };
    });