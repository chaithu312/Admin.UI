using Admin.UI.UserArea.Model;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using Thinktecture.IdentityModel.Client;

namespace Admin.UI.UserArea
{
    [Area("User")]
    public class HomeController : Controller
    {
        private const string strAPIURL = "http://192.168.1.241/id/api/Register/";

        public IActionResult Index()
        {
            Register register = new Model.Register();
            //TODO : DomainKey should be dynamic
            register.DomainKey = "B171F61C-8914-4C5D-AF88-C3B776D80916";
            return View(register);
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
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strAPIURL + "registration");
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
            Login login = new Login();
            login.DomainKey = "B171F61C-8914-4C5D-AF88-C3B776D80916";
            return View(login);
        }

        [HttpPost]
        public JsonResult Login([FromBody]Login login)
        {
            if (ModelState.IsValid)
            {
                //TODO : MAKE CLIENT AS DYNAMIC AS PER USER
                var client = new OAuth2Client(
                  new Uri("http://localhost:63319/core/connect/token"),
                  "611AE4FB-0F54-4484-87BF-E28DF7E09CB8",
                  "262148", OAuth2Client.ClientAuthenticationStyle.PostValues);

                var optional = new Dictionary<string, string>
                      {
                          { "acr_values", String.Format("DomainKey: {0}", login.DomainKey) }
                      };

                TokenResponse x = client.RequestResourceOwnerPasswordAsync(login.UserName, login.Password, "read write", optional).Result;

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
    }
}