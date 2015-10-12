
(function () {
    var app = angular.module('mainApp');
    // create angular controller
    app.controller('ViewPickupController', function ($scope, $http) {

        $http({
            method: 'GET',
            url: '/Shipment/Home/GetAllPickup',
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
                $scope.Users = data;
                //$scope.Users = [{ Id: 2, FirstName: "SHASHIKANT", LastName: "Pandit", Phone1: "", EMail: "", Division: "", City: "" }
                //, { Id: 4, FirstName: "SHASHIKANT", LastName: "Pandit", Phone1: "", EMail: "", Division: "", City: "" }];
                //Starting binding of jqGrid
                var grid_data = $scope.Users;
                if ($scope.Users.length == 0)
                    $scope.message = "No records to view";

                jQuery(function ($) {
                    var grid_selector = "#grid-table";
                    var pager_selector = "#grid-pager";

                    //resize to fit page size
                    $(window).on('resize.jqGrid', function () {
                        $(grid_selector).jqGrid('setGridWidth', $(".page-content").width());
                    })
                    //resize on sidebar collapse/expand
                    var parent_column = $(grid_selector).closest('[class*="col-"]');
                    $(document).on('settings.ace.jqGrid', function (ev, event_name, collapsed) {
                        if (event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed') {
                            //setTimeout is for webkit only to give time for DOM changes and then redraw!!!
                            setTimeout(function () {
                                $(grid_selector).jqGrid('setGridWidth', parent_column.width());
                            }, 0);
                        }
                    })
                    var selectedRow = null;
                    //var deletingRow = null;
                    jQuery(grid_selector).jqGrid({
                        //direction: "rtl",

                        data: grid_data,
                        datatype: "local",
                        height: 350,
                        //colNames: [' ', 'ID', 'Last Sales', 'Name', 'Stock', 'Ship via', 'Notes'],
                        colNames: ['Id', 'Detail', 'Confirmation', 'Destination', 'Status', 'Created'],
                        colModel: [

                            { name: 'Id', index: 'Id', width: 30, editable: true, sortable: false },
                            { name: 'Detail', index: 'Detail', width: 130, editable: true },
                            { name: 'Confirmation', index: 'Confirmation', width: 170, editable: true },
                            { name: 'Destination', index: 'Destination', width: 170, editable: true },
                            { name: 'Status', index: 'Status', width: 180, editable: true },
                            { name: 'Created', index: 'Created', width: 180, editable: true },
                        ],
                        onSelectRow: function (id) {
                            var data = null;
                            data = $(grid_selector).find('tr[class*="ui-state-highlight"]');
                            //deletingRow = this.rows[id];
                            //var row = $(this).getLocalRow(id);
                            ////selectedRow = row;
                            selectedRow = data;
                        },
                        viewrecords: true,
                        rowNum: 10,
                        rowList: [10, 20, 30],
                        pager: pager_selector,
                        altRows: true,

                        //toppager: true,

                        multiselect: true,
                        //multikey: "ctrlKey",
                        multiboxonly: true,

                        loadComplete: function () {
                            var table = this;
                            setTimeout(function () {
                                styleCheckbox(table);

                                updateActionIcons(table);
                                updatePagerIcons(table);
                                enableTooltips(table);
                            }, 0);
                        },

                        editurl: "/dummy.html",//nothing is saved
                        caption: "Pickup Listing"

                        //,autowidth: true,


                        /**
                        ,
                        grouping:true,
                        groupingView : {
                             groupField : ['name'],
                             groupDataSorted : true,
                             plusicon : 'fa fa-chevron-down bigger-110',
                             minusicon : 'fa fa-chevron-up bigger-110'
                        },
                        caption: "Grouping"
                        */

                    });
                    $(window).triggerHandler('resize.jqGrid');//trigger window resize to make the grid get the correct size



                    //enable search/filter toolbar
                    //jQuery(grid_selector).jqGrid('filterToolbar',{defaultSearch:true,stringResult:true})
                    //jQuery(grid_selector).filterToolbar({});


                    //switch element when editing inline
                    function aceSwitch(cellvalue, options, cell) {
                        setTimeout(function () {
                            $(cell).find('input[type=checkbox]')
                                .addClass('ace ace-switch ace-switch-5')
                                .after('<span class="lbl"></span>');
                        }, 0);
                    }
                    //enable datepicker
                    function pickDate(cellvalue, options, cell) {
                        setTimeout(function () {
                            $(cell).find('input[type=text]')
                                    .datepicker({ format: 'yyyy-mm-dd', autoclose: true });
                        }, 0);
                    }


                    //navButtons
                    jQuery(grid_selector).jqGrid('navGrid', pager_selector,
                        { 	//navbar options
                            edit: false,
                            editicon: 'ace-icon fa fa-pencil blue',
                            add: true,
                            addicon: 'ace-icon fa fa-plus-circle purple',
                            del: false,
                            delicon: 'ace-icon fa fa-trash-o red',
                            search: true,
                            searchicon: 'ace-icon fa fa-search orange',
                            refresh: true,
                            refreshicon: 'ace-icon fa fa-refresh green',
                            view: true,
                            viewicon: 'ace-icon fa fa-search-plus grey',
                        },
                        {
                            //edit record form
                            //closeAfterEdit: true,
                            //width: 700,
                            recreateForm: true,
                            beforeShowForm: function (e) {
                                var form = $(e[0]);
                                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                                style_edit_form(form);
                            }
                        },
                        {
                            //new record form
                            //width: 700,
                            closeAfterAdd: true,
                            recreateForm: true,
                            viewPagerButtons: false,
                            beforeShowForm: function (e) {
                                var form = $(e[0]);
                                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar')
                                .wrapInner('<div class="widget-header" />')
                                style_edit_form(form);
                            }
                        },
                        {
                            //delete record form
                            recreateForm: true,
                            beforeShowForm: function (e) {
                                var form = $(e[0]);
                                if (form.data('styled')) return false;

                                form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
                                style_delete_form(form);

                                form.data('styled', true);
                            },
                            onClick: function (e) {

                                //alert(1);
                            }
                        },
                        {
                            //search form
                            recreateForm: true,
                            afterShowSearch: function (e) {
                                var form = $(e[0]);
                                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
                                style_search_form(form);
                            },
                            afterRedraw: function () {
                                style_search_filters($(this));
                            }
                            ,
                            multipleSearch: true,
                            /**
                            multipleGroup:true,
                            showQuery: true
                            */
                        },
                        {
                            //view record form
                            recreateForm: true,
                            beforeShowForm: function (e) {
                                var form = $(e[0]);
                                form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
                            }
                        }
                    )
                });
                //Ending binding of jqGrid
                jQuery("#grid-table").jqGrid('hideCol', ["Id"]);
                
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });





    });

})();