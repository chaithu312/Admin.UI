(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewCountryController', function ($scope, $http, $window) {
        $scope.GetAllCountries = function () {
            $scope.columnDefs = [
            {
                "mDataProp": "Id",
                "aTargets": [0]
            },
            {
                "mDataProp": "Name",
                "aTargets": [1]
            }, {
                "mDataProp": "ISOCode",
                "aTargets": [2]
            }, {
                "mDataProp": "TopLevelDomain",
                "aTargets": [3]
            }, {
                "mDataProp": "DialingCode",
                "aTargets": [4]
            }, {
                "mDataProp": "Delivery",
                "aTargets": [5]
            }, {
                "mDataProp": "Membership",
                "aTargets": [6]
            }, {
                "mDataProp": "SecurityCharge",
                "aTargets": [7]
            }, {
                "mDataProp": "Status",
                "aTargets": [8]
            }, {
                "mDataProp": "Detail",
                "aTargets": [9]
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
                url: '/ServiceRate/Home/GetAllCountries',
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
                        if (data[i].Status == 0) {
                            data[i].Status = 'SUSPENDED';
                        } else { data[i].Status = 'ACTIVE'; }

                        if (data[i].SecurityCharge == 0) {
                            data[i].SecurityCharge = 'NO';
                        } else { data[i].SecurityCharge = 'YES'; }

                        if (data[i].Membership == 2) {
                            data[i].Membership = 'NOT ALLOWED';
                        } else { data[i].Membership = 'ALLOWED'; }

                        if (data[i].Delivery == 2) {
                            data[i].Delivery = 'NOT AVAILABLE';
                        } else { data[i].Delivery = 'AVAILABLE'; }
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
                            url: '/ServiceRate/Home/DeleteCountryById',
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
                            $scope.GetAllCountries();
                            $scope.message = '';
                        }).error(function (data, status, headers, config) {
                            $scope.message = 'Unexpected Error';
                        });
                    }
                }
            })
           }
        $scope.editForm = function (Id) {
            var url = "http://" + $window.location.host + "/ServiceRate/Country/?" + Id;
            $window.location.href = url;
        }

        $("#btndelete").on("click", function () {
            alert("The paragraph was clicked.");
        });
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
        $scope.GetAllCountries();
        
    });
})();