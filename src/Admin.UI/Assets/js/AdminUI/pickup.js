$(function () {
        var rowcount = $(".rowToClone").length - 1;

        $('#PickupDate').datepicker({
            daysOfWeekDisabled: [0, 6],
            autoclose: true,
            todayHighlight: true,
            todayBtn: 'true'
        });

        
     
    

        $('#ReadyTime').timepicker({
            minuteStep: 10,
            showSeconds: false,
            showMeridian: false
        });

        $('#AvailableUntil').timepicker({
            minuteStep: 10,
            showSeconds: false,
            showMeridian: false
        });

        $(document).on('click', '.btn-add', function (e) {
            e.preventDefault();
            alert('#' + rowcount);

            var controlForm = $('.table'),
                currentRow = $('#0'),
                newRow = $(currentRow.clone()).appendTo(controlForm);
            rowcount++;

            //new name to
            newRow.find('input').each(function () {
                var newName = '';
                var newId = $(this).attr('id').replace("0", rowcount);
                if ($(this).attr('name') !== undefined)
                    newName = $(this).attr('name').replace("0", rowcount);
                $(this).attr('id', newId);
                $(this).attr('name', newName);
            });

            newRow.find('textarea').each(function () {
                var newId = $(this).attr('id').replace("0", rowcount);
                if ($(this).attr('name') !== undefined)
                    var newName = $(this).attr('name').replace("0", rowcount);
                $(this).attr('id', newId);
                $(this).attr('name', newName);
            });

            newRow.find('select').each(function () {
                var newId = $(this).attr('id').replace("0", rowcount);
                if ($(this).attr('name') !== undefined)
                    var newName = $(this).attr('name').replace("0", rowcount);
                $(this).attr('id', newId);
                $(this).attr('name', newName);
            });

            newRow.find('span').each(function () {
                if ($(this).attr('data-valmsg-for') != undefined) {
                    var newValMessageFor = $(this).attr('data-valmsg-for').replace("0", rowcount);
                    $(this).attr('data-valmsg-for', newValMessageFor);
                }
            });

            newRow.find('input').val('');
        }).on('click', '.btn-remove', function (e) {
            var rowcount = $(".rowToClone").length - 1;
            if (rowcount !== 0) {
                $('#0').remove();
                rowcount--;
                e.preventDefault();
                return false;
            }
            return false;
        });
    });

