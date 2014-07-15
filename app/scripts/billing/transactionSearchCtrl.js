angular.module('billingApp')
    /**
    * @ngdoc object
    * @name billingApp.TransactionSearchCtrl
    * @description
    * The controller used to search for an account via transaction
    *
    * @requires $scope - The $scope variable for interacting with the UI.
    * @requires $routeParams - AngularJS service which provides access to route paramters
    * @requires $location - AngularJS service which provides access to URL in browser.
    * @requires rxNotify - EncoreUI service that creates and styles notifications.
    * @requires rxPromiseNotifications - EncoreUI service which displays notifications for promises.
    * @requires billingSvcs.Transaction - Service for CRUD operations for the Transaction resource.
    * @requires STATUS_MESSAGES - An object that provides constant status values.
    */
    .controller('TransactionSearchCtrl', function (
        $scope, $routeParams, $location, rxNotify, rxPromiseNotifications,
        Transaction, STATUS_MESSAGES) {

        // Check if search entry is an Auth ID
        function isAuthId (term) {
            return !_.contains(term, '-');
        }

        // Check if search entry is payment or invoice
        function getPaymentType (term) {
            return _.first(term).toLowerCase() === 'b' ? 'INVOICE' : 'PAYMENT';
        }

        var term = $routeParams.term;
        var type = isAuthId(term) ? 'PAYMENT' : getPaymentType(term);
        var query = isAuthId(term) ? { gatewayTxRefNum: term } : { tranRefNum: term, tranType: type };

        $scope.result = Transaction.search(query,
            function (res) {
                if (res && res.length === 1) {
                    // Remove account prefix
                    var account = _.first(res).accountNumber;
                    account = _.last(account.split('-'));
                    // Redirect to account overview page on successful fetch
                    $location.path('/overview/' + account);
                    return;
                } else {
                    rxNotify.add('Account not found', { type: 'error' }); // Bad search returns empty array
                }
            }, function (err) {
                if (err.status !== 404) {
                    rxNotify.add(STATUS_MESSAGES.transactions.error, { type: 'error' });
                } else {
                    rxNotify.add('Account not found', { type: 'error' });
                }
            });

        rxPromiseNotifications.add($scope.result.$promise, {
            loading: STATUS_MESSAGES.transactions.search
        });

    });
