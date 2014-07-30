'use strict';
angular.module('billingApp', ['ngRoute', 'ngResource', 'ngCsv', 'encore.ui', 'encore.ui.tpls',
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
            .when('/search/:term', {
                templateUrl: 'views/billing/transactionSearch.html',
                controller: 'TransactionSearchCtrl'
            })
            .when('/transactions/:accountNumber', {
                templateUrl: 'views/billing/transactions.html',
                controller: 'TransactionsCtrl',
                data: {
                    title: 'Transactions'
                }
            })
            .when('/transactions/:accountNumber/:transactionType/:transactionNumber', {
                templateUrl: function ($routeParams) {
                    return 'views/billing/transactions/' + $routeParams.transactionType + '.html';
                },
                controller: 'TransactionDetailsCtrl',
                data: {
                    // Setting breadcrumbs title in controller because we need scope access
                    parent: 'Transactions',
                    parentPath: '/billing/transactions/{{accountNumber}}'
                }
            })
            .when('/usage/:accountNumber', {
                templateUrl: 'views/usage/usage.html',
                controller: 'UsageCtrl',
                data: {
                    title: 'Current Usage'
                }
            })
            .when('/payment/:accountNumber/options', {
                templateUrl: 'views/payment/options.html',
                controller: 'OptionsCtrl',
                data: {
                    title: 'Payment Options'
                }
            })
            .when('/purchase-orders/:accountNumber', {
                templateUrl: 'views/purchase-orders/purchaseOrders.html',
                controller: 'PurchaseOrdersCtrl',
                data: {
                    title: 'Purchase Orders'
                }
            })
            .when('/preferences/:accountNumber', {
                templateUrl: 'views/preferences/preferences.html',
                controller: 'PreferencesCtrl',
                data: {
                    title: 'Preferences'
                }
            });

        $locationProvider.html5Mode(true).hashPrefix('!');
    }).run(function ($http, $rootScope, $window, $interpolate, Auth, Environment, rxAppRoutes,
                     NOTFOUND_MSG, LOADING_MSG, rxBreadcrumbsSvc) {

        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (Environment.get().name !== 'local' && !Auth.isAuthenticated()) {
                $window.location = '/login?redirect=' + $window.location.pathname;
                return;
            }

            var params = _.isUndefined(next) ? {} : next.params;
            var data = _.isUndefined(next) ? {} : next.data;
            var crumbs = _.isEmpty(data) && !_.has(params, 'accountNumber') ? [] : [{
                path: '/accounts/' + params.accountNumber,
                name: params.accountNumber
            }, {
                path: '/billing/overview/' + params.accountNumber,
                name: 'Billing'
            }];

            if (_.has(data, 'parent')) {
                crumbs.push({
                    path: $interpolate(data.parentPath)(params),
                    name: data.parent
                });
            }

            if (_.has(data, 'title')) {
                crumbs.push({
                    name: data.title
                });
            }

            rxBreadcrumbsSvc.set(crumbs);
        });

        // Forces JSON only
        $http.defaults.headers.common['Accept'] = 'application/json';

        // Pass message constants for templates
        $rootScope.loadingMsg = LOADING_MSG;
        $rootScope.notFoundMsg = NOTFOUND_MSG;

    });
