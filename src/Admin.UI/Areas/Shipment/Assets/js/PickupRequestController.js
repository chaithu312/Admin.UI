(function () {
    var app = angular.module('mainApp')
    app.controller('PickupRequestController', function ($scope, $http) {
        $scope.Contacts = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Account 1' }, { Id: 2, Name: 'Account 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };
        $scope.Addresses = { Data: [{ Id: 0, Name: 'Select an account...' }, { Id: 1, Name: 'Address 1' }, { Id: 2, Name: 'Address 2' }], selectedOption: { Id: 0, Name: 'Select an account...' } };
        $scope.States = { Data: [{ Id: 1, Name: 'Address 1' }, { Id: 2, Name: 'Address 2' }] };
        $scope.Countries = { Data: [{ Id: 1, Name: 'Country 1' }, { Id: 2, Name: 'Country 2' }] };
        $scope.Carriers = { Data: [{ Id: 1, Name: 'DHL' }, { Id: 2, Name: 'Endicia' }] };

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

        $scope.Destination = { Data: [{ Id: 1, Name: 'Domestic' }, { Id: 2, Name: 'International' }], selectedOption: { Id: 1, Name: 'Domestic' } };
        $scope.PickupAgent = { Data: [{ Id: 0, Name: 'Select...' }, { Id: 1, Name: 'DHL' }, { Id: 2, Name: 'Endicia' }, { Id: 3, Name: 'FedEx' }], selectedOption: { Id: 0, Name: 'Select...' } };
        $scope.PickupType = { Data: [{ Id: 0, Name: 'Package' }, { Id: 1, Name: 'Finance' }], selectedOption: { Id: 0, Name: 'Package' } };

        $scope.sendForm = function () {
            $scope.PickupRequestData = {
                data: [{
                    UseShipperAddress: 'false', Address: {
                        Department: null, FirstName: $scope.PickupRequest.FirstName,
                        MiddleName: null,
                        LastName: $scope.PickupRequest.LastName,
                        NamePrefix: null,
                        NamePostfix: null,
                        Name: $scope.PickupRequest.FirstName + ' ' + $scope.PickupRequest.LastName,
                        Phone: $scope.PickupRequest.Phone,
                        EMail: $scope.PickupRequest.EMail,
                        Address1: $scope.PickupRequest.Address1,
                        Address2: $scope.PickupRequest.Address2,
                        Address3: $scope.PickupRequest.Address3,
                        City: $scope.PickupRequest.City,
                        PostalCode: $scope.PickupRequest.PostalCode,
                        DivisionName: $scope.PickupRequest.Division,
                        DivisionCode: $scope.PickupRequest.DivisionCode,
                        CountryName: $scope.PickupRequest.CountryName,
                        CountryCode: $scope.PickupRequest.CountryCode,
                        Division: null,
                        State: $scope.PickupRequest.State,
                        IsResidential: $scope.PickupRequest.IsResidential,
                        IsRemoteArea: $scope.PickupRequest.IsRemoteArea,
                        LocationType: "B",
                        PackageLocation: $scope.PickupRequest.PackageLocation
                    },
                    ReadyBy: '0001-01-01T00:00:00',
                    NoLaterThan: '0001-01-01T00:00:00',
                    Instructions: null,
                    IsHeavy: $scope.PickupRequest.IsHeavy,
                    IsBulky: $scope.PickupRequest.IsBulky,
                    ConfirmationNumber: null,
                    OriginSvcArea: null,
                    CancelReason: null,
                    RegionCode: $scope.PickupRequest.RegionCode,
                    RequestorName: $scope.PickupRequest.FirstName + ' ' + $scope.PickupRequest.LastName,
                    RequestorAccountType: 'D',
                    RequestorPhone: $scope.PickupRequest.Phone,
                    AccountType: 'D',
                    RequestorAccountNumber: '803921577',
                    Date: $scope.PickupRequest.Date,
                    ReadyByTime: $scope.PickupRequest.ReadyByTime,
                    CloseTime: $scope.PickupRequest.CloseTime,
                    Weight: 10,
                    WeightUnit: 'L',
                    AWBNumber: '7520067111',
                }]
            };

            $http({
                method: 'POST',

                url: '192.168.1.241/shipping/dhl/pickup',
                data: $scope.PickupRequestData,
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
                    $scope.message = 'Saved Successfully';
                    $scope.person = {};
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });

            //$.ajax({
            //    url: '/Shipment/PickupRequest',
            //    async: false,
            //    type: "POST",
            //    dataType: "json",
            //    data: $scope.PickupRequest,
            //    success: function (result) {
            //        JSON.parse(result);
            //    },
            //    error: function (xhr, ajaxOptions, thrownError) {
            //        console.log(xhr);
            //    }
            //})
        };

        //$scope.sendForm = function () {
        //    $http({
        //        method: 'POST',

        //        url: '/Shipment/PickupRequest',
        //        data: $scope.person,
        //        headers: {
        //            'RequestVerificationToken': $scope.antiForgeryToken
        //        }
        //    }).success(function (data, status, headers, config) {
        //        $scope.message = '';
        //        if (data.success == false) {
        //            var str = '';
        //            for (var error in data.errors) {
        //                str += data.errors[error] + '\n';
        //            }
        //            $scope.message = str;
        //        }
        //        else {
        //            $scope.message = 'Saved Successfully';
        //            $scope.person = {};
        //        }
        //    }).error(function (data, status, headers, config) {
        //        $scope.message = 'Unexpected Error';
        //    });
        //};
    });
})();