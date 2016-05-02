(function () {
    var app = angular.module('mainApp');
   
    app.controller('PostController', function ($scope, $http, $location, $filter) {
        $scope.Country = [];
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
                $scope.Country = (JSON.parse(data));
                $http({
                    method: 'GET',
                    url: '/User/Home/Division',
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
                        //Editing of country working here
                        if ($location.absUrl().split("?").length > 1) {
                            $("#veil").show();
                            $("#feedLoading").show();
                            var Id = $location.absUrl().split("/");
                            var editdata = Id[5];
                            var editrow = editdata.split("?");
                            $http({
                                method: 'GET',
                                url: '/ServiceRate/Home/GetAllPostCodes',
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
                                    $scope.bindPostData(selectedData);
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
                })
                    .error(function (data, status, headers, config) {
                    $scope.message = 'Unexpected Error';
                });
               
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
      
        $scope.submitPostCodeForm = function ()
        {
            
            if ($scope.PostCodeForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/PostCode',
                    method: "POST",
                    data: JSON.stringify($scope.PostCode),
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
        $scope.bindPostData = function (post) {
            $scope.PostCode.Id = post.Id;
            $scope.PostCode.Country = post.Country;
            $scope.PostCode.State = post.State;
            $scope.PostCode.PostCode = post.PostalCode;
            $scope.PostCode.CityName = post.CityName;
            $scope.PostCode.CityType = post.CityType;
            $scope.PostCode.CountryName = post.CountryName;
            $scope.PostCode.CountryFIPS = post.CountryFIPS;
            $scope.PostCode.Class = post.Class;
            $scope.PostCode.TimeZone = post.TimeZone;
            $scope.PostCode.DaylightSavingsTime = post.DaylightSavingsTime;
            $scope.PostCode.EarliestDeliveryTime = post.EarliestDeliveryTime;
            $scope.PostCode.AreaCode = post.AreaCode;
            $scope.PostCode.SaturdayDelivery = post.SaturdayDelivery;
            $scope.PostCode.Pickup = post.Pickup;
            $scope.PostCode.Delivery = post.Delivery;
            $scope.PostCode.LastPickup = post.LastPickup;
            $scope.PostCode.LastPickupOrder = post.LastPickupOrder;
            $scope.PostCode.Latitude = post.Latitude;
            $scope.PostCode.Longitude = post.Longitude;
            $scope.PostCode.AdditionalDays = post.AdditionalDays;
            $scope.PostCode.Status = post.Status;
            $scope.$apply();
            $("#Country").find('option[value=' + post.Country + ']').attr('selected', 'selected');
            $("#ddlState").find('option[value=' + post.State + ']').attr('selected', 'selected');
            $("#PostClass").find('option[value=' + post.Class + ']').attr('selected', 'selected');
            $("#CityType").find('option[value=' + post.CityType + ']').attr('selected', 'selected');
            $("#SecurityCharge").find('option[value=' + post.SecurityCharge + ']').attr('selected', 'selected');
        }
    })})();