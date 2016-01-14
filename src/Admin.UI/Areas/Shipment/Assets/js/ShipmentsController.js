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