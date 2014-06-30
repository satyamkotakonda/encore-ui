angular.module('billingApp')
    /**
    * @ngdoc object
    * @name encore:controller.TransactionsDetailsCtrl
    * @description
    * The Controller which displays details of a user's billing transaction.
    *
    * @requires $scope - The $scope variable for interacting with the UI.
    * @requires $routeParams - AngularJS service which provides access to route paramters
    * @requires billingSvcs.Transaction - Service for CRUD operations for the Transaction resource.
    * @requires billingSvcs.Account - Service for CRUD operations for the Account resource.
    * @requires encore.rxSortableColumn:rxSortUtil - Service which provides column sort related functions
    * @requires billingSvcs.DATE_FORMAT - Constant that defines the default format for dates
    *
    * @example
    * <pre>
    * .controller('TransactionsCtrl', function ($scope, $routeParams, $q, Transaction, Account, Balance,
    *   Period, Payment, PaymentMethod, PageTracking, rxSortUtil, rxPromiseNotifications,
    *   DefaultPaymentMethodFilter,
    *   DATE_FORMAT, TRANSACTION_TYPES, TRANSACTION_STATUSES, STATUS_MESSAGES)
    * </pre>
    */
    .controller('TransactionDetailsCtrl', function ($scope, $routeParams, Transaction, Account,
        Balance, PaymentMethod, rxSortUtil, DATE_FORMAT) {

        // Action for setting the sort
        var sortCol = function (predicate) {
            return rxSortUtil.sortCol($scope, predicate);
        };

        // Pass the account number for building links
        $scope.accountNumber = $routeParams.accountNumber;

        // Set the default sort of the transactions
        $scope.sort = rxSortUtil.getDefault('date', true);
        $scope.sortCol = sortCol;

        // Default Date Format
        $scope.defaultDateFormat = DATE_FORMAT;

        $scope.account = Account.get({ accountNumber: $routeParams.accountNumber });
        $scope.balance = Balance.get({ accountNumber: $routeParams.accountNumber });

        // Get Account & Transactions Info
        $scope.transaction = Transaction.getDetails(
            $routeParams.accountNumber,
            $routeParams.transactionType,
            $routeParams.transactionNumber
        );

        if ($routeParams.transactionType === 'refunds') {
            $scope.transaction.$promise.then(function (transaction) {
                PaymentMethod.get({
                    accountNumber: $routeParams.accountNumber,
                    methodId: transaction.refund.methodId
                }, function (method) {
                    $scope.transaction.method = method;
                });
            });
        }

        if ($routeParams.transactionType === 'payments') {
            $scope.transaction.$promise.then(function (transaction) {
                PaymentMethod.get({
                    accountNumber: $routeParams.accountNumber,
                    methodId: transaction.payment.methodId
                }, function (method) {
                    $scope.transaction.method = method;
                });
            });
        }
    });
