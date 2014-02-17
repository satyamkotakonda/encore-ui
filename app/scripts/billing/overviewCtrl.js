angular.module('billingApp')
    /**
    * @ngdoc object
    * @name encore:controller.OverviewCtrl
    * @description
    * The Controller which displays an overview of a users' billing info.
    *
    * @requires $scope - The $scope variable for interacting with the UI.
    * @requires $routeParams - AngularJS service which provides access to route paramters
    * @requires billingSvcs.Transaction - Service for CRUD operations for the Transaction resource.
    * @requires billingSvcs.Account - Service for CRUD operations for the Account resource.
    * @requires billingSvcs.Period - Service for CRUD operations for the Period resource.
    * @requires encore.paginate:PageTracking - Service which creates an object for pagination.
    * 
    * @example
    * <pre>
    * .controller('OverviewCtrl', function ($scope, $routeParams, Transaction,
    *       Account, Period, PageTracking)
    * </pre>    
    */
    .controller('OverviewCtrl', function ($scope, $routeParams, Transaction, Account,
        Period, PageTracking) {

        var defaultDateFormat = 'MM / dd / yyyy',
            // Action for clearing the filters
            clearFilter = function clearFilter () {
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

        // Default Date Format
        $scope.defaultDateFormat = defaultDateFormat;

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
                } else if (Object.prototype.toString.call(val) === '[object Array]' && val.length === 2) {
                    return { value: val[0], label: val[1] };
                }
                return { value: val, label: val };
            },
            dataToOptions = function dataToOptions (data) {
                return _.map([{ value: undefined, label: 'Any' }].concat(data), itemToOption);
            },
            filterData = {
                types: dataToOptions(['Payment', 'Invoice', 'Reversal', 'Adjustment']),
                status: dataToOptions(['Paid', 'Settled', 'Unpaid'])
            };

        // Replace with service layer calls
        // This is most likely done differently, from an API call maybe? similar concept though.
        $scope.filterData = {
            types: filterData.types,
            status: filterData.status,
            periods: Period.list({ account: $routeParams.accountNumber })
        };
    });
