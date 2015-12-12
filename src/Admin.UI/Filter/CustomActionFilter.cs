using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Filters;
using Microsoft.AspNet.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Admin.UI.Utility;
using System.Web;

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
			if (Global.AccessToken==null)
			{
			var x=	filterContext.HttpContext.Request.Cookies.Keys;
				HttpCookie myCookie = new HttpCookie("AccessSToken");
				
                if (myCookie != null)
				{
					int userId = Convert.ToInt32(myCookie.Values["Token"]);
				}
				//filterContext.Result = new RedirectToActionResult("Index", "Home", null);
				return;
			}
		}
	}
}
