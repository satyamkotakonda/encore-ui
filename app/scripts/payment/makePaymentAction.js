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
            templateUrl: '/views/payment/makePaymentAction.html',
            transclude: true,
            scope: {
                user: '@',
                classes: '@',
                amount: '@paymentAmount',
                methodId: '@paymentMethodId',
                methods: '=paymentMethods',
                postHook: '='
            },
            controller: function ($scope, PAYMENT_TYPE_FILTERS, PAYMENT_TYPE_COLUMNS) {
                $scope.changeMethodType = function (filterVal) {
                    $scope.methodType = filterVal;
                    $scope.methodList = filter($scope.methods, PAYMENT_TYPE_FILTERS[filterVal]).map(flattenObj);
                    if (filterVal === 'default') {
                        if ($scope.methodList[0].paymentCard) {
                            filterVal = 'card';
                        } else if ($scope.methodList[0].electronicCheck) {
                            filterVal = 'ach';
                        } else if ($scope.methodList[0].invoice) {
                            filterVal = 'invoice';
                        }
                    }
                    $scope.methodListCols = PAYMENT_TYPE_COLUMNS[filterVal];
                };
                // Set default as the active view
                if ($scope.methods.$promise) {
                    $scope.methods.$promise.then(function () {
                        $scope.changeMethodType('default');
                    });
                } else {
                    $scope.changeMethodType('default');
                }
            }
        };
    })
    .constant('PAYMENT_TYPE_FILTERS', {
        'default': { 'isDefault': 'true' },
        'card':    { 'paymentCard': '!!' },
        'ach':     { 'electronicCheck': '!!' },
        'invoice': { 'invoice': '!!' }
    })
    .constant('PAYMENT_TYPE_COLUMNS', {
        'default': [],
        'card': [{
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
        'ach': [{
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