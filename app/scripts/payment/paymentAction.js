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
        var filter = $filter('filter'),
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
            controller: function ($scope, $q, PAYMENT_TYPE_FILTERS, PAYMENT_TYPE_COLUMNS) {
                $scope.payment = {};
                $scope.setDefaultValues = function (amount, methodId) {
                    $scope.payment.amount = amount;
                    $scope.payment.methodId = methodId;
                };
                $scope.changeMethodType = function (methodType) {
                    $scope.methodType = methodType;
                    $scope.methodList = filter($scope.methods, PAYMENT_TYPE_FILTERS[methodType]).map(flattenObj);
                    if (methodType === 'default' && $scope.methodList.length > 0) {
                        methodType = _.findKey($scope.methodList[0], _.isObject);
                    }
                    $scope.methodListCols = PAYMENT_TYPE_COLUMNS[methodType];
                };

                // Set default as the active view
                $q.when($scope.methods.$promise).then(function () {
                    $scope.changeMethodType('default');
                });
            }
        };
    })
    .constant('PAYMENT_TYPE_FILTERS', {
        'default': { 'isDefault': 'true' },
        'paymentCard':    { 'paymentCard': '!!' },
        'electronicCheck':     { 'electronicCheck': '!!' },
        'invoice': { 'invoice': '!!' }
    })
    .constant('PAYMENT_TYPE_COLUMNS', {
        'default': [],
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