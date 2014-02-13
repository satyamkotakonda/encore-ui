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
    });