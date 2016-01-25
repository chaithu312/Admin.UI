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
(function () {
    function SignUpController($scope) {
        alert("a");
        $scope.text = 'me@example.com';
        $scope.pattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    }

    var app = angular.module('mainApp')
    app.controller('SignUpController', function ($scope, $http, virtualDir) {
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
                            method: 'GET', url: virtualDir.AdminURL + '/user/IsUserAvailable?userName=' + elem.val()
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
    app.controller('LoginController', function ($scope, $http, virtualDir) {
        $scope.person = {};
        $scope.sendForm = function () {
            $http({
                method: 'POST',
                url: virtualDir.AdminURL + '/user/Login',
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
    var app = angular.module('mainApp');

    app.controller('PickupRequestController', function ($scope, $http, $location,virtualDir, $filter) {
        //$scope.pickupRequest = pickupModels.Pickup;
        $scope.notification = {
            Mobile: [{
                Number: ""
            }],
            Email: [{
                ID: ""
            }]
        };

        $scope.addMobile = function () {
            $scope.notification.Mobile.push({
                Number: ""
            });
        },

        $scope.removeMobile = function (index) {
            $scope.notification.Mobile.splice(index, 1);
        },

        $scope.addEmail = function () {
            $scope.notification.Email.push({
                ID: ""
            });
        },

        $scope.removeEmail = function (index) {
            $scope.notification.Email.splice(index, 1);
        },

        $scope.Contacts = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Account 1' }, { Id: 2, Name: 'Account 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };
        $scope.Addresses = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Address 1' }, { Id: 2, Name: 'Address 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };

        $scope.pickupRequest = null;

        $scope.pickupRequest = {ContactName: null, Phone: null, PickupFrom: null, Address1: null, Address2: null, City: null, ZipCode: null, CountryId: null, Division: null, isDisabled: null, notification: [] }

        var AllAddress = new Array();
        var selectedAddress = null;
        $scope.Address = new Array();
        var item =
            {
                Id: 0,
                ShortName: "New Address",
            };
        $scope.Address.push(item);
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/GetAllAddress',
            //data: $scope.SelectedCountry.CountryCode,
            //params: { countryId: $scope.contact.CountryId },
            headers: {
                'RequestVerificationToken': $scope.antiForgeryToken
            }
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            var successresult = data;
            if (data != "One or more errors occurred.") {
                for (var i = 0; i < successresult.length; i++) {
                    $scope.Address.push(successresult[i]);
                }
            }
            AllAddress = $scope.Address;
        });

        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/Home/Country',
            // data: $scope.person,
            headers: {
                'RequestVerificationToken': $scope.antiForgeryToken
            }
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            $scope.loading = true;
            if (data.success == false) {
                var str = '';
                for (var error in data.errors) {
                    str += data.errors[error] + '\n';
                }
                $scope.message = str;
            }
            else {
                $scope.Country = (JSON.parse(data));

                $http({
                    method: 'GET',
                    url: virtualDir.AdminURL + '/User/Home/Division',
                    //data: $scope.SelectedCountry.CountryCode,
                    headers: {
                        'RequestVerificationToken': $scope.antiForgeryToken
                    }
                }).success(function (data, status, headers, config) {
                    $scope.message = '';
                    $scope.States = JSON.parse(data);
                }).error(function (data, status, headers, config) {
                    $scope.message = 'Unexpected Error';
                });
                //  $scope.message = 'Login Successfully';
                $scope.loading = false;
            }
        }).error(function (data, status, headers, config) {
            $scope.message = '';
        });

        $scope.GetAddressValue = function () {
            var addressType = $scope.pickupRequest.AddressType;
            if (addressType == "0") {
                $scope.pickupRequest.ContactName = null
                $scope.pickupRequest.Phone = null
                $scope.pickupRequest.AddressType = $scope.pickupRequest.AddressType
                $scope.pickupRequest.Address1 = null
                $scope.pickupRequest.Address2 = null
                $scope.pickupRequest.City = null
                $scope.pickupRequest.ZipCode = null
                $scope.pickupRequest.CountryId = null;
                $scope.pickupRequest.Division = null;
                $scope.pickupRequest.PickupFrom = $scope.pickupRequest.PickupFrom;
                $scope.pickupRequest.isDisabled = false;
                return;
            }

            for (var i = 0; i < AllAddress.length; i++) {
                if (AllAddress[i].Id == addressType) {
                    selectedAddress = AllAddress[i]
                    break;
                }
            }

            $scope.pickupRequest.ContactName = selectedAddress.Name;
            $scope.pickupRequest.Phone =parseInt(selectedAddress.Phone1);
            $scope.pickupRequest.Address1 = selectedAddress.Address1;
            $scope.pickupRequest.Address2 = selectedAddress.Address2;
            $scope.pickupRequest.City = selectedAddress.City;
            $scope.pickupRequest.ZipCode = selectedAddress.PostalCode;
            $scope.pickupRequest.CountryId = selectedAddress.CountryId;
            $scope.pickupRequest.Division = selectedAddress.Division;

            $scope.pickupRequest.PickupFrom = selectedAddress.Name;
            $scope.pickupRequest.isDisabled = true;
            $scope.$apply();

            $("#CountryId").find('option[value=' + selectedAddress.CountryId + ']').attr('selected', 'selected');

            $("#Division").find('option[label=' + selectedAddress.Division + ']').attr('selected', 'selected');

            //var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number($scope.pickupRequest.CountryId); })[0];
            //$scope.pickupRequest.Country = countryfiltered.Name;
            //$scope.pickupRequest.CountryCode = countryfiltered.Code;
            $scope.SetCountryAndCode();
        }

        $scope.SetCountryAndCode = function () {
            var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id == Number($scope.pickupRequest.CountryId); })[0];
            $scope.pickupRequest.Country = countryfiltered.Name;
            $scope.pickupRequest.CountryCode = countryfiltered.Code;
        }

        //Editing of Pickup working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var selectedAddress = [];
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: virtualDir.AdminURL + '/Shipment/Home/GetAllPickup',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    var viewpickup = JSON.parse(data);
                    var selectedPickup = $filter('filter')(viewpickup, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindPickupAddress(selectedPickup);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }

        $scope.bindPickupAddress = function (pickup)
        {
            $scope.pickupRequest.Id = pickup.Id;
            $scope.pickupRequest.ContactName = pickup.ContactName;
            $scope.pickupRequest.Phone = parseInt(pickup.Phone);
            $scope.pickupRequest.Address1 = pickup.Address1;
            $scope.pickupRequest.Address2 = pickup.Address2;
            $scope.pickupRequest.City = pickup.City;
            $scope.pickupRequest.ZipCode = pickup.ZipCode;
            $scope.pickupRequest.CountryId = pickup.CountryID;
            $scope.pickupRequest.Division = pickup.Division;

            $scope.pickupRequest.PickupFrom = pickup.PickupFrom;
            $scope.pickupRequest.ReadyTime = pickup.ReadyTime;
            $scope.pickupRequest.AvailableTime = pickup.AvailableTime;
            $scope.pickupRequest.PickupDate = pickup.PickupDate;

            $scope.pickupRequest.TotalPieces = pickup.TotalPieces;
            $scope.pickupRequest.Destination = pickup.Destination;

            $scope.pickupRequest.ParcelType = pickup.ParcelType;
            $scope.pickupRequest.isDisabled = true;
            if (JSON.parse(pickup.Detail).PickupDetail != null) {
                var pickupDetail = JSON.parse(JSON.parse(pickup.Detail).PickupDetail)
                $scope.pickupRequest.AddressNotes = pickupDetail.AdditionalNotes;
                $scope.pickupRequest.isResidential = pickupDetail.IsResidential;
                $scope.pickupRequest.Carrier = pickupDetail.Carrier;
                var date = new Date(pickupDetail.PickupDate);
                var datearray= pickupDetail.PickupDate.split("-");
                $scope.pickupRequest.PickupDate = datearray[0] + '-' + datearray[1] + '-' + datearray[2];
            }
            $scope.SetCountryAndCode();
            $scope.$apply();

            $("#CountryId").find('option[value=' + pickup.CountryID + ']').attr('selected', 'selected');
            $("#ddldestination").find('option[value=' + pickup.Destination + ']').attr('selected', 'selected');
            $("#parcelType").find('option[value=' + pickup.ParcelType + ']').attr('selected', 'selected');
            $("#Division").find('option[label=' + pickup.Division + ']').attr('selected', 'selected');
            $("#ddlCarrier").find('option[value=' + $scope.pickupRequest.Carrier + ']').attr('selected', 'selected');
        }
        //Ends here editing of pickup
        //Cut above
        //Ends here getting country detail

        $scope.Carriers = { Data: [{ Id: 1, Name: 'DHL' }, { Id: 2, Name: 'Endicia' }, { Id: 3, Name: 'UPS' }] };

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

        $scope.Destination = { Data: [{ Id: 1, Name: 'Domestic' }, { Id: 2, Name: 'International' }, { Id: 3, Name: 'International multiple packages with mixed destinations' }], selectedOption: { Id: 1, Name: 'Domestic' } };
        $scope.PickupAgent = { Data: [{ Id: 0, Name: 'Select...' }, { Id: 1, Name: 'DHL' }, { Id: 2, Name: 'Endicia' }, { Id: 3, Name: 'FedEx' }], selectedOption: { Id: 0, Name: 'Select...' } };
        $scope.PickupType = { Data: [{ Id: 0, Name: 'Package' }, { Id: 1, Name: 'Finance' }], selectedOption: { Id: 0, Name: 'Package' } };
        //HTTP REQUEST BELOW

        //Ends here getting country detail
        $scope.pickupRequest.notification.push($scope.notification);
        $scope.valResult = {};
        $scope.sendForm = function () {
            if ($scope.PickupForm.$valid) {
                $("#veil").show();
                $("#feedLoading").show();
                $http({
                    url: virtualDir.AdminURL + '/Shipment/PickupRequest',
                    method: "POST",
                    data: JSON.stringify($scope.pickupRequest),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                        $("#divfrm").hide();
                        $("#divbtn").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary",
                                    callback: function () {
                                        window.location.href = "/Shipment/ViewPickup";
                                    }
                                }
                            }
                        });
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
            //if ($scope.PickupForm.$invalid) { $scope.message = "Please check required fields." }
        };

        $("#contactName").blur(function () {
            $("#pickupfrom").val($("#contactName").val());
            $scope.pickupRequest.PickupFrom = $("#contactName").val();
            $scope.$apply();
        });

        $scope.CheckTime = function (readyTime, lastTime) {
            var rth, lth, rtm, ltm;

            rth = parseInt(readyTime);

            lth = parseInt(lastTime);

            if (rth > lth) {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.GetValue = function (country) {
            var countryId = $scope.pickupRequest.CountryId;

            var CountryName = $.grep($scope.Country, function (country) {
                return country.Id == countryId;
            })[0].Name;
            $scope.SelectedCountry = {};
            $scope.SelectedCountry.Id = countryId;
            $scope.SelectedCountry.Name = CountryName;
            //Getting States list using HTTP Request from controller

            $http({
                method: 'GET',
                url: virtualDir.AdminURL + '/User/State',
                //data: $scope.SelectedCountry.CountryCode,
                params: { countryId: $scope.pickupRequest.CountryId },
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

                    if (JSON.parse(data).length == 0)
                        $scope.States = [{ "Id": 0, "CountryId": "a", "DivisionType": 1, "Code": "a", "Name": "Others", "LocalName": "", "Detail": "", "Created": "2015-09-01T00:00:00", "Status": 0 }];

                    //  $scope.message = 'Login Successfully';
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'state url is not valid';
            });

            //Ends here getting request of Http for getting states;
        }
    });
})();
(function () {
    var app = angular.module('mainApp')
    app.controller('TrackController', function ($scope, $http, virtualDir) {
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
                url: virtualDir.AdminURL + '/Shipment/Tracking',
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
    var app = angular.module('mainApp');
    app.factory('addressModels', function () {
        var addressModels = {};
        addressModels.Address = function () {
            this.AddressType = null;
            this.ShortName = null;
            this.Company = null;
            this.FirstName = null;
            this.LastName = null;
            this.Phone1 = null;
            this.Phone2 = null;
            this.Fax = null;
            this.Email = null;
            this.CountryId = null;
            this.PostalCode = null;
            this.Division = null;
            this.City = null;
            this.Address1 = null;
            this.Address2 = null;
            this.Address3 = null;
            Address1Label = null
            Address2Label = null
            isAddress3Visible = true
            CountryCode = null;
        }
        return addressModels;
    });

    // create angular controller
    app.controller('AddressBookController', function (addressModels, $scope,$location, $http, $filter, virtualDir) {
        $scope.contact = addressModels.Address;
        $scope.contact = null;
        $scope.contact = { AddressType: null, ShortName: null, Company: null, FirstName: null, LastName: null, Phone1: null, Phone2: null, Fax: null, Email: null, CountryId: null, PostalCode: null, Division: null, City: null, Address1: null, Address2: null, Address3: null, Address1Label: "Address Line 1", Address2Label: "Address Line 2", isAddress3Visible: true, CountryCode: null, Id: null };

        $scope.contact.Id = 0;
        //HTTP REQUEST BELOW
        $("#veil").show();
        $("#feedLoading").show();
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/Home/Country',
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
                $scope.Country = (JSON.parse(data));
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            bootbox.dialog({
                message: "Country URL is invalid!",
                buttons: {
                    "success": {
                        "label": "OK",
                        "className": "btn-sm btn-primary"
                    }
                }
            });
        });

        $scope.valResult = {};
        //HTTP REQUEST ABOVE
        $scope.$watch('contact', function (newValue) {
            if ($scope.contact.CountryId != null)
                $scope.GetCountryDetail($scope.contact.CountryId);
            //$scope.valResult = addressValidator.validate($scope.contact);
        }, true);

        if ($location.absUrl().split("?").length > 1) {
            var selectedAddress = [];
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/User/Home/GetAllAddress',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    selectedAddress = data;
                    var selectedAddress = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $http({
                        method: 'GET',
                        url: virtualDir.AdminURL + '/User/Home/State',
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
                            
                            $scope.States = JSON.parse(data) ;
                            $scope.bindAddressBook(selectedAddress);
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.message = 'state url is not valid';
                    });
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });

        }

        $scope.bindAddressBook=function(address)
        {
            $scope.contact.ShortName = address.ShortName;
            $scope.contact.Company = address.Company;
            $scope.contact.FirstName = address.Name.split(' ')[0];
            $scope.contact.LastName = address.Name.split(' ')[1];
            $scope.contact.Phone1 = parseInt(address.Phone1);
            $scope.contact.Phone2 = parseInt(address.Phone2);
            $scope.contact.Fax = address.Fax;
            $scope.contact.Email = address.EMail;
            $scope.contact.PostalCode = address.PostalCode;
            $scope.contact.City = address.City;
            $scope.contact.Address1 = address.Address1;
            $scope.contact.Address2 = address.Address2;
            $scope.contact.Address3 = address.Address3;
            $scope.contact.CountryId = address.CountryId;
            $scope.contact.Division = address.Division;
            $scope.contact.AddressType = address.AddressType;
            $scope.contact.Id = address.Id;

            $scope.$apply();
            $("#Type").find('option[value=' + address.AddressType + ']').attr('selected', 'selected');

            $("#Country").find('option[value=' + address.CountryId + ']').attr('selected', 'selected');

            $("#ddlState").find('option[label=' + address.Division + ']').attr('selected', 'selected');
        }

        $scope.GetCountryDetail = function (CountryId) {
            var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number($scope.contact.CountryId); })[0];
            $scope.contact.CountryCode = countryfiltered.Code;
            if ($scope.contact.CountryCode != null && $scope.contact.CountryCode == "US") {
                $scope.contact.Address1Label = "Street Address";
                $scope.contact.Address2Label = "Apt / Suite / Other";
                $scope.contact.isAddress3Visible = false;
            }
            else {
                $scope.contact.Address1Label = " Address Line 1";
                $scope.contact.Address2Label = "Address Line 2";
                $scope.contact.isAddress3Visible = true;
            }
        }
        // function to submit the form after all validation has occurred
        $scope.submitForm = function () {
            if ($scope.AddressBook.$valid) {
                $("#veil").show();
                $("#feedLoading").show();
                $http({
                    url: virtualDir.AdminURL + '/User/Home/AddressBook',
                    method: "POST",
                    data: JSON.stringify($scope.contact),
                    contentType: "application/json;",
                    dataType: "json"
                })
                .success(function (data, status, headers, config) {
                    $scope.message= $scope.contact.Id > 0 ? "Contact updated successfully!" : "New contact added!"
                    bootbox.dialog({
                        message: $scope.message,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary",
                                callback: function () {
                                    window.location.href = "/User/ViewAddress";
                                }
                            }
                        }
                    });
                }).error(function (data, status, headers, config) {
                    alert(data);
                });
                //Ends herefor saving addresssbook record.
            }
            else {
                $scope.message = "Invalid";
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
                url: virtualDir.AdminURL + '/User/Home/State',
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

                    if (JSON.parse(data).length == 0)
                        $scope.States = [{ "Id": 0, "CountryId": "a", "DivisionType": 1, "Code": "a", "Name": "Others", "LocalName": "", "Detail": "", "Created": "2015-09-01T00:00:00", "Status": 0 }];

                    //  $scope.message = 'Login Successfully';
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'state url is not valid';
            });

            //Ends here getting request of Http for getting states;
        }
        //Ends here getting country detail
    });
    var PHONE_REGEXP = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

    app.directive('postalcode', ['$http', function ($http) {
        return {
            restrice: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                angular.element(element).bind('blur', function () {
                });
            }
        }
    }]);
})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewAddressController', function ($scope,$window, $http) {

        $scope.myName = function (name) {
            alert('Hello ' + name);
        }

        console.log('deleting ');
        $scope.deleteForm = function (addressId) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + addressId,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/User/Home/DeleteAddressById',
                            //data: $scope.SelectedCountry.CountryCode,
                            params: { id: addressId },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };

                            $scope.columnDefs = [{
                                "mDataProp": "Name",
                                "aTargets": [0]
                            }, {
                                "mDataProp": "Address1",
                                "aTargets": [1]
                            }, {
                                "mDataProp": "City",
                                "aTargets": [2]
                            }, {
                                "mDataProp": "Division",
                                "aTargets": [3]
                            }, {
                                "mDataProp": "CountryId",
                                "aTargets": [4]
                            }, {
                                "mDataProp": "PostalCode",
                                "aTargets": [5]
                            }, {
                                "mDataProp": "Phone1",
                                "aTargets": [6]
                            }, {
                                "mDataProp": "AddressType",
                                "aTargets": [7]
                            }, {
                                "mDataProp": "Status",
                                "aTargets": [8]
                            }, {
                                "mDataProp": "Detail",
                                "aTargets": [9]
                            }];

                            $scope.overrideOptions = {
                                "bStateSave": true,
                                "iCookieDuration": 2419200,
                                /* 1 month */
                                "bJQueryUI": true,
                                "bPaginate": false,
                                "bLengthChange": false,
                                "bFilter": true,
                                "bInfo": true,
                                "bDestroy": true
                            };

                            $http({
                                method: 'GET',
                                url: '/User/Home/GetAllAddress',
                                //data: $scope.SelectedCountry.CountryCode,
                                //params: { countryId: $scope.contact.CountryId },
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
                                    bootbox.dialog({
                                        message: str,
                                        buttons: {
                                            "success": {
                                                "label": "OK",
                                                "className": "btn-sm btn-primary"
                                            }
                                        }
                                    });
                                }
                                else {
                                    var lim = data.length;
                                    for (var i = 0; i < lim; i++) {
                                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')" ></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                                        if (data[i].AddressType == 0) {
                                            data[i].AddressType = 'Recipient';
                                        } else { data[i].AddressType = 'Sender'; }

                                        if (data[i].Status == 0) {
                                            data[i].Status = 'De-Active';
                                        } else { data[i].Status = 'Active'; }
                                    }

                                    $scope.datasrc = data;
                                    $("#veil").hide();
                                    $("#feedLoading").hide();
                                }
                            }).error(function (data, status, headers, config) {
                                $scope.message = 'Unexpected Error';
                            });
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
           }
        $scope.editForm = function (addressId) {
            var url = "http://" + $window.location.host + "/User/AddressBook/?" + addressId;
            //$log.log(url);
            $window.location.href = url;
        
            console.log('deleting user ');
        }

        $("#btndelete").on("click", function () {
            alert("The paragraph was clicked.");
        });
        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };

        $scope.columnDefs = [{
            "mDataProp": "Name",
            "aTargets": [0]
        }, {
            "mDataProp": "Address1",
            "aTargets": [1]
        }, {
            "mDataProp": "City",
            "aTargets": [2]
        }, {
            "mDataProp": "Division",
            "aTargets": [3]
        }, {
            "mDataProp": "PostalCode",
            "aTargets": [4]
        }, {
            "mDataProp": "Phone1",
            "aTargets": [5]
        }, {
            "mDataProp": "EMail",
            "aTargets": [6]
        }, {
            "mDataProp": "AddressType",
            "aTargets": [7]
        }, {
            "mDataProp": "Status",
            "aTargets": [8]
        }, {
            "mDataProp": "Detail",
            "aTargets": [9]
        }];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };

        $http({
            method: 'GET',
            url: '/User/Home/GetAllAddress',
            //data: $scope.SelectedCountry.CountryCode,
            //params: { countryId: $scope.contact.CountryId },
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
                bootbox.dialog({
                    message: str,
                    buttons: {
                        "success": {
                            "label": "OK",
                            "className": "btn-sm btn-primary"
                        }
                    }
                });
            }
            else {
                var lim = data.length;
                for (var i = 0; i < lim; i++) {
                    data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                    if (data[i].AddressType == 0) {
                        data[i].AddressType = 'Recipient';
                    } else { data[i].AddressType = 'Sender'; }

                    if (data[i].Status == 0) {
                        data[i].Status = 'De-Active';
                    } else { data[i].Status = 'Active'; }
                }

                $scope.datasrc = data;
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();
(function () {
    var app = angular.module('mainApp');
    // create angular controller
    app.controller('ViewPickupController', function ($scope, $http, $window, virtualDir) {
        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.datasrc = '';

        $scope.editPickupForm = function (id) {
            var url = "http://" + $window.location.host + "/Shipment/PickupRequest/?" + id;
            //$log.log(url);
            $window.location.href = url;

            console.log('deleting user ');
        };

        $scope.deletePickupForm = function (id) {
            bootbox.confirm({
                size: 'small',
                message: "Pickup will be cancelled. Continue?</br>After saving this action; the record may disappear from the list",
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/Shipment/Home/DeleteById',
                            //data: $scope.SelectedCountry.CountryCode,
                            params: { id: id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };

                            $scope.columnDefs = [{
                                "mDataProp": "ContactName",
                                "aTargets": [0]
                            }, {
                                "mDataProp": "Phone",
                                "aTargets": [1]
                            }, {
                                "mDataProp": "Address1",
                                "aTargets": [2]
                            }, {
                                "mDataProp": "City",
                                "aTargets": [3]
                            }, {
                                "mDataProp": "PickupFrom",
                                "aTargets": [4]
                            }, {
                                "mDataProp": "ReadyTime",
                                "aTargets": [5]
                            }, {
                                "mDataProp": "AvailableTime",
                                "aTargets": [6]
                            }, {
                                "mDataProp": "TotalPieces",
                                "aTargets": [7]
                            }, {
                                "mDataProp": "Destination",
                                "aTargets": [8]
                            }, {
                                "mDataProp": "RatePickupIndicator",
                                "aTargets": [9]
                            }, {
                                "mDataProp": "PickUpNotificationPersonalizedMessage",
                                "aTargets": [10]
                            },
                            {
                                "mDataProp": "RequestID",
                                "aTargets": [11]
                            }];

                            $scope.overrideOptions = {
                                "scrollY": "200px",
                                "scrollCollapse": true,
                                "bStateSave": true,
                                "iCookieDuration": 2419200,
                                /* 1 month */
                                "bJQueryUI": true,
                                "bPaginate": true,
                                "bLengthChange": false,
                                "bFilter": true,
                                "bInfo": true,
                                "bDestroy": true
                            };

                            $http({
                                method: 'GET',
                                url: virtualDir.AdminURL + '/Shipment/Home/GetAllPickup',
                                //data: $scope.SelectedCountry.CountryCode,
                                //params: { countryId: $scope.contact.CountryId },
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
                                    var viewpickup = JSON.parse(data);
                                    var lim = viewpickup.length;
                                    for (var i = 0; i < lim; i++) {
                                        viewpickup[i].RequestID = '<div class="hidden-sm hidden-xs btn-group"><button id="btnedit" type="button" onclick="angular.element(this).scope().editPickupForm(' + viewpickup[i].Id + ')" class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button  id="btndelete" type="button" class="btn btn-xs btn-danger" onclick="angular.element(this).scope().deletePickupForm(' + viewpickup[i].Id + ')"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                                        if (viewpickup[i].Destination == 1) {
                                            viewpickup[i].Destination = 'Domestic';
                                        } else {
                                            if (viewpickup[i].Destination == 2) {
                                                viewpickup[i].Destination = 'International';
                                            } else { viewpickup[i].Destination = 'International multiple packages with mixed destinations' }
                                        }
                                    }

                                    $scope.datasrc = viewpickup;
                                    $("#veil").hide();
                                    $("#feedLoading").hide();
                                }
                            }).error(function (data, status, headers, config) {
                                $scope.message = 'Unexpected Error';
                            });
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }

        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };

        $scope.columnDefs = [{
            "mDataProp": "ContactName",
            "aTargets": [0]
        }, {
            "mDataProp": "Phone",
            "aTargets": [1]
        }, {
            "mDataProp": "Address1",
            "aTargets": [2]
        }, {
            "mDataProp": "City",
            "aTargets": [3]
        }, {
            "mDataProp": "PickupFrom",
            "aTargets": [4]
        }, {
            "mDataProp": "ReadyTime",
            "aTargets": [5]
        }, {
            "mDataProp": "AvailableTime",
            "aTargets": [6]
        }, {
            "mDataProp": "TotalPieces",
            "aTargets": [7]
        }, {
            "mDataProp": "Destination",
            "aTargets": [8]
        }, {
            "mDataProp": "RatePickupIndicator",
            "aTargets": [9]
        }, {
            "mDataProp": "PickUpNotificationPersonalizedMessage",
            "aTargets": [10]
        },
        {
            "mDataProp": "RequestID",
            "aTargets": [11]
        }];

        $scope.overrideOptions = {
            "scrollY": "200px",
            "scrollCollapse": true,
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };

        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/Shipment/Home/GetAllPickup',
            //data: $scope.SelectedCountry.CountryCode,
            //params: { countryId: $scope.contact.CountryId },
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
                var viewpickup = JSON.parse(data);
                var lim = viewpickup.length;
                for (var i = 0; i < lim; i++) {
                    viewpickup[i].RequestID = '<div class="hidden-sm hidden-xs btn-group"><button id="btnedit" type="button" onclick="angular.element(this).scope().editPickupForm(' + viewpickup[i].Id + ')" class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button  id="btndelete" type="button" class="btn btn-xs btn-danger" onclick="angular.element(this).scope().deletePickupForm(' + viewpickup[i].Id + ')"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                    if (viewpickup[i].Destination == 1) {
                        viewpickup[i].Destination = 'Domestic';
                    } else {
                        if (viewpickup[i].Destination == 2) {
                            viewpickup[i].Destination = 'International';
                        } else { viewpickup[i].Destination = 'International multiple packages with mixed destinations' }
                    }
                }

                $scope.datasrc = viewpickup;
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();
(function () {
    var app = angular.module('mainApp');

    app.controller('vendorController', function ($scope, $http, vendor, virtualDir) {
        $scope.vendor = { Detail: null };
        $scope.sendVendorForm = function () {
            if ($scope.VendorForm.$valid) {
                $scope.vendor.isDisabled = true;
                switch ($scope.vendor.VendorType) {
                    case 1:
                        $scope.vendor.Detail = "{" + "\"" + "ThirdPartyAccount" + "\"" + ":" + "\"" + $scope.vendor.DHLAcc + "\"" + "}";
                        break;
                    case 2:
                        $scope.vendor.Detail = "{" + "\"" + "AccountNumber" + "\"" + ":" + "\"" + $scope.vendor.EndiciaAcc + "\"" + "}";
                        break;
                    case 3:
                        $scope.vendor.Detail = "{" + "\"" + "AccountNumber" + "\"" + ":" + "\"" + $scope.vendor.FedexAcc + "\"" + "," + "\"" + "FedexMeter" + "\"" + ":" + "\"" + $scope.vendor.FedexMeter + "\"" + "," + "\"" + "FedexPayAcc" + "\"" + ":" + "\"" + $scope.vendor.FedexPayAcc + "\"" + "}";
                        break;
                    case 4:
                        $scope.vendor.Detail = "{" + "\"" + "UPSLicenseNo" + "\"" + ":" + "\"" + $scope.vendor.UPSLicenseNo + "\"" + "," + "\"" + "UPSUserName" + "\"" + ":" + "\"" + $scope.vendor.UPSUserName + "\"" + "," + "\"" + "UPSpassword" + "\"" + ":" + "\"" + $scope.vendor.UPSpassword + "\"" + "," + "\"" + "UPSAcc" + "\"" + ":" + "\"" + $scope.vendor.UPSAcc + "\"" + "}";
                        break;
                }

                $http({
                    url: virtualDir.AdminURL + '/Shipment/VendorSetting',
                    method: "POST",
                    data: JSON.stringify($scope.vendor),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $scope.vendor = null;
                        bootbox.dialog({
                            message: "Thank you! Your information was successfully saved!",
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary",
                                    callback: function () {
                                        window.location.href = "/Shipment/VendorSetting";
                                    }
                                }
                            }
                        });
                    }).error(function (data, status, headers, config) {
                        $scope.message = data;
                    });
            }
            if ($scope.VendorForm.$invalid) { $scope.message = "Please check required fields." }
        };
    });
})();
(function () {
    var app = angular.module('mainApp');

    app.controller('shipmentsController', function (shippingModels, $scope, $http, virtualDir) {
        $scope.Shipments = shippingModels.Shipment;
        $scope.Parcel = shippingModels.Shipment.Parcel;
        $scope.submitted = false;
        $scope.step = 1;
        $scope.step1Done = false;
        $scope.step2Done = false;
        $scope.step3Done = false;
        $scope.step4Done = false;

   

        $scope.Step1Click = function () {
             $scope.submitted = true;
            $scope.step = 1;
            if ($scope.shipment.vendortype.$valid) {
                $scope.step1Done = true;
                $scope.step = 2;
                $scope.submitted = false;
            }

        }

        $scope.PreStep2Click = function () {
            $scope.step2Done = false;
            $scope.step = 1;
            $scope.submitted = false;
        }

        $scope.Step2Click = function () {
            
            $scope.submitted = true;
            $scope.step = 2;

            if ($scope.shipment.RCompany.$valid &&
            $scope.shipment.Rname.$valid &&
            $scope.shipment.Rphone.$valid &&
            $scope.shipment.Remail.$valid &&
            $scope.shipment.Raddressline1.$valid &&
            $scope.shipment.Raddressline2.$valid &&
            $scope.shipment.Rcity.$valid &&
            $scope.shipment.Rpostalcode.$valid &&
            $scope.shipment.RCountry.$valid &&
            $scope.shipment.RDivision.$valid)
            {
                $scope.step2Done = true;
                $scope.step = 3;
                $scope.submitted = false;
            }
           
        }


        $scope.PreStep3Click = function () {
            $scope.step3Done = false;
            $scope.step = 2;
            $scope.submitted = false;
        }
        $scope.Step3Click = function () {

            $scope.submitted = true;
            $scope.step = 3;

            if ($scope.shipment.company.$valid &&
            $scope.shipment.name.$valid &&
            $scope.shipment.phone.$valid &&
            $scope.shipment.email.$valid &&
            $scope.shipment.addressline1.$valid &&
            $scope.shipment.addressline2.$valid &&
            $scope.shipment.city.$valid &&
            $scope.shipment.postalcode.$valid &&
            $scope.shipment.CountryId.$valid &&
            $scope.shipment.Division.$valid) {
                $scope.step3Done = true;
                $scope.step = 4;
                $scope.submitted = false;
            }

        }


        $scope.PreStep4Click = function () {
            $scope.step3Done = false;
            $scope.step = 3;
            $scope.submitted = false;
        }
        $scope.Step4Click = function () {

            $scope.submitted = true;
            $scope.step = 4;

            if ($scope.shipment.shipmentdate.$valid &&
            $scope.shipment.packagetype.$valid &&
            $scope.shipment.unitsystem.$valid )
            {
                if ($scope.shipment.$valid) {
                    $scope.step4Done = true;
                    $("#veil").show();
                    $("#feedLoading").show();
                    $http({
                        url: virtualDir.AdminURL + '/Shipment/Shipments',
                        method: "POST",
                        data: JSON.stringify($scope.Shipments),
                        contentType: "application/json;",
                        dataType: "json"
                    })
                        .success(function (data, status, headers, config) {
                            $("#veil").hide();
                            $("#feedLoading").hide();
                            if (data == null)
                                $scope.message = "Failed";
                            else if (data.ErrorMessage != null) {
                                $scope.message = data.ErrorMessage;
                                $("#frmShipments").hide();
                            }
                            else {
                                $("#veil").hide();
                                $("#feedLoading").hide();
                                window.open("http://" + data.LabelImage.OutputImage.replace("10.0.0.124", "localhost"), "_blank");
                                $scope.message = "Label Generated Successfully";
                                $("#frmShipments").hide();
                            }
                        }).error(function (data, status, headers, config) {
                        });
                }
            }

        }

        //$scope.Vendors; = new Array();
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/Shipment/GetAllVendor',
            headers: {
                'RequestVerificationToken': $scope.antiForgeryToken
            }
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            //$scope.Vendors.push((JSON.parse(data)));
            $scope.Vendors = (JSON.parse(data));
        });

        $scope.Address = new Array();
        var selectedShipperAddress = null;
        var item =
            {
                Id: 0,
                ShortName: "New Address",
            };
        $scope.Address.push(item);
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/GetAllAddress',
            headers: {
                'RequestVerificationToken': $scope.antiForgeryToken
            }
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            var successresult = data;
            if (data != "One or more errors occurred.") {
                for (var i = 0; i < successresult.length; i++) {
                    $scope.Address.push(successresult[i]);
                }
            }
            AllAddress = $scope.Address;
        });
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/Division',
            //data: $scope.SelectedCountry.CountryCode,
            headers: {
                'RequestVerificationToken': $scope.antiForgeryToken
            }
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            $scope.States = JSON.parse(data);
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });

        $scope.GetShipperAddressValue = function () {
            var addressType = $scope.Shipments.AddressType;
            if (addressType == "0") {
                $scope.Shipments.Name = null
                $scope.Shipments.Phone = null
                $scope.Shipments.AddressType = $scope.Shipments.AddressType
                $scope.Shipments.Address1 = null
                $scope.Shipments.Address2 = null
                $scope.Shipments.Address3 = null
                $scope.Shipments.City = null
                $scope.Shipments.PostalCode = null
                $scope.Shipments.CountryId = null;
                $scope.Shipments.Division = null;
                $scope.Shipments.isDisabled = false;
                return;
            }

            for (var i = 0; i < AllAddress.length; i++) {
                if (AllAddress[i].Id == addressType) {
                    selectedShipperAddress = AllAddress[i]
                    break;
                }
            }

            $scope.Shipments.ContactName = selectedShipperAddress.Name;
            $scope.Shipments.Phone = selectedShipperAddress.Phone1;
            $scope.Shipments.Address1 = selectedShipperAddress.Address1;
            $scope.Shipments.Address2 = selectedShipperAddress.Address2;
            $scope.Shipments.Address3 = selectedShipperAddress.Address3;
            $scope.Shipments.City = selectedShipperAddress.City;
            $scope.Shipments.PostalCode = selectedShipperAddress.PostalCode;
            $scope.Shipments.CountryId = selectedShipperAddress.CountryId;
            $scope.Shipments.Division = selectedShipperAddress.Division;
            $scope.Shipments.isDisabled = true;
            //if ($scope.$root.$$phase != '$apply')
            //if(!$scope.$$phase)
            $scope.$apply();

            $("#CountryId").find('option[value=' + selectedShipperAddress.CountryId + ']').attr('selected', 'selected');

            $("#Division").find('option[label=' + selectedShipperAddress.Division + ']').attr('selected', 'selected');

            $scope.SetCountryAndDivision(selectedShipperAddress.CountryId, selectedShipperAddress.Division, "shipper");
        };
        $scope.SetCountryAndDivision = function (CountryId, Division, type) {
            var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number(CountryId); })[0];
            var Divisionfiltered = $filter('filter')($scope.States, function (d) { return d.Name === Division; })[0];
            if (type == "shipper") {
                $scope.Shipments.CountryName = countryfiltered.Name;
                $scope.Shipments.CountryCode = countryfiltered.Code;
                $scope.Shipments.DivisionCode = Divisionfiltered.Code;
            }
            if (type == "consignee") {
                $scope.Shipments.RCountryName = countryfiltered.Name;
                $scope.Shipments.RCountryCode = countryfiltered.Code;
                $scope.Shipments.RDivisionCode = Divisionfiltered.Code;
            }
        }
        $scope.GetConsigeeAddressValue = function () {
            var addressType = $scope.Shipments.RAddressType;
            if (addressType == "0") {
                $scope.Shipments.Rname = null
                $scope.Shipments.Rphone = null
                $scope.Shipments.RAddressType = $scope.Shipments.RAddressType
                $scope.Shipments.Raddressline1 = null
                $scope.Shipments.Raddressline2 = null
                $scope.Shipments.Raddressline3 = null
                $scope.Shipments.Rcity = null
                $scope.Shipments.Rpostalcode = null
                $scope.Shipments.RCountryId = null;
                $scope.Shipments.RDivision = null;
                $scope.Shipments.isRDisabled = false;
                return;
            }

            for (var i = 0; i < AllAddress.length; i++) {
                if (AllAddress[i].Id == addressType) {
                    selectedShipperAddress = AllAddress[i]
                    break;
                }
            }

            $scope.Shipments.Rname = selectedShipperAddress.Name;
            $scope.Shipments.Rphone = selectedShipperAddress.Phone1;
            $scope.Shipments.Raddressline1 = selectedShipperAddress.Address1;
            $scope.Shipments.Raddressline2 = selectedShipperAddress.Address2;
            $scope.Shipments.Raddressline3 = selectedShipperAddress.Address3;

            $scope.Shipments.Rcity = selectedShipperAddress.City;
            $scope.Shipments.Rpostalcode = selectedShipperAddress.PostalCode;
            $scope.Shipments.RCountryId = selectedShipperAddress.CountryId;
            $scope.Shipments.RDivision = selectedShipperAddress.Division;
            $scope.Shipments.isRDisabled = true;
            //if ($scope.$root.$$phase != '$apply')
            //if(!$scope.$$phase)
            $scope.$apply();

            $("#RCountry").find('option[value=' + selectedShipperAddress.CountryId + ']').attr('selected', 'selected');

            $("#RDivision").find('option[label=' + selectedShipperAddress.Division + ']').attr('selected', 'selected');
            $scope.SetCountryAndDivision($scope.Shipments.RCountryId, selectedShipperAddress.Division, "consignee");
            //var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number($scope.Shipments.RCountryId); })[0];
            //$scope.Shipments.RCountryName = countryfiltered.Name;
            //$scope.Shipments.RCountryCode = countryfiltered.Code;
        };

        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/Country',
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
                $scope.Country = (JSON.parse(data));

                $http({
                    method: 'GET',
                    url: virtualDir.AdminURL + '/User/Division',
                    //data: $scope.SelectedCountry.CountryCode,
                    headers: {
                        'RequestVerificationToken': $scope.antiForgeryToken
                    }
                }).success(function (data, status, headers, config) {
                    $scope.message = '';
                    $scope.States = JSON.parse(data);
                }).error(function (data, status, headers, config) {
                    $scope.message = 'Unexpected Error';
                });
                //  $scope.message = 'Login Successfully';
                $scope.loading = false;
            }
        }).error(function (data, status, headers, config) {
            $scope.message = '';
        });

        $scope.Parcel = {
            items: [{
                Weight: 0,
                Width: 0,
                Height: 0,
                Length: 0,
                IsRemoveActive: 0
            }]
        };

        $scope.addItem = function () {
            var x = new shippingModels.Shipment.Parcel().items[0];
            $scope.Parcel.items.push(new shippingModels.Shipment.Parcel().items[0]);
            //$scope.Parcel.items.push({
            //    Weight: 0,
            //    Width: 0,
            //    Height: 0,
            //    Length: 0,
            //    IsRemoveActive: 1
            //});
        },

        $scope.removeItem = function (index) {
            $scope.Parcel.items.splice(index, 1);
        },

        $scope.Shipments = null;
        $scope.Shipments = { Parcel: [] };
        $scope.Shipments.Parcel.push($scope.Parcel);
        $scope.valResult = {};
        $scope.sendForm = function () {
            if ($scope.shipment.$valid) {
                $http({
                    url: virtualDir.AdminURL + '/Shipment/Shipments',
                    method: "POST",
                    data: JSON.stringify($scope.Shipments),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        if (data == null)
                            $scope.message = "Failed";
                        else if (data.ErrorMessage != null) {
                            $scope.message = data.ErrorMessage;
                            $("#frmShipments").hide();
                        }
                        else {
                            window.open("http://" + data.LabelImage.OutputImage.replace("10.0.0.124", "localhost"), "_blank");
                            $scope.message = "Label Generated Successfully";
                            $("#frmShipments").hide();
                        }
                    }).error(function (data, status, headers, config) {
                    });
            }
        };
    });

    app.factory('shippingModels', function () {
        var shippingModels = {};
        shippingModels.Shipment = function () {
            this.Company = null;
            this.Name = null;
            this.Phone = null;
            this.Email = null;
            this.AddressType = null;
            this.AddressCaption = null;
            this.Address1 = null;
            this.City = null;
            this.CountryId = null;
            this.PostalCode = null;
            this.Division = null;

            this.RCompany = null;
            this.Rname = null;
            this.Rphone = null;
            this.REmail = null;
            this.RAddressType = null;

            this.AddressCaption = null;
            this.RaddressCaption = null;
            this.Raddressline1 = null;
            this.Rcity = null;
            this.RCountryId = null;
            this.Rpostalcode = null;
            this.RDivision = null;

            this.shipmentdate = '01/01/1900';
            this.unitsystem = null;
            this.packagetype = null;
            this.Insurance = null;
            this.Declared = null;
            this.Parcel = [];
        };
        shippingModels.Shipment.Parcel = function () {
            this.items = [{
                Weight: 0,
                Width: 0,
                Height: 0,
                Length: 0,
                IsRemoveActive: 1
            }];
        };

        return shippingModels;
    });

    app.factory('VendorTypeModels', function () {
        var VendorTypeModels = {};
        vendorTypeModels.Shipment = function () {
            this.vendortype = null;
        };

        return VendorTypeModels;
    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('CountryController', function ($scope, $http, $location, $filter) {
        $scope.submitCountryForm = function ()
        {
            
            if ($scope.CountryForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/Country',
                    method: "POST",
                    data: JSON.stringify($scope.Country),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
       
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var selectedCountry = [];
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllCountries',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    var selectedCountry = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindCountry(selectedCountry);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //Edit ends here
        $scope.bindCountry = function (country) {
            $scope.Country.Id = country.Id;
            $scope.Country.Name = country.Name;
            $scope.Country.ISOCode = country.ISOCode;
            $scope.Country.TopLevelDomain = country.TopLevelDomain;
            $scope.Country.DialingCode = country.DialingCode;
            $scope.Country.Delivery = country.Delivery;
            $scope.Country.Membership = country.Membership;
            $scope.Country.TimeZone = country.TimeZone;
            $scope.Country.Status = country.Status;
            $scope.Country.SecurityCharge = country.SecurityCharge;
            $scope.$apply();

            $("#Delivery").find('option[value=' + country.Delivery+ ']').attr('selected', 'selected');
            $("#Membership").find('option[value=' + country.Membership+ ']').attr('selected', 'selected');
            //$("#TimeZone").find('option[value=' + country.TimeZone+ ']').attr('selected', 'selected');
            $("#Status").find('option[value=' + country.Status+ ']').attr('selected', 'selected');
            $("#SecurityCharge").find('option[value=' + country.SecurityCharge + ']').attr('selected', 'selected');
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewCountryController', function ($scope, $http, $window) {
        $scope.GetAllCountries = function () {
            $scope.columnDefs = [
            {
                "mDataProp": "Id",
                "aTargets": [0]
            },
            {
                "mDataProp": "Name",
                "aTargets": [1]
            }, {
                "mDataProp": "ISOCode",
                "aTargets": [2]
            }, {
                "mDataProp": "TopLevelDomain",
                "aTargets": [3]
            }, {
                "mDataProp": "DialingCode",
                "aTargets": [4]
            }, {
                "mDataProp": "Delivery",
                "aTargets": [5]
            }, {
                "mDataProp": "Membership",
                "aTargets": [6]
            }, {
                "mDataProp": "SecurityCharge",
                "aTargets": [7]
            }, {
                "mDataProp": "Status",
                "aTargets": [8]
            }, {
                "mDataProp": "Detail",
                "aTargets": [9]
            }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllCountries',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {

                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                        if (data[i].Status == 0) {
                            data[i].Status = 'SUSPENDED';
                        } else { data[i].Status = 'ACTIVE'; }

                        if (data[i].SecurityCharge == 0) {
                            data[i].SecurityCharge = 'NO';
                        } else { data[i].SecurityCharge = 'YES'; }

                        if (data[i].Membership == 2) {
                            data[i].Membership = 'NOT ALLOWED';
                        } else { data[i].Membership = 'ALLOWED'; }

                        if (data[i].Delivery == 2) {
                            data[i].Delivery = 'NOT AVAILABLE';
                        } else { data[i].Delivery = 'AVAILABLE'; }
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/Home/DeleteCountryById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllCountries();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
           }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/Country/?" + Id;
            $window.location.href = url;
        }

        $("#btndelete").on("click", function () {
            alert("The paragraph was clicked.");
        });
        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllCountries();
        
    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('StateController', function ($scope, $http, $location, $filter) {
        $scope.Country = [];
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
                $scope.Country = (JSON.parse(data));
                //Editing of country working here
                if ($location.absUrl().split("?").length > 1) {
                    $("#veil").show();
                    $("#feedLoading").show();
                    var Id = $location.absUrl().split("/");
                    var editdata = Id[5];
                    var editrow = editdata.split("?");
                    $http({
                        method: 'GET',
                        url: '/ServiceRate/Home/GetAllStates',
                        //data: $scope.SelectedCountry.CountryCode,
                        //params: { countryId: $scope.contact.CountryId },
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
                            var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                            $scope.bindData(selectedData);
                            $("#veil").hide();
                            $("#feedLoading").hide();
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.message = 'Unexpected Error';
                    });
                }
                //End Editing
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            bootbox.dialog({
                message: "Country URL is invalid!",
                buttons: {
                    "success": {
                        "label": "OK",
                        "className": "btn-sm btn-primary"
                    }
                }
            });
        });
        $scope.submitStateForm = function ()
        {
            
            if ($scope.StateForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/State',
                    method: "POST",
                    data: JSON.stringify($scope.State),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindData = function (state) {
            $scope.State.Id = state.Id;
            $scope.State.Country = state.Country;
            $scope.State.Name = state.Name;
            $scope.State.Code = state.Code;
            $scope.State.TimeZone = state.TimeZone;
            $scope.State.FIPS = state.FIPS;
            $scope.State.AdditionalDays = state.AdditionalDays;
            $scope.State.Status = state.Status;
            $scope.$apply();
            $("#Delivery").find('option[value=' + state.Delivery+ ']').attr('selected', 'selected');
            $("#Membership").find('option[value=' + state.Membership + ']').attr('selected', 'selected');
            $("#Country").find('option[value=' + state.Country + ']').attr('selected', 'selected');
            $("#TimeZone").find('option[value=' + state.TimeZone + ']').attr('selected', 'selected');
            $("#Status").find('option[value=' + state.Status+ ']').attr('selected', 'selected');
            $("#SecurityCharge").find('option[value=' + state.SecurityCharge + ']').attr('selected', 'selected');
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewStateController', function ($scope, $http, $window) {
        $scope.GetAllStates = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "Code",
                    "aTargets": [0]
                },
            {
                "mDataProp": "Name",
                "aTargets": [1]
            }, {
                "mDataProp": "TimeZone",
                "aTargets": [2]
            }, {
                "mDataProp": "Status",
                "aTargets": [3]
            }, {
                "mDataProp": "Detail",
                "aTargets": [4]
            }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllStates',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {

                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                        if (data[i].Status == 0) {
                            data[i].Status = 'SUSPENDED';
                        } else { data[i].Status = 'ACTIVE'; }
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/Home/DeleteStateById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllStates();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/State/?" + Id;
            $window.location.href = url;
        }

        $("#btndelete").on("click", function () {
            alert("The paragraph was clicked.");
        });
        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllStates();

    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('PostController', function ($scope, $http, $location, $filter) {
        $scope.Country = [];
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
                $scope.Country = (JSON.parse(data));
                $http({
                    method: 'GET',
                    url: '/User/Home/Division',
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
                        //Editing of country working here
                        if ($location.absUrl().split("?").length > 1) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            var Id = $location.absUrl().split("/");
                            var editdata = Id[5];
                            var editrow = editdata.split("?");
                            $http({
                                method: 'GET',
                                url: '/ServiceRate/Home/GetAllPostCodes',
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
                                    var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                                    $scope.bindPostData(selectedData);
                                    $("#veil").hide();
                                    $("#feedLoading").hide();
                                }
                            }).error(function (data, status, headers, config) {
                                $scope.message = 'Unexpected Error';
                            });
                        }
                        //End Editing
                        $("#veil").hide();
                        $("#feedLoading").hide();
                    }
                })
                    .error(function (data, status, headers, config) {
                    $scope.message = 'Unexpected Error';
                });
               
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            bootbox.dialog({
                message: "Country URL is invalid!",
                buttons: {
                    "success": {
                        "label": "OK",
                        "className": "btn-sm btn-primary"
                    }
                }
            });
        });
      
        $scope.submitPostCodeForm = function ()
        {
            
            if ($scope.PostCodeForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/PostCode',
                    method: "POST",
                    data: JSON.stringify($scope.PostCode),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindPostData = function (post) {
            $scope.PostCode.Id = post.Id;
            $scope.PostCode.Country = post.Country;
            $scope.PostCode.State = post.State;
            $scope.PostCode.PostCode = post.PostalCode;
            $scope.PostCode.CityName = post.CityName;
            $scope.PostCode.CityType = post.CityType;
            $scope.PostCode.CountryName = post.CountryName;
            $scope.PostCode.CountryFIPS = post.CountryFIPS;
            $scope.PostCode.Class = post.Class;
            $scope.PostCode.TimeZone = post.TimeZone;
            $scope.PostCode.DaylightSavingsTime = post.DaylightSavingsTime;
            $scope.PostCode.EarliestDeliveryTime = post.EarliestDeliveryTime;
            $scope.PostCode.AreaCode = post.AreaCode;
            $scope.PostCode.SaturdayDelivery = post.SaturdayDelivery;
            $scope.PostCode.Pickup = post.Pickup;
            $scope.PostCode.Delivery = post.Delivery;
            $scope.PostCode.LastPickup = post.LastPickup;
            $scope.PostCode.LastPickupOrder = post.LastPickupOrder;
            $scope.PostCode.Latitude = post.Latitude;
            $scope.PostCode.Longitude = post.Longitude;
            $scope.PostCode.AdditionalDays = post.AdditionalDays;
            $scope.PostCode.Status = post.Status;
            $scope.$apply();
            $("#Country").find('option[value=' + post.Country + ']').attr('selected', 'selected');
            $("#ddlState").find('option[value=' + post.State + ']').attr('selected', 'selected');
            $("#PostClass").find('option[value=' + post.Class + ']').attr('selected', 'selected');
            $("#CityType").find('option[value=' + post.CityType + ']').attr('selected', 'selected');
            $("#SecurityCharge").find('option[value=' + post.SecurityCharge + ']').attr('selected', 'selected');
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewPostCodeController', function ($scope, $http, $window) {

        $http({
            method: 'GET',
            url: '/User/Home/Division',
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
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });

        $scope.GetAllPostCodes = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "State",
                    "aTargets": [0]
                },
            {
                "mDataProp": "CityName",
                "aTargets": [1]
            }, {
                "mDataProp": "CityType",
                "aTargets": [2]
            }, {
                "mDataProp": "CountryName",
                "aTargets": [3]
            }, {
                "mDataProp": "PostalCode",
                "aTargets": [4]
            },
             {
                "mDataProp": "Class",
                "aTargets": [5]
             },
             {
                 "mDataProp": "AreaCode",
                 "aTargets": [6]
             },
             {
                 "mDataProp": "TimeZone",
                 "aTargets": [7]
             },
             {
                 "mDataProp": "AdditionalDays",
                 "aTargets": [8]
             },
             {
                 "mDataProp": "SaturdayDelivery",
                 "aTargets": [9]
             },
            {
                "mDataProp": "Pickup",
                "aTargets": [10]
            },
            {
                "mDataProp": "Delivery",
                "aTargets": [11]
            }
            , {
                "mDataProp": "Detail",
                "aTargets": [12]
            }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllPostCodes',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {

                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                        data[i].SaturdayDelivery = data[i].SaturdayDelivery == true ? "YES" : "NO";
                        data[i].Pickup = data[i].Pickup == true ? "AVAILABLE" : "UN-AVAILABLE";
                        data[i].Delivery = data[i].Delivery == true ? "AVAILABLE" : "UN-AVAILABLE";
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
     
        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/Home/DeletePostById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllPostCodes();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/PostCode/?" + Id;
            $window.location.href = url;
        }

        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllPostCodes();

    });
})();
(function () {
    var app = angular.module('mainApp');


    // create angular controller
    app.controller('AgentsController', function ($scope, $location, $http, $filter) {

        $scope.model = { CountryId: null, AgentName: null, LabelAPI: null, PickupCharge: null, SatPickupCharge: null, TrackingURL: null,Id: null };
        $scope.model.Id = 0;
        //HTTP REQUEST BELOW
        $("#veil").show();
        $("#feedLoading").show();
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
                $scope.Country = (JSON.parse(data));
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            bootbox.dialog({
                message: "Country URL is invalid!",
                buttons: {
                    "success": {
                        "label": "OK",
                        "className": "btn-sm btn-primary"
                    }
                }
            });
        });




        if ($location.absUrl().split("?").length > 1) {
            var selectedAgents = [];
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/ServiceRate/GetAllAgents',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    selectedAgents = data;
                    var selectedAgents = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];



                    $scope.model.CountryId = selectedAgents.CountryId;
                    $scope.model.AgentName = selectedAgents.AgentName;
                    $scope.model.LabelAPI = selectedAgents.LabelAPI;
                    $scope.model.PickupCharge = selectedAgents.PickupCharge;
                    $scope.model.SatPickupCharge = selectedAgents.SaturdayPickupCharge;
                    $scope.model.TrackingURL = selectedAgents.TrackingURL;
                    $scope.model.Id = selectedAgents.Id;

                    $scope.$apply();


                    $("#Country").find('option[value=' + selectedAgents.CountryId + ']').attr('selected', 'selected');



                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });

        }


        $scope.submitForm = function () {
            if ($scope.Agents.$valid) {
                $("#veil").show();
                $("#feedLoading").show();
                $http({
                    url: '/ServiceRate/Home/Agents',
                    method: "POST",
                    data: JSON.stringify($scope.model),
                    contentType: "application/json;",
                    dataType: "json"
                })
                .success(function (data, status, headers, config) {

                    if (data == "Success") {
                        $scope.message = $scope.model.Id > 0 ? "Agents updated successfully!" : "New Agents added!"
                        bootbox.dialog({
                            message: $scope.message,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary",
                                    callback: function () {
                                        window.location.href = "/ServiceRate/Home/ViewAgents";
                                    }
                                }
                            }
                        });
                    }
                }).error(function (data, status, headers, config) {
                    alert(data);
                });
                //Ends herefor saving addresssbook record.
            }
            else {
                $scope.message = "Invalid";
            }
        }

    });

})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewAgentsController', function ($scope, $window, $http) {


        $scope.deleteForm = function (Id,Name) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Name,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/DeleteAgents',
                            //data: $scope.SelectedCountry.CountryCode,
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.columnDefs = [{
                                "mDataProp": "CountryId",
                                "aTargets": [0]
                            }, {
                                "mDataProp": "AgentName",
                                "aTargets": [1]
                            }, {
                                "mDataProp": "LabelAPI",
                                "aTargets": [2]
                            }, {
                                "mDataProp": "PickupCharge",
                                "aTargets": [3]
                            }, {
                                "mDataProp": "SaturdayPickupCharge",
                                "aTargets": [4]
                            }, {
                                "mDataProp": "TrackingURL",
                                "aTargets": [5]
                            }, {
                                "mDataProp": "Detail",
                                "aTargets": [6]
                            }];

                            $scope.overrideOptions = {
                                "bStateSave": true,
                                "iCookieDuration": 2419200,
                                /* 1 month */
                                "bJQueryUI": true,
                                "bPaginate": false,
                                "bLengthChange": false,
                                "bFilter": true,
                                "bInfo": true,
                                "bDestroy": true
                            };

                            $http({
                                method: 'GET',
                                url: '/ServiceRate/GetAllAgents',
                                //data: $scope.SelectedCountry.CountryCode,
                                //params: { countryId: $scope.contact.CountryId },
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
                                    bootbox.dialog({
                                        message: str,
                                        buttons: {
                                            "success": {
                                                "label": "OK",
                                                "className": "btn-sm btn-primary"
                                            }
                                        }
                                    });
                                }
                                else {
                                    var lim = data.length;
                                    for (var i = 0; i < lim; i++) {
                                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')" ></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ',' + data[i].AgentName + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                                        if (data[i].AddressType == 0) {
                                            data[i].AddressType = 'Recipient';
                                        } else { data[i].AddressType = 'Sender'; }

                                        if (data[i].Status == 0) {
                                            data[i].Status = 'De-Active';
                                        } else { data[i].Status = 'Active'; }
                                    }

                                    $scope.datasrc = data;
                                    $("#veil").hide();
                                    $("#feedLoading").hide();
                                }
                            }).error(function (data, status, headers, config) {
                                $scope.message = 'Unexpected Error';
                            });
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/Agents/?" + Id;
            //$log.log(url);
            $window.location.href = url;
      }


    


        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };

        $scope.columnDefs = [{
            "mDataProp": "CountryId",
            "aTargets": [0]
        }, {
            "mDataProp": "AgentName",
            "aTargets": [1]
        }, {
            "mDataProp": "LabelAPI",
            "aTargets": [2]
        }, {
            "mDataProp": "PickupCharge",
            "aTargets": [3]
        }, {
            "mDataProp": "SaturdayPickupCharge",
            "aTargets": [4]
        }, {
            "mDataProp": "TrackingURL",
            "aTargets": [5]
        }, {
            "mDataProp": "Detail",
            "aTargets": [6]
        }];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };

        $http({
            method: 'GET',
            url: '/ServiceRate/GetAllAgents',
            //data: $scope.SelectedCountry.CountryCode,
            //params: { countryId: $scope.contact.CountryId },
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
                bootbox.dialog({
                    message: str,
                    buttons: {
                        "success": {
                            "label": "OK",
                            "className": "btn-sm btn-primary"
                        }
                    }
                });
            }
            else {
                var lim = data.length;
                for (var i = 0; i < lim; i++) {
                    data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ','+"'" + data[i].AgentName +"'"+ ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';

                }

                $scope.datasrc = data;
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();
(function () {
    var app = angular.module('mainApp');


    // create angular controller
    app.controller('AgentServiceController', function ($scope, $location, $http, $filter) {

        $scope.model = { CountryId: null, AgentName: null, LabelAPI: null, PickupCharge: null, SatPickupCharge: null, TrackingURL: null,Id: null };
        $scope.model.Id = 0;
        //HTTP REQUEST BELOW
       
        
        if ($location.absUrl().split("?").length > 1) {
            var selectedAgents = [];
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/ServiceRate/GetAllAgents',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    selectedAgents = data;
                    var selectedAgents = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];



                    $scope.model.CountryId = selectedAgents.CountryId;
                    $scope.model.AgentName = selectedAgents.AgentName;
                    $scope.model.LabelAPI = selectedAgents.LabelAPI;
                    $scope.model.PickupCharge = selectedAgents.PickupCharge;
                    $scope.model.SatPickupCharge = selectedAgents.SaturdayPickupCharge;
                    $scope.model.TrackingURL = selectedAgents.TrackingURL;
                    $scope.model.Id = selectedAgents.Id;

                    $scope.$apply();


                    $("#Country").find('option[value=' + selectedAgents.CountryId + ']').attr('selected', 'selected');



                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });

        }


        $scope.submitForm = function () {
            if ($scope.Agents.$valid) {
                $("#veil").show();
                $("#feedLoading").show();
                $http({
                    url: '/ServiceRate/Home/AgentService',
                    method: "POST",
                    data: JSON.stringify($scope.model),
                    contentType: "application/json;",
                    dataType: "json"
                })
                .success(function (data, status, headers, config) {

                    if (data == "Success") {
                        $scope.message = $scope.model.Id > 0 ? "Agent Service updated successfully!" : "New Agent Service added!"
                        bootbox.dialog({
                            message: $scope.message,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary",
                                    callback: function () {
                                        window.location.href = "/ServiceRate/Home/ViewAgentService";
                                    }
                                }
                            }
                        });
                    }
                }).error(function (data, status, headers, config) {
                    alert(data);
                });
                //Ends herefor saving addresssbook record.
            }
            else {
                $scope.message = "Invalid";
            }
        }

    });

})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewAgentServiceController', function ($scope, $window, $http) {


        $scope.deleteForm = function (Id,Name) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Name,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/DeleteAgents',
                            //data: $scope.SelectedCountry.CountryCode,
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.columnDefs = [{
                                "mDataProp": "CountryId",
                                "aTargets": [0]
                            }, {
                                "mDataProp": "AgentName",
                                "aTargets": [1]
                            }, {
                                "mDataProp": "LabelAPI",
                                "aTargets": [2]
                            }, {
                                "mDataProp": "PickupCharge",
                                "aTargets": [3]
                            }, {
                                "mDataProp": "SaturdayPickupCharge",
                                "aTargets": [4]
                            }, {
                                "mDataProp": "TrackingURL",
                                "aTargets": [5]
                            }, {
                                "mDataProp": "Detail",
                                "aTargets": [6]
                            }];

                            $scope.overrideOptions = {
                                "bStateSave": true,
                                "iCookieDuration": 2419200,
                                /* 1 month */
                                "bJQueryUI": true,
                                "bPaginate": false,
                                "bLengthChange": false,
                                "bFilter": true,
                                "bInfo": true,
                                "bDestroy": true
                            };

                            $http({
                                method: 'GET',
                                url: '/ServiceRate/GetAllAgents',
                                //data: $scope.SelectedCountry.CountryCode,
                                //params: { countryId: $scope.contact.CountryId },
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
                                    bootbox.dialog({
                                        message: str,
                                        buttons: {
                                            "success": {
                                                "label": "OK",
                                                "className": "btn-sm btn-primary"
                                            }
                                        }
                                    });
                                }
                                else {
                                    var lim = data.length;
                                    for (var i = 0; i < lim; i++) {
                                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')" ></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ',' + data[i].AgentName + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                                        if (data[i].AddressType == 0) {
                                            data[i].AddressType = 'Recipient';
                                        } else { data[i].AddressType = 'Sender'; }

                                        if (data[i].Status == 0) {
                                            data[i].Status = 'De-Active';
                                        } else { data[i].Status = 'Active'; }
                                    }

                                    $scope.datasrc = data;
                                    $("#veil").hide();
                                    $("#feedLoading").hide();
                                }
                            }).error(function (data, status, headers, config) {
                                $scope.message = 'Unexpected Error';
                            });
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/Agents/?" + Id;
            //$log.log(url);
            $window.location.href = url;
      }


    


        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };

        $scope.columnDefs = [{
            "mDataProp": "CountryId",
            "aTargets": [0]
        }, {
            "mDataProp": "AgentName",
            "aTargets": [1]
        }, {
            "mDataProp": "LabelAPI",
            "aTargets": [2]
        }, {
            "mDataProp": "PickupCharge",
            "aTargets": [3]
        }, {
            "mDataProp": "SaturdayPickupCharge",
            "aTargets": [4]
        }, {
            "mDataProp": "TrackingURL",
            "aTargets": [5]
        }, {
            "mDataProp": "Detail",
            "aTargets": [6]
        }];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };

        $http({
            method: 'GET',
            url: '/ServiceRate/GetAllAgents',
            //data: $scope.SelectedCountry.CountryCode,
            //params: { countryId: $scope.contact.CountryId },
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
                bootbox.dialog({
                    message: str,
                    buttons: {
                        "success": {
                            "label": "OK",
                            "className": "btn-sm btn-primary"
                        }
                    }
                });
            }
            else {
                var lim = data.length;
                for (var i = 0; i < lim; i++) {
                    data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ','+"'" + data[i].AgentName +"'"+ ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';

                }

                $scope.datasrc = data;
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('ZoneUSController', function ($scope, $http, $location, $filter) {
        $scope.ZoneUS = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllZoneUS',
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
                    var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindZoneData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing
      
        $scope.submitZoneUSForm = function ()
        {
            if ($scope.ZoneUSForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/ZoneUS',
                    method: "POST",
                    data: JSON.stringify($scope.ZoneUS),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindZoneData = function (zone) {
            $scope.ZoneUS.Id = zone.Id;
            $scope.ZoneUS.OriginZipLower = zone.OriginZipLower;
            $scope.ZoneUS.OriginZipUpper = zone.OriginZipUpper;
            $scope.ZoneUS.DestinationZipLower = zone.DestinationZipLower;
            $scope.ZoneUS.DestinationZipUpper = zone.DestinationZipUpper;
            $scope.ZoneUS.Zone = zone.Zone;
            $scope.$apply();
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewZoneUSController', function ($scope, $http, $window) {

        $scope.GetAllPostCodes = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "OriginZipLower",
                    "aTargets": [0]
                },
            {
                "mDataProp": "DestinationZipLower",
                "aTargets": [1]
            }, {
                "mDataProp": "Zone",
                "aTargets": [2]
            },
            {
                "mDataProp": "Created",
                "aTargets": [3]
            }, {
                "mDataProp": "Detail",
                "aTargets": [4]
            }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllZoneUS',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {

                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }

        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/Home/DeleteZoneUSById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllPostCodes();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/ZoneUS/?" + Id;
            $window.location.href = url;
        }

        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllPostCodes();

    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('ZoneController', function ($scope, $http, $location, $filter, getQueryStringValue) {

        $scope.isAgentOn = false;

        if (getQueryStringValue.getValue("agent") != null && getQueryStringValue.getValue("agent") === "true") {
            $scope.isAgentOn = true;
            $scope.url = "/ServiceRate/ViewZone?agent=true";
        }
        else
            $scope.url = "/ServiceRate/ViewZone";

        $scope.Zone = {};
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
                $scope.CountryOrigin = (JSON.parse(data));
                $scope.CountryDestination = (JSON.parse(data));
                //Editing of country working here
                //if ($location.absUrl().split("?").length > 1) {
                var id = getQueryStringValue.getValue("id");
                if (id != null && Number(id)!=0) {
                    $("#veil").show();
                    $("#feedLoading").show();
                   
                    $http({
                        method: 'GET',
                        url: '/ServiceRate/Home/GetAllZone',
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
                            var selectedData = $filter('filter')(data, function (d) { return d.Id == Number(id) })[0];
                            $scope.bindZoneData(selectedData);
                            $("#veil").hide();
                            $("#feedLoading").hide();
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.message = 'Unexpected Error';
                    });
                }
                //End Editing

                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            bootbox.dialog({
                message: "Country URL is invalid!",
                buttons: {
                    "success": {
                        "label": "OK",
                        "className": "btn-sm btn-primary"
                    }
                }
            });
        });

        $scope.submitZoneForm = function ()
        {
            if ($scope.ZoneForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/Zone',
                    method: "POST",
                    data: JSON.stringify($scope.Zone),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindZoneData = function (zone) {
            $scope.Zone.Id = zone.Id;
            $scope.Zone.Service = zone.Service;
            $scope.Zone.OriginCountry = zone.OriginCountry;
            $scope.Zone.DestinationCountry = zone.DestinationCountry;
            $scope.Zone.ZoneUS = zone.ZoneUS;
            $scope.Zone.TransitTime = zone.TransitTime;
            $scope.$apply();
            $("#OriginCountry").find('option[value=' + zone.OriginCountry + ']').attr('selected', 'selected');
            $("#DestinationCountry").find('option[value=' + zone.DestinationCountry+ ']').attr('selected', 'selected');
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewZoneController', function ($scope, $http, $window, getQueryStringValue) {
        $scope.isAgentOn = false;

        if (getQueryStringValue.getValue("agent") != null && getQueryStringValue.getValue("agent") === "true") {
            $scope.isAgentOn=true;
            $scope.url = "/ServiceRate/Zone?agent=true";
        }
        else
            $scope.url = "/ServiceRate/Zone";

        $scope.GetAllPostCodes = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "OriginCountry",
                    "aTargets": [0]
                },
            {
                "mDataProp": "DestinationCountry",
                "aTargets": [1]
            }, {
                "mDataProp": "ZoneUS",
                "aTargets": [2]
            },
            {
                "mDataProp": "TransitTime",
                "aTargets": [3]
            },
            {
                "mDataProp": "Created",
                "aTargets": [4]
            }, {
                "mDataProp": "Detail",
                "aTargets": [5]
            }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllZone',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {

                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }

        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/Home/DeleteZoneById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllPostCodes();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var appenturl=$scope.isAgentOn==true?"&agent=true":"";
            var url = "http://" + $window.location.host + "/ServiceRate/Zone?id=" + Id + appenturl;
            $window.location.href = url;
        }

        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllPostCodes();
        $scope.message = $scope.url;
    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('FSCController', function ($scope, $http, $location, $filter, getQueryStringValue) {
        $scope.FSC = {};
        if (getQueryStringValue.getValue("agent") != null && getQueryStringValue.getValue("agent") === "true") {
            $scope.isAgentOn = true;
            $scope.url = "/ServiceRate/ViewFSC?agent=true";
        }
        else
            $scope.url = "/ServiceRate/ViewFSC";

        var id = getQueryStringValue.getValue("id");
        //Editing of country working here
        if (id != null && Number(id) != 0) {
            $("#veil").show();
            $("#feedLoading").show();
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllFSC',
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
                    var selectedData = $filter('filter')(data, function (d) { return d.Id == Number(id) })[0];
                    $scope.bindFSCData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing
      
      
        $scope.submitFSCForm = function ()
        {
            if ($scope.FSCForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/FSC',
                    method: "POST",
                    data: JSON.stringify($scope.FSC),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindFSCData = function (filtered) {
            $scope.FSC.Id = filtered.Id;
            $scope.FSC.Service = filtered.Service;
            $scope.FSC.FSCValue = filtered.FSCValue;
            $scope.FSC.EffectiveDate = filtered.EffectiveDate;
            $scope.$apply();
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewFSCController', function ($scope, $http, $window, getQueryStringValue) {

        $scope.isAgentOn = false;

        if (getQueryStringValue.getValue("agent") != null && getQueryStringValue.getValue("agent") === "true") {
            $scope.isAgentOn = true;
            $scope.url = "/ServiceRate/FSC?agent=true";
        }
        else
            $scope.url = "/ServiceRate/FSC";

        $scope.GetAllPostCodes = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "Service",
                    "aTargets": [0]
                },
            {
                "mDataProp": "FSCValue",
                "aTargets": [1]
            }, {
                "mDataProp": "EffectiveDate",
                "aTargets": [2]
            },
            {
                "mDataProp": "Created",
                "aTargets": [3]
            },
             {
                "mDataProp": "Detail",
                "aTargets": [4]
            }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllFSC',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {

                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }

        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/Home/DeleteFSCById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllPostCodes();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var appenturl = $scope.isAgentOn == true ? "&agent=true" : "";
            var url = "http://" + $window.location.host + "/ServiceRate/FSC?id=" + Id+appenturl;
            $window.location.href = url;
        }

        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllPostCodes();

    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('DiscountController', function ($scope, $http, $location, $filter) {
        $scope.Discount = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllDiscount',
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
                    var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindDiscountData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing
      
      
        $scope.submitDiscountForm = function ()
        {
            if ($scope.DiscountForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/Discount',
                    method: "POST",
                    data: JSON.stringify($scope.Discount),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindDiscountData = function (filtered) {
            $scope.Discount.Id = filtered.Id;
            $scope.Discount.Service = filtered.Service;
            $scope.Discount.FSCValue = filtered.FSCValue;
            $scope.Discount.EffectiveDate = filtered.EffectiveDate;
            $scope.$apply();
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewDiscountController', function ($scope, $http, $window) {

        $scope.tabelsData = [
       { 'name': 'rohit', 'dob': '15-august-1985', 'emailId': 'rohit@rohit.com', 'phone': '9999999999', 'address': 'Delhi Rohini', 'id': '0' },
       { 'name': 'aman', 'dob': '26-july-1975', 'emailId': 'haryanat@hr.com', 'phone': '9874563210', 'address': 'Haryana Sonepat', 'id': '1' },
       { 'name': 'devraj', 'dob': '27-march-1980', 'emailId': 'punjab@punjab.com', 'phone': '7410258963', 'address': 'Punjab AmritSar', 'id': '2' }
        ];


        $scope.modify = function (tableData) {

            $scope.modifyField = true;
            $scope.viewField = true;
        };


        $scope.update = function (tableData) {
            $scope.modifyField = false;
            $scope.viewField = false;
        };

        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/Home/DeleteDiscountById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllPostCodes();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/Discount/?" + Id;
            $window.location.href = url;
        }

        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('FinanceController', function ($scope, $http, $location, $filter) {
        $scope.Finance = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/Finance/GetAllInvoiceMessage',
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
                    var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindFinanceData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing
        $scope.submitFinanceForm = function ()
        {
            if ($scope.FinanceForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Finance/InvoiceMessage',
                    method: "POST",
                    data: JSON.stringify($scope.Finance),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindFinanceData = function (filtered) {
            $scope.Finance.Id = filtered.Id;
            $scope.Finance.AccountNo = filtered.AccountNo;
            $scope.Finance.MessageTitle = filtered.MessageTitle;
            $scope.Finance.MessageBody = filtered.MessageBody;
            $scope.Finance.EffectiveFrom = filtered.EffectiveFrom;
            $scope.Finance.EffectiveTo = filtered.EffectiveTo;
            $scope.Finance.Status = filtered.Status;
            $scope.$apply();
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewFinanceController', function ($scope, $http, $window) {

        $scope.GetAllPostCodes = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "AccountNo",
                    "aTargets": [0]
                },
            {
                "mDataProp": "MessageTitle",
                "aTargets": [1]
            }, {
                "mDataProp": "EffectiveFrom",
                "aTargets": [2]
            },
             {
                 "mDataProp": "EffectiveTo",
                 "aTargets": [3]
             },
            {
                "mDataProp": "Created",
                "aTargets": [4]
            },
            {
                "mDataProp": "Status",
                "aTargets": [5]
            },
             {
                "mDataProp": "Detail",
                "aTargets": [6]
            }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/Finance/GetAllInvoiceMessage',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {
                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                        data[i].Status=data[i].Status == "0" ? "EXPIRED" : "ACTIVE";
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }

        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/Home/DeleteInvoiceMessageById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllPostCodes();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/Finance/InvoiceMessage/?" + Id;
            $window.location.href = url;
        }

        //$("#veil").show();
        //$("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllPostCodes();

    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('PaymentController', function ($scope, $http, $filter, getQueryStringValue) {
        $scope.Payment = {};
        $scope.CreditVisible = false;
        if (getQueryStringValue.getValue("op") != null && getQueryStringValue.getValue("op")==="credit")
        {
            $scope.CreditVisible = true;
        }
            
        //alert(getQueryStringValue.getValue("opt"));
       //var res= getQueryStringValue.passString("opt");
        $scope.submitPaymentForm = function ()
        {
            if ($scope.PaymentForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Finance/Payment',
                    method: "POST",
                    data: JSON.stringify($scope.Payment),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
    })})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('FreightRequestsController', function ($scope, $http, $location, $filter, ShipOSFactory) {
        $scope.Services = {};
        $scope.ProcessTypes = {};
        $scope.FreightRequests = {};
        
        ShipOSFactory.GetServices().success(function (services) {
            $scope.Services = services;

            ShipOSFactory.ProcessedTypes().success(function (services) {
                $scope.ProcessTypes = services;

                //Editing of country working here
                if ($location.absUrl().split("?").length > 1) {
                    $("#veil").show();
                    $("#feedLoading").show();
                    var Id = $location.absUrl().split("/");
                    var editdata = Id[5];
                    var editrow = editdata.split("?");
                    $http({
                        method: 'GET',
                        url: '/Freight/GetAllFreightRequests',
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
                            var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                            $scope.bindFreightRequestsData(selectedData);
                            $("#veil").hide();
                            $("#feedLoading").hide();
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.message = 'Unexpected Error';
                    });
                }
                //End Editing


            }).error(function (error) {
                $scope.message = 'Unable to load Process Types data: ' + error.message;
            });

        }).error(function (error) {
            $scope.message = 'Unable to load service data: ' + error.message;
        });

        $scope.submitFreightRequestsForm = function ()
        {
            if ($scope.FreightForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Freight/FreightRequests',
                    method: "POST",
                    data: JSON.stringify($scope.FreightRequests),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindFreightRequestsData = function (filtered) {
            $scope.FreightRequests.Id = filtered.Id;
            $scope.FreightRequests.Service = filtered.Service;
            $scope.FreightRequests.TrackingNumber = filtered.TrackingNumber;
            $scope.FreightRequests.CompanyName = filtered.CompanyName;

            $scope.FreightRequests.ContactName = filtered.ContactName;
            $scope.FreightRequests.Phone = filtered.Phone;
            $scope.FreightRequests.Fax = filtered.Fax;

            $scope.FreightRequests.Email = filtered.Email;
            $scope.FreightRequests.ShipmentDate = filtered.ShipmentDate;
            $scope.FreightRequests.ContactMethod = filtered.ContactMethod;
            $scope.FreightRequests.ProcessedType = filtered.ProcessedType;
            $scope.$apply();
            $("#ProcessType").find('option[value=' + filtered.ProcessedType + ']').attr('selected', 'selected');
            $("#Service").find('option[value=' + filtered.Service + ']').attr('selected', 'selected');
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewFreightRequestsController', function ($scope, $http, $window, $filter, ShipOSFactory) {
        $scope.Services = {};
        $scope.ProcessTypes = {};
        $scope.GetAllData = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "TrackingNumber",
                    "aTargets": [0]
                },
            {
                "mDataProp": "Service",
                "aTargets": [1]
            }, {
                "mDataProp": "ContactName",
                "aTargets": [2]
            },
             {
                 "mDataProp": "ProcessedType",
                 "aTargets": [3]
             },
             {
                 "mDataProp": "Detail",
                 "aTargets": [4]
             }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/Freight/GetAllFreightRequests',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {
                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                        //data[i].Service = $filter('filter')($scope.Services, function (d) { return d.Id == Number(data[i].Service) })[0].Name;
                        //data[i].ProcessedType = $filter('filter')($scope.ProcessTypes, function (d) { return d.Id == Number(data[i].ProcessedType) })[0].Name;
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        ShipOSFactory.GetServices().success(function (services) {
            $scope.Services = services;

        }).error(function (error) {
            $scope.message = 'Unable to load service data: ' + error.message;
        });

        ShipOSFactory.ProcessedTypes().success(function (services) {
            $scope.ProcessTypes = services;

        }).error(function (error) {
            $scope.message = 'Unable to load Process Types data: ' + error.message;
        });
        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/Freight/DeleteFreightRequestById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllData();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/Freight/FreightRequests/?" + Id;
            $window.location.href = url;
        }

        //$("#veil").show();
        //$("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllData();

    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('CostItemsController', function ($scope, $http, $location, $filter) {
        $scope.CostItems = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/Freight/GetAllCostItems',
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
                    var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindFreightData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing

        $scope.submitCostItemsForm = function ()
        {
            if ($scope.CostItemsForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Freight/FreightCostItem',
                    method: "POST",
                    data: JSON.stringify($scope.CostItems),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        if (data == "Success") {
                            $scope.message = $scope.CostItems.Id > 0 ? "Cost Item updated successfully!" : "New Cost Item added!"
                            bootbox.dialog({
                                message: $scope.message,
                                buttons: {
                                    "success": {
                                        "label": "OK",
                                        "className": "btn-sm btn-primary",
                                        callback: function () {
                                            window.location.href = "/Freight/ViewFreightCostItem";
                                        }
                                    }
                                }
                            });
                        }
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindFreightData = function (filtered) {
            $scope.CostItems.Id = filtered.Id;
            $scope.CostItems.ServiceName = filtered.ServiceName;
            $scope.$apply();
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewCostItemsController', function ($scope, $http, $window, $filter, ShipOSFactory) {
        $scope.GetAllData = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "ServiceName",
                    "aTargets": [0]
                },
             {
                 "mDataProp": "Created",
                 "aTargets": [1]
             },
             {
                 "mDataProp": "Detail",
                 "aTargets": [2]
             }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/Freight/GetAllCostItems',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {
                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                        //data[i].Service = $filter('filter')($scope.Services, function (d) { return d.Id == Number(data[i].Service) })[0].Name;
                        //data[i].ProcessedType = $filter('filter')($scope.ProcessTypes, function (d) { return d.Id == Number(data[i].ProcessedType) })[0].Name;
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
       
        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/Freight/DeleteCostItemById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllData();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/Freight/FreightCostItem/?" + Id;
            $window.location.href = url;
        }

        //$("#veil").show();
        //$("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllData();

    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('MessageController', function ($scope, $http, $location, $filter) {
        $scope.Message = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/Freight/GetAllMessages',
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
                    var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindFreightData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing

        $scope.submitMessageForm = function ()
        {
            if ($scope.MessageForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Freight/FreightMessage',
                    method: "POST",
                    data: JSON.stringify($scope.Message),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        if (data == "Success") {
                            $scope.message = $scope.Message.Id > 0 ? "Message updated successfully!" : "New Message added!"
                            bootbox.dialog({
                                message: $scope.message,
                                buttons: {
                                    "success": {
                                        "label": "OK",
                                        "className": "btn-sm btn-primary",
                                        callback: function () {
                                            window.location.href = "/Freight/ViewFreightMessage";
                                        }
                                    }
                                }
                            });
                        }
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindFreightData = function (filtered) {
            $scope.Message.Id = filtered.Id;
            $scope.Message.Description = filtered.Description;
            $scope.Message.MessageText = filtered.MessageText;
            $scope.$apply();
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewMessageController', function ($scope, $http, $window, $filter, ShipOSFactory) {
        $scope.GetAllData = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "Description",
                    "aTargets": [0]
                },
             {
                 "mDataProp": "Created",
                 "aTargets": [1]
             },
             {
                 "mDataProp": "Detail",
                 "aTargets": [2]
             }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/Freight/GetAllMessages',
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {
                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                        //data[i].Service = $filter('filter')($scope.Services, function (d) { return d.Id == Number(data[i].Service) })[0].Name;
                        //data[i].ProcessedType = $filter('filter')($scope.ProcessTypes, function (d) { return d.Id == Number(data[i].ProcessedType) })[0].Name;
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
       
        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/Freight/DeleteMessageById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllData();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/Freight/FreightMessage/?" + Id;
            $window.location.href = url;
        }

        //$("#veil").show();
        //$("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllData();

    });
})();
(function () {
    var app = angular.module('mainApp');
   
    app.controller('SignatureController', function ($scope, $http, $location, $filter) {
        $scope.Signature = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/Freight/GetAllSignatures',
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
                    var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindFreightData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing

        $scope.submitSignatureForm = function ()
        {
            if ($scope.SignatureForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Freight/FreightSignature',
                    method: "POST",
                    data: JSON.stringify($scope.Signature),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        if (data == "Success") {
                            $scope.message = $scope.Signature.Id > 0 ? "Signature updated successfully!" : "New Signature added!"
                            bootbox.dialog({
                                message: $scope.message,
                                buttons: {
                                    "success": {
                                        "label": "OK",
                                        "className": "btn-sm btn-primary",
                                        callback: function () {
                                            window.location.href = "/Freight/ViewFreightSignature";
                                        }
                                    }
                                }
                            });
                        }
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
        $scope.bindFreightData = function (filtered) {
            $scope.Signature.Id = filtered.Id;
            $scope.Signature.Caption = filtered.Caption;
            $scope.Signature.SignatureText = filtered.SignatureText;
            $scope.$apply();
        }
    })})();
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewSignatureController', function ($scope, $http, $window, $filter, ShipOSFactory) {
        $scope.GetAllData = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "Caption",
                    "aTargets": [0]
                },
                 {
                     "mDataProp": "SignatureText",
                     "aTargets": [1]
                 },
             {
                 "mDataProp": "Created",
                 "aTargets": [2]
             },
             {
                 "mDataProp": "Detail",
                 "aTargets": [3]
             }];

            $scope.overrideOptions = {
                "bStateSave": true,
                "iCookieDuration": 2419200,
                /* 1 month */
                "bJQueryUI": true,
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": true,
                "bInfo": true,
                "bDestroy": true
            };
            $http({
                method: 'GET',
                url: '/Freight/GetAllSignatures',
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {
                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                        //data[i].Service = $filter('filter')($scope.Services, function (d) { return d.Id == Number(data[i].Service) })[0].Name;
                        //data[i].ProcessedType = $filter('filter')($scope.ProcessTypes, function (d) { return d.Id == Number(data[i].ProcessedType) })[0].Name;
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
       
        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/Freight/DeleteSignatureById',
                            params: { id: Id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                                $('td:eq(2)', nRow).bind('click', function () {
                                    $scope.$apply(function () {
                                        $scope.someClickHandler(aData);
                                    });
                                });
                                return nRow;
                            };

                            $scope.someClickHandler = function (info) {
                                $scope.message = 'clicked: ' + info.price;
                            };
                            $scope.GetAllData();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/Freight/FreightSignature/?" + Id;
            $window.location.href = url;
        }

        //$("#veil").show();
        //$("#feedLoading").show();
        $scope.message = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };
        $scope.GetAllData();

    });
})();