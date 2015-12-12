(function () {
    var app = angular.module('mainApp');
    // create angular controller
    app.controller('ViewPickupController', function ($scope, $http, virtualDir) {
        $scope.message = '';
        $scope.datasrc = '';
        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };

        $scope.columnDefs = [{
            "mDataProp": "Name",
            "aTargets": [0]
        }, {
            "mDataProp": "Phone",
            "aTargets": [1]
        }, {
            "mDataProp": "EMail",
            "aTargets": [2]
        }, {
            "mDataProp": "Address1",
            "aTargets": [3]
        }, {
            "mDataProp": "City",
            "aTargets": [4]
        }, {
            "mDataProp": "PickupFrom",
            "aTargets": [5]
        }, {
            "mDataProp": "ReadyTime",
            "aTargets": [6]
        }, {
            "mDataProp": "AvailableUntil",
            "aTargets": [7]
        }, {
            "mDataProp": "TotalPieces",
            "aTargets": [8]
        }, {
            "mDataProp": "Destination",
            "aTargets": [9]
        }, {
            "mDataProp": "Instructions",
            "aTargets": [10]
        }, {
            "mDataProp": "Detail",
            "aTargets": [11]
        }, {
            "mDataProp": "Confirmation",
            "aTargets": [12]
        }, ];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": false,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };

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
                $scope.datasrc = JSON.parse(data);
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();