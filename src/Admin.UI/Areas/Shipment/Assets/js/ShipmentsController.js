(function () {
    var app = angular.module('mainApp');
    app.controller('shipmentsController', function (shippingModels, shippingValidator, $scope, $http, $filter) {
        $scope.Shipments = shippingModels.Shipment;
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
            url: '/User/Home/GetAllAddress',
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
            //url: 'http://test.shipos.com/shipping/masterapi/division',
            url: '/User/Home/Division',
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

            $scope.SetCountryAndDivision(selectedShipperAddress.CountryId, selectedShipperAddress.Division,"shipper");
        };
        $scope.SetCountryAndDivision = function (CountryId, Division,type)
        {
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
            $scope.SetCountryAndDivision($scope.Shipments.RCountryId, selectedShipperAddress.Division,"consignee");
            //var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number($scope.Shipments.RCountryId); })[0];
            //$scope.Shipments.RCountryName = countryfiltered.Name;
            //$scope.Shipments.RCountryCode = countryfiltered.Code;
        };

        //HTTP REQUEST BELOW
        $http({
            method: 'GET',
            url: '/User/Home/Country',
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
                url: '/User/Home/State',
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
                Length: 0
            }]
        };

        $scope.addItem = function () {
            $scope.Parcel.items.push({
                Weight: 0,
                Width: 0,
                Height: 0,
                Length: 0
            });
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
                    url: '/Shipment/Shipments',
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
            if ($scope.shipmentsForm.$invalid) { $scope.message = "Please check required fields (marked by *)" }
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
        }
        return shippingModels;
    });
    app.factory('shippingValidator', function (validator) {
        var shippingValidator = s = new validator();
        s.ruleFor('Company').notEmpty();
        s.ruleFor('Name').notEmpty();
        s.ruleFor('Phone').notEmpty().withMessage('Phone');
        s.ruleFor('Email').notEmpty();
        s.ruleFor('AddressType').notEmpty();
        s.ruleFor('AddressCaption').notEmpty();
        s.ruleFor('Address1').notEmpty();
        s.ruleFor('City').notEmpty();
        s.ruleFor('CountryId').notEmpty();
        s.ruleFor('PostalCode').notEmpty();
        s.ruleFor('Division').notEmpty();
        

        s.ruleFor('RCompany').notEmpty();
        s.ruleFor('Rname').notEmpty();
        s.ruleFor('Rphone').notEmpty();
        s.ruleFor('REmail').notEmpty();


        s.ruleFor('RAddressType').notEmpty();
        s.ruleFor('RaddressCaption').notEmpty();
        
        s.ruleFor('Raddressline1').notEmpty();
        s.ruleFor('Rcity').notEmpty();
        s.ruleFor('RCountryId').notEmpty();
        s.ruleFor('Rpostalcode').notEmpty();

        s.ruleFor('RDivision').notEmpty();
        
        s.ruleFor('shipmentdate').notEmpty();
        s.ruleFor('unitsystem').notEmpty();
        s.ruleFor('packagetype').notEmpty();
        s.ruleFor('Insurance').notEmpty();

        return shippingValidator;
    })

})();