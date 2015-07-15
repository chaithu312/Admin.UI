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
//-- Navigation Controller
(function () {
    'use strict';
    angular.module('mainApp').controller('navsController', navsController)
    navsController.$inject = ['$scope', 'Navs'];
    function navsController($scope, Navs) {
        $scope.navs = Navs.query();
    }
})();
//-- Navigation Services
(function () {
    'use strict';
    var navsServices = angular.module('navsServices', ['ngResource']);
    navsServices.factory('Navs', ['$resource', function ($resource) {
        return $resource('/api/Navigation/', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    }]);
})();

//--userController
(function () {
    angular.module('myApp', [])
       .controller('Usercontroller', ['$scope', function ($scope) {
      $scope.formInfo = {};
      $scope.saveData = function () {
          alert("SaveData");
          $scope.nameRequired = '';
          $scope.emailRequired = '';
          $scope.passwordRequired = '';

          if (!$scope.formInfo.Email) {
              $scope.nameRequired = 'Name Required';
          }

          if (!$scope.formInfo.Email) {
              $scope.emailRequired = 'Email Required';
          }

          if (!$scope.formInfo.Password) {
              $scope.passwordRequired = 'Password Required';
          }
      };
  }])
 
})();

