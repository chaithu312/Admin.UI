﻿(function () {
    var app = angular.module('mainApp');
    // create angular controller
    app.controller('ViewPickupController', function ($scope, $http, virtualDir) {
        $("#veil").show();
        $("#feedLoading").show();
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
            "mDataProp": "ContactName",
            "aTargets": [0]
        }, {
            "mDataProp": "Phone",
            "aTargets": [1]
        }, {
            "mDataProp": "Address1",
            "aTargets": [2]
        }, {
            "mDataProp": "City",
            "aTargets": [3]
        }, {
            "mDataProp": "PickupFrom",
            "aTargets": [4]
        }, {
            "mDataProp": "ReadyTime",
            "aTargets": [5]
        }, {
            "mDataProp": "AvailableTime",
            "aTargets": [6]
        }, {
            "mDataProp": "TotalPieces",
            "aTargets": [7]
        }, {
            "mDataProp": "Destination",
            "aTargets": [8]
        }, {
            "mDataProp": "RatePickupIndicator",
            "aTargets": [9]
        }, {
            "mDataProp": "PickUpNotificationPersonalizedMessage",
            "aTargets": [10]
        },
        {
            "mDataProp": "RequestID",
            "aTargets": [11]
        }];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
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
                var viewpickup = JSON.parse(data);
                var lim = viewpickup.length;
                for (var i = 0; i < lim; i++) {
                    if (viewpickup[i].Destination == 1) {
                        viewpickup[i].Destination = 'Domestic';
                    } else {
                        if (viewpickup[i].Destination == 2) {
                            viewpickup[i].Destination = 'International';
                        } else { viewpickup[i].Destination = 'International multiple packages with mixed destinations' }
                    }
                }

                $scope.datasrc = viewpickup;
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();