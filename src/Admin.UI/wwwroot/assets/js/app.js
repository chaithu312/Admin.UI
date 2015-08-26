(function () {
    'use strict';

    var app = angular.module("mainApp", ['navsServices']);

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
})();

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
            return destination == '/' + window.location.pathname.split('/')[1];
        }
    }

    // in controller
})();

(function () {
    'use strict';
    var navsServices = angular.module('navsServices', ['ngResource']);
    navsServices.factory('Navs', ['$resource', function ($resource) {
        return $resource('/api/Navigation/', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    }]);
})();

(function () {
    angular.module('mainApp')
    .controller('UserController', function ($scope, RegistrationService) {
        $scope.submitText = "Register";
        $scope.submitted = false;
        $scope.message = '';
        $scope.isFormValid = false;
        $scope.User = {
            UserName: '',
            Password: '',
            ConfirmPassword: '',
            DomainKey: '',
        };
        //Check form Validation // here frmRegistration is our form name
        $scope.$watch('frmRegistration.$valid', function (newValue) {
            $scope.isFormValid = newValue;
        });
        //Save Data
        $scope.SaveData = function (data) {
            if ($scope.submitText == 'Register') {
                $scope.submitted = true;
                $scope.message = '';

                if ($scope.isFormValid) {
                    //TODO Hidden field
                    $scope.User.DomainKey = $("#DomainKey").val();
                    $scope.submitText = 'Please Wait...';
                    $scope.User = data;
                    RegistrationService.SaveFormData($scope.User).then(function (d) {
                        if (d == 'Success') {
                            //have to clear form here
                            ClearForm();
                            $window.location.href = '/user/Thankyou';
                        }
                        $scope.submitText = "Register";
                    });
                }
                else {
                    $scope.message = 'Please fill required fields value';
                }
            }
        }
        //Clear Form (reset)
        function ClearForm() {
            $scope.User = {};
            $scope.frmRegistration.$setPristine();
            $scope.submitted = false;
        }
    })
    .factory('RegistrationService', function ($http, $q) {
        var fac = {};

        fac.SaveFormData = function (data) {
            var defer = $q.defer();
            $http({
                url: '/user/Index',
                method: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
            }).success(function (d) {
                // Success callback
                defer.resolve(d);
            }).error(function (e) {
                //Failed Callback
                defer.reject(e);
            });
            return defer.promise;
        }
        return fac;
    });
})();

(function () {
    angular.module('mainApp')
    .controller('LoginController', function ($scope, LoginService) {
        $scope.submitText = "Login";
        $scope.submitted = false;
        $scope.message = '';
        $scope.isFormValid = false;
        $scope.User = {
            UserName: '',
            Password: '',
            DomainKey: '',
        };
        //Check form Validation // here frmRegistration is our form name
        $scope.$watch('frmLogin.$valid', function (newValue) {
            $scope.isFormValid = newValue;
        });
        //Save Data
        $scope.LoginData = function (data) {
            if ($scope.submitText == 'Login') {
                $scope.submitted = true;
                $scope.message = '';

                if ($scope.isFormValid) {
                    $scope.User.DomainKey = $("#DomainKey").val();
                    $scope.submitText = 'Please Wait...';
                    $scope.User = data;
                    LoginService.LoginForUser($scope.User).then(function (d) {
                        if (d == 'Success') {
                            //have to clear form here
                            ClearForm();
                            $window.location.href = 'Home/Index';
                        }
                        $scope.message = 'Invalid User & Password';
                        $scope.submitText = "Login";
                    });
                }
                else {
                    $scope.message = 'Please fill required fields value';
                }
            }
        }
        //Clear Form (reset)
        function ClearForm() {
            $scope.User = {};
            $scope.frmLogin.$setPristine();
            $scope.submitted = false;
        }
    })
    .factory('LoginService', function ($http, $q) {
        var fac = {};

        fac.LoginForUser = function (data) {
            var defer = $q.defer();
            $http({
                url: '/user/Login',
                method: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
            }).success(function (d) {
                // Success callback
                defer.resolve(d);
            }).error(function (e) {
                //Failed Callback
                defer.reject(e);
            });
            return defer.promise;
        }
        return fac;
    });
})();