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
.controller('TransactionDetailsCtrl', function ($scope, $filter, $document, $timeout, $routeParams,
                                                Transaction, Account, rxBreadcrumbsSvc, Balance,
                                                PaymentMethod, rxNotify, rxSortUtil, DATE_FORMAT) {
        function setBreadcrumbs () {
            // Get non-plural transaction type from routeParams
            var tranType = $routeParams.transactionType.slice(0, -1);
            var typeTitle = $filter('rxCapitalize')(tranType);
            var refNumTitle = _.isUndefined($scope.transaction[tranType]) ?
                ' Details' : ' #' + $scope.transaction[tranType].tranRefNum;
            // Get current breadcrumbs
            var currentCrumbs = rxBreadcrumbsSvc.getAll();
            // Remove hashKey so ngRepeat doesn't throw up
            var newCrumbs = _.map(currentCrumbs, function (obj) { return _.omit(obj, '$$hashKey'); });
            // Add details to breadcrumbs
            newCrumbs.push({ name: typeTitle + refNumTitle });
            // Set breadcrumbs and slice off the default "Home" so it doesn't duplicate
            rxBreadcrumbsSvc.set(newCrumbs.slice(1));
        }

        // Action for setting the sort
        var sortCol = function (predicate) {
            return rxSortUtil.sortCol($scope, predicate);
        };

        // Pass the account number for building links
        $scope.accountNumber = $routeParams.accountNumber;

        // Set the default sort of the transactions
        $scope.sort = rxSortUtil.getDefault('tranDate', true);
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

        var getFilename = function (type) {
            return $routeParams.accountNumber + '_Invoice_' +
                $scope.transaction.invoice.tranRefNum + '_' +
                $filter('date')($scope.transaction.invoice.coverageStartDate, 'yyyy-MM-dd') + type;
        };

        $scope.downloadPdf = function () {
            return Transaction.getPdf(
                $routeParams.accountNumber,
                $routeParams.transactionType,
                $routeParams.transactionNumber,
                function (data) {
                    window.saveAs(data.response, getFilename('.pdf'));
                },
                function (config) {
                    if (config.status === 404) {
                        rxNotify.add('Invoice PDF Not Found', {
                            type: 'error'
                        });
                    }
                }
            );
        };

        $scope.downloadCsv = function () {
            return Transaction.getCsv(
                $routeParams.accountNumber,
                $routeParams.transactionType,
                $routeParams.transactionNumber,
                function (data) {
                    window.saveAs(data.response, getFilename('.csv'));
                },
                function (config) {
                    if (config.status === 404) {
                        rxNotify.add('Invoice CSV Not Found', {
                            type: 'error'
                        });
                    }
                }
            );
        };

        // Set breadcrumbs once we have transaction information
        $scope.transaction.$promise.finally(setBreadcrumbs);

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
