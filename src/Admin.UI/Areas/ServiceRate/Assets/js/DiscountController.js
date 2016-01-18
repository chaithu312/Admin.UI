(function () {
    var app = angular.module('mainApp');
   
    app.controller('DiscountController', function ($scope, $http, $location, $filter) {
        $scope.Discount = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllDiscount',
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
                    $scope.bindDiscountData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing
      
      
        $scope.submitDiscountForm = function ()
        {
            if ($scope.DiscountForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/Discount',
                    method: "POST",
                    data: JSON.stringify($scope.Discount),
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
        $scope.bindDiscountData = function (filtered) {
            $scope.Discount.Id = filtered.Id;
            $scope.Discount.Service = filtered.Service;
            $scope.Discount.FSCValue = filtered.FSCValue;
            $scope.Discount.EffectiveDate = filtered.EffectiveDate;
            $scope.$apply();
        }
    })})();