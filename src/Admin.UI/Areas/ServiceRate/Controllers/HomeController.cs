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
		private readonly List<Country> countries = null;
		private readonly List<State> states = null;
		private readonly List<PostCode> postCode = null;
		private readonly List<ZoneUS> zoneUS = null;
		private readonly List<Zone> zone = null;
		private readonly List<FSC> fsc= null;
		public HomeController()
		{
			#region Services & Rating Setting->Location

			countries = new List<Country>();
			countries.Add(new Country() { Id = 1, Name = "Afghanistan", ISOCode = "AF", TopLevelDomain = "AF", Delivery = "1", DialingCode = "93", Membership = "2", Status = "1", SecurityCharge = "1", TimeZone = "Eastern Time (US & Canada)" });
			countries.Add(new Country() { Id = 2, Name = "Aland Islands", ISOCode = "AX", TopLevelDomain = "AX", Delivery = "1", DialingCode = "358", Membership = "1", Status = "1", SecurityCharge = "1", TimeZone = "Eastern Time (US & Canada)" });

			states = new List<State>();
			states.Add(new State() { Id = 1, Country = "840", Name = "ALABAMA", Code = "AL", FIPS = "01", AdditionalDays = "0", TimeZone = "Eastern Time (US & Canada)", Status = "0" });
			states.Add(new State() { Id = 2, Country = "840", Name = "ALASKA", Code = "AK", FIPS = "02", AdditionalDays = "1", TimeZone = "Alaska", Status = "0", });


			postCode = new List<PostCode>();

			postCode.Add(new PostCode() { Id = 1, Country = "840", State = "1", PostalCode = "99812", CityName = "Juneau", CityType = "A", CountryName = "Juneau",Class="U",TimeZone="-9",AdditionalDays="1",SaturdayDelivery=true,Pickup=true,Delivery=true,AreaCode="907",CountryFIPS="FIPS1",DaylightSavingsTime=true,EarliestDeliveryTime="12:34",LastPickup= "12:34", LastPickupOrder = "12:34",Latitude="23,56'",Longitude = "23,56'", Status = "0" });

			postCode.Add(new PostCode() { Id =2, Country = "840", State = "2", PostalCode = "99812", CityName = "State of Alaska", CityType = "N", CountryName = "Juneau", Class = "U", TimeZone = "-9", AdditionalDays = "2", SaturdayDelivery = true, Pickup = true, Delivery = true, AreaCode = "907", CountryFIPS = "FIPS1", DaylightSavingsTime = true, EarliestDeliveryTime = "12:34", LastPickup = "12:34", LastPickupOrder = "12:34", Latitude = "23,56'", Longitude = "23,56'", Status = "0" });
			#endregion

			#region Zone Setting
			zoneUS = new List<ZoneUS>();

			zoneUS.Add(new ZoneUS() { Id = 1, OriginZipLower = "12345", OriginZipUpper = "67891", DestinationZipLower = "12345", DestinationZipUpper = "67890", Zone = "10", Created = DateTime.Now.ToString() });

			zoneUS.Add(new ZoneUS() { Id = 2, OriginZipLower = "12345", OriginZipUpper = "67891", DestinationZipLower = "12345", DestinationZipUpper = "67890", Zone = "11", Created = DateTime.Now.ToString() });

			zone = new List<Areas.ServiceRate.Models.Zone>();
			zone.Add(new Zone() { Id = 1, Service = "1", DestinationCountry = "840", OriginCountry = "840", TransitTime = "12:23", ZoneUS = "12", Created = DateTime.Now.ToString() });

			zone.Add(new Zone() { Id = 2, Service = "2", DestinationCountry = "840", OriginCountry = "840", TransitTime = "12:50", ZoneUS = "12",Created=DateTime.Now.ToString() });
			#endregion Zone Setting

			#region Rates & Discount

			fsc = new List<Areas.ServiceRate.Models.FSC>();
			fsc.Add(new FSC() { Id = 1, Service = "1",EffectiveDate= DateTime.Now.ToString("MM-dd-yyyy"), FSCValue="2.33",Created=DateTime.Now.ToString() });
			fsc.Add(new FSC() { Id = 2, Service = "2", EffectiveDate = DateTime.Now.ToString("MM-dd-yyyy"), FSCValue = "2.35", Created = DateTime.Now.ToString() });
			#endregion
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
		public IActionResult PostCode([FromBody]PostCode postCode)
		{
			return Json(null);
		}

		public IActionResult ZoneUS()
		{
			return View();
		}

		[HttpPost]
		public JsonResult ZoneUS([FromBody]ZoneUS zoneUS)
		{
			return Json(null);
		}

		public IActionResult Zone()
		{
			return View();
		}

		[HttpPost]
		public IActionResult Zone([FromBody] Zone zone)
		{
			return Json(null);
		}

		public IActionResult FSC()
		{
			return View();
		}

		[HttpPost]
		public IActionResult FSC([FromBody]FSC fsc)
		{
			return Json(null);
		}

		public IActionResult Discount()
		{
			return View();
		}

		[HttpPost]
		public JsonResult Discount([FromBody]Discount discount)
		{
			return Json(null);
		}

		[HttpPost]
		public IActionResult Country([FromBody]Country country)
		{
			return Json(null);
		}

		[HttpPost]
		public IActionResult State([FromBody]State state)
		{
			return Json(null);
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

		public IActionResult ViewPostCode()
		{
			ViewBag.User = HttpContext.Session.GetString("User");
			return View();
		}

		public IActionResult ViewZoneUS()
		{
			ViewBag.User = HttpContext.Session.GetString("User");
			return View();
		}

		public IActionResult ViewZone()
		{
			ViewBag.User = HttpContext.Session.GetString("User");
			return View();
		}

		public IActionResult ViewFSC()
		{
			ViewBag.User = HttpContext.Session.GetString("User");
			return View();
		}

		public IActionResult ViewDiscount()
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

		[HttpGet]
		public JsonResult GetAllPostCodes()
		{
			try
			{
				return Json(postCode);
			}
			catch (Exception ex)
			{
				return Json(ex.Message);
			}
		}

		[HttpGet]
		public JsonResult GetAllZoneUS()
		{
			try
			{
				return Json(zoneUS);
			}
			catch (Exception ex)
			{
				return Json(ex.Message);
			}
		}

		[HttpGet]
		public JsonResult GetAllZone()
		{
			try
			{
				return Json(zone);
			}
			catch (Exception ex)
			{
				return Json(ex.Message);
			}
		}

		[HttpGet]
		public JsonResult GetAllFSC()
		{
			try
			{
				return Json(fsc);
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

		public JsonResult DeletePostById(string id)
		{
			postCode.RemoveAll(x => x.Id == Convert.ToInt64(id));
			return Json(postCode);
		}

		public JsonResult DeleteZoneUSById(string id)
		{
			zoneUS.RemoveAll(x => x.Id == Convert.ToInt64(id));
			return Json(zoneUS);
		}

		public JsonResult DeleteZoneById(string id)
		{
			zone.RemoveAll(x => x.Id == Convert.ToInt64(id));
			return Json(zone);
		}

		public JsonResult DeleteFSCById(string id)
		{
			fsc.RemoveAll(x => x.Id == Convert.ToInt64(id));
			return Json(fsc);
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

        [HttpGet]
        public IActionResult Routes()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Routes([FromBody]Routes agents)
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
        public IActionResult ViewRoutes()
        {
            return View();
        }

        [HttpGet]
        public IActionResult RouteSelections()
        {
            return View();
        }

        [HttpGet]
        public IActionResult ViewRouteSelections()
        {
            return View();
        }


        [HttpGet]
        public IActionResult CodeSets()
        {
            return View();
        }



        [HttpGet]
        public IActionResult USPostCodes()
        {
            return View();

        }


        [HttpGet]
        public IActionResult CountrySets()
        {
            return View();


        }



        }
    }