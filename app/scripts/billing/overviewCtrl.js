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
    * @requires customerAdminSvcs.Account - Service for CRUD operations for the Account resource.
    * @requires customerAdminSvcs.Contact - Service for CRUD operations for the Contact resource.
    * @requires supportSvcs.SupportAccount - Service for CRUD operations for the SupportAccount resource.
    * @requires supportSvcs.SupportRoles - Service for CRUD operations for the SupportRoles resource.
    * @requires billingSvcs.Balance - Service for CRUD operations for the Balance resource.
    * @requires billingSvcs.Payment - Service for CRUD operations for the Payment resource.
    * @requires billingSvcs.PaymentMethod - Service for CRUD operations for the PaymentMethod resource.
    * @requires billingSvcs.ContractEntity - Service for CRUD operations for the ContractEntity resource.
    * @requires billingSvcs.SupportInfo - Service for CRUD operations for the SupportInfo resource.
    * @requires encore.rxNotify:rxPromiseNotifications - Service which provides notifications for promises
    * @requires billingFilters.DefaultPaymentMethodFilter - Filter which facilitates retrieval of default payment method
    * @requires customerAdminFilters.PrimaryAddressFilter - Filter which faciliates retrieval of the primary address
    * @requires supportFilters.RoleNameFilter - Filter which filters by the type of role desired
    * @requires billingSvcs.DATE_FORMAT - Constant that defines the default format for dates
    * @requires billingSvcs.STATUS_MESSAGES - Constant object defining messaging to be used throughout the app
    *
    * @example
    * <pre>
    * .controller('OverviewCtrl', function ($scope, $routeParams, $q, Transaction, Account, Balance,
    *   Period, Payment, PaymentMethod, PageTracking, rxSortUtil, rxPromiseNotifications,
    *   DefaultPaymentMethodFilter,
    *   DATE_FORMAT, TRANSACTION_TYPES, TRANSACTION_STATUSES, STATUS_MESSAGES)
    * </pre>
    */
    .controller('OverviewCtrl', function ($scope, $routeParams, $q, $timeout,
        Balance, Payment, PaymentMethod, ContractEntity, SupportInfo,
        Contact, Account, SupportAccount, SupportRoles,
        DefaultPaymentMethodFilter, PrimaryAddressFilter, RoleNameFilter,
        AccountNumberUtil, rxPromiseNotifications,
        DATE_FORMAT, STATUS_MESSAGES) {

        // TODO: This should be handled at the $resource level, so that the controller
        // passes the $routeParams.accountNumber, and the resource retrieves the type of
        // account number it needs.
        var RAN = AccountNumberUtil.getRAN($routeParams.accountNumber),
            RCN = AccountNumberUtil.getRCN($routeParams.accountNumber),
            accountType = AccountNumberUtil.getAccountType($routeParams.accountNumber);

        var setPaymentInfo = function (result) {
                // Get Current Due from Account Information, first promise of $q.all
                $scope.paymentAmount = result[0].amountDue;

                // Get the Primary Payment Method's ID, second promise of $q.all
                $scope.paymentMethod = DefaultPaymentMethodFilter(result[1]);
            },
            postPayment = function (amount, methodId) {
                $scope.paymentResult = Payment.makePayment(RAN, amount, methodId);
                rxPromiseNotifications.add($scope.paymentResult.$promise, {
                    loading: STATUS_MESSAGES.payment.load,
                    success: STATUS_MESSAGES.payment.success,
                    error: STATUS_MESSAGES.payment.error
                }, 'makePayment');
            },
            billingContacts = function (contacts) {
                var billingContact = _.first(contacts);
                if (!_.isEmpty(billingContact)) {
                    $scope.contactAddress = PrimaryAddressFilter(billingContact.addresses.address);
                    $scope.contactName = billingContact.firstName + ' ' + billingContact.lastName;
                }
            },
            accountManager = function (roles) {
                var accountManager = _.first(RoleNameFilter(roles, 'Account Manager'));
                if (!_.isEmpty(accountManager)) {
                    $scope.accountManager = accountManager.user;
                }
            };

        // Default Date Format
        $scope.defaultDateFormat = DATE_FORMAT;

        // Assign template actions
        $scope.postPayment = postPayment;

        // Get Account & Contact Info
        $scope.account = Account.get({ id: RCN, type: accountType });
        $scope.contacts = Contact.list({ id: RCN, type: accountType, role: 'BILLING' }, billingContacts);
        $scope.supportAccount = SupportAccount.get({ id: RCN });
        $scope.supportRoles = SupportRoles.list({ id: RCN }, accountManager);

        $scope.balance = Balance.get({ id: RAN });
        $scope.contractEntity = ContractEntity.get({ id: RAN });
        $scope.supportInfo = SupportInfo.get({ id: RAN });

        $scope.paymentMethods = PaymentMethod.list({ id: RAN });

        // Group the promises in $q.all for a global error message if any errors occur
        rxPromiseNotifications.add($q.all([
            $scope.account.$promise,
            $scope.contacts.$promise,
            $scope.supportAccount.$promise,
            $scope.supportRoles.$promise,
            $scope.balance.$promise,
            $scope.contractEntity.$promise,
            $scope.supportInfo.$promise
        ]), {
            loading: '',
            error: STATUS_MESSAGES.overview.error
        }, 'overviewPage');

        // Set defaults for the make a payment modal.
        $q.all([$scope.balance.$promise, $scope.paymentMethods.$promise]).then(setPaymentInfo);

    });
