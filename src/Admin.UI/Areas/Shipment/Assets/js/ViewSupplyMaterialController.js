(function () {
    var app = angular.module('mainApp');
    // create angular controller
    app.controller('ViewSupplyMaterialController', function ($scope, $http, $window, virtualDir) {
        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
        $scope.datasrc = '';

        $scope.editSupplyMaterialForm = function (id) {
            var url = "http://" + $window.location.host + "/Shipment/SupplyMaterial/?" + id;
            //$log.log(url);
            $window.location.href = url;

            console.log('deleting user ');
        };

        $scope.deleteSupplyMaterialForm = function (id) {
            bootbox.confirm({
                size: 'small',
                message: "SupplyMaterial will be cancelled. Continue?</br>After saving this action; the record may disappear from the list",
                callback: function (result) {
                    if (result === false) {
                    } else {
                        $http({
                            method: 'GET',
                            url: '/Shipment/Home/SupplyMaterialDeletedById',
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
                                "mDataProp": "Name",
                                "aTargets": [0]
                            }, {
                                "mDataProp": "Sequence",
                                "aTargets": [1]
                            }, {
                                "mDataProp": "Unit",
                                "aTargets": [2]
                            },
                            {
                                "mDataProp": "RequestID",
                                "aTargets": [3]
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
                                    var lim = viewpickup.length;
                                    for (var i = 0; i < lim; i++) {
                                        viewpickup[i].RequestID = '<div class="hidden-sm hidden-xs btn-group"><button id="btnedit" type="button" onclick="angular.element(this).scope().editSupplyMaterialForm(' + viewpickup[i].Id + ')" class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button  id="btndelete" type="button" class="btn btn-xs btn-danger" onclick="angular.element(this).scope().deleteSupplyMaterialForm(' + viewpickup[i].Id + ')"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                                        
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
            "mDataProp": "Name",
            "aTargets": [0]
        }, {
            "mDataProp": "Sequence",
            "aTargets": [1]
        }, {
            "mDataProp": "Unit",
            "aTargets": [2]
        },
        {
            "mDataProp": "RequestID",
            "aTargets": [3]
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
                var lim = viewpickup.length;
                for (var i = 0; i < lim; i++) {
                    viewpickup[i].RequestID = '<div class="hidden-sm hidden-xs btn-group"><button id="btnedit" type="button" onclick="angular.element(this).scope().editSupplyMaterialForm(' + viewpickup[i].Id + ')" class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120"></i></button><button  id="btndelete" type="button" class="btn btn-xs btn-danger" onclick="angular.element(this).scope().deleteSupplyMaterialForm(' + viewpickup[i].Id + ')"><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
                   
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