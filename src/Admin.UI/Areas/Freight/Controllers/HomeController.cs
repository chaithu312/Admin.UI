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

		private readonly List<CostItem> _costitems;
		private readonly List<Message> _messages;
		private readonly List<Signature> _signature;
		public HomeController()
		{
			_freightRequest = new List<Areas.Freight.Models.FreightRequests>()
			{ new FreightRequests() {Id=1,Email="service1@service.com",CompanyName="Service",ContactMethod="1",Phone="9015658982",ContactName="Shashikant",Service="1",TrackingNumber="G10847",ProcessedType="1",ShipmentDate=DateTime.Now.ToString(),Fax="0990909009"},
			new FreightRequests() {Id=2,Email="service1@service.com",CompanyName="Service",ContactMethod="2",Phone="9015658982",ContactName="Shashikant",Service="2",TrackingNumber="G10847",ProcessedType="2",ShipmentDate=DateTime.Now.ToString(),Fax="0990909009" }};

			_services = new List<Service>() { new Service() { Id=1,Name= "Ground LTL" }, new Service() { Id = 2, Name = "Vehicle Shipping" }, new Service() { Id = 3, Name = "Ocean LCL" } };

			_processedType = new List<ProcessedType>() { new ProcessedType() { Id = 1, Name = "Pending" }, new ProcessedType() { Id = 2, Name = "Freight Success" }, new ProcessedType() { Id = 3, Name = "Freight Quote" } };

			_costitems = new List<CostItem>() { new CostItem() { Id = 1, ServiceName = "Service1", Created = DateTime.Now.ToString() }, new CostItem() { Id = 2, ServiceName = "Service2", Created = DateTime.Now.ToString() }, new CostItem() { Id = 3, ServiceName = "Service3", Created = DateTime.Now.ToString() } };
			_messages = new List<Message>() { new Message() { Id = 1, Description = "Description 1", MessageText = "Message1",Created=DateTime.Now.ToString() }, new Message() { Id = 2, Description = "Description 2", MessageText = "Message2", Created = DateTime.Now.ToString() }, new Message() { Id = 3, Description = "Description 3", MessageText = "Message3", Created = DateTime.Now.ToString() } };

			_signature = new List<Signature>() { new Signature() { Id=1, Caption="Caption 1",SignatureText="Text 1",Created=DateTime.Now.ToString()}, new Signature() { Id = 2, Caption = "Caption 2", SignatureText = "Text 2", Created = DateTime.Now.ToString() }, new Signature() { Id = 3, Caption = "Caption 3", SignatureText = "Text 3", Created = DateTime.Now.ToString() } };
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

		[HttpGet]
		public IActionResult FreightCostItem()
		{
			return View();
		}

		[HttpPost]
		public JsonResult FreightCostItem([FromBody]CostItem costItem)
		{
			try
			{
				if (costItem != null)
				{

					string result = "Success";
					return Json(result);
				}
				else
					return Json("Check required fields");

			}
			catch (Exception ex)

			{
				return Json(ex.Message);
			}
		}

		public ActionResult ViewFreightCostItem()
		{
			return View();
		}
        public JsonResult Services()
		{
			return Json(_services);
		}

		public ActionResult ViewFreightRequests()
		{
			return View();
		}

		[HttpGet]
		public IActionResult FreightMessage()
		{
			return View();
		}

		[HttpPost]
		public IActionResult FreightMessage(Message message)
		{
			try
			{
				if (message != null)
				{

					string result = "Success";
					return Json(result);
				}
				else
					return Json("Check required fields");

			}
			catch (Exception ex)

			{
				return Json(ex.Message);
			}
		}

		[HttpGet]
		public ActionResult ViewFreightMessage()
		{
			return View();
		}

		[HttpGet]
		public ActionResult ViewFreightSignature()
		{
			return View();
		}

		[HttpGet]
		public IActionResult FreightSignature()
		{
			return View();
		}

		[HttpPost]
		public IActionResult FreightSignature(Signature signature)
		{
			try
			{
				if (signature != null)
				{

					string result = "Success";
					return Json(result);
				}
				else
					return Json("Check required fields");

			}
			catch (Exception ex)

			{
				return Json(ex.Message);
			}
		}

		public JsonResult ProcessedTypes()
		{
			return Json(_processedType);
		}

		public JsonResult GetAllFreightRequests()
		{
			return Json(_freightRequest);
		}

		public JsonResult GetAllCostItems()
		{
			return Json(_costitems);
		}

		public JsonResult GetAllMessages()
		{
			return Json(_messages);
		}

		public JsonResult GetAllSignatures()
		{
			return Json(_signature);
		}

		public JsonResult DeleteFreightRequestById(string Id)
		{
			return Json(null);
		}

		public JsonResult DeleteCostItemById(string Id)
		{
			return Json(null);
		}

		public JsonResult DeleteMessageById(string Id)
		{
			return Json(null);
		}

		public JsonResult DeleteSignatureById(string Id)
		{
			return Json(null);
		}
	}
}