(function () {
    var app = angular.module('mainApp')
    app.controller('TrackController', function ($scope, $http, virtualDir) {
        $scope.Status = {
            Data: [{ Id: 0, Name: 'All Non-Delivered' },
                { Id: 1, Name: 'Pending (No Trk Data)' },
                { Id: 3, Name: 'In Transit' },
            { Id: 10, Name: 'Delivered / Stopped' },
            { Id: 4, Name: 'Delivered' },
            { Id: 6, Name: 'Stopped' },
            { Id: 5, Name: 'Exception' }],
            selectedOption: { Id: 4, Name: 'Delivered' }
        };

        $scope.Manifest = {
            Data: [{ Id: 0, Name: 'Select...' }],
                selectedOption: { Id: 0, Name:'Select...' }
        };

        $scope.sendForm = function () {
            $http({
                method: 'POST',
                url: virtualDir.AdminURL + '/Shipment/Tracking',
                data: $scope.person,
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
                    $scope.message = 'Saved Successfully';
                    $scope.person = {};
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        };
    });
})();