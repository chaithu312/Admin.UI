(function () {
    var app = angular.module('mainApp');
    app.factory('pickupModels', function () {

        var pickupModels = {};
        pickupModels.Pickup = function () {
            this.ContactName= null;
            this.Phone = null;
            this.AddressType = null;
            this.AddressCaption = null;
            this.Address1 = null;
            this.Address2 = null;
            this.City = null;
            this.CountryId = null;
            this.ZipCode = null;
            this.Division = null;
            this.Carrier = null;
            this.PickupFrom = null;
            this.PickupDate = null;
            this.Destination = null;
            this.ParcelType = null;
            this.ReadyTime = null;
            this.AvailableTime = null;
            this.TotalPieces = null;
            this.isDisabled = null;
            this.notification=[];
        }
        return pickupModels;
    });
    app.factory('pickupValidator', function (validator) {
        var pickupValidator = s = new validator();
        s.ruleFor('Phone').notEmpty();
        s.ruleFor('AddressType').notEmpty();
        s.ruleFor('AddressCaption').notEmpty();
        s.ruleFor('AddressType').notEmpty();
        s.ruleFor('AddressCaption').notEmpty();
        s.ruleFor('Address1').notEmpty();
        s.ruleFor('City').notEmpty();
        s.ruleFor('CountryId').notEmpty();
        s.ruleFor('ZipCode').notEmpty();
        s.ruleFor('Division').notEmpty();
        s.ruleFor('Carrier').notEmpty();
        s.ruleFor('PickupFrom').notEmpty();
        s.ruleFor('PickupDate').notEmpty();
        s.ruleFor('Destination').notEmpty();
        s.ruleFor('ParcelType').notEmpty();
        s.ruleFor('ReadyTime').notEmpty();
        s.ruleFor('AvailableTime').notEmpty();
        s.ruleFor('TotalPieces').notEmpty();
        return pickupValidator;
    });
    
    app.controller('PickupRequestController', function (pickupModels, pickupValidator,$scope, $http, $filter) {
       $scope.pickupRequest = pickupModels.Pickup;
        $scope.notification = {
            Mobile: [{
                Number: ""
            }],
            Email: [{
                ID: ""
            }]
        };

        $scope.addMobile = function () {
            $scope.notification.Mobile.push({
                Number: ""
            });
        },

        $scope.removeMobile = function (index) {
            $scope.notification.Mobile.splice(index, 1);
        },

        $scope.addEmail = function () {
            $scope.notification.Email.push({
                ID: ""
            });
        },

        $scope.removeEmail = function (index) {
            $scope.notification.Email.splice(index, 1);
        },

        $scope.Contacts = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Account 1' }, { Id: 2, Name: 'Account 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };
        $scope.Addresses = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Address 1' }, { Id: 2, Name: 'Address 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };

        $scope.pickupRequest = null;

        $scope.pickupRequest = { ContactName: null, Phone: null, PickupFrom: null, Address1: null, Address2: null, City: null, ZipCode: null, CountryId: null, Division: null, isDisabled: null, notification: [] }

        var AllAddress = new Array();
        var selectedAddress = null;
        $scope.Address = new Array();
        var item =
            {
                Id: 0,
                ShortName: "New Address",
            };
        $scope.Address.push(item);
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
            var successresult = (JSON.parse(data)).Result;
            if (data != "One or more errors occurred.") {
                for (var i = 0; i < successresult.length; i++) {
                    $scope.Address.push(successresult[i]);
                }
            }
            AllAddress = $scope.Address;
        });

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
                
                $scope.Country = (JSON.parse(data));

                $http({
                    method: 'GET',
                    url: '/User/Home/Division',
                    //data: $scope.SelectedCountry.CountryCode,
                    headers: {
                        'RequestVerificationToken': $scope.antiForgeryToken
                    }
                }).success(function (data, status, headers, config) {
                    $scope.message = '';
                    $scope.States = JSON.parse(data);
                }).error(function (data, status, headers, config) {
                    $scope.message = 'Unexpected Error';
                });
                //  $scope.message = 'Login Successfully';
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });

       

        $scope.GetAddressValue = function (address) {
            var addressType = $scope.pickupRequest.AddressType;
            if (addressType == "0") {
                $scope.pickupRequest.ContactName = null
                $scope.pickupRequest.Phone = null
                $scope.pickupRequest.AddressType = $scope.pickupRequest.AddressType
                $scope.pickupRequest.Address1 = null
                $scope.pickupRequest.Address2 = null
                $scope.pickupRequest.City = null
                $scope.pickupRequest.ZipCode = null
                $scope.pickupRequest.CountryId = null;
                $scope.pickupRequest.Division = null;
                $scope.pickupRequest.PickupFrom = $scope.pickupRequest.PickupFrom;
                $scope.pickupRequest.isDisabled = false;
                return;
            }

            for (var i = 0; i < AllAddress.length; i++) {
                if (AllAddress[i].Id == addressType) {
                    selectedAddress = AllAddress[i]
                    break;
                }
            }

            $scope.pickupRequest.ContactName = selectedAddress.Name;
            $scope.pickupRequest.Phone = selectedAddress.Phone1;
            $scope.pickupRequest.Address1 = selectedAddress.Address1;
            $scope.pickupRequest.Address2 = selectedAddress.Address2;
            $scope.pickupRequest.City = selectedAddress.City;
            $scope.pickupRequest.ZipCode = selectedAddress.PostalCode;
            $scope.pickupRequest.CountryId = selectedAddress.CountryId;
            $scope.pickupRequest.Division = selectedAddress.Division;

            $scope.pickupRequest.PickupFrom = $scope.pickupRequest.PickupFrom;
            $scope.pickupRequest.isDisabled = true;
            $scope.$apply();

            $("#CountryId").find('option[value=' + selectedAddress.CountryId + ']').attr('selected', 'selected');

            $("#Division").find('option[label=' + selectedAddress.Division + ']').attr('selected', 'selected');

            //var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number($scope.pickupRequest.CountryId); })[0];
            //$scope.pickupRequest.Country = countryfiltered.Name;
            //$scope.pickupRequest.CountryCode = countryfiltered.Code;
            $scope.SetCountryAndCode();
        }

        $scope.SetCountryAndCode = function ()
        {
            var countryfiltered = $filter('filter')($scope.Country, function (d) { return d.Id === Number($scope.pickupRequest.CountryId); })[0];
            $scope.pickupRequest.Country = countryfiltered.Name;
            $scope.pickupRequest.CountryCode = countryfiltered.Code;
        }

        //Cut above
        //Ends here getting country detail

        $scope.Carriers = { Data: [{ Id: 1, Name: 'DHL' }, { Id: 2, Name: 'Endicia' }, { Id: 3, Name: 'UPS' }] };

        $scope.Pieces = {
            Data: [{ Id: 1, Name: '1' },
                { Id: 2, Name: '2' },
                { Id: 3, Name: '3' },
                { Id: 4, Name: '4' },
                { Id: 5, Name: '5' },
                { Id: 6, Name: '6' },
                { Id: 7, Name: '7' },
                { Id: 8, Name: '8' },
                { Id: 9, Name: '9' },
                { Id: 10, Name: '10' },
                { Id: 11, Name: '11' },
                { Id: 12, Name: '12' },
                { Id: 13, Name: '13' },
                { Id: 14, Name: '14' },
                { Id: 15, Name: '15' },
                { Id: 16, Name: '16' },
                { Id: 17, Name: '17' },
                { Id: 18, Name: '18' },
                { Id: 19, Name: '19' },
                { Id: 20, Name: '20' },

            ], selectedOption: { Id: 1, Name: '1' }
        };

        $scope.Destination = { Data: [{ Id: 1, Name: 'Domestic' }, { Id: 2, Name: 'International' }, { Id: 3, Name: 'International multiple packages with mixed destinations' }], selectedOption: { Id: 1, Name: 'Domestic' } };
        $scope.PickupAgent = { Data: [{ Id: 0, Name: 'Select...' }, { Id: 1, Name: 'DHL' }, { Id: 2, Name: 'Endicia' }, { Id: 3, Name: 'FedEx' }], selectedOption: { Id: 0, Name: 'Select...' } };
        $scope.PickupType = { Data: [{ Id: 0, Name: 'Package' }, { Id: 1, Name: 'Finance' }], selectedOption: { Id: 0, Name: 'Package' } };
        //HTTP REQUEST BELOW

        //Getting selected Country Code and Country Name
        $scope.GetValue = function () {
            //Getting States list using HTTP Request from controller
            $scope.SetCountryAndCode();
            $http({
                method: 'GET',
                url: '/User/Home/State',
                //data: $scope.SelectedCountry.CountryCode,
                params: { countryId: $scope.pickupRequest.CountryId },
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
        $scope.pickupRequest.notification.push($scope.notification);
        $scope.valResult = {};
        $scope.sendForm = function () {

            var unregisterValidatorWatch =
           $scope.$watch(function () { return $scope.pickupRequest; },
                        function () {
                            $scope.valResult = pickupValidator.validate($scope.pickupRequest);
                            if ($scope.pickupRequest.$isValid)
                                unregisterValidatorWatch();
                        }, true);

            
            
            if ($scope.PickupForm.$valid) {
                $http({
                    url: '/Shipment/PickupRequest',
                    method: "POST",
                    data: JSON.stringify($scope.pickupRequest),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $scope.message = data;
                        $("#divfrm").hide();
                        $("#divbtn").hide();
                        //alert(data);
                        //window.location.href = "/User/Home/ViewAddress";
                    }).error(function (data, status, headers, config) {
                        
                    });
            }
            if ($scope.PickupForm.$invalid) { $scope.message = "Please check required fields." }
        };

        $("#contactName").blur(function () {
            $("#pickupfrom").val($("#contactName").val());
            $scope.pickupRequest.PickupFrom = $("#contactName").val();
            $scope.$apply();
        });

        $scope.CheckTime = function (readyTime, lastTime) {
            var rth, lth, rtm, ltm;

            rth = parseInt(readyTime);

            lth = parseInt(lastTime);

            if (rth > lth) {
                return true;
            }
            else {
                return false;
            }
        }


        
    });
})();
