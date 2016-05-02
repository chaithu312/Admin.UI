(function () {
    var app = angular.module('mainApp');
   
    app.controller('FSCController', function ($scope, $http, $location, $filter, getQueryStringValue) {
        $scope.FSC = {};
        if (getQueryStringValue.getValue("agent") != null && getQueryStringValue.getValue("agent") === "true") {
            $scope.isAgentOn = true;
            $scope.url = "/ServiceRate/ViewFSC?agent=true";
        }
        else
            $scope.url = "/ServiceRate/ViewFSC";

        var id = getQueryStringValue.getValue("id");
        //Editing of country working here
        if (id != null && Number(id) != 0) {
            $("#veil").show();
            $("#feedLoading").show();
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllFSC',
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
                    $scope.bindFSCData(selectedData);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //End Editing
      
      
        $scope.submitFSCForm = function ()
        {
            if ($scope.FSCForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/FSC',
                    method: "POST",
                    data: JSON.stringify($scope.FSC),
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
        $scope.bindFSCData = function (filtered) {
            $scope.FSC.Id = filtered.Id;
            $scope.FSC.Service = filtered.Service;
            $scope.FSC.FSCValue = filtered.FSCValue;
            $scope.FSC.EffectiveDate = filtered.EffectiveDate;
            $scope.$apply();
        }
    })})();