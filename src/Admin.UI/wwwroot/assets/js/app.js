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
$('.date-picker').datepicker({
    autoclose: true,
    todayHighlight: true
})
//show datepicker when clicking on the icon
.next().on(ace.click_event, function () {
    $(this).prev().focus();
});

$('#timepicker1').timepicker({
    minuteStep: 1,
    showSeconds: true,
    showMeridian: false
}).next().on(ace.click_event, function () {
    $(this).prev().focus();
});

$('#timepicker2').timepicker({
    minuteStep: 1,
    showSeconds: true,
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
(function () {
    function SignUpController($scope) {
        alert("a");
        $scope.text = 'me@example.com';
        $scope.pattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    }

    var app = angular.module('mainApp')
    app.controller('SignUpController', function ($scope, $http) {
        $scope.person = {};
        $scope.sendForm = function () {
            $http({
                method: 'POST',
                url: '/user/Index',
                data: $scope.person,
                headers: {
                    'RequestVerificationToken': $scope.antiForgeryToken
                }
            }).success(function (data, status, headers, config) {
                $scope.message = '';
                if (data.success == false) {
                    var str = '';
                    for (var error in data.errors) {
                        str += data.errors[error] + '\n';
                    }
                    $scope.message = str;
                }
                else {
                    $scope.message = 'Saved Successfully';
                    $scope.person = {};
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        };
    });
    /* Directives */
    app.directive('ngUnique', ['$http', function (async) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                elem.on('blur', function (evt) {
                    scope.$apply(function () {
                        var ajaxConfiguration = {
                            method: 'GET', url: '/user/IsUserAvailable?userName=' + elem.val()
                        };
                        async(ajaxConfiguration)
                            .success(function (data, status, headers, config) {
                                ctrl.$setValidity('unique', data.result);
                            });
                    });
                });
            }
        }
    }]);
})();
(function () {
    var app = angular.module('mainApp')
    app.controller('LoginController', function ($scope, $http) {
        $scope.person = {};
        $scope.sendForm = function () {
            $http({
                method: 'POST',
                url: '/user/Login',
                data: $scope.person,
                headers: {
                    'RequestVerificationToken': $scope.antiForgeryToken
                }
            }).success(function (data, status, headers, config) {
                $scope.message = '';
                if (data.success == false) {
                    var str = '';
                    for (var error in data.errors) {
                        str += data.errors[error] + '\n';
                    }
                    $scope.message = str;
                }
                else {
                    $scope.message = 'Login Successfully';
                    $scope.person = {};
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        };
    });
})();
(function () {
    var app = angular.module('mainApp')
    app.controller('PickupRequestController', function ($scope, $http) {
        $scope.Contacts = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Account 1' }, { Id: 2, Name: 'Account 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };
        $scope.Addresses = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Address 1' }, { Id: 2, Name: 'Address 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };
        $scope.States = { Data: [{ Id: 1, Name: 'Address 1' }, { Id: 2, Name: 'Address 2' }] };

        $scope.Pieces = {
            Data: [{ Id: 1, Name: '1' },
                { Id: 2, Name: '2' },
                { Id: 3, Name: '3' },
                { Id: 4, Name: '4' },
                { Id: 5, Name: '5' },
                { Id: 6, Name: '6' },
                { Id: 7, Name: '7' },
                { Id: 8, Name: '8' },
                { Id: 9, Name: '9' },
                { Id: 10, Name: '10' },
                { Id: 11, Name: '11' },
                { Id: 12, Name: '12' },
                { Id: 13, Name: '13' },
                { Id: 14, Name: '14' },
                { Id: 15, Name: '15' },
                { Id: 16, Name: '16' },
                { Id: 17, Name: '17' },
                { Id: 18, Name: '18' },
                { Id: 19, Name: '19' },
                { Id: 20, Name: '20' },

            ], selectedOption: { Id: 1, Name: '1' }
        };

        $scope.Destination = { Data: [{ Id: 0, Name: 'Domestic' }], selectedOption: { Id: 0, Name: 'Domestic' } };
        $scope.PickupAgent = { Data: [{ Id: 0, Name: 'Select...' }, { Id: 1, Name: 'DHL' }, { Id: 2, Name: 'Endicia' }, { Id: 3, Name: 'FedEx' }], selectedOption: { Id: 0, Name: 'Select...' } };
        $scope.PickupType = { Data: [{ Id: 0, Name: 'Package' }, { Id: 1, Name: 'Finance' }], selectedOption: { Id: 0, Name: 'Package' } };

        $scope.sendForm = function () {
            $.ajax({
                url: 'http://192.168.1.241/shipping/dhl/pickup',
                async: false,
                type: "POST",
                dataType: "json",
                data: $scope.PickupRequest,
                success: function (result) {
                    JSON.parse(result);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr);
                }
            });

            //$http({
            //    method: 'POST',
            //    url: 'http://192.168.1.241/shipping/dhl/pickup',
            //    data: $scope.person,
            //    headers: {
            //        'RequestVerificationToken': $scope.antiForgeryToken,
            //        'Content-Type': 'application/json'
            //    }
            //}).success(function (data, status, headers, config) {
            //    $scope.message = '';
            //    if (data.success == false) {
            //        var str = '';
            //        for (var error in data.errors) {
            //            str += data.errors[error] + '\n';
            //        }
            //        $scope.message = str;
            //    }
            //    else {
            //        $scope.message = 'Saved Successfully';
            //        $scope.person = {};
            //    }
            //}).error(function (data, status, headers, config) {
            //    console.log;
            //    $scope.message = 'Unexpected Error';
            //});
        };
    });
})();
(function () {
    var app = angular.module('mainApp')
    app.controller('TrackController', function ($scope, $http) {
        $scope.Status = {
            Data: [{ Id: 0, Name: 'All Non-Delivered' },
                { Id: 1, Name: 'Pending (No Trk Data)' },
                { Id: 3, Name: 'In Transit' },
            { Id: 10, Name: 'Delivered / Stopped' },
            { Id: 4, Name: 'Delivered' },
            { Id: 6, Name: 'Stopped' },
            { Id: 5, Name: 'Exception' }],
            selectedOption: { Id: 4, Name: 'Delivered' }
        };

        $scope.Manifest = {
            Data: [{ Id: 0, Name: 'Select...' }],
            selectedOption: { Id: 0, Name: 'Select...' }
        };

        $scope.sendForm = function () {
            $http({
                method: 'POST',
                url: '/Shipment/Tracking',
                data: $scope.person,
                headers: {
                    'RequestVerificationToken': $scope.antiForgeryToken
                }
            }).success(function (data, status, headers, config) {
                $scope.message = '';
                if (data.success == false) {
                    var str = '';
                    for (var error in data.errors) {
                        str += data.errors[error] + '\n';
                    }
                    $scope.message = str;
                }
                else {
                    $scope.message = 'Saved Successfully';
                    $scope.person = {};
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        };
    });
})();