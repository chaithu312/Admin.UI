angular.module('mainApp')
.controller('UserController', function ($scope, RegistrationService) {
    $scope.submitText = "Register";
    $scope.submitted = false;
    $scope.message = '';
    $scope.isFormValid = false;
    $scope.User = {
        UserName: '',
        Password: '',
        ConfirmPassword: '',
        DomainKey: '',
    };
    //Check form Validation // here frmRegistration is our form name
    $scope.$watch('frmRegistration.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });
    //Save Data
    $scope.SaveData = function (data) {
        if ($scope.submitText == 'Register') {

            $scope.submitted = true;
            $scope.message = '';

            if ($scope.isFormValid) {
                alert("valid");
                //TODO Hidden field
                $scope.User.DomainKey = $("#DomainKey").val();
                $scope.submitText = 'Please Wait...';
                $scope.User = data;
                RegistrationService.SaveFormData($scope.User).then(function (d) {

                    if (d == 'Success') {
                        //have to clear form here
                        ClearForm();
                        $window.location.href = 'user/Thankyou';
                    }
                    $scope.submitText = "Register";
                });
            }
            else {
                $scope.message = 'Please fill required fields value';
            }
        }
    }
    //Clear Form (reset)
    function ClearForm() {
        $scope.User = {};
        $scope.frmRegistration.$setPristine();
        $scope.submitted = false;
    }
})


   
.factory('RegistrationService', function ($http, $q) {
    var fac = {};

    fac.SaveFormData = function (data) {
        var defer = $q.defer();
        $http({
            url: '/user/Index',
            method: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
        }).success(function (d) {
            // Success callback
            defer.resolve(d);
        }).error(function (e) {
            //Failed Callback
            defer.reject(e);
        });
        return defer.promise;
    }
    return fac;
});


