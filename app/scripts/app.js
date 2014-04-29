'use strict';
angular.module('billingApp', ['ngRoute', 'ngResource', 'encore.ui', 'encore.ui.tpls',
        'rxSwitch', 'encore.ui.rxPopover', 'billingSvcs', 'paymentSvcs', 'constants', 'productConstants'])
    .run(function ($http, $rootScope) {
        //#TODO: Integrate rxAuth/rxLogin so that we no longer have to temporarily store the token key
        $http.defaults.headers.common['X-Auth-Token'] = '06557b8eecfe47adbd1fa2b260cc0eb5';
        // Forces JSON only
        $http.defaults.headers.common['Accept'] = 'application/json';

        $rootScope.billingMenu = [{
            title: 'Billing',
            children: [
                {
                    href: '/billing/overview/{{accountNumber}}',
                    linkText: 'Overview'
                },
                {
                    href: '/billing/transactions/{{accountNumber}}',
                    linkText: 'Transactions'
                },
                {
                    href: '/billing/usage/{{accountNumber}}',
                    linkText: 'Current Usage'
                },
                {
                    href: '/billing/discounts/{{accountNumber}}',
                    linkText: 'Discounts'
                },
                {
                    href: '/billing/payment/{{accountNumber}}/options',
                    linkText: 'Payment Options'
                },
                {
                    href: '/billing/preferences/{{accountNumber}}',
                    linkText: 'Preferences'
                }
            ]
        }];
    })
    .config(function ($routeProvider, $locationProvider) {
        //#TODO: To be replaced once account search is implemented, only temporary for dev
        $routeProvider
            .when('/billing/overview/:accountNumber', {
                templateUrl: '/billing/views/billing/overview.html',
                controller: 'OverviewCtrl'
            })
            .when('/billing/usage/:accountNumber', {
                templateUrl: '/billing/views/usage/usage.html',
                controller: 'UsageCtrl'
            })
            .when('/billing/payment/:accountNumber/options', {
                templateUrl: '/billing/views/payment/options.html',
                controller: 'OptionsCtrl'
            })
            .otherwise({
                //#TODO: this is temporary until we get a more solid solution
                redirectTo: '/billing/overview/020-473500'
            });

        $locationProvider.html5Mode(true).hashPrefix('!');
    });
