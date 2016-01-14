using Admin.UI.Areas.ServiceRate.Models;
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

namespace Admin.UI.ServiceRateArea
{
	[Area("ServiceRate")]
	public class HomeController : Controller
	{
		List<Country> countries = null;
		List<State> states = null;
		public HomeController()
		{
			countries = new List<Country>();
			countries.Add(new Country() { Id = 1, Name = "Afghanistan", ISOCode = "AF", TopLevelDomain = "AF", Delivery = "1", DialingCode = "93", Membership = "2", Status = "1", SecurityCharge = "1", TimeZone = "Eastern Time (US & Canada)" });
			countries.Add(new Country() { Id = 2, Name = "Aland Islands", ISOCode = "AX", TopLevelDomain = "AX", Delivery = "1", DialingCode = "358", Membership = "1", Status = "1", SecurityCharge = "1", TimeZone = "Eastern Time (US & Canada)" });

			states = new List<State>();
			states.Add(new State() { Id = 1, Country = "840", Name = "ALABAMA", Code = "AL", FIPS = "01", AdditionalDays = "0", TimeZone = "Eastern Time (US & Canada)", Status = "0"});
			states.Add(new State() { Id = 2, Country = "840", Name = "ALASKA", Code = "AK", FIPS = "02", AdditionalDays = "1", TimeZone = "Alaska", Status = "0",  });
		}
		public IActionResult Index()
		{
			return View();
		}
		public IActionResult Agents()
		{
			return View();
		}
		public IActionResult Country()
		{
			return View();
		}

		public IActionResult State()
		{
			return View();
		}

		public IActionResult PostCode()
		{
			return View();
		}

		[HttpPost]
		public IActionResult Country([FromBody]Country country)
		{
            return View();
		}

		[HttpPost]
		public IActionResult State([FromBody]State state)
		{
			return View();
		}

		public IActionResult ViewCountries()
		{
			ViewBag.User = HttpContext.Session.GetString("User");
			return View();
		}

		public IActionResult ViewStates()
		{
			ViewBag.User = HttpContext.Session.GetString("User");
			return View();
		}

		[HttpGet]
		public JsonResult GetAllCountries()
		{
			try
			{
				return Json(countries);
			}
			catch (Exception ex)
			{
				return Json(ex.Message);
			}
		}

		[HttpGet]
		public JsonResult GetAllStates()
		{
			try
			{
				return Json(states);
			}
			catch (Exception ex)
			{
				return Json(ex.Message);
			}
		}

		public JsonResult DeleteCountryById(string id)
		{
			countries.RemoveAll(x => x.Id == Convert.ToInt64(id));
			return Json(countries);
		}

		public JsonResult DeleteStateById(string id)
		{
			states.RemoveAll(x => x.Id == Convert.ToInt64(id));
			return Json(states);
		}

		[HttpPost]
		public JsonResult Agents([FromBody]Agents agents)
		{
			try
			{
				if (agents != null)
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
		public IActionResult ViewAgents()
		{
			return View();
		}

		[HttpGet]
		public JsonResult GetAllAgents()
		{
			try
			{

				//var client = new HttpClient();

				//string url = Constants.Profile + "Address/GetAllAddress?AccountID=2";

				//HttpWebResponse response = ClientHttp.GetAsync(url);

				//Stream responseStream = response.GetResponseStream();

				//string responseString = new StreamReader(responseStream).ReadToEnd();
				string responseString = "[{\"Id\":1,\"CountryId\":\"US\",\"AgentName\":\"Agent Test\",\"LabelAPI\":\"chaitanya kumar\",\"PickupCharge\":\"$10.00\",\"SatPickupCharge\":\"$12.00\",\"TrackingURL\":\"www.abc.com/track\"},{\"Id\":2,\"CountryId\":\"UK\",\"AgentName\":\"Agent Test1\",\"LabelAPI\":\"kumar\",\"PickupCharge\":\"$13.00\",\"SatPickupCharge\":\"$15.00\",\"TrackingURL\":\"www.cba.com/track\"},{\"Id\":3,\"CountryId\":\"Japan\",\"AgentName\":\"Test\",\"LabelAPI\":\"ARX\",\"PickupCharge\":\"$11.00\",\"SatPickupCharge\":\"$16.00\",\"TrackingURL\":\"www.artc.com/track\"}]";

				var objData = JsonConvert.DeserializeObject(responseString);

				JArray varAgents = JArray.Parse(objData.ToString());
				IList<Agents> viewAgents = varAgents.Select(p => new Agents
				{
					Id = (long)p["Id"],
					CountryId = (string)p["CountryId"],
					AgentName = (string)p["AgentName"],
					LabelAPI = (string)p["LabelAPI"],
					PickupCharge = (string)p["PickupCharge"],
					SaturdayPickupCharge = (string)p["SatPickupCharge"],
					TrackingURL = (string)p["TrackingURL"]

				}).ToList();

				return Json(viewAgents);
			}
			catch (Exception ex)
			{
				return Json(ex.Message);
			}
		}

		public IActionResult AgentService()
		{
			return View();
		}

		public IActionResult ViewAgentService()
		{
			return View();
		}
	}
}