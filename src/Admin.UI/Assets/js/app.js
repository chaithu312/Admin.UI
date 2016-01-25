(function () {
    'use strict';

    var app = angular.module("mainApp", ['navsServices']);

    app.directive('myTable', function () {
        return function (scope, element, attrs) {
            // apply DataTable options, use defaults if none specified by user
            var options = {};
            if (attrs.myTable.length > 0) {
                options = scope.$eval(attrs.myTable);
            } else {
                options = {
                    "scrollY": "200px",
                    "scrollCollapse": true,
                    "bStateSave": true,
                    "iCookieDuration": 2419200,
                    /* 1 month */
                    "bJQueryUI": true,
                    "bPaginate": false,
                    "bLengthChange": false,
                    "bFilter": false,
                    "bInfo": false,
                    "bDestroy": true,
                    "buttons": [
          { extend: "create", editor: editor },
          { extend: "edit", editor: editor },
          { extend: "remove", editor: editor }
                    ]
                };
            }

            // Tell the dataTables plugin what columns to use
            // We can either derive them from the dom, or use setup from the controller
            var explicitColumns = [];
            element.find('th').each(function (index, elem) {
                explicitColumns.push($(elem).text());
            });
            if (explicitColumns.length > 0) {
                options["aoColumns"] = explicitColumns;
            } else if (attrs.aoColumns) {
                options["aoColumns"] = scope.$eval(attrs.aoColumns);
            }

            // aoColumnDefs is dataTables way of providing fine control over column config
            if (attrs.aoColumnDefs) {
                options["aoColumnDefs"] = scope.$eval(attrs.aoColumnDefs);
            }

            if (attrs.fnRowCallback) {
                options["fnRowCallback"] = scope.$eval(attrs.fnRowCallback);
            }

            // apply the plugin
            var dataTable = element.dataTable(options);

            // watch for any changes to our data, rebuild the DataTable
            scope.$watch(attrs.aaData, function (value) {
                var val = value || null;
                if (val) {
                    dataTable.fnClearTable();
                    dataTable.fnAddData(scope.$eval(attrs.aaData));
                }
            });
        };
    });

    app.directive('breadcrumb', function () {
        return {
            restrict: 'E',
            template: '<ul class=\"breadcrumb\"><li><i class=\"ace-icon fa fa-home home-icon\"></i><a href=\"#\">Home</a></li><li><a href=\"#\">' + window.location.pathname.split('/')[1] + '</a></li><li class=\"active\">' + window.location.pathname.split('/')[2] + '</li></ul>'
        }
    })

    app.directive('header', function () {
        return {
            restrict: 'E',
            template: '<h1>' + window.location.pathname.split('/')[2] + '</h1>'
        }
    })

    app.directive('username', function () {
        return {
            restrict: 'E',
            templateUrl: '/User/GetUserName'
        }
    })

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

    app.directive('validateEmail', function () {
        var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        return {
            require: 'ngModel',
            link: function (scope, elm, attr, ctrl) {
                elm.on("keyup", function () {
                    var isMatchRegex = EMAIL_REGEXP.test(elm.val());
                    if (isMatchRegex && elm.hasClass('warning') || elm.val() == '') {
                        elm.removeClass('warning');
                        ctrl.$setValidity('invalid', true);
                    } else if (isMatchRegex == false && !elm.hasClass('warning')) {
                        elm.addClass('warning');
                        ctrl.$setValidity('invalid', false);
                    }
                });
            }
        }
    });


    var vendor = function ($http) {
        var vendor = {};
        vendor.data = function () {
            return $http.get("http://test.shipos.com/shipping/VendorSetting/GetVendorByAccountId?accountId=2&orderby=AccountId&sortdir=ASC");
        }

        return vendor;
    }

    app.factory("vendor", vendor);

    var virtualDir = function ($http) {
        var virtualDirURL = {};
        virtualDirURL.AdminURL = "";
        return virtualDirURL;
    }
    app.factory("virtualDir", virtualDir);

    app.factory('getQueryStringValue', function ($window) {
        return {
            getValue: function (keyToMatch) {
                var locationSearch = $window.location.search;
                var sURLVariables = locationSearch.split(/[&||?]/);
                var res = null;
                for (var i = 0; i < sURLVariables.length; i += 1) {
                    var paramName = sURLVariables[i],
                        sParameterName = (paramName || '').split('=');

                    if (sParameterName[0] === keyToMatch) {
                        res = sParameterName[1];
                        break;
                    }
                }
                return res;
            }
        }
    });
    app.factory('ShipOSFactory', function ($http) {

        var ShipOSFactory = {};
        ShipOSFactory.GetServices = function () {
            return $http.get("/Freight/Services");
        }
        ShipOSFactory.ProcessedTypes = function () {
            return $http.get("/Freight/ProcessedTypes");
        }
        return ShipOSFactory;
    });
})();

//-- Navigation Controller for left navigation
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
//-- Navigation Services for left navigation
(function () {
    'use strict';
    var navsServices = angular.module('navsServices', ['ngResource']);
    navsServices.factory('Navs', ['$resource', function ($resource) {
        return $resource('/api/Navigation/', {}, {
            query: { method: 'GET', params: {}, isArray: true }
        });
    }]);
})();

//datepicker plugin
//link
var dateToday = new Date();
$('.date-picker').datepicker({
    autoclose: true,
    startDate: '-0m',
    dateFormat: "yyyy/mm/dd"
})

//show datepicker when clicking on the icon
.next().on(ace.click_event, function () {
    $(this).prev().focus();
});

$('#timepicker1').timepicker({
    minuteStep: 1,
    showSeconds: false,
    showMeridian: false
}).next().on(ace.click_event, function () {
    $(this).prev().focus();
});

$('#timepicker2').timepicker({
    minuteStep: 1,
    showSeconds: false,
    showMeridian: false
}).next().on(ace.click_event, function () {
    $(this).prev().focus();
});

$('.shippingTimepicker').timepicker({
    minuteStep: 1,
    showSeconds: false,
    showMeridian: false
}).next().on(ace.click_event, function () {
    $(this).prev().focus();
});

//or change it into a date range picker
$('.input-daterange').datepicker({ autoclose: true });

//to translate the daterange picker, please copy the "examples/daterange-fr.js" contents here before initialization
$('input[name=date-range-picker]').daterangepicker({
    'applyClass': 'btn-sm btn-success'
});

$('[data-rel=popover]').popover({ container: 'body' });