(function () {
    'use strict';

    angular
        .module('NavigationApp')
        .controller('NavigationController', NavigationController);

    NavigationController.$inject = ['$location', 'Navigation'];

    function NavigationController($scope, Navigation) {
        $scope.Navigation = Navigation.query();
    }
})();