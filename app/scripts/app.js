'use strict';

angular.module('billingApp', ['ngRoute', 'ngResource'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/login'
            });

        $locationProvider.html5Mode(true).hashPrefix('!');
    });
