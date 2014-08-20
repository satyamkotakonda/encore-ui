angular.module('encore.ui.rxApp', ['encore.ui.rxEnvironment', 'ngSanitize', 'ngRoute', 'cfp.hotkeys'])
/*
 * This array defines the default navigation to use for all Encore sites and used by rxAppNav.
 * It can be overwritten if necessary via the 'menu' property of rxAppNav.
 *
 * @property {string} title Only used on the top level, defines the title to use for all sub-navigation
 *
 * Common Properties for all 'children' nav items:
 * @property {string} [key] ID to use for getter/setter methods by apps. Needs to be unique.
 * @property {string|object} href Url to use for the menu item or object to passed to rxEnvironmentUrl
 * @property {string} linkText The text displayed for the menu item
 * @property {array} children Child menu items for the navigation heirarchy
 * @property {string} directive Name of directive to build and show when item is active. For example:
 *                              Value of 'my-directive' becomes '<my-directive></my-directive>'
 * @property {expression|function} [childVisibility] Rule to determine visibility of child menu
 * @property {expression} [childHeader] Expression which will be displayed above child menu. Access controller
 * scope via: `route.current.scope` @see http://devdocs.io/angular/ngroute.$route#properties_current
 *
 */
.value('encoreNav', [{
    title: 'All Tools',
    children: [{
        linkText: 'Account',
        key: 'accountLvlTools',
        directive: 'rx-account-search',
        childVisibility: function (scope) {
            if (scope.route.current) {
                return !_.isUndefined(scope.route.current.pathParams.accountNumber);
            }

            return false;
        },
        children: [
            {
                href: '/accounts/{{accountNumber}}',
                key: 'accountOverview',
                linkText: 'Overview'
            },
            {
                linkText: 'Billing',
                key: 'accountBilling',
                visibility: '("unified-preprod" | rxEnvironmentMatch) || ("local" | rxEnvironmentMatch)',
                childVisibility: function (scope) {
                    // We only want to show this nav if accountNumber is already defined in the URL
                    // (otherwise a accountNumber hasn't been chosen yet, so nav won't work, so we hide it)
                    if (scope.route.current) {
                        return !_.isUndefined(scope.route.current.pathParams.accountNumber);
                    }
                    return false;
                },
                children: [
                    {
                        href: '/billing/overview/{{accountNumber}}',
                        key: 'accountBillingOverview',
                        linkText: 'Overview'
                    }, {
                        href: '/billing/transactions/{{accountNumber}}',
                        key: 'accountBillingTransactions',
                        linkText: 'Transactions'
                    }, {
                        href: '/billing/usage/{{accountNumber}}',
                        key: 'accountBillingCurrentUsage',
                        linkText: 'Current Usage'
                    }, {
                        href: '/billing/payment/{{accountNumber}}/options',
                        key: 'accountBillingPaymentOptions',
                        linkText: 'Payment Options'
                    }, {
                        href: '/billing/purchase-orders/{{accountNumber}}',
                        key: 'accountBillingPurchaseOrders',
                        linkText: 'Purchase Orders'
                    }, {
                        href: '/billing/preferences/{{accountNumber}}',
                        key: 'accountBillingPreferences',
                        linkText: 'Preferences'
                    }
                ]
            }, {
                href: '/support/accounts/{{accountNumber}}',
                linkText: 'Support Details',
                key: 'accountSupport'
            }
        ]
    },
    {
        linkText: 'Billing',
        key: 'billing',
        directive: 'rx-billing-search',
        visibility: '("unified-preprod" | rxEnvironmentMatch) || ("local" | rxEnvironmentMatch)'
    },
    {
        linkText: 'Cloud',
        key: 'cloud',
        directive: 'rx-atlas-search',
        childVisibility: function (scope) {
            // We only want to show this nav if user is already defined in the URL
            // (otherwise a user hasn't been chosen yet, so nav won't work, so we hide it)
            if (scope.route.current) {
                return !_.isUndefined(scope.route.current.pathParams.user);
            }
            return false;
        },
        childHeader: '<strong class="current-search">Current Account:</strong>' +
            '<span class="current-result">{{route.current.pathParams.user}}</span>',
        children: [
            {
                href: '/cloud/{{user}}/servers',
                linkText: 'Cloud Servers',
                children: [
                    {
                        href: '/cloud/{{user}}/servers',
                        linkText: 'Servers'
                    }, {
                        href: '/cloud/{{user}}/images',
                        linkText: 'Images'
                    }
                ]
            },
            {
                href: '/cloud/{{user}}/cbs/volumes',
                linkText: 'Block Storage',
                children: [
                    {
                        href: '/cloud/{{user}}/cbs/volumes',
                        linkText: 'Volumes'
                    }, {
                        href: '/cloud/{{user}}/cbs/snapshots',
                        linkText: 'Snapshots'
                    }
                ]
            }, {
                href: '/cloud/{{user}}/databases/instances',
                linkText: 'Databases'
            }, {
                href: '/cloud/{{user}}/loadbalancers',
                linkText: 'Load Balancers'
            }, {
                href: '/cloud/{{user}}/networks',
                linkText: 'Networks'
            }
        ]
    }, {
        href: '/support',
        linkText: 'Support Service',
        key: 'supportService',
        directive: 'rx-support-service-search',
    }, {
        href: '/ticketing',
        linkText: 'Ticketing',
        key: 'ticketing',
        children: [
            {
                href: '/ticketing/list',
                linkText: 'My Selected Queues'
            },
            {
                href: '/ticketing/my',
                linkText: 'My Tickets'
            }, {
                href: '/ticketing/queues',
                linkText: 'Queue Admin'
            }
        ]
    }, {
        href: '/virt',
        linkText: 'Virtualization Admin',
        key: 'virt',
        directive: 'rx-virt-search'
    }, {
        linkText: 'Support Automation',
        key: 'supportAutomation',
        children: [
            {
                href: '/dcx/windows-cluster-build/validate',
                linkText: 'Windows Cluster Build'
            }
        ]
    }]
}])
/**
* @ngdoc interface
* @name encore.ui.rxApp:rxAppRoutes
* @description
* Manages page routes, building urls and marking them as active on route change
*/
.service('rxAppRoutes', function ($rootScope, $location, $route, $interpolate, rxEnvironmentUrlFilter, $log) {
    var AppRoutes = function () {
        var routes = [];

        var stripLeadingChars = function (str) {
            _.forEach(['#', '/'], function (chr) {
                if (str.substring(0, 1) === chr) {
                    str = stripLeadingChars(str.substring(1));
                }
            });

            return str;
        };

        var getBaseUrl = function () {
            // remove query string
            var baseUrl = $location.absUrl().split('?')[0];

            // remove protocol and domain
            baseUrl = baseUrl.split('/').splice(3).join('/');
            baseUrl = stripLeadingChars(baseUrl);

            return baseUrl;
        };

        var getItemUrl = function (item) {
            if (!_.isString(item.url)) {
                return undefined;
            }

            // remove query string
            var itemUrl = item.url.split('?')[0];
            itemUrl = stripLeadingChars(itemUrl);

            return itemUrl;
        };

        var isActive = function (item) {
            // check if url matches absUrl
            // TODO: Add Unit Tests for URLs with Query Strings in them.
            var baseUrl = getBaseUrl();
            var itemUrl = getItemUrl(item);
            var pathMatches = itemUrl &&
                (baseUrl.substring(0, itemUrl.length) === itemUrl ||
                 baseUrl.substring(1).substring(0, itemUrl.length) === itemUrl);

            // if current item not active, check if any children are active
            if (!pathMatches && item.children) {
                pathMatches = _.any(item.children, isActive);
            }

            return pathMatches;
        };

        var buildUrl = function (url) {
            // sometimes links don't have URLs defined, so we need to exit before $interpolate throws an error
            if (_.isUndefined(url)) {
                return url;
            }

            // run the href through rxEnvironmentUrl in case it's defined as such
            url = rxEnvironmentUrlFilter(url);

            if ($route.current) {
                // convert any nested expressions to defined route params
                url = $interpolate(url)($route.current.pathParams);
            }

            return url;
        };

        var setDynamicProperties = function (routes) {
            _.each(routes, function (route) {
                // build out url for current route
                route.url = buildUrl(route.href);

                // check if any children exist, if so, build their URLs as well
                if (route.children) {
                    route.children = setDynamicProperties(route.children);
                }

                // set active state (this needs to go after the recursion,
                // so that the URL is built for all the children)
                route.active = isActive(route);
            });

            return routes;
        };

        var getRouteIndex = function (key, routes) {
            var routeIndex;
            var routeAlreadyFound = false;

            _.forEach(routes, function (route, index) {
                var foundThisTime = false;
                if (route.key === key) {
                    routeIndex = [index];
                    foundThisTime = true;
                } else if ('children' in route) {
                    // if there are children in the route, we need to search through them as well
                    var childIndex = getRouteIndex(key, route.children);
                    if (childIndex) {
                        routeIndex = [index].concat(childIndex);
                        foundThisTime = true;
                    }
                }
                if (foundThisTime) {
                    if (routeAlreadyFound) {
                        $log.warn('Duplicate routes found for key: ' + key);
                    } else {
                        routeAlreadyFound = true;
                    }
                }
            });

            return routeIndex;
        };

        var updateRouteByIndex = function (indexes, routeInfo, routes, level) {
            var route = routes[indexes[0]];

            if (level < indexes.length - 1) {
                // if there's more than one index, we need to recurse down a level
                route.children = updateRouteByIndex(indexes.slice(1), routeInfo, route.children, level + 1);
            } else {
                _.assign(route, routeInfo);
            }

            return routes;
        };

        $rootScope.$on('$locationChangeSuccess', function () {
            routes = setDynamicProperties(routes);
        });

        return {
            /**
             * Finds the indexes/path to a route. Will return last match if duplicate keys exist
             * @see setRouteByKey for actual use
             * @param  {string} key Route Key
             * @example
             *     var myRouteIndex = rxAppRoutes.getIndexByKey('myKey'); // [0, 2, 0]
             * @return {array|undefined} array of indexes describing path to route (or undefined if not found)
             */
            getIndexByKey: function (key) {
                var routeIndex = getRouteIndex(key, routes);

                if (_.isUndefined(routeIndex)) {
                    $log.debug('Could not find route by key: ', key);
                }

                return routeIndex;
            },
            /**
             * functionality to update routes based on their key
             * @param {string} key Route key used to identify it in navigation
             * @param {object} routeInfo Information used to overwrite original properties
             * @return {boolean} true if successfully updated, false if key not found
             */
            setRouteByKey: function (key, routeInfo) {
                var routeIndex = this.getIndexByKey(key);

                // make sure the key was found
                if (routeIndex) {
                    routes = updateRouteByIndex(routeIndex, routeInfo, routes, 0);

                    // now that we've updated the route info, we need to reset the dynamic properties
                    routes = setDynamicProperties(routes);

                    return true;
                } else {
                    return false;
                }
            },
            getAll: function () {
                return routes;
            },
            setAll: function (newRoutes) {
                routes = setDynamicProperties(newRoutes);
            }
        };
    };

    var appRoutesInstance = new AppRoutes();

    appRoutesInstance.createInstance = function () {
        return new AppRoutes();
    };

    return appRoutesInstance;
})
// We need to set the default rxAppRoutes navigation before the app's load so that they can update
// it in their `run` statement if need be.
.run(function (rxAppRoutes, encoreNav) {
    rxAppRoutes.setAll(encoreNav);
})
/**
* @ngdoc directive
* @name encore.ui.rxApp:rxApp
* @restrict E
* @scope
* @description
* Responsible for creating the HTML necessary for a common Encore layout.
*
* @param {string} [siteTitle] Title of site to use in upper right hand corner
* @param {array} [menu] Menu items used for left-hand navigation
* @param {string} [collapsibleNav] Set to 'true' if the navigation menu should be collapsible
* @param {string} [collapsedNav] Binding for the collapsed state of the menu.
* @param {boolean} [newInstance] Whether the menu items should be a new instance of rxAppRoutes
* @param {boolean} [hideFeeback] Whether to hide the 'feedback' link or not (defaults to show it)
* @param {string} [logoutUrl] URL to pass to rx-logout
*
* @example
* <pre>
*     <rx-app site-title="Custom Title"></rx-app>
* </pre>
*/
.directive('rxApp', function (rxAppRoutes, hotkeys) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/rxApp.html',
        scope: {
            siteTitle: '@?',
            menu: '=?',
            collapsibleNav: '@',
            collapsedNav: '=?',
            newInstance: '@?',
            hideFeedback: '@?',
            logoutUrl: '@?'
        },
        link: function (scope) {
            scope.appRoutes = scope.newInstance ? rxAppRoutes.createInstance() : rxAppRoutes;

            // default hideFeedback to false
            scope.hideFeedback = scope.hideFeedback ? true : false;

            // we only want to set new menu data if a new instance of rxAppRoutes was created
            // or if scope.menu was defined
            if (scope.newInstance || scope.menu) {
                scope.appRoutes.setAll(scope.menu);
            }

            if (scope.collapsibleNav) {
                hotkeys.add({
                    combo: 'ctrl+h',
                    description: 'Show/hide the main menu',
                    callback: function () {
                        scope.collapsedNav = !scope.collapsedNav;
                    }
                });
            }
        }
    };
})
/**
* @ngdoc directive
* @name encore.ui.rxApp:rxPage
* @restrict E
* @scope
* @description
* Responsible for creating the HTML necessary for a page (including breadcrumbs and page title)
*
* @param {expression} [title] Title of page
* @param {expression} [subtitle] Subtitle of page
*
* @example
* <pre>
*     <rx-page title="'Page Title'"></rx-page>
* </pre>
*/
.directive('rxPage', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/rxPage.html',
        scope: {
            title: '=',
            subtitle: '=',
        },
        link: function (scope, element) {
            // Remove the title attribute, as it will cause a popup to appear when hovering over page content
            // @see https://github.com/rackerlabs/encore-ui/issues/251
            element.removeAttr('title');
        },
        controller: function ($scope, rxPageTitle) {
            $scope.$watch('title', function () {
                rxPageTitle.setTitle($scope.title);
            });
        }
    };
})
/**
* @ngdoc directive
* @name encore.ui.rxApp:rxAppNav
* @restrict E
* @scope
* @description
* Creates a menu based on items passed in.
*
* @param {object} items Menu items to display. See encoreNav for object definition
* @param {string} level Level in heirarchy in page. Higher number is deeper nested
*
* @example
* <pre>
*     <rx-app-nav level="1" items="menuItems"></rx-app-nav>
* </pre>
*/
.directive('rxAppNav', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/rxAppNav.html',
        scope: {
            items: '=',
            level: '='
        }
    };
})
/**
* @ngdoc directive
* @name encore.ui.rxApp:rxAppNavItem
* @restrict E
* @description
* Creates a menu item. Recursively creates rx-app-nav if 'children' present.
* 'Item' must be avialable via scope
*
* @example
* <pre>
*     <rx-app-nav-item ng-repeat="item in items"></rx-app-nav-item>
* </pre>
*/
.directive('rxAppNavItem', function ($compile, $location, $route) {
    var linker = function (scope, element) {
        var injectContent = function (selector, content) {
            var el = element[0].querySelector(selector);
            el = angular.element(el);

            $compile(content)(scope, function (compiledHtml) {
                el.append(compiledHtml);
            });
        };

        var directiveHtml = '<directive></directive>';
        // add navDirective if defined
        if (angular.isString(scope.item.directive)) {
            // convert directive string to HTML
            // e.g. my-directive -> <my-directive></my-directive>
            directiveHtml = directiveHtml.replace('directive', scope.item.directive);

            injectContent('.item-directive', directiveHtml);
        }

        // increment nesting level for child items
        var childLevel = scope.$parent.level + 1;
        // safety check that child level is a number
        if (isNaN(childLevel)) {
            childLevel = 2;
        }
        // add children if present
        // Note: this can't be added in the HTML due to angular recursion issues
        var rxNavTemplate = '<rx-app-nav items="item.children" level="' + childLevel + '">' +
            '</rx-app-nav>';
        if (angular.isArray(scope.item.children)) {
            injectContent('.item-children', rxNavTemplate);
        }
    };

    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/rxAppNavItem.html',
        link: linker,
        scope: {
            item: '='
        },
        controller: function ($scope, $location) {
            // provide `route` as a scope property so that links can tie into them
            $scope.route = $route;

            $scope.isVisible = function (visibility) {
                if (_.isUndefined(visibility)) {
                    // if undefined, default to true
                    return true;
                }

                return $scope.$eval(visibility, {
                    location: $location
                });
            };

            $scope.toggleNav = function (ev, href) {
                // if no href present, simply toggle active state
                if (_.isEmpty(href)) {
                    ev.preventDefault();
                    $scope.item.active = !$scope.item.active;
                }
                // otherwise, let the default nav do it's thing
            };
        }
    };
})
/**
* @ngdoc directive
* @name encore.ui.rxApp:rxAppSearch
* @restrict E
* @scope
* @description
* Creates a search input form for navigation
*
* @param {string} [placeholder] Title of page
* @param {*} [model] Model to tie input form to (via ng-model)
* @param {function} [submit] Function to run on submit (model is passed as only argument to function)
*
*/
.directive('rxAppSearch', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/rxAppSearch.html',
        scope: {
            placeholder: '@?',
            model: '=?',
            submit: '=?',
            pattern: '@?'
        }
    };
})
/**
* @ngdoc directive
* @name encore.ui.rxApp:rxAtlasSearch
* @restrict E
* @description
* Used to search accounts for Cloud Atlas
*/
.directive('rxAtlasSearch', function ($window) {
    return {
        template: '<rx-app-search placeholder="Search by username..." submit="searchAccounts"></rx-app-search>',
        restrict: 'E',
        link: function (scope) {
            scope.searchAccounts = function (searchValue) {
                if (!_.isEmpty(searchValue)) {
                    $window.location = '/cloud/' + searchValue + '/servers/';
                }
            };
        }
    };
})
.directive('rxAccountSearch', function ($window) {
    return {
        templateUrl: 'templates/rxAccountSearch.html',
        restrict: 'E',
        link: function (scope) {
            scope.fetchAccount = function (searchValue) {
                if (!_.isEmpty(searchValue)) {
                    $window.location = '/search?term=' + searchValue;
                }
            };
        }
    };
})
.directive('rxBillingSearch', function ($window) {
    return {
        template: '<rx-app-search placeholder="Fetch account by transaction or auth ID..." submit="fetchAccounts">' +
            '</rx-app-search>',
        restrict: 'E',
        link: function (scope) {
            scope.fetchAccounts = function (searchValue) {
                if (!_.isEmpty(searchValue)) {
                    $window.location = '/billing/search/' + searchValue;
                }
            };
        }
    };
})

/**
* @ngdoc directive
* @name encore.ui.rxApp:rxTicketSearch
* @restrict E
* @description
* Used to search tickets for Ticket Queues
*/
.directive('rxTicketSearch', function () {
    return {
        template: '<rx-app-search placeholder="Search for a Ticket..." submit="searchTickets"></rx-app-search>',
        restrict: 'E',
        link: function (scope) {
            // TQTicketSelection.loadTicket.bind(TQTicketSelection)
            scope.searchTickets = function () {
                // TODO do something here
            };
        }
    };
});
