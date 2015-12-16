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

//or change it into a date range picker
$('.input-daterange').datepicker({ autoclose: true });

//to translate the daterange picker, please copy the "examples/daterange-fr.js" contents here before initialization
$('input[name=date-range-picker]').daterangepicker({
    'applyClass': 'btn-sm btn-success'
});

$('[data-rel=popover]').popover({ container: 'body' });

function getUrlParameter(param, dummyPath) {
    var sPageURL = dummyPath || window.location.search.substring(1),
        sURLVariables = sPageURL.split(/[&||?]/),
        res;

    for (var i = 0; i < sURLVariables.length; i += 1) {
        var paramName = sURLVariables[i],
            sParameterName = (paramName || '').split('=');

        if (sParameterName[0] === param) {
            res = sParameterName[1];
        }
    }

    return res;
}
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

    app.controller('PickupRequestController', function ($scope, $http, virtualDir, $filter) {
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

        $scope.pickupRequest = { ContactName: null, Phone: null, PickupFrom: null, Address1: null, Address2: null, City: null, ZipCode: null, CountryId: null, Division: null, isDisabled: null, notification: [] }

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
            $scope.pickupRequest.Phone = selectedAddress.Phone1;
            $scope.pickupRequest.Address1 = selectedAddress.Address1;
            $scope.pickupRequest.Address2 = selectedAddress.Address2;
            $scope.pickupRequest.City = selectedAddress.City;
            $scope.pickupRequest.ZipCode = selectedAddress.PostalCode;
            $scope.pickupRequest.CountryId = selectedAddress.CountryId;
            $scope.pickupRequest.Division = selectedAddress.Division;

            $scope.pickupRequest.PickupFrom = $scope.pickupRequest.PickupFrom;
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
    app.controller('AddressBookController', function (addressModels, $scope, $http, $filter, virtualDir) {
        $scope.contact = addressModels.Address;
        $scope.contact = null;
        $scope.contact = { AddressType: null, ShortName: null, Company: null, FirstName: null, LastName: null, Phone1: null, Phone2: null, Fax: null, Email: null, CountryId: null, PostalCode: null, Division: null, City: null, Address1: null, Address2: null, Address3: null, Address1Label: "Address Line 1", Address2Label: "Address Line 2", isAddress3Visible: true, CountryCode: null };

        var Id = getUrlParameter('Id');
        console.log(Id);
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
                    $scope.message = data;
                    bootbox.dialog({
                        message: "New contact added!",
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
    validationApp.controller('ViewAddressController', function ($scope, $http) {
        $scope.myName = function (name) {
            alert('Hello ' + name);
        }

        console.log('deleting ');
        $scope.deleteForm = function () {
            alert('Hello ');
            console.log('deleting user ');
        }

        $("#btndelete").on("click", function () {
            alert("The paragraph was clicked.");
        });
        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
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
                    data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120" onclick="editForm(' + data[i].Id + ')"\ ></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="deleteForm(' + data[i].Id + ')"\><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
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

function deleteForm(addressId) {
    bootbox.confirm({
        size: 'small',
        message: "Are you sure want to delete record#?" + addressId,
        callback: function (result) {
            if (result === false) {
            } else {
                $.ajax({
                    type: "GET",
                    url: "/User/DeleteAddress",
                    data: { "selectedIds": addressId },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        // Replace the div's content with the page method's return.
                        $("#Result").text(msg.d);
                    }
                });
            }
        }
    })
}

function editForm(addressId) {
    window.location.href = "/user/addressbook?id=" + addressId;
}
(function () {
    var app = angular.module('mainApp');
    // create angular controller
    app.controller('ViewPickupController', function ($scope, $http, virtualDir) {
        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.datasrc = '';
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
            if ($scope.shipmentsForm.$valid) {
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
                            window.open("http://" + data.LabelImage.OutputImage.replace("10.0.0.124", "test.shipos.com/shipping"), "_blank");
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

            this.shipmentdate = null;
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