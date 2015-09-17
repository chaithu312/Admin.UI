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
            $.ajax({
                url: 'http://192.168.1.241/shipping/dhl/pickup',
                async: false,
                type: "POST",
                dataType: "json",
                data: $scope.PickupRequest,
                success: function (result) {
                    JSON.parse(result);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr);
                }
            })
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