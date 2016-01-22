(function () {
    var app = angular.module('mainApp');
   
    app.controller('CostItemsController', function ($scope, $http, $location, $filter) {
        $scope.CostItems = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/Freight/GetAllCostItems',
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
                    $scope.bindFreightData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing

        $scope.submitCostItemsForm = function ()
        {
            if ($scope.CostItemsForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Freight/FreightCostItem',
                    method: "POST",
                    data: JSON.stringify($scope.CostItems),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        if (data == "Success") {
                            $scope.message = $scope.CostItems.Id > 0 ? "Cost Item updated successfully!" : "New Cost Item added!"
                            bootbox.dialog({
                                message: $scope.message,
                                buttons: {
                                    "success": {
                                        "label": "OK",
                                        "className": "btn-sm btn-primary",
                                        callback: function () {
                                            window.location.href = "/Freight/ViewFreightCostItem";
                                        }
                                    }
                                }
                            });
                        }
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
        $scope.bindFreightData = function (filtered) {
            $scope.CostItems.Id = filtered.Id;
            $scope.CostItems.ServiceName = filtered.ServiceName;
            $scope.$apply();
        }
    })})();