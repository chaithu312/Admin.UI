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

namespace Admin.UI.UserArea
{
	[Area("User")]
	public class HomeController : Controller
	{
		public IActionResult Index()
		{
			ViewBag.t = HttpContext.Session.GetString("Welcome");
			return View();
		}

		[HttpPost]
		public JsonResult Index([FromBody] Register register)
		{
			if (ModelState.IsValid)
			{
				RegisterModel registerModel = new RegisterModel();
				registerModel.DomainKey = new Guid(register.DomainKey);
				registerModel.EMail = register.UserName;
				registerModel.Password = register.Password;

				var postData = JsonConvert.SerializeObject(registerModel);

				HttpWebResponse response = ClientHttp.PostAsync(Constants.RegisterURL + "registration", postData);

				if (response.StatusCode == HttpStatusCode.OK)
				{
					Stream responseStream = response.GetResponseStream();
					string responseString = new StreamReader(responseStream).ReadToEnd();
					if (responseString.ToString().ToLower().Equals("true") == true)
						return Json("Success");
					else
						return Json("Failed");
				}
				else
					return Json("Failed");
			}
			else
			{
				return Json("Failed");
			}
		}

		public IActionResult List()
		{
			return View();
		}

		public IActionResult Login()
		{
			ViewBag.t = HttpContext.Session.GetString("Welcome");
			Login login = new Login();
			login.DomainKey = "B171F61C-8914-4C5D-AF88-C3B776D80916";

			//  //TODO : MAKE CLIENT AS DYNAMIC AS PER USER
			//  var client = new OAuth2Client(
			//new Uri("http://localhost:63319/core/connect/" + "token"),
			//Constants.clientID,
			//Constants.clientSecret, OAuth2Client.ClientAuthenticationStyle.PostValues);

			//  var optional = new Dictionary<string, string>
			//            {
			//                { "acr_values", String.Format("DomainKey: {0}", login.DomainKey) }
			//            };

			//  TokenResponse x = client.RequestResourceOwnerPasswordAsync("mkumar@ishir.com", "manoj001", "read write", optional).Result;

			//  //TokenResponse y = client.CreateImplicitFlowUrl()
			return View();
		}

		[HttpPost]
		public ActionResult Login(Login login)
		{
			// ViewBag.MyProperty = 1;
			login.DomainKey = "B171F61C-8914-4C5D-AF88-C3B776D80916";
			HttpContext.Session.SetString("User", "Guest");
			if (ModelState.IsValid)
			{
				//TODO : MAKE CLIENT AS DYNAMIC AS PER USER
				try
				{
					var client = new OAuth2Client(
				  new Uri(Constants.idServer + "/Connect/token"),
				  Constants.clientID,
				  Constants.clientSecret, OAuth2Client.ClientAuthenticationStyle.PostValues);

					var optional = new Dictionary<string, string>
						{
							{ "acr_values", String.Format("DomainKey: {0}", login.DomainKey) }
						};
					try
					{
						TokenResponse x = client.RequestResourceOwnerPasswordAsync(login.UserName, login.Password, Constants.clientScope, optional).Result;

						if (x.AccessToken != null)
						{
							HttpContext.Session.SetString("Welcome", "Cooming Soon");
							HttpContext.Session.SetString("AccessToken", x.AccessToken);
							HttpContext.Session.SetString("User", login.UserName);
							return RedirectToAction("Dashboard", "Home", new { area = "" });
						}
						else
						{
							HttpContext.Session.SetString("Welcome", x.HttpErrorReason + " "+ x.HttpErrorStatusCode);
							return RedirectToAction("Index", "Home", new { area = "User" });
							//return View("Index");
						}
					}
					catch (Exception ex)
					{
						HttpContext.Session.SetString("Welcome", ex.Message + ex.InnerException + ex.StackTrace);
						return RedirectToAction("Dashboard", "Home", new { area = "" });
					}
				}
				catch (Exception ex)
				{
					HttpContext.Session.SetString("Welcome", ex.Message + ex.InnerException + ex.StackTrace);
					return RedirectToAction("Dashboard", "Home", new { area = "" });
				}
			}
			else
			{
				HttpContext.Session.SetString("Welcome", "User Name should be valid email and Password should be atleast 8 charcter long");
				return RedirectToAction("Index", "Home", new { area = "User" });
			}
		}

		public IActionResult Thankyou()
		{
			return View();
		}

		[CustomAction]
		public IActionResult ChangePassword(TokenResponse response)
		{
			var client = new HttpClient();
			client.SetBearerToken(response.AccessToken);

			var result = client.GetStringAsync("http://localhost:14869/test").Result;
			//Data Comes like {"message":"OK computer","client":"silicon"}
			return View();
		}

		[HttpPost]
		[CustomAction]
		public JsonResult ChangePassword(ChangePassword login)
		{
			return Json("failed");
		}

		public IActionResult FindUser()
		{
			return View();
		}

		[HttpPost]
		public JsonResult FindUser(FindUser user)
		{
			if (ModelState.IsValid)
			{
				//TODO : MAKE CLIENT AS DYNAMIC AS PER USER
				var client = new OAuth2Client(
				  new Uri(Constants.idServer + "token"),
				  Constants.clientID,
				  Constants.clientSecret, OAuth2Client.ClientAuthenticationStyle.PostValues);

				var optional = new Dictionary<string, string>
					  {
						  { "acr_values", String.Format("DomainKey: {0}", user.UserName) }
					  };

				TokenResponse x = client.RequestClientCredentialsAsync("ChangePassword", optional).Result;

				//TokenResponse y = client.CreateImplicitFlowUrl()

				if (x.AccessToken != null)
				{
					return Json(x.AccessToken.ToString());
				}
				else
				{
					return Json("Failed");
				}
			}
			else
			{
				return Json("Failed");
			}
		}

