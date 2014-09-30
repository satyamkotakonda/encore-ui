angular.module('paymentSvcs', ['ngResource', 'rxGenericUtil', 'encore.ui'])
    /**
     * @ngdoc service
     * @name paymentSvcs.PaymentMethod
     * @description
     * Payment Method Service for interaction with Billing API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('PaymentMethod', function ($resource, Transform) {
        var transform = Transform('methods.method', 'badRequest.details');
        var transformMethod = Transform('method');
        return $resource('/api/payment/accounts/:prefix-:accountNumber/methods/:methodId',
            {
                accountNumber: '@accountNumber',
                prefix: '020'
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform },
                get: { method: 'GET', url: '/api/payment/methods/:methodId', transformResponse: transformMethod },
                disable: { method: 'DELETE' },
                changeDefault: { method: 'PUT', params: { methodId: 'default' }}
            }
        );
    })
    .factory('PaymentSession', function ($resource, Session) {
        var session = $resource('/api/forms/sessions', {},
            {
                get: { method: 'GET' },
                save: {
                    method: 'POST',
                    headers: {
                        'X-RAX-SupportUser-Token': Session.getTokenId()
                    }
                }
            }
        );
        session.create = function (accountNumber, postbackUrl, success, fail) {
            var data = {
                'session': {
                    'ran': '020-' + accountNumber,
                    'postbackURL': postbackUrl
                }
            };
            return session.save({}, data, success, fail);
        };

        return session;
    })
    .factory('PaymentFormURI', function (Environment) {
        var path = '/v1/forms/method_capture?sessionId=';
        return function () {
            if (Environment.get().name === 'unified-prod') {
                return 'https://forms.payment.api.rackspacecloud.com' + path;
            } else if (Environment.get().name === 'local') {
                return 'https://staging.forms.payment.pipeline2.api.rackspacecloud.com' + path;
            }
            return 'https://staging.forms.payment.api.rackspacecloud.com' + path;
        };
    });
