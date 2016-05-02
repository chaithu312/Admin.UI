(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewPostCodeController', function ($scope, $http, $window) {

        $http({
            method: 'GET',
            url: '/User/Home/Division',
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
               
                $scope.States = JSON.parse(data);
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });

        $scope.GetAllPostCodes = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "State",
                    "aTargets": [0]
                },
            {
                "mDataProp": "CityName",
                "aTargets": [1]
            }, {
                "mDataProp": "CityType",
                "aTargets": [2]
            }, {
                "mDataProp": "CountryName",
                "aTargets": [3]
            }, {
                "mDataProp": "PostalCode",
                "aTargets": [4]
            },
             {
                "mDataProp": "Class",
                "aTargets": [5]
             },
             {
                 "mDataProp": "AreaCode",
                 "aTargets": [6]
             },
             {
                 "mDataProp": "TimeZone",
                 "aTargets": [7]
             },
             {
                 "mDataProp": "AdditionalDays",
                 "aTargets": [8]
             },
             {
                 "mDataProp": "SaturdayDelivery",
                 "aTargets": [9]
             },
            {
                "mDataProp": "Pickup",
                "aTargets": [10]
            },
            {
                "mDataProp": "Delivery",
                "aTargets": [11]
            }
            , {
                "mDataProp": "Detail",
                "aTargets": [12]
            }];

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
                url: '/ServiceRate/Home/GetAllPostCodes',
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
                    bootbox.dialog({
                        message: str,
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary"
                            }
                        }
                    });
                }
                else {

                    var lim = data.length;
                    for (var i = 0; i < lim; i++) {
                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                        data[i].SaturdayDelivery = data[i].SaturdayDelivery == true ? "YES" : "NO";
                        data[i].Pickup = data[i].Pickup == true ? "AVAILABLE" : "UN-AVAILABLE";
                        data[i].Delivery = data[i].Delivery == true ? "AVAILABLE" : "UN-AVAILABLE";
                    }

                    $scope.datasrc = data;
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
     
        console.log('deleting country');
        $scope.deleteForm = function (Id) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Id,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/Home/DeletePostById',
                            params: { id: Id },
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
                            $scope.GetAllPostCodes();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/PostCode/?" + Id;
            $window.location.href = url;
        }

        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
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
        $scope.GetAllPostCodes();

    });
})();