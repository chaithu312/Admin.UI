using Admin.UI.Areas.User.Models;
using Admin.UI.Utility;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
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
            login.DomainKey = "B171F61C-8914-4C5D-AF88-C3B776D80916";
            if (ModelState.IsValid)
            {
                //TODO : MAKE CLIENT AS DYNAMIC AS PER USER
                var client = new OAuth2Client(
              new Uri(Constants.idServer + "token"),
              Constants.clientID,
              Constants.clientSecret, OAuth2Client.ClientAuthenticationStyle.PostValues);

                var optional = new Dictionary<string, string>
                      {
                          { "acr_values", String.Format("DomainKey: {0}", login.DomainKey) }
                      };

                TokenResponse x = client.RequestResourceOwnerPasswordAsync(login.UserName, login.Password, Constants.clientScope, optional).Result;

                //TokenResponse y = client.CreateImplicitFlowUrl()

                if (x.AccessToken != null)
                {
                    //var Decoded=Encoding.UTF8.GetString(Base64Url.Decode(x.AccessToken));

                    //var clientx = new HttpClient();
                    //clientx.SetBearerToken(x.AccessToken);

                    //var result = clientx.GetStringAsync("http://localhost:49202/UPS").Result;
                    //System.Web.HttpContext.Current.Session["AccessToken"] = x.AccessToken;

                    return RedirectToAction("Dashboard", "Home", new { area = "" });
                }
                else
                {
                    return RedirectToAction("Index", "Home", new { area = "User" });
                }
            }
            else
            {
                return RedirectToAction("Index", "Home", new { area = "User" });
            }
        }

        public IActionResult Thankyou()
        {
            return View();
        }

        public IActionResult ChangePassword(TokenResponse response)
        {
            var client = new HttpClient();
            client.SetBearerToken(response.AccessToken);

            var result = client.GetStringAsync("http://localhost:14869/test").Result;
            //Data Comes like {"message":"OK computer","client":"silicon"}
            return View();
        }

        [HttpPost]
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

        public IActionResult AddressBook()
        {
            return View();
        }

        [HttpPost]
        public JsonResult AddressBook([FromBody]Address register)
        {
            try
            {
                if (register != null)
                {
                    register.AccountId = 2;
                    register.Status = 1;
                    register.Created = DateTime.Now;
                    register.Name = register.FirstName + " " + register.LastName;
                }

                string url = Constants.Profile + "Address/Insert";
                object result = string.Empty;

                // Uses the System.Net.WebClient and not HttpClient, because .NET 2.0 must be supported.
                //using (var client = new WebClient())
                //{
                //    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                //    string serialisedData = JsonConvert.SerializeObject(register);

                //    var response = client.UploadString(url, serialisedData);

                //    HttpWebResponse response = ClientHttp.PostAsync(url, serialisedData);
                //    result = JsonConvert.DeserializeObject(response);
                //}
                string serialisedData = JsonConvert.SerializeObject(register);
                HttpWebResponse response = ClientHttp.PostAsync(url, serialisedData);
                result = JsonConvert.DeserializeObject(response.ToString());
                return Json(result);
            }
            catch

            {
                return Json("Check required fields");
            }
        }

        public IActionResult ViewAddress()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Country()
        {
            var client = new HttpClient();
            string strPostData = "orderby=Name&sortdir=ASC";
            //var result = client.GetStringAsync(Constants.Profile + "Country?" + strPostData).Result;
            var result = client.GetStringAsync(Constants.Profile + "Country").Result;
            return Json(result);
        }

        [HttpGet]
        public JsonResult State(string countryId)
        {
            var client = new HttpClient();
            var result = client.GetStringAsync(Constants.Profile + "Division/" + countryId).Result;
            return Json(result);
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

        [HttpGet]
        public JsonResult GetAllAddress()
        {
            try
            {
                //HttpContext.Session.SetString("Test", "Ben Rules!");
                var claim = HttpContext.User?.FindFirst("access_token");
                var client = new HttpClient();
                var result = client.GetStringAsync(Constants.Profile + "Address/").Result;

                //var a = HttpContext.Session.GetString("Test");
                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        [HttpGet]
        public JsonResult DeleteAddress(string selectedIds)
        {
            selectedIds = selectedIds.TrimEnd(new char[] { ',' });
            string[] ids = selectedIds.Split(',');

            string url = Constants.APIURL + "MasterApi/Address/DeleteByIds";
            object result = string.Empty;

            using (var client = new WebClient())
            {
                client.Headers[HttpRequestHeader.ContentType] = Constants.ContentType;

                string serialisedData = JsonConvert.SerializeObject(ids);

                var response = client.UploadString(url, serialisedData);

                result = JsonConvert.DeserializeObject(response);
            }

            return Json(result);
        }
    }
}