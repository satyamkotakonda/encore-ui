'use strict';
angular.module('billingApp', ['ngRoute', 'ngResource', 'encore.ui', 'encore.ui.tpls',
        'rxSwitch', 'encore.ui.rxPopover', 'billingSvcs', 'paymentSvcs', 'supportSvcs',
        'customerAdminSvcs', 'constants', 'productConstants'])

    .config(function ($httpProvider, $routeProvider, $locationProvider) {
        // Add Interceptors for auth
        $httpProvider.interceptors.push('TokenInterceptor');
        $httpProvider.interceptors.push('UnauthorizedInterceptor');

        //#TODO: To be replaced once account search is implemented, only temporary for dev
        $routeProvider
            .when('/overview/:accountNumber', {
                templateUrl: 'views/billing/overview.html',
                controller: 'OverviewCtrl'
            })
            .when('/transactions/:accountNumber', {
                templateUrl: 'views/billing/transactions.html',
                controller: 'TransactionsCtrl'
            })
            .when('/transactions/:accountNumber/:transactionType/:transactionNumber', {
                templateUrl: 'views/billing/transactionDetails.html',
                controller: 'TransactionDetailsCtrl'
            })
            .when('/usage/:accountNumber', {
                templateUrl: 'views/usage/usage.html',
                controller: 'UsageCtrl'
            })
            .when('/payment/:accountNumber/options', {
                templateUrl: 'views/payment/options.html',
                controller: 'OptionsCtrl'
            })
            .when('/purchase-orders/:accountNumber', {
                templateUrl: 'views/purchase-orders/purchaseOrders.html',
                controller: 'PurchaseOrdersCtrl'
            })
            .when('/preferences/:accountNumber', {
                templateUrl: 'views/preferences/preferences.html',
                controller: 'PreferencesCtrl'
            })
            .otherwise({
                //#TODO: this is temporary until we get a more solid solution
                redirectTo: '/overview/473500'
            });

        $locationProvider.html5Mode(true).hashPrefix('!');
    }).run(function ($http, $rootScope, $window, Auth, Environment, rxAppRoutes,
        NOTFOUND_MSG, LOADING_MSG) {
        // Override the children of the billing menu from the encore-ui default.
        rxAppRoutes.setRouteByKey('billing', {
            children: [
                {
                    href: 'overview/{{accountNumber}}',
                    linkText: 'Overview'
                }, {
                    href: 'transactions/{{accountNumber}}',
                    linkText: 'Transactions'
                }, {
                    href: 'usage/{{accountNumber}}',
                    linkText: 'Current Usage'
                }, {
                // TODO: Commented out until functionality is to be released
                //     href: 'discounts/{{accountNumber}}',
                //     linkText: 'Discounts'
                // }, {
                    href: 'purchase-orders/{{accountNumber}}',
                    linkText: 'Purchase Orders'
                }, {
                    href: 'payment/{{accountNumber}}/options',
                    linkText: 'Payment Options'
                }, {
                    href: 'preferences/{{accountNumber}}',
                    linkText: 'Preferences'
                }
            ]
        });

        var environment = Environment.get().name;

        if (environment !== 'local' && !Auth.isAuthenticated()) {
            $window.location = '/login?redirect=' + $window.location.pathname;
            return;
        }

        // Forces JSON only
        $http.defaults.headers.common['Accept'] = 'application/json';

        // Pass message constants for templates
        $rootScope.loadingMsg = LOADING_MSG;
        $rootScope.notFoundMsg = NOTFOUND_MSG;

    }).controller('LoginModalCtrl', function ($scope, Auth, Environment, rxNotify) {
        $scope.environment = Environment.get().name;

        var authenticate = function (credentials, success, error) {
            //override the body here
            var body = {
                'auth': {
                    'RAX-AUTH:domain': {
                        'name': 'Rackspace'
                    },
                    'RAX-AUTH:rsaCredentials': {
                        'username': credentials.username,
                        'tokenKey': credentials.token
                    }
                }
            };

            return Auth.loginWithJSON(body, success, error);
        };
        $scope.user = {};
        $scope.login = function () {
            return authenticate($scope.user, function (data) {
                Auth.storeToken(data);
            }, function () {
                rxNotify.add('Invalid Username or RSA Token', { type: 'warning' });
                $scope.user.token = '';
            });
        };
    });
