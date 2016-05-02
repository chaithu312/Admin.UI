(function () {
    'use strict';
    var NavigationServices = angular.module('NavigationServices', ['ngResource']);

    NavigationServices.factory('Navigation', ['$resource',
      function ($resource) {
          return $resource('/api/Navigation/', {}, {
              query: { method: 'GET', params: {}, isArray: true }
          });
      }]);
})();