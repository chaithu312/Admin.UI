(function () {
    'use strict';

    var app = angular.module("mainApp", ['navsServices']);

    app.directive('breadcrumb', function () {
        return {
            restrict: 'E',
            template: '<ul class=\"breadcrumb\"><li><i class=\"ace-icon fa fa-home home-icon\"></i><a href=\"#\">Home</a></li><li><a href=\"#\">' + window.location.pathname.split('/')[1] + '</a></li><li class=\"active\">' + window.location.pathname.split('/')[2] + '</li></ul>'
        }
    })

    app.directive('loading', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="loading"><img src="..."/>LOADING...</div>',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
            }
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
            return $http.get("http://test.shipos.com/Shipping/MasterApi/vendor");
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

//jqGrid Required Methods starts

function style_edit_form(form) {
    //enable datepicker on "sdate" field and switches for "stock" field
    form.find('input[name=sdate]').datepicker({ format: 'yyyy-mm-dd', autoclose: true })

    form.find('input[name=stock]').addClass('ace ace-switch ace-switch-5').after('<span class="lbl"></span>');
    //don't wrap inside a label element, the checkbox value won't be submitted (POST'ed)
    //.addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');

    //update buttons classes
    var buttons = form.next().find('.EditButton .fm-button');
    buttons.addClass('btn btn-sm').find('[class*="-icon"]').hide();//ui-icon, s-icon
    buttons.eq(0).addClass('btn-primary').prepend('<i class="ace-icon fa fa-check"></i>');
    buttons.eq(1).prepend('<i class="ace-icon fa fa-times"></i>')

    buttons = form.next().find('.navButton a');
    buttons.find('.ui-icon').hide();
    buttons.eq(0).append('<i class="ace-icon fa fa-chevron-left"></i>');
    buttons.eq(1).append('<i class="ace-icon fa fa-chevron-right"></i>');
}

function style_delete_form(form) {
    var buttons = form.next().find('.EditButton .fm-button');
    buttons.addClass('btn btn-sm btn-white btn-round').find('[class*="-icon"]').hide();//ui-icon, s-icon
    buttons.eq(0).addClass('btn-danger').prepend('<i class="ace-icon fa fa-trash-o"></i>');
    buttons.eq(1).addClass('btn-default').prepend('<i class="ace-icon fa fa-times"></i>')
}

function style_search_filters(form) {
    form.find('.delete-rule').val('X');
    form.find('.add-rule').addClass('btn btn-xs btn-primary');
    form.find('.add-group').addClass('btn btn-xs btn-success');
    form.find('.delete-group').addClass('btn btn-xs btn-danger');
}
function style_search_form(form) {
    var dialog = form.closest('.ui-jqdialog');
    var buttons = dialog.find('.EditTable')
    buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'ace-icon fa fa-retweet');
    buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'ace-icon fa fa-comment-o');
    buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'ace-icon fa fa-search');
}

function beforeDeleteCallback(e) {
    var form = $(e[0]);
    if (form.data('styled')) return false;

    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
    style_delete_form(form);

    form.data('styled', true);
}

function beforeEditCallback(e) {
    var form = $(e[0]);
    form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
    style_edit_form(form);
}

//it causes some flicker when reloading or navigating grid
//it may be possible to have some custom formatter to do this as the grid is being created to prevent this
//or go back to default browser checkbox styles for the grid
function styleCheckbox(table) {
    /**
        $(table).find('input:checkbox').addClass('ace')
        .wrap('<label />')
        .after('<span class="lbl align-top" />')

        $('.ui-jqgrid-labels th[id*="_cb"]:first-child')
        .find('input.cbox[type=checkbox]').addClass('ace')
        .wrap('<label />').after('<span class="lbl align-top" />');
    */
}

//unlike navButtons icons, action icons in rows seem to be hard-coded
//you can change them like this in here if you want
function updateActionIcons(table) {
    /**
    var replacement =
    {
        'ui-ace-icon fa fa-pencil' : 'ace-icon fa fa-pencil blue',
        'ui-ace-icon fa fa-trash-o' : 'ace-icon fa fa-trash-o red',
        'ui-icon-disk' : 'ace-icon fa fa-check green',
        'ui-icon-cancel' : 'ace-icon fa fa-times red'
    };
    $(table).find('.ui-pg-div span.ui-icon').each(function(){
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
        if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
    })
    */
}

//replace icons with FontAwesome icons like above
function updatePagerIcons(table) {
    var replacement =
    {
        'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
        'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
        'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
        'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
    };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
    })
}

function enableTooltips(table) {
    $('.navtable .ui-pg-button').tooltip({ container: 'body' });
    $(table).find('.ui-pg-div').tooltip({ container: 'body' });
}

//var selr = jQuery(grid_selector).jqGrid('getGridParam','selrow');

$(document).one('ajaxloadstart.page', function (e) {
    $(grid_selector).jqGrid('GridUnload');
    $('.ui-jqdialog').remove();
});

