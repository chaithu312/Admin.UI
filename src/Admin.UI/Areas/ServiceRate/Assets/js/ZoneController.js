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