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
                var day = date.getDate().toString().length == 1 ? ('0' + date.getDate().toString()) : date.getDate();
                var month = (date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1);
                var year = date.getFullYear().toString().length == 1 ? '0' + (date.getFullYear()).toString() : date.getFullYear();
                $scope.pickupRequest.PickupDate =  day+ '-'+ month + '-'+year;
            }
            $scope.SetCountryAndCode();
            $scope.$apply();

            $("#CountryId").find('option[value=' + pickup.CountryID + ']').attr('selected', 'selected');
            $("#ddldestination").find('option[value=' + pickup.Destination + ']').attr('selected', 'selected');
            $("#parcelType").find('option[value=' + pickup.ParcelType + ']').attr('selected', 'selected');
            $("#Division").find('option[label=' + pickup.Division + ']').attr('selected', 'selected');
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