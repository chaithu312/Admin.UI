(function () {
    var app = angular.module('mainApp');
    // create angular controller
    app.controller('ViewPickupController', function ($scope, $http, $window, virtualDir) {
        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.datasrc = '';

        $scope.editPickupForm = function (id) {
            var url = "http://" + $window.location.host + "/Shipment/PickupRequest/?" + id;
            //$log.log(url);
            $window.location.href = url;

            console.log('deleting user ');
        }

        $scope.deletePickupForm = function (id) {
            bootbox.confirm({
                size: 'small',
                message: "Pickup will be cancelled. Continue?</br>After saving this action; the record may disappear from the list",
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/Shipment/Home/DeleteById',
                            //data: $scope.SelectedCountry.CountryCode,
                            params: { id: id },
                            headers: {
                                'RequestVerificationToken': $scope.antiForgeryToken
                            }
                        }).success(function (data, status, headers, config) {
                            $("#veil").show();
                            $("#feedLoading").show();
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
                                "scrollY": "200px",
                                "scrollCollapse": true,
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
                                        viewpickup[i].RequestID = '<div class="hidden-sm hidden-xs btn-group"><button id="btnedit" type="button" onclick="angular.element(this).scope().editPickupForm(' + viewpickup[i].Id + ')" class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button  id="btndelete" type="button" class="btn btn-xs btn-danger" onclick="angular.element(this).scope().deletePickupForm(' + viewpickup[i].Id + ')"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
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
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }

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
            "scrollY": "200px",
            "scrollCollapse": true,
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
                    viewpickup[i].RequestID = '<div class="hidden-sm hidden-xs btn-group"><button id="btnedit" type="button" onclick="angular.element(this).scope().editPickupForm(' + viewpickup[i].Id + ')" class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button  id="btndelete" type="button" class="btn btn-xs btn-danger" onclick="angular.element(this).scope().deletePickupForm(' + viewpickup[i].Id + ')"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
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