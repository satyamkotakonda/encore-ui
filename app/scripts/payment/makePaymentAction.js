/**
 * @ngdoc directive
 * @name billingApp:rxMakePaymentModal
 * @restrict E
 *
 * @description
 * Sets the trigger for the make payment modal to be popped up.
 */
angular.module('billingApp')
    .directive('rxMakePaymentAction', function ($filter) {
        var filter = $filter('filter');
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
                    $scope.methodList = filter($scope.methods, PAYMENT_TYPE_FILTERS[filterVal]);
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
                if ($scope.methods.$promise) {
                    $scope.methods.$promise.then(function () {
                        $scope.changeMethodType('default');
                    });
                } else {
                    $scope.changeMethodType('default');
                }
            }
        };
    }).constant('PAYMENT_TYPE_FILTERS', {
        'default': { 'isDefault': 'true' },
        'card':    { 'paymentCard': '!!' },
        'ach':     { 'electronicCheck': '!!' },
        'invoice': { 'invoice': '!!' }
    }).constant('PAYMENT_TYPE_COLUMNS', {
        'default': [],
        'card': [{
            'label': 'id',
            'key': 'id'
        },{
            'label': 'Card Type',
            'key': 'paymentCard.cardType'
        },{
            'label': 'Ending In',
            'key': 'paymentCard.accountNumber'
        },{
            'label': 'Cardholder Name',
            'key': 'paymentCard.cardHolderName'
        },{
            'label': 'Exp. Date',
            'key': 'paymentCard.cardExpirationDate'
        }],
        'ach': [{
            'label': 'id',
            'key': 'id'
        },{
            'label': 'Account Type',
            'key': 'electronicCheck.accountType'
        },{
            'label': 'Account #',
            'key': 'electronicCheck.accountNumber'
        },{
            'label': 'Routing #',
            'key': 'electronicCheck.routingNumber'
        },{
            'label': 'Name on Account',
            'key': 'electronicCheck.accountHolderName'
        }],
        'invoice': []
    });