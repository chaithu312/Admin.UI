(function () {
    var validationApp = angular.module('mainApp');

    // create angular controller
    validationApp.controller('AddressBookController', function ($scope) {
        // function to submit the form after all validation has occurred
        $scope.submitForm = function () {
            // check to make sure the form is completely valid
            if ($scope.AddressBook.$valid) {
                console.clear();
                console.log('valid');
                console.log($scope.AddressBook);
            }

            if ($scope.AddressBook.$invalid) {
                console.log($scope.AddressBook.$error);
            }
        };
    });

    var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
    validationApp.directive('phone', function () {
        return {
            restrice: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                angular.element(element).bind('blur', function () {
                    var value = this.value;
                    if (PHONE_REGEXP.test(value)) {
                        // Valid input
                        console.log("valid phone number");
                        angular.element(this).next().next().css('display', 'none');
                    } else {
                        // Invalid input
                        ctrl.$setValidity('currencyField', false);
                        console.log("invalid phone number");
                        angular.element(this).next().css('display', 'block');
                        angular.element(this).next().css('display', 'block');

                        /*
                            Looks like at this point ctrl is not available,
                            so I can't user the following method to display the error node:
                            ctrl.$setValidity('currencyField', false);
                        */
                    }
                });
            }
        }
    });
});