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
    .controller('OverviewCtrl', function ($scope, $routeParams, $q, $filter, Transaction, Account,
        Period, Payment, PaymentMethod, PageTracking, rxSortUtil,
        DATE_FORMAT, TRANSACTION_TYPES, TRANSACTION_STATUSES, NON_NUMERIC_REGEX) {
        var filter = $filter('filter');

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
                $scope.payment.amount = parseFloat(data[0].currentDue).toFixed(2);
                // Get the Primary Payment Method's ID
                $scope.payment.methodId = _(data[1]).where({ isDefault: 'true' })
                                                    .pluck('id').value().join();
                setPaymentMethodFilter('default');
            },
            postPayment = function (payment) {
                payment = { amount: payment.amount, methodId: payment.methodId };
                $scope.paymentResult = Payment.post({ id: $routeParams.accountNumber, payment: payment });
            },
            cleanPaymentAmount = function (newval, oldval) {
                if (newval === oldval) {
                    return;
                }
                $scope.payment.amount = newval.replace(NON_NUMERIC_REGEX, '');
            },
            setPaymentMethodFilter = function (filterVal) {
                $scope.paymentMethodType = filterVal;
                $scope.paymentMethodChoice = filter($scope.paymentMethods, $scope.paymentMethodInfo[filterVal].filter);
                if (filterVal === 'default') {
                    if ($scope.paymentMethodChoice[0].paymentCard) {
                        filterVal = 'card';
                    } else if ($scope.paymentMethodChoice[0].electronicCheck) {
                        filterVal = 'ach';
                    } else if ($scope.paymentMethodChoice[0].invoice) {
                        filterVal = 'invoice';
                    }
                }
                $scope.paymentMethodColumns = $scope.paymentMethodInfo[filterVal].columns;
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

        // Payment Object for making payment transactions
        $scope.paymentMethodType = null;
        $scope.paymentMethodInfo = {
            'default': {
                filter: {
                    'isDefault': 'true'
                }
            },
            'card': {
                filter: {
                    'paymentCard': '!!'
                },
                columns: [{
                    'label': 'Card Type',
                    'key': 'paymentCard.cardType'
                },{
                    'label': 'Ending In',
                    'key': 'paymentCard.accountNumber'
                },{
                    'label': 'Cardholder Name',
                    'key': 'paymentCard.cardHolderName'
                },{
                    'label': 'Exp. Date',
                    'key': 'paymentCard.cardExpirationDate'
                }]
            },
            'ach': {
                filter: {
                    'electronicCheck': '!!'
                },
                columns: [{
                    'label': 'Account Type',
                    'key': 'electronicCheck.accountType'
                },{
                    'label': 'Account #',
                    'key': 'electronicCheck.accountNumber'
                },{
                    'label': 'Routing #',
                    'key': 'electronicCheck.routingNumber'
                },{
                    'label': 'Name on Account',
                    'key': 'electronicCheck.accountHolderName'
                }]
            },
            'invoice': {
                filter: {
                    'invoice': '!!'
                },
                columns: []
            }
        };
        $scope.setPaymentMethodFilter = setPaymentMethodFilter;
        $scope.payment = {};
        
        
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
        window.w = $scope;
    });
