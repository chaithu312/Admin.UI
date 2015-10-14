
(function () {
    var validationApp = angular.module('mainApp');
    // create angular controller
    validationApp.controller('ViewAddressController', function ($scope, $http) {

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
                $scope.Users = JSON.parse(data);
                var grid_data = $scope.Users.Result;
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
                        colNames: ['Id', 'FirstName', 'LastName', 'Phone1', 'EMail', 'Division', 'City','Edit'],
                        colModel: [
                            //{
                            //    name: 'myac', index: '', width: 80, fixed: true, sortable: false, resize: false,
                            //    formatter: 'actions',
                            //    formatoptions: {
                            //        keys: true,
                            //        delbutton: false,//disable delete button
                            //       // delOptions: { recreateForm: true, beforeShowForm: beforeDeleteCallback },
                            //        //editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
                            //    }
                            //},
                            { name: 'Id', index: 'Id', width: 30, editable: true,sortable:false },
                            { name: 'FirstName', index: 'FirstName', width: 130, editable: true },
                            { name: 'LastName', index: 'LastName', width: 130, editable: true },
                            { name: 'Phone1', index: 'Phone1', width: 130, editable: true, editoptions: { size: "20", maxlength: "30" } },
                            { name: 'EMail', index: 'EMail', width: 180, editable: true },
                            { name: 'Division', index: 'Division', width: 130, editable: true},
                            { name: 'City', index: 'City', width: 130, editoptions: { rows: "2", cols: "10" } },
                            { name: 'Edit', formatter: function (cellvalue, options, rowObject) {
                                return '<a href="#' + $(grid_selector).getCell(Id) + '">' + "Edit" + '</a>';
                            } }
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
                        caption: "Address Listing"

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
                    ).navButtonAdd(pager_selector, {
                        caption: "",
                        buttonicon: "ui-icon ui-icon-trash",
                       
                        onClickButton: function () {
                            
                            if (selectedRow == null)
                                alert('Please select row to delete');
                            else {
                                if (confirm("Are you sure to delete?")) {
                                    var selectedIds = "";
                                    for (i = 1; i <= selectedRow.length; i++) {
                                        
                                        selectedIds += (selectedRow[i - 1].childNodes)[1].innerHTML+",";
                                    }
                                    //alert("Deleting Row Id :" + selectedRow.Id);
                                    $http({
                                        url: '/User/Home/DeleteAddress',
                                        method: "GET",
                                        params: { selectedIds: selectedIds },
                                        contentType: "application/json;",
                                        dataType: "json"
                                    })
                                  .success(function (data, status, headers, config) {
                                      //deletingRow.remove();
                                      $(grid_selector).find('tr[class*="ui-state-highlight"]').remove();
                                      alert(data);

                                  }).error(function (data, status, headers, config) {
                                  });
                                }
                                else { }

                            }
                        },
                        position: "last",
                        id:"cusDelete"
                    });
                });
                //Ending binding of jqGrid
                jQuery("#grid-table").jqGrid('hideCol', ["Id"]);
            }
        }).error(function (data, status, headers, config) {
            $scope.message = 'Unexpected Error';
        });



      

    });
    
})();