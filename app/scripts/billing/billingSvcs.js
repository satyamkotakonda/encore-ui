angular.module('billingSvcs', ['ngResource'])
    .factory('Transaction', function ($resource) {
        return $resource('/api/billing/transactions/:id',
            {
                id: '@id'
            },
            {
                list: { method: 'GET', isArray: true },
                periods: { method: 'GET', isArray: false, url: '/api/billing/periods/:id' }
            }
        );
    })
    .factory('Account', function ($resource) {
        return $resource('/api/billing/account/:id');
    });