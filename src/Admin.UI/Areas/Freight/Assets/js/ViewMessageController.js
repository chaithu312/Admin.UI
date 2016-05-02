(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewMessageController', function ($scope, $http, $window, $filter, ShipOSFactory) {
        $scope.GetAllData = function () {
            $scope.columnDefs = [
                {
                    "mDataProp": "Description",
                    "aTargets": [0]
                },
             {
                 "mDataProp": "Created",
                 "aTargets": [1]
             },
             {
                 "mDataProp": "Detail",
                 "aTargets": [2]
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
                url: '/Freight/GetAllMessages',
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
                        //data[i].Service = $filter('filter')($scope.Services, function (d) { return d.Id == Number(data[i].Service) })[0].Name;
                        //data[i].ProcessedType = $filter('filter')($scope.ProcessTypes, function (d) { return d.Id == Number(data[i].ProcessedType) })[0].Name;
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
                            url: '/Freight/DeleteMessageById',
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
                            $scope.GetAllData();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
        }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/Freight/FreightMessage/?" + Id;
            $window.location.href = url;
        }

        //$("#veil").show();
        //$("#feedLoading").show();
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
        $scope.GetAllData();

    });
})();