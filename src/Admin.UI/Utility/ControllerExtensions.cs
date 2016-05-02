using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.AspNet.Mvc.ViewFeatures;
using System;

namespace Admin.UI.Utility
{
    public static class ControllerExtensions
    {
        public static void ShowMessage(this Controller controller, AlertMessageType messageType, string message,
            bool showAfterRedirect = false)
        {
            var messageTypeKey = messageType.ToString();
            if (showAfterRedirect)
            {
                controller.TempData[messageTypeKey] = message;
            }
            else
            {
                controller.ViewData[messageTypeKey] = message;
            }
        }
    }

    public enum AlertMessageType
    {
        Success,
        Warning,
        Info,
        Error
    }

    public static class HtmlHelperExtensions
    {
        public static HtmlString RenderMessages(this IHtmlHelper htmlHelper)
        {
            var messages = string.Empty;
            foreach (var messageType in Enum.GetNames(typeof(AlertMessageType)))
            {
                var message = htmlHelper.ViewContext.ViewData.ContainsKey(messageType)
                    ? htmlHelper.ViewContext.ViewData[messageType]
                    : htmlHelper.ViewContext.TempData.ContainsKey(messageType)
                        ? htmlHelper.ViewContext.TempData[messageType]
                        : null;
                if (message != null)
                {
                    switch (messageType.ToLowerInvariant())
                    {
                        case "success":
                            messages =
                                $"<div class='alert alert-success no-margin'><button type='button' class='close' data-dismiss='alert'><i class='ace-icon fa fa-times'></i></button>{message}</div>";
                            break;

                        case "warning":
                            messages = $"<div class='alert alert-warning no-margin'><button type='button' class='close' data-dismiss='alert'><i class='ace-icon fa fa-times'></i></button>{message}</div>";
                            break;

                        case "error":
                            messages = $"<div class='alert alert-danger no-margin'><button type='button' class='close' data-dismiss='alert'><i class='ace-icon fa fa-times'></i></button>{message}</div>";
                            break;

                        case "info":
                            messages = $"<div class='alert alert-info no-margin'><button type='button' class='close' data-dismiss='alert'><i class='ace-icon fa fa-times'></i></button>{message}</div>";
                            break;
                    }
                }
            }

            return new HtmlString(messages);
        }
    }
}