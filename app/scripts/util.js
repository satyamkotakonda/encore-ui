angular.module('rxGenericUtil', [])
   /**
    * @ngdoc service
    * @name encore.service:AccountNumberUtil
    * @description
    * Functions for the ease of retrieving account numbers based on the format needed by the API
    *
    * @param {String} accountNumber - Account Number.
    */
    .factory('AccountNumberUtil', function () {
        return {
            getRCN: function (accountNumber) {
                return accountNumber ? accountNumber : undefined;
            },
            getRAN: function (accountNumber) {
                accountNumber = this.getRCN(accountNumber);
                if (accountNumber) {
                    return '020-' + accountNumber;
                }
            },
            getAccountType: function (accountNumber) {
                if (accountNumber) {
                    return 'CLOUD';
                }
            }
        };
    })
   /**
    * @ngdoc service
    * @name billingApp.Transform
    * @description
    *
    * Transform a Json message into an object and fetch a specific path from it. (Or all of it)
    */
   .factory('Transform', function () {
        var fromPath = function (obj, path) {
            obj = _.reduce(path, function (val, key) {
                return _.has(val, key) ? val[key] : false;
            }, obj);
            return obj;
        };
        return function (path, msgPath) {
            // Pre parse the path into an array
            // Set path to empty string if not given
            var splitPath = _.isEmpty(path) ? [] : path.split('.'),
                msgSplitPath = _.isEmpty(msgPath) ? [] : msgPath.split('.');
            return function (data) {
                var json = angular.fromJson(data),
                    errorMsg = fromPath(json, msgSplitPath);
                return errorMsg && !_.isEqual(errorMsg, json) ? errorMsg : fromPath(json, splitPath);
            };
        };
    })
   /**
    * @ngdoc service
    * @name billingApp.TransformJson
    * @description
    *
    * Strip $promise state from Json being returned in API calls via ngResource.
    */
     .factory('TransformJson', function () {
        return function (data) {
            return JSON.parse(angular.toJson(data));
        };
    })
   /**
    * @ngdoc filter
    * @name billingApp.LoadingValue
    * @description
    *
    * Display a value once it's promise/status has been set as complete
    * if it's not completed, show loading message
    * if value is falsy, show falsy msg
    * #TODO: Convert to a directive
    */
    .filter('LoadingValue', function (NOTFOUND_MSG, LOADING_MSG) {
        return function (val, completed, notFoundMsg, loadingMsg) {
            loadingMsg = loadingMsg ? loadingMsg : LOADING_MSG;
            notFoundMsg = notFoundMsg ? notFoundMsg : NOTFOUND_MSG;
            if (completed) {
                return val || notFoundMsg;
            }
            return loadingMsg;
        };
    })
/**
 *
 * @ngdoc service
 * @name encore.ui.rxModalUtil
 * @description
 * Common functionality when defining a controller for a modal
 * var modal = rxModalUtil.getModal($scope, defaultStackName, MESSAGES.downgrade, SupportResponseError);
 *
 * var downgradeAccount = function () {
 *     $scope.downgradeResult = SupportAccount.downgradeService($routeParams.accountNumber,
 *                                                              $scope.fields.ticketNumber);
 *     $scope.downgradeResult.$promise.then(modal.successClose('page'), modal.fail());
 *
 *     modal.processing($scope.downgradeResult.$promise);
 * };
 *
 * modal.clear();
 * $scope.submit = downgradeAccount;
 * $scope.cancel = $scope.$dismiss;
 */
    .factory('rxModalUtil', function (rxNotify) {
        var stacks = ['page'];
        var util = {};

        // Register stacks to be used when clearing them
        util.registerStacks = function () {
            stacks = stacks.concat(_.toArray(arguments));
            return stacks;
        };

        // Clear notifications that have been used by the controller
        util.clearNotifications = function () {
            _.each(stacks, rxNotify.clear, rxNotify);
            return stacks;
        };

        // Promise resolved callback for adding a notification
        util.success = function (message, stack) {
            return function () {
                return rxNotify.add(message, {
                    stack: stack,
                    type: 'success'
                });
            };
        };

        // Promise resolved callback for adding a notification and closing the modal
        util.successClose = function (scope, message, stack) {
            var success = util.success(message, stack);
            return function (data) {
                scope.$close(data);
                return success(data);
            };
        };

        // Promise reject callback for adding a notification
        util.fail = function (errorParser, message, stack) {
            return function (data) {
                if (_.isFunction(errorParser)) {
                    var responseMsg = errorParser(data);

                    if (!_.isEmpty(responseMsg)) {
                        message += ': (' + responseMsg.msg + ')';
                    }
                }

                return rxNotify.add(message, {
                    stack: stack,
                    type: 'error'
                });
            };
        };

        // Promise reject callback for adding a notification and dismissing the modal
        util.failDismiss = function (scope, errorParser, message, stack) {
            var fail = util.fail(errorParser, message, stack);
            return function (data) {
                scope.$dismiss(data);
                return fail(data);
            };
        };

        // Promise loading notification & postHook
        util.processing = function (scope, message, defaultStack) {
            return function (promise, stack) {
                util.clearNotifications();

                // Capture the instance of the loading notification in order to dismiss it once done processing
                var loading = rxNotify.add(message, {
                    stack: stack || defaultStack,
                    loading: true
                });

                promise.finally(function () {
                    rxNotify.dismiss(loading);
                });

                // Call the postHook (if) defined on succesful resolution
                if (scope.postHook) {
                    promise.then(scope.postHook);
                }

                return promise;
            };
        };

        // Create a modal controller instance for behavior of modal within a modal controller
        util.getModal = function (scope, defaultStack, messages, errorParser) {
            if (!(this instanceof util.getModal)) {
                return new util.getModal(scope, defaultStack, messages, errorParser);
            }
            messages = _.defaults(messages, {
                success: null,
                error: null,
                loading: null
            });
            util.registerStacks(defaultStack);
            this.processing = util.processing(scope, messages.loading, defaultStack);

            this.getStack = function (stack) {
                return stack || defaultStack;
            };
            this.success = function (stack) {
                return util.success(messages.success, this.getStack(stack));
            };
            this.successClose = function (stack) {
                return util.successClose(scope, messages.success, this.getStack(stack));
            };
            this.fail = function (stack) {
                return util.fail(errorParser, messages.error, this.getStack(stack));
            };
            this.failDismiss = function (stack) {
                return util.failDismiss(scope, errorParser, messages.error, this.getStack(stack));
            };
            this.clear = function () {
                return util.clearNotifications();
            };
        };

        return util;
    });
