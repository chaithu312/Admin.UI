(function () {
    var app = angular.module('mainApp');

    app.controller('SupplyMaterialController', function ($scope, $http, $location, virtualDir, $filter) {




        //Editing of Pickup working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var selectedAddress = [];
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: virtualDir.AdminURL + '/Shipment/Home/GetAllSupplyMaterial',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    var viewpickup = JSON.parse(data);
                    var selectedID = $filter('filter')(viewpickup, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindSupply(selectedID);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }

        $scope.bindSupply = function (selectedID) {
            $scope.SupplyMaterial.Id = selectedID.Id;
            $scope.SupplyMaterial.Name = selectedID.Name;
            $scope.SupplyMaterial.Imageurl = parseInt(selectedID.Imageurl);
            $scope.SupplyMaterial.Sequence = selectedID.Sequence;
            $scope.SupplyMaterial.Unit = selectedID.Unit;
            $scope.$apply();

            //$("#Sequence").find('option[value=' + selectedID.Sequence + ']').attr('selected', 'selected');

        }


        $scope.valResult = {};
        $scope.sendForm = function () {
            if ($scope.SupplyMaterial.$valid) {
                $("#veil").show();
                $("#feedLoading").show();
                $http({
                    url: virtualDir.AdminURL + '/Shipment/Home/SupplyMaterial',
                    method: "POST",
                    data: JSON.stringify($scope.Model),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;

                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary",
                                    callback: function () {
                                        window.location.href = "/Shipment/ViewSupplyMaterial";
                                    }
                                }
                            }
                        });
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
            //if ($scope.PickupForm.$invalid) { $scope.message = "Please check required fields." }
        };


    });
})();