		[AllowAnonymous, HttpGet]
		public JsonResult IsUserAvailable(string userName)
		{
			if (string.IsNullOrEmpty(userName))
			{
				return Json(new { result = true });
			}
			else
			{
				try
				{
					HttpWebResponse response = ClientHttp.GetAsync(Constants.RegisterURL + "IsUserAvailable?Email=" + userName);

					Stream responseStream = response.GetResponseStream();
					string responseString = new StreamReader(responseStream).ReadToEnd();
					if (responseString.ToString().ToLower().Equals("true") == true)
						return Json(new { result = false });
					else
						return Json(new { result = true });
				}
				catch
				{
					return Json(new { result = true });
				}
			}
		}

		[CustomAction]
		public IActionResult AddressBook()
		{
			ViewBag.User = HttpContext.Session.GetString("User");
			return View();
		}

		[HttpPost]
		[CustomAction]
		public JsonResult AddressBook([FromBody]Address register)
		{
			try
			{
				if (register != null)
				{
					register.AccountId = 2;
					register.Status = Status.Active;
					register.Created = DateTime.Now;
					register.Name = register.FirstName + " " + register.LastName;
					string url = register.Id == 0 ? Constants.Profile + "Address/Insert" : Constants.Profile + "Address/Update";

					object result = string.Empty;

					string serialisedData = JsonConvert.SerializeObject(register);
					HttpWebResponse response = ClientHttp.PostAsync(url, serialisedData);
					result = JsonConvert.DeserializeObject(response.ToString());
					return Json(result);
				}
				else
					return Json("Check required fields");

			}
			catch

			{
				return Json("Check required fields");
			}
		}

		[HttpGet]
		public JsonResult Country()
		{
			var client = new HttpClient();
			string PostData = "orderby=Name&sortdir=ASC";
			var result = client.GetStringAsync(Constants.Profile + "Country?" + PostData).Result;
			//var result = client.GetStringAsync(Constants.Profile + "Country").Result;

			return Json(result);
		}

		[HttpGet]
		public JsonResult State(string countryId)
		{
			try
			{
				var client = new HttpClient();
				var result = client.GetStringAsync(Constants.Profile + "Division/" + countryId).Result;
				return Json(result);
			}
			catch (Exception ex)
			{
				return Json(ex.Message);
			}
		}

		[HttpGet]
		public JsonResult Division()
		{
			var client = new HttpClient();
			var result = client.GetStringAsync(Constants.Profile + "Division/").Result;
			return Json(result);
		}

		[HttpGet]
		public JsonResult PostalCode(string PostalCode)
		{
			var client = new HttpClient();
			var result = client.GetStringAsync(Constants.APIURL + "MasterApi/postalcode/" + PostalCode).Result;
			return Json(result);
		}

		[CustomAction]
		public IActionResult ViewAddress()
		{
			ViewBag.User = HttpContext.Session.GetString("User");
			return View();
		}

		[HttpGet]
		[CustomAction]
		public JsonResult GetAllAddress()
		{
			try
			{
				var client = new HttpClient();

				string url = Constants.Profile + "Address/GetAllAddress?AccountID=2";

				HttpWebResponse response = ClientHttp.GetAsync(url);

				Stream responseStream = response.GetResponseStream();
				string responseString = new StreamReader(responseStream).ReadToEnd();
				var objData = JsonConvert.DeserializeObject(responseString);

				JArray varAddress = JArray.Parse(objData.ToString());
				IList<Address> viewAddress = varAddress.Select(p => new Address
				{
					Id = (long)p["Id"],
					Name = (string)p["Name"],
					Address1 = (string)p["Address1"],
					Address2 = (string)p["Address2"],
					City = (string)p["City"],
					Division = (string)p["Division"],
					ShortName = (string)p["ShortName"],
					CountryId = (string)p["CountryId"],
					PostalCode = (string)p["PostalCode"],
					Phone1 = (string)p["Phone1"].ToString(),
					Phone2 = (string)p["Phone2"].ToString(),
					EMail = (string)p["EMail"].ToString(),
					AddressType = (Utility.Enumerations.AddressTypes)(int)p["AddressType"],
					Status = (Utility.Enumerations.Status)(int)p["Status"],

					Detail = " <div class=\"hidden-sm hidden-xs btn-group\"><button id=\"btnedit\" type=\"button\" onclick=\"editForm('" + (long)p["Id"] + "')\" class=\"btn btn-xs btn-info\"><i class=\"ace-icon fa fa-pencil bigger-120\"></i></button><button id=\"btndelete\" type=\"button\" class=\"btn btn-xs btn-danger\" ><i class=\"ace-icon fa fa-trash-o bigger-120\"></i></button></div>"
				}).ToList();

				return Json(viewAddress);
			}
			catch (Exception ex)
			{
				return Json(ex.Message);
			}
		}

		[HttpGet]
		[CustomAction]
		public JsonResult DeleteAddressById(string id)
		{
			string url = Constants.Profile + "Address/DeleteById";
			object result = string.Empty;

			using (var client = new WebClient())
			{
				client.Headers[HttpRequestHeader.ContentType] = Constants.ContentType;

				var response = client.UploadString(url, JsonConvert.SerializeObject(id));

				result = JsonConvert.DeserializeObject(response);
			}

			return Json(result);
		}

		public IActionResult LogOut()
		{
			HttpContext.Session.Clear();
			HttpContext.Session.Remove("AccessToken");
			HttpContext.Session.Remove("User");
			HttpContext.Session.Remove("Welcome");

			return RedirectToAction("Index", "Home", new { area = "User" });
		}
	}
}