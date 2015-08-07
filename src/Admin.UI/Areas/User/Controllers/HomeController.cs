using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Net;
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
              new Uri("http://192.168.1.241/Id/core"),
              "roclient",
              "secret", OAuth2Client.ClientAuthenticationStyle.PostValues);

            var optional = new Dictionary<string, string>
                      {
                          { "acr_values", "tenant:custom_account_store1 foo bar quux" }
                      };

            TokenResponse x = client.RequestResourceOwnerPasswordAsync(user.userName, user.password, "read write", optional).Result;

            if (x.AccessToken != null)
            {
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create("http://192.168.1.241/adminui/user/List");
                webRequest.Headers.Add("Authorization", "Bearer " + x.AccessToken);

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