﻿(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewAddressController', function ($scope, $http) {
        $scope.myName = function (name) {
            alert('Hello ' + name);
        }

        console.log('deleting ');
        $scope.deleteForm = function () {
            alert('Hello ');
            console.log('deleting user ');
        }

        $("#btndelete").on("click", function () {
            alert("The paragraph was clicked.");
        });
        $("#veil").show();
        $("#feedLoading").show();
        $scope.message = '';
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
            "mDataProp": "Address1",
            "aTargets": [1]
        }, {
            "mDataProp": "City",
            "aTargets": [2]
        }, {
            "mDataProp": "Division",
            "aTargets": [3]
        }, {
            "mDataProp": "CountryId",
            "aTargets": [4]
        }, {
            "mDataProp": "PostalCode",
            "aTargets": [5]
        }, {
            "mDataProp": "Phone1",
            "aTargets": [6]
        }, {
            "mDataProp": "AddressType",
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
            url: '/User/Home/GetAllAddress',
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
                    data[i].Detail = '<div class=' + '"hidden-sm hidden-xs btn-gro/up"' + '><button i type="button"  class="btn btn-xs btn-info"><i class="ace-icon fa fa-pencil bigger-120" onclick="editForm(' + data[i].Id + ')"\ ></i></button><button type="button" class="btn btn-xs btn-danger"' + ' onclick="deleteForm(' + data[i].Id + ')"\><i class="ace-icon fa fa-trash-o bigger-120"></i></button></div>';
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
    });
})();

function deleteForm(addressId) {
    bootbox.confirm({
        size: 'small',
        message: "Are you sure want to delete record#?" + addressId,
        callback: function (result) {
            if (result === false) {
            } else {
                $.ajax({
                    type: "GET",
                    url: "/User/DeleteAddress",
                    data: { "selectedIds": addressId },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (msg) {
                        // Replace the div's content with the page method's return.
                        $("#Result").text(msg.d);
                    }
                });
            }
        }
    })
}

function editForm(addressId) {
    window.location.href = "/user/addressbook?id=" + addressId;
}