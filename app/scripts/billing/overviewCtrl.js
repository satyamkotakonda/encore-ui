angular.module('billingApp')
    /**
    * @ngdoc object
    * @name encore:controller.OverviewCtrl
    * @description
    * The Controller which displays an overview of a users' billing info.
    *
    * @requires $scope - The $scope variable for interacting with the UI.
    * @requires $routeParams - AngularJS service which provides access to route paramters
    * @requires $q - AngularJS q implementation for working with promises
    * @requires billingSvcs.Transaction - Service for CRUD operations for the Transaction resource.
    * @requires billingSvcs.Account - Service for CRUD operations for the Account resource.
    * @requires billingSvcs.Period - Service for CRUD operations for the Period resource.
    * @requires billingSvcs.Payment - Service for CRUD operations for the Payment resource.
    * @requires billingSvcs.PaymentMethod - Service for CRUD operations for the PaymentMethod resource.
    * @requires encore.paginate:PageTracking - Service which creates an object for pagination.
    * @requires encore.rxSortableColumn:rxSortUtil - Service which provides column sort related functions
    * @requires encore.rxNotify:rxPromiseNotifications - Service which provides notifications for promises
    * @requires billingSvcs.DefaultPaymentMethodFilter - Service which facilitates retrieval of default payment method
    * @requires billingSvcs.DATE_FORMAT - Constant that defines the default format for dates
    * @requires billingSvcs.TRANSACTION_TYPES - Constant list of the different types of transactions
    * @requires billingSvcs.TRANSACTION_STATUSES - Constant list of different transaction statuses
    * @requires billingSvcs.STATUS_MESSAGES - Constant object defining messaging to be used throughout the app
    *
    * @example
    * <pre>
    * .controller('OverviewCtrl', function ($scope, $routeParams, Transaction,
    *       Account, Period, PageTracking)
    * </pre>
    */
    .controller('OverviewCtrl', function ($scope, $routeParams, $q, Transaction, Account,
        Period, Payment, PaymentMethod, PageTracking, rxSortUtil, rxPromiseNotifications,
        DefaultPaymentMethodFilter,
        DATE_FORMAT, TRANSACTION_TYPES, TRANSACTION_STATUSES, STATUS_MESSAGES) {

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
            setPaymentInfo = function () {
                // Get Current Due from Account Information
                $scope.paymentAmount = $scope.account.currentDue;

                // Get the Primary Payment Method's ID
                $scope.paymentMethod = DefaultPaymentMethodFilter($scope.paymentMethods);
            },
            postPayment = function (amount, methodId) {
                $scope.paymentResult = Payment.post({
                    id: $routeParams.accountNumber,
                    payment: {
                        amount: amount,
                        methodId: methodId
                    }
                });
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
        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.transactions = Transaction.list({ id: $routeParams.accountNumber });
        $scope.paymentMethods = PaymentMethod.list({ id: $routeParams.accountNumber });
        $scope.billingPeriods = Period.list({ id: $routeParams.accountNumber });

        // Group the promises in $q.all for a global error message if any errors occur
        rxPromiseNotifications.add($q.all([
            $scope.account.$promise,
            $scope.transactions.$promise,
            $scope.paymentMethods.$promise,
            $scope.billingPeriods.$promise
        ]), {
            loading: '',
            error: STATUS_MESSAGES.overview.error + ' Message: "{{_.first(data).message}}"'
        }, 'overviewPage');

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
            periods: $scope.billingPeriods
        };

    });
