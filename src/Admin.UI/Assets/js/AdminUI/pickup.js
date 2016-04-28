$(document).ready(function () {
    $(function () {
        $('#PickupDate').datepicker({
            daysOfWeekDisabled: [0, 6],
            autoclose: true,
            todayHighlight: true,
            startDate: '+0d',
            endDate: '+7d',
            todayBtn: 'true'
        });

        $("#PickupDate").datepicker("setDate", '2016-07-25');

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

            var controlForm = $(this).closest('table'),
                currentRow = $(this).parents('tr:first'),
                newRow = $(currentRow.clone()).appendTo(controlForm);

            var test = $(currentRow.clone());
            alert(test.html());

            newRow.find('input').val('');
            controlForm.find('tr:not(:last) .btn-add')
                .removeClass('btn-add').addClass('btn-remove')
                .removeClass('btn-success').addClass('btn-danger')
                .html('<i class="ace-icon fa fa fa-truck fa"></i>Remove');
        }).on('click', '.btn-remove', function (e) {
            $(this).parents('tr:first').remove();

            e.preventDefault();
            return false;
        });
    });
});