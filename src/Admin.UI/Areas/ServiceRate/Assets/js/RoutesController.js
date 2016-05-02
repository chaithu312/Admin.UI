(function () {
    var app = angular.module('mainApp');


    // create angular controller
    app.controller('RoutesController', function ($scope, $location, $http, $filter) {

        $scope.model = { CountryId: null, AgentName: null, LabelAPI: null, PickupCharge: null, SatPickupCharge: null, TrackingURL: null, Id: null };
        $scope.model.Id = 0;
        //HTTP REQUEST BELOW
        $("#veil").show();
        $("#feedLoading").show();
     



        if ($location.absUrl().split("?").length > 1) {
            var selectedAgents = [];
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/ServiceRate/GetAllAgents',
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
                    selectedAgents = data;
                    var selectedAgents = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];



                    $scope.model.CountryId = selectedAgents.CountryId;
                    $scope.model.AgentName = selectedAgents.AgentName;
                    $scope.model.LabelAPI = selectedAgents.LabelAPI;
                    $scope.model.PickupCharge = selectedAgents.PickupCharge;
                    $scope.model.SatPickupCharge = selectedAgents.SaturdayPickupCharge;
                    $scope.model.TrackingURL = selectedAgents.TrackingURL;
                    $scope.model.Id = selectedAgents.Id;

                    $scope.$apply();


                    $("#Country").find('option[value=' + selectedAgents.CountryId + ']').attr('selected', 'selected');



                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });

        }


        $scope.submitForm = function () {
            if ($scope.Agents.$valid) {
                $("#veil").show();
                $("#feedLoading").show();
                $http({
                    url: '/ServiceRate/Home/Agents',
                    method: "POST",
                    data: JSON.stringify($scope.model),
                    contentType: "application/json;",
                    dataType: "json"
                })
                .success(function (data, status, headers, config) {

                    if (data == "Success") {
                        $scope.message = $scope.model.Id > 0 ? "Agents updated successfully!" : "New Agents added!"
                        bootbox.dialog({
                            message: $scope.message,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary",
                                    callback: function () {
                                        window.location.href = "/ServiceRate/Home/ViewAgents";
                                    }
                                }
                            }
                        });
                    }
                }).error(function (data, status, headers, config) {
                    alert(data);
                });
                //Ends herefor saving addresssbook record.
            }
            else {
                $scope.message = "Invalid";
            }
        }

    });

})();