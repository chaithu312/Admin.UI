(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewDiscountController', function ($scope, $http, $window) {

        $scope.tabelsData = [
       { 'name': 'rohit', 'dob': '15-august-1985', 'emailId': 'rohit@rohit.com', 'phone': '9999999999', 'address': 'Delhi Rohini', 'id': '0' },
       { 'name': 'aman', 'dob': '26-july-1975', 'emailId': 'haryanat@hr.com', 'phone': '9874563210', 'address': 'Haryana Sonepat', 'id': '1' },
       { 'name': 'devraj', 'dob': '27-march-1980', 'emailId': 'punjab@punjab.com', 'phone': '7410258963', 'address': 'Punjab AmritSar', 'id': '2' }
        ];


        $scope.modify = function (tableData) {

            $scope.modifyField = true;
            $scope.viewField = true;
        };


        $scope.update = function (tableData) {
            $scope.modifyField = false;
            $scope.viewField = false;
        };

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
                            url: '/ServiceRate/Home/DeleteDiscountById',
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
            var url = "http://" + $window.location.host + "/ServiceRate/Discount/?" + Id;
            $window.location.href = url;
        }

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
    });
})();