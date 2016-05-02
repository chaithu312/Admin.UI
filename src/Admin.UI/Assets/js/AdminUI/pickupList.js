jQuery(function ($) {
    //initiate dataTables plugin

    var columns = [
        {
            data: null,
            render: function (data, type, row) {
                return '<input type="checkbox" id="' + row["PickupId"] + '" />';
            },
            className: "dt-body-center",
            width: 60,
            "searchable": false,
            "orderable": false
        },
        { data: "ContactName", width: 120 },
        { data: "Phone", width: 120 },
        { data: "Email", width: 90 },
        {
            data: "Address1", width: 150, render: function (data, type, row) {
                return data + '</br>' + row["Address2"] + row["Address3"];
            }
        },
        { data: "City", width: 120 },
        { data: "Division", width: 120 },
        {
            data: "ReadyTime", width: 150, render: function (data, type, row) {
                var pickupDate = new Date(data);
                return pickupDate;
            }
        },
        {
            data: "Status",
            width: 60,
            render: function (data, type, row) {
                switch (data) {
                    case 'Unconfirmed':
                    case 'Cancelled':
                    case 'Missed':
                        return '<span class="label label-sm label-danger">' + data + '</span>';
                    case 'New':
                    case 'Updated':
                    case 'Schedule_Acknowledged':
                    case 'New_Acknowledged':
                    case 'Picked_Up':
                        return '<span class="label label-sm label-success">' + data + '</span>';
                    case 'Cancelled_Acknowledged':
                        return '<span class="label label-sm label-warning">' + data + '</span>';
                    default:
                        return '<span class="label label-sm label-inverse arrowed-in">' + data + '</span>';
                }
            }
        },
         {
             data: null, width: 120, render: function (data, type, row) {
                 return '<a class="btn btn-xs btn-info" href="/Pickup/' + row["PickupId"] + '"><i class="ace-icon fa fa-pencil bigger-110"></i>' +
                        '</a> <a class="btn btn-xs btn-danger"><i class="ace-icon fa fa-trash-o bigger-120"></i></a>';
             },
             "searchable": false,
             "orderable": false
         }
    ];

    var listUrl = "/Pickup/GetData";
    var sortBy = columns.map((el) => el.data).indexOf("ReadyTime");
    var sortDir = "desc";

    var oTable1 = $("#dynamic-table").DataTable({
        ajax: { url: listUrl, dataSrc: "" },
        order: [[sortBy, sortDir]],

        pageLength: 25,
        columns: columns
    });

    TableTools.classes.container = "btn-group btn-overlap";
    TableTools.classes.print = {
        "body": "DTTT_Print",
        "info": "tableTools-alert gritter-item-wrapper gritter-info gritter-center white",
        "message": "tableTools-print-navbar"
    }

    //initiate TableTools extension
    var tableTools_obj = new $.fn.dataTable.TableTools(oTable1, {
        "sSwfPath": "../lib/datatables-tabletools/swf/copy_csv_xls_pdf.swf",

        "sRowSelector": "td:not(:last-child)",
        "sRowSelect": "multi",
        "fnRowSelected": function (row) {
            //check checkbox when row is selected
            try { $(row).find('input[type=checkbox]').get(0).checked = true }
            catch (e) { }
        },
        "fnRowDeselected": function (row) {
            //uncheck checkbox
            try { $(row).find('input[type=checkbox]').get(0).checked = false }
            catch (e) { }
        },

        "sSelectedClass": "success",
        "aButtons": [
            {
                "sExtends": "copy",
                "sToolTip": "Copy to clipboard",
                "sButtonClass": "btn btn-white btn-primary btn-bold",
                "sButtonText": "<i class='fa fa-copy bigger-110 pink'></i>",
                "fnComplete": function () {
                    this.fnInfo('<h3 class="no-margin-top smaller">Table copied</h3>\
									<p>Copied '+ (oTable1.fnSettings().fnRecordsTotal()) + ' row(s) to the clipboard.</p>',
                        1500
                    );
                }
            },

            {
                "sExtends": "csv",
                "sToolTip": "Export to CSV",
                "sButtonClass": "btn btn-white btn-primary  btn-bold",
                "sButtonText": "<i class='fa fa-file-excel-o bigger-110 green'></i>"
            },

            {
                "sExtends": "pdf",
                "sToolTip": "Export to PDF",
                "sButtonClass": "btn btn-white btn-primary  btn-bold",
                "sButtonText": "<i class='fa fa-file-pdf-o bigger-110 red'></i>"
            },

            {
                "sExtends": "print",
                "sToolTip": "Print view",
                "sButtonClass": "btn btn-white btn-primary  btn-bold",
                "sButtonText": "<i class='fa fa-print bigger-110 grey'></i>",
                "sMessage": "<div class='navbar navbar-default'><div class='navbar-header pull-left'><a class='navbar-brand' href='#'><small>Optional Navbar &amp; Text</small></a></div></div>",
                "sInfo": "<h3 class='no-margin-top'>Print view</h3>\ <p>Please use your browser's print function to\ print this table.\ <br />Press <b>escape</b> when finished.</p>"
            }
        ]
    });
    //we put a container before our table and append TableTools element to it
    $(tableTools_obj.fnContainer()).appendTo($('.tableTools-container'));

    //also add tooltips to table tools buttons
    //addding tooltips directly to "A" buttons results in buttons disappearing (weired! don't know why!)
    //so we add tooltips to the "DIV" child after it becomes inserted
    //flash objects inside table tools buttons are inserted with some delay (100ms) (for some reason)
    setTimeout(function () {
        $(tableTools_obj.fnContainer()).find('a.DTTT_button').each(function () {
            var div = $(this).find('> div');
            if (div.length > 0) div.tooltip({ container: 'body' });
            else $(this).tooltip({ container: 'body' });
        });
    }, 200);

    /////////////////////////////////
    //table checkboxes
    $('th input[type=checkbox], td input[type=checkbox]').prop('checked', false);

    //select/deselect all rows according to table header checkbox
    $('#dynamic-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function () {
        var th_checked = this.checked;//checkbox inside "TH" table header

        $(this).closest('table').find('tbody > tr').each(function () {
            var row = this;
            if (th_checked) tableTools_obj.fnSelect(row);
            else tableTools_obj.fnDeselect(row);
        });
    });

    //select/deselect a row when the checkbox is checked/unchecked
    $('#dynamic-table').on('click', 'td input[type=checkbox]', function () {
        var row = $(this).closest('tr').get(0);
        if (!this.checked) tableTools_obj.fnSelect(row);
        else tableTools_obj.fnDeselect($(this).closest('tr').get(0));
    });

    $(document).on('click', '#dynamic-table .dropdown-toggle', function (e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
    });
});