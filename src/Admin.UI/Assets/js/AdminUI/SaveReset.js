var SaveButton = function () {
    var saveUrl;
    var callBack;
    var returnUrl;
    var onSuccessEvent;
    return {
        init: function (saveUrl, returnUrl, onSuccess, form) {
            SaveButton.saveUrl = saveUrl;
            SaveButton.returnUrl = returnUrl;
            SaveButton.onSuccessEvent = onSuccess;
            useValidation = true;
            console.log(SaveButton.saveUrl);

            $(document).on("click", "#btnSave", function (e) {
                if (SaveButton.saveUrl !== "" && SaveButton.saveUrl != undefined) {
                    var dataString = form.first().serialize();

                    if (form.valid()) {
                        $.ajax({
                            url: SaveButton.saveUrl,
                            type: "POST",
                            data: dataString,
                            success: function (html) {
                                AlertMessage.showMessage("success", "success");
                                AlertMessage.showMessage("error", "error");
                                AlertMessage.showMessage("info", "info");
                                //AlertMessage.showMessage(html.message, html.messageType);
                                var fn = window[SaveButton.onSuccessEvent];
                                if (typeof fn === 'function') fn(html);
                            },
                            error: function (response) {
                                AlertMessage.showMessage("Error, could not save", "error");
                            }
                        });
                    }
                }
                else {
                    if (useValidation === true) {
                        var validator = form.validate();

                        if (form.valid()) {
                            form.submit();
                        }
                        else {
                            if (validator.errorList != null && validator.errorList.length > 0) {
                                $("html,body").animate({
                                    scrollTop: $(validator.errorList[0].element).offset().top - 100
                                }, 1000);
                            }
                        }
                    } else {
                        form.submit();
                    }
                }
            });

            $(document).on("click", "#btnCancel", function (e) {
                console.log(form.validate());
                form.validate().resetForm();
            });
        }
    }
}();