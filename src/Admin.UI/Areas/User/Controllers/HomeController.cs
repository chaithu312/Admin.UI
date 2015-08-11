using Dapper;
using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using Thinktecture.IdentityModel.Client;

namespace Admin.UI.UserArea
{
    [Area("User")]
    public class HomeController : Controller
    {
        private IDbConnection _db = new SqlConnection("Data Source=192.168.1.241\\sqlexpress;Initial Catalog=identity;user id=sa;password=Aa123456;");
        private IDbConnection _dbM = new SqlConnection("Data Source=192.168.1.241\\sqlexpress;Initial Catalog=Membership;user id=sa;password=Aa123456;");

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
              new Uri("http://192.168.1.241/id/core/connect/token"),
              "20380A36-8777-43F7-A79E-65BDB53F4621",
              "Machine", OAuth2Client.ClientAuthenticationStyle.PostValues);

            var optional = new Dictionary<string, string>
                      {
                          { "acr_values", "tenant:custom_account_store1 foo bar quux" }
                      };

            TokenResponse x = client.RequestResourceOwnerPasswordAsync(user.userName, user.password, "read write", optional).Result;

            if (x.AccessToken != null)
            {
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create("http://localhost:59409/User/List");
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

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(Model.User user)
        {
            //if (ModelState.IsValid)
            //{
            if (user.userName.ToString().Contains("\\") == true)
            {
                string[] strUserDomain = user.userName.Split('\\');
                string strDomainName = strUserDomain[0].ToString();
                string strUserName = strUserDomain[1].ToString();

                string sqlQuery = string.Empty;

                sqlQuery = "DECLARE @ID uniqueidentifier; INSERT INTO[dbo].[Domain]([DomainKey],[RealmId],[Tag],[Name],[Detail],[Created],[Status])VALUES('" + Guid.NewGuid() + "','','','" + strUserDomain[0].ToString() + "','','" + DateTime.Today + "',1); " +
                            "Select @ID = [DomainKey] from Domain where name='" + strUserDomain[0].ToString() + "';" +
                            "SELECT @ID";

                var id = _dbM.Query<string>(sqlQuery);

                string strSalt = Admin.UI.Utility.Cryptography.CreateSalt();
                sqlQuery = "INSERT INTO [dbo].[Login]([DomainKey],[EMail],[EMailToken],[EMailConfirmed],[PasswordHash],[PasswordSalt],[LockoutMax],[LockoutFailCount],[LockoutEnds],[Detail],[Created],[Status]) VALUES('" + Guid.NewGuid() + "','" + user.userName + "','" + Guid.NewGuid() + "','','" + Admin.UI.Utility.Cryptography.CreatePasswordHash(user.password, strSalt) + "','" + strSalt + "',0,0,'01/01/1900',' Security Question : " + user.securityQuestion + " & Security Answer : " + user.securityAnswer + " ','" + DateTime.Today + "','')";
                _db.Query(sqlQuery);
                return View("login");
            }
            //}
            else
            {
                return View();
            }
        }
    }
}