//jqGrid Required Methods Ends here

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

    app.controller('PickupRequestController', function ($scope, $http, virtualDir) {
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
            url: virtualDir.AdminURL + '/User/Home/GetAllAddress',
            //data: $scope.SelectedCountry.CountryCode,
            //params: { countryId: $scope.contact.CountryId },
            headers: {
                'RequestVerificationToken': $scope.antiForgeryToken
            }
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            var successresult = (JSON.parse(data)).Result;
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

        $scope.GetAddressValue = function (address) {
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
            var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number($scope.pickupRequest.CountryId); })[0];
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
                $http({
                    url: virtualDir.AdminURL + '/Shipment/PickupRequest',
                    method: "POST",
                    data: JSON.stringify($scope.pickupRequest),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $scope.message = data;
                        $("#divfrm").hide();
                        $("#divbtn").hide();
                        //alert(data);
                        //window.location.href = "/User/Home/ViewAddress";
                    }).error(function (data, status, headers, config) {
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
        //HTTP REQUEST BELOW

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
                //  $scope.message = 'Login Successfully';
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Country url is not valid';
        });

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
                $http({
                    url: virtualDir.AdminURL + '/User/Home/AddressBook',
                    method: "POST",
                    data: JSON.stringify($scope.contact),
                    contentType: "application/json;",
                    dataType: "json"
                })
                .success(function (data, status, headers, config) {
                    $scope.message = data;

                    window.location.href = "/User/Home/ViewAddress";
                }).error(function (data, status, headers, config) {
                    alert(data);
                });
                //Ends herefor saving addresssbook record.
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
    validationApp.controller('ViewAddressController', function ($scope, $http, virtualDir) {
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/Home/GetAllAddress',
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
                $scope.Users = JSON.parse(data);
                var grid_data = $scope.Users.Result;
                $('#AddressBook').DataTable({
                    "ajax": {
                        "url": "/assets/js/data.txt",
                        "dataSrc": ""
                    },
                    "columns": [
                        { "data": "name" },
                        { "data": "position" },
                        { "data": "office" },
                        { "data": "extn" },
                        { "data": "start_date" },
                        { "data": "salary" }
                    ]
                })
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();
(function () {
    var app = angular.module('mainApp');
    // create angular controller
    app.controller('ViewPickupController', function ($scope, $http, virtualDir) {
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
                $scope.PickupData = JSON.parse(data);
                //$scope.Users = [{ Id: 2, FirstName: "SHASHIKANT", LastName: "Pandit", Phone1: "", EMail: "", Division: "", City: "" }
                //, { Id: 4, FirstName: "SHASHIKANT", LastName: "Pandit", Phone1: "", EMail: "", Division: "", City: "" }];
                //Starting binding of jqGrid
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();
(function () {
    var app = angular.module('mainApp');
    
    app.controller('vendorController', function ($scope, $http, vendor, virtualDir) {
        $scope.vendor = { Detail:null};
        $scope.sendVendorForm = function () {
            if ($scope.mainForm.$valid) {
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
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $scope.message = data;
                    });

                
            }
            if ($scope.mainForm.$invalid) { $scope.message = "Please check required fields." }
        };

        vendor.data().success(function(Vendors){
            $scope.Vendors = Vendors.Result;
        }).error(function (error) {
            $scope.message = 'Unable to load vendor data: ' + error.message;

        });
    });

})();


(function () {
    var app = angular.module('mainApp');
    app.controller('shipmentsController', function (shippingModels, $scope, $http, $filter, virtualDir) {
        $scope.Shipments = shippingModels.Shipment;
        $scope.Parcel = shippingModels.Shipment.Parcel;
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
            url: virtualDir.AdminURL + '/User/Home/GetAllAddress',
            headers: {
                'RequestVerificationToken': $scope.antiForgeryToken
            }
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            var successresult = (JSON.parse(data)).Result;
            if (data != "One or more errors occurred.") {
                for (var i = 0; i < successresult.length; i++) {
                    $scope.Address.push(successresult[i]);
                }
            }
            AllAddress = $scope.Address;
        });
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

        //HTTP REQUEST BELOW
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/Home/Country',
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
                $scope.Country = JSON.parse(data).Result;
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });

        //Getting selected Country Code and Country Name
        $scope.GetDivision = function (CountryId) {
            //Getting States list using HTTP Request from controller

            $http({
                method: 'GET',
                url: virtualDir.AdminURL + '/User/Home/State',
                params: { countryId: CountryId },
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
        };
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
        $scope.sendShipmentsForm = function () {
            var unregisterValidatorWatch =
            $scope.$watch(function () { return $scope.Shipments; },
                         function () {
                             $scope.valResult = shippingValidator.validate($scope.Shipments);
                             if ($scope.Shipments.$isValid)
                                 unregisterValidatorWatch();
                         }, true);

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
            if ($scope.shipmentsForm.$invalid) { $scope.message = "Please check required fields." }
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

    app.controller('shipmentsController', function (vendorTypeModels, VendorTypeValidator, $scope, $http, $filter) {
        if ($scope.VendorType.$invalid) { $scope.message = "Please check required fields." }
    });
})();