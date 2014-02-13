angular.module('billingSvcs', ['ngResource'])
    .factory('Transaction', function ($resource) {
        return $resource('/api/billing/transactions/:id',
            {
                id: '@id'
            },
            {
                list: { method: 'GET', isArray: true }
            }
        );
    })
    .factory('Account', function ($resource) {
        return $resource('/api/billing/account/:id');
    });