﻿(function () {
    'use strict';

    var app = angular
        .module("mainApp", ['navsServices'])
        .config(function ($locationProvider) {
            $locationProvider.html5Mode(true);
        });

    app.directive('toggleSidebar', function () {
        return {
            restrict: 'E',
            template: '<!-- #section:basics/sidebar.mobile.toggle --> \
                       <button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler" data-target="#sidebar"> \
                        <span class="sr-only">Toggle sidebar</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span> \
                       </button> \
                       <!-- /section:basics/sidebar.mobile.toggle -->'
        }
    })

    app.directive('navbarHeader', function () {
        return {
            restrict: 'E',
            scope: {
                caption: '@caption'
            },
            template: ' <div class="navbar-header pull-left"> \
                            <!-- #section:basics/navbar.layout.brand --> \
                            <a href="#" class="navbar-brand"> \
                                <small> \
                                    <i class="fa fa-leaf"></i> \
                                    {{caption}} \
                                </small> \
                            </a> \
                            <!-- /section:basics/navbar.layout.brand --> \
                        </div>'
        }
    })

    app.directive('sidebarMinimize', function () {
        return {
            restrict: 'E',
            template: ' <!-- #section:basics/sidebar.layout.minimize --> \
                        <div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse"> \
                            <i class="ace-icon fa fa-angle-double-left" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i> \
                        </div> \
                        <!-- /section:basics/sidebar.layout.minimize -->'
        }
    })
<<<<<<< HEAD:src/Admin.UI/Assets/js/app.js
})();

//-- Navigation Controller for left navigation
=======

    //the module we are demonstrating:
    app.directive('autoActive', ['$location', '$timeout', function ($location, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                function setActive() {
                    var path = $location.path();
                    if (path) {
                        angular.forEach(element.find('li'), function (li) {
                            console.log(li)
                            var anchor = li.querySelector('a');
                            if (anchor.href.match(path + '(?=\\?|$)')) {
                                angular.element(li).addClass('active');
                            } else {
                                angular.element(li).removeClass('active');
                            }
                        });
                    }
                }
                $timeout(setActive());
                scope.$on('$locationChangeSuccess', setActive);
            }
        }
    }]);
})();

//-- Navigation Controller
>>>>>>> 2e58373c1d71618c4684d77f735a0df0f488a0a4:src/Admin.UI/Assets/js/angular-app.js
(function () {
    
    'use strict';
    angular.module('mainApp').controller('navsController', navsController)
    navsController.$inject = ['$scope', 'Navs'];
    function navsController($scope, Navs) {
        $scope.init = function () {
            $scope.navs = Navs.query();
        },
        $scope.isActive = function (destination) {
            console.log(window.location.pathname);
            return destination == window.location.pathname;
        }
        $scope.isOpen = function (destination) {
            console.log(window.location.pathname);
            return destination == '/'+window.location.pathname.split('/')[1];
        }
    }

<<<<<<< HEAD:src/Admin.UI/Assets/js/app.js
=======
    //window.location.hash = '#/'; //All hash paths need to start with a /, it happens automaticaly with ngResource and the like...


>>>>>>> 2e58373c1d71618c4684d77f735a0df0f488a0a4:src/Admin.UI/Assets/js/angular-app.js
    // in controller
})();
<<<<<<< HEAD:src/Admin.UI/Assets/js/app.js
//-- Navigation Services for left navigation
=======

//-- Navigation Services
>>>>>>> 2e58373c1d71618c4684d77f735a0df0f488a0a4:src/Admin.UI/Assets/js/angular-app.js
(function () {
    'use strict';
    var navsServices = angular.module('navsServices', ['ngResource']);
    navsServices.factory('Navs', ['$resource', function ($resource) {
        return $resource('/api/Navigation/', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    }]);
})();
<<<<<<< HEAD:src/Admin.UI/Assets/js/app.js
=======

//--UserController for registration

//var app = angular.module("myApp", []);
//app.controller("userCntrl", function ($scope, $http) {
//    alert("hi");
//    if (!Valid) {
//        alert("Invalid form");
//        return;
//    } else {
//        alert("It's Great. Form Submitted");
//    }

//    $scope.Save = function (Valid) {
//        if (!Valid) {
//            alert("Invalid form");
//            return;
//        } else {
//            alert("It's Great. Form Submitted");
//        }
//    }
//});
>>>>>>> 2e58373c1d71618c4684d77f735a0df0f488a0a4:src/Admin.UI/Assets/js/angular-app.js
