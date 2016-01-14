(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewAgentServiceController', function ($scope, $window, $http) {


        $scope.deleteForm = function (Id,Name) {
            bootbox.confirm({
                size: 'small',
                message: "Are you sure want to delete record#? " + Name,
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/ServiceRate/DeleteAgents',
                            //data: $scope.SelectedCountry.CountryCode,
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
                            $scope.columnDefs = [{
                                "mDataProp": "CountryId",
                                "aTargets": [0]
                            }, {
                                "mDataProp": "AgentName",
                                "aTargets": [1]
                            }, {
                                "mDataProp": "LabelAPI",
                                "aTargets": [2]
                            }, {
                                "mDataProp": "PickupCharge",
                                "aTargets": [3]
                            }, {
                                "mDataProp": "SaturdayPickupCharge",
                                "aTargets": [4]
                            }, {
                                "mDataProp": "TrackingURL",
                                "aTargets": [5]
                            }, {
                                "mDataProp": "Detail",
                                "aTargets": [6]
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
                                        data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')" ></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ',' + data[i].AgentName + ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                                        if (data[i].AddressType == 0) {
                                            data[i].AddressType = 'Recipient';
                                        } else { data[i].AddressType = 'Sender'; }

                                        if (data[i].Status == 0) {
                                            data[i].Status = 'De-Active';
                                        } else { data[i].Status = 'Active'; }
                                    }

                                    $scope.datasrc = data;
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
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/Agents/?" + Id;
            //$log.log(url);
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

        $scope.columnDefs = [{
            "mDataProp": "CountryId",
            "aTargets": [0]
        }, {
            "mDataProp": "AgentName",
            "aTargets": [1]
        }, {
            "mDataProp": "LabelAPI",
            "aTargets": [2]
        }, {
            "mDataProp": "PickupCharge",
            "aTargets": [3]
        }, {
            "mDataProp": "SaturdayPickupCharge",
            "aTargets": [4]
        }, {
            "mDataProp": "TrackingURL",
            "aTargets": [5]
        }, {
            "mDataProp": "Detail",
            "aTargets": [6]
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
                    data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info" onclick="angular.element(this).scope().editForm(' + data[i].Id + ')"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="angular.element(this).scope().deleteForm(' + data[i].Id + ','+"'" + data[i].AgentName +"'"+ ')" ><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';

                }

                $scope.datasrc = data;
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });
    });
})();