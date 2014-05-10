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
    * @ngdoc filter
    * @name billingApp.LoadingValue
    * @description
    *
    * Display a value once it's promise/status has been set as complete
    * if it's not completed, show loading message
    * if value is falsy, show falsy msg
    */
    .filter('LoadingValue', function () {
        return function (val, completed, notFoundMsg, loadingMsg) {
            loadingMsg = loadingMsg ? loadingMsg : 'Loading...';
            notFoundMsg = notFoundMsg ? notFoundMsg : '(Not Available)';
            if (completed) {
                return val || notFoundMsg;
            }
            return loadingMsg;
        };
    });