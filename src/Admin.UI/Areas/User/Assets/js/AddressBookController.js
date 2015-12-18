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
            Address1Label = null
            Address2Label = null
            isAddress3Visible = true
            CountryCode = null;
        }
        return addressModels;
    });

    // create angular controller
    app.controller('AddressBookController', function (addressModels, $scope,$location, $http, $filter, virtualDir) {
        $scope.contact = addressModels.Address;
        $scope.contact = null;
        $scope.contact = { AddressType: null, ShortName: null, Company: null, FirstName: null, LastName: null, Phone1: null, Phone2: null, Fax: null, Email: null, CountryId: null, PostalCode: null, Division: null, City: null, Address1: null, Address2: null, Address3: null, Address1Label: "Address Line 1", Address2Label: "Address Line 2", isAddress3Visible: true, CountryCode: null, Id: null };

       
        //HTTP REQUEST BELOW
        $("#veil").show();
        $("#feedLoading").show();
        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/Home/Country',
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
                $scope.Country = (JSON.parse(data));
                $("#veil").hide();
                $("#feedLoading").hide();
            }
        }).error(function (data, status, headers, config) {
            bootbox.dialog({
                message: "Country URL is invalid!",
                buttons: {
                    "success": {
                        "label": "OK",
                        "className": "btn-sm btn-primary"
                    }
                }
            });
        });

        $scope.valResult = {};
        //HTTP REQUEST ABOVE
        $scope.$watch('contact', function (newValue) {
            if ($scope.contact.CountryId != null)
                $scope.GetCountryDetail($scope.contact.CountryId);
            //$scope.valResult = addressValidator.validate($scope.contact);
        }, true);

        if ($location.absUrl().split("?").length > 1) {
            var selectedAddress = [];
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/User/Home/GetAllAddress',
                //data: $scope.SelectedCountry.CountryCode,
                //params: { countryId: $scope.contact.CountryId },
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
                    selectedAddress = data;
                    var selectedAddress = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $http({
                        method: 'GET',
                        url: virtualDir.AdminURL + '/User/Home/State',
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
                            $scope.bindAddressBook(selectedAddress);
                        }
                    }).error(function (data, status, headers, config) {
                        $scope.message = 'state url is not valid';
                    });
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });

        }

        $scope.bindAddressBook=function(address)
        {
            $scope.contact.ShortName = address.ShortName;
            $scope.contact.Company = address.Company;
            $scope.contact.FirstName = address.Name.split(' ')[0];
            $scope.contact.LastName = address.Name.split(' ')[1];
            $scope.contact.Phone1 = parseInt(address.Phone1);
            $scope.contact.Phone2 = parseInt(address.Phone2);
            $scope.contact.Fax = address.Fax;
            $scope.contact.Email = address.EMail;
            $scope.contact.PostalCode = address.PostalCode;
            $scope.contact.City = address.City;
            $scope.contact.Address1 = address.Address1;
            $scope.contact.Address2 = address.Address2;
            $scope.contact.Address3 = address.Address3;
            $scope.contact.CountryId = address.CountryId;
            $scope.contact.Division = address.Division;
            $scope.contact.AddressType = address.AddressType;
            $scope.contact.Id = address.Id;

            $scope.$apply();
            $("#Type").find('option[value=' + address.AddressType + ']').attr('selected', 'selected');

            $("#Country").find('option[value=' + address.CountryId + ']').attr('selected', 'selected');

            $("#ddlState").find('option[label=' + address.Division + ']').attr('selected', 'selected');
        }

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
            if ($scope.AddressBook.$valid) {
                $("#veil").show();
                $("#feedLoading").show();
                $http({
                    url: virtualDir.AdminURL + '/User/Home/AddressBook',
                    method: "POST",
                    data: JSON.stringify($scope.contact),
                    contentType: "application/json;",
                    dataType: "json"
                })
                .success(function (data, status, headers, config) {
                    $scope.message = data;
                    bootbox.dialog({
                        message: "New contact added!",
                        buttons: {
                            "success": {
                                "label": "OK",
                                "className": "btn-sm btn-primary",
                                callback: function () {
                                    window.location.href = "/User/ViewAddress";
                                }
                            }
                        }
                    });
                }).error(function (data, status, headers, config) {
                    alert(data);
                });
                //Ends herefor saving addresssbook record.
            }
            else {
                $scope.message = "Invalid";
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
                url: virtualDir.AdminURL + '/User/Home/State',
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

                    if (JSON.parse(data).length == 0)
                        $scope.States = [{ "Id": 0, "CountryId": "a", "DivisionType": 1, "Code": "a", "Name": "Others", "LocalName": "", "Detail": "", "Created": "2015-09-01T00:00:00", "Status": 0 }];

                    //  $scope.message = 'Login Successfully';
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'state url is not valid';
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