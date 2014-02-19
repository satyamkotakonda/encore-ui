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
        Period, PaymentMethod, PageTracking, DATE_FORMAT, TRANSACTION_TYPES, TRANSACTION_STATUSES) {

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

        // Default Date Format
        $scope.defaultDateFormat = DATE_FORMAT;

        // Assign template actions
        $scope.clearFilter = clearFilter;
        $scope.sortField = sortField;

        // Get Account & Transactions Info
        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.transactions = Transaction.list({ id: $routeParams.accountNumber });
        $scope.paymentMethods = PaymentMethod.list({ id: $routeParams.accountNumber });

        $scope.user = 'Test Username';

        // Replace with service layer calls
        // This is most likely done differently, from an API call maybe? similar concept though.
        $scope.filterData = {
            types: TRANSACTION_TYPES,
            statuses: TRANSACTION_STATUSES,
            periods: Period.list({ account: $routeParams.accountNumber })
        };
    });
