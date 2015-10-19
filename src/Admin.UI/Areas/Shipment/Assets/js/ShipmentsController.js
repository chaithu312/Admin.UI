(function () {
    var app = angular.module('mainApp');
    app.controller('shipmentsController', function ($scope, $http) {
        $http({
            method: 'GET',
            url: '/User/Home/GetAllAddress',
            headers: {
                'RequestVerificationToken': $scope.antiForgeryToken
            }
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            $scope.Address = (JSON.parse(data)).Result;
            var item =
            {
                Id: 0,
                ShortName: "New Address",
            };
            $scope.Address.push(item);
        });

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
        }

        $scope.noofpackages = [{ id: 1, name: "1" }, { id: 2, name: "2" }, { id: 3, name: "3" }]

        $scope.nopackage = function (value) {
            $scope.nopackage = [{ id: 'package' }];
            for (var i = 0; i < value; i++) {
                var lastItem = $scope.nopackage.length - i;
                $scope.nopackage.splice(lastItem);
            }

            for (var i = 0; i < value; i++) {
                $scope.nopackage.push({ 'id': 'package' + i });
            }
        };

        $scope.sendForm = function () {
            //if ($scope.shipmentsForm.$valid) {
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
            //}
            if ($scope.shipmentsForm.$invalid) { $scope.message = "Please check required fields (marked by *)" }
        };
    })
})();