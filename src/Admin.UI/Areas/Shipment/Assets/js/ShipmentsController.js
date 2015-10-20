(function () {
    var app = angular.module('mainApp');
    app.controller('shipmentsController', function ($scope, $http) {
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
            $scope.Shipments.City = selectedShipperAddress.City;
            $scope.Shipments.PostalCode = selectedShipperAddress.PostalCode;
            $scope.Shipments.CountryId = selectedShipperAddress.CountryId;
            $scope.Shipments.Division = selectedShipperAddress.Division;
            $scope.Shipments.isDisabled = true;
            $scope.$apply();

            $("#CountryId").find('option[value=' + selectedShipperAddress.CountryId + ']').attr('selected', 'selected');

            $("#Division").find('option[value=' + selectedShipperAddress.Division + ']').attr('selected', 'selected');
        }

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
        $scope.Package = {
            items: [{
                Weight: 0,
                Width: 0,
                Height: 0,
                Length: 0
            }]
        };

        $scope.addItem = function () {
            $scope.Package.items.push({
                Weight: 0,
                Width: 0,
                Height: 0,
                Length: 0
            });
        },

        $scope.removeItem = function (index) {
            $scope.Package.items.splice(index, 1);
        },

        $scope.Shipments = null;
        $scope.Shipments = { Parcel: [] };
        $scope.Shipments.Parcel.push($scope.Package);
      
        $scope.sendShipmentsForm = function () {
            if ($scope.shipmentsForm.$valid) {
                $http({
                    url: '/Shipment/Shipments',
                    method: "POST",
                    data: JSON.stringify($scope.Shipments),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        alert(data);
                    });
            }
            if ($scope.shipmentsForm.$invalid) { $scope.message = "Please check required fields (marked by *)" }

        };
    });
})();