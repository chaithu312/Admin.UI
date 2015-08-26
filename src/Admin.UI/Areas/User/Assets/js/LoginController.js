angular.module('mainApp')
.controller('LoginController', function ($scope, RegistrationService) {
    $scope.submitText = "Login";
    $scope.submitted = false;
    $scope.message = '';
    $scope.isFormValid = false;
    $scope.User = {
        UserName: '',
        Password: '',
           
    };
    //Check form Validation // here frmRegistration is our form name
    $scope.$watch('frmLogin.$valid', function (newValue) {
        $scope.isFormValid = newValue;
    });
    //Save Data
    $scope.LoginData = function (data) {
        if ($scope.submitText == 'Login') {

            $scope.submitted = true;
            $scope.message = '';

            if ($scope.isFormValid) {
                alert("valid");
                //TODO Hidden field
                
                $scope.submitText = 'Please Wait...';
                $scope.User = data;
                LoginService.LoginForUser($scope.User).then(function (d) {

                    if (d == 'Success') {
                        //have to clear form here
                        ClearForm();
                        $window.location.href = 'Home/Index';
                    }
                    $scope.submitText = "Login";
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
        $scope.frmLogin.$setPristine();
        $scope.submitted = false;
    }
})
.factory('LoginService', function ($http, $q) {
    var fac = {};

    fac.LoginForUser = function (data) {
        var defer = $q.defer();
        $http({
            url: '/user/Login',
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