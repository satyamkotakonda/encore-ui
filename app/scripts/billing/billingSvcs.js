angular.module('billingSvcs', ['ngResource', 'rxGenericUtil'])
   /**
    * @ngdoc service
    * @name billingSvcs.Transaction
    * @description
    * Transaction Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Transaction', function ($resource, Transform) {
        var transformList = Transform('billingSummary.item', 'details');
        return $resource('/api/billing/:id/:transactionType/:transactionNumber',
            {
                id: '@id'
            },
            {
                list: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: transformList,
                    params: {
                        transactionType: 'billing-summary'
                    }
                }
            }
        );
    })
   /**
    * @ngdoc service
    * @name billingSvcs.Balance
    * @description
    * Balance Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Balance', function ($resource, Transform) {
        var transform = Transform('balance', 'details');
        return $resource('/api/billing/:id/balance',
            {
                id: '@id'
            },
            {
                get: { method: 'GET', transformResponse: transform }
            }
        );
    })
   /**
    * @ngdoc service
    * @name billingSvcs.BillInfo
    * @description
    * Account Bill Settings/Info Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('BillInfo', function ($resource, Transform) {
        var transform = Transform('billInfo', 'details');
        var billInfo = $resource('/api/billing/:id/billInfo',
            {
                id: '@id'
            },
            {
                get: { method: 'GET', transformResponse: transform },
                update: { method: 'PUT', transformResponse: transform }
            }
        );

        billInfo.updateInvoiceDeliveryMethod = function (params, invoiceDeliveryMethod) {
            return billInfo.update(params, {
                billInfo: {
                    invoiceDeliveryMethod: invoiceDeliveryMethod
                }
            });
        };
        return billInfo;
    })
   /**
    * @ngdoc service
    * @name billingSvcs.PaymentInfo
    * @description
    * Account Payment Settings/Info Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('PaymentInfo', function ($resource, Transform) {
        var transform = Transform('paymentInfo', 'details');
        var paymentInfo = $resource('/api/billing/:id/paymentInfo',
            {
                id: '@id'
            },
            {
                get: { method: 'GET', transformResponse: transform },
                update: { method: 'PUT', transformResponse: transform }
            }
        );

        paymentInfo.updateNotificationOption = function (params, notificationOption) {
            return paymentInfo.update(params, {
                paymentInfo: {
                    notificationOption: notificationOption
                }
            });
        };
        return paymentInfo;
    })
   /**
    * @ngdoc service
    * @name billingSvcs.Period
    * @description
    * Period Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('Period', function ($resource, Transform) {
        var transform = Transform('billingPeriods.billingPeriod', 'details');
        return $resource('/api/billing/:id/billing-periods',
            {
                id: '@id'
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform }
            }
        );
    })
   /**
    * @ngdoc service
    * @name billingSvcs.EstimatedCharges
    * @description
    * Estimated Charges Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('EstimatedCharges', function ($resource, Transform) {
        var transform = Transform('estimatedCharges.estimatedCharge', 'details');
        return $resource('/api/billing/:id/billing-periods/:periodId/estimated_charges',
            {
                id: '@id',
                periodId: '@periodId'
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform }
            }
        );
    })
    /**
     * @ngdoc service
     * @name billingSvcs.Payment
     * @description
     * Payment Service for interaction with Billing API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('Payment', function ($resource, Transform) {
        var transform = Transform('payments.payment', 'badRequest.details');
        return $resource('/api/billing/:id/payments',
            {
                id: '@id'
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform },
                // I realize this seems redundant, but verbally Payment.makePayment makes more sense than Payment.save
                makePayment: { method: 'POST' }
            }
        );
    })
    /**
     * @ngdoc service
     * @name billingSvcs.ContractEntity
     * @description
     * ContractEntity Service for interaction with Billing API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('ContractEntity', function ($resource, Transform) {
        var transform = Transform('contractEntity', 'badRequest.details');
        return $resource('/api/billing/:id/contractEntity',
            {
                id: '@id'
            },
            {
                get: { method: 'GET', isArray: false, transformResponse: transform }
            }
        );
    })
    /**
    * @ngdoc service
    * @name billingSvcs.SupportInfo
    * @description
    * Account Bill Settings/Info Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('SupportInfo', function ($resource, Transform) {
        var transform = Transform('supportInfo', 'details');
        return $resource('/api/billing/:id/supportInfo',
            {
                id: '@id'
            },
            {
                get: { method: 'GET', transformResponse: transform }
            }
        );
    })
    /**
    * @ngdoc service
    * @name billingSvcs.PurchaseOrder
    * @description
    * Account Bill Settings/Info Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
    */
    .factory('PurchaseOrder', function ($resource, Transform) {
        var transform = Transform('purchaseOrders.purchaseOrder', 'details');
        return $resource('/api/billing/:id/purchaseOrders',
            {
                id: '@id'
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform }
            }
        );
    });
