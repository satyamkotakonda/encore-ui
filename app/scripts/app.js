'use strict';
angular.module('billingApp', ['ngRoute', 'ngResource', 'encore.ui', 'encore.ui.tpls', 'encore.ui.rxForm',
        'encore.ui.rxPaginate', 'encore.ui.rxModalAction', 'encore.ui.rxSortableColumn', 'encore.ui.rxNotify',
        'rxSwitch', 'encore.ui.rxPopover', 'billingSvcs', 'paymentSvcs', 'constants', 'productConstants'])
    .run(function ($http, $rootScope) {
        //#TODO: Integrate rxAuth/rxLogin so that we no longer have to temporarily store the token key
        $http.defaults.headers.common['X-Auth-Token'] = 'ac5ea4419c6c41669716ddd108dda13f';
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
                    href: '/billing/usage/{{accountNumber}}',
                    linkText: 'Usages & Charges'
                },
                {
                    href: '/billing/payment/{{accountNumber}}/options',
                    linkText: 'Payment Options'
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
                redirectTo: '/billing/overview/020-5955321'
            });

        $locationProvider.html5Mode(true).hashPrefix('!');
    });
