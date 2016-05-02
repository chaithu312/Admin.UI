(function () {
    var app = angular.module('mainApp');

    app.controller('SupplyOrderController', function ($scope, $http, $location, virtualDir, $filter) {
    

        $scope.Contacts = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Account 1' }, { Id: 2, Name: 'Account 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };
        $scope.Addresses = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Address 1' }, { Id: 2, Name: 'Address 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };

        $scope.SupplyOrder = null;

        $scope.SupplyOrder = { ContactName: null, Phone: null, PickupFrom: null, Address1: null, Address2: null, City: null, ZipCode: null, CountryId: null, Division: null, isDisabled: null, deliverto:null }

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
            var addressType = $scope.SupplyOrder.AddressType;
            if (addressType == "0") {
                $scope.SupplyOrder.ContactName = null
                $scope.SupplyOrder.Phone = null
                $scope.SupplyOrder.AddressType = $scope.SupplyOrder.AddressType
                $scope.SupplyOrder.Address1 = null
                $scope.SupplyOrder.Address2 = null
                $scope.SupplyOrder.City = null
                $scope.SupplyOrder.ZipCode = null
                $scope.SupplyOrder.CountryId = null;
                $scope.SupplyOrder.Division = null;
                $scope.SupplyOrder.PickupFrom = $scope.SupplyOrder.PickupFrom;
                $scope.SupplyOrder.isDisabled = false;
                return;
            }

            for (var i = 0; i < AllAddress.length; i++) {
                if (AllAddress[i].Id == addressType) {
                    selectedAddress = AllAddress[i]
                    break;
                }
            }

            $scope.SupplyOrder.ContactName = selectedAddress.Name;
            $scope.SupplyOrder.Phone =parseInt(selectedAddress.Phone1);
            $scope.SupplyOrder.Address1 = selectedAddress.Address1;
            $scope.SupplyOrder.Address2 = selectedAddress.Address2;
            $scope.SupplyOrder.City = selectedAddress.City;
            $scope.SupplyOrder.ZipCode = selectedAddress.PostalCode;
            $scope.SupplyOrder.CountryId = selectedAddress.CountryId;
            $scope.SupplyOrder.Division = selectedAddress.Division;

            
            $scope.SupplyOrder.isDisabled = true;
            $scope.$apply();

            $("#CountryId").find('option[value=' + selectedAddress.CountryId + ']').attr('selected', 'selected');

            $("#Division").find('option[label=' + selectedAddress.Division + ']').attr('selected', 'selected');

            //var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number($scope.SupplyOrder.CountryId); })[0];
            //$scope.SupplyOrder.Country = countryfiltered.Name;
            //$scope.SupplyOrder.CountryCode = countryfiltered.Code;
            $scope.SetCountryAndCode();
        }

        $scope.SetCountryAndCode = function () {
            var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id == Number($scope.SupplyOrder.CountryId); })[0];
            $scope.SupplyOrder.Country = countryfiltered.Name;
            $scope.SupplyOrder.CountryCode = countryfiltered.Code;
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
            $scope.SupplyOrder.Id = pickup.Id;
            $scope.SupplyOrder.ContactName = pickup.ContactName;
            $scope.SupplyOrder.Phone = parseInt(pickup.Phone);
            $scope.SupplyOrder.Address1 = pickup.Address1;
            $scope.SupplyOrder.Address2 = pickup.Address2;
            $scope.SupplyOrder.City = pickup.City;
            $scope.SupplyOrder.ZipCode = pickup.ZipCode;
            $scope.SupplyOrder.CountryId = pickup.CountryID;
            $scope.SupplyOrder.Division = pickup.Division;

         
            $scope.SetCountryAndCode();
            $scope.$apply();

            $("#CountryId").find('option[value=' + pickup.CountryID + ']').attr('selected', 'selected');
            $("#ddldestination").find('option[value=' + pickup.Destination + ']').attr('selected', 'selected');
            $("#parcelType").find('option[value=' + pickup.ParcelType + ']').attr('selected', 'selected');
            $("#Division").find('option[label=' + pickup.Division + ']').attr('selected', 'selected');
            $("#ddlCarrier").find('option[value=' + $scope.SupplyOrder.Carrier + ']').attr('selected', 'selected');
        }
      
        
        $scope.valResult = {};
        $scope.sendForm = function () {
            if ($scope.SupplyOrder.$valid) {
                $("#veil").show();
                $("#feedLoading").show();
                $http({
                    url: virtualDir.AdminURL + '/Shipment/SupplyOrder',
                    method: "POST",
                    data: JSON.stringify($scope.SupplyOrder),
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
            $scope.SupplyOrder.PickupFrom = $("#contactName").val();
            $scope.$apply();
        });


        $scope.GetValue = function (country) {
            var countryId = $scope.SupplyOrder.CountryId;

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
                params: { countryId: $scope.SupplyOrder.CountryId },
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