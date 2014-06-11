angular.module('billingSvcs', ['ngResource', 'rxGenericUtil'])
   /**
    * @ngdoc service
    * @name billingSvcs.Transaction
    * @description
    * Transaction Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
    * @requires Transform - Service to create a data transform, to only return data at a specific path,
    *                       mainly used on the response
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
    * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
    * @requires Transform - Service to create a data transform, to only return data at a specific path,
    *                       mainly used on the response
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
    * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
    * @requires Transform - Service to create a data transform, to only return data at a specific path,
    *                       mainly used on the response
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

        billInfo.updateInvoiceDeliveryMethod = function (params, invoiceDeliveryMethod, success, error) {
            return billInfo.update(params, {
                billInfo: {
                    invoiceDeliveryMethod: invoiceDeliveryMethod
                }
            }, success, error);
        };
        return billInfo;
    })
   /**
    * @ngdoc service
    * @name billingSvcs.PaymentInfo
    * @description
    * Account Payment Settings/Info Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
    * @requires Transform - Service to create a data transform, to only return data at a specific path,
    *                       mainly used on the response
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

        paymentInfo.updateNotificationOption = function (params, notificationOption, success, error) {
            return paymentInfo.update(params, {
                paymentInfo: {
                    notificationOption: notificationOption
                }
            }, success, error);
        };
        return paymentInfo;
    })
   /**
    * @ngdoc service
    * @name billingSvcs.Period
    * @description
    * Period Service for interaction with Billing API
    *
    * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
    * @requires Transform - Service to create a data transform, to only return data at a specific path,
    *                       mainly used on the response
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
    * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
    * @requires Transform - Service to create a data transform, to only return data at a specific path,
    *                       mainly used on the response
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
     * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
     * @requires Transform - Service to create a data transform, to only return data at a specific path,
     *                       mainly used on the response
     */
    .factory('Payment', function ($resource, Transform) {
        var transform = Transform('payments.payment', 'badRequest.details');
        var payment = $resource('/api/billing/:id/payments',
            {
                id: '@id'
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform },
                make: { method: 'POST' }
            }
        );

        payment.makePayment = function (accountNumber, amount, methodId) {
            return payment.make({
                id: accountNumber // URL Arguments
            }, {
                payment: { // Post Data
                    amount: amount,
                    methodId: methodId
                }
            });
        };

        return payment;
    })
    /**
     * @ngdoc service
     * @name billingSvcs.ContractEntity
     * @description
     * ContractEntity Service for interaction with Billing API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
     * @requires Transform - Service to create a data transform, to only return data at a specific path,
     *                       mainly used on the response
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
    * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
    * @requires Transform - Service to create a data transform, to only return data at a specific path,
    *                       mainly used on the response
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
    * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
    * @requires Transform - Service to create a data transform, to only return data at a specific path,
    *                       mainly used on the response
    */
    .factory('PurchaseOrder', function ($resource, Transform) {
        var transform = Transform('purchaseOrders.purchaseOrder', 'details');
        var purchaseOrder = $resource('/api/billing/:id/purchaseOrders/:purchaseOrderId',
            {
                id: '@id',
                purchaseOrderId: '@purchaseOrderId'
            },
            {
                list: { method: 'GET', isArray: true, transformResponse: transform },
                create: { method: 'POST' },
                disable: { method: 'DELETE' }
            }
        );

        purchaseOrder.createPO = function (id, purchaseOrderId, success, error) {
            return purchaseOrder.create({
                id: id
            }, {
                purchaseOrder: {
                    poNumber: purchaseOrderId
                }
            }, success, error);
        };
        purchaseOrder.disablePO = function (id, purchaseOrderId, success, error) {
            return purchaseOrder.disable({
                id: id,
                purchaseOrderId: purchaseOrderId
            }, null, success, error);
        };
        return purchaseOrder;
    })
    /**
    * @ngdoc service
    * @name encore.service:PurchaseOrderCurrent
    * @description
    * Returns true if Purchase Order is the current one
    *
    * @param {Array} purchaseOrders - collection of purchaseOrders to be filtered.
    */
    .factory('PurchaseOrderUtil', function () {
        return {
            isCurrent: function (purchaseOrder, current) {
                // Force object type in case function is called with no arguments
                purchaseOrder = purchaseOrder || {};
                // Force boolean type in case function is called with no arguments
                current = current === true;

                // The "current" purchase order does not have an endDate
                return purchaseOrder.hasOwnProperty('endDate') !== current;
            }
        };
    })
    /**
    * @ngdoc service
    * @name encore.service:BillingErrorResponse
    * @param {Object} STATUS_MESSAGES - Status Messages
    * @description
    * Returns the error structure from an error response of the Billing API
    *
    * @param {Array} error - error returned from billing API
    */
    .factory('BillingErrorResponse', function (STATUS_MESSAGES) {
        return function (response) {
            var error = response.data || {};
            var keys = _.keys(error),
                errorKey = _.first(keys);

            error = _.extend({
                type: 'error',
                msg: ''
            }, error[errorKey]);

            // Save the key as error type
            error.type = errorKey;
            error.status = response.status;

            // #NOTE: This may change once Billing API has Repose in front of it
            // 404 From Billing API could mean NotFound/PermissionDenied
            // Repose (may) change this logic
            if (error.status === 404) {
                error.msg = STATUS_MESSAGES.permissionDenied;
                error.type = 'permissionDenied';
            } else if (!_.isEmpty(error.message)) {
                // Grab the error message from the API return data
                error.msg = error.message;
            }

            return error;
        };
    });
