angular.module('billingApp')
    /**
    * @ngdoc object
    * @name encore:controller.OptionsCtrl
    * @description
    * The Controller which displays an overview of a users' billing info.
    *
    * @example
    * <pre>
    * .controller('OverviewCtrl', function ($scope, $routeParams, Transaction,
    *       Account, Period, PageTracking)
    * </pre>
    */
    .controller('OptionsCtrl', function ($scope, $routeParams, $q, Account, PaymentMethod,
            Payment, DefaultPaymentMethod, rxSortUtil, rxPromiseNotifications, STATUS_MESSAGES) {

        var getDefaultMethod = function (paymentMethods) {
                $scope.defaultMethod = DefaultPaymentMethod(paymentMethods);
            },
            listPaymentMethods = function () {
                return PaymentMethod.list({
                    id: $routeParams.accountNumber,
                    showDisabled: true
                }, getDefaultMethod);
            },
            sortCol = function (sort) {
                return function (predicate) {
                    var reverse = ($scope[sort].predicate === predicate) ? !$scope[sort].reverse : false;
                    $scope[sort] = { reverse: reverse, predicate: predicate };
                };
            },
            changeDefaultMethod = function (methodId) {
                var changeDefaultResult = PaymentMethod.changeDefault({
                    id: $routeParams.accountNumber
                }, {
                    defaultMethod: {
                        methodId: methodId
                    }
                }, function () {
                    $scope.paymentMethods = listPaymentMethods();
                });
                rxPromiseNotifications.add(changeDefaultResult.$promise, {
                    loading: STATUS_MESSAGES.payment.load,
                    success: STATUS_MESSAGES.payment.success,
                    error: STATUS_MESSAGES.payment.error
                }, 'changeDefault');
            },
            postPayment = function (amount, methodId) {
                var paymentResult = Payment.post({
                    id: $routeParams.accountNumber,
                    payment: {
                        amount: amount,
                        methodId: methodId
                    }
                });
                rxPromiseNotifications.add(paymentResult.$promise, {
                    loading: STATUS_MESSAGES.payment.load,
                    success: STATUS_MESSAGES.payment.success,
                    error: STATUS_MESSAGES.payment.error
                }, 'makePayment');
            };

        $scope.changeDefaultMethod = changeDefaultMethod;
        $scope.postPayment = postPayment;
        $scope.cardSortCol = sortCol('cardSort');
        $scope.cardSort = rxSortUtil.getDefault('isDefault', true);

        $scope.achSortCol = sortCol('achSort');
        $scope.achSort = rxSortUtil.getDefault('isDefault', true);

        $scope.account = Account.get({ id: $routeParams.accountNumber });
        $scope.paymentMethods = listPaymentMethods();

        rxPromiseNotifications.add($q.all([
            $scope.account.$promise,
            $scope.paymentMethods.$promise
        ]), {
            loading: '',
            error: STATUS_MESSAGES.overview.error
        }, 'optionsPage');

    });