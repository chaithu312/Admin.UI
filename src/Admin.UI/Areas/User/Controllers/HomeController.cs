using Admin.UI.Areas.User.Models;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
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
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Constants.strAPIURL + "registration");
                byte[] bytes;
                //bytes = System.Text.Encoding.ASCII.un(requestXml);
                bytes = System.Text.Encoding.UTF8.GetBytes(postData);
                request.ContentType = "application/json";
                request.ContentLength = bytes.Length;
                request.Method = "POST";
                Stream requestStream = request.GetRequestStream();
                requestStream.Write(bytes, 0, bytes.Length);
                requestStream.Close();
                HttpWebResponse response;
                response = (HttpWebResponse)request.GetResponse();

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
            return View();
        }

        [HttpPost]
        public JsonResult Login([FromBody]Login login)
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
                          { "acr_values", String.Format("DomainKey: {0}", login.DomainKey) }
                      };

                TokenResponse x = client.RequestResourceOwnerPasswordAsync(login.UserName, login.Password, Constants.clientScope, optional).Result;

                //TokenResponse y = client.CreateImplicitFlowUrl()

                if (x.AccessToken != null)
                {
                    return Json("Success");
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
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Constants.strAPIURL + "IsUserAvailable?Email=" + userName);
                    request.ContentType = "application/json";
                    request.Method = "GET";
                    using (WebResponse response = request.GetResponse())
                    {
                        Stream responseStream = response.GetResponseStream();
                        string responseString = new StreamReader(responseStream).ReadToEnd();
                        if (responseString.ToString().ToLower().Equals("true") == true)
                            return Json(new { result = false });
                        else
                            return Json(new { result = true });
                    }
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
    }
}