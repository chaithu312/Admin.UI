$(document).ready(function () {
    Shipment.init();
});

var Shipment = function () {
    var rowcount;
    return {
        init: function () {
            self = this;
            rowcount = $(".rowToClone").length - 1;
            self.bindevents();
        },
        bindevents: function () {
            $(document).on('click', '.btn-add-parcel', function (e) {
                e.preventDefault();
                var controlForm = this.find("table:first"),
                    currentRow = $('#0'),
                    newRow = $(currentRow.clone()).appendTo(controlForm);
                rowcount++;

                self.RenameControls(newRow);
                newRow.find('input').val('');
            });
            $(document).on('click', '.btn-remove-parcel', function (e) {
                if (rowcount !== 0) {
                    $('#' + rowcount).remove();
                    rowcount--;
                    e.preventDefault();
                    return false;
                }
                return false;
            });
        },
        RenameControls: function (newRow) {
            newRow.attr('id', rowcount);
            newRow.find('input[type=text],textarea,select').each(function () {
                var newName = '';
                var newId = $(this).attr('id').replace("0", rowcount);
                if ($(this).attr('name') !== undefined)
                    newName = $(this).attr('name').replace("0", rowcount);
                $(this).attr('id', newId);
                $(this).attr('name', newName);

                //TODO: Jquery obstructive should work here
                if (newId.match("Width$") || newId.match("Height$") || newId.match("Weight$") || newId.match("Length$") || newId.match("ItemCount$")) {
                    $(this).rules("add", {
                        required: true,
                        range: [1, 9999],
                        messages: {
                            required: "Required",
                            range: "Should be >= 1"
                        }
                    });
                }
            });
            newRow.find('span').each(function () {
                if ($(this).attr('data-valmsg-for') !== undefined) {
                    var newValMessageFor = $(this).attr('data-valmsg-for').replace("0", rowcount);
                    $(this).attr('data-valmsg-for', newValMessageFor);
                }
            });
        }
    };
}();