using Admin.UI.Areas.Finance.Models;
using Admin.UI.Areas.User.Models;
using Admin.UI.Filter;
using Admin.UI.Utility;
using Admin.UI.Utility.Enumerations;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using Thinktecture.IdentityModel.Client;

namespace Admin.UI.FinanceArea
{
	[Area("Finance")]
	public class HomeController : Controller
	{
		private readonly List<InvoiceMessage> _invoiceMessage;
		public HomeController()
		{
			_invoiceMessage = new List<Areas.Finance.Models.InvoiceMessage>();
			_invoiceMessage.Add(new Areas.Finance.Models.InvoiceMessage() { Id = 1, AccountNo = "11111", EffectiveFrom = "01-19-2016", EffectiveTo = "01-23-2016", MessageBody = "<div>Body</div>", MessageTitle = "Title", Created = DateTime.Now.ToString(), Status = "0" });

			_invoiceMessage.Add(new Areas.Finance.Models.InvoiceMessage() { Id = 2, AccountNo = "22222", EffectiveFrom = "01-20-2016", EffectiveTo = "01-25-2016", MessageBody = "<div>Body2</div>", MessageTitle = "Title1", Created = DateTime.Now.ToString(), Status = "1" });
		}
		[HttpGet]
		public IActionResult InvoiceMessage()
		{
			ViewBag.t = HttpContext.Session.GetString("Welcome");
			return View();
		}
		[HttpPost]
		public JsonResult InvoiceMessage([FromBody]InvoiceMessage invoiceMessage)
		{
			ViewBag.t = HttpContext.Session.GetString("Welcome");
			return Json(null);
		}

		public IActionResult ViewInvoiceMessage()
		{
			ViewBag.User = HttpContext.Session.GetString("User");
			return View();
		}

		[HttpGet]
		public JsonResult GetAllInvoiceMessage()
		{
			try
			{
				return Json(_invoiceMessage);
			}
			catch (Exception ex)
			{
				return Json(ex.Message);
			}
		}

		public JsonResult DeleteInvoiceMessageById(string id)
		{
			_invoiceMessage.RemoveAll(x => x.Id == Convert.ToInt64(id));
			return Json(_invoiceMessage);
		}

		public IActionResult Payment()
		{
			return View();
		}

		[HttpPost]
		public JsonResult Payment([FromBody]Payment payment)
		{
			return Json(null);
		}
	}
}