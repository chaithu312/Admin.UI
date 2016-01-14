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
                        $("#veil").hide();
                        $("#feedLoading").hide();
                    }
                }).error(function (data, status, headers, config) {
                    $scope.message = 'Unexpected Error';
                });
                //Editing of country working here
                if ($location.absUrl().split("?").length > 1) {
                    $("#veil").show();
                    $("#feedLoading").show();
                    var Id = $location.absUrl().split("/");
                    var editdata = Id[5];
                    var editrow = editdata.split("?");
                    $http({
                        method: 'GET',
                        url: '/ServiceRate/Home/GetAllStates',
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
                            $scope.bindData(selectedData);
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
      
        $scope.submitPostCodeForm = function ()
        {
            
            if ($scope.PostCodeForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/State',
                    method: "POST",
                    data: JSON.stringify($scope.State),
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
        $scope.bindData = function (state) {
            $scope.State.Id = state.Id;
            $scope.State.Country = state.Country;
            $scope.State.Name = state.Name;
            $scope.State.Code = state.Code;
            $scope.State.TimeZone = state.TimeZone;
            $scope.State.FIPS = state.FIPS;
            $scope.State.AdditionalDays = state.AdditionalDays;
            $scope.State.Status = state.Status;
            $scope.$apply();
            $("#Delivery").find('option[value=' + state.Delivery+ ']').attr('selected', 'selected');
            $("#Membership").find('option[value=' + state.Membership + ']').attr('selected', 'selected');
            $("#Country").find('option[value=' + state.Country + ']').attr('selected', 'selected');
            $("#TimeZone").find('option[value=' + state.TimeZone + ']').attr('selected', 'selected');
            $("#Status").find('option[value=' + state.Status+ ']').attr('selected', 'selected');
            $("#SecurityCharge").find('option[value=' + state.SecurityCharge + ']').attr('selected', 'selected');
        }
    })})();