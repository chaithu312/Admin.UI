using Admin.UI.Areas.Shipment.Models;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net;
using System.Web.Script.Serialization;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Admin.UI.ShipmentArea
{
    [Area("Shipment")]
    public class HomeController : Controller
    {
        public IActionResult Shipping()
        {
            return View();
        }

        public IActionResult VendorSetting()
        {
            return View();
        }

        public IActionResult AWBWithprice()
        {
            return View();
        }

        public IActionResult PickupRequest()
        {
            return View();
        }

        [HttpPost]
        public JsonResult PickupRequest([FromBody]PickupRequest pickupRequest)
        {
            
            if (pickupRequest != null)
            {
                pickupRequest.UserID = "4";//TODO: 
                pickupRequest.AccountID = "2";//TODO:
                pickupRequest.VendorAccountID = "1";//TODO:
                pickupRequest.PickupDate= CarrierSpecificValueConversion.GetDate(pickupRequest.PickupDate, (Carrier)Convert.ToInt16(pickupRequest.Carrier));

            }

            if (pickupRequest.AddressType == "0")
            {
                Admin.UI.Areas.User.Models.Address register = new Admin.UI.Areas.User.Models.Address();

                register.AccountId = 2;
                register.Status = 1;
                register.Created = DateTime.Now;
                register.AddressType = Areas.User.Models.Address.AddressTypes.Recipient;
                register.ShortName = pickupRequest.AddressCaption;
                register.Phone1 = pickupRequest.Phone;
                register.EMail = pickupRequest.PickUpNotificationEmail;
                register.CountryId = pickupRequest.CountryID;
                register.PostalCode = pickupRequest.ZipCode;
                register.Division = pickupRequest.Division;
                register.City = pickupRequest.City;
                register.Address1 = pickupRequest.Address1;
                register.Address2 = pickupRequest.Address2;
                
                string url = Constants.APIURL + "MasterApi/Address/Insert";

                using (var client = new WebClient())
                {
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    string serialisedData = JsonConvert.SerializeObject(register);

                    client.UploadString(url, serialisedData);
                }
            }

            var postData = JsonConvert.SerializeObject(pickupRequest);
            //string strURL = Constants.APIURL+ "DHL/Pickup";
            string strURL= "http://localhost:49201/"+"DHL/Pickup";

            //Constants.ShippingURL + "Endicia/Pickup"
            //Constants.ShippingURL + "UPS/Pickup"
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strURL);
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
            string responseString = string.Empty;
            if (response.StatusCode == HttpStatusCode.OK)
            {
                Stream responseStream = response.GetResponseStream();
                responseString = new StreamReader(responseStream).ReadToEnd();



                JavaScriptSerializer json_serializer = new JavaScriptSerializer();
                var routes_list = json_serializer.DeserializeObject(responseString);
                if (responseString.ToString().ToLower().Equals("true") == true)
                    return Json("Success");
            }

            return Json("Failed");
        }

        public ActionResult ViewPickup()
        { return View(); }


        [HttpGet]
        public JsonResult GetAllPickup()
        {
            string AccountId = "12345";
            string url = Constants.APIURL + "/DHL/accountId";
            
            object result = string.Empty;

            using (var client = new WebClient())
            {
                client.Headers[HttpRequestHeader.ContentType] = "application/json";

                string serialisedData = JsonConvert.SerializeObject(AccountId);

                var response = client.UploadString(url, serialisedData);

                result = JsonConvert.DeserializeObject(response);
            }
            return Json(result);
        }

        public JsonResult DeletePickup(string selectedIds)
        {
            return Json("Deleted Successfully");
        }

        public IActionResult Tracking()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAddressById(long addressType)
        {
            string url = Constants.APIURL + "MasterApi/Address/Id";
            
            object result = string.Empty;

            using (var client = new WebClient())
            {
                client.Headers[HttpRequestHeader.ContentType] = Constants.ContentType;

                string serialisedData = JsonConvert.SerializeObject(addressType);

                var response = client.UploadString(url, serialisedData);

                result = JsonConvert.DeserializeObject(response);
            }
            return Json(result);
        }
    }

    internal struct CarrierSpecificValueConversion
    {
        public static string GetDate(string pickupDate, Carrier carrierType)
        {
            switch (carrierType)
            {
                case Carrier.DHL:
                    pickupDate = DateTime.ParseExact(pickupDate, "dd-MM-yyyy",CultureInfo.InvariantCulture).ToString("yyyy-MM-dd");
                    break;
            }
            return pickupDate;
        }
    }

    public enum Carrier
    {
        DHL = 1,
        Endicia
    }
}
