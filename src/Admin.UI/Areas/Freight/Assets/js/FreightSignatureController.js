(function () {
    var app = angular.module('mainApp');
   
    app.controller('SignatureController', function ($scope, $http, $location, $filter) {
        $scope.Signature = {};
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/Freight/GetAllSignatures',
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

        $scope.submitSignatureForm = function ()
        {
            if ($scope.SignatureForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Freight/FreightSignature',
                    method: "POST",
                    data: JSON.stringify($scope.Signature),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        if (data == "Success") {
                            $scope.message = $scope.Signature.Id > 0 ? "Signature updated successfully!" : "New Signature added!"
                            bootbox.dialog({
                                message: $scope.message,
                                buttons: {
                                    "success": {
                                        "label": "OK",
                                        "className": "btn-sm btn-primary",
                                        callback: function () {
                                            window.location.href = "/Freight/ViewFreightSignature";
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
            $scope.Signature.Id = filtered.Id;
            $scope.Signature.Caption = filtered.Caption;
            $scope.Signature.SignatureText = filtered.SignatureText;
            $scope.$apply();
        }
    })})();