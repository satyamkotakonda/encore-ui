angular.module('billingApp')
/**
 * @ngdoc object
 * @name encore:controller.OptionsCtrl
 * @description
 * The Controller which displays an overview of a users' billing info.
 *
 * @requires $scope - The $scope variable for interacting with the UI.
 * @requires $routeParams - AngularJS service which provides access to route paramters
 * @requires $q - AngularJS q implementation for working with promises.
 * @requires billingSvcs.Account - Account resource for obtaining balance information
 * @requires billingSvcs.Balance - Service for CRUD operations for the Balance resource.
 * @requires billingSvcs.PaymentMethod - Payment Method resource for all actions with payment methods (List,
 *                           Change Default, Disable)
 * @requires billingSvcs.Payment - Resource for performing payments against an account
 * @requires billingSvcs.DefaultPaymentMethodFilter - Filter which facilitates retrieval of default payment method
 * @requires encore.rxSortableColumn:rxSortUtil - Service which provides column sort related functions
 * @requires encore.rxNotify:rxPromiseNotifications - Service which provides notifications for promises
 * @requires billingSvcs.STATUS_MESSAGES - Constant object defining messaging to be used throughout the app
 *
 * @example
 * <pre>
 * .controller('OptionsCtrl', function ($scope, $routeParams, $q, Account, Balance, PaymentMethod,
 *       Payment, DefaultPaymentMethodFilter, rxSortUtil, rxPromiseNotifications, STATUS_MESSAGES) {
 * </pre>
 */
    .controller('OptionsCtrl', function ($scope, $routeParams, $window, $q, rxNotify, Account, Balance,
                                        PaymentMethod, AccountNumberUtil, PaymentSession, Payment,
                                        PaymentFormURI, DefaultPaymentMethodFilter, Session, rxSortUtil,
                                        rxPromiseNotifications, STATUS_MESSAGES) {

        // Get filter the paymentMethods and retrieve the default one (callback)
        var getDefaultMethod = function (paymentMethods) {
            $scope.defaultMethod = DefaultPaymentMethodFilter(paymentMethods);
        },
            // Get the payment amount currently due (callback)
            getCurrentDue = function (balance) {
                $scope.paymentAmount = balance.amountDue;
            },
            // Return the list of payment methods for the account being viewed
            getPaymentMethods = function (status) {
                if (status === 'enabled') {
                    return PaymentMethod.list({
                        accountNumber: $routeParams.accountNumber,
                        showDisabled: false
                    }, getDefaultMethod);
                }
                return PaymentMethod.list({
                    accountNumber: $routeParams.accountNumber,
                    showDisabled: true
                }, getDefaultMethod);
            },
            // Refresh the list of payment methods in scope (callback)
            refreshPaymentMethods = function () {
                $scope.paymentMethods = getPaymentMethods();
                $scope.enabledMethods = getPaymentMethods('enabled');
            },
            // Stolen from rxSortableColumn, as it does not allow multiple tables in
            // one controller to be sorted independently
            sortCol = function (sort) {
                return function (predicate) {
                    var reverse = ($scope[sort].predicate === predicate) ? !$scope[sort].reverse : false;
                    $scope[sort] = { reverse: reverse, predicate: predicate };
                };
            };

        // Establish session with payment forms API and redirect to method capture
        var addPayment = function () {
            $scope.createSession = PaymentSession.create($routeParams.accountNumber, $window.location.href);
            rxPromiseNotifications.add($scope.createSession.$promise, STATUS_MESSAGES.session);

            // Redirect user to payment form with valid session
            $scope.createSession.$promise.then(
                function (data) {
                    $window.location.href = PaymentFormURI() + data.session.id;
                });
        };

        // Assign template actions
        $scope.refreshPaymentMethods = refreshPaymentMethods;
        $scope.addPayment = addPayment;

        // Set the default sort of the payment methods that are cards
        $scope.cardSortCol = sortCol('cardSort');
        $scope.cardSort = rxSortUtil.getDefault('isDefault', true);

        // Set the default sort of the payment methods that are ACH
        $scope.achSortCol = sortCol('achSort');
        $scope.achSort = rxSortUtil.getDefault('isDefault', true);

        // Get Account Info
        $scope.account = Account.get({ accountNumber: $routeParams.accountNumber });

        // Get Account Info
        $scope.balance = Balance.get({ accountNumber: $routeParams.accountNumber }, getCurrentDue);

        // Gets the payment methods
        refreshPaymentMethods();

        // Group the promises in $q.all for a global error message if any errors occur
        rxPromiseNotifications.add($q.all([
            $scope.balance.$promise,
            $scope.paymentMethods.$promise
        ]), {
            loading: '',
            error: STATUS_MESSAGES.overview.error
        }, 'optionsPage');
    });
