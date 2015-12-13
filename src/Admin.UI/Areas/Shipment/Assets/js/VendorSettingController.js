(function () {
    var app = angular.module('mainApp');

    app.controller('vendorController', function ($scope, $http, vendor, virtualDir) {
        $scope.vendor = { Detail: null };
        $scope.sendVendorForm = function () {
            if ($scope.VendorForm.$valid) {
                $scope.vendor.isDisabled = true;
                switch ($scope.vendor.VendorType) {
                    case 1:
                        $scope.vendor.Detail = "{" + "\"" + "ThirdPartyAccount" + "\"" + ":" + "\"" + $scope.vendor.DHLAcc + "\"" + "}";
                        break;
                    case 2:
                        $scope.vendor.Detail = "{" + "\"" + "AccountNumber" + "\"" + ":" + "\"" + $scope.vendor.EndiciaAcc + "\"" + "}";
                        break;
                    case 3:
                        $scope.vendor.Detail = "{" + "\"" + "AccountNumber" + "\"" + ":" + "\"" + $scope.vendor.FedexAcc + "\"" + "," + "\"" + "FedexMeter" + "\"" + ":" + "\"" + $scope.vendor.FedexMeter + "\"" + "," + "\"" + "FedexPayAcc" + "\"" + ":" + "\"" + $scope.vendor.FedexPayAcc + "\"" + "}";
                        break;
                    case 4:
                        $scope.vendor.Detail = "{" + "\"" + "UPSLicenseNo" + "\"" + ":" + "\"" + $scope.vendor.UPSLicenseNo + "\"" + "," + "\"" + "UPSUserName" + "\"" + ":" + "\"" + $scope.vendor.UPSUserName + "\"" + "," + "\"" + "UPSpassword" + "\"" + ":" + "\"" + $scope.vendor.UPSpassword + "\"" + "," + "\"" + "UPSAcc" + "\"" + ":" + "\"" + $scope.vendor.UPSAcc + "\"" + "}";
                        break;
                }

                $http({
                    url: virtualDir.AdminURL + '/Shipment/VendorSetting',
                    method: "POST",
                    data: JSON.stringify($scope.vendor),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $scope.vendor = null;
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $scope.message = data;
                    });
            }
            if ($scope.VendorForm.$invalid) { $scope.message = "Please check required fields." }
        };
    });
})();