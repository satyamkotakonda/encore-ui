angular.module('billingApp')
    .controller('OverviewCtrl', function ($scope, $routeParams, Transaction,
        Account, PageTracking) {
        
        $scope.pager = PageTracking.createInstance();
        $scope.pager.itemsPerPage = 10;

        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.transactions = Transaction.list({ id: $routeParams.accountNumber });

        var anyValue = { value: undefined, label: 'Any' },
            itemToOption = function (val) {
                if (val.label) {
                    return val;
                } else if (_.isString(val)) {
                    return { value: val, label: val };
                }

                return { value: val[0], label: val[1] };
            };
        
        $scope.transactionTypes = [anyValue, 'Payment', 'Invoice', 'Reversal',
            'Adjustment'].map(itemToOption);
        $scope.transactionStatus = [anyValue, 'Paid', 'Settled', 'Unpaid']
            .map(itemToOption);
        $scope.transactionDate = [anyValue, [ -1, 'Current Period'],
            [ -2, 'Previous Statement'], [ -4, 'Last 3 Statements']]
            .map(itemToOption);

        $scope.sort = {
            field: 'date',
            reverse: true
        };

        console.log($scope.transactionTypes);
    });