var app = angular.module("myApp", []);
app.controller("userCntrl", function ($scope, $http) {
    alert("hi");
    if (!Valid) {
        alert("Invalid form");
        return;
    } else {
        alert("It's Great. Form Submitted");
    }

    $scope.Save = function (Valid) {
        if (!Valid) {
            alert("Invalid form");
            return;
        } else {
            alert("It's Great. Form Submitted");
        }
    }
});