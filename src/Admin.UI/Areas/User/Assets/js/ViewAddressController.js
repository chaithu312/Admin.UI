(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewAddressController', function ($scope, $http, virtualDir) {
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/Home/GetAllAddress',
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
                $scope.Users = JSON.parse(data);
                var grid_data = $scope.Users.Result;
                $('#AddressBook').DataTable({
                    "ajax": {
                        "url": "/assets/js/data.txt",
                        "dataSrc": ""
                    },
                    "columns": [
                        { "data": "name" },
                        { "data": "position" },
                        { "data": "office" },
                        { "data": "extn" },
                        { "data": "start_date" },
                        { "data": "salary" }
                    ]
                })
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();