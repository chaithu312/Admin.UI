!function(){"use strict";var a=angular.module("mainApp",["navsServices"]);a.directive("toggleSidebar",function(){return{restrict:"E",template:'<!-- #section:basics/sidebar.mobile.toggle -->                        <button type="button" class="navbar-toggle menu-toggler pull-left" id="menu-toggler" data-target="#sidebar">                         <span class="sr-only">Toggle sidebar</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>                        </button>                        <!-- /section:basics/sidebar.mobile.toggle -->'}}),a.directive("navbarHeader",function(){return{restrict:"E",scope:{caption:"@caption"},template:' <div class="navbar-header pull-left">                             <!-- #section:basics/navbar.layout.brand -->                             <a href="#" class="navbar-brand">                                 <small>                                     <i class="fa fa-leaf"></i>                                     {{caption}}                                 </small>                             </a>                             <!-- /section:basics/navbar.layout.brand -->                         </div>'}}),a.directive("sidebarMinimize",function(){return{restrict:"E",template:' <!-- #section:basics/sidebar.layout.minimize -->                         <div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">                             <i class="ace-icon fa fa-angle-double-left" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>                         </div>                         <!-- /section:basics/sidebar.layout.minimize -->'}})}(),function(){"use strict";function a(a,b){a.init=function(){a.navs=b.query()}}angular.module("mainApp").controller("navsController",a),a.$inject=["$scope","Navs"],window.location.hash="#/",function(){angular.module("autoActive",[]).directive("autoActive",["$location",function(a){return{restrict:"A",scope:!1,link:function(b,c){function d(){var b=a.path();b&&angular.forEach(c.find("li"),function(a){var c=a.querySelector("a");c.href.match("#"+b+"(?=\\?|$)")?angular.element(a).addClass("active"):angular.element(a).removeClass("active")})}d(),b.$on("$locationChangeSuccess",d)}}}])}()}(),function(){"use strict";var a=angular.module("navsServices",["ngResource"]);a.factory("Navs",["$resource",function(a){return a("/api/Navigation/",{},{query:{method:"GET",params:{},isArray:!0}})}])}();