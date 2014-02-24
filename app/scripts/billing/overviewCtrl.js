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
        Period, Payment, PaymentMethod, PageTracking, rxSortUtil,
        DATE_FORMAT, TRANSACTION_TYPES, TRANSACTION_STATUSES, NON_NUMERIC_REGEX) {

        // Action for clearing the filters
        var clearFilter = function clearFilter () {
                this.filter = {};
            },
            // Action for setting the sort
            sortCol = function sortCol (predicate) {
                return rxSortUtil.sortCol($scope, predicate);
            },
            itemsPerPage = 11,
            setPayment = function setPayment (amount) {
                this.payment.amount = parseFloat(amount).toFixed(2);
            },
            equalCurrency = function equalCurrency (amount, amount2) {
                return parseFloat(amount).toFixed(2) === parseFloat(amount2).toFixed(2);
            },
            postPayment = function postPayment (payment) {
                payment.methodId = $scope.paymentMethods[payment.method].methodId;
                delete payment.method;
                $scope.paymentResult = Payment.post({ id: $routeParams.accountNumber, payment: payment });
            },
            cleanPaymentAmount = function cleanPaymentAmount (newval, oldval) {
                if (newval === oldval) {
                    return;
                }
                $scope.payment.amount = newval.replace(NON_NUMERIC_REGEX, '');
            };
        
        // Create an instance of the PageTracking component
        $scope.pager = PageTracking.createInstance();
        $scope.pager.itemsPerPage = itemsPerPage; // Set the items per page

        // Set the default sort of the transactions
        //$scope.sort = defaultSort;
        $scope.sort = rxSortUtil.getDefault('date', true);
        $scope.sortCol = sortCol;

        // Default Date Format
        $scope.defaultDateFormat = DATE_FORMAT;

        // Assign template actions
        $scope.postPayment = postPayment;
        $scope.setPayment = setPayment;
        $scope.clearFilter = clearFilter;
        $scope.equalCurrency = equalCurrency;

        // Get Account & Transactions Info
        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.transactions = Transaction.list({ id: $routeParams.accountNumber });
        $scope.paymentMethods = PaymentMethod.list({ id: $routeParams.accountNumber });

        $scope.user = 'Test Username';
        // Payment Object for making payment transactions
        $scope.payment = {};
        $scope.filter = {};

        // Replace with service layer calls
        // This is most likely done differently, from an API call maybe? similar concept though.
        $scope.filterData = {
            types: TRANSACTION_TYPES,
            statuses: TRANSACTION_STATUSES,
            periods: Period.list({ id: $routeParams.accountNumber })
        };

        $scope.$watch('payment.amount', cleanPaymentAmount);
    });
