(function () {
    var app = angular.module('mainApp');
   
    app.controller('ZoneController', function ($scope, $http, $location, $filter) {

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
            $scope.ZoneUS.Id = zone.Id;
            $scope.ZoneUS.OriginZipLower = zone.OriginZipLower;
            $scope.ZoneUS.OriginZipUpper = zone.OriginZipUpper;
            $scope.ZoneUS.DestinationZipLower = zone.DestinationZipLower;
            $scope.ZoneUS.DestinationZipUpper = zone.DestinationZipUpper;
            $scope.ZoneUS.Zone = zone.Zone;
            $scope.$apply();
        }
    })})();