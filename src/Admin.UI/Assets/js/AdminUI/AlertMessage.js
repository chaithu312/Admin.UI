var AlertMessage = function () {
    return {
        init: function (message, messageType) {
            AlertMessage.timerID = 0;
            /* this will display a message on page load */
            if (message !== "" && messageType !== "") {
                console.log(messageType);
                AlertMessage.showMessage(message, messageType);
            }
        },
        showMessage: function (message, type) {
            //is there a current message showing

            var cssClass = "alert-info";
            switch (type) {
                case "info":
                    cssClass = "alert-info";
                    break;

                case "success":
                    cssClass = "alert-success";
                    break;

                case "warning":
                    cssClass = "alert-warning";
                    break;

                case "error":
                    cssClass = "alert-danger";
                    break;
            }
            var alertMessage = $("#AlertBox");
            alertMessage.append("<div class='alert " + cssClass + " no-margin'><button type='button' class='close' data-dismiss='alert'><i class='ace-icon fa fa-times'></i></button>" + message + "</div>");
        }
    };
}();