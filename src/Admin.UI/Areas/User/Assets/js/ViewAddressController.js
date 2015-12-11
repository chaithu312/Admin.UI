(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewAddressController', function ($scope, $http, virtualDir) {
        $scope.message = '';

        $scope.myCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td:eq(2)', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.someClickHandler(aData);
                });
            });
            return nRow;
        };

        $scope.someClickHandler = function (info) {
            $scope.message = 'clicked: ' + info.price;
        };

        $scope.columnDefs = [{
            "mDataProp": "Name",
            "aTargets": [0]
        }, {
            "mDataProp": "Address1",
            "aTargets": [1]
        }, {
            "mDataProp": "City",
            "aTargets": [2]
        }, {
            "mDataProp": "Division",
            "aTargets": [3]
        }, {
            "mDataProp": "PostalCode",
            "aTargets": [4]
        }, {
            "mDataProp": "Phone1",
            "aTargets": [5]
        }, {
            "mDataProp": "EMail",
            "aTargets": [6]
        }, {
            "mDataProp": "AddressType",
            "aTargets": [7]
        }, {
            "mDataProp": "Status",
            "aTargets": [8]
        }];

        $scope.overrideOptions = {
            "bStateSave": true,
            "iCookieDuration": 2419200,
            /* 1 month */
            "bJQueryUI": true,
            "bPaginate": true,
            "bLengthChange": false,
            "bFilter": true,
            "bInfo": true,
            "bDestroy": true
        };

        $http({
            method: 'GET',
            url: virtualDir.AdminURL + '/User/Home/GetAllAddress',
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
                $scope.datasrc = JSON.parse(data).Result;
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });

        //$scope.sampleProductCategories = [{ "Id": 12, "AccountId": 2, "AddressType": 0, "ShortName": "BR-IND", "Name": "Sumit Validate", "Contact": null, "Phone1": "1232123478", "Phone2": "1232123478", "Fax": null, "EMail": "mr.shashikan@gmail.com", "Address1": "Ghaziabad India", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Texas", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-12-02T19:12:22.617", "Status": 1, "Account": null, "Claims": null }, { "Id": 13, "AccountId": 2, "AddressType": 0, "ShortName": "BR-IND", "Name": "Sumit Singh", "Contact": null, "Phone1": "1232123478", "Phone2": "1232123478", "Fax": null, "EMail": "mr.shashikan@gmail.com", "Address1": "Ghaziabad India", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Tennessee", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-12-03T20:04:30.133", "Status": 1, "Account": null, "Claims": null }, { "Id": 14, "AccountId": 2, "AddressType": 0, "ShortName": "BR-IND", "Name": "Sumit Kant", "Contact": null, "Phone1": "1232123478", "Phone2": "1232123478", "Fax": null, "EMail": "mr.shashikan@gmail.com", "Address1": "Ghaziabad India", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Georgia", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-12-03T18:17:36.64", "Status": 1, "Account": null, "Claims": null }, { "Id": 1, "AccountId": 2, "AddressType": 0, "ShortName": "New Caption", "Name": "Shashikant Pandit", "Contact": null, "Phone1": "2345678901", "Phone2": null, "Fax": null, "EMail": null, "Address1": "707 N 90th street", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Texas", "PostalCode": "75287", "CountryId": 840, "Detail": null, "Created": "2015-10-29T13:48:04.113", "Status": 1, "Account": null, "Claims": null }, { "Id": 4, "AccountId": 2, "AddressType": 0, "ShortName": "PanditJi", "Name": "Sumit Pandit", "Contact": null, "Phone1": "9015", "Phone2": "1232123478", "Fax": null, "EMail": "spandit@ishir.com", "Address1": "707 N 90th street", "Address2": null, "Address3": null, "City": "Noida", "Division": "Kentucky", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-11-16T04:37:23.727", "Status": 1, "Account": null, "Claims": null }, { "Id": 5, "AccountId": 2, "AddressType": 0, "ShortName": "PanditJi", "Name": " ", "Contact": null, "Phone1": "45454545454545", "Phone2": "1232123478", "Fax": null, "EMail": "spandit@ishir.com", "Address1": "707 N 90th street", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Idaho", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-11-16T04:45:21.82", "Status": 1, "Account": null, "Claims": null }, { "Id": 6, "AccountId": 2, "AddressType": 0, "ShortName": "PanditJi", "Name": " ", "Contact": null, "Phone1": null, "Phone2": "1232123478", "Fax": null, "EMail": "mr.shashikan@gmail.com", "Address1": "707 N 90th street", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Kansas", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-11-16T04:48:26.023", "Status": 1, "Account": null, "Claims": null }, { "Id": 7, "AccountId": 2, "AddressType": 0, "ShortName": "PanditJi", "Name": " ", "Contact": null, "Phone1": "1232123478", "Phone2": "1232123478", "Fax": null, "EMail": "mr.shashikan@gmail.com", "Address1": "707 N 90th street", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Alaska", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-11-16T04:50:09.4", "Status": 1, "Account": null, "Claims": null }, { "Id": 8, "AccountId": 2, "AddressType": 0, "ShortName": "PanditJi", "Name": " ", "Contact": null, "Phone1": "9015", "Phone2": "1232123478", "Fax": null, "EMail": "mr.shashikan@gmail.com", "Address1": "707 N 90th street", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Arizona", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-11-16T04:54:08.4", "Status": 1, "Account": null, "Claims": null }, { "Id": 9, "AccountId": 2, "AddressType": 0, "ShortName": "PanditJi", "Name": "Sumit Pandit", "Contact": null, "Phone1": "123212", "Phone2": null, "Fax": null, "EMail": "spandit@ishir.com", "Address1": "707 N 90th street", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Texas", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-11-16T05:06:17.4", "Status": 1, "Account": null, "Claims": null }, { "Id": 11, "AccountId": 2, "AddressType": 0, "ShortName": "PanditJi", "Name": "Sumit Pandit", "Contact": null, "Phone1": "1232123478", "Phone2": "1232123478", "Fax": null, "EMail": "mr.shashikan@gmail.com", "Address1": "Ghaziabad India", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Texas", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-12-02T18:48:26.31", "Status": 1, "Account": null, "Claims": null }, { "Id": 3, "AccountId": 2, "AddressType": 0, "ShortName": "Shipper Pandit", "Name": "Shashikant Pandit", "Contact": null, "Phone1": "9015658982", "Phone2": null, "Fax": null, "EMail": "mr.shashikan@gmail.com", "Address1": "707 N 90th street", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Texas", "PostalCode": "85281", "CountryId": 840, "Detail": null, "Created": "2015-11-16T03:00:04.553", "Status": 1, "Account": null, "Claims": null }, { "Id": 10011, "AccountId": 2, "AddressType": 0, "ShortName": "test", "Name": "teste test", "Contact": null, "Phone1": "12312312", "Phone2": null, "Fax": null, "EMail": "asdf@asd.com", "Address1": "adsf", "Address2": "asdf", "Address3": null, "City": "asdf", "Division": "Kansas", "PostalCode": "12323", "CountryId": 840, "Detail": null, "Created": "2015-12-10T05:52:14.457", "Status": 1, "Account": null, "Claims": null }, { "Id": 2, "AccountId": 2, "AddressType": 0, "ShortName": "UPS Caption", "Name": "Shashikant Pandit", "Contact": null, "Phone1": "9015658982", "Phone2": null, "Fax": null, "EMail": null, "Address1": "707 N 90th street", "Address2": null, "Address3": null, "City": "Dallas", "Division": "Texas", "PostalCode": "75287", "CountryId": 840, "Detail": null, "Created": "2015-10-29T15:11:20.037", "Status": 1, "Account": null, "Claims": null }];
    });
})();