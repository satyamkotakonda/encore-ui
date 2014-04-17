'use strict';
var accountNumber = '020-5955321';
angular.module('billingApp', ['ngRoute', 'ngResource', 'encore.ui', 'encore.ui.tpls', 'encore.ui.rxForm',
        'encore.ui.rxPaginate', 'encore.ui.rxModalAction', 'encore.ui.rxSortableColumn', 'encore.ui.rxNotify',
        'rxSwitch', 'encore.ui.rxPopover', 'billingSvcs', 'paymentSvcs', 'constants', 'productConstants'])
    .run(function ($http, $rootScope) {
        //TODO: Integrate rxAuth/rxLogin so that we no longer have to temporarily store the token key
        $http.defaults.headers.common['X-Auth-Token'] = '2184d781eafa4c949e9d68df6c75f818';
        // Forces JSON only
        $http.defaults.headers.common['Accept'] = 'application/json';

        var appName = 'billing',
            appRoute = '/' + appName;

        $rootScope.billingMenu = [{
            title: 'Billing',
            children: [
                {
                    href: appRoute + '/overview/' + accountNumber,
                    linkText: 'Overview'
                },
                {
                    href: appRoute + '/usage/' + accountNumber,
                    linkText: 'Usages & Charges'
                },
                {
                    href: appRoute + '/payment/' + accountNumber + '/options',
                    linkText: 'Payment Options'
                }
            ]
        }];
    })
    .config(function ($routeProvider, $locationProvider) {
        //TODO: To be replaced once account search is implemented, only temporary for dev
        $routeProvider
            .when('/billing/overview/:accountNumber', {
                templateUrl: '/views/billing/overview.html',
                controller: 'OverviewCtrl'
            })
            .when('/billing/usage/:accountNumber', {
                templateUrl: '/views/usage/usage.html',
                controller: 'UsageCtrl'
            })
            .when('/billing/payment/:accountNumber/options', {
                templateUrl: '/views/payment/options.html',
                controller: 'OptionsCtrl'
            })
            .otherwise({
                //this is temporary until we get a more solid solution
                redirectTo: '/billing/overview/' + accountNumber
            });

        $locationProvider.html5Mode(true).hashPrefix('!');
    });
