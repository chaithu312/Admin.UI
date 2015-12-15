using Admin.UI.Utility;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Filters;
using Microsoft.AspNet.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Admin.UI.Filter
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class CustomActionAttribute : FilterAttribute, Microsoft.AspNet.Mvc.Filters.IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext filterContext)
        {
            //throw new NotImplementedException();
        }

        public void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var isLogin = filterContext.HttpContext.Session.GetString("AccessToken");
            if (isLogin == null)
            {
                filterContext.Result = new RedirectToActionResult("Index", "Home", null);
            }
        }
    }
}