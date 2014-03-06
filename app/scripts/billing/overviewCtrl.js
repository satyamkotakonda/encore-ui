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
    .controller('OverviewCtrl', function ($scope, $routeParams, $q, Transaction, Account,
        Period, Payment, PaymentMethod, PageTracking, rxSortUtil,
        DATE_FORMAT, TRANSACTION_TYPES, TRANSACTION_STATUSES, NON_NUMERIC_REGEX) {

        // Action for clearing the filters
        var clearFilter = function () {
                $scope.transactionFilter = {};
            },
            // Action for setting the sort
            sortCol = function (predicate) {
                return rxSortUtil.sortCol($scope, predicate);
            },
            setPaymentInfo = function (data) {
                // Get Current Due from Account Information
                $scope.paymentAmount = parseFloat(data[0].currentDue).toFixed(2);
                // Get the Primary Payment Method's ID
                $scope.paymentMethodId = _(data[1]).where({ isDefault: 'true' })
                                                    .pluck('id').value().join();
            },
            postPayment = function (amount, methodId) {
                $scope.paymentResult = Payment.post({
                    id: $routeParams.accountNumber,
                    payment: {
                        amount: amount,
                        methodId: methodId
                    }
                });
            },
            cleanPaymentAmount = function (newval, oldval) {
                if (newval === oldval) {
                    return;
                }
                $scope.payment.amount = newval.replace(NON_NUMERIC_REGEX, '');
            };

        // Create an instance of the PageTracking component
        $scope.pager = PageTracking.createInstance();

        // Set the default sort of the transactions
        $scope.sort = rxSortUtil.getDefault('date', true);
        $scope.sortCol = sortCol;

        // Default Date Format
        $scope.defaultDateFormat = DATE_FORMAT;

        // Assign template actions
        $scope.postPayment = postPayment;
        $scope.clearFilter = clearFilter;

        // Get Account & Transactions Info
        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.transactions = Transaction.list({ id: $routeParams.accountNumber });
        $scope.paymentMethods = PaymentMethod.list({ id: $routeParams.accountNumber });

        // Set defaults for the make a payment modal.
        $q.all([$scope.account.$promise, $scope.paymentMethods.$promise]).then(setPaymentInfo);

        $scope.user = 'Test Username';

        // Transaction Filter for the list of transactions
        $scope.transactionFilter = {};

        // Replace with service layer calls
        // This is most likely done differently, from an API call maybe? similar concept though.
        $scope.filterData = {
            types: TRANSACTION_TYPES,
            statuses: TRANSACTION_STATUSES,
            periods: Period.list({ id: $routeParams.accountNumber })
        };

        $scope.$watch('payment.amount', cleanPaymentAmount);
    });
