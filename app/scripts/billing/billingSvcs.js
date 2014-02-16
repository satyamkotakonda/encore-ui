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
    })
    .factory('Period', function ($resource) {
        var transform = function (data) {
            var json = angular.fromJson(data);
            return json.msg ? json.msg : json.billingPeriods.billingPeriod;
        };
        return $resource('/api/:account/billing_periods',
            {
                account: '@account',
                marker: 0,
                limit: 10
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform }
            }
        );
    });