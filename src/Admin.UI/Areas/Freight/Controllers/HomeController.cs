using Admin.UI.Areas.Finance.Models;
using Admin.UI.Areas.Freight.Models;
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

namespace Admin.UI.FreightArea
{
	[Area("Freight")]
	public class HomeController : Controller
	{
		private readonly List<FreightRequests> _freightRequest;
		private readonly List<Service> _services;
		private readonly List<ProcessedType> _processedType;
		public HomeController()
		{
			_freightRequest = new List<Areas.Freight.Models.FreightRequests>()
			{ new FreightRequests() {Id=1,Email="service1@service.com",CompanyName="Service",ContactMethod="1",Phone="9015658982",ContactName="Shashikant",Service="1",TrackingNumber="G10847",ProcessedType="1",ShipmentDate=DateTime.Now.ToString(),Fax="0990909009"},
			new FreightRequests() {Id=2,Email="service1@service.com",CompanyName="Service",ContactMethod="2",Phone="9015658982",ContactName="Shashikant",Service="2",TrackingNumber="G10847",ProcessedType="2",ShipmentDate=DateTime.Now.ToString(),Fax="0990909009" }};

			_services = new List<Service>() { new Service() { Id=1,Name= "Ground LTL" }, new Service() { Id = 2, Name = "Vehicle Shipping" }, new Service() { Id = 3, Name = "Ocean LCL" } };

			_processedType = new List<ProcessedType>() { new ProcessedType() { Id = 1, Name = "Pending" }, new ProcessedType() { Id = 2, Name = "Freight Success" }, new ProcessedType() { Id = 3, Name = "Freight Quote" } };
		}

		public IActionResult FreightRequests()
		{
			return View();
		}

		[HttpPost]
		public JsonResult FreightRequests([FromBody] FreightRequests freightRequest)
		{
			return Json(null);
		}
		public JsonResult Services()
		{
			return Json(_services);
		}

		public ActionResult ViewFreightRequests()
		{
			return View();
		}

		public JsonResult ProcessedTypes()
		{
			return Json(_processedType);
		}

		public JsonResult GetAllFreightRequests()
		{
			return Json(_freightRequest);
		}
		public JsonResult DeleteFreightRequestById(string Id)
		{
			return Json(null);
		}
    }
}