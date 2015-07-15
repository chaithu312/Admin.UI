'use strict';

/* Controllers */

angular.module('myApp', [])
  .controller('Usercontroller', ['$scope', function ($scope) {
      $scope.formInfo = {};
      $scope.saveData = function () {
          alert("SaveData")
          $scope.nameRequired = '';
          $scope.emailRequired = '';
          $scope.passwordRequired = '';

          if (!$scope.formInfo.Email) {
              $scope.nameRequired = 'Name Required';
          }

          if (!$scope.formInfo.Email) {
              $scope.emailRequired = 'Email Required';
          }

          if (!$scope.formInfo.Password) {
              $scope.passwordRequired = 'Password Required';
          }
      };
  }])
  .controller('MyCtrl2', [function () {

  }]);