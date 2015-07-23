(function () {
    'use strict';
    alert("controller enter");
    angular
        .module('NavigationApp')
        .controller('NavigationController', NavigationController);

    NavigationController.$inject = ['$location','Navigation']; 

    function NavigationController($scope, Navigation) {
        $scope.Navigation = Navigation.query();
    }
    alert("controller");
})();
