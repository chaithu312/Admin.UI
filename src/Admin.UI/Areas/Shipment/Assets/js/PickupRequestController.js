(function () {
    var app = angular.module('mainApp')

    app.controller('PickupRequestController', function ($scope, $http) {
        $scope.Contacts = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Account 1' }, { Id: 2, Name: 'Account 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };
        $scope.Addresses = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Address 1' }, { Id: 2, Name: 'Address 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };
        
        $scope.pickupRequest = null;
        
        $scope.pickupRequest = { ContactName: null, Phone: null, PickupFrom: null, Address1: null, Address2: null, City: null, ZipCode: null, CountryId: null, Division: null }

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
            $scope.Address = (JSON.parse(data)).Result;
            var item =
            {
                Id: 0,
                ShortName: "New Address",
            };
            $scope.Address.push(item);

        });

        $scope.GetAddressValue = function (address) {
            
            var addressType = $scope.pickupRequest.AddressType;
            if (addressType == "0")
                $scope.pickupRequest = {ContactName:null, Phone: null, AddressType: $scope.pickupRequest.AddressType, Address1: null, Address2: null, City: null, ZipCode: null, CountryId: null, Division: null ,PickupFrom:null};
            $("#contactName").removeAttr('disabled');
            $("#phone").removeAttr('disabled');

            $("#addressLine1").removeAttr('disabled');
            $("#addressLine2").removeAttr('disabled');
            $("#city").removeAttr('disabled');
            $("#CountryId").removeAttr('disabled');
            $("#zipCode").removeAttr('disabled');
            $("#Division").removeAttr('disabled');
            var ShortName = $.grep($scope.Address, function (address) {
                return address.Id == addressType;
            })[0].ShortName;
            $scope.SelectedAddress = {};
            $scope.SelectedAddress.Id = addressType;
            $scope.SelectedAddress.ShortNameName = ShortName;
            //Getting States list using HTTP Request from controller

            $http({
                method: 'GET',
                url: '/Shipment/Home/GetAddressById',
                params: { addressType: $scope.pickupRequest.AddressType },
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
                    var result = data.Result;
                    
                    //////////////////
                    $http({
                        method: 'GET',
                        url: '/User/Home/State',
                        //data: $scope.SelectedCountry.CountryCode,
                        params: { countryId: result.CountryId },
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
                    })
                    ////////////////////
                    
                    $scope.pickupRequest = {ContactName:result.FirstName+' '+result.LastName,Phone:result.Phone1,
                         AddressType: $scope.pickupRequest.AddressType,
                        Address1: result.Address1, Address2: result.Address2, City: result.City,
                        ZipCode: result.PostalCode, ReadyTime: $scope.pickupRequest.ReadyTime,
                        AvailableTime: $scope.pickupRequest.AvailableTime,
                        TotalPieces: $scope.pickupRequest.TotalPieces,
                        AdditionalsInstructions: $scope.pickupRequest.AdditionalsInstructions,
                        PickUpNotificationMobile: $scope.pickupRequest.PickUpNotificationMobile,
                        PickUpNotificationEmail: $scope.pickupRequest.PickUpNotificationEmail,
                        PickUpNotificationYourEmail: $scope.pickupRequest.PickUpNotificationYourEmail,
                        PickUpNotificationPersonalizedMessage: $scope.pickupRequest.PickUpNotificationPersonalizedMessage,
                        AddressNotes: $scope.pickupRequest.AddressNotes,
                        PickupDate: $scope.pickupRequest.PickupDate,
                    };

                    $("#contactName").attr('disabled', 'disabled');
                    $("#phone").attr('disabled', 'disabled');
                    $("#addressLine1").attr('disabled', 'disabled');
                    $("#addressLine2").attr('disabled', 'disabled');
                    $("#city").attr('disabled', 'disabled');
                    $("#CountryId").attr('disabled', 'disabled');
                    $("#zipCode").attr('disabled', 'disabled');
                    $("#Division").attr('disabled', 'disabled');
                    $("#Division").removeAttr('selected');
                    $("#CountryId").removeAttr('selected');
                    
                    $("#CountryId").find('option[value=' + result.CountryId + ']').attr('selected', 'selected');
                    $("#Division").find('option[label=' + result.Division + ']').attr('selected', 'selected');
                    $scope.pickupRequest.CountryId = result.CountryId;
                    $scope.pickupRequest.Division = result.Division;
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });

            //Ends here getting request of Http for getting states;
           
        }
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

        //Getting selected Country Code and Country Name
        $scope.GetValue = function () {
            //Getting States list using HTTP Request from controller

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

        $scope.sendForm = function () {

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
                        alert(data);
                    });
            }
            if ($scope.PickupForm.$invalid) { $scope.message = "Please check required fields (marked by *)" }
        };
       
        $("#contactName").blur(function () {

            $("#pickupfrom").val($("#contactName").val());
            $scope.pickupRequest.PickupForm = $("#contactName").val();

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