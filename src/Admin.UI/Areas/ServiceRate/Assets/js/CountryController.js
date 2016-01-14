(function () {
    var app = angular.module('mainApp');
   
    app.controller('CountryController', function ($scope, $http, $location, $filter) {
        $scope.submitCountryForm = function ()
        {
            
            if ($scope.CountryForm.$valid) {
                //$("#veil").show();
                //$("#feedLoading").show();
                $http({
                    url: '/ServiceRate/Country',
                    method: "POST",
                    data: JSON.stringify($scope.Country),
                    contentType: "application/json;",
                    dataType: "json"
                })
                    .success(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        $scope.message = data;
                    }).error(function (data, status, headers, config) {
                        $("#veil").hide();
                        $("#feedLoading").hide();
                        bootbox.dialog({
                            message: data,
                            buttons: {
                                "success": {
                                    "label": "OK",
                                    "className": "btn-sm btn-primary"
                                }
                            }
                        });
                    });
            }
        }
       
        //Editing of country working here
        if ($location.absUrl().split("?").length > 1) {
            $("#veil").show();
            $("#feedLoading").show();
            var selectedCountry = [];
            var Id = $location.absUrl().split("/");
            var editdata = Id[5];
            var editrow = editdata.split("?");
            $http({
                method: 'GET',
                url: '/ServiceRate/Home/GetAllCountries',
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
                    var selectedCountry = $filter('filter')(data, function (d) { return d.Id == editrow[1] })[0];
                    $scope.bindCountry(selectedCountry);
                    $("#veil").hide();
                    $("#feedLoading").hide();
                }
            }).error(function (data, status, headers, config) {
                $scope.message = 'Unexpected Error';
            });
        }
        //Edit ends here
        $scope.bindCountry = function (country) {
            $scope.Country.Id = country.Id;
            $scope.Country.Name = country.Name;
            $scope.Country.ISOCode = country.ISOCode;
            $scope.Country.TopLevelDomain = country.TopLevelDomain;
            $scope.Country.DialingCode = country.DialingCode;
            $scope.Country.Delivery = country.Delivery;
            $scope.Country.Membership = country.Membership;
            $scope.Country.TimeZone = country.TimeZone;
            $scope.Country.Status = country.Status;
            $scope.Country.SecurityCharge = country.SecurityCharge;
            $scope.$apply();

            $("#Delivery").find('option[value=' + country.Delivery+ ']').attr('selected', 'selected');
            $("#Membership").find('option[value=' + country.Membership+ ']').attr('selected', 'selected');
            //$("#TimeZone").find('option[value=' + country.TimeZone+ ']').attr('selected', 'selected');
            $("#Status").find('option[value=' + country.Status+ ']').attr('selected', 'selected');
            $("#SecurityCharge").find('option[value=' + country.SecurityCharge + ']').attr('selected', 'selected');
        }
    })})();