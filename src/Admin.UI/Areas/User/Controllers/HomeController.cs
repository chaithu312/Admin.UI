using Admin.UI.App;
using Microsoft.AspNet.Mvc;
using Microsoft.Framework.ConfigurationModel;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
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

        public IActionResult List()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(Model.User user)
        {
            //if (ModelState.IsValid)
            //{
            var client = new OAuth2Client(
              new Uri("http://localhost:63319/core/connect/token"),
              "roclient",
              "secret", OAuth2Client.ClientAuthenticationStyle.PostValues);

            // idsrv supports additional non-standard parameters
            // that get passed through to the user service
            var optional = new Dictionary<string, string>
                      {
                          { "acr_values", "tenant:custom_account_store1 foo bar quux" }
                      };

            TokenResponse x = client.RequestResourceOwnerPasswordAsync(user.userName, user.password, "read write", optional).Result;

            if (x.AccessToken != null)
            {
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create("http://localhost:59409/User/Index");
                webRequest.Headers.Add("Authorization", "Bearer " + x.AccessToken);
                //webRequest.Headers.Add("Content-Type", "application/json");
                WebResponse response = webRequest.GetResponse();

                if (((System.Net.HttpWebResponse)response).StatusCode.ToString() == "OK")
                    return Redirect("/User/List");
                else
                {
                    ModelState.AddModelError("", "Unathorized user.");
                    return View(user);
                }
            }
            else
            {
                ModelState.AddModelError("", "Unathorized user.");
                return View(user);
            }
        }
    }
}