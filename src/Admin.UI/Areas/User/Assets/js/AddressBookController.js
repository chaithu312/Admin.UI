﻿(function () {
    var app = angular.module('mainApp');
    app.factory('addressModels', function () {

        var addressModels = {};
        addressModels.Address = function () {
            this.AddressType = null;
            this.ShortName = null;
            this.Company = null;
            this.FirstName = null;
            this.LastName = null;
            this.Phone1 = null;
            this.Phone2 = null;
            this.Fax = null;
            this.Email = null;
            this.CountryId = null;
            this.PostalCode = null;
            this.Division = null;
            this.City = null;
            this.Address1 = null;
            this.Address2 = null;
            this.Address3 = null;
            Address1Label=null
            Address2Label=null
            isAddress3Visible = true
            CountryCode = null;
        }
        return addressModels;
    });
    app.factory('addressValidator', function (validator) {
        var s = new validator();
        s.ruleFor('AddressType').notEmpty();

        s.ruleFor('ShortName').notEmpty();
        s.ruleFor('ShortName').length(2, 100);

        s.ruleFor('Company').notEmpty();
        s.ruleFor('Company').length(2,100);


        s.ruleFor('FirstName').notEmpty();
        s.ruleFor('FirstName').length(2,50);
        
        s.ruleFor('LastName').notEmpty();
        s.ruleFor('LastName').length(2, 50);

        s.ruleFor('Phone1').notEmpty();
        s.ruleFor('Phone1').notNull();
        s.ruleFor('Phone1').validatePhone();
        
        s.ruleFor('Phone2').validatePhone();

        s.ruleFor('Email').notEmpty();
        s.ruleFor('Email').emailAddress();
        

        s.ruleFor('CountryId').notEmpty();

        s.ruleFor('PostalCode').notEmpty();
        s.ruleFor('PostalCode').validatePostalCode();
        
        s.ruleFor('Division').notEmpty();
        s.ruleFor('City').notEmpty();

        s.ruleFor('Address1').notEmpty();
        s.ruleFor('Address1').length(2, 100);

        s.ruleFor('Address2').length(0, 100);

        s.ruleFor('Address3').length(0, 100);
        
        return s;
    });
    // create angular controller
    app.controller('AddressBookController', function (addressModels, addressValidator,$scope, $http, $filter) {
        $scope.contact = addressModels.Address;
        $scope.contact = null;
        $scope.contact = { AddressType: null, ShortName: null, Company: null, FirstName: null, LastName: null, Phone1: null, Phone2: null, Fax: null, Email: null, CountryId: null, PostalCode: null, Division: null, City: null, Address1: null, Address2: null, Address3: null, Address1Label: "Address Line 1", Address2Label: "Address Line 2", isAddress3Visible: true, CountryCode:null };
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
                $scope.Country = (JSON.parse(data)).Result;
                //  $scope.message = 'Login Successfully';
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });

        $scope.valResult = {};
        //HTTP REQUEST ABOVE
        $scope.$watch('contact', function (newValue) {
            if ($scope.contact.CountryId != null)
                $scope.GetCountryDetail($scope.contact.CountryId);
            $scope.valResult =addressValidator.validate($scope.contact);
        }, true);

        $scope.GetCountryDetail = function (CountryId) {
            var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number($scope.contact.CountryId); })[0];
            $scope.contact.CountryCode = countryfiltered.Code;
            if ($scope.contact.CountryCode != null && $scope.contact.CountryCode == "US") {
                $scope.contact.Address1Label = "Street Address";
                $scope.contact.Address2Label = "Apt / Suite / Other";
                $scope.contact.isAddress3Visible = false;
            }
            else {
                $scope.contact.Address1Label = " Address Line 1";
                $scope.contact.Address2Label = "Address Line 2";
                $scope.contact.isAddress3Visible = true;
            }
        }
        // function to submit the form after all validation has occurred
        $scope.submitForm = function () {
            var unregisterValidatorWatch =
         $scope.$watch(function () { return $scope.contact; },
                      function () {
                          $scope.valResult = addressValidator.validate($scope.contact);
                          if ($scope.contact.$isValid)
                              unregisterValidatorWatch();
                      }, true);
            // check to make sure the form is completely valid
            //if (!$scope.contact.$isValid) {
            //    console.clear();
            //    console.log('valid');
            //    console.log($scope.AddressBook);
            //    console.log($scope.AddressBook.$error);
            //}
            if ($scope.contact.$isValid) {

                $http({
                    url: '/User/Home/AddressBook',
                    method: "POST",
                    data: JSON.stringify($scope.contact),
                    contentType: "application/json;",
                    dataType: "json"
                })
                .success(function (data, status, headers, config) {
                    $scope.message = data;

                    window.location.href = "/User/Home/ViewAddress";

                }).error(function (data, status, headers, config) {
                    alert(data);
                });
                //Ends herefor saving addresssbook record.
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
    
    app.directive('postalcode', ['$http', function ($http) {
        return {
            restrice: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                angular.element(element).bind('blur', function () {
                  
                });
            }
        }
    }]);
})();