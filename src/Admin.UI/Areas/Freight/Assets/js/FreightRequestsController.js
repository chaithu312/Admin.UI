(function () {
    var app = angular.module('mainApp');
   
    app.controller('FreightRequestsController', function ($scope, $http, $location, $filter, ShipOSFactory) {
        $scope.Services = {};
        $scope.ProcessTypes = {};
        $scope.FreightRequests = {};
        
        ShipOSFactory.GetServices().success(function (services) {
            $scope.Services = services;

            ShipOSFactory.ProcessedTypes().success(function (services) {
                $scope.ProcessTypes = services;

                //Editing of country working here
                if ($location.absUrl().split("?").length > 1) {
                    $("#veil").show();
                    $("#feedLoading").show();
                    var Id = $location.absUrl().split("/");
                    var editdata = Id[5];
                    var editrow = editdata.split("?");
                    $http({
                        method: 'GET',
                        url: '/Freight/GetAllFreightRequests',
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
                            var selectedData = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                            $scope.bindFreightRequestsData(selectedData);
                            $("#veil").hide();
                            $("#feedLoading").hide();
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.message = 'Unexpected Error';
                    });
                }
                //End Editing


            }).error(function (error) {
                $scope.message = 'Unable to load Process Types data: ' + error.message;
            });

        }).error(function (error) {
            $scope.message = 'Unable to load service data: ' + error.message;
        });

        $scope.submitFreightRequestsForm = function ()
        {
            if ($scope.FreightForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Freight/FreightRequests',
                    method: "POST",
                    data: JSON.stringify($scope.FreightRequests),
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
        $scope.bindFreightRequestsData = function (filtered) {
            $scope.FreightRequests.Id = filtered.Id;
            $scope.FreightRequests.Service = filtered.Service;
            $scope.FreightRequests.TrackingNumber = filtered.TrackingNumber;
            $scope.FreightRequests.CompanyName = filtered.CompanyName;

            $scope.FreightRequests.ContactName = filtered.ContactName;
            $scope.FreightRequests.Phone = filtered.Phone;
            $scope.FreightRequests.Fax = filtered.Fax;

            $scope.FreightRequests.Email = filtered.Email;
            $scope.FreightRequests.ShipmentDate = filtered.ShipmentDate;
            $scope.FreightRequests.ContactMethod = filtered.ContactMethod;
            $scope.FreightRequests.ProcessedType = filtered.ProcessedType;
            $scope.$apply();
            $("#ProcessType").find('option[value=' + filtered.ProcessedType + ']').attr('selected', 'selected');
            $("#Service").find('option[value=' + filtered.Service + ']').attr('selected', 'selected');
        }
    })})();