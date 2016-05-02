(function () {
    var app = angular.module('mainApp');
   
    app.controller('FinanceController', function ($scope, $http, $location, $filter) {
        $scope.Finance = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/Finance/GetAllInvoiceMessage',
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
                    $scope.bindFinanceData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing
        $scope.submitFinanceForm = function ()
        {
            if ($scope.FinanceForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Finance/InvoiceMessage',
                    method: "POST",
                    data: JSON.stringify($scope.Finance),
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
        $scope.bindFinanceData = function (filtered) {
            $scope.Finance.Id = filtered.Id;
            $scope.Finance.AccountNo = filtered.AccountNo;
            $scope.Finance.MessageTitle = filtered.MessageTitle;
            $scope.Finance.MessageBody = filtered.MessageBody;
            $scope.Finance.EffectiveFrom = filtered.EffectiveFrom;
            $scope.Finance.EffectiveTo = filtered.EffectiveTo;
            $scope.Finance.Status = filtered.Status;
            $scope.$apply();
        }
    })})();