(function () {
    var app = angular.module('mainApp');
   
    app.controller('PaymentController', function ($scope, $http, $filter, getQueryStringValue) {
        $scope.Payment = {};
        $scope.CreditVisible = false;
        if (getQueryStringValue.getValue("opt") != null && getQueryStringValue.getValue("opt")==="credit")
        {
            $scope.CreditVisible = true;
        }
            
        //alert(getQueryStringValue.getValue("opt"));
       //var res= getQueryStringValue.passString("opt");
        $scope.submitPaymentForm = function ()
        {
            if ($scope.PaymentForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/Finance/Payment',
                    method: "POST",
                    data: JSON.stringify($scope.Payment),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
    })})();