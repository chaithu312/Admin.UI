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
        $scope.Countries = { Data: [{ Id: 1, Name: 'Country 1' }, { Id: 2, Name: 'Country 2' }] };
        $scope.Carriers = { Data: [{ Id: 1, Name: 'DHL' }, { Id: 2, Name: 'Endicia' }] };

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

        $scope.Destination = { Data: [{ Id: 1, Name: 'Domestic' }, { Id: 2, Name: 'International' }], selectedOption: { Id: 1, Name: 'Domestic' } };
        $scope.PickupAgent = { Data: [{ Id: 0, Name: 'Select...' }, { Id: 1, Name: 'DHL' }, { Id: 2, Name: 'Endicia' }, { Id: 3, Name: 'FedEx' }], selectedOption: { Id: 0, Name: 'Select...' } };
        $scope.PickupType = { Data: [{ Id: 0, Name: 'Package' }, { Id: 1, Name: 'Finance' }], selectedOption: { Id: 0, Name: 'Package' } };

        $scope.sendForm = function () {
            $scope.PickupRequestData = {
                data: [{
                    UseShipperAddress: 'false', Address: {
                        Department: null, FirstName: $scope.PickupRequest.FirstName,
                        MiddleName: null,
                        LastName: $scope.PickupRequest.LastName,
                        NamePrefix: null,
                        NamePostfix: null,
                        Name: $scope.PickupRequest.FirstName + ' ' + $scope.PickupRequest.LastName,
                        Phone: $scope.PickupRequest.Phone,
                        EMail: $scope.PickupRequest.EMail,
                        Address1: $scope.PickupRequest.Address1,
                        Address2: $scope.PickupRequest.Address2,
                        Address3: $scope.PickupRequest.Address3,
                        City: $scope.PickupRequest.City,
                        PostalCode: $scope.PickupRequest.PostalCode,
                        DivisionName: $scope.PickupRequest.Division,
                        DivisionCode: $scope.PickupRequest.DivisionCode,
                        CountryName: $scope.PickupRequest.CountryName,
                        CountryCode: $scope.PickupRequest.CountryCode,
                        Division: null,
                        State: $scope.PickupRequest.State,
                        IsResidential: $scope.PickupRequest.IsResidential,
                        IsRemoteArea: $scope.PickupRequest.IsRemoteArea,
                        LocationType: "B",
                        PackageLocation: $scope.PickupRequest.PackageLocation
                    },
                    ReadyBy: '0001-01-01T00:00:00',
                    NoLaterThan: '0001-01-01T00:00:00',
                    Instructions: null,
                    IsHeavy: $scope.PickupRequest.IsHeavy,
                    IsBulky: $scope.PickupRequest.IsBulky,
                    ConfirmationNumber: null,
                    OriginSvcArea: null,
                    CancelReason: null,
                    RegionCode: $scope.PickupRequest.RegionCode,
                    RequestorName: $scope.PickupRequest.FirstName + ' ' + $scope.PickupRequest.LastName,
                    RequestorAccountType: 'D',
                    RequestorPhone: $scope.PickupRequest.Phone,
                    AccountType: 'D',
                    RequestorAccountNumber: '803921577',
                    Date: $scope.PickupRequest.Date,
                    ReadyByTime: $scope.PickupRequest.ReadyByTime,
                    CloseTime: $scope.PickupRequest.CloseTime,
                    Weight: 10,
                    WeightUnit: 'L',
                    AWBNumber: '7520067111',
                }]
            };

            $http({
                method: 'POST',

                url: '192.168.1.241/shipping/dhl/pickup',
                data: $scope.PickupRequestData,
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

            //$.ajax({
            //    url: '/Shipment/PickupRequest',
            //    async: false,
            //    type: "POST",
            //    dataType: "json",
            //    data: $scope.PickupRequest,
            //    success: function (result) {
            //        JSON.parse(result);
            //    },
            //    error: function (xhr, ajaxOptions, thrownError) {
            //        console.log(xhr);
            //    }
            //})
        };

        //$scope.sendForm = function () {
        //    $http({
        //        method: 'POST',

        //        url: '/Shipment/PickupRequest',
        //        data: $scope.person,
        //        headers: {
        //            'RequestVerificationToken': $scope.antiForgeryToken
        //        }
        //    }).success(function (data, status, headers, config) {
        //        $scope.message = '';
        //        if (data.success == false) {
        //            var str = '';
        //            for (var error in data.errors) {
        //                str += data.errors[error] + '\n';
        //            }
        //            $scope.message = str;
        //        }
        //        else {
        //            $scope.message = 'Saved Successfully';
        //            $scope.person = {};
        //        }
        //    }).error(function (data, status, headers, config) {
        //        $scope.message = 'Unexpected Error';
        //    });
        //};
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
                selectedOption: { Id: 0, Name:'Select...' }
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
(function () {
    var validationApp = angular.module('mainApp');

    // create angular controller
    validationApp.controller('AddressBookController', function ($scope, $http) {

        //HTTP REQUEST BELOW
        $http({
            method: 'GET',
            url: '/User/Home/Country',
            // data: $scope.person,
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
                $scope.Country = JSON.parse(data);
                //  $scope.message = 'Login Successfully';
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });

        //HTTP REQUEST ABOVE


        // function to submit the form after all validation has occurred
        $scope.submitForm = function () {
            // check to make sure the form is completely valid
            if ($scope.AddressBook.$valid) {
                console.clear();
                console.log('valid');
                console.log($scope.AddressBook);
            }
            if ($scope.AddressBook.$invalid) {

                $http({
                    url: '/User/Home/AddressBook',
                    method: "POST",
                    data: JSON.stringify($scope.contact),
                    contentType: "application/json;",
                    dataType: "json"
                })
                .success(function (data, status, headers, config) {
                    alert(data);

                }).error(function (data, status, headers, config) {
                    alert(data);
                });
                //Ends herefor saving addresssbook record.

                console.log($scope.AddressBook.$error);
            }
        }
        //Getting selected Country Code and Country Name
        $scope.GetValue = function (country) {
            var countryId = $scope.contact.CountryId;

            var CountryName = $.grep($scope.Country, function (country) {
                return country.Id == countryId;
            })[0].Name;
            $scope.SelectedCountry = {};
            $scope.SelectedCountry.Id = countryId;
            $scope.SelectedCountry.Name = CountryName;
            //Getting States list using HTTP Request from controller

            $http({
                method: 'GET',
                url: '/User/Home/State',
                //data: $scope.SelectedCountry.CountryCode,
                params: { countryId: $scope.contact.CountryId },
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
                    $scope.States = JSON.parse(data);
                    //  $scope.message = 'Login Successfully';
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });

            //Ends here getting request of Http for getting states;

        }
        //Ends here getting country detail

    });
    var PHONE_REGEXP = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    
    validationApp.directive('phone', ['$http', function($http) {
        return {
            restrice: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                angular.element(element).bind('blur', function () {
                    if (PHONE_REGEXP.test(this.value)) {
                        //Postal code is in valid format get cities related to that postal code
                        //Getting Postal Code
                        $http({
                            url: '/User/Home/PostalCode',
                            method: "GET",
                            params: { PostalCode: this.value }
                        })
                       .success(function (data, status, headers, config) {
                           alert(data);

                       }).error(function (data, status, headers, config) {
                           alert(data);
                       });

                        //End of getting Postal code
                        angular.element(this).next().next().css('display', 'none');
                    } else {
                        // Invalid input
                        ctrl.$setValidity('currencyField', false);
                        console.log("invalid phone number");
                        angular.element(this).next().css('display', 'block');
                        angular.element(this).next().css('display', 'block');

                        /*
                            Looks like at this point ctrl is not available,
                            so I can't user the following method to display the error node:
                            ctrl.$setValidity('currencyField', false);
                        */
                    }
                });
            }
        }
    }]);
})();