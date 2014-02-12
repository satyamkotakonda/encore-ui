angular.module('billingApp')
    .controller('OverviewCtrl', function ($scope, PageTracking){
        // For generating Dummy Data
        var itemToOption = function itemToOption(val) {
                if(val.hasOwnProperty('value') && val.hasOwnProperty('label')) {
                    return val;
                }
                if(Object.prototype.toString.call(val) === '[object Array]' && val.length === 2) {
                    return {
                        value: val[0],
                        label: val[1]
                    };
                }
                return {
                    value: val,
                    label: val
                };
            },
            randomDate = function randomDate(start, end) {
                return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            },
            anyValue = {
                value: undefined,
                label: 'Any'
            },
            transactionTypes = [anyValue, 'Payment', 'Invoice', 'Reversal', 'Adjustment'],
            transactionStatus = [anyValue, 'Paid', 'Settled', 'Unpaid'],
            transactionDate = [anyValue, [-1, 'Current Period'], [-2, 'Previous Statement'], [-4, 'Last 3 Statements'],
                [-7, 'Last 6 Statements']],
            currentDate = new Date(),
            periodStart = new Date((currentDate.getFullYear()-(Math.random() * 5)), ((Math.random()*12)+1), 1),
            accountInfo = {
                id: 1020121,
                balance: 380,
                pastDue: 180,
                currentDue: 200,
                currencyType: 'USD',
                terms: 'Due Upon Receipt',
                cycle: 12,
                paperless: false,
                name: 'hub_cap1589'
            },
            txn = [], x, c, a = 0, t, s;

        for(x = 0, c = 1000; x < c; x += 1) {
            a = (15 * (Math.random() + x/10)) * (Math.random() < 0.5 ? -1 : 1);
            t = transactionTypes[parseInt(Math.random() * transactionTypes.length-1, 10)+1];
            s = transactionStatus[parseInt(Math.random() * transactionStatus.length-1, 10)+1];
            txn.push({
                reference: (a+Math.random()*100000000).toFixed(0),
                date: randomDate(periodStart, currentDate),
                type: t,
                status: s,
                amount: a,
                balance: (x > 0) ? txn[x-1].balance + a : 0
            });
        }
        // Dummy Data Done

        $scope.pager = PageTracking.createInstance();
        $scope.pager.itemsPerPage = 11;

        $scope.account = accountInfo;
        $scope.transactions = txn;
        
        // This is most likely done differently, from an API call maybe? similar concept though.
        $scope.transactionTypes = transactionTypes.map(itemToOption);
        $scope.transactionStatus = transactionStatus.map(itemToOption);
        $scope.transactionDate = transactionDate.map(itemToOption);

        $scope.sort = {
            field: 'date',
            reverse: true
        };

        $scope.filterTransactionsByDate = function filterTransactionsByDate(row) {
            if($scope.filterDate !== undefined) {
                var date = row.date,
                    startDate = new Date(currentDate.getFullYear(),
                            currentDate.getMonth() + parseInt($scope.filterDate, 10), 1);
                if(startDate > date) {
                    return false;
                }
            }
            return true;
        };
    });