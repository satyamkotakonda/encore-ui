/**
 * @ngdoc directive
 * @name billingApp:rxPaymentAction
 * @restrict E
 *
 * @description
 * Sets the trigger for the make payment modal to be popped up.
 */
angular.module('billingApp')
    .directive('rxPaymentAction', function ($filter) {
        var paymentMethodTypeFilter = $filter('PaymentMethodType'),
            flattenObj = function (method) {
                var details = _.pairs(method[_.findKey(method, _.isObject)]);
                return _(method).pairs().concat(details).zipObject().value();
            };
        return {
            restrict: 'E',
            templateUrl: '/views/payment/paymentAction.html',
            transclude: true,
            scope: {
                user: '@',
                classes: '@',
                amount: '@',
                methodId: '@',
                methods: '=',
                postHook: '='
            },
            controller: function ($scope, $q, PAYMENT_TYPE_COLUMNS) {
                $scope.payment = {};
                $scope.setDefaultValues = function (amount, methodId) {
                    $scope.payment.amount = amount;
                    $scope.payment.methodId = methodId;
                };
                $scope.changeMethodType = function (methodType) {
                    var methodColumnsType = methodType;

                    // Set the method type we are filtering for for display purposes.
                    $scope.methodType = methodType;

                    // Filter the list of payment methods by it's method type (electronicCard/paymentCard/default)
                    // Map it to flatten the object due to rxFormOptionTable not able to display values in nested obj
                    $scope.methodList = paymentMethodTypeFilter($scope.methods, methodType).map(flattenObj);

                    // If we are filtering for the default paymentMethod, we must find out, if any present
                    // what type of payment method is.
                    // Payment methods don't give us a type, but we can check against the key that is an object
                    // which currently determines the payment method details.
                    if (methodType === 'isDefault' && !_.isEmpty($scope.methodList)) {
                        methodColumnsType = _.findKey($scope.methodList[0], _.isObject);
                    }

                    // Get the columns that are needed for the payment method we are viewing.
                    $scope.methodListCols = PAYMENT_TYPE_COLUMNS[methodColumnsType];
                };

                // Set default as the active view
                $q.when($scope.methods.$promise).then(function () {
                    $scope.changeMethodType('isDefault');
                });
            }
        };
    })
    .constant('PAYMENT_TYPE_COLUMNS', {
        'isDefault': [],
        'paymentCard': [{
            'label': 'Card Type',
            'key': 'cardType'
        },{
            'label': 'Ending In',
            'key': 'cardNumber'
        },{
            'label': 'Cardholder Name',
            'key': 'cardHolderName'
        },{
            'label': 'Exp. Date',
            'key': 'cardExpirationDate'
        }],
        'electronicCheck': [{
            'label': 'Account Type',
            'key': 'accountType'
        },{
            'label': 'Account #',
            'key': 'accountNumber'
        },{
            'label': 'Routing #',
            'key': 'routingNumber'
        },{
            'label': 'Name on Account',
            'key': 'accountHolderName'
        }],
        'invoice': []
    });