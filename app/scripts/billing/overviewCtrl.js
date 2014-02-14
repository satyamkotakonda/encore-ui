angular.module('billingApp')
    .controller('OverviewCtrl', function ($scope, $routeParams, Transaction,
        Account, PageTracking) {

        // Action for clearing the filters
        var clearFilter = function clearFilter () {
                this.filter = undefined;
            },
            // Action for setting the sort
            sortField = function sortField (field, reverse) {
                this.sort.field = field;
                this.sort.reverse = reverse;
            },
            itemsPerPage = 11,
            defaultSort = {
                field: 'date',
                reverse: true
            };

        // Create an instance of the PageTracking component
        $scope.pager = PageTracking.createInstance();
        $scope.pager.itemsPerPage = itemsPerPage; // Set the items per page

        // Set the default sort of the transactions
        $scope.sort = defaultSort;

        // Assign template actions
        $scope.clearFilter = clearFilter;
        $scope.sortField = sortField;

        // Get Account & Transactions Info
        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.transactions = Transaction.list({ id: $routeParams.accountNumber });

        // This might not be needed in the future with a newer version of rxForm, 
        // until so, this could enhance rx-form-select
        var itemToOption = function itemToOption (val) {
                if (val.hasOwnProperty('value') && val.hasOwnProperty('label')) {
                    return val;
                }
                if (Object.prototype.toString.call(val) === '[object Array]' && val.length === 2) {
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
            getFormDropdownList = function getFormDropdownList (list) {
                list = [{ value: undefined, label: 'Any' }].concat(list).map(itemToOption);
                return function () {
                    return list;
                };
            },
            transactionData =  {
                types: getFormDropdownList(['Payment', 'Invoice', 'Reversal', 'Adjustment']),
                status: getFormDropdownList(['Paid', 'Settled', 'Unpaid']),
                periods: getFormDropdownList([[ -1, 'Current Period'], [ -2, 'Previous Statement'],
                    [ -4, 'Last 3 Statements'], [ -7, 'Last 6 Statements']])
            };

        // Replace with service layer calls
        // This is most likely done differently, from an API call maybe? similar concept though.
        $scope.transactionData = {
            types: transactionData.types(),
            status: transactionData.status(),
            periods: Transaction.periods({ id: $routeParams.accountNumber })
        };

        $scope.transactionData.periods.$promise.then(function (data) {
            $scope.transactionData.periods = _.map(data.billingPeriods.billingPeriod, function (period) {
                return {
                    label: (period.current === true || period.current === 'true') ?
                        'Current Period' :
                        'Periond Ending On: ' + moment(period.endDate).format('MM / DD / YYYY'),
                    value: period.startDate
                };
            });
        });
    });
