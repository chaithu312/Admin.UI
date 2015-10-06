(function () {
    var validationApp = angular.module('mainApp');
    
    // create angular controller
    validationApp.controller('AddressBookController', function ($scope, $http) {

        //HTTP REQUEST BELOW
        $http({
            method: 'GET',
            url: '/User/Home/Country',
            // data: $scope.person,
            headers: {
                'RequestVerificationToken': $scope.antiForgeryToken
            }
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            if (data.success == false) {
                var str = '';
                for (var error in data.errors) {
                    str += data.errors[error] + '\n';
                }
                $scope.message = str;
            }
            else {
                $scope.Country = JSON.parse(data);
                //  $scope.message = 'Login Successfully';
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });

        //HTTP REQUEST ABOVE


        // function to submit the form after all validation has occurred
        $scope.submitForm = function () {
            // check to make sure the form is completely valid
            if ($scope.AddressBook.$valid) {
                console.clear();
                console.log('valid');
                console.log($scope.AddressBook);
            }
            if ($scope.AddressBook.$invalid) {

                $http({
                    url: '/User/Home/AddressBook',
                    method: "POST",
                    data: JSON.stringify($scope.contact),
                    contentType: "application/json;",
                    dataType: "json"
                })
                .success(function (data, status, headers, config) {
                    alert(data);

                }).error(function (data, status, headers, config) {
                    alert(data);
                });
                //Ends herefor saving addresssbook record.

                console.log($scope.AddressBook.$error);
            }
        }
        //Getting selected Country Code and Country Name
        $scope.GetValue = function (country) {
            var countryId = $scope.contact.CountryId;

            var CountryName = $.grep($scope.Country, function (country) {
                return country.Id == countryId;
            })[0].Name;
            $scope.SelectedCountry = {};
            $scope.SelectedCountry.Id = countryId;
            $scope.SelectedCountry.Name = CountryName;
            //Getting States list using HTTP Request from controller

            $http({
                method: 'GET',
                url: '/User/Home/State',
                //data: $scope.SelectedCountry.CountryCode,
                params: { countryId: $scope.contact.CountryId },
                headers: {
                    'RequestVerificationToken': $scope.antiForgeryToken
                }
            }).success(function (data, status, headers, config) {
                $scope.message = '';
                if (data.success == false) {
                    var str = '';
                    for (var error in data.errors) {
                        str += data.errors[error] + '\n';
                    }
                    $scope.message = str;
                }
                else {
                    $scope.States = JSON.parse(data);
                    //  $scope.message = 'Login Successfully';
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });

            //Ends here getting request of Http for getting states;

        }
        //Ends here getting country detail

    });
    var PHONE_REGEXP = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    
    validationApp.directive('phone', ['$http', function ($http) {
        return {
            restrice: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                angular.element(element).bind('blur', function () {
                    if (PHONE_REGEXP.test(this.value)) {
                        //Postal code is in valid format get cities related to that postal code
                        //Getting Postal Code
                       
                        $http({
                            url: '/User/Home/PostalCode',
                            method: "GET",
                            data: JSON.stringify(this.value),
                            contentType: "application/json;",
                            dataType: "json"
                        })
                       .success(function (data, status, headers, config) {
                           scope.contact.PostalCodes = JSON.parse(data);;

                       }).error(function (data, status, headers, config) {
                           alert(data);
                       });

                        //End of getting Postal code
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
    }]);
})();