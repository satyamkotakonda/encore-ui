angular.module('billingApp')
    /**
    * @ngdoc object
    * @name encore:controller.TransactionsCtrl
    * @description
    * The Controller which displays an overview of a users' billing info.
    *
    * @requires $scope - The $scope variable for interacting with the UI.
    * @requires $routeParams - AngularJS service which provides access to route paramters
    * @requires $q - AngularJS q implementation for working with promises
    * @requires billingSvcs.Transaction - Service for CRUD operations for the Transaction resource.
    * @requires billingSvcs.Account - Service for CRUD operations for the Account resource.
    * @requires billingSvcs.Balance - Service for CRUD operations for the Balance resource.
    * @requires billingSvcs.Period - Service for CRUD operations for the Period resource.
    * @requires billingSvcs.Payment - Service for CRUD operations for the Payment resource.
    * @requires billingSvcs.PaymentMethod - Service for CRUD operations for the PaymentMethod resource.
    * @requires encore.paginate:PageTracking - Service which creates an object for pagination.
    * @requires encore.rxSortableColumn:rxSortUtil - Service which provides column sort related functions
    * @requires encore.rxNotify:rxPromiseNotifications - Service which provides notifications for promises
    * @requires billingSvcs.DefaultPaymentMethodFilter - Filter which facilitates retrieval of default payment method
    * @requires billingSvcs.DATE_FORMAT - Constant that defines the default format for dates
    * @requires billingSvcs.TRANSACTION_TYPES - Constant list of the different types of transactions
    * @requires billingSvcs.TRANSACTION_STATUSES - Constant list of different transaction statuses
    * @requires billingSvcs.STATUS_MESSAGES - Constant object defining messaging to be used throughout the app
    *
    * @example
    * <pre>
    * .controller('TransactionsCtrl', function ($scope, $routeParams, $q, Transaction, Account, Balance,
    *   Period, Payment, PaymentMethod, PageTracking, rxSortUtil, rxPromiseNotifications,
    *   DefaultPaymentMethodFilter,
    *   DATE_FORMAT, TRANSACTION_TYPES, TRANSACTION_STATUSES, STATUS_MESSAGES)
    * </pre>
    */
    .controller('TransactionsCtrl', function (
        $scope, $routeParams, $q, Transaction, Account, Balance,
        Period, Payment, PaymentMethod, PageTracking, PaymentInfo, BillInfo,
        rxSortUtil, rxPromiseNotifications, DefaultPaymentMethodFilter, AccountNumberUtil,
        DATE_FORMAT, TRANSACTION_TYPES, TRANSACTION_STATUSES, STATUS_MESSAGES) {

        $scope.accountNumber = $routeParams.accountNumber;
        var defaultParams = { accountNumber: $routeParams.accountNumber };

        // Action for clearing the filters
        var resetPager = function () {
                $scope.pager.pageNumber = 0;
            },
            clearFilter = function () {
                $scope.transactionFilter = {};
                resetPager();
            },
            // Action for setting the sort
            sortCol = function (predicate) {
                return rxSortUtil.sortCol($scope, predicate);
            },
            setPaymentInfo = function (result) {
                // Get Current Due from Account Information, first promise of $q.all
                $scope.paymentAmount = result[0].amountDue;

                // Get the Primary Payment Method's ID, second promise of $q.all
                $scope.paymentMethod = DefaultPaymentMethodFilter(result[1]);
            },
            postPayment = function (amount, methodId) {
                $scope.paymentResult = Payment.makePayment($routeParams.accountNumber, amount, methodId);
                rxPromiseNotifications.add($scope.paymentResult.$promise, {
                    loading: STATUS_MESSAGES.payment.load,
                    success: STATUS_MESSAGES.payment.success,
                    error: STATUS_MESSAGES.payment.error
                }, 'makePayment');
            };

        // Create an instance of the PageTracking component
        $scope.pager = PageTracking.createInstance();
        $scope.resetPager = resetPager;

        // Set the default sort of the transactions
        $scope.sort = rxSortUtil.getDefault('date', true);
        $scope.sortCol = sortCol;

        // Default Date Format
        $scope.defaultDateFormat = DATE_FORMAT;

        // Assign template actions
        $scope.postPayment = postPayment;
        $scope.clearFilter = clearFilter;

        // Get Account & Transactions Info
        $scope.billInfo = BillInfo.get(defaultParams);
        $scope.paymentInfo = PaymentInfo.get(defaultParams);
        $scope.account = Account.get(defaultParams);
        $scope.balance = Balance.get(defaultParams);
        $scope.transactions = Transaction.list(defaultParams);
        $scope.paymentMethods = PaymentMethod.list(defaultParams);
        $scope.billingPeriods = Period.list(defaultParams);

        // Convert transactions into format suitable for CSV conversion
        $scope.transactions.$promise.then(function (data) {
            var resp = JSON.parse(angular.toJson(data));
            // Get headers for CSV based on object keys and remove Atom link header
            $scope.csvHeaders = _.without(_.keys(resp[0]), 'link');
            // Strip Atom link from response and convert to array for ng-csv
            $scope.transactionsCsv = _.map(resp, function (obj) { return _.omit(obj, 'link'); });
        });

        // Group the promises in $q.all for a global error message if any errors occur
        rxPromiseNotifications.add($q.all([
            $scope.billInfo.$promise,
            $scope.paymentInfo.$promise,
            $scope.balance.$promise,
            $scope.transactions.$promise,
            $scope.paymentMethods.$promise,
            $scope.billingPeriods.$promise
        ]), {
            loading: '',
            error: STATUS_MESSAGES.transactions.error + ' Message: "{{_.first(data).message}}"'
        }, 'transactionsPage');

        // Set defaults for the make a payment modal.
        $q.all([$scope.balance.$promise, $scope.paymentMethods.$promise]).then(setPaymentInfo);

        // Transaction Filter for the list of transactions
        $scope.transactionFilter = {};

        // Replace with service layer calls
        // This is most likely done differently, from an API call maybe? similar concept though.
        $scope.filterData = {
            types: TRANSACTION_TYPES,
            statuses: TRANSACTION_STATUSES,
            periods: $scope.billingPeriods
        };

    });
