(function () {
    var app = angular.module('mainApp');
    // create angular controller
    app.controller('ViewPickupController', function ($scope, $http, virtualDir) {
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/Shipment/Home/GetAllPickup',
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
                $scope.PickupData = JSON.parse(data);
                //$scope.Users = [{ Id: 2, FirstName: "SHASHIKANT", LastName: "Pandit", Phone1: "", EMail: "", Division: "", City: "" }
                //, { Id: 4, FirstName: "SHASHIKANT", LastName: "Pandit", Phone1: "", EMail: "", Division: "", City: "" }];
                //Starting binding of jqGrid
